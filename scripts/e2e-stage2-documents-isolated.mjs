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
const tables=['hub_users','hub_projects','hub_phases','hub_tasks','hub_documents','hub_audit_log','hub_login_attempts','hub_project_guide'];
let server;let created=false;
const base='http://localhost:3199';
async function api(method,path,body,cookie){
 const response=await fetch(base+path,{method,headers:{'Content-Type':'application/json','Origin':base,...cookie?{'Cookie':cookie}:{}},...body?{body:JSON.stringify(body)}:{}});
 const result=await response.json();return {status:response.status,result,headers:response.headers};
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
 await testDb.query('ALTER TABLE hub_documents ADD COLUMN revision INT UNSIGNED NOT NULL DEFAULT 1, ADD COLUMN archived_at TIMESTAMP NULL DEFAULT NULL, ADD COLUMN archived_by BIGINT UNSIGNED NULL');
 await testDb.query('CREATE TABLE hub_document_versions (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,document_id BIGINT UNSIGNED NOT NULL,revision INT UNSIGNED NOT NULL,title VARCHAR(255) NOT NULL,body LONGTEXT NOT NULL,archived_at TIMESTAMP NULL DEFAULT NULL,updated_by BIGINT UNSIGNED NULL,created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,UNIQUE KEY uq_document_revision(document_id,revision)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');
 await testDb.query('CREATE TABLE hub_project_guide_versions (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,guide_id TINYINT UNSIGNED NOT NULL,revision INT UNSIGNED NOT NULL,content MEDIUMTEXT NOT NULL,updated_by BIGINT UNSIGNED NULL,created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,UNIQUE KEY uq_guide_revision(guide_id,revision)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');
 const email='stage1-'+randomUUID()+'@example.invalid';
 const password=randomBytes(24).toString('hex');
 const hash=await bcrypt.hash(password,10);
 const [user]=await testDb.execute("INSERT INTO hub_users(email,password_hash,display_name,role,active) VALUES(?,?,?,'owner',1)",[email,hash,'Isolated E2E']);
 const [project]=await testDb.execute("INSERT INTO hub_projects(slug,title,status) VALUES(?,?,'planning')",['stage1-'+randomUUID(),'Isolated test project']);
 await testDb.execute("INSERT INTO hub_project_guide(id,content,revision) VALUES(1,?,1)",['Isolated guide test content with sufficient length.']);
 const secret=randomBytes(48).toString('hex');
 server=spawn('./node_modules/.bin/next',['dev','--hostname','127.0.0.1','--port','3199'],{cwd:'/opt/geocontrol-hub-stage1-check',env:{...process.env,NODE_ENV:'development',DB_HOST:env.DB_HOST||'127.0.0.1',DB_USER:testUser,DB_PASSWORD:testPassword,DB_NAME:schema,AUTH_SECRET:secret},stdio:['ignore','pipe','pipe']});
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
 const unauthPage=await fetch(base+'/documentos',{redirect:'manual'});assert([302,303,307,308].includes(unauthPage.status),'Unauthenticated document page must redirect');
 const pageResponse=await fetch(base+'/documentos',{headers:{Cookie:cookie}});
 assert.equal(pageResponse.status,200,'Authenticated document page must render');
 assert((await pageResponse.text()).includes('Documentos por proyecto'),'Document page heading missing');
 const readerEmail='reader-'+randomUUID()+'@example.invalid';
 const readerPassword=randomBytes(24).toString('hex');
 await testDb.execute("INSERT INTO hub_users(email,password_hash,display_name,role,active) VALUES(?,?,?,'viewer',1)",[readerEmail,await bcrypt.hash(readerPassword,10),'Reader']);
 const readerLogin=await api('POST','/api/auth/login',{email:readerEmail,password:readerPassword});assert.equal(readerLogin.status,200);
 const readerCookie=readerLogin.headers.get('set-cookie')?.split(';')[0];
 const readerList=await api('GET','/api/documents?projectId='+project.insertId,undefined,readerCookie);assert.equal(readerList.status,200);assert.equal(readerList.result.canEdit,false);
 const ownerList=await api('GET','/api/documents?projectId='+project.insertId,undefined,cookie);assert.equal(ownerList.result.canEdit,true);
 const deniedCreate=await api('POST','/api/documents',{projectId:project.insertId,title:'Denied',content:'No'},readerCookie);assert.equal(deniedCreate.status,403);
 console.log('PASS: authenticated documents page, anonymous redirect, reader role read-only, owner editable');
 const marker='isolated-'+randomUUID();
 const creation=await api('POST','/api/tasks',{projectId:project.insertId,title:marker,priority:'low'},cookie);assert.equal(creation.status,201,JSON.stringify(creation.result));
 const taskId=creation.result.result.insertId;assert(taskId>0);
 const list=await api('GET','/api/tasks?projectId='+project.insertId+'&limit=100',undefined,cookie);assert.equal(list.status,200);assert(list.result.tasks.some(t=>t.id===taskId&&t.title===marker));
 const update=await api('PATCH','/api/tasks/'+taskId,{title:marker+'-edited',status:'in_progress'},cookie);assert.equal(update.status,200,JSON.stringify(update.result));
 const reread=await api('GET','/api/tasks?projectId='+project.insertId+'&limit=100',undefined,cookie);assert.equal(reread.status,200);assert(reread.result.tasks.some(t=>t.id===taskId&&t.title===marker+'-edited'&&t.status==='in_progress'));
 const guide=await api('GET','/api/project-guide',undefined,cookie);assert.equal(guide.status,200);
 const saved=await api('PUT','/api/project-guide',{content:'Isolated guide saved and read successfully '+marker,revision:guide.result.revision},cookie);assert.equal(saved.status,200,JSON.stringify(saved.result));
 const guideRead=await api('GET','/api/project-guide',undefined,cookie);assert.equal(guideRead.result.revision,saved.result.revision);assert(guideRead.result.content.includes(marker));
 const history=await api('GET','/api/project-guide/versions',undefined,cookie);assert.equal(history.status,200);assert(history.result.versions.some(v=>v.revision===1)&&history.result.versions.some(v=>v.revision===2));
 const v1=await api('GET','/api/project-guide/versions?revision=1',undefined,cookie);assert.equal(v1.status,200);assert(v1.result.version.content.includes('Isolated guide test content'));
 const conflict=await api('POST','/api/project-guide/versions',{revision:1,expectedRevision:1},cookie);assert.equal(conflict.status,409);
 const restored=await api('POST','/api/project-guide/versions',{revision:1,expectedRevision:2},cookie);assert.equal(restored.status,200,JSON.stringify(restored.result));assert.equal(restored.result.revision,3);
 const restoredRead=await api('GET','/api/project-guide',undefined,cookie);assert.equal(restoredRead.result.revision,3);assert.equal(restoredRead.result.content,'Isolated guide test content with sufficient length.');
 const v2=await api('GET','/api/project-guide/versions?revision=2',undefined,cookie);assert.equal(v2.status,200);assert(v2.result.version.content.includes(marker),'Newer content must remain recoverable');
 const v3=await api('GET','/api/project-guide/versions?revision=3',undefined,cookie);assert.equal(v3.status,200);assert.equal(v3.result.version.content,restoredRead.result.content);
 const createdDoc=await api('POST','/api/documents',{projectId:project.insertId,title:'Initial document',content:'First content'},cookie);assert.equal(createdDoc.status,201,JSON.stringify(createdDoc.result));const docId=createdDoc.result.id;
 const docList=await api('GET','/api/documents?projectId='+project.insertId,undefined,cookie);assert.equal(docList.status,200);assert(docList.result.documents.some(d=>d.id===docId&&d.revision===1));
 const deniedUpdate=await api('PATCH','/api/documents/'+docId,{action:'update',revision:1,title:'Viewer cannot edit',content:'Denied'},readerCookie);assert.equal(deniedUpdate.status,403);
 const deniedArchive=await api('PATCH','/api/documents/'+docId,{action:'archive',revision:1},readerCookie);assert.equal(deniedArchive.status,403);
 const deniedRestore=await api('POST','/api/documents/'+docId+'/versions',{revision:1,expectedRevision:1},readerCookie);assert.equal(deniedRestore.status,403);
 const readerHistory=await api('GET','/api/documents/'+docId+'/versions',undefined,readerCookie);assert.equal(readerHistory.status,200);assert(readerHistory.result.versions.some(v=>v.revision===1));
 const invalidRevision=await api('GET','/api/documents/'+docId+'/versions?revision=not-a-number',undefined,cookie);assert.equal(invalidRevision.status,400);
 const missingVersion=await api('GET','/api/documents/'+docId+'/versions?revision=99999',undefined,cookie);assert.equal(missingVersion.status,404);
 const missingDocument=await api('GET','/api/documents/99999999/versions',undefined,cookie);assert.equal(missingDocument.status,404);
 const changedDoc=await api('PATCH','/api/documents/'+docId,{action:'update',revision:1,title:'Updated document',content:'Second content'},cookie);assert.equal(changedDoc.status,200,JSON.stringify(changedDoc.result));
 const staleDoc=await api('PATCH','/api/documents/'+docId,{action:'update',revision:1,title:'Stale',content:'Stale'},cookie);assert.equal(staleDoc.status,409);
 const archivedDoc=await api('PATCH','/api/documents/'+docId,{action:'archive',revision:2},cookie);assert.equal(archivedDoc.status,200,JSON.stringify(archivedDoc.result));
 const hiddenDoc=await api('GET','/api/documents?projectId='+project.insertId,undefined,cookie);assert(!hiddenDoc.result.documents.some(d=>d.id===docId));
 const listedArchived=await api('GET','/api/documents?projectId='+project.insertId+'&archived=1',undefined,cookie);assert(listedArchived.result.documents.some(d=>d.id===docId&&d.revision===3&&d.archived_at));
 const unarchivedDoc=await api('PATCH','/api/documents/'+docId,{action:'unarchive',revision:3},cookie);assert.equal(unarchivedDoc.status,200,JSON.stringify(unarchivedDoc.result));
 const docHistory=await api('GET','/api/documents/'+docId+'/versions',undefined,cookie);assert.equal(docHistory.status,200);assert.deepEqual(docHistory.result.versions.map(v=>v.revision),[4,3,2,1]);
 const docRestore=await api('POST','/api/documents/'+docId+'/versions',{revision:1,expectedRevision:4},cookie);assert.equal(docRestore.status,200,JSON.stringify(docRestore.result));
 const docAfterRestore=await api('GET','/api/documents?projectId='+project.insertId,undefined,cookie);assert(docAfterRestore.result.documents.some(d=>d.id===docId&&d.revision===5&&d.body==='First content'));
 const docVersion2=await api('GET','/api/documents/'+docId+'/versions?revision=2',undefined,cookie);assert.equal(docVersion2.status,200);assert.equal(docVersion2.result.version.body,'Second content');
 const [audit]=await testDb.execute("SELECT COUNT(*) AS n FROM hub_audit_log WHERE entity_type IN ('task','project_guide')");assert(audit[0].n>=4);
 console.log('PASS: documents create/update/archive/unarchive/restore/history; version history, conflict 409, non-destructive restore; unauthenticated 401, login, authenticated create/read/update/reread, guide save/reread, audit',audit[0].n);
}finally{
 if(server){server.kill('SIGTERM');await new Promise(resolve=>setTimeout(resolve,1500));if(server.exitCode===null)server.kill('SIGKILL');}
 if(testDb)await testDb.end();
 if(created){assert.match(schema,/^hub_restore_check_[a-f0-9]{12}$/);adminSql('DROP DATABASE IF EXISTS `'+schema+'`');console.log('Disposable schema cleaned');}
 adminSql("DROP USER IF EXISTS '"+testUser+"'@'localhost'");
 await db.end();
}
