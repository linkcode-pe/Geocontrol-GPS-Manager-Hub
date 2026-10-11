import {test} from 'node:test';
import assert from 'node:assert/strict';

const base=process.env.HUB_SMOKE_URL;
const json={'Content-Type':'application/json'};
const cases=[
 ['GET','/api/projects'],
 ['POST','/api/projects'],
 ['PATCH','/api/projects/1'],
 ['GET','/api/phases?projectId=1'],
 ['POST','/api/phases'],
 ['PATCH','/api/phases/1'],
 ['DELETE','/api/phases/1'],
 ['GET','/api/tasks?projectId=1'],
 ['POST','/api/tasks'],
 ['PATCH','/api/tasks/1'],
 ['DELETE','/api/tasks/1'],
 ['GET','/api/projects/export'],
 ['GET','/api/projects/1/csv'],
 ['GET','/api/projects/1/export'],
];
for(const [method,path] of cases){
 test(`unauthenticated ${method} ${path} returns 401`,{skip:!base},async()=>{
  const response=await fetch(new URL(path,base),{method,headers:json,...(method==='POST'||method==='PATCH'?{body:'{}'}:{})});
  assert.equal(response.status,401,`${method} ${path}`);
  assert.match(response.headers.get('content-type')||'',/application\/json/);
 });
}
test('login page is accessible and no-store',{skip:!base},async()=>{
 const response=await fetch(new URL('/login',base));
 assert.equal(response.status,200);
 assert.match(response.headers.get('cache-control')||'',/no-store/);
 assert.equal(response.headers.get('x-frame-options'),'DENY');
});
test('invalid login credentials are rejected',{skip:!base},async()=>{
 const response=await fetch(new URL('/api/auth/login',base),{method:'POST',headers:json,body:JSON.stringify({email:'',password:''})});
 assert.equal(response.status,401);
});
