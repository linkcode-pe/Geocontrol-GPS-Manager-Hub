#!/usr/bin/env python3
"""Verify latest Hub backup in a new disposable schema; never select production."""
import gzip
import importlib.util
import pathlib
import subprocess
import uuid

spec=importlib.util.spec_from_file_location('restore_safety',pathlib.Path(__file__).with_name('restore-dump-safety.py'))
safety=importlib.util.module_from_spec(spec)
spec.loader.exec_module(safety)
files=sorted(pathlib.Path('/opt/geocontrol/backups/hub').glob('geocontrol-hub-*.sql.gz'))
if not files: raise SystemExit('No Hub backup available')
target='hub_restore_check_'+uuid.uuid4().hex[:12]
source=gzip.open(files[-1],'rb').read()
script=safety.isolated_dump(source,target)
created=False
try:
    # The dump creates the unique temporary database; it never switches to production.
    subprocess.run(['mysql'],input=script,check=True,stdout=subprocess.DEVNULL)
    created=True
    tables=subprocess.check_output(['mysql','-N','-e',f'SELECT table_name FROM information_schema.tables WHERE table_schema="{target}" ORDER BY table_name'])
    actual=set(tables.decode().splitlines())
    expected={t.decode() for t in safety.TABLES}
    if actual!=expected: raise RuntimeError(f'Restored tables mismatch: {sorted(actual)}')
    counts=subprocess.check_output(['mysql','-N','-e',f'SELECT (SELECT COUNT(*) FROM `{target}`.hub_projects),(SELECT COUNT(*) FROM `{target}`.hub_tasks),(SELECT COUNT(*) FROM `{target}`.hub_project_guide)'])
    print(f'Isolated restore verified: {len(actual)} tables; project/task/guide counts: {counts.decode().strip()}')
finally:
    # Never remove a database unless the restore completed and created this unique schema.
    if created:
        subprocess.run(['mysql','-e',f'DROP DATABASE IF EXISTS `{target}`'],check=True)
