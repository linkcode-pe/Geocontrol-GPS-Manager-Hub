import {strict as assert} from 'node:assert';
const base=process.env.HUB_E2E_URL;
const cookie=process.env.HUB_E2E_COOKIE;
const projectId=Number(process.env.HUB_E2E_TEST_PROJECT_ID);
if(!base||!cookie||!Number.isSafeInteger(projectId)||projectId<1)throw Error('Set HUB_E2E_URL, HUB_E2E_COOKIE and HUB_E2E_TEST_PROJECT_ID');
const origin=new URL(base);
if(origin.protocol!=='http:'||!['127.0.0.1','localhost'].includes(origin.hostname))throw Error('Refusing mutations outside isolated localhost environment');
const marker='hub-e2e-'+crypto.randomUUID();
const headers={'Content-Type':'application/json','Origin':origin.origin,'Cookie':cookie};
async function request(method,path,body){const r=await fetch(new URL(path,origin),{method,headers,...body?{body:JSON.stringify(body)}:{}});const json=await r.json();if(!r.ok)throw Error(method+' '+path+' HTTP '+r.status+' '+JSON.stringify(json));return json;}
const projects=(await request('GET','/api/projects')).projects;
assert(projects.some(p=>p.id===projectId),'Dedicated test project does not exist');
let taskId;
try{
 const created=await request('POST','/api/tasks',{projectId,title:marker,priority:'low'});
 taskId=created.result.insertId;
 assert(Number.isSafeInteger(taskId)&&taskId>0);
 let found=(await request('GET',`/api/tasks?projectId=${projectId}&limit=100`)).tasks.find(t=>t.id===taskId);
 assert.equal(found?.title,marker,'Created task not readable');
 await request('PATCH',`/api/tasks/${taskId}`,{title:marker+'-edited',status:'in_progress'});
 found=(await request('GET',`/api/tasks?projectId=${projectId}&limit=100`)).tasks.find(t=>t.id===taskId);
 assert.equal(found?.title,marker+'-edited','Updated title not readable');
 assert.equal(found?.status,'in_progress','Updated status not readable');
 console.log('Authenticated task create/update/read verified on isolated localhost');
}finally{
 if(taskId)console.log('Test task left for controlled manual cleanup; id:',taskId,'project:',projectId);
}
