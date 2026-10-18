## 54. Etapa 3 — pruebas visuales preparadas, bloqueadas por dependencia de Chromium (18/10/2026)

Se creó `scripts/e2e-project-memory-browser-isolated.mjs`, ampliando el E2E de navegador con creación de memorias A/B en esquema desechable, edición/historial/recuperación por UI, viewer de solo lectura, vista móvil sin desplazamiento horizontal y expediente de siete tarjetas. **La prueba NO pasó ni llegó a ejecutarse en navegador**: Puppeteer Chromium falló al iniciar con código 127 porque falta la biblioteca del sistema `libatk-1.0.so.0`. No hay Chromium alternativo en PATH. El esquema desechable se limpió. **No afirmar verificación visual** hasta resolver la dependencia y repetir.

Las pruebas de API E2E y la restauración/migración de memorias sobre respaldo real ya habían pasado en esquemas aislados. Producción no modificada; queda pendiente resolver dependencia de navegador en entorno de pruebas, ejecutar E2E visual, corregir eventuales problemas y completar continuidad/decisiones.
