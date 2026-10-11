## 37. Etapa 2 — comprobación autenticada de permisos y página (11/10/2026)

Se amplió `scripts/e2e-stage2-documents-isolated.mjs` con pruebas reales sobre Next.js aislado y esquema MySQL desechable: `/documentos` sin sesión redirige; con sesión devuelve 200 y el encabezado correcto; rol `viewer` recibe `canEdit=false` y 403 al intentar crear; propietario recibe `canEdit=true`. La prueba vuelve a recorrer tareas, memoria, documentos, historial, 409, archivo/desarchivo y recuperación. Resultado **PASS**, salida 0, esquema desechable eliminado. No se ejecutó navegador Chromium: sigue pendiente prueba visual por dependencias del sistema faltantes.

**Producción** activa, sin despliegue de Etapa 2 ni migraciones. Próximo: cerrar validación visual en entorno adecuado y preparar despliegue sujeto a aprobación previa.
