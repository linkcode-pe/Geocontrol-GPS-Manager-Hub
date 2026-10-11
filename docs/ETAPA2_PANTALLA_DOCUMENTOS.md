## 33. Etapa 2 — pantalla de documentos (11/10/2026)

**Implementado en desarrollo, NO desplegado.** Nueva página `/documentos` (`src/app/documentos/page.tsx`) y enlace desde sección Documentación del panel principal. Selector de proyecto, lista de documentos, filtro para incluir archivados, nuevo/editar, archivo/desarchivo, historial y previsualización, recuperación como nueva revisión. Confirmación antes de descartar cambios y antes de recuperar/archivar; bloqueo de descarga de página con borrador sin guardar. La interfaz consume la API de documentos versionados de la Etapa 2. El editor no ofrece borrado físico.

**Verificaciones:** lint aislado 0 errores, 3 avisos preexistentes de scripts E2E; build aislado de Next.js y TypeScript OK, 20 páginas generadas. Se detectó y corrigió error de tipado de retorno en el primer build. **No se ha realizado una prueba de navegador sobre esta pantalla ni aplicado las migraciones productivas.** Los E2E autenticados de la API de documentos y memoria ya habían pasado en esquema desechable.

**Pendiente:** prueba de migración contra copia de datos con documentos preexistentes, revisión de permisos de edición en interfaz, pruebas visuales/navegador, integración y publicación con respaldo y reversión. Producción sigue en release estable de Etapa 1.
