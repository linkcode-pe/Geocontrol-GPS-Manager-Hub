## 58. Encabezado de memoria corregido y contador de tareas preparado (18/10/2026)

Se corrigió el encabezado desactualizado de la memoria principal MySQL sin sustituir el documento completo: fecha 18/10/2026 y estado real «Etapa 3 publicada; Etapa 4 pendiente», guardado como revisión 47 con historial y auditoría. Se alineó el encabezado de `docs/PROJECT_CONTEXT.md` en GitHub; las secciones históricas conservan sus fechas originales por trazabilidad.

Se corrigió en `src/app/expedientes/page.tsx` el contador de tareas completadas: ahora usa `doneCount` agregado por la API de proyectos para **todas** las tareas del proyecto, en vez de contar únicamente las primeras 200 tareas cargadas. Compilación Next.js y TypeScript **PASS** en `/opt/geocontrol-hub-build-stage2-806899a`, 23 páginas estáticas, sin tocar el build de producción. **Este ajuste del contador NO está publicado**, necesita aprobación específica de despliegue.

Siguiente paso: iniciar Etapa 4, bitácora de decisiones/hitos y siguiente acción por proyecto, con migración aditiva, API, roles, historial y pruebas aisladas antes de pedir autorización de publicación.
