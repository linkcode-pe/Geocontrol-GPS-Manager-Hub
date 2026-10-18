## 53. Etapa 3 — migración de memorias validada con respaldo real (18/10/2026)

Se creó `scripts/verify-project-memory-migration-isolated.py`: utiliza el respaldo más reciente disponible de Hub, verifica inventario de tablas permitidas y usa `restore-dump-safety.py` para restaurar exclusivamente en esquema temporal `hub_restore_check_<12hex>`. Aplica allí `database/migrations/20261018_project_memories.sql`, verifica creación de exactamente dos tablas, escritura y lectura de memorias independientes A/B, conservación de proyectos, documentos y revisión de la guía. Limpia esquema temporal en `finally`.

**Resultado real:** PASS restaurando `geocontrol-hub-20261018T174139Z.sql.gz`; 3 proyectos, 0 documentos y revisión 37 del respaldo conservados; migración y escritura de A/B verificadas; esquema temporal eliminado. El respaldo es anterior a la revisión actual 41 de memoria principal, lo cual es normal: no se restauró en producción.

**Pendiente:** pruebas automatizadas visuales desktop/móvil de `/expedientes` y `/memorias`; completar continuidad/decisiones y UX. No se ha desplegado Etapa 3 ni aplicado su migración a producción.
