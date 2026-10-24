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
 const taskArchiveSql=fs.readFileSync('/opt/geocontrol-project-hub/database/migrations/20261024_task_archive_restore.sql','utf8');
 const [archiveColumn]=await testDb.query("SHOW COLUMNS FROM hub_tasks LIKE 'archived_at'");
 if(!archiveColumn.length){for(const statement of taskArchiveSql.replace(/--[^\n]*/g,'').split(';').map(x=>x.trim()).filter(Boolean))await testDb.query(statement)}
 const technicalSql=fs.readFileSync('/opt/geocontrol-project-hub/database/migrations/20261018_technical_sheets.sql','utf8');
 for(const statement of technicalSql.replace(/--[^\n]*/g,'').split(';').map(x=>x.trim()).filter(x=>x.includes('CREATE TABLE'))){
  const clean=statement.replace(/^--[^\n]*\n/gm,'').trim();await testDb.query(clean);
 }

 const memorySql=fs.readFileSync('/opt/geocontrol-project-hub/database/migrations/20261018_project_memories.sql','utf8');
 for(const statement of memorySql.replace(/--[^\n]*/g,'').split(';').map(x=>x.trim()).filter(x=>x.includes('CREATE TABLE'))){await testDb.query(statement)}
 await testDb.query('CREATE TABLE hub_document_versions (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,document_id BIGINT UNSIGNED NOT NULL,revision INT UNSIGNED NOT NULL,title VARCHAR(255) NOT NULL,body LONGTEXT NOT NULL,archived_at TIMESTAMP NULL DEFAULT NULL,updated_by BIGINT UNSIGNED NULL,created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,UNIQUE KEY uq_document_revision(document_id,revision)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');
 await testDb.query('CREATE TABLE hub_project_guide_versions (id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,guide_id TINYINT UNSIGNED NOT NULL,revision INT UNSIGNED NOT NULL,content MEDIUMTEXT NOT NULL,updated_by BIGINT UNSIGNED NULL,created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,UNIQUE KEY uq_guide_revision(guide_id,revision)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci');
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
 const sheetPath='/api/projects/'+project.insertId+'/technical-sheet';
 const unauthSheet=await api('GET',sheetPath);assert.equal(unauthSheet.status,401);
 const emptySheet=await api('GET',sheetPath,undefined,cookie);assert.equal(emptySheet.status,200);assert.equal(emptySheet.result.sheet,null);
 const viewerSheet=await api('GET',sheetPath,undefined,readerCookie);assert.equal(viewerSheet.status,200);assert.equal(viewerSheet.result.canEdit,false);
 const viewerWrite=await api('PUT',sheetPath,{expectedRevision:0,content:'Not allowed'},readerCookie);assert.equal(viewerWrite.status,403);
 const missingSheetProject=await api('GET','/api/projects/99999999/technical-sheet',undefined,cookie);assert.equal(missingSheetProject.status,404);
 const noOrigin=await fetch(base+sheetPath,{method:'PUT',headers:{'Content-Type':'application/json','Cookie':cookie},body:JSON.stringify({expectedRevision:0,content:'Forbidden'})});assert.equal(noOrigin.status,403);
 const forgedOrigin=await fetch(base+sheetPath,{method:'PUT',headers:{'Content-Type':'application/json','Cookie':cookie,'Origin':'https://evil.example.invalid'},body:JSON.stringify({expectedRevision:0,content:'Forbidden'})});assert.equal(forgedOrigin.status,403);
 const invalidExpected=await api('PUT',sheetPath,{expectedRevision:-1,content:'Invalid'},cookie);assert.equal(invalidExpected.status,400);
 const hugeSheet=await api('PUT',sheetPath,{expectedRevision:0,content:'x'.repeat(1000001)},cookie);assert.equal(hugeSheet.status,400);
 const invalidProject=await api('PUT','/api/projects/not-a-number/technical-sheet',{expectedRevision:0,content:'Invalid'},cookie);assert.equal(invalidProject.status,400);
 const invalidJson=await fetch(base+sheetPath,{method:'PUT',headers:{'Content-Type':'application/json','Cookie':cookie,'Origin':base},body:'not-json'});assert.equal(invalidJson.status,400);
 const initialSheet=await api('PUT',sheetPath,{expectedRevision:0,content:'Technical v1'},cookie);assert.equal(initialSheet.status,200,JSON.stringify(initialSheet.result));assert.equal(initialSheet.result.revision,1);
 const updatedSheet=await api('PUT',sheetPath,{expectedRevision:1,content:'Technical v2'},cookie);assert.equal(updatedSheet.status,200);assert.equal(updatedSheet.result.revision,2);
 const staleSheet=await api('PUT',sheetPath,{expectedRevision:1,content:'Stale'},cookie);assert.equal(staleSheet.status,409);
 const invalidRestore=await api('POST',sheetPath,{revision:0,expectedRevision:2},cookie);assert.equal(invalidRestore.status,400);
 const absentRestore=await api('POST',sheetPath,{revision:999,expectedRevision:2},cookie);assert.equal(absentRestore.status,404);
 const restoreNoOrigin=await fetch(base+sheetPath,{method:'POST',headers:{'Content-Type':'application/json','Cookie':cookie},body:JSON.stringify({revision:1,expectedRevision:2})});assert.equal(restoreNoOrigin.status,403);

 const sheetHistory=await api('GET',sheetPath,undefined,readerCookie);assert.equal(sheetHistory.status,200);assert.equal(sheetHistory.result.versions.length,2);assert.equal(sheetHistory.result.sheet.content,'Technical v2');
 const historicalSheet=await api('GET',sheetPath+'?revision=1',undefined,readerCookie);assert.equal(historicalSheet.status,200);assert.equal(historicalSheet.result.version.content,'Technical v1');
 const invalidSheetRevision=await api('GET',sheetPath+'?revision=oops',undefined,cookie);assert.equal(invalidSheetRevision.status,400);
 const missingSheetRevision=await api('GET',sheetPath+'?revision=9999',undefined,cookie);assert.equal(missingSheetRevision.status,404);
 const viewerRestore=await api('POST',sheetPath,{revision:1,expectedRevision:2},readerCookie);assert.equal(viewerRestore.status,403);
 const staleSheetRestore=await api('POST',sheetPath,{revision:1,expectedRevision:1},cookie);assert.equal(staleSheetRestore.status,409);
 const restoredSheet=await api('POST',sheetPath,{revision:1,expectedRevision:2},cookie);assert.equal(restoredSheet.status,200);assert.equal(restoredSheet.result.revision,3);
 const sheetAfterRestore=await api('GET',sheetPath,undefined,cookie);assert.equal(sheetAfterRestore.result.sheet.content,'Technical v1');assert.equal(sheetAfterRestore.result.versions.length,3);
 const preservedSheet=await api('GET',sheetPath+'?revision=2',undefined,cookie);assert.equal(preservedSheet.result.version.content,'Technical v2');
 const [secondProject]=await testDb.execute("INSERT INTO hub_projects(slug,title,status) VALUES(?,?,'planning')",['memory-'+randomUUID(),'Second isolated project']);
 const memoryPath='/api/projects/'+project.insertId+'/memory',otherMemoryPath='/api/projects/'+secondProject.insertId+'/memory';
 assert.equal((await api('GET',memoryPath)).status,401);
 assert.equal((await api('GET',memoryPath,undefined,cookie)).result.memory,null);
 assert.equal((await api('GET',otherMemoryPath,undefined,cookie)).result.memory,null);
 assert.equal((await api('GET',memoryPath,undefined,readerCookie)).result.canEdit,false);
 assert.equal((await api('PUT',memoryPath,{expectedRevision:0,content:'denied'},readerCookie)).status,403);
 assert.equal((await api('PUT',memoryPath,{expectedRevision:-1,content:'invalid'},cookie)).status,400);
 assert.equal((await api('PUT',memoryPath,{expectedRevision:0,content:'x'.repeat(1000001)},cookie)).status,400);
 assert.equal((await api('GET',memoryPath+'?revision=0',undefined,cookie)).status,400);
 assert.equal((await api('GET','/api/projects/999999999/memory',undefined,cookie)).status,404);
 const memoryNoOrigin=await fetch(base+memoryPath,{method:'PUT',headers:{'Content-Type':'application/json','Cookie':cookie},body:JSON.stringify({expectedRevision:0,content:'denied'})});assert.equal(memoryNoOrigin.status,403);
 const memory1=await api('PUT',memoryPath,{expectedRevision:0,content:'Project A v1'},cookie);assert.equal(memory1.status,200,JSON.stringify(memory1.result));
 const other1=await api('PUT',otherMemoryPath,{expectedRevision:0,content:'Project B private'},cookie);assert.equal(other1.status,200,JSON.stringify(other1.result));
 const memory2=await api('PUT',memoryPath,{expectedRevision:1,content:'Project A v2'},cookie);assert.equal(memory2.status,200);
 assert.equal((await api('PUT',memoryPath,{expectedRevision:1,content:'stale'},cookie)).status,409);
 const a=await api('GET',memoryPath,undefined,cookie),b=await api('GET',otherMemoryPath,undefined,cookie);
 assert.equal(a.result.memory.content,'Project A v2');assert.equal(a.result.versions.length,2);
 assert.equal(b.result.memory.content,'Project B private');assert.equal(b.result.versions.length,1);
 assert.equal((await api('GET',otherMemoryPath+'?revision=2',undefined,cookie)).status,404);
 assert.equal((await api('GET',memoryPath+'?revision=1',undefined,readerCookie)).result.version.content,'Project A v1');
 assert.equal((await api('POST',memoryPath,{revision:1,expectedRevision:2},readerCookie)).status,403);
 assert.equal((await api('POST',memoryPath,{revision:1,expectedRevision:1},cookie)).status,409);
 assert.equal((await api('POST',memoryPath,{revision:999,expectedRevision:2},cookie)).status,404);
 const memoryRestored=await api('POST',memoryPath,{revision:1,expectedRevision:2},cookie);assert.equal(memoryRestored.status,200);assert.equal(memoryRestored.result.revision,3);
 assert.equal((await api('GET',memoryPath,undefined,cookie)).result.memory.content,'Project A v1');
 assert.equal((await api('GET',memoryPath+'?revision=2',undefined,cookie)).result.version.content,'Project A v2');
 assert.equal((await api('GET',otherMemoryPath,undefined,cookie)).result.memory.content,'Project B private');
 console.log('PASS: project memory isolation A/B, owner/viewer, CSRF, conflicts, history, non-destructive restore');
 console.log('PASS: technical sheet create/edit/409/history/restore, viewer read-only, CSRF, invalid payload, content size, old revision preserved');
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
