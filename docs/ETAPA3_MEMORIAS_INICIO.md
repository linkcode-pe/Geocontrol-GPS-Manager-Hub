## 51. Etapa 3 — memoria independiente por proyecto (18/10/2026)

**Implementado solo en desarrollo:** migración `database/migrations/20261018_project_memories.sql` para `hub_project_memories` y `hub_project_memory_versions`, vinculadas por FK a `hub_projects`, versiones únicas por proyecto y revisión. API `src/app/api/projects/[id]/memory/route.ts`: GET actual/histórico, PUT edición con `expectedRevision` y bloqueo transaccional por proyecto, POST restauración no destructiva; roles editor/admin/owner, CSRF Origin, auditoría y validaciones. UI `src/app/memorias/page.tsx`: selector de proyecto, edición, cambios sin guardar, historial, vista previa y recuperación; enlazada desde tarjeta 6 del expediente. La memoria global `hub_project_guide` queda separada y no se modifica.

**Pruebas:** compilación aislada Next 16.4 y TypeScript PASS, rutas `/memorias` y `/api/projects/[id]/memory` incluidas. **Pendiente:** E2E con dos proyectos, comprobación de aislamiento, conflictos, permisos, restauración, navegador móvil y restauración aislada de la migración. No declarar Etapa 3 completada.

**Producción:** permanece en `/opt/geocontrol-hub-releases/stage2-3c5bef9`. No se ha aplicado esta migración ni publicado las nuevas rutas. Antes de desplegar, solicitar aprobación específica y generar respaldo verificable.
