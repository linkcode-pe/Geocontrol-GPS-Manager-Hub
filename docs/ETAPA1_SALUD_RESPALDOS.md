## 27. Etapa 1 — vigilancia de salud de respaldos (11/10/2026)

**Implementado en desarrollo:** `scripts/check-backup-health.py`, comprobador **solo lectura**. Comprueba que el temporizador `geocontrol-hub-backup.timer` esté habilitado y activo, que haya copias locales, que la más reciente tenga menos de 36 horas y que su gzip sea legible y contenga tablas esenciales del Hub. Devuelve código de salida 1 y mensajes `ALERT:` cuando detecta anomalías; apto para monitorización futura. No instala temporizadores ni envía alertas externas sin aprobación; tampoco toca otras bases de datos.

**Ejecutado en servidor:** `OK: backup timer active, enabled, recent and gzip readable`. `HUB_SMOKE_URL=https://hub.geocontrol.online npm test`: 68 correctas, 0 fallos, 0 omitidas. Producción intacta.

**Importante:** el script por sí solo no genera notificaciones automáticas: requiere que se configure un mecanismo de ejecución y aviso. La Etapa 1 aún no está cerrada: falta la prueba de escritura/lectura autenticada en entorno aislado. No confundir comprobación de archivos con restauración, que se validó anteriormente por separado.
