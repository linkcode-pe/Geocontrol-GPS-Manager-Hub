#!/usr/bin/env python3
"""Restore latest Hub backup to disposable schema and verify both Stage 2 migrations."""
import gzip
import importlib.util
import pathlib
import re
import subprocess
import uuid

base = pathlib.Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('restore_safety', base / 'restore-dump-safety.py')
safety = importlib.util.module_from_spec(spec)
spec.loader.exec_module(safety)
backups = sorted(pathlib.Path('/opt/geocontrol/backups/hub').glob('geocontrol-hub-*.sql.gz'))
if not backups:
    raise SystemExit('No Hub backup available')
target = 'hub_restore_check_' + uuid.uuid4().hex[:12]
assert re.fullmatch(r'hub_restore_check_[0-9a-f]{12}', target)
dump = safety.isolated_dump(gzip.open(backups[-1], 'rb').read(), target)

def sql(statement):
    return subprocess.check_output(['mysql', '-N', '-D', target, '-e', statement], text=True).strip()

try:
    # The SQL dump itself creates the disposable database. Cleanup is required
    # even if the restore process fails after CREATE DATABASE.
    subprocess.run(['mysql'], input=dump, check=True, stdout=subprocess.DEVNULL)
    project = sql('SELECT id FROM hub_projects ORDER BY id LIMIT 1')
    if not project or not project.isdecimal():
        raise RuntimeError('No project in restored backup')
    sql("INSERT INTO hub_documents(project_id,title,body) VALUES(" + project + ",'Migration test document','Historical content')")
    before = sql('SELECT COUNT(*) FROM hub_documents')
    for filename in ('20261011_guide_versions.sql', '20261011_document_versions.sql'):
        migration = (base.parent / 'database' / 'migrations' / filename).read_text()
        subprocess.run(['mysql', '-D', target], input=migration, text=True, check=True, stdout=subprocess.DEVNULL)
    # Every preexisting document must have exactly one identical baseline
    # snapshot. The LEFT JOIN catches missing snapshots as well.
    mismatch = sql("""
        SELECT COUNT(*) FROM hub_documents d
        LEFT JOIN hub_document_versions v ON v.document_id=d.id AND v.revision=d.revision
        WHERE v.id IS NULL OR d.revision<>1 OR v.title<>d.title
           OR NOT (v.body <=> d.body) OR NOT (v.archived_at <=> d.archived_at)
    """)
    versions = sql('SELECT COUNT(*) FROM hub_document_versions')
    if mismatch != '0' or versions != before:
        raise RuntimeError(f'Document baseline mismatch: {mismatch=} {versions=} {before=}')
    row = sql("""
        SELECT d.revision,v.revision,v.title,v.body
        FROM hub_documents d JOIN hub_document_versions v ON v.document_id=d.id
        WHERE d.title='Migration test document' ORDER BY d.id DESC LIMIT 1
    """)
    if row != '1\t1\tMigration test document\tHistorical content':
        raise RuntimeError('Legacy document content mismatch: ' + row)
    guide = sql('SELECT revision FROM hub_project_guide WHERE id=1')
    baseline = sql('SELECT COUNT(*) FROM hub_project_guide_versions WHERE guide_id=1 AND revision=' + guide)
    if baseline != '1':
        raise RuntimeError('Guide baseline missing')
    print(f'PASS: backup restored, {before} legacy documents preserved and versioned, guide baseline revision {guide}')
finally:
    # The name is generated locally and constrained above; no real schema is targeted.
    subprocess.run(['mysql', '-e', 'DROP DATABASE IF EXISTS `' + target + '`'], check=True)
    print('Disposable schema cleaned')
