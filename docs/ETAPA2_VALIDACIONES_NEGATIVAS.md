## 41. Etapa 2 — pruebas negativas de permisos y validación de versiones (18/10/2026)

Se amplió `scripts/e2e-stage2-documents-isolated.mjs` con pruebas HTTP reales de API: usuario `viewer` obtiene **403** al intentar actualizar, archivar o restaurar documento; puede leer el historial (**200**). Revisión no numérica devuelve **400**, revisión inexistente **404** y documento inexistente **404**. Se mantienen pruebas de autenticación, versiones, 409 por concurrencia, archivo reversible, restauración sin pérdida y auditoría.

**Resultado:** E2E autenticado **PASS**, salida 0, esquema MySQL temporal eliminado. Producción sigue en Etapa 1, sin migraciones de Etapa 2. Próximo paso: publicación solo tras aprobación explícita y respaldo actualizado.
