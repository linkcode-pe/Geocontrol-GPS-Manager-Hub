# Auditoría general — Geocontrol Project Hub
Fecha: 23/10/2026. Alcance: inspección estática de código, rutas, estilos, permisos visibles, pruebas y disponibilidad pública sin autenticación. No equivale a una auditoría de seguridad ofensiva ni a una evaluación visual completa autenticada.

## Estado comprobado
- Producción activa: release `phase6-expedientes-metrics-7af386e`, servicio `active`, NRestarts=0.
- `https://hub.geocontrol.online/login` responde 200; `/expedientes` sin sesión redirige (307); `/api/portfolio-summary` sin sesión responde 401.
- `npm test`: 72 pruebas, 54 superadas, 18 omitidas, 0 fallos.
- `npm run lint`: FALLA con 1 error (`react-hooks/set-state-in-effect` en `src/app/page.tsx:36`) y 12 advertencias, principalmente variables sin usar en scripts E2E; una en `src/app/expedientes/page.tsx`.
- Memoria principal `hub_project_guide` de MySQL consultada en solo lectura: revisión 154. El encabezado inicial todavía describe el estado de etapa 4 del 18/10, por lo que el resumen de portada de esa memoria necesita actualización conservadora, sin sobrescribir su historial.

## Hallazgos priorizados
### P1 — Consistencia y confiabilidad
1. Corregir el error de lint del estado inicial de sección (`src/app/page.tsx:36`); después establecer lint sin errores como puerta de calidad de CI. No se constató fallo de ejecución causado por este aviso.
2. Consolidar el shell y la navegación: `src/app/page.tsx` y `src/app/project-workspace.tsx` duplican menú, tema, cuenta y navegación. En el segundo el tema se inicializa independientemente (`useState(false)`), de modo que no se mantiene al cambiar de vista. Extraer shell compartido y persistir preferencia de tema.
3. Uniformar las pantallas de login y cambio de contraseña, que usan estilos inline claros en lugar de los tokens visuales del resto de la aplicación; incluir estados de carga, foco y mensajes homogéneos.
4. Estandarizar avisos y confirmaciones: coexisten `role=alert`, `role=status`, `window.confirm` y `window.prompt`. Introducir componente compartido de notificaciones, confirmación accesible y estados de operación, manteniendo confirmación fuerte para borrados irreversibles.

### P2 — Jerarquía, accesibilidad y productividad
5. Simplificar el flujo principal: Dashboard → Proyectos → Fases → Tareas; distinguir vistas globales de contexto de proyecto con una cabecera persistente y migas de pan. Agrupar Documentación, Expedientes y Continuidad como recursos relacionados sin ocultarlos.
6. Definir jerarquía visual consistente: título de página, selector de proyecto, KPI relevantes, acciones principales, filtros, lista/detalle y acciones destructivas secundarias. Reducir densidad de controles simultáneos en Tareas, usando revelación progresiva de filtros y acciones.
7. Verificar teclado, foco, contraste, lectores de pantalla, `aria-expanded` y áreas táctiles >=44px en todas las rutas. Hay estilos `focus-visible` y reglas móviles parciales, pero no se ha completado una prueba WCAG automatizada/manual.
8. Completar estados vacíos, error, carga, reintento y guardado en todos los módulos. Evitar presentar datos anteriores mientras se cambia de proyecto o mientras falla una petición.
9. Añadir accesos rápidos desde el expediente a Fases/Tareas y ficha de contexto; los enlaces actuales favorecen Documentos, Ficha, Memoria y Continuidad.

### P3 — Evolución y operación
10. Crear biblioteca de componentes y tokens para formularios, tarjetas, barras de progreso, estados, tablas y avisos; reducir estilos inline y CSS acumulativo (`design-system.css` ~523 líneas).
11. Implementar pruebas visuales con sesión autenticada en 375px, 768px y escritorio, modo claro/oscuro, navegación por teclado y flujos de creación/edición/borrado con usuario viewer/editor/admin.
12. Añadir monitorización de latencia, errores de API y salud del servicio, con alertas accionables, sin exponer datos sensibles.
13. Revisar paginación/carga progresiva y consultas de resumen conforme aumente el número de proyectos; actualmente el endpoint de portafolio utiliza subconsultas por proyecto y por tipo de registro.
14. Revisar endurecimiento de cabeceras y políticas de contenido, límites de sesión, permisos y recuperación de backups mediante una auditoría específica antes de afirmar cumplimiento de seguridad.

## Plan propuesto
- Sprint 1 (P1): lint, shell único, tema persistente, feedback accesible. Pruebas y publicación aislada.
- Sprint 2 (P2): jerarquía de Tareas, navegación contextual, accesibilidad y responsive. Validación con capturas autenticadas.
- Sprint 3 (P3): componentes compartidos, observabilidad, rendimiento y auditoría de seguridad.

## Límites y decisiones
No se modificó producción ni datos de negocio durante la auditoría. No se han comprobado métricas Lighthouse ni auditoría visual autenticada completa; las recomendaciones estéticas son hipótesis fundadas en estructura/CSS que requieren validación visual. Antes de desplegar mejoras, mantener release aislada, E2E, backup y aprobación del usuario.

## Avance Etapa 1 — 23/10/2026
Commit `6031541` en `feat/mysql-auth`: corregido error `react-hooks/set-state-in-effect` en inicialización de sección, eliminado estado sin lectura en Expedientes, creado `useWorkspaceTheme` compartido para conservar la preferencia claro/oscuro entre Dashboard, Expedientes y Continuidad mediante almacenamiento local (con fallback), y añadida semántica accesible al botón de menú móvil. Validación: TypeScript PASS, ESLint 0 errores/11 advertencias (scripts E2E), `npm test` 54 PASS/18 SKIP/0 FAIL, `git diff --check` PASS. Producción sin cambios. Pendiente: E2E visual del tema, unificación del shell de navegación, avisos y confirmaciones; aprobación explícita para desplegar. La memoria principal MySQL sigue en revisión 154 y no fue modificada porque el trabajo de esta etapa aún no se ha publicado.

## Avances posteriores de Etapa 1 — navegación y feedback
- `6b5c047`: menú de ocho secciones centralizado en `src/lib/workspace-navigation.ts` y consumido desde Dashboard y ProjectWorkspace. TypeScript PASS; lint 0 errores/11 warnings; 54 pruebas PASS/18 SKIP/0 FAIL.
- `621d6aa`: componente accesible `SystemFeedback` para error/éxito/carga, incorporado a Documentos, Fichas técnicas, Memorias y Continuidad. No altera las confirmaciones destructivas ni la lógica de guardado. TypeScript PASS; lint 0 errores/11 warnings; 54 pruebas PASS/18 SKIP/0 FAIL.
- Pendiente de Etapa 1: consolidación física del shell, unificación del resto de alertas y confirmaciones, E2E visual con sesión en móvil/escritorio, build aislado y autorización explícita antes de producción. Memoria principal MySQL no editada aún; conservar revisión 154 como fuente prioritaria.
