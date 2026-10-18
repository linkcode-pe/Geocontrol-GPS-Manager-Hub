## 61. Etapa 4 — revisión UX final y protección de borradores (18/10/2026)

Se añadió en `src/app/continuidad/page.tsx` advertencia al cambiar de proyecto si el formulario tiene título, detalles o fecha sin guardar: cancelar conserva el proyecto y el borrador; confirmar limpia el formulario y cambia de proyecto. Se deshabilitó el selector durante guardados/cambios de estado y se protegió la recarga de datos contra respuestas tardías de operaciones previas al cambio de proyecto. Esto evita registrar accidentalmente una decisión en otro proyecto o perder trabajo sin advertencia.

Se amplió `scripts/e2e-continuity-browser-isolated.mjs` con pruebas reales en Chromium para cancelar y confirmar el cambio con borrador. **PASS exit 0**, además de crear decisión, completar, historial, móvil sin overflow, viewer, expedientes y regresiones de memoria/documentos/guía. `npm run build` y TypeScript **PASS** en build aislado (24 páginas). El ensayo de restauración de respaldo real y migración aditiva Etapa 4 también pasó previamente.

**Producción intacta:** sigue release `stage3-dbd9df3`; no se aplicó migración Etapa 4. La autorización recibida fue para **continuar con Etapa 4**, no para publicar explícitamente; solicitar autorización específica de despliegue antes de aplicar la migración y cambiar el release.
