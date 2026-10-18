## 55. Etapa 3 — E2E visual superado con Chromium aislado (18/10/2026)

Se resolvieron dependencias de Chromium para las pruebas sin instalar paquetes globalmente: `apt download` + `dpkg-deb -x` bajo `/opt/geocontrol-hub-browser-test-libs`, ejecutando Puppeteer con `LD_LIBRARY_PATH` apuntando exclusivamente a esas bibliotecas. No se modificaron librerías del sistema ni la versión publicada.

Se corrigió `scripts/e2e-project-memory-browser-isolated.mjs` para que la página viewer utilice un contexto de navegador independiente (evita sobrescribir cookie owner), se separó del bloque antiguo de pruebas visuales de ficha técnica, y se espera la carga asíncrona de siete tarjetas antes de comprobarlas.

**Evidencia:** `LD_LIBRARY_PATH=/opt/geocontrol-hub-browser-test-libs/lib/usr/lib/x86_64-linux-gnu HUB_E2E_APP_DIR=/opt/geocontrol-hub-build-stage2-806899a node e2e-project-memory-browser-isolated.mjs` terminó **exit 0**, PASS: UI de memorias escritorio/móvil, guardar, historial, restauración, viewer read-only, aislamiento A/B, expediente siete tarjetas, sin scroll horizontal; regresiones de documentos también PASS. El esquema temporal y usuario de prueba se limpiaron. Las pruebas visuales de ficha técnica se habían retirado de este script y **no se incluyen** en esta afirmación de PASS.

**Pendiente:** terminar continuidad/decisiones y revisar UX de enlaces de documentos/fichas con proyecto seleccionado. Etapa 3 no publicada, migración no aplicada en producción. Requiere aprobación específica para desplegar.
