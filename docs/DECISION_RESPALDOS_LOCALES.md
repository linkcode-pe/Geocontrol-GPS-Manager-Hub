## 22. Decisión de respaldos — almacenamiento local (11/10/2026)

**Decisión explícita del propietario:** mantener los respaldos de Geocontrol Project Hub **dentro del mismo servidor**, sin requerir copia externa ni servicio de nube. Si se interrumpe la conexión remota de ChatGPT, el propietario puede acceder al servidor por consola desde su PC. Esta decisión sustituye el requisito previo de configurar un destino externo en la Etapa 1.

**Estado comprobado:** `geocontrol-hub-backup.timer` habilitado, directorio local `/opt/geocontrol/backups/hub` con permisos `0700`, y restauración aislada del respaldo del Hub verificada anteriormente. No se borraron ni movieron respaldos.

**Riesgo aceptado:** el acceso por consola permite recuperar datos ante una pérdida de conexión, pero **no protege frente a fallo del disco, pérdida total del servidor o daño simultáneo del original y las copias locales**. No presentar los respaldos locales como protección ante pérdida física del servidor.

**Pendiente Etapa 1:** documentar procedimiento de recuperación por consola, validar guardado autenticado y controles de integridad, resolver verificación TypeScript y alertas de respaldos. No desplegar cambios de código sin aprobación.
