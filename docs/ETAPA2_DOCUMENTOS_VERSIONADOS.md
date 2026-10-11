## 32. Etapa 2 — documentos versionados y archivado reversible (11/10/2026)

**Estado:** código desarrollado y **E2E autenticado aislado aprobado**; **sin migración ni publicación en producción**.

**Migración aditiva** `database/migrations/20261011_document_versions.sql`: agrega `revision`, `archived_at`, `archived_by` a `hub_documents`; crea `hub_document_versions` con snapshots por revisión y copia inicial de documentos existentes. Debe ejecutarse **una sola vez** y solo en `geocontrol_hub`, después de un respaldo. No ejecutar en otras bases.

**API:** `GET/POST /api/documents` lista documentos por proyecto (excluye archivados salvo `archived=1`) y crea documento + versión 1 + auditoría atómicamente. `PATCH /api/documents/[id]` admite `action=update|archive|unarchive` con revisión esperada, bloqueo transaccional, versión nueva y auditoría. `GET /api/documents/[id]/versions` lista snapshots o consulta uno por `?revision=N`. `POST /api/documents/[id]/versions` recupera título/contenido histórico como **nueva** revisión, conserva el estado de archivo actual, registra auditoría. Todos requieren sesión; escrituras requieren rol owner/admin/editor y origen permitido. Los conflictos devuelven 409. **No hay endpoint de borrado físico de documentos.**

**Validación:** `npm run lint` 0 errores, 2 avisos no bloqueantes en scripts E2E; `npm run build` aislado correcto, TypeScript correcto, 19 páginas. `scripts/e2e-stage2-documents-isolated.mjs` ejecutado con usuario y esquema MySQL desechables: **PASS** crear/listar/editar documento, rechazo 409 por revisión obsoleta, archivar/ocultar/listar archivados, desarchivar, consultar historial 1–4, restaurar versión 1 como versión 5 y comprobar que la versión 2 mantiene el contenido posterior; también volvió a pasar recuperación de memoria y prueba autenticada de tareas. Esquema desechable eliminado.

**Pendiente:** interfaz de documentos, prueba de migración sobre copia restaurada con documentos existentes, publicación controlada de migraciones y código, comprobación HTTP postdespliegue. No declarar Etapa 2 cerrada.
