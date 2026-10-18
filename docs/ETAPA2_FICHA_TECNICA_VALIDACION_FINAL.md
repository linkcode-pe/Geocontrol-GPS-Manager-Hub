## 47. Etapa 2 — migración real restaurada y acciones UI completas (18/10/2026)

**Ensayo de migración aprobado:** nuevo `scripts/verify-technical-sheet-migration-isolated.py` valida inventario de tablas permitido del respaldo ya migrado a Etapa 2, reescribe directivas del esquema a un nombre temporal validado, restaura el respaldo `geocontrol-hub-20261018T165609Z.sql.gz`, aplica únicamente `20261018_technical_sheets.sql` en la copia, inserta/lee ficha y versión y verifica conservación de 3 proyectos, 0 documentos y revisión de memoria global. **PASS** y limpieza del esquema temporal.

**Prueba de navegador ampliada:** `scripts/e2e-technical-sheet-browser-isolated.mjs` ahora realiza edición real con teclado, clic Guardar (revisión 2), selección de revisión 1, confirmación Recuperar (revisión 3), y comprueba que revisión 2 sigue recuperable. Corregido el test para restablecer las cookies del propietario y lector entre páginas Puppeteer que comparten contexto; no era defecto de permisos de la API. **PASS, exit 0 (~28 s)** para guardar/restaurar por UI, escritorio/móvil, historial, lector sin edición, documentos y memoria; base/usuario temporal limpiados.

**Pendiente:** revisión final de seguridad y plan de despliegue de ficha, respaldo nuevo previo a publicación, aprobación explícita de producción. Ninguna migración de ficha ni cambio de release aplicado a producción.
