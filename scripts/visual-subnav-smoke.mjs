import {createRequire} from 'node:module';
import {spawn} from 'node:child_process';
import {SignJWT} from 'jose';
import assert from 'node:assert/strict';
const require=createRequire('/opt/geocontrol/connector/package.json');
const puppeteer=require('puppeteer');
const port=3299,base=`http://127.0.0.1:${port}`,secret='subnav-test-isolated-secret-0123456789';
const server=spawn('./node_modules/.bin/next',['dev','--hostname','127.0.0.1','--port',String(port)],{cwd:process.cwd(),env:{...process.env,AUTH_SECRET:secret,DB_HOST:'127.0.0.1',DB_USER:'invalid_visual_test',DB_PASSWORD:'invalid_visual_test',DB_NAME:'geocontrol_hub',NODE_ENV:'development'},stdio:'ignore'});
let browser;
try{
 let ready=false;for(let i=0;i<80;i++){try{if((await fetch(base+'/login')).ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,1000))}assert(ready,'development server not ready');
 browser=await puppeteer.launch({headless:true,args:['--no-sandbox','--disable-setuid-sandbox']});
 const token=await new SignJWT({role:'viewer'}).setProtectedHeader({alg:'HS256'}).setSubject('99999999').setExpirationTime('1h').sign(new TextEncoder().encode(secret));
 for(const width of [390,768,1440]){
  const page=await browser.newPage();await page.setViewport({width,height:860,deviceScaleFactor:1});await page.setCookie({name:'geocontrol_hub_session',value:token,url:base});
  await page.setRequestInterception(true);page.on('request',req=>{if(req.url().includes('/api/')){let body={};if(req.url().includes('/api/projects'))body={projects:[{id:1,title:'Proyecto de prueba',status:'active',summary:'Prueba visual',phaseCount:0,taskCount:0,doneCount:0}]};if(req.url().includes('/api/phases'))body={phases:[]};if(req.url().includes('/api/tasks'))body={tasks:[]};if(req.url().includes('/api/documents'))body={documents:[],canEdit:false};if(req.url().includes('/technical-sheet'))body={sheet:null,versions:[],canEdit:false};if(req.url().includes('/memory'))body={memory:null,versions:[],canEdit:false};if(req.url().includes('/continuity'))body={entries:[],canEdit:false};req.respond({status:200,contentType:'application/json',body:JSON.stringify(body)});}else req.continue()});
  for(const route of ['/apariencia','/expedientes','/continuidad','/documentos','/fichas-tecnicas','/memorias']){
   await page.goto(base+route,{waitUntil:'domcontentloaded',timeout:45000});await page.waitForSelector('nav.project-subnav',{timeout:25000});const result=await page.evaluate(()=>{const nav=document.querySelector('nav.project-subnav');const buttons=[...nav.querySelectorAll('button')];return {tabs:buttons.map(b=>b.textContent.trim()),visible:nav.getBoundingClientRect().width>0,overflow:nav.scrollWidth>nav.clientWidth,viewport:innerWidth,documentWidth:document.documentElement.scrollWidth}});assert(result.visible&&result.tabs.length>=2,route+' missing nav');assert(result.documentWidth<=width+12,route+' horizontal page overflow '+JSON.stringify(result));await page.locator('nav.project-subnav button:last-child').click();const selected=await page.$eval('nav.project-subnav button:last-child',b=>b.classList.contains('active'));assert(selected,route+' tab did not activate');console.log(width,route,result.tabs.join(' / '),'OK');
  }
  await page.close();
 }
}finally{if(browser)await browser.close();server.kill('SIGTERM')}
