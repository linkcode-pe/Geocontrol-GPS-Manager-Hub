## 46. Etapa 2 — interfaz y navegador de fichas técnicas (18/10/2026)

**Desarrollado sin publicar:** página `/fichas-tecnicas` con selector de proyecto, contenido técnico editable, aviso de cambios sin guardar, historial, vista previa, recuperación como nueva revisión y lectura para viewer. Enlace desde sección Documentación del panel. Advertencia explícita de no incluir secretos.

**Verificado en entorno aislado:** `npm run lint` sin errores (5 advertencias de variables no usadas en scripts E2E), `npm run build` y TypeScript correctos, ruta `/fichas-tecnicas` compilada. Prueba de navegador `scripts/e2e-technical-sheet-browser-isolated.mjs` **PASS, exit 0 (~40 s)** con Puppeteer: escritorio 1280, móvil 375, lectura de ficha e historial, usuario viewer sin editor ni botón Guardar, sin overflow horizontal; regresión documentos y memoria también PASS. Esquema y usuario MySQL temporales limpiados.

**Pendiente:** prueba de migración de ficha en restauración aislada del respaldo actual (sin volver a aplicar migraciones Etapa 2 ya presentes), ampliar prueba UI para guardar/recuperar con clics y confirmar criterios de publicación. No aplicar migración ni desplegar sin aprobación específica. Producción permanece `stage2-806899a`.
