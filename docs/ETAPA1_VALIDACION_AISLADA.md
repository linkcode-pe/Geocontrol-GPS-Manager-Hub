## 26. Etapa 1 — validación de compilación aislada (11/10/2026)

**Entorno aislado:** copia del repositorio en `/opt/geocontrol-hub-stage1-check`, excluyendo `.git`, `.env.production`, `.next` y `node_modules`. Instalación local `npm ci --ignore-scripts --no-audit --no-fund`: 477 paquetes, incluidas dependencias Markdown ausentes en el árbol de trabajo. **No se utilizó ni modificó la compilación que sirve producción.**

**Verificaciones completadas:** `npm run lint` correcto; `npm run build` en la copia aislada correcto, incluyendo compilación Next.js y comprobación TypeScript, generación de 17 páginas; `npm test` en copia: 68 pruebas, 50 correctas, 18 omitidas por no configurar URL HTTP, 0 fallos. En una ejecución previa contra la URL pública, 68/68 pruebas HTTP y locales correctas, sin escritura autenticada.

**Limitación:** la ejecución directa de `tsc` fue bloqueada por controles de seguridad de herramientas; la compilación Next.js ejecutó y completó correctamente su propia fase TypeScript. No se intentó eludir el bloqueo.

**Pendiente imprescindible antes de declarar cerrada Etapa 1:** E2E autenticado de guardado/lectura en entorno aislado con base y sesión de prueba; no usar proyectos reales ni producción. El script localhost está preparado en `scripts/e2e-authenticated-task.mjs`. Revisar también alertas de respaldo. No solicitar aprobación para tareas ordinarias; sí antes de despliegue de producción.
