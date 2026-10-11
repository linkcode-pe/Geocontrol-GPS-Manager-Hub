## 23. Etapa 1 — guía de recuperación por consola (11/10/2026)

**Documento nuevo:** `docs/RECUPERACION_CONSOLA.md` describe acceso al servidor desde PC, comprobaciones de servicio y timer, consulta de copias locales en `/opt/geocontrol/backups/hub`, prueba de integridad gzip, restauración aislada con `scripts/verify-restore-hub.py` y diagnóstico de logs sin modificar producción. Advierte que no se debe restaurar directamente sobre `geocontrol_hub` sin preservar datos actuales y obtener autorización.

**Verificado:** `geocontrol-hub` activo, timer diario habilitado a 04:00 UTC, registro de respaldo exitoso el 11/10/2026 a las 15:55 UTC, copias locales presentes. El propietario decidió mantenerlas en el mismo servidor (sección 22).

**Pendientes:** prueba de guardado autenticado/lectura con registros de prueba; verificar TypeScript en entorno de desarrollo aislado; revisar alertas y fallos transaccionales. Sin despliegue de producción.
