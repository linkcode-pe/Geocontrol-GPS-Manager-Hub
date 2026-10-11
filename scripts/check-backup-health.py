#!/usr/bin/env python3
"""Read-only backup health check for the Hub. No changes to services or databases."""
import datetime
import gzip
import pathlib
import subprocess
import sys

DIRECTORY=pathlib.Path('/opt/geocontrol/backups/hub')
MAX_AGE_HOURS=36

def check(now=None, directory=DIRECTORY, runner=subprocess.run):
    now=now or datetime.datetime.now(datetime.timezone.utc)
    problems=[]
    timer=runner(['systemctl','is-enabled','geocontrol-hub-backup.timer'],capture_output=True,text=True)
    if timer.returncode!=0 or timer.stdout.strip()!='enabled':
        problems.append('Backup timer is not enabled')
    active=runner(['systemctl','is-active','geocontrol-hub-backup.timer'],capture_output=True,text=True)
    if active.returncode!=0 or active.stdout.strip()!='active':
        problems.append('Backup timer is not active')
    backups=sorted(directory.glob('geocontrol-hub-*.sql.gz'))
    if not backups:
        problems.append('No Hub backup files found')
    else:
        latest=max(backups,key=lambda p:p.stat().st_mtime)
        age=(now-datetime.datetime.fromtimestamp(latest.stat().st_mtime,datetime.timezone.utc)).total_seconds()/3600
        if age>MAX_AGE_HOURS:
            problems.append(f'Latest backup is {age:.1f} hours old')
        try:
            with gzip.open(latest,'rb') as file:
                data=file.read()
            if b'CREATE TABLE' not in data or b'hub_project_guide' not in data:
                problems.append('Latest backup lacks required Hub tables')
        except (OSError,EOFError) as exc:
            problems.append(f'Latest backup cannot be decompressed: {type(exc).__name__}')
    return problems

if __name__=='__main__':
    issues=check()
    for issue in issues: print('ALERT:',issue)
    if issues: sys.exit(1)
    print('OK: backup timer active, enabled, recent and gzip readable')
