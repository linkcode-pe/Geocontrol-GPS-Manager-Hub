#!/usr/bin/env python3
"""Rehearse Stage 3 memory migration on a real Hub backup, disposable schema only."""
import gzip,importlib.util,pathlib,re,subprocess,uuid
base=pathlib.Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('restore_safety',base/'restore-dump-safety.py')
safety=importlib.util.module_from_spec(spec);spec.loader.exec_module(safety)
backups=sorted(pathlib.Path('/opt/geocontrol/backups/hub').glob('geocontrol-hub-*.sql.gz'))
if not backups:raise SystemExit('No Hub backup')
target='hub_restore_check_'+uuid.uuid4().hex[:12]
assert re.fullmatch(r'hub_restore_check_[0-9a-f]{12}',target)
raw=gzip.open(backups[-1],'rb').read()
tables=re.findall(rb'(?m)^CREATE TABLE `([a-zA-Z0-9_]+)`',raw)
allowed=set(safety.TABLES)|{b'hub_project_guide_versions',b'hub_document_versions',b'hub_project_technical_sheets',b'hub_project_technical_sheet_versions'}
if not tables or len(tables)!=len(set(tables)) or not set(tables).issubset(allowed):raise SystemExit('Unexpected table inventory in Hub backup')
safety.TABLES=tuple(tables)
dump=safety.isolated_dump(raw,target)
def sql(q):return subprocess.check_output(['mysql','-N','-D',target,'-e',q],text=True).strip()
try:
 subprocess.run(['mysql'],input=dump,check=True,stdout=subprocess.DEVNULL)
 projects=sql('SELECT COUNT(*) FROM hub_projects')
 docs=sql('SELECT COUNT(*) FROM hub_documents')
 guide=sql('SELECT revision FROM hub_project_guide WHERE id=1')
 before=int(sql('SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=DATABASE()'))
 migration=(base.parent/'database/migrations/20261018_project_memories.sql').read_text()
 subprocess.run(['mysql','-D',target],input=migration,text=True,check=True,stdout=subprocess.DEVNULL)
 after=int(sql('SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=DATABASE()'))
 assert after==before+2,(before,after)
 ids=sql('SELECT id FROM hub_projects ORDER BY id LIMIT 2').splitlines()
 assert len(ids)==2
 for id,content in zip(ids,['Memory A private','Memory B private']):
  sql(f"INSERT INTO hub_project_memories(project_id,content,revision) VALUES({id},'{content}',1)")
  sql(f"INSERT INTO hub_project_memory_versions(project_id,revision,content) VALUES({id},1,'{content}')")
 assert sql('SELECT content FROM hub_project_memories WHERE project_id='+ids[0])=='Memory A private'
 assert sql('SELECT content FROM hub_project_memories WHERE project_id='+ids[1])=='Memory B private'
 assert sql('SELECT COUNT(*) FROM hub_project_memory_versions')=='2'
 assert sql('SELECT COUNT(*) FROM hub_documents')==docs
 assert sql('SELECT revision FROM hub_project_guide WHERE id=1')==guide
 print(f'PASS: {backups[-1].name} restored; {projects} projects, {docs} documents, guide revision {guide} preserved; memory migration and A/B writes verified')
finally:
 subprocess.run(['mysql','-e','DROP DATABASE IF EXISTS `'+target+'`'],check=True)
 print('Disposable schema cleaned')
