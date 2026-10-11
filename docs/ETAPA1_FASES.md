## 18. Etapa 1 — atomicidad de fases (11/10/2026)

**Estado:** desarrollo, SIN desplegar. Se corrigieron las API `POST /api/phases` y `PATCH /api/phases/:id`: escritura de la fase y auditoría se realizan en una sola conexión/transacción MySQL, con commit, rollback ante error y liberación de conexión. La comprobación previa de existencia de proyecto sigue siendo separada; las condiciones de carrera deben evaluarse en pruebas de integración.

**Validación:** se añadieron dos pruebas de contrato en `tests/atomic-phases.test.mjs`. Suite completa: **64 pruebas, 46 correctas, 18 omitidas, 0 fallidas**. No se ha ejecutado prueba E2E autenticada ni restauración aislada.

**Pendientes:** DELETE de fases y tareas (preservación de auditoría y prevención de borrado accidental), restauración aislada comprobada, copia externa cifrada, verificación autenticada de guardado y dependencias TypeScript faltantes. Las pruebas de contrato solo verifican la estructura del código, no demuestran atomicidad bajo fallos de MySQL.

**Próximo paso:** revisar y asegurar eliminaciones, preparar pruebas de integración y recuperación sin modificar producción.
