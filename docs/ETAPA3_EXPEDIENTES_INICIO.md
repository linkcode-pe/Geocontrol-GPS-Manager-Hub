## 50. Etapa 3 — primera pantalla de expediente multiproyecto (18/10/2026)

Se creó `src/app/expedientes/page.tsx` y enlace en Documentación del panel principal. Vista inicial de **siete tarjetas por proyecto**: resumen, fases, tareas, documentos, ficha técnica, memoria independiente y continuidad. El selector de proyecto consulta los endpoints existentes filtrados por `projectId`; al cambiar de proyecto limpia datos previos mientras carga para evitar mezcla visual. Documentos y ficha tienen enlaces a sus editores. **Memoria independiente y bitácora están expresamente marcadas pendientes**, sin reutilizar memoria global ni simular persistencia.

**Verificación:** compilación Next 16.4 y TypeScript en `/opt/geocontrol-hub-build-stage2-806899a` completada PASS (22 rutas estáticas; `/expedientes` incluida). Falta prueba de navegador para aislamiento entre dos proyectos, comprobar móvil, completar memoria por proyecto y continuidad, y E2E de siete tarjetas.

**Producción:** permanece en `/opt/geocontrol-hub-releases/stage2-3c5bef9` con fichas técnicas publicadas. **No desplegar la Etapa 3 sin aprobación específica.** No se ha modificado el esquema ni los datos de producción para esta etapa.
