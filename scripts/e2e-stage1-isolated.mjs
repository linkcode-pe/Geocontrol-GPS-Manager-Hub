import fs from 'node:fs';
import {randomBytes,randomUUID} from 'node:crypto';
import {spawn} from 'node:child_process';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';

const source='/opt/geocontrol-project-hub/.env.production';
const env={};
for(const line of fs.readFileSync(source,'utf8').split('\n')){
 const i=line.indexOf('=');if(i<0||line.trimStart().startsWith('#'))continue;
 env[line.slice(0,i).trim()]=line.slice(i+1).trim().replace(/^["']|["']$/g,'');
}
assert.equal(env.DB_NAME,'geocontrol_hub','Only Hub database is permitted as source');
const schema='hub_restore_check_'+randomBytes(6).toString('hex');
assert.match(schema,/^hub_restore_check_[a-f0-9]{12}$/);
const testUser='hub_stage1_'+randomBytes(5).toString('hex');
const testPassword=randomBytes(30).toString('hex');
const adminSql=(sql)=>execFileSync('mysql',['-e',sql],{stdio:['ignore','pipe','pipe']});
const db=await mysql.createConnection({host:env.DB_HOST||'127.0.0.1',user:env.DB_USER,password:env.DB_PASSWORD,multipleStatements:false});
let testDb;
const tables=['hub_users','hub_projects','hub_phases','hub_tasks','hub_documents','hub_audit_log','hub_login_attempts','hub_project_guide','hub_project_guide_versions'];
let server;let created=false;
const base='http://localhost:3199';
async function api(method,path,body,cookie){
 const response=await fetch(base+path,{method,headers:{'Content-Type':'application/json','Origin':base,...cookie?{'Cookie':cookie}:{}},...body?{body:JSON.stringify(body)}:{}});
 const raw=await response.text();let result;try{result=JSON.parse(raw)}catch{throw Error(method+' '+path+' returned HTTP '+response.status+' with non-JSON body: '+raw.slice(0,500))}return {status:response.status,result,headers:response.headers};
}
try{
 adminSql('CREATE DATABASE `'+schema+'` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');created=true;
 adminSql("CREATE USER '"+testUser+"'@'localhost' IDENTIFIED BY '"+testPassword+"'");
 adminSql("GRANT ALL PRIVILEGES ON `"+schema+"`.* TO '"+testUser+"'@'localhost'");
 testDb=await mysql.createConnection({host:'127.0.0.1',user:testUser,password:testPassword,database:schema});
 await testDb.query('SET FOREIGN_KEY_CHECKS=0');
 for(const table of tables){
  const [rows]=await db.query('SHOW CREATE TABLE `geocontrol_hub`.`'+table+'`');
   
  await testDb.query(rows[0]['Create Table']);
 }
 await testDb.query('SET FOREIGN_KEY_CHECKS=1');
 const taskArchiveSql=fs.readFileSync('/opt/geocontrol-project-hub/database/migrations/20261024_task_archive_restore.sql','utf8');
 const [archiveColumn]=await testDb.query("SHOW COLUMNS FROM hub_tasks LIKE 'archived_at'");
 if(!archiveColumn.length){for(const statement of taskArchiveSql.replace(/--[^\n]*/g,'').split(';').map(x=>x.trim()).filter(Boolean))await testDb.query(statement)}
 const email='stage1-'+randomUUID()+'@example.invalid';
 const password=randomBytes(24).toString('hex');
 const hash=await bcrypt.hash(password,10);
 const [user]=await testDb.execute("INSERT INTO hub_users(email,password_hash,display_name,role,active) VALUES(?,?,?,'owner',1)",[email,hash,'Isolated E2E']);
 const [project]=await testDb.execute("INSERT INTO hub_projects(slug,title,status) VALUES(?,?,'planning')",['stage1-'+randomUUID(),'Isolated test project']);
 await testDb.execute("INSERT INTO hub_project_guide(id,content,revision) VALUES(1,?,1)",['Isolated guide test content with sufficient length.']);
 const secret=randomBytes(48).toString('hex');
 server=spawn('./node_modules/.bin/next',['dev','--hostname','127.0.0.1','--port','3199'],{cwd:process.env.HUB_E2E_APP_DIR||'/opt/geocontrol-hub-stage1-check',env:{...process.env,NODE_ENV:'development',DB_HOST:env.DB_HOST||'127.0.0.1',DB_USER:testUser,DB_PASSWORD:testPassword,DB_NAME:schema,AUTH_SECRET:secret},stdio:['ignore','pipe','pipe']});
 let output='';server.stdout.on('data',x=>{output+=x.toString().slice(0,500)});server.stderr.on('data',x=>{output+=x.toString().slice(0,500)});
 let ready=false;
 for(let i=0;i<90;i++){
  if(server.exitCode!==null)throw Error('Isolated server exited: '+output.slice(-1000));
  try{const response=await fetch(base+'/login');if(response.ok){ready=true;break;}}catch{}
  await new Promise(resolve=>setTimeout(resolve,1000));
 }
 assert(ready,'Isolated localhost server failed to start: '+output.slice(-1000));
 const unauth=await api('GET','/api/projects');assert.equal(unauth.status,401);
 const login=await api('POST','/api/auth/login',{email,password});assert.equal(login.status,200,JSON.stringify(login.result));
 const cookie=login.headers.get('set-cookie')?.split(';')[0];assert(cookie?.startsWith('geocontrol_hub_session='));
 const projects=await api('GET','/api/projects',undefined,cookie);assert.equal(projects.status,200);assert(projects.result.projects.some(p=>p.id===project.insertId));
 const marker='isolated-'+randomUUID();
 const creation=await api('POST','/api/tasks',{projectId:project.insertId,title:marker,priority:'low'},cookie);assert.equal(creation.status,201,JSON.stringify(creation.result));
 const taskId=creation.result.result.insertId;assert(taskId>0);
 const list=await api('GET','/api/tasks?projectId='+project.insertId+'&limit=100',undefined,cookie);assert.equal(list.status,200);assert(list.result.tasks.some(t=>t.id===taskId&&t.title===marker));
 const update=await api('PATCH','/api/tasks/'+taskId,{title:marker+'-edited',status:'in_progress'},cookie);assert.equal(update.status,200,JSON.stringify(update.result));
 const reread=await api('GET','/api/tasks?projectId='+project.insertId+'&limit=100',undefined,cookie);assert.equal(reread.status,200);assert(reread.result.tasks.some(t=>t.id===taskId&&t.title===marker+'-edited'&&t.status==='in_progress'));
 const dependent=await api('POST','/api/tasks',{projectId:project.insertId,title:marker+'-dependent'},cookie);assert.equal(dependent.status,201);
 const dependentId=dependent.result.result.insertId;
 assert.equal((await api('PATCH','/api/tasks/'+dependentId,{dependsOnTaskId:taskId},cookie)).status,200);
 assert.equal((await api('DELETE','/api/tasks/'+taskId,undefined,cookie)).status,409,'A task with dependents must not be archived');
 assert.equal((await api('PATCH','/api/tasks/'+dependentId,{dependsOnTaskId:null},cookie)).status,200);
 const archived=await api('DELETE','/api/tasks/'+taskId,undefined,cookie);assert.equal(archived.status,200,JSON.stringify(archived.result));
 const activeAfterArchive=await api('GET','/api/tasks?projectId='+project.insertId+'&limit=100',undefined,cookie);assert.equal(activeAfterArchive.status,200);assert(!activeAfterArchive.result.tasks.some(t=>t.id===taskId));
 const archiveList=await api('GET','/api/tasks?projectId='+project.insertId+'&archived=1&limit=100',undefined,cookie);assert.equal(archiveList.status,200);assert.equal(archiveList.result.canRestore,true);assert(archiveList.result.tasks.some(t=>t.id===taskId&&t.archived_at));
 const restoredTask=await api('PATCH','/api/tasks/'+taskId,{action:'restore'},cookie);assert.equal(restoredTask.status,200,JSON.stringify(restoredTask.result));
 const activeAfterRestore=await api('GET','/api/tasks?projectId='+project.insertId+'&limit=100',undefined,cookie);assert(activeAfterRestore.result.tasks.some(t=>t.id===taskId&&t.title===marker+'-edited'));
 const archiveAfterRestore=await api('GET','/api/tasks?projectId='+project.insertId+'&archived=1&limit=100',undefined,cookie);assert(!archiveAfterRestore.result.tasks.some(t=>t.id===taskId));
 const guide=await api('GET','/api/project-guide',undefined,cookie);assert.equal(guide.status,200);
 const saved=await api('PUT','/api/project-guide',{content:'Isolated guide saved and read successfully '+marker,revision:guide.result.revision},cookie);assert.equal(saved.status,200,JSON.stringify(saved.result));
 const guideRead=await api('GET','/api/project-guide',undefined,cookie);assert.equal(guideRead.result.revision,saved.result.revision);assert(guideRead.result.content.includes(marker));
 const [audit]=await testDb.execute("SELECT COUNT(*) AS n FROM hub_audit_log WHERE entity_type IN ('task','project_guide')");assert(audit[0].n>=3);
 console.log('PASS: auth, task create/update, dependency guard, archive/list/restore, guide save/reread and audit',audit[0].n);
}finally{
 if(server){server.kill('SIGTERM');await new Promise(resolve=>setTimeout(resolve,1500));if(server.exitCode===null)server.kill('SIGKILL');}
 if(testDb)await testDb.end();
 if(created){assert.match(schema,/^hub_restore_check_[a-f0-9]{12}$/);adminSql('DROP DATABASE IF EXISTS `'+schema+'`');console.log('Disposable schema cleaned');}
 adminSql("DROP USER IF EXISTS '"+testUser+"'@'localhost'");
 await db.end();
}
