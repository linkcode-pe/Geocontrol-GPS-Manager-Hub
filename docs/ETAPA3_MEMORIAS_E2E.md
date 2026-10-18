## 52. Etapa 3 — prueba E2E aislada de memorias multiproyecto (18/10/2026)

Creado `scripts/e2e-project-memory-isolated.mjs`, basado en el E2E existente de fichas técnicas, con creación de esquema desechable `hub_restore_check_<12hex>`, usuario MySQL temporal, migración de memorias aplicada **solo en ese esquema**, servidor Next local y autenticación real. Se prueban dos proyectos A/B, memorias diferentes, lectura cruzada sin mezcla, revisiones independientes, acceso viewer de solo lectura, edición owner, CSRF sin Origin, validaciones, 409 por versión obsoleta, historial, 404 de versión inexistente y restauración de versión antigua como nueva revisión sin borrar la intermedia. Se mantienen pruebas de regresión de fichas técnicas, documentos y memoria global.

**Evidencia:** `HUB_E2E_APP_DIR=/opt/geocontrol-hub-build-stage2-806899a node e2e-project-memory-isolated.mjs` ejecutado desde el build aislado, **exit 0**, mensajes PASS de aislamiento A/B, seguridad, restauración y regresiones; esquema desechable limpiado.

**Pendiente:** prueba navegador/móvil de memorias y expediente, verificar restauración aislada desde respaldo real con migración nueva, revisar paginación de tarjetas y UX antes de considerar Etapa 3 lista. Producción sigue en `stage2-3c5bef9` sin migración de memorias ni publicación de Etapa 3. Despliegue requiere aprobación específica.
