## 62. Producción — Etapa 4 publicada con autorización explícita (18/10/2026)

**Autorización:** usuario confirmó «Sí te autorizo» a la pregunta explícita de publicar Etapa 4 en `hub.geocontrol.online` y aplicar su migración a `geocontrol_hub`, reiterada con «Te autorizo continuar, vuelve a intentar».

**Respaldo:** `/opt/geocontrol/backups/hub/geocontrol-hub-20261018T190225Z.sql.gz` (495612 bytes) generado y verificado antes de cambios; restauración aislada del respaldo y ensayo de migración PASS: 3 proyectos, 0 documentos, guía revisión 51 preservada. La rotación habitual del script conservó los 14 respaldos más recientes.

**Migración:** aplicada **solo** en `geocontrol_hub`: `database/migrations/20261018_project_continuity.sql`, crea `hub_project_continuity` y `hub_project_continuity_versions`. Verificadas ambas tablas, 3 proyectos y guía revisión 51 intactos inmediatamente después; 0 registros iniciales de continuidad. No se tocaron bases Traccar.

**Publicación:** build aislado de Next.js 16.4 y TypeScript PASS (24 páginas), E2E navegador/API PASS previamente. Nuevo release `/opt/geocontrol-hub-releases/stage4-a01dc98`, separado del release Etapa 3 y con `.env.production` protegida. Copia de override previa: `/etc/systemd/system/geocontrol-hub.service.d/release.conf.pre-stage4-a01dc98`. Se actualizó el override, `systemctl daemon-reload` y reinicio. Servicio `geocontrol-hub` activo, WorkingDirectory release Etapa 4. En la primera comprobación inmediata hubo HTTP 502 transitorio durante el arranque; comprobación posterior mostró servicio Next listo y login HTTP 200.

**Pruebas públicas:** `HUB_SMOKE_URL=https://hub.geocontrol.online npm test`: **68/68 PASS, 0 fallos**. `/login` HTTP 200, rutas `/continuidad`, `/expedientes`, `/memorias`, `/documentos`, `/fichas-tecnicas` sin sesión HTTP 307, API `/api/projects/1/continuity`, `/api/continuity/1`, proyectos y memoria sin sesión HTTP 401. No se realizaron escrituras de prueba en proyectos reales.

**Rollback:** restaurar override `release.conf.pre-stage4-a01dc98` sobre `release.conf`, `systemctl daemon-reload`, reiniciar servicio y verificar login/API. Conservar las dos tablas aditivas de Etapa 4 y no restaurar el respaldo sobre producción sin evaluar datos nuevos.

**Pendiente:** completar comprobación autenticada de solo lectura de la nueva UI/API en producción y seguimiento operativo. La prueba autenticada efímera no pudo ejecutarse por bloqueo de seguridad de la herramienta, sin eludirlo.
