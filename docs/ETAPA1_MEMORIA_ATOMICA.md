## 25. Etapa 1 — guardado atómico de memoria principal (11/10/2026)

**Problema identificado:** el endpoint `PUT /api/project-guide` guardaba el documento en `hub_project_guide` y después insertaba auditoría mediante una segunda conexión independiente. Si fallaba la auditoría, el documento podía quedar guardado mientras el cliente recibía error.

**Corrección en desarrollo:** `src/app/api/project-guide/route.ts` utiliza ahora una única conexión/transacción MySQL para UPDATE condicional por revisión e INSERT en `hub_audit_log`. Ante fallo se ejecuta rollback; ante conflicto de revisión devuelve 409 sin registrar cambios; libera conexión en `finally`. Se conserva el contrato de respuesta.

**Pruebas:** `tests/atomic-guide.test.mjs` verifica estructura transaccional; `HUB_SMOKE_URL=https://hub.geocontrol.online npm test`: **68 pruebas correctas, 0 fallidas, 0 omitidas**. Las pruebas públicas comprueban rutas no autenticadas, no guardado autenticado. **No desplegado a producción.**

**Pendiente:** ejecutar prueba autenticada en entorno aislado y TypeScript en copia separada; aprobación explícita antes de publicar la corrección.
