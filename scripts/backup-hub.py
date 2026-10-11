#!/usr/bin/env python3
"""Independent Hub database backup; never touches Traccar databases."""
import gzip
import os
import pathlib
import shutil
import subprocess
import tempfile
from datetime import datetime, timezone

root = pathlib.Path('/opt/geocontrol-project-hub')
values = {}
for line in (root / '.env.production').read_text().splitlines():
    if '=' in line and not line.lstrip().startswith('#'):
        k, v = line.split('=', 1)
        values[k.strip()] = v.strip().strip('"').strip("'")
name = values.get('DB_NAME', 'geocontrol_hub')
if name != 'geocontrol_hub':
    raise SystemExit('Refusing unexpected database name')
user = values['DB_USER']
password = values['DB_PASSWORD']
host = values.get('DB_HOST', '127.0.0.1')
outdir = pathlib.Path('/opt/geocontrol/backups/hub')
outdir.mkdir(parents=True, exist_ok=True, mode=0o700)
os.chmod(outdir, 0o700)
stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
final = outdir / f'geocontrol-hub-{stamp}.sql.gz'
fd, cnf = tempfile.mkstemp(prefix='hub-backup-', suffix='.cnf')
try:
    with os.fdopen(fd, 'w') as f:
        f.write('[client]\n')
        for k,v in [('user',user),('password',password),('host',host)]:
            f.write(f'{k}="{v.replace(chr(92),chr(92)*2).replace(chr(34),chr(92)+chr(34))}"\n')
    os.chmod(cnf,0o600)
    tmp = final.with_suffix('.tmp')
    try:
        with subprocess.Popen(['mysqldump',f'--defaults-extra-file={cnf}','--single-transaction','--no-tablespaces','--triggers','--databases',name],stdout=subprocess.PIPE) as proc:
            with gzip.open(tmp,'wb') as out:
                shutil.copyfileobj(proc.stdout,out)
            if proc.wait()!=0:
                raise RuntimeError('Database dump failed')
        with gzip.open(tmp,'rb') as inp:
            dump=inp.read()
        if b'CREATE TABLE' not in dump or b'hub_projects' not in dump or b'hub_tasks' not in dump:
            raise RuntimeError('Incomplete backup')
        tmp.rename(final)
        os.chmod(final,0o600)
    finally:
        tmp.unlink(missing_ok=True)
finally:
    os.unlink(cnf)
# Keep the latest 14 daily backups; never remove the newly generated file.
files=sorted(outdir.glob('geocontrol-hub-*.sql.gz'))
for stale in files[:-14]:
    stale.unlink()
print(f'Backup verified: {final.name}, {final.stat().st_size} bytes')
