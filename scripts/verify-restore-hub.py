#!/usr/bin/env python3
"""Restore latest Hub backup into a disposable isolated MySQL database."""
import gzip
import pathlib
import subprocess
import uuid

backup_dir=pathlib.Path('/opt/geocontrol/backups/hub')
files=sorted(backup_dir.glob('geocontrol-hub-*.sql.gz'))
if not files: raise SystemExit('No Hub backup available')
target='hub_restore_check_'+uuid.uuid4().hex[:12]
source=gzip.open(files[-1],'rb').read()
if b'geocontrol_hub' not in source: raise SystemExit('Unexpected backup content')
if b'CREATE TABLE' not in source: raise SystemExit('Backup lacks schema')
script=source.replace(b'geocontrol_hub',target.encode())
try:
    subprocess.run(['mysql'],input=script,check=True,stdout=subprocess.DEVNULL)
    tables=subprocess.check_output(['mysql','-N','-e',f'SELECT COUNT(*) FROM information_schema.tables WHERE table_schema="{target}"'])
    count=int(tables.strip())
    if count<6: raise RuntimeError(f'Only {count} tables restored')
    print(f'Isolated restore verified: {count} tables')
finally:
    subprocess.run(['mysql','-e',f'DROP DATABASE IF EXISTS `{target}`'],check=True)
