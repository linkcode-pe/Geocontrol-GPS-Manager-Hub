## 17. Etapa 1 — edición atómica de proyectos y tareas (11/10/2026)

**Estado:** código de desarrollo, SIN despliegue. Se extendió la transacción MySQL a las rutas PATCH `src/app/api/projects/[id]/route.ts` y `src/app/api/tasks/[id]/route.ts`: actualización y auditoría se confirman juntas; si la auditoría falla, se intenta rollback; se libera la conexión en `finally`. Si el registro no existe, se responde 404 y se revierte la transacción.

**Pruebas:** `tests/atomic-update.test.mjs` agrega dos verificaciones de contrato. Suite completa: **62 pruebas, 44 correctas, 18 omitidas, 0 fallidas**. No equivalen a pruebas E2E autenticadas ni a pruebas de fallo real de MySQL.

**Pendientes críticos:** prueba de restauración aislada de respaldos; copia externa cifrada y alertas; E2E autenticado con lectura posterior; revisar atomicidad en fases y eliminaciones; resolver dependencias faltantes para verificación TypeScript completa sin afectar el release de producción. No desplegar sin aprobación explícita de Jim.

**Próximo paso:** continuar validación de integridad y respaldos y preparar verificación aislada de recuperación.
