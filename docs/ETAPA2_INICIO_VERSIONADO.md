## 29. Etapa 2 iniciada — historial de versiones de memoria (11/10/2026)

**Estado:** desarrollo, sin migración ni despliegue en producción. Memoria MySQL de referencia: revisión 17 al iniciar.

**Código:** migración aditiva `database/migrations/20261011_guide_versions.sql` para tabla `hub_project_guide_versions` (revisión única por guía, contenido y autor, fecha) y captura inicial de revisión vigente. `PUT /api/project-guide` bloquea fila `FOR UPDATE`, verifica revisión, conserva revisión anterior, actualiza contenido, registra nueva revisión y auditoría dentro de una transacción; si falla, rollback. `GET /api/project-guide/versions` lista hasta 100 revisiones y permite leer contenido de una revisión específica mediante `?revision=N`, siempre con sesión válida. La ruta actual `GET /api/project-guide` mantiene su contrato.

**Pruebas:** `HUB_SMOKE_URL=https://hub.geocontrol.online npm test` 68/68 correctas, 0 fallos; `npm run build` en copia aislada correcto, incluida TypeScript, 18 páginas generadas. No se ha ejecutado todavía una prueba E2E específica de historial/recuperación; **no se declara Etapa 2 terminada**.

**Siguientes pasos:** prueba E2E con esquema temporal que incluya nueva migración; añadir restauración de versión anterior como nueva revisión (sin borrar la vigente), interfaz de historial y recuperación, versionado de documentos y archivado reversible. Después preparar publicación segura con respaldo y aprobación según reglas del proyecto.
