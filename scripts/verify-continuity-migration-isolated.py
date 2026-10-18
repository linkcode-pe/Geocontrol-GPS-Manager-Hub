#!/usr/bin/env python3
"""Restore a real Hub backup and rehearse Stage 4 only in a disposable schema."""
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
allowed=set(safety.TABLES)|{b'hub_project_guide_versions',b'hub_document_versions',b'hub_project_technical_sheets',b'hub_project_technical_sheet_versions',b'hub_project_memories',b'hub_project_memory_versions'}
if not tables or len(tables)!=len(set(tables)) or not set(tables).issubset(allowed):raise SystemExit('Unexpected Hub backup tables')
safety.TABLES=tuple(tables)
dump=safety.isolated_dump(raw,target)
def sql(q):return subprocess.check_output(['mysql','-N','-D',target,'-e',q],text=True).strip()
try:
 subprocess.run(['mysql'],input=dump,check=True,stdout=subprocess.DEVNULL)
 before=int(sql('SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=DATABASE()'))
 projects=sql('SELECT COUNT(*) FROM hub_projects')
 guide=sql('SELECT revision FROM hub_project_guide WHERE id=1')
 docs=sql('SELECT COUNT(*) FROM hub_documents')
 migration=(base.parent/'database/migrations/20261018_project_continuity.sql').read_text()
 subprocess.run(['mysql','-D',target],input=migration,text=True,check=True,stdout=subprocess.DEVNULL)
 assert int(sql('SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=DATABASE()'))==before+2
 ids=sql('SELECT id FROM hub_projects ORDER BY id LIMIT 2').splitlines()
 assert len(ids)==2
 for i,pid in enumerate(ids):
  sql(f"INSERT INTO hub_project_continuity(project_id,kind,title,details) VALUES({pid},'decision','Isolated decision {i}','Only this project')")
  entry=sql(f"SELECT id FROM hub_project_continuity WHERE project_id={pid}")
  sql(f"INSERT INTO hub_project_continuity_versions(entry_id,revision,title,details,status) VALUES({entry},1,'Isolated decision {i}','Only this project','open')")
 assert sql('SELECT COUNT(*) FROM hub_project_continuity')=='2'
 assert sql('SELECT COUNT(*) FROM hub_project_continuity_versions')=='2'
 assert sql('SELECT COUNT(*) FROM hub_documents')==docs
 assert sql('SELECT revision FROM hub_project_guide WHERE id=1')==guide
 print(f'PASS Stage4 backup restore {backups[-1].name}: {projects} projects, {docs} docs, guide revision {guide}; 2 new tables, A/B writes')
finally:
 subprocess.run(['mysql','-e','DROP DATABASE IF EXISTS `'+target+'`'],check=True)
 print('Disposable schema cleaned')
