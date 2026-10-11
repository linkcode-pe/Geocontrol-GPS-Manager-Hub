## 21. Etapa 1 — pruebas HTTP públicas y respaldo externo (11/10/2026)

**Prueba real HTTP sin autenticación:** ejecutado `HUB_SMOKE_URL=https://hub.geocontrol.online npm test` contra la web pública. Resultado **67 pruebas, 67 correctas, 0 fallidas, 0 omitidas**. Incluye verificación de rechazo 401 en rutas protegidas, login accesible y rechazo de credenciales vacías. Estas pruebas no modifican proyectos, tareas ni fases. **No es prueba E2E de guardado autenticado**.

**Revisión de respaldos:** timer diario `geocontrol-hub-backup.timer` configurado para 04:00 UTC; directorio local privado `/opt/geocontrol/backups/hub` y respaldo restaurado previamente con éxito. No se encontró configuración de destino remoto del Hub ni herramientas `restic`/`rclone` instaladas. Existe `gpg` pero sin destino remoto identificado. No afirmar que exista copia externa cifrada. Se requiere definir almacenamiento externo independiente y credenciales por un canal seguro, sin publicarlas en el repositorio.

**Pendientes:** elegir destino externo cifrado y probar recuperación desde él; reproducir y verificar guardado autenticado con registros de prueba; resolver dependencias TypeScript aisladas; verificar fallos transaccionales. Ningún despliegue sin autorización.
