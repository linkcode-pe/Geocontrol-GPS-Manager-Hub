#!/usr/bin/env python3
"""Restore latest Hub backup into disposable schema; validate Stage 2 migrations and legacy documents."""
import gzip
import importlib.util
import pathlib
import subprocess
import uuid

base=pathlib.Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('restore_safety',base/'restore-dump-safety.py')
safety=importlib.util.module_from_spec(spec)
spec.loader.exec_module(safety)
backups=sorted(pathlib.Path('/opt/geocontrol/backups/hub').glob('geocontrol-hub-*.sql.gz'))
if not backups: raise SystemExit('No backup available')
target='hub_restore_check_'+uuid.uuid4().hex[:12]
dump=safety.isolated_dump(gzip.open(backups[-1],'rb').read(),target)
created=False
def sql(statement):
 return subprocess.check_output(['mysql','-N','-D',target,'-e',statement],text=True).strip()
try:
 subprocess.run(['mysql'],input=dump,check=True,stdout=subprocess.DEVNULL)
 created=True
 project=sql('SELECT id FROM hub_projects ORDER BY id LIMIT 1')
 if not project: raise RuntimeError('No project in restored backup')
 # Seed a historical document ONLY in the disposable schema.
 sql("INSERT INTO hub_documents(project_id,title,body) VALUES("+project+",'Migration test document','Historical content')")
 doc=sql('SELECT MAX(id) FROM hub_documents')
 # Apply both additive Stage 2 migrations ONLY to the isolated schema.
 for filename in ['20261011_guide_versions.sql','20261011_document_versions.sql']:
  migration=(base.parent/'database'/'migrations'/filename).read_text()
  subprocess.run(['mysql','-D',target],input=migration,text=True,check=True,stdout=subprocess.DEVNULL)
 row=sql('SELECT d.revision,v.revision,v.title,v.body FROM hub_documents d JOIN hub_document_versions v ON v.document_id=d.id WHERE d.id='+doc)
 if row!='1\t1\tMigration test document\tHistorical content':raise RuntimeError('Legacy document baseline mismatch: '+row)
 guide=sql('SELECT revision FROM hub_project_guide WHERE id=1')
 baseline=sql('SELECT COUNT(*) FROM hub_project_guide_versions WHERE guide_id=1 AND revision='+guide)
 if baseline!='1':raise RuntimeError('Guide baseline missing')
 print('PASS: latest Hub backup restored; existing document preserved and versioned; guide baseline revision '+guide)
finally:
 if created: subprocess.run(['mysql','-e','DROP DATABASE IF EXISTS `'+target+'`'],check=True)
