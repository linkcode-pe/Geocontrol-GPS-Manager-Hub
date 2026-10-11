"""Validate Hub dump and rewrite only schema directives for an isolated restore."""
import re

SOURCE = b'geocontrol_hub'
TABLES = (b'hub_users', b'hub_projects', b'hub_phases', b'hub_tasks', b'hub_documents', b'hub_audit_log', b'hub_login_attempts', b'hub_project_guide')

def isolated_dump(source: bytes, target: str) -> bytes:
    if not re.fullmatch(r'hub_restore_check_[0-9a-f]{12}', target):
        raise ValueError('Unsafe target schema')
    if any(t not in source for t in TABLES) or source.count(b'CREATE TABLE') != len(TABLES):
        raise ValueError('Missing or unexpected tables')
    create = re.compile(rb'(?m)^CREATE DATABASE (?P<suffix>[^;]*?)`geocontrol_hub`(?P<tail>[^;]*);$')
    use = re.compile(rb'(?m)^USE `geocontrol_hub`;$')
    if len(create.findall(source)) != 1 or len(use.findall(source)) != 1:
        raise ValueError('Unexpected database directives')
    safe = target.encode('ascii')
    output = create.sub(lambda m: b'CREATE DATABASE ' + m['suffix'] + b'`' + safe + b'`' + m['tail'] + b';', source)
    output = use.sub(b'USE `' + safe + b'`;', output)
    if b'USE `geocontrol_hub`;' in output:
        raise ValueError('Original database still selected')
    return output
