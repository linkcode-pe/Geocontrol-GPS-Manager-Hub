## 38. Etapa 2 — navegador real verificado en escritorio y móvil (16/10/2026)

**Bloqueo resuelto sin instalar paquetes globalmente:** se descargaron paquetes .deb oficiales de bibliotecas gráficas en `/opt/geocontrol-hub-browser-libs/packages` y se extrajeron solo a `/opt/geocontrol-hub-browser-libs/root`. No se modificó el sistema de paquetes instalado ni el servicio productivo. Chromium headless existente funciona con `LD_LIBRARY_PATH` limitado al proceso de prueba. `scripts/e2e-stage2-browser-isolated.mjs` admite `HUB_CHROME_PATH` para seleccionar el ejecutable.

**Resultados reales:** E2E Puppeteer autenticado de `/documentos` verifica lista, editor, contenido, historial; repite en viewport móvil 375×812 y comprueba que no existe desplazamiento horizontal. También pasa el E2E de API (tareas, memoria, documentos, historial, archivo/desarchivo, conflictos 409 y restauración no destructiva). **PASS** y salida 0; base MySQL temporal eliminada. Prueba de salud de respaldos: OK.

**Pendiente:** preparar paquete de release y procedimiento de migración/rollback; producción sigue en release de Etapa 1, sin migraciones de Etapa 2. Los cambios productivos requieren aprobación previa.
