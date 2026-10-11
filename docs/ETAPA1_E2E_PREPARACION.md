## 24. Etapa 1 — prueba autenticada preparada, pendiente de ejecución (11/10/2026)

**Nuevo script:** `scripts/e2e-authenticated-task.mjs`. Requiere `HUB_E2E_URL`, `HUB_E2E_COOKIE` y `HUB_E2E_TEST_PROJECT_ID`; acepta **solo localhost por HTTP** para impedir modificaciones accidentales de la web pública. Comprueba que el proyecto dedicado existe; crea una tarea con marcador único, verifica su lectura por API, actualiza título/estado y comprueba persistencia por una segunda lectura. Por seguridad deja el registro de prueba identificado para revisión y limpieza manual controlada, sin borrar automáticamente información.

**Comprobaciones realizadas:** sintaxis de Node válida; ejecución sin configuración rechazada antes de acceder a red o datos. **No se ha ejecutado la prueba autenticada real**: falta entorno aislado con credenciales/sesión de prueba y proyecto dedicado. No se han creado registros.

**Siguiente paso:** preparar entorno aislado sin afectar archivos de producción, con usuario/proyecto exclusivamente de prueba; ejecutar script y revisar resultados. Resolver TypeScript en entorno aislado. No publicar cambios sin aprobación.
