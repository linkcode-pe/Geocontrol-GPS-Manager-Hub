## 45. Etapa 2 — prueba E2E de fichas técnicas (18/10/2026)

Se agregó `scripts/e2e-technical-sheet-isolated.mjs`, basado en el E2E autenticado de documentos y memoria, con esquema MySQL descartable `hub_restore_check_<12 hex>`, usuario MySQL temporal limitado, Next.js de desarrollo aislado y usuario propietario/lector. La prueba crea las tablas de fichas desde `database/migrations/20261018_technical_sheets.sql`, sin aplicarlas en producción. Ajustada para copiar el esquema actual de `hub_documents` que ya incluye columnas de Etapa 2.

**Resultado real: PASS (exit 0, ~29 s)** para ficha vacía, crear revisión 1, editar revisión 2, rechazo de revisión obsoleta 409, historial, lectura histórica, revisión inválida 400/inexistente 404, rechazo de escritura/restauración por lector 403, restauración de revisión 1 como nueva revisión 3 conservando revisión 2. También PASS para E2E de documentos, tareas y memoria. El esquema temporal y usuario fueron eliminados.

**Estado:** commit de implementación previo `69c2dac`; producción sigue en release `stage2-806899a`, sin migración de fichas. **Pendiente:** interfaz de ficha técnica por proyecto, pruebas de navegador y migración de respaldo aislado antes de solicitar autorización de publicación.
