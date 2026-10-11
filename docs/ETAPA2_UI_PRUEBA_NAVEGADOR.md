## 36. Etapa 2 — mejoras de interfaz y prueba de navegador preparada (11/10/2026)

**Cambios:** `src/app/documentos/page.tsx` ahora permite consultar título/contenido e historial a usuarios lectores sin controles de escritura, confirma descarte de borradores al cambiar proyecto o filtro, bloquea edición de archivados y operaciones de archivo/restauración con cambios sin guardar, limpia historial al ocultar documento. Estilos responsivos de formularios, botones, selectores y versiones en `src/app/design-system.css`.

**Validación:** lint aislado 0 errores (3 avisos en scripts E2E), Next.js build aislado y TypeScript correctos (20 páginas). Se añadió `scripts/e2e-stage2-browser-isolated.mjs`, que replica E2E autenticado de API sobre esquema desechable e intenta abrir `/documentos` con Puppeteer y verificar lista, editor e historial. **No pasó la prueba de navegador**: Chromium instalado en caché no puede arrancar por falta de `libatk-1.0.so.0` y otras bibliotecas de SO. El test falló con código 1, limpió esquema temporal. **No instalar dependencias de SO en producción sin evaluación/autorización.** La API sí había superado su E2E previo.

**Pendiente:** ejecutar navegador en entorno aislado con dependencias completas, verificar apariencia móvil y escritorio; después preparar release con migraciones respaldadas, publicación aprobada y smoke tests. No desplegado.
