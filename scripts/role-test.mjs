import {randomBytes,createHash} from 'node:crypto';
import {spawn,execFileSync} from 'node:child_process';
import {setTimeout as sleep} from 'node:timers/promises';
import {readFileSync} from 'node:fs';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import {SignJWT} from 'jose';
const schema='hub_test_'+randomBytes(5).toString('hex');
const secret=randomBytes(48).toString('hex');
const base='http://127.0.0.1:3199';
const conn=await mysql.createConnection({host:process.env.DB_HOST||'127.0.0.1',user:process.env.DB_USER,password:process.env.DB_PASSWORD,multipleStatements:true});
let server;
try {
 execFileSync('mysql',['-e',`CREATE DATABASE \`${schema}\`; GRANT ALL PRIVILEGES ON \`${schema}\`.* TO '${process.env.DB_USER}'@'localhost'`]);
 await conn.query('USE `'+schema+'`');
 await conn.query(readFileSync('database/schema.sql','utf8'));
 const hash=await bcrypt.hash('Temporary-Test-Password',10);
 for(const role of ['owner','admin','editor','viewer']){
  await conn.execute('INSERT INTO hub_users(email,password_hash,display_name,role) VALUES(?,?,?,?)',[role+'@test.invalid',hash,role,role]);
 }
 server=spawn('node',['node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p','3199'],{env:{...process.env,DB_NAME:schema,AUTH_SECRET:secret},stdio:'ignore'});
 let ready=false;
 for(let i=0;i<60;i++){
  await sleep(250);
  try{if((await fetch(base+'/login')).ok){ready=true;break;}}catch{}
 }
 if(!ready)throw Error('Isolated server unavailable');
 const [users]=await conn.query('SELECT id,role FROM hub_users');
 const version=createHash('sha256').update(hash).digest('hex').slice(0,32);
 const request=(method,path,headers,body)=>fetch(base+path,{method,headers,...(body===undefined?{}:{body:JSON.stringify(body)})});
 const expect=async(res,status,label)=>{if(res.status!==status)throw Error(label+': expected '+status+', got '+res.status+' '+await res.text());};
 for(const user of users){
  const token=await new SignJWT({role:user.role,email:user.role+'@test.invalid',version}).setProtectedHeader({alg:'HS256'}).setSubject(String(user.id)).setIssuedAt().setExpirationTime('10m').sign(new TextEncoder().encode(secret));
  const headers={Cookie:'geocontrol_hub_session='+token,Origin:'https://hub.geocontrol.online','Content-Type':'application/json'};
  const project=await request('POST','/api/projects',headers,{title:'Role test'});
  await expect(project,user.role==='viewer'?403:201,user.role+' project creation');
  if(user.role==='viewer'){
   await expect(await request('POST','/api/tasks',headers,{projectId:1,title:'Denied'}),403,'viewer task create');
   await expect(await request('PATCH','/api/projects/1',headers,{title:'Denied'}),403,'viewer project edit');
   await expect(await request('DELETE','/api/tasks/1',headers),403,'viewer task delete');
   console.log('viewer: modifications rejected');
   continue;
  }
  const id=(await project.json()).id;
  await expect(await request('PATCH','/api/projects/'+id,headers,{status:'active'}),200,user.role+' project edit');
  const phase=await request('POST','/api/phases',headers,{projectId:id,title:'Phase'});
  await expect(phase,201,user.role+' phase create');
  const phaseId=(await phase.json()).id;
  await expect(await request('PATCH','/api/phases/'+phaseId,headers,{status:'active'}),200,user.role+' phase edit');
  const task=await request('POST','/api/tasks',headers,{projectId:id,title:'Task',phaseId});
  await expect(task,201,user.role+' task create');
  const [rows]=await conn.query('SELECT id FROM hub_tasks WHERE project_id=?',[id]);
  const taskId=rows[0].id;
  await expect(await request('PATCH','/api/tasks/'+taskId,headers,{status:'blocked',priority:'urgent',dueDate:'2026-12-15'}),200,user.role+' task edit');
  await expect(await request('PATCH','/api/tasks/'+taskId,headers,{status:'invalid'}),400,user.role+' invalid status');
  await expect(await request('PATCH','/api/tasks/'+taskId,headers,{priority:'invalid'}),400,user.role+' invalid priority');
  await expect(await request('PATCH','/api/tasks/'+taskId,headers,{dueDate:'2026-02-30'}),400,user.role+' invalid date');
  const [planned]=await conn.query('SELECT priority,DATE_FORMAT(due_date,\"%Y-%m-%d\") AS dueDate FROM hub_tasks WHERE id=?',[taskId]);
  if(planned[0].priority!=='urgent'||planned[0].dueDate!=='2026-12-15')throw Error('Task planning fields not persisted');
  await expect(await request('DELETE','/api/phases/'+phaseId,headers),409,user.role+' phase with task');
  await expect(await request('DELETE','/api/tasks/'+taskId,headers),200,user.role+' task delete');
  await expect(await request('DELETE','/api/phases/'+phaseId,headers),200,user.role+' phase delete');
  console.log(user.role+': create, update, delete OK');
 }
 console.log('ISOLATED ROLE TESTS PASSED');
} finally {
 if(server){server.kill('SIGTERM');await sleep(500);}
 execFileSync('mysql',['-e','DROP DATABASE IF EXISTS `'+schema+'`']);
 await conn.end();
}
