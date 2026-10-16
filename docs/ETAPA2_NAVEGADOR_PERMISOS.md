## 40. Etapa 2 — permisos de consulta verificados en navegador (16/10/2026)

Se amplió `scripts/e2e-stage2-browser-isolated.mjs` con usuario `viewer` temporal real. En navegador Chromium headless y viewport móvil 375×812, se verificó que el lector puede acceder a `/documentos`, seleccionar un documento, leer su contenido y abrir el historial, pero **no** aparece el editor ni el botón para crear documentos. Se mantienen pruebas de propietario en escritorio y móvil y E2E de documentos/memoria/tareas.

**Resultado:** `PASS: browser desktop/mobile document editor, history, viewer read-only permissions`; `PASS` E2E completo; salida 0; esquema y usuario MySQL de prueba eliminados. No se modificó producción. Siguiente paso: publicación Etapa 2 solo con aprobación específica, backup previo y procedimiento de reversión.
