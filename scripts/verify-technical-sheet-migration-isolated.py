#!/usr/bin/env python3
"""Restore an actual Hub backup in a disposable schema and rehearse technical sheet migration."""
import gzip
import importlib.util
import pathlib
import re
import subprocess
import uuid

base=pathlib.Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('restore_safety',base/'restore-dump-safety.py')
safety=importlib.util.module_from_spec(spec)
spec.loader.exec_module(safety)
backups=sorted(pathlib.Path('/opt/geocontrol/backups/hub').glob('geocontrol-hub-*.sql.gz'))
if not backups:raise SystemExit('No Hub backup available')
target='hub_restore_check_'+uuid.uuid4().hex[:12]
assert re.fullmatch(r'hub_restore_check_[0-9a-f]{12}',target)
raw=gzip.open(backups[-1],'rb').read()
# Stage 2 backups now contain additional version tables: extend safety's exact table inventory
# only after verifying the names are Hub-specific and expected.
tables=re.findall(rb'(?m)^CREATE TABLE `([a-zA-Z0-9_]+)`',raw)
allowed=set(safety.TABLES)|{b'hub_project_guide_versions',b'hub_document_versions'}
if not tables or len(tables)!=len(set(tables)) or not set(tables).issubset(allowed):
 raise SystemExit('Unexpected table inventory in Hub backup')
safety.TABLES=tuple(tables)
dump=safety.isolated_dump(raw,target)
def sql(q):return subprocess.check_output(['mysql','-N','-D',target,'-e',q],text=True).strip()
try:
 subprocess.run(['mysql'],input=dump,check=True,stdout=subprocess.DEVNULL)
 projects=sql('SELECT COUNT(*) FROM hub_projects')
 documents=sql('SELECT COUNT(*) FROM hub_documents')
 guide=sql('SELECT revision FROM hub_project_guide WHERE id=1')
 before=sql('SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=DATABASE()')
 migration=(base.parent/'database/migrations/20261018_technical_sheets.sql').read_text()
 subprocess.run(['mysql','-D',target],input=migration,text=True,check=True,stdout=subprocess.DEVNULL)
 after=sql('SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=DATABASE()')
 if int(after)!=int(before)+2:raise RuntimeError('Unexpected table count')
 project=sql('SELECT id FROM hub_projects ORDER BY id LIMIT 1')
 if not project.isdecimal():raise RuntimeError('No project available')
 sql("INSERT INTO hub_project_technical_sheets(project_id,content,revision) VALUES("+project+",'Isolated technical content',1)")
 sql("INSERT INTO hub_project_technical_sheet_versions(project_id,revision,content) VALUES("+project+",1,'Isolated technical content')")
 assert sql('SELECT content FROM hub_project_technical_sheets WHERE project_id='+project)=='Isolated technical content'
 assert sql('SELECT COUNT(*) FROM hub_project_technical_sheet_versions WHERE project_id='+project)=='1'
 assert sql('SELECT COUNT(*) FROM hub_documents')==documents
 assert sql('SELECT revision FROM hub_project_guide WHERE id=1')==guide
 print(f'PASS: backup {backups[-1].name} restored; {projects} projects and {documents} documents preserved; technical sheet migration and version write verified')
finally:
 subprocess.run(['mysql','-e','DROP DATABASE IF EXISTS `'+target+'`'],check=True)
 print('Disposable schema cleaned')
