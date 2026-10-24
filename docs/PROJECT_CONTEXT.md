# Geocontrol Project Hub — memoria y guía permanente

**Última actualización:** 18 de octubre de 2026 (Etapa 4, navegación móvil y Workspace publicados)  
**Estado:** Etapa 4, navegación móvil y unificación visual del Workspace publicadas y verificadas en `https://hub.geocontrol.online` (release `workspace-24994ef`). Validación visual autenticada final pendiente. La rama de desarrollo y el release publicado son entornos distintos.  
**Repositorio:** `linkcode-pe/Geocontrol-GPS-Manager-Hub`  
**Rama de trabajo:** `feat/mysql-auth`  
**Rama principal:** `main`

## 1. ¿Para qué sirve?

Geocontrol Project Hub es una plataforma privada multiproyecto para que Jim y ChatGPT organicen, desarrollen y administren diversos proyectos presentes y futuros. Centraliza proyectos, fases, tareas, prioridades, fechas, documentos, decisiones y actividad. **No es Traccar ni el panel de rastreo GPS.** La integración futura con Traccar será exclusivamente por una API backend autorizada.

## 2. ¿Cómo funciona?

- Web responsive para escritorio y celular, diseño ejecutivo con temas claro y oscuro.
- Inicio de sesión y roles `owner`, `admin`, `editor` y `viewer`.
- Backend Next.js/TypeScript, API autenticada y base MySQL **exclusiva** `geocontrol_hub`.
- Proyectos contienen fases; las tareas pertenecen a proyectos y opcionalmente a fases, con estado, prioridad y vencimiento.
- La aplicación registra actividad de operaciones relevantes.
- El acceso a MySQL es del servidor; el navegador nunca debe recibir credenciales SQL.

## 3. Flujo obligatorio de trabajo

1. ChatGPT analiza y propone cambios.
2. Desktop Commander remoto inspecciona, edita y verifica el proyecto en el servidor autorizado.
3. GitHub guarda cada cambio mediante commits en la rama de desarrollo, usando la llave SSH ya configurada.
4. Se revisan pruebas, seguridad, migraciones y diferencias con `main`.
5. **Producción solo se actualiza con aprobación explícita**, respaldo comprobado y posibilidad de reversión.

No dar por publicado algo solo porque está en GitHub. No dar por correcto un despliegue solo porque el servicio responde: comprobar páginas, archivos CSS/JS, inicio de sesión y operaciones reales.

## 4. Seguridad y límites

- No consultar, alterar ni migrar las bases `traccar` y `traccar_dev`.
- No revelar llaves SSH, secretos, contraseñas, tokens ni archivos `.env`.
- No inventar datos, no borrar información y no restaurar copias sin diagnóstico y autorización.
- Migraciones SQL revisadas, reversibles cuando sea posible, y ejecutadas una sola vez.
- Mantener los permisos por rol, protección de sesiones, validación de origen y auditoría.

## 5. Infraestructura y repositorio

- Web: `https://hub.geocontrol.online`.
- Servidor autorizado mediante Remote Desktop Commander: `geocontrol.online`.
- Directorio actual del repositorio: `/opt/geocontrol-project-hub`.
- Servicio systemd: `geocontrol-hub`, puerto local `3188`, proxy Nginx.
- GitHub: `https://github.com/linkcode-pe/Geocontrol-GPS-Manager-Hub`.
- La llave SSH del servidor funciona para `git push`. La integración GitHub de ChatGPT devolvió error 403 al intentar crear un pull request; no implica que falle SSH.

**Riesgo confirmado:** el servicio público utiliza el mismo directorio en que se ejecutaban compilaciones de desarrollo. Esto causó pérdida temporal de archivos estáticos y un error de carga en el navegador. Se reconstruyó la aplicación y se verificó que el login y sus archivos CSS/JS respondían correctamente. **Prioridad alta:** separar compilación y ejecución mediante directorios/releases aislados antes de seguir construyendo en el servidor.

## 6. Estado funcional comprobado

- API y esquema MySQL para proyectos, fases, tareas, usuarios y auditoría.
- Gestión de tareas con filtros, estados, prioridades, fechas y mejoras de edición móvil.
- Protección ante cambios sin guardar, guardados duplicados y errores de red.
- Última validación general: **58/58 pruebas**, lint y build correctos (antes de la incidencia de archivos estáticos).
- Prueba aislada de roles y operaciones SQL: `owner`, `admin` y `editor` crearon, editaron y eliminaron correctamente; `viewer` no pudo modificar.
- En la inspección del 11/10/2026, MySQL real conservaba **3 proyectos, 5 fases y 1 tarea**. Es un recuento puntual, no un inventario completo de los datos históricos esperados.

## 7. Incidencia abierta: nuevos datos no aparecen

El usuario informa que la web **no registra datos nuevos**. La conexión directa a MySQL con la configuración de la aplicación funciona, y las operaciones CRUD funcionan en una base de prueba aislada. **Esto no prueba que guardar desde la sesión real funcione.** No se ha identificado aún la causa exacta: investigar peticiones HTTP autenticadas reales, errores de interfaz, permisos, sesión y recarga de datos. No afirmar que la incidencia está resuelta hasta reproducir y verificar un guardado real de extremo a extremo sin afectar información existente.

## 8. Evolución prevista

**Prioridad 1:** diagnosticar y reparar el guardado real en la web, con pruebas de creación y lectura.  
**Prioridad 2:** aislar producción del entorno de desarrollo y preparar despliegues reversibles.  
**Prioridad 3:** completar revisión de seguridad, respaldo/restauración y propuesta de fusión a `main`.  
**Prioridad 4:** enriquecer documentación persistente, historial, decisiones, métricas y seguimiento multiproyecto.  
**Futuro:** integración backend autorizada con Traccar, sin modificar sus bases directamente.

## 9. Estado GitHub y documentación

- Último commit confirmado antes de esta guía: `57b8433` (`Document Hub release review and safe deployment gates`).
- La rama `feat/mysql-auth` estaba sincronizada con GitHub.
- Guía de revisión previa: `docs/release-review.md`.
- Verificar siempre `git status -sb`, historial, pruebas y estado real del servicio al retomar.
- **Actualizar esta memoria en cada hito significativo**: cambios hechos, pruebas realizadas, commit, si se publicó o no, incidencias y siguiente paso.

## 10. Instrucción para el siguiente chat

> Estamos trabajando en **Geocontrol Project Hub** (`hub.geocontrol.online`), no en Traccar Manager. Lee íntegramente `docs/PROJECT_CONTEXT.md` del repositorio `linkcode-pe/Geocontrol-GPS-Manager-Hub`, revisa el estado real por Desktop Commander remoto y GitHub, y continúa con las prioridades e incidencias abiertas. No supongas que los cambios en GitHub ya están publicados. No modifiques producción sin autorización. Mantén esta guía actualizada después de cada hito.

**Importante:** el documento conserva el contexto técnico, pero un chat nuevo no lo consulta automáticamente si no tiene acceso al repositorio o si no se comparte su enlace/contenido.


## 12. Ficha técnica para continuar el proyecto en nuevos chats

### Identidad, carpetas y repositorio

- Proyecto único: **Geocontrol Project Hub**, independiente de Traccar Manager.
- Repositorio GitHub único: `linkcode-pe/Geocontrol-GPS-Manager-Hub`, remoto SSH `git@github.com:linkcode-pe/Geocontrol-GPS-Manager-Hub.git`.
- Carpeta principal de código y desarrollo: `/opt/geocontrol-project-hub`.
- Rama de trabajo: `feat/mysql-auth`; rama principal: `main`. Comprobar siempre `git status -sb` y `git log -1 --oneline`.
- Servidor remoto autorizado: `geocontrol.online`, gestionado mediante Desktop Commander.
- Web pública: `https://hub.geocontrol.online`.
- Carpeta de versiones compiladas: `/opt/geocontrol-hub-releases/`. **Nunca compilar en el directorio que ejecuta producción**.
- Servicio systemd: `geocontrol-hub`; puerto local `127.0.0.1:3188`; proxy HTTPS mediante Nginx.
- Versión activa al redactar esta sección: `/opt/geocontrol-hub-releases/markdown-guide`. Confirmar siempre con `systemctl show geocontrol-hub -p WorkingDirectory --value`.
- Configuración de release activo: `/etc/systemd/system/geocontrol-hub.service.d/release.conf`. Cambiarla únicamente en despliegues aprobados, con reversión preparada.

### Tecnologías y seguridad

- Next.js 16.4, React 19.3, TypeScript y Node.js; diseño ejecutivo responsive, claro y oscuro.
- Backend API de Next.js; conexión a MySQL exclusivamente en servidor mediante `mysql2/promise` y pool en `src/lib/db.ts`.
- Sesiones JWT firmadas con `jose`, cookie `geocontrol_hub_session` y vencimiento configurado de 8 horas.
- Roles: `owner`, `admin`, `editor`, `viewer`. Solo `owner` y `admin` editan esta memoria.
- Credenciales privadas en `.env.production`, nunca en GitHub o chats. Variables relevantes: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `AUTH_SECRET`. No divulgar valores, tokens ni llaves SSH.
- GitHub utiliza una llave SSH configurada en el servidor. No es necesario volver a solicitarla si `git push` funciona.

### Una base de datos exclusiva, varias tablas

La base única del Hub es **`geocontrol_hub`**. Contiene varias tablas independientes (no una sola tabla):

| Tabla | Uso |
| --- | --- |
| `hub_users` | Usuarios y roles |
| `hub_projects` | Proyectos |
| `hub_phases` | Fases |
| `hub_tasks` | Tareas |
| `hub_documents` | Documentos |
| `hub_audit_log` | Auditoría |
| `hub_login_attempts` | Control de accesos |
| `hub_project_guide` | Esta memoria editable, revisión y autor |

**Prohibido** consultar, modificar o migrar las bases `traccar` y `traccar_dev`. Cualquier integración futura con Traccar debe hacerse mediante una API backend autorizada.

### Archivos importantes

| Archivo o carpeta | Función |
| --- | --- |
| `src/app/page.tsx` | Panel principal y navegación |
| `src/app/design-system.css` | Diseño de la web |
| `src/app/api/` | Rutas API |
| `src/app/api/project-guide/route.ts` | Lectura y guardado de memoria |
| `src/app/guia-proyecto/` | Pantalla y copia para ChatGPT |
| `src/lib/db.ts` | Conexión SQL |
| `src/lib/auth.ts` | Sesiones |
| `database/schema.sql` | Esquema de base |
| `database/migrations/` | Migraciones |
| `tests/` | Pruebas |
| `.github/workflows/verify.yml` | GitHub Actions |
| `docs/PROJECT_CONTEXT.md` | Copia de referencia en GitHub |
| `docs/release-review.md` | Plan previo a publicación |
| `scripts/backup-hub.py` | Respaldos |
| `scripts/verify-restore-hub.py` | Verificación de restauración |

### Flujo y continuidad

1. ChatGPT revisa esta memoria y el estado real del servidor; Desktop Commander realiza cambios; GitHub guarda versiones; producción recibe únicamente versiones aprobadas.
2. Ejecutar `npm ci`, `npm test`, `npm run lint` y `npm run build` **en un directorio de release aislado**. No alterar archivos de la instancia activa durante compilaciones.
3. Antes de publicar: revisar seguridad, migraciones, respaldo y plan de reversión. Después: comprobar login, CSS/JS, lectura y guardado real desde navegador.
4. La **fuente viva de esta memoria** es MySQL (`hub_project_guide`); el Markdown de GitHub es una copia de referencia. Nunca reemplazar las correcciones del usuario con una versión anterior.
5. En cada hito actualizar fecha, decisiones, cambios, pruebas, commit, estado de producción e incidencias abiertas. Verificar siempre los datos dinámicos de esta ficha.
6. Sigue abierta la incidencia reportada sobre **datos nuevos que no se registran desde la web**: la conexión SQL y las pruebas aisladas no sustituyen una prueba real autenticada de extremo a extremo.


## 13. Revisión integral del Hub y propósito multiproyecto — 11/10/2026

### Definición principal corregida por Jim

**Geocontrol Project Hub es la plataforma privada central para administrar múltiples proyectos presentes y futuros de Jim con apoyo de ChatGPT.** Su objetivo es convertir ideas en proyectos organizados, con fases, tareas, responsables futuros, prioridades, fechas, documentación, seguimiento, decisiones y contexto persistente. **No es un proyecto dedicado principalmente a Traccar Manager**: Traccar Manager podría gestionarse como uno de muchos proyectos independientes. La memoria de este documento describe **la propia plataforma Hub**; cada proyecto administrado debe tener su propio contexto y documentación.

### Inventario funcional contrastado con código actual

- **Dashboard global:** métricas de cantidad de proyectos, fases y tareas; gráficos de avance por proyecto y distribución por estados; alertas de vencimientos, próximos plazos y prioridades urgentes; cartera de proyectos, hoja de ruta y próximas tareas del proyecto seleccionado.
- **Proyectos:** crear, editar nombre/descripción, cambiar estado (planificación, activo, pausado, completado), buscar, filtrar, ordenar, consultar avance, entrar a fases; descargar resumen general CSV, informe individual HTML y exportación CSV.
- **Fases:** crear, renombrar, actualizar estado, visualizar progreso y tareas asociadas, eliminar con restricciones; cada fase pertenece a un proyecto.
- **Tareas:** crear, editar, marcar completadas/reabrir y eliminar; asociar a fase opcional, asignar prioridad y fecha límite; buscar, filtrar, ordenar y agrupar por vencimiento; planificación semanal y alertas; mensajes de guardado, prevención de duplicados y confirmación al abandonar cambios sin guardar.
- **Documentación:** sección con documentos de referencia generados desde la interfaz; la edición persistente por proyecto y su historial **no están implementados aún en esta sección**, aunque existe la tabla `hub_documents`. No confundir los documentos de muestra con un gestor documental completo.
- **Actividad:** registro de auditoría de operaciones, filtros por tipo y fechas, paginación y exportación CSV.
- **Memoria del Hub:** página protegida `/guia-proyecto`, representación Markdown, edición para `owner`/`admin`, revisión optimista y botón «Copiar contexto para ChatGPT». Su fuente de verdad es la fila id 1 de `geocontrol_hub.hub_project_guide`; GitHub conserva referencia técnica.
- **Acceso y seguridad:** login, logout, cambio de contraseña, sesiones JWT, roles, limitación de intentos de acceso y protección de origen en operaciones de escritura.

### Inventario técnico revisado

- Aplicación Next.js 16.4 + React 19.3 + TypeScript, código en `/opt/geocontrol-project-hub`, repositorio único `linkcode-pe/Geocontrol-GPS-Manager-Hub`, rama de trabajo `feat/mysql-auth`.
- Código principal: `src/app/page.tsx`; estilos `src/app/design-system.css` y `src/app/globals.css`; páginas `/login`, `/change-password`, `/guia-proyecto`; API de proyectos, fases, tareas, actividad, autenticación y memoria en `src/app/api/`; utilidades `src/lib/`; protección de rutas `src/proxy.ts`.
- Base exclusiva `geocontrol_hub`, ocho tablas: `hub_users`, `hub_projects`, `hub_phases`, `hub_tasks`, `hub_documents`, `hub_audit_log`, `hub_login_attempts`, `hub_project_guide`.
- Esquema y migraciones en `database/`; pruebas automáticas en `tests/`; herramientas de respaldo y verificación en `scripts/`; validación CI en `.github/workflows/verify.yml`.
- Producción: servicio `geocontrol-hub`, proxy Nginx, puerto interno 3188; release activo al revisar `/opt/geocontrol-hub-releases/markdown-guide`. No compilar dentro del release activo ni desplegar sin aprobación.

### Estado observado y límites de verificación

- Conteo puntual leído en MySQL el 11/10/2026: **3 proyectos, 6 fases y 1 tarea**. Estos números son cambiantes y no deben interpretarse como una prueba de guardado correcto desde el navegador.
- Código revisado para las seis secciones de navegación y las API principales. No se realizó en esta revisión una prueba autenticada interactiva de cada botón desde el navegador.
- **Incidencia pendiente:** Jim informó que los datos nuevos no siempre se guardan o aparecen en la web; verificar creación, lectura y persistencia real en una sesión autenticada antes de declarar resuelto el problema.
- **Brecha funcional:** la documentación por proyecto todavía usa contenido de referencia en la interfaz, pese a existir tabla SQL para documentos.
- **Brecha de producto:** faltan memorias/contextos separados por proyecto y mecanismos de continuidad más profundos para ChatGPT; la memoria editable actual es global del Hub.
- **Seguridad:** la instalación de dependencias señaló cinco vulnerabilidades de severidad alta; revisar `npm audit` y correcciones compatibles sin actualizaciones destructivas ni despliegues no aprobados.

### Veredicto y dirección de desarrollo

**La base multiproyecto es válida y está bien encaminada, pero la plataforma todavía no está completa como centro integral de trabajo de Jim y ChatGPT.** El objetivo inmediato debe ser fiabilidad del guardado, documentos persistentes por proyecto y memoria/contexto individual por proyecto, antes de añadir integraciones externas. Mejorar después decisiones, hitos, responsables, adjuntos, búsqueda global, métricas e historial de versiones.

**Orden de prioridad:** (1) verificar y corregir guardado real; (2) documentación persistente y editable por proyecto; (3) memoria independiente por proyecto con copia para ChatGPT; (4) robustecer seguridad, pruebas y respaldos; (5) ampliar gestión de múltiples proyectos. Traccar no tiene prioridad estructural sobre otros proyectos.

**Regla de continuidad:** cuando Jim diga «Continúa», comprobar primero la memoria global de MySQL, el proyecto concreto en que se estaba trabajando, el estado de GitHub y el servicio activo. Nunca asumir que una función mostrada en la interfaz está plenamente operativa sin verificarla.


## 14. Plan maestro de evolución multiproyecto — versión 1.0 (11/10/2026)

**Estado:** PLAN APROBADO PARA DOCUMENTACIÓN; implementación NO iniciada. Este apartado define objetivos futuros, no funciones existentes. Documento externo de continuidad: `Geocontrol_Project_Hub_Plan_de_Evolucion.pdf` (conservar copia descargada fuera del servidor).

### Visión y principios
Geocontrol Project Hub es el centro de gestión de múltiples proyectos presentes y futuros de Jim, con asistencia de ChatGPT y, cuando corresponda, Codex. Traccar Manager puede ser uno de esos proyectos, pero no es el propósito principal del Hub. Cada proyecto debe conservar su información, contexto y trazabilidad independientemente.

**Prioridad absoluta: no perder datos.** Guardar no basta: implementar respaldos automáticos verificables, copias fuera del servidor, restauraciones de prueba, historial de versiones, eliminación reversible y confirmación fiable de escritura. Ninguna modificación destructiva sin respaldo y análisis de consecuencias.

### Expediente individual por proyecto: siete tarjetas
1. **Memoria:** propósito, alcance, contexto, situación actual, problemas y próximo paso.
2. **Historial:** actividad cronológica, autor, cambios y versiones recuperables.
3. **Tareas:** fases, estados, prioridades, vencimientos y evidencias.
4. **Decisiones:** decisión, motivos, alternativas descartadas, consecuencias y fecha.
5. **Documentos:** notas, archivos, enlaces, metadatos y versiones persistentes.
6. **Hitos:** entregables, fechas, validaciones, aprobaciones y resultados.
7. **Ficha técnica:** lenguajes (Java, JavaScript, TypeScript, etc.), frameworks, versiones, herramientas (ChatGPT, Codex), repositorios y ramas, rutas de código, bases de datos (MySQL u otras), migraciones, dominios, servidores, servicios, entornos, dependencias, pruebas, despliegues y reversión.

La ficha técnica debe admitir varios repositorios, servidores y bases cuando un proyecto lo requiera; será editable y versionada. **No almacenar secretos**: solo referencias seguras a su gestión. La memoria global del Hub permanece separada de las memorias individuales de proyectos.

### Etapas obligatorias, en orden
**Etapa 1 — Integridad y seguridad de datos.** Reproducir y resolver el problema de guardado desde una sesión autenticada; confirmar persistencia y lectura. Auditar respaldos existentes; automatizar respaldos MySQL con retención y copia externa; ensayar restauración aislada; documentar recuperación, errores y alertas. **Criterio de salida:** guardado real verificado, respaldo restaurable y procedimiento escrito.

**Etapa 2 — Trazabilidad y recuperación.** Historial de versiones de memorias/documentos/fichas, auditoría útil y archivado reversible; impedir sobrescrituras concurrentes. **Criterio:** poder consultar y recuperar una versión anterior sin perder la actual.

**Etapa 3 — Expedientes multiproyecto.** Implementar siete tarjetas por proyecto, documentos persistentes, ficha técnica y memoria independiente; relaciones correctas con proyecto y permisos. **Criterio:** dos proyectos pueden conservar contextos diferentes sin mezclar datos.

**Etapa 4 — Continuidad con ChatGPT.** Bitácora, decisiones, hitos, estado comprobado, siguiente acción y botón «Copiar contexto completo para ChatGPT» por proyecto. **Criterio:** un nuevo chat puede retomar un proyecto con su información sin depender de recuerdos informales.

**Etapa 5 — Organización y búsqueda.** Buscador global con filtros por proyecto/fecha/tipo, etiquetas y relaciones; navegación y consultas eficientes. **Criterio:** localizar datos históricos sin recorrer manualmente cada sección.

**Etapa 6 — Optimización.** Informes, métricas, recordatorios y automatizaciones según necesidades reales; evitar complejidad prematura. **Criterio:** mejoras comprobables sin degradar estabilidad ni recuperación.

### Procedimiento de trabajo y continuidad
- Antes de cada etapa: consultar `geocontrol_hub.hub_project_guide` (fuente principal), comparar con `docs/PROJECT_CONTEXT.md` (respaldo), comprobar GitHub, servidor, datos y pendientes.
- Ejecutar cambios graduales y pruebas aisladas; documentar evidencia y criterios de aceptación. Guardar commits en GitHub sin confundirlos con despliegues.
- **Producción requiere aprobación previa de Jim** para cualquier publicación o cambio que pueda afectarla. No compilar en el directorio del release activo.
- Después de cada avance: actualizar primero memoria MySQL, luego sincronizar GitHub sin pisar revisiones nuevas. Registrar fecha, pruebas, commit, despliegue sí/no, incidencias y siguiente paso.
- Si se pierde el chat o conexión: adjuntar el PDF maestro, indicar «Continúa el plan maestro de Geocontrol Project Hub», revisar la memoria viva y verificar el estado real antes de actuar.

### Punto exacto de reanudación
**Próxima tarea de desarrollo: Etapa 1**, comenzando por diagnóstico de guardado autenticado y revisión de respaldos y restauración. **Ninguna etapa de evolución se considera implementada por haber escrito este plan.** La aplicación pública no debe modificarse sin aprobación.


## 15. Etapa 1 — inicio y diagnóstico de integridad (11/10/2026)

**Estado:** EN CURSO, no completada. No se ha desplegado código ni cambiado la web pública.

### Verificaciones realizadas
- Servicio público `geocontrol-hub` activo, release independiente `/opt/geocontrol-hub-releases/markdown-guide`; rama `feat/mysql-auth` sincronizada al inicio.
- Memoria principal MySQL `hub_project_guide` revisión 3 al iniciar la etapa.
- Temporizador `geocontrol-hub-backup.timer` **habilitado y activo**, ejecución diaria prevista 04:00 UTC; script `scripts/backup-hub.py`, directorio privado `/opt/geocontrol/backups/hub`, conserva 14 respaldos.
- Respaldo manual generado correctamente: `geocontrol-hub-20261011T205249Z.sql.gz` (11.521 bytes comprimidos); gzip leído y comprobada la presencia de las **ocho tablas** de `geocontrol_hub` en 38.370 bytes SQL. Esto **no sustituye una prueba real de restauración**.
- Existe `scripts/verify-restore-hub.py` que restaura en una base temporal y luego la elimina; **no se ejecutó** en esta revisión por requerir análisis de alcance y seguridad.
- La interfaz aún contiene textos de referencia específicos de Traccar/GPS Manager en `src/app/page.tsx`, aunque la misión real es multiproyecto; corregir en futura modificación aprobada.
- La creación/edición de proyectos y tareas usa API autenticada y mensajes de error, pero **no se verificó guardado extremo a extremo desde navegador autenticado**; incidencia previa sigue abierta.

### Riesgos y siguiente paso
1. Confirmar que los respaldos incluyen datos y se pueden restaurar sin afectar producción; planificar prueba aislada y verificar procedimiento antes de ejecutarla.
2. Comprobar destino externo independiente, cifrado, retención y alertas de respaldo; por ahora solo se verificaron copias locales.
3. Reproducir el fallo de guardado con sesión autenticada, registrar petición/respuesta HTTP y lectura posterior, sin alterar registros existentes.
4. Solo después diseñar correcciones, pruebas y despliegue sujeto a aprobación de Jim.
5. Continuar actualizando memoria MySQL como fuente principal y sincronizar `docs/PROJECT_CONTEXT.md` en GitHub.

**Criterio de cierre pendiente:** guardado autenticado confirmado, respaldo restaurable verificado y copia independiente del servidor con procedimiento documentado.


## 16. Etapa 1 — atomicidad de creación y validación (11/10/2026)

**Estado:** avance en rama de desarrollo, NO desplegado. Se identificó que las API POST de proyectos y tareas insertaban primero la entidad y después la auditoría en operaciones separadas: si la segunda fallaba, podía persistir un dato aunque la API devolviera error.

**Cambio:** `src/app/api/projects/route.ts` y `src/app/api/tasks/route.ts` ahora usan una sola conexión MySQL y transacción `beginTransaction` / `commit`, con `rollback` ante error y liberación de conexión en `finally`. Se añadieron dos pruebas de contrato en `tests/atomic-creation.test.mjs`.

**Pruebas:** suite previa 58 pruebas: 40 correctas, 18 omitidas, 0 fallidas. Las dos nuevas pruebas pasaron individualmente. `git diff --check` sin problemas. Comprobación TypeScript completa **no superada por dependencias de desarrollo no disponibles**: `react-markdown`, `remark-gfm` y dos errores de tipado relacionados en `guide-editor.tsx`. No afirmar validación total ni corregir con compilaciones que puedan afectar el release público.

**Pendiente:** ejecutar suite completa con las dos nuevas pruebas; resolver dependencias aisladas y comprobar tipos; pruebas autenticadas reales de guardado y lectura; restauración aislada y copia externa de respaldo. Las API de actualización/eliminación y otras entidades requieren revisión de atomicidad. Ningún despliegue sin aprobación de Jim.

**Siguiente paso:** comprobar las dependencias en entorno aislado, ampliar transacciones a las demás escrituras de forma gradual, validar respaldo restaurable y sesión autenticada.


## 17. Etapa 1 — edición atómica de proyectos y tareas (11/10/2026)

**Estado:** código de desarrollo, SIN despliegue. Se extendió la transacción MySQL a las rutas PATCH `src/app/api/projects/[id]/route.ts` y `src/app/api/tasks/[id]/route.ts`: actualización y auditoría se confirman juntas; si la auditoría falla, se intenta rollback; se libera la conexión en `finally`. Si el registro no existe, se responde 404 y se revierte la transacción.

**Pruebas:** `tests/atomic-update.test.mjs` agrega dos verificaciones de contrato. Suite completa: **62 pruebas, 44 correctas, 18 omitidas, 0 fallidas**. No equivalen a pruebas E2E autenticadas ni a pruebas de fallo real de MySQL.

**Pendientes críticos:** prueba de restauración aislada de respaldos; copia externa cifrada y alertas; E2E autenticado con lectura posterior; revisar atomicidad en fases y eliminaciones; resolver dependencias faltantes para verificación TypeScript completa sin afectar el release de producción. No desplegar sin aprobación explícita de Jim.

**Próximo paso:** continuar validación de integridad y respaldos y preparar verificación aislada de recuperación.


## 18. Etapa 1 — atomicidad de fases (11/10/2026)

**Estado:** desarrollo, SIN desplegar. Se corrigieron las API `POST /api/phases` y `PATCH /api/phases/:id`: escritura de la fase y auditoría se realizan en una sola conexión/transacción MySQL, con commit, rollback ante error y liberación de conexión. La comprobación previa de existencia de proyecto sigue siendo separada; las condiciones de carrera deben evaluarse en pruebas de integración.

**Validación:** se añadieron dos pruebas de contrato en `tests/atomic-phases.test.mjs`. Suite completa: **64 pruebas, 46 correctas, 18 omitidas, 0 fallidas**. No se ha ejecutado prueba E2E autenticada ni restauración aislada.

**Pendientes:** DELETE de fases y tareas (preservación de auditoría y prevención de borrado accidental), restauración aislada comprobada, copia externa cifrada, verificación autenticada de guardado y dependencias TypeScript faltantes. Las pruebas de contrato solo verifican la estructura del código, no demuestran atomicidad bajo fallos de MySQL.

**Próximo paso:** revisar y asegurar eliminaciones, preparar pruebas de integración y recuperación sin modificar producción.


## 19. Etapa 1 — eliminación atómica de fases y tareas (11/10/2026)

**Estado:** desarrollado y probado por contratos, NO desplegado. `DELETE /api/tasks/:id` y `DELETE /api/phases/:id` ahora bloquean el registro con `SELECT ... FOR UPDATE` dentro de una transacción MySQL, eliminan y registran la auditoría antes del commit, con rollback y liberación de conexión ante error. En fases se conserva el rechazo 409 si hay tareas asociadas; se realiza la comprobación dentro de la transacción.

**Validación:** dos nuevas pruebas de contrato en `tests/atomic-delete.test.mjs`; suite total **66 pruebas: 48 correctas, 18 omitidas, 0 fallidas**. Estas pruebas no sustituyen integración con base aislada ni verificación de recuperación.

**Importante:** la eliminación sigue siendo física en estas API. El archivado reversible, historial de versiones y recuperación funcional corresponden a la Etapa 2; no se deben presentar como implementados.

**Pendiente para cerrar Etapa 1:** restauración real en base temporal aislada y comparación de datos; respaldo cifrado fuera del servidor; pruebas autenticadas de guardado/lectura; verificación TypeScript en entorno aislado; revisar alertas y fallos transaccionales. Ningún cambio en producción sin aprobación.


## 20. Etapa 1 — restauración aislada verificada (11/10/2026)

**Resultado confirmado:** se restauró el respaldo local más reciente `geocontrol-hub-20261011T205249Z.sql.gz` en un esquema temporal con nombre aleatorio `hub_restore_check_...`. Se comprobaron las **8 tablas** y recuentos restaurados: **3 proyectos, 1 tarea, 1 guía principal**. El proceso terminó satisfactoriamente. La base `geocontrol_hub` de producción no fue destino de restauración.

**Mejora de seguridad:** el script antiguo reemplazaba globalmente `geocontrol_hub` en todo el dump, con riesgo de alterar contenidos textuales. Ahora `scripts/restore-dump-safety.py` valida el esquema temporal y las ocho tablas y reemplaza solo las directivas `CREATE DATABASE` y `USE`. `scripts/verify-restore-hub.py` restaura, valida tablas y recuentos y elimina únicamente el esquema temporal que creó tras completar la importación. Se añadió `tests/restore-safety.test.mjs`.

**Pruebas:** suite **67 pruebas: 49 correctas, 18 omitidas, 0 fallidas**. No se modificó ni desplegó código de la web pública.

**Limitaciones:** esta prueba acredita la recuperación del respaldo probado, no demuestra copias externas ni recuperación ante pérdida total del servidor. Aún faltan copia externa cifrada con retención, alertas, guardado autenticado E2E, verificación TypeScript y pruebas de fallos de transacciones.

**Próximo paso:** investigar almacenamiento externo de respaldos y ejecutar pruebas E2E autenticadas de guardado/lectura en entorno aislado.


## 21. Etapa 1 — pruebas HTTP públicas y respaldo externo (11/10/2026)

**Prueba real HTTP sin autenticación:** ejecutado `HUB_SMOKE_URL=https://hub.geocontrol.online npm test` contra la web pública. Resultado **67 pruebas, 67 correctas, 0 fallidas, 0 omitidas**. Incluye verificación de rechazo 401 en rutas protegidas, login accesible y rechazo de credenciales vacías. Estas pruebas no modifican proyectos, tareas ni fases. **No es prueba E2E de guardado autenticado**.

**Revisión de respaldos:** timer diario `geocontrol-hub-backup.timer` configurado para 04:00 UTC; directorio local privado `/opt/geocontrol/backups/hub` y respaldo restaurado previamente con éxito. No se encontró configuración de destino remoto del Hub ni herramientas `restic`/`rclone` instaladas. Existe `gpg` pero sin destino remoto identificado. No afirmar que exista copia externa cifrada. Se requiere definir almacenamiento externo independiente y credenciales por un canal seguro, sin publicarlas en el repositorio.

**Pendientes:** elegir destino externo cifrado y probar recuperación desde él; reproducir y verificar guardado autenticado con registros de prueba; resolver dependencias TypeScript aisladas; verificar fallos transaccionales. Ningún despliegue sin autorización.


## 22. Decisión de respaldos — almacenamiento local (11/10/2026)

**Decisión explícita del propietario:** mantener los respaldos de Geocontrol Project Hub **dentro del mismo servidor**, sin requerir copia externa ni servicio de nube. Si se interrumpe la conexión remota de ChatGPT, el propietario puede acceder al servidor por consola desde su PC. Esta decisión sustituye el requisito previo de configurar un destino externo en la Etapa 1.

**Estado comprobado:** `geocontrol-hub-backup.timer` habilitado, directorio local `/opt/geocontrol/backups/hub` con permisos `0700`, y restauración aislada del respaldo del Hub verificada anteriormente. No se borraron ni movieron respaldos.

**Riesgo aceptado:** el acceso por consola permite recuperar datos ante una pérdida de conexión, pero **no protege frente a fallo del disco, pérdida total del servidor o daño simultáneo del original y las copias locales**. No presentar los respaldos locales como protección ante pérdida física del servidor.

**Pendiente Etapa 1:** documentar procedimiento de recuperación por consola, validar guardado autenticado y controles de integridad, resolver verificación TypeScript y alertas de respaldos. No desplegar cambios de código sin aprobación.


## 23. Etapa 1 — guía de recuperación por consola (11/10/2026)

**Documento nuevo:** `docs/RECUPERACION_CONSOLA.md` describe acceso al servidor desde PC, comprobaciones de servicio y timer, consulta de copias locales en `/opt/geocontrol/backups/hub`, prueba de integridad gzip, restauración aislada con `scripts/verify-restore-hub.py` y diagnóstico de logs sin modificar producción. Advierte que no se debe restaurar directamente sobre `geocontrol_hub` sin preservar datos actuales y obtener autorización.

**Verificado:** `geocontrol-hub` activo, timer diario habilitado a 04:00 UTC, registro de respaldo exitoso el 11/10/2026 a las 15:55 UTC, copias locales presentes. El propietario decidió mantenerlas en el mismo servidor (sección 22).

**Pendientes:** prueba de guardado autenticado/lectura con registros de prueba; verificar TypeScript en entorno de desarrollo aislado; revisar alertas y fallos transaccionales. Sin despliegue de producción.


## 24. Etapa 1 — prueba autenticada preparada, pendiente de ejecución (11/10/2026)

**Nuevo script:** `scripts/e2e-authenticated-task.mjs`. Requiere `HUB_E2E_URL`, `HUB_E2E_COOKIE` y `HUB_E2E_TEST_PROJECT_ID`; acepta **solo localhost por HTTP** para impedir modificaciones accidentales de la web pública. Comprueba que el proyecto dedicado existe; crea una tarea con marcador único, verifica su lectura por API, actualiza título/estado y comprueba persistencia por una segunda lectura. Por seguridad deja el registro de prueba identificado para revisión y limpieza manual controlada, sin borrar automáticamente información.

**Comprobaciones realizadas:** sintaxis de Node válida; ejecución sin configuración rechazada antes de acceder a red o datos. **No se ha ejecutado la prueba autenticada real**: falta entorno aislado con credenciales/sesión de prueba y proyecto dedicado. No se han creado registros.

**Siguiente paso:** preparar entorno aislado sin afectar archivos de producción, con usuario/proyecto exclusivamente de prueba; ejecutar script y revisar resultados. Resolver TypeScript en entorno aislado. No publicar cambios sin aprobación.


## 25. Etapa 1 — guardado atómico de memoria principal (11/10/2026)

**Problema identificado:** el endpoint `PUT /api/project-guide` guardaba el documento en `hub_project_guide` y después insertaba auditoría mediante una segunda conexión independiente. Si fallaba la auditoría, el documento podía quedar guardado mientras el cliente recibía error.

**Corrección en desarrollo:** `src/app/api/project-guide/route.ts` utiliza ahora una única conexión/transacción MySQL para UPDATE condicional por revisión e INSERT en `hub_audit_log`. Ante fallo se ejecuta rollback; ante conflicto de revisión devuelve 409 sin registrar cambios; libera conexión en `finally`. Se conserva el contrato de respuesta.

**Pruebas:** `tests/atomic-guide.test.mjs` verifica estructura transaccional; `HUB_SMOKE_URL=https://hub.geocontrol.online npm test`: **68 pruebas correctas, 0 fallidas, 0 omitidas**. Las pruebas públicas comprueban rutas no autenticadas, no guardado autenticado. **No desplegado a producción.**

**Pendiente:** ejecutar prueba autenticada en entorno aislado y TypeScript en copia separada; aprobación explícita antes de publicar la corrección.


## 26. Etapa 1 — validación de compilación aislada (11/10/2026)

**Entorno aislado:** copia del repositorio en `/opt/geocontrol-hub-stage1-check`, excluyendo `.git`, `.env.production`, `.next` y `node_modules`. Instalación local `npm ci --ignore-scripts --no-audit --no-fund`: 477 paquetes, incluidas dependencias Markdown ausentes en el árbol de trabajo. **No se utilizó ni modificó la compilación que sirve producción.**

**Verificaciones completadas:** `npm run lint` correcto; `npm run build` en la copia aislada correcto, incluyendo compilación Next.js y comprobación TypeScript, generación de 17 páginas; `npm test` en copia: 68 pruebas, 50 correctas, 18 omitidas por no configurar URL HTTP, 0 fallos. En una ejecución previa contra la URL pública, 68/68 pruebas HTTP y locales correctas, sin escritura autenticada.

**Limitación:** la ejecución directa de `tsc` fue bloqueada por controles de seguridad de herramientas; la compilación Next.js ejecutó y completó correctamente su propia fase TypeScript. No se intentó eludir el bloqueo.

**Pendiente imprescindible antes de declarar cerrada Etapa 1:** E2E autenticado de guardado/lectura en entorno aislado con base y sesión de prueba; no usar proyectos reales ni producción. El script localhost está preparado en `scripts/e2e-authenticated-task.mjs`. Revisar también alertas de respaldo. No solicitar aprobación para tareas ordinarias; sí antes de despliegue de producción.


## 27. Etapa 1 — vigilancia de salud de respaldos (11/10/2026)

**Implementado en desarrollo:** `scripts/check-backup-health.py`, comprobador **solo lectura**. Comprueba que el temporizador `geocontrol-hub-backup.timer` esté habilitado y activo, que haya copias locales, que la más reciente tenga menos de 36 horas y que su gzip sea legible y contenga tablas esenciales del Hub. Devuelve código de salida 1 y mensajes `ALERT:` cuando detecta anomalías; apto para monitorización futura. No instala temporizadores ni envía alertas externas sin aprobación; tampoco toca otras bases de datos.

**Ejecutado en servidor:** `OK: backup timer active, enabled, recent and gzip readable`. `HUB_SMOKE_URL=https://hub.geocontrol.online npm test`: 68 correctas, 0 fallos, 0 omitidas. Producción intacta.

**Importante:** el script por sí solo no genera notificaciones automáticas: requiere que se configure un mecanismo de ejecución y aviso. La Etapa 1 aún no está cerrada: falta la prueba de escritura/lectura autenticada en entorno aislado. No confundir comprobación de archivos con restauración, que se validó anteriormente por separado.


## 28. Cierre de Etapa 1 y publicación verificada — 11/10/2026

**Prueba E2E autenticada real:** ejecutada con éxito en copia de Next.js aislada, puerto local 3199 y esquema temporal `hub_restore_check_<12 hex>` con ocho tablas de estructura vacía. Se creó usuario de aplicación de prueba y usuario MySQL temporal limitado al esquema. Verificado: acceso sin sesión 401, login 200, GET proyectos 200, POST tarea 201, GET persistencia, PATCH título/estado, GET persistencia tras edición, GET/PUT/GET de memoria y 3 entradas de auditoría. Salida `PASS: unauthenticated 401, login, authenticated create/read/update/reread, guide save/reread, audit 3`. Esquema y usuario temporales eliminados; recuentos posteriores 0. No se modificaron proyectos reales. Script reproducible `scripts/e2e-stage1-isolated.mjs`, commit `6398c74`.

**Compilación aislada:** `npm run build` correcto, incluyendo TypeScript; ESLint correcto. 68 pruebas correctas contra URL pública (18 HTTP). Respaldo local, temporizador y restauración aislada comprobados.

**Publicación autorizada por el propietario:** solicitó continuar con todos los permisos sin detenerse. Se creó antes respaldo `geocontrol-hub-20261011T212506Z.sql.gz` y se comprobó su salud. Se preparó versión en `/opt/geocontrol-hub-releases/stage1-6398c74` copiando compilación preexistente desde entorno aislado (sin compilar ni alterar archivos activos de producción), con configuración de producción copiada con permisos 0600. Se actualizó exclusivamente el override `/etc/systemd/system/geocontrol-hub.service.d/release.conf` y reinició el servicio. La versión anterior `/opt/geocontrol-hub-releases/markdown-guide` se conserva intacta para reversión.

**Verificación pospublicación:** servicio activo, WorkingDirectory correcto, login público y local HTTP 200. La primera solicitud inmediata tras reinicio recibió 502 transitorio durante arranque, resuelto al quedar Next.js listo. `HUB_SMOKE_URL=https://hub.geocontrol.online npm test`: 68/68 correctas, 0 fallos/omisiones. `scripts/check-backup-health.py`: OK. No se repitió escritura autenticada contra producción, para evitar modificar datos reales.

**Resultado:** Etapa 1 cerrada y publicada con verificaciones de acceso público, API no autenticada y E2E autenticada aislada. El comprobador de salud de respaldos existe y funciona bajo ejecución manual; todavía no hay canal de notificaciones automáticas configurado. Próxima etapa: versionado y recuperación de documentos/memoria, según plan maestro.


## 29. Etapa 2 iniciada — historial de versiones de memoria (11/10/2026)

**Estado:** desarrollo, sin migración ni despliegue en producción. Memoria MySQL de referencia: revisión 17 al iniciar.

**Código:** migración aditiva `database/migrations/20261011_guide_versions.sql` para tabla `hub_project_guide_versions` (revisión única por guía, contenido y autor, fecha) y captura inicial de revisión vigente. `PUT /api/project-guide` bloquea fila `FOR UPDATE`, verifica revisión, conserva revisión anterior, actualiza contenido, registra nueva revisión y auditoría dentro de una transacción; si falla, rollback. `GET /api/project-guide/versions` lista hasta 100 revisiones y permite leer contenido de una revisión específica mediante `?revision=N`, siempre con sesión válida. La ruta actual `GET /api/project-guide` mantiene su contrato.

**Pruebas:** `HUB_SMOKE_URL=https://hub.geocontrol.online npm test` 68/68 correctas, 0 fallos; `npm run build` en copia aislada correcto, incluida TypeScript, 18 páginas generadas. No se ha ejecutado todavía una prueba E2E específica de historial/recuperación; **no se declara Etapa 2 terminada**.

**Siguientes pasos:** prueba E2E con esquema temporal que incluya nueva migración; añadir restauración de versión anterior como nueva revisión (sin borrar la vigente), interfaz de historial y recuperación, versionado de documentos y archivado reversible. Después preparar publicación segura con respaldo y aprobación según reglas del proyecto.


## 30. Etapa 2 — recuperación no destructiva de memoria verificada (11/10/2026)

**Código:** `POST /api/project-guide/versions` restaura una revisión histórica como **nueva** revisión, nunca borra la actual ni versiones anteriores. Solo owner/admin con sesión válida y origen permitido. Recibe `revision` y `expectedRevision`; verifica conflicto 409 con bloqueo `FOR UPDATE`. Dentro de la misma transacción: conserva snapshot actual, cambia contenido, crea snapshot de la nueva revisión y registra auditoría `restore`; rollback ante error. `GET /api/project-guide/versions` lista y consulta revisiones individuales.

**E2E autenticado real:** `scripts/e2e-stage2-isolated.mjs`, copia de Next.js en localhost:3199, esquema `hub_restore_check_<12 hex>` con tablas de prueba y credenciales aleatorias temporales. Pasó login, 401 sin sesión, tarea creada/editada/leída, guardado y lectura de memoria, listado de versiones 1/2, lectura de versión 1, conflicto 409, recuperación de versión 1 como versión 3, lectura actual igual a versión 1, **versión 2 conservada** y versión 3 consultable, auditoría de 4 operaciones. Salida `PASS: version history, conflict 409, non-destructive restore; unauthenticated 401, login, authenticated create/read/update/reread, guide save/reread, audit 4`. Código de salida 0, esquema y usuario temporales eliminados.

**Validación aislada:** ESLint 0 errores (1 aviso de variable no usada en script auxiliar del entorno de prueba), `npm run build` y TypeScript correctos. **No se ha migrado MySQL productivo ni desplegado código de Etapa 2.** Falta interfaz de selección/restauración de versiones, versionado de documentos, archivado reversible y publicación comprobada. Continuar sin confundir este hito con cierre de etapa.


## 31. Etapa 2 — interfaz de historial de memoria (11/10/2026)

**Estado:** implementado en desarrollo, **no desplegado**. Componente `src/app/guia-proyecto/guide-history.tsx` conectado a `guide-editor.tsx`. Permite abrir/cerrar historial, listar revisiones, previsualizar contenido histórico y (solo owner/admin) recuperar una revisión como nueva versión. Solicita confirmación antes de recuperar; usa `expectedRevision` para detectar conflictos, recarga la memoria al recuperar y muestra errores/éxito. No permite recuperar mientras se edita ni restaurar la misma revisión.

**Pruebas:** copia aislada `/opt/geocontrol-hub-stage1-check`: `npm run lint` 0 errores (2 avisos de variables no usadas en scripts auxiliares), `npm run build` compilación/TypeScript correctos y 18 páginas generadas. E2E previo de recuperación autenticada en esquema temporal aprobado, pero **la interacción del navegador todavía no fue probada manualmente**. Producción continúa usando release `stage1-6398c74`. Falta migración productiva y versionado/archivado de documentos.


## 32. Etapa 2 — documentos versionados y archivado reversible (11/10/2026)

**Estado:** código desarrollado y **E2E autenticado aislado aprobado**; **sin migración ni publicación en producción**.

**Migración aditiva** `database/migrations/20261011_document_versions.sql`: agrega `revision`, `archived_at`, `archived_by` a `hub_documents`; crea `hub_document_versions` con snapshots por revisión y copia inicial de documentos existentes. Debe ejecutarse **una sola vez** y solo en `geocontrol_hub`, después de un respaldo. No ejecutar en otras bases.

**API:** `GET/POST /api/documents` lista documentos por proyecto (excluye archivados salvo `archived=1`) y crea documento + versión 1 + auditoría atómicamente. `PATCH /api/documents/[id]` admite `action=update|archive|unarchive` con revisión esperada, bloqueo transaccional, versión nueva y auditoría. `GET /api/documents/[id]/versions` lista snapshots o consulta uno por `?revision=N`. `POST /api/documents/[id]/versions` recupera título/contenido histórico como **nueva** revisión, conserva el estado de archivo actual, registra auditoría. Todos requieren sesión; escrituras requieren rol owner/admin/editor y origen permitido. Los conflictos devuelven 409. **No hay endpoint de borrado físico de documentos.**

**Validación:** `npm run lint` 0 errores, 2 avisos no bloqueantes en scripts E2E; `npm run build` aislado correcto, TypeScript correcto, 19 páginas. `scripts/e2e-stage2-documents-isolated.mjs` ejecutado con usuario y esquema MySQL desechables: **PASS** crear/listar/editar documento, rechazo 409 por revisión obsoleta, archivar/ocultar/listar archivados, desarchivar, consultar historial 1–4, restaurar versión 1 como versión 5 y comprobar que la versión 2 mantiene el contenido posterior; también volvió a pasar recuperación de memoria y prueba autenticada de tareas. Esquema desechable eliminado.

**Pendiente:** interfaz de documentos, prueba de migración sobre copia restaurada con documentos existentes, publicación controlada de migraciones y código, comprobación HTTP postdespliegue. No declarar Etapa 2 cerrada.


## 33. Etapa 2 — pantalla de documentos (11/10/2026)

**Implementado en desarrollo, NO desplegado.** Nueva página `/documentos` (`src/app/documentos/page.tsx`) y enlace desde sección Documentación del panel principal. Selector de proyecto, lista de documentos, filtro para incluir archivados, nuevo/editar, archivo/desarchivo, historial y previsualización, recuperación como nueva revisión. Confirmación antes de descartar cambios y antes de recuperar/archivar; bloqueo de descarga de página con borrador sin guardar. La interfaz consume la API de documentos versionados de la Etapa 2. El editor no ofrece borrado físico.

**Verificaciones:** lint aislado 0 errores, 3 avisos preexistentes de scripts E2E; build aislado de Next.js y TypeScript OK, 20 páginas generadas. Se detectó y corrigió error de tipado de retorno en el primer build. **No se ha realizado una prueba de navegador sobre esta pantalla ni aplicado las migraciones productivas.** Los E2E autenticados de la API de documentos y memoria ya habían pasado en esquema desechable.

**Pendiente:** prueba de migración contra copia de datos con documentos preexistentes, revisión de permisos de edición en interfaz, pruebas visuales/navegador, integración y publicación con respaldo y reversión. Producción sigue en release estable de Etapa 1.


## 34. Etapa 2 — migraciones aisladas y permisos de documentos (11/10/2026)

**Migraciones validadas sin afectar producción.** Nuevo `scripts/verify-stage2-migrations-isolated.py`: toma último respaldo Hub del servidor, lo restaura a esquema `hub_restore_check_<12 hex>` y ejecuta únicamente allí `20261011_guide_versions.sql` y `20261011_document_versions.sql`. Inserta documento de prueba preexistente en el esquema temporal y verifica que después de migrar se conserve título, contenido y revisión 1 en tabla de versiones; comprueba snapshot inicial de la memoria. Resultado real: `PASS: latest Hub backup restored; existing document preserved and versioned; guide baseline revision 16`. Limpieza del esquema temporal en finally.

**Permisos de interfaz:** `GET /api/documents` expone `canEdit` según rol owner/admin/editor; la pantalla `/documentos` oculta editor, nuevo y recuperar para lectores. Los endpoints ya comprobaban permisos de servidor. Validación aislada: lint 0 errores (3 avisos auxiliares), build Next.js y TypeScript correctos, 20 páginas.

**Advertencias:** el último respaldo restaurado contiene memoria revisión 16, inferior a la memoria viva revisión 22, por lo que la copia no representa la memoria actual. Se requiere respaldo actualizado y comprobación de frescura antes de publicar. No se han aplicado migraciones ni desplegado código en producción. Pendientes pruebas de navegador y publicación controlada.


## 35. Etapa 2 — respaldo actualizado y regresión aislada (11/10/2026)

**Respaldo actualizado:** `geocontrol-hub-20261011T220202Z.sql.gz` (20 507 bytes) generado por `scripts/backup-hub.py` en el mismo servidor. Se restauró en esquema temporal, se aplicaron las dos migraciones Stage 2 allí y se verificó que la memoria de respaldo estaba en **revisión 23** (vigente al momento de generar el respaldo) y que un documento existente conserva contenido y snapshot inicial. No se alteró la base productiva.

**Pruebas:** `npm test` en entorno aislado: 68 pruebas, 50 superadas, 18 omitidas porque requieren URL de servidor (0 fallos). E2E autenticado `e2e-stage2-documents-isolated.mjs` nuevamente **PASS** (documentos, archivo/desarchivo, restauración, historial, 409, memoria, tareas, auditoría); esquema temporal eliminado. Corrección menor de interfaz: impide guardar cambios sobre documento archivado y limpia historial cuando desaparece de la lista.

**Estado:** producción continúa en Etapa 1. **Falta:** prueba visual de navegador de `/documentos`, verificación de esquema de producción y preparación/publicación de migraciones y release aislada con plan de reversión. No ejecutar migraciones productivas sin autorización de despliegue.


## 36. Etapa 2 — mejoras de interfaz y prueba de navegador preparada (11/10/2026)

**Cambios:** `src/app/documentos/page.tsx` ahora permite consultar título/contenido e historial a usuarios lectores sin controles de escritura, confirma descarte de borradores al cambiar proyecto o filtro, bloquea edición de archivados y operaciones de archivo/restauración con cambios sin guardar, limpia historial al ocultar documento. Estilos responsivos de formularios, botones, selectores y versiones en `src/app/design-system.css`.

**Validación:** lint aislado 0 errores (3 avisos en scripts E2E), Next.js build aislado y TypeScript correctos (20 páginas). Se añadió `scripts/e2e-stage2-browser-isolated.mjs`, que replica E2E autenticado de API sobre esquema desechable e intenta abrir `/documentos` con Puppeteer y verificar lista, editor e historial. **No pasó la prueba de navegador**: Chromium instalado en caché no puede arrancar por falta de `libatk-1.0.so.0` y otras bibliotecas de SO. El test falló con código 1, limpió esquema temporal. **No instalar dependencias de SO en producción sin evaluación/autorización.** La API sí había superado su E2E previo.

**Pendiente:** ejecutar navegador en entorno aislado con dependencias completas, verificar apariencia móvil y escritorio; después preparar release con migraciones respaldadas, publicación aprobada y smoke tests. No desplegado.


## 37. Etapa 2 — comprobación autenticada de permisos y página (11/10/2026)

Se amplió `scripts/e2e-stage2-documents-isolated.mjs` con pruebas reales sobre Next.js aislado y esquema MySQL desechable: `/documentos` sin sesión redirige; con sesión devuelve 200 y el encabezado correcto; rol `viewer` recibe `canEdit=false` y 403 al intentar crear; propietario recibe `canEdit=true`. La prueba vuelve a recorrer tareas, memoria, documentos, historial, 409, archivo/desarchivo y recuperación. Resultado **PASS**, salida 0, esquema desechable eliminado. No se ejecutó navegador Chromium: sigue pendiente prueba visual por dependencias del sistema faltantes.

**Producción** activa, sin despliegue de Etapa 2 ni migraciones. Próximo: cerrar validación visual en entorno adecuado y preparar despliegue sujeto a aprobación previa.


## 38. Etapa 2 — navegador real verificado en escritorio y móvil (16/10/2026)

**Bloqueo resuelto sin instalar paquetes globalmente:** se descargaron paquetes .deb oficiales de bibliotecas gráficas en `/opt/geocontrol-hub-browser-libs/packages` y se extrajeron solo a `/opt/geocontrol-hub-browser-libs/root`. No se modificó el sistema de paquetes instalado ni el servicio productivo. Chromium headless existente funciona con `LD_LIBRARY_PATH` limitado al proceso de prueba. `scripts/e2e-stage2-browser-isolated.mjs` admite `HUB_CHROME_PATH` para seleccionar el ejecutable.

**Resultados reales:** E2E Puppeteer autenticado de `/documentos` verifica lista, editor, contenido, historial; repite en viewport móvil 375×812 y comprueba que no existe desplazamiento horizontal. También pasa el E2E de API (tareas, memoria, documentos, historial, archivo/desarchivo, conflictos 409 y restauración no destructiva). **PASS** y salida 0; base MySQL temporal eliminada. Prueba de salud de respaldos: OK.

**Pendiente:** preparar paquete de release y procedimiento de migración/rollback; producción sigue en release de Etapa 1, sin migraciones de Etapa 2. Los cambios productivos requieren aprobación previa.


## 39. Etapa 2 — comprobación integral de migraciones y limpieza segura (16/10/2026)

Se reforzó `scripts/verify-stage2-migrations-isolated.py`: después de restaurar la última copia del Hub en un esquema `hub_restore_check_<12hex>`, inserta un documento heredado de prueba **solo en el esquema temporal**, aplica las dos migraciones y compara **todos** los documentos anteriores con su snapshot inicial, incluidos título, cuerpo, fecha de archivo y cantidad total. Verifica también la revisión inicial de la memoria. El bloque `finally` limpia el esquema temporal aun cuando la importación falle después de crearlo; nombre aleatorio estrictamente validado.

**Resultado real:** `PASS: backup restored, 1 legacy documents preserved and versioned, guide baseline revision 26`; `Disposable schema cleaned`. La memoria de producción estaba en revisión 27 al iniciar, por lo que el respaldo disponible era anterior por una revisión; se requiere respaldo nuevo justo antes de desplegar. `npm test` aislado: 68 pruebas, 50 superadas, 18 omitidas (requieren servidor HTTP), 0 fallos. No se modificó el release productivo.

**Siguiente:** verificar preparación de release y publicación solo tras aprobación explícita, respaldo reciente y smoke tests. No aplicar migraciones reales de forma anticipada.


## 40. Etapa 2 — permisos de consulta verificados en navegador (16/10/2026)

Se amplió `scripts/e2e-stage2-browser-isolated.mjs` con usuario `viewer` temporal real. En navegador Chromium headless y viewport móvil 375×812, se verificó que el lector puede acceder a `/documentos`, seleccionar un documento, leer su contenido y abrir el historial, pero **no** aparece el editor ni el botón para crear documentos. Se mantienen pruebas de propietario en escritorio y móvil y E2E de documentos/memoria/tareas.

**Resultado:** `PASS: browser desktop/mobile document editor, history, viewer read-only permissions`; `PASS` E2E completo; salida 0; esquema y usuario MySQL de prueba eliminados. No se modificó producción. Siguiente paso: publicación Etapa 2 solo con aprobación específica, backup previo y procedimiento de reversión.


## 41. Etapa 2 — pruebas negativas de permisos y validación de versiones (18/10/2026)

Se amplió `scripts/e2e-stage2-documents-isolated.mjs` con pruebas HTTP reales de API: usuario `viewer` obtiene **403** al intentar actualizar, archivar o restaurar documento; puede leer el historial (**200**). Revisión no numérica devuelve **400**, revisión inexistente **404** y documento inexistente **404**. Se mantienen pruebas de autenticación, versiones, 409 por concurrencia, archivo reversible, restauración sin pérdida y auditoría.

**Resultado:** E2E autenticado **PASS**, salida 0, esquema MySQL temporal eliminado. Producción sigue en Etapa 1, sin migraciones de Etapa 2. Próximo paso: publicación solo tras aprobación explícita y respaldo actualizado.


## 42. Etapa 2 — respaldo fresco y ensayo de migraciones (18/10/2026)

Con autorización para continuar tareas autónomas sin afectar producción, se comprobó `python3 scripts/check-backup-health.py`: temporizador activo y gzip válido. Se creó respaldo local **`/opt/geocontrol/backups/hub/geocontrol-hub-20261018T162805Z.sql.gz`** (22638 bytes, permisos 0600). Se restauró en esquema temporal y se aplicaron exclusivamente allí las migraciones de guía y documentos: **PASS**, se preservó el documento heredado y su instantánea; la memoria respaldada quedó en revisión **30**. Esquema temporal eliminado. Se verificó que producción sigue activa en `/opt/geocontrol-hub-releases/stage1-6398c74` y GitHub rama `feat/mysql-auth` commit `95f25c4`.

**Pendiente:** no se aplicaron migraciones ni se publicó Etapa 2. El respaldo de esta fecha es una evidencia del ensayo, pero debe generarse uno nuevo justo antes de cualquier despliegue autorizado. Continuar pruebas/preparación aisladas; requerir aprobación específica antes de alterar producción.


## 43. Etapa 2 — publicación autorizada y verificada (18/10/2026)

**Aprobación explícita del propietario:** «Apruebo la publicación». Commit publicado `806899a` (rama `feat/mysql-auth`). Antes del cambio: repo limpio, producción Etapa 1 activa, memoria principal MySQL revisión 31, respaldo nuevo `/opt/geocontrol/backups/hub/geocontrol-hub-20261018T165609Z.sql.gz` (22943 bytes), restauración y migraciones en esquema temporal **PASS** (baseline guía 31, documentos conservados). `npm run lint` 0 errores/4 avisos de variables sin usar, `npm run build` y TypeScript **PASS**, 68/68 tests previos **PASS**. Compilación aislada `/opt/geocontrol-hub-build-stage2-806899a`; release preparada separadamente.

**Ventana de publicación:** se detuvo únicamente el servicio `geocontrol-hub`; se aplicaron exclusivamente a `geocontrol_hub` las migraciones `20261011_guide_versions.sql` y `20261011_document_versions.sql`, una sola vez. Comprobación inmediata: memoria revisión 31 con instantánea histórica, 0 documentos preexistentes y 0 versiones de documentos (sin pérdida). Se actualizó solo el override systemd para usar `/opt/geocontrol-hub-releases/stage2-806899a`, recarga y arranque correctos. La release anterior `/opt/geocontrol-hub-releases/stage1-6398c74` permanece intacta para rollback de aplicación; conservar esquema aditivo en caso de rollback.

**Verificación pospublicación:** `systemctl is-active geocontrol-hub` = active; `/login` público HTTP 200; `/documentos` y `/guia-proyecto` sin sesión redirigen 307; `/api/documents` sin sesión 401. `HUB_SMOKE_URL=https://hub.geocontrol.online npm test` = **68/68 PASS, 0 fallos/omisiones**. Comprobador de salud del respaldo **OK**. Las operaciones autenticadas de escritura/lectura/historial se verificaron previamente en E2E aislado con usuario y esquema temporales, no se crearon datos de prueba en producción.

**Estado:** Etapa 2 publicada en producción, incluyendo memoria versionada y documentos por proyecto con historial, archivo reversible y recuperación no destructiva. **Pendiente:** comprobar manualmente interfaz con sesión real del propietario y avanzar en ficha técnica/versionado del plan maestro. Si falla la aplicación, revertir override a `stage1-6398c74`, reiniciar y comprobar; no revertir SQL ni restaurar datos sin evaluar escrituras posteriores.


## 44. Etapa 2 — fichas técnicas versionadas, primer incremento (18/10/2026)

**Desarrollo NO desplegado:** migración `database/migrations/20261018_technical_sheets.sql` para dos tablas nuevas de ficha por proyecto e historial inmutable, exclusiva de `geocontrol_hub`. API autenticada `/api/projects/[id]/technical-sheet`: GET actual e historial o versión histórica, PUT crear/editar con revisión esperada y bloqueo transaccional, POST restaurar una revisión previa como nueva revisión; auditoría y permisos owner/admin/editor para mutaciones, viewer solo lectura. No almacenar credenciales en fichas. Migración de ejecución única, **no aplicada a producción**.

**Validación:** copia de código en `/opt/geocontrol-hub-build-stage2-806899a`, `npm run lint` 0 errores/4 advertencias previas; `npm run build` y TypeScript correctos, ruta API compilada. **Pendiente:** prueba E2E real de ficha con esquema temporal y roles, interfaz de usuario, ensayo de migración aislado; no publicar sin nueva autorización. Producción sigue en release `stage2-806899a` con memoria global revisión 32 al comenzar.


## 45. Etapa 2 — prueba E2E de fichas técnicas (18/10/2026)

Se agregó `scripts/e2e-technical-sheet-isolated.mjs`, basado en el E2E autenticado de documentos y memoria, con esquema MySQL descartable `hub_restore_check_<12 hex>`, usuario MySQL temporal limitado, Next.js de desarrollo aislado y usuario propietario/lector. La prueba crea las tablas de fichas desde `database/migrations/20261018_technical_sheets.sql`, sin aplicarlas en producción. Ajustada para copiar el esquema actual de `hub_documents` que ya incluye columnas de Etapa 2.

**Resultado real: PASS (exit 0, ~29 s)** para ficha vacía, crear revisión 1, editar revisión 2, rechazo de revisión obsoleta 409, historial, lectura histórica, revisión inválida 400/inexistente 404, rechazo de escritura/restauración por lector 403, restauración de revisión 1 como nueva revisión 3 conservando revisión 2. También PASS para E2E de documentos, tareas y memoria. El esquema temporal y usuario fueron eliminados.

**Estado:** commit de implementación previo `69c2dac`; producción sigue en release `stage2-806899a`, sin migración de fichas. **Pendiente:** interfaz de ficha técnica por proyecto, pruebas de navegador y migración de respaldo aislado antes de solicitar autorización de publicación.


## 46. Etapa 2 — interfaz y navegador de fichas técnicas (18/10/2026)

**Desarrollado sin publicar:** página `/fichas-tecnicas` con selector de proyecto, contenido técnico editable, aviso de cambios sin guardar, historial, vista previa, recuperación como nueva revisión y lectura para viewer. Enlace desde sección Documentación del panel. Advertencia explícita de no incluir secretos.

**Verificado en entorno aislado:** `npm run lint` sin errores (5 advertencias de variables no usadas en scripts E2E), `npm run build` y TypeScript correctos, ruta `/fichas-tecnicas` compilada. Prueba de navegador `scripts/e2e-technical-sheet-browser-isolated.mjs` **PASS, exit 0 (~40 s)** con Puppeteer: escritorio 1280, móvil 375, lectura de ficha e historial, usuario viewer sin editor ni botón Guardar, sin overflow horizontal; regresión documentos y memoria también PASS. Esquema y usuario MySQL temporales limpiados.

**Pendiente:** prueba de migración de ficha en restauración aislada del respaldo actual (sin volver a aplicar migraciones Etapa 2 ya presentes), ampliar prueba UI para guardar/recuperar con clics y confirmar criterios de publicación. No aplicar migración ni desplegar sin aprobación específica. Producción permanece `stage2-806899a`.


## 47. Etapa 2 — migración real restaurada y acciones UI completas (18/10/2026)

**Ensayo de migración aprobado:** nuevo `scripts/verify-technical-sheet-migration-isolated.py` valida inventario de tablas permitido del respaldo ya migrado a Etapa 2, reescribe directivas del esquema a un nombre temporal validado, restaura el respaldo `geocontrol-hub-20261018T165609Z.sql.gz`, aplica únicamente `20261018_technical_sheets.sql` en la copia, inserta/lee ficha y versión y verifica conservación de 3 proyectos, 0 documentos y revisión de memoria global. **PASS** y limpieza del esquema temporal.

**Prueba de navegador ampliada:** `scripts/e2e-technical-sheet-browser-isolated.mjs` ahora realiza edición real con teclado, clic Guardar (revisión 2), selección de revisión 1, confirmación Recuperar (revisión 3), y comprueba que revisión 2 sigue recuperable. Corregido el test para restablecer las cookies del propietario y lector entre páginas Puppeteer que comparten contexto; no era defecto de permisos de la API. **PASS, exit 0 (~28 s)** para guardar/restaurar por UI, escritorio/móvil, historial, lector sin edición, documentos y memoria; base/usuario temporal limpiados.

**Pendiente:** revisión final de seguridad y plan de despliegue de ficha, respaldo nuevo previo a publicación, aprobación explícita de producción. Ninguna migración de ficha ni cambio de release aplicado a producción.


## 48. Etapa 2 — revisión de seguridad y preparación de publicación (18/10/2026)

**Pruebas ampliadas** en `scripts/e2e-technical-sheet-isolated.mjs`: escritura PUT sin Origin y con Origin externo rechazada 403, POST de restauración sin Origin rechazado 403, payload inválido 400, revisión negativa 400, proyecto inválido 400, contenido mayor a 1 000 000 caracteres 400, versión de restauración inexistente 404. Continúan verificadas autenticación, rol viewer 403, bloqueo optimista 409, creación/edición/lectura histórica/restauración no destructiva y regresión documentos/tareas/memoria. **PASS exit 0 (~17 s)** con limpieza del esquema y usuario temporal.

**Seguridad:** el servidor valida sesión JWT contra usuario activo, permisos por rol, Origin en mutaciones, proyecto y revisiones, y longitud del contenido; usa transacciones para versión y auditoría. El contenido de la ficha es texto libre: hay advertencia en interfaz para no guardar credenciales, pero **no existe detección automática de secretos**; nunca copiar secretos reales a la ficha. No se han ejecutado pruebas de concurrencia simultánea ni pruebas de carga.

**Plan de despliegue (NO ejecutado):** (1) obtener autorización explícita para afectar producción; (2) verificar `git status`, commit aprobado y estado del servicio; (3) respaldo fresco de `geocontrol_hub` y comprobar restaurabilidad; (4) preparar release nuevo y compilar fuera de la ruta activa; (5) aplicar solo `database/migrations/20261018_technical_sheets.sql` tras respaldo; (6) conmutar servicio al release nuevo en ventana acordada; (7) verificar inicio de sesión, proyectos, documentos, memoria, ficha técnica, móvil y logs; (8) si falla, volver al release anterior y evaluar la reversión de esquema sin borrar datos nuevos; (9) registrar release y resultados en memoria MySQL y GitHub. **Nunca ejecutar compilación sobre release activo**.

**Estado:** producción continúa en `/opt/geocontrol-hub-releases/stage2-806899a`, migración de fichas no aplicada, interfaz nueva no publicada. Pendiente autorización explícita de despliegue y comprobación final de seguridad operativa.


## 49. Producción — fichas técnicas publicadas (18/10/2026)

**Autorización:** el usuario respondió «Te autorizo que continúes de forma autónoma» a la solicitud explícita de publicar las fichas técnicas en `hub.geocontrol.online` con migración, respaldo y reversión.

**Respaldo y migración:** generado y verificado `/opt/geocontrol/backups/hub/geocontrol-hub-20261018T174139Z.sql.gz` (161268 bytes); restauración aislada desde este respaldo PASS (3 proyectos, 0 documentos, memoria conservada, tablas y escritura de versión). En producción se aplicó únicamente `database/migrations/20261018_technical_sheets.sql` sobre `geocontrol_hub`; se comprobaron las tablas `hub_project_technical_sheets` y `hub_project_technical_sheet_versions`. Ninguna base de Traccar modificada.

**Release:** `/opt/geocontrol-hub-releases/stage2-3c5bef9`, compilado con `npm run build` fuera del release activo (Next 16.4, TypeScript PASS). Se guardó configuración systemd anterior en `/etc/systemd/system/geocontrol-hub.service.d/release.conf.pre-3c5bef9`; se actualizó `release.conf`, `daemon-reload`, `restart`. El servicio `geocontrol-hub` quedó `active` y apunta a `stage2-3c5bef9`. Release anterior `stage2-806899a` intacto.

**Verificación producción:** `https://hub.geocontrol.online/login` HTTP 200; `/fichas-tecnicas`, `/documentos`, `/guia-proyecto` redirigen a login sin sesión (307); API proyectos y fichas rechaza anónimos (401). Prueba autenticada de solo lectura con token temporal firmado localmente desde cuenta owner/admin activa, sin revelar ni registrar credenciales: rutas `/`, `/fichas-tecnicas`, `/documentos`, `/guia-proyecto`, `/api/projects`, `/api/projects/1/technical-sheet` todas HTTP 200, ficha inicial nula y `canEdit=true`. Script temporal eliminado. Se conservaron 3 proyectos y memoria revisión 37 previa a este registro. No se han creado fichas reales ni realizado escrituras de contenido de usuarios en la verificación.

**Reversión:** si falla el nuevo release, restaurar el drop-in `release.conf.pre-3c5bef9` a `release.conf`, ejecutar `systemctl daemon-reload && systemctl restart geocontrol-hub` y verificar servicio/login. **No borrar tablas nuevas** ni restaurar el respaldo completo automáticamente: cualquier reversión de esquema debe evaluar datos generados desde la publicación.

**Siguiente paso:** vigilar funcionamiento y logs, recopilar feedback real y planificar Etapa 3 (expediente de siete tarjetas). No se requiere volver a publicar esta funcionalidad.


## 50. Etapa 3 — primera pantalla de expediente multiproyecto (18/10/2026)

Se creó `src/app/expedientes/page.tsx` y enlace en Documentación del panel principal. Vista inicial de **siete tarjetas por proyecto**: resumen, fases, tareas, documentos, ficha técnica, memoria independiente y continuidad. El selector de proyecto consulta los endpoints existentes filtrados por `projectId`; al cambiar de proyecto limpia datos previos mientras carga para evitar mezcla visual. Documentos y ficha tienen enlaces a sus editores. **Memoria independiente y bitácora están expresamente marcadas pendientes**, sin reutilizar memoria global ni simular persistencia.

**Verificación:** compilación Next 16.4 y TypeScript en `/opt/geocontrol-hub-build-stage2-806899a` completada PASS (22 rutas estáticas; `/expedientes` incluida). Falta prueba de navegador para aislamiento entre dos proyectos, comprobar móvil, completar memoria por proyecto y continuidad, y E2E de siete tarjetas.

**Producción:** permanece en `/opt/geocontrol-hub-releases/stage2-3c5bef9` con fichas técnicas publicadas. **No desplegar la Etapa 3 sin aprobación específica.** No se ha modificado el esquema ni los datos de producción para esta etapa.


## 51. Etapa 3 — memoria independiente por proyecto (18/10/2026)

**Implementado solo en desarrollo:** migración `database/migrations/20261018_project_memories.sql` para `hub_project_memories` y `hub_project_memory_versions`, vinculadas por FK a `hub_projects`, versiones únicas por proyecto y revisión. API `src/app/api/projects/[id]/memory/route.ts`: GET actual/histórico, PUT edición con `expectedRevision` y bloqueo transaccional por proyecto, POST restauración no destructiva; roles editor/admin/owner, CSRF Origin, auditoría y validaciones. UI `src/app/memorias/page.tsx`: selector de proyecto, edición, cambios sin guardar, historial, vista previa y recuperación; enlazada desde tarjeta 6 del expediente. La memoria global `hub_project_guide` queda separada y no se modifica.

**Pruebas:** compilación aislada Next 16.4 y TypeScript PASS, rutas `/memorias` y `/api/projects/[id]/memory` incluidas. **Pendiente:** E2E con dos proyectos, comprobación de aislamiento, conflictos, permisos, restauración, navegador móvil y restauración aislada de la migración. No declarar Etapa 3 completada.

**Producción:** permanece en `/opt/geocontrol-hub-releases/stage2-3c5bef9`. No se ha aplicado esta migración ni publicado las nuevas rutas. Antes de desplegar, solicitar aprobación específica y generar respaldo verificable.


## 52. Etapa 3 — prueba E2E aislada de memorias multiproyecto (18/10/2026)

Creado `scripts/e2e-project-memory-isolated.mjs`, basado en el E2E existente de fichas técnicas, con creación de esquema desechable `hub_restore_check_<12hex>`, usuario MySQL temporal, migración de memorias aplicada **solo en ese esquema**, servidor Next local y autenticación real. Se prueban dos proyectos A/B, memorias diferentes, lectura cruzada sin mezcla, revisiones independientes, acceso viewer de solo lectura, edición owner, CSRF sin Origin, validaciones, 409 por versión obsoleta, historial, 404 de versión inexistente y restauración de versión antigua como nueva revisión sin borrar la intermedia. Se mantienen pruebas de regresión de fichas técnicas, documentos y memoria global.

**Evidencia:** `HUB_E2E_APP_DIR=/opt/geocontrol-hub-build-stage2-806899a node e2e-project-memory-isolated.mjs` ejecutado desde el build aislado, **exit 0**, mensajes PASS de aislamiento A/B, seguridad, restauración y regresiones; esquema desechable limpiado.

**Pendiente:** prueba navegador/móvil de memorias y expediente, verificar restauración aislada desde respaldo real con migración nueva, revisar paginación de tarjetas y UX antes de considerar Etapa 3 lista. Producción sigue en `stage2-3c5bef9` sin migración de memorias ni publicación de Etapa 3. Despliegue requiere aprobación específica.


## 53. Etapa 3 — migración de memorias validada con respaldo real (18/10/2026)

Se creó `scripts/verify-project-memory-migration-isolated.py`: utiliza el respaldo más reciente disponible de Hub, verifica inventario de tablas permitidas y usa `restore-dump-safety.py` para restaurar exclusivamente en esquema temporal `hub_restore_check_<12hex>`. Aplica allí `database/migrations/20261018_project_memories.sql`, verifica creación de exactamente dos tablas, escritura y lectura de memorias independientes A/B, conservación de proyectos, documentos y revisión de la guía. Limpia esquema temporal en `finally`.

**Resultado real:** PASS restaurando `geocontrol-hub-20261018T174139Z.sql.gz`; 3 proyectos, 0 documentos y revisión 37 del respaldo conservados; migración y escritura de A/B verificadas; esquema temporal eliminado. El respaldo es anterior a la revisión actual 41 de memoria principal, lo cual es normal: no se restauró en producción.

**Pendiente:** pruebas automatizadas visuales desktop/móvil de `/expedientes` y `/memorias`; completar continuidad/decisiones y UX. No se ha desplegado Etapa 3 ni aplicado su migración a producción.


## 54. Etapa 3 — pruebas visuales preparadas, bloqueadas por dependencia de Chromium (18/10/2026)

Se creó `scripts/e2e-project-memory-browser-isolated.mjs`, ampliando el E2E de navegador con creación de memorias A/B en esquema desechable, edición/historial/recuperación por UI, viewer de solo lectura, vista móvil sin desplazamiento horizontal y expediente de siete tarjetas. **La prueba NO pasó ni llegó a ejecutarse en navegador**: Puppeteer Chromium falló al iniciar con código 127 porque falta la biblioteca del sistema `libatk-1.0.so.0`. No hay Chromium alternativo en PATH. El esquema desechable se limpió. **No afirmar verificación visual** hasta resolver la dependencia y repetir.

Las pruebas de API E2E y la restauración/migración de memorias sobre respaldo real ya habían pasado en esquemas aislados. Producción no modificada; queda pendiente resolver dependencia de navegador en entorno de pruebas, ejecutar E2E visual, corregir eventuales problemas y completar continuidad/decisiones.


## 55. Etapa 3 — E2E visual superado con Chromium aislado (18/10/2026)

Se resolvieron dependencias de Chromium para las pruebas sin instalar paquetes globalmente: `apt download` + `dpkg-deb -x` bajo `/opt/geocontrol-hub-browser-test-libs`, ejecutando Puppeteer con `LD_LIBRARY_PATH` apuntando exclusivamente a esas bibliotecas. No se modificaron librerías del sistema ni la versión publicada.

Se corrigió `scripts/e2e-project-memory-browser-isolated.mjs` para que la página viewer utilice un contexto de navegador independiente (evita sobrescribir cookie owner), se separó del bloque antiguo de pruebas visuales de ficha técnica, y se espera la carga asíncrona de siete tarjetas antes de comprobarlas.

**Evidencia:** `LD_LIBRARY_PATH=/opt/geocontrol-hub-browser-test-libs/lib/usr/lib/x86_64-linux-gnu HUB_E2E_APP_DIR=/opt/geocontrol-hub-build-stage2-806899a node e2e-project-memory-browser-isolated.mjs` terminó **exit 0**, PASS: UI de memorias escritorio/móvil, guardar, historial, restauración, viewer read-only, aislamiento A/B, expediente siete tarjetas, sin scroll horizontal; regresiones de documentos también PASS. El esquema temporal y usuario de prueba se limpiaron. Las pruebas visuales de ficha técnica se habían retirado de este script y **no se incluyen** en esta afirmación de PASS.

**Pendiente:** terminar continuidad/decisiones y revisar UX de enlaces de documentos/fichas con proyecto seleccionado. Etapa 3 no publicada, migración no aplicada en producción. Requiere aprobación específica para desplegar.


## 56. Etapa 3 — navegación por proyecto y memoria en expediente (18/10/2026)

Se añadió `src/lib/project-selection.ts` para validar `?projectId=<entero positivo>` y elegir el proyecto solicitado solo si figura en el listado autorizado de la API. Las pantallas `/expedientes`, `/documentos`, `/fichas-tecnicas` y `/memorias` respetan ese parámetro al cargar, con selección predeterminada cuando no existe o no corresponde a un proyecto visible. Los enlaces del expediente llevan a cada editor conservando `projectId`; las pantallas de ficha, documentos y memoria permiten volver al expediente correspondiente.

La tarjeta 6 del expediente consulta la API de memoria independiente y muestra su revisión y extracto, o estado sin memoria, sin mezclarla con la guía global. Al cambiar de proyecto se limpia también la memoria anterior y se cancela la aplicación de resultados de peticiones obsoletas.

**Verificado:** `npm run build` en el entorno aislado `/opt/geocontrol-hub-build-stage2-806899a` PASS, TypeScript PASS, 23 rutas estáticas y dinámicas. `git diff --check` PASS. **Pendiente:** E2E de navegación profunda con `projectId`, completar continuidad/decisiones y verificar despliegue solo tras aprobación específica. Producción intacta.


## 57. Producción — Etapa 3 publicada con aprobación explícita (18/10/2026)

**Autorización:** «Te autorizo continuar con la publicación de la etapa 3 de forma autónoma». Se publica el alcance desarrollado: expediente de siete tarjetas, memoria independiente versionada por proyecto, navegación con `projectId`, documentos y fichas técnicas existentes. La tarjeta 7 **continúa marcada pendiente para Etapa 4** (continuidad y decisiones), no se simula una funcionalidad completada.

**Preparación y seguridad:** rama `feat/mysql-auth` commit `dbd9df3`. Compilación Next 16.4 y TypeScript PASS en directorio aislado, E2E de API/memoria y navegador PASS previamente. Antes de cambiar producción se generó y verificó respaldo `/opt/geocontrol/backups/hub/geocontrol-hub-20261018T182953Z.sql.gz` (343584 bytes); restauración aislada del respaldo con migración `20261018_project_memories.sql` PASS, preservando 3 proyectos, 0 documentos y guía revisión 45. Se aplicó **solo** a la base `geocontrol_hub` la migración aditiva de dos tablas `hub_project_memories` y `hub_project_memory_versions`; tablas confirmadas, guía revisión 45 intacta antes de registrar este informe. Ninguna base Traccar tocada.

**Release:** `/opt/geocontrol-hub-releases/stage3-dbd9df3`, copia del build aislado sin archivos E2E ni secretos ajenos, con `.env.production` protegida. El override systemd previo se guardó en `/etc/systemd/system/geocontrol-hub.service.d/release.conf.pre-stage3-dbd9df3`; se actualizó solo `release.conf`, `daemon-reload` y reinicio. `geocontrol-hub` = active, `WorkingDirectory=/opt/geocontrol-hub-releases/stage3-dbd9df3`; release anterior `stage2-3c5bef9` intacto.

**Verificación pública:** `/login` HTTP 200; `/expedientes`, `/memorias`, `/documentos`, `/fichas-tecnicas` sin sesión redirigen 307; API proyectos, memoria y ficha sin sesión devuelven 401. `HUB_SMOKE_URL=https://hub.geocontrol.online npm test`: **68/68 PASS, 0 fallos, 0 omitidos**. Lectura autenticada temporal, sin modificar datos de proyectos, para proyectos 3 y 1: cuatro pantallas y dos API por proyecto HTTP 200; memorias inicialmente vacías y permisos de edición owner verificados. Token de comprobación efímero no guardado, script eliminado.

**Rollback:** restaurar `release.conf.pre-stage3-dbd9df3` sobre `release.conf`, `systemctl daemon-reload && systemctl restart geocontrol-hub`, verificar login/API. Mantener las dos tablas aditivas para no destruir posibles memorias escritas desde la publicación. No restaurar backup sobre producción sin evaluar datos nuevos.

**Pendiente:** implementar continuidad/decisiones en Etapa 4, mejorar UX/contadores de tareas y seguir vigilancia operativa. Publicación de Etapa 3 no implica que la tarjeta 7 esté implementada.


## 58. Encabezado de memoria corregido y contador de tareas preparado (18/10/2026)

Se corrigió el encabezado desactualizado de la memoria principal MySQL sin sustituir el documento completo: fecha 18/10/2026 y estado real «Etapa 3 publicada; Etapa 4 pendiente», guardado como revisión 47 con historial y auditoría. Se alineó el encabezado de `docs/PROJECT_CONTEXT.md` en GitHub; las secciones históricas conservan sus fechas originales por trazabilidad.

Se corrigió en `src/app/expedientes/page.tsx` el contador de tareas completadas: ahora usa `doneCount` agregado por la API de proyectos para **todas** las tareas del proyecto, en vez de contar únicamente las primeras 200 tareas cargadas. Compilación Next.js y TypeScript **PASS** en `/opt/geocontrol-hub-build-stage2-806899a`, 23 páginas estáticas, sin tocar el build de producción. **Este ajuste del contador NO está publicado**, necesita aprobación específica de despliegue.

Siguiente paso: iniciar Etapa 4, bitácora de decisiones/hitos y siguiente acción por proyecto, con migración aditiva, API, roles, historial y pruebas aisladas antes de pedir autorización de publicación.


## 59. Etapa 4 — continuidad y decisiones implementadas y E2E aislado PASS (18/10/2026)

Se implementó la Etapa 4 en **desarrollo**, sin publicar: `/continuidad?projectId=...` y API `/api/projects/[id]/continuity` (GET/POST), `/api/continuity/[entryId]` (GET/PATCH). Permite crear decisiones, hitos y próximas acciones por proyecto, fecha objetivo opcional, estado pendiente/completado y reapertura. Cada modificación de estado crea revisión inmutable y auditoría. No existe borrado en la API. Lectura viewer; escritura owner/admin/editor; comprobación de origen, validación, bloqueo transaccional y conflicto de revisión 409.

Migración aditiva **NO aplicada a producción**: `database/migrations/20261018_project_continuity.sql` crea `hub_project_continuity` y `hub_project_continuity_versions`, con claves foráneas al proyecto y al registro. Se aplicó y retiró correctamente en esquema MySQL temporal. La séptima tarjeta de `/expedientes` ahora muestra número de registros, pendientes y próxima acción, con enlace al editor. Se incluye corrección anterior del contador completo de tareas en la versión de desarrollo.

**Verificación:** Next.js 16.4 build PASS, TypeScript PASS, 24 rutas estáticas, 2 endpoints nuevos. `scripts/e2e-continuity-isolated.mjs` PASS (exit 0) sobre esquema MySQL desechable con usuario temporal eliminado: aislamiento A/B, decisiones/hitos/acciones, creación, completar/reabrir, historial v1/v2/v3, permisos owner/viewer, CSRF, payloads inválidos, conflicto 409, auditoría; regresiones de memoria independiente, ficha técnica, documentos y guía global PASS. Se corrigió durante E2E el tratamiento de fecha opcional omitida. **No se tocaron datos reales de proyectos.**

**Pendiente antes de publicar:** validación visual móvil/escritorio y restauración de respaldo real en esquema aislado con migración Etapa 4, revisión UX; después solicitar **autorización específica** de despliegue y migración a producción. Producción sigue en release Etapa 3 `stage3-dbd9df3`.


## 60. Etapa 4 — migración de respaldo y navegador móvil/escritorio PASS (18/10/2026)

Se recuperó la conexión normal de Desktop Commander al servidor. `scripts/verify-continuity-migration-isolated.py` restauró `geocontrol-hub-20261018T182953Z.sql.gz` en esquema temporal, preservó 3 proyectos, 0 documentos y guía revisión 45 **correspondiente al respaldo**, aplicó únicamente allí las dos tablas aditivas de Etapa 4, comprobó registros A/B y eliminó el esquema. La memoria principal actual seguía en revisión 49 antes de registrar este avance.

`scripts/e2e-continuity-browser-isolated.mjs` PASS (exit 0, Chromium aislado con bibliotecas locales): crear decisión desde navegador, completar, historial v1/v2, selección profunda `?projectId`, tarjeta 7 de expediente con contadores, viewer solo lectura, aislamiento entre proyectos, móvil 375px sin desbordamiento horizontal. Las regresiones de memorias, documentos y guía también PASS. El primer intento falló por falta de espera asíncrona y el segundo por una aserción incorrecta del test (el expediente muestra el título de la próxima acción, no de todas las decisiones); se ajustó únicamente el test y el tercero terminó PASS. Esquema y usuario temporales limpiados.

**Producción:** permanece en `stage3-dbd9df3`; migración Etapa 4 no aplicada, nueva UI no publicada. Próximo paso: revisión final de UX/seguridad y autorización **específica** antes de publicar Etapa 4.


## 61. Etapa 4 — revisión UX final y protección de borradores (18/10/2026)

Se añadió en `src/app/continuidad/page.tsx` advertencia al cambiar de proyecto si el formulario tiene título, detalles o fecha sin guardar: cancelar conserva el proyecto y el borrador; confirmar limpia el formulario y cambia de proyecto. Se deshabilitó el selector durante guardados/cambios de estado y se protegió la recarga de datos contra respuestas tardías de operaciones previas al cambio de proyecto. Esto evita registrar accidentalmente una decisión en otro proyecto o perder trabajo sin advertencia.

Se amplió `scripts/e2e-continuity-browser-isolated.mjs` con pruebas reales en Chromium para cancelar y confirmar el cambio con borrador. **PASS exit 0**, además de crear decisión, completar, historial, móvil sin overflow, viewer, expedientes y regresiones de memoria/documentos/guía. `npm run build` y TypeScript **PASS** en build aislado (24 páginas). El ensayo de restauración de respaldo real y migración aditiva Etapa 4 también pasó previamente.

**Producción intacta:** sigue release `stage3-dbd9df3`; no se aplicó migración Etapa 4. La autorización recibida fue para **continuar con Etapa 4**, no para publicar explícitamente; solicitar autorización específica de despliegue antes de aplicar la migración y cambiar el release.


## 62. Producción — Etapa 4 publicada con autorización explícita (18/10/2026)

**Autorización:** usuario confirmó «Sí te autorizo» a la pregunta explícita de publicar Etapa 4 en `hub.geocontrol.online` y aplicar su migración a `geocontrol_hub`, reiterada con «Te autorizo continuar, vuelve a intentar».

**Respaldo:** `/opt/geocontrol/backups/hub/geocontrol-hub-20261018T190225Z.sql.gz` (495612 bytes) generado y verificado antes de cambios; restauración aislada del respaldo y ensayo de migración PASS: 3 proyectos, 0 documentos, guía revisión 51 preservada. La rotación habitual del script conservó los 14 respaldos más recientes.

**Migración:** aplicada **solo** en `geocontrol_hub`: `database/migrations/20261018_project_continuity.sql`, crea `hub_project_continuity` y `hub_project_continuity_versions`. Verificadas ambas tablas, 3 proyectos y guía revisión 51 intactos inmediatamente después; 0 registros iniciales de continuidad. No se tocaron bases Traccar.

**Publicación:** build aislado de Next.js 16.4 y TypeScript PASS (24 páginas), E2E navegador/API PASS previamente. Nuevo release `/opt/geocontrol-hub-releases/stage4-a01dc98`, separado del release Etapa 3 y con `.env.production` protegida. Copia de override previa: `/etc/systemd/system/geocontrol-hub.service.d/release.conf.pre-stage4-a01dc98`. Se actualizó el override, `systemctl daemon-reload` y reinicio. Servicio `geocontrol-hub` activo, WorkingDirectory release Etapa 4. En la primera comprobación inmediata hubo HTTP 502 transitorio durante el arranque; comprobación posterior mostró servicio Next listo y login HTTP 200.

**Pruebas públicas:** `HUB_SMOKE_URL=https://hub.geocontrol.online npm test`: **68/68 PASS, 0 fallos**. `/login` HTTP 200, rutas `/continuidad`, `/expedientes`, `/memorias`, `/documentos`, `/fichas-tecnicas` sin sesión HTTP 307, API `/api/projects/1/continuity`, `/api/continuity/1`, proyectos y memoria sin sesión HTTP 401. No se realizaron escrituras de prueba en proyectos reales.

**Rollback:** restaurar override `release.conf.pre-stage4-a01dc98` sobre `release.conf`, `systemctl daemon-reload`, reiniciar servicio y verificar login/API. Conservar las dos tablas aditivas de Etapa 4 y no restaurar el respaldo sobre producción sin evaluar datos nuevos.

**Pendiente:** completar comprobación autenticada de solo lectura de la nueva UI/API en producción y seguimiento operativo. La prueba autenticada efímera no pudo ejecutarse por bloqueo de seguridad de la herramienta, sin eludirlo.


## 63. Navegación móvil — publicación autorizada (18/10/2026)

Tras verificación visual autenticada por el usuario de `/expedientes` y `/continuidad` en Android, se identificó que el menú lateral principal carecía de accesos a esas secciones. Se añadieron `Expedientes` y `Continuidad` al menú `src/app/page.tsx`, con iconos, navegación al proyecto activo mediante `?projectId`, cierre del menú móvil y protección de cambios de tareas sin guardar. Commit de código `90db1eb` en `feat/mysql-auth` publicado en GitHub.

Usuario autorizó expresamente la publicación de esta mejora. Se comprobó MySQL `geocontrol_hub.hub_project_guide` revisión 52, servicio activo y release anterior `stage4-a01dc98`. Se compiló exclusivamente en `/opt/geocontrol-hub-build-navigation-90db1eb` (sin compilar en carpeta de producción), TypeScript PASS, Next.js 16.4 build PASS y 50/50 tests locales ejecutados PASS (18 omitidos por no configurar URL pública). El primer intento de build aislado falló por enlace simbólico de `node_modules`; se reemplazó por copia física en el build aislado y terminó correctamente.

Nuevo release `/opt/geocontrol-hub-releases/navigation-90db1eb`, `.env.production` protegida, release previo intacto. Respaldo del override: `/etc/systemd/system/geocontrol-hub.service.d/release.conf.pre-navigation-90db1eb`. Se cambió `WorkingDirectory` y reinició el servicio. Comprobación posterior: `ActiveState=active`, `WorkingDirectory=/opt/geocontrol-hub-releases/navigation-90db1eb`, `/login` HTTP 200 y `HUB_SMOKE_URL=https://hub.geocontrol.online npm test` **68/68 PASS, 0 fallos**. No se aplicaron migraciones ni se modificaron proyectos reales.

Rollback: restaurar el override `.pre-navigation-90db1eb`, `systemctl daemon-reload`, reiniciar y ejecutar smoke. Pendiente: confirmación visual del usuario de los dos enlaces en el menú móvil tras refrescar la web. Memoria MySQL es fuente principal; este documento es respaldo.


## 64. Unificación visual del Workspace — desarrollo aislado (18/10/2026)

Tras capturas reales del usuario en Android, se implementó un contenedor visual compartido `src/app/project-workspace.tsx` para `/expedientes` y `/continuidad`, con menú lateral, encabezado, controles de tema y cuenta, enlaces a secciones del panel, navegación móvil y `?projectId` conservado. Se añadió soporte para `?section` al regresar a secciones del dashboard. Continuidad advierte si se navega desde el menú con borrador sin guardar; el formulario y la bitácora originales permanecen. Se ajustó CSS solo para las páginas integradas. No se tocaron API, esquemas ni registros MySQL.

Verificación: `npx tsc --noEmit` PASS; `npm test` 50 PASS, 0 FAIL, 18 SKIP (sin URL pública); compilación Next.js 16.4 PASS exclusivamente en `/opt/geocontrol-hub-build-workspace`, nunca en la carpeta de producción. Commit `4896366` enviado a GitHub `feat/mysql-auth`.

**Producción no publicada**: servicio activo en `/opt/geocontrol-hub-releases/navigation-90db1eb`, memoria principal revisión 53 antes de documentar. Pendiente: prueba visual en navegador aislado y autorización explícita para publicar la nueva unificación. La memoria MySQL es fuente principal y este archivo copia técnica.


## 65. Publicación del Workspace (18/10/2026)

Autorización explícita del usuario. Se activó `workspace-24994ef` en producción. Servicio `geocontrol-hub` activo; `/login` HTTP 200 y 68/68 pruebas públicas PASS después de publicar. Release anterior `navigation-90db1eb` conservado y configuración anterior respaldada como `release.conf.pre-workspace-24994ef`. No se realizaron migraciones ni cambios en datos de proyectos. Pendiente: comprobación visual autenticada de Expedientes y Continuidad. La revisión 54 contenía un encabezado histórico desactualizado, corregido sin eliminar contenido previo.


## 66. Validación de navegador aislado y capturas Android (18/10/2026)

Con el release publicado `workspace-24994ef`, se ejecutó `scripts/e2e-continuity-browser-isolated.mjs` en servidor de desarrollo aislado (puerto 3199 y base temporal desechable), reutilizando bibliotecas de Chromium disponibles. Resultado: PASS, salida 0 (80.69 s). Pruebas desktop/móvil de Continuidad y Expedientes: creación, estados, historial, permisos de lector, enlaces profundos y ausencia de overflow; Memorias y Documentos: edición, restauración, historial, permisos y auditoría. La base temporal fue eliminada. Servicio público `geocontrol-hub` continuó activo y `/login` HTTP 200; no se modificaron datos de producción.

El usuario compartió capturas reales Android de Dashboard, Memoria del proyecto (revisión 57 visible) y Documentación, sin cortes evidentes. Se verificó en código que la leyenda «Gestión y seguimiento de Geocontrol GPS Manager» depende de `activeProject.title`, no es texto fijo. Pendiente: capturas reales Android de Expedientes y Continuidad para completar revisión visual autenticada; las pruebas aisladas no equivalen a validación visual en producción.


## 67. Mejora de presentación de Expedientes — desarrollo (19/10/2026)

A partir de captura Android del usuario se corrigieron exclusivamente las etiquetas visibles de `src/app/expedientes/page.tsx`: estados internos (`planning`, `active`, `paused`, `completed`, `archived`) se presentan en español; los contadores de tareas y completadas usan singular/plural correcto. No se alteraron API, datos, esquemas ni otras pantallas. `npx tsc --noEmit` PASS; `npm test`: 50 PASS, 18 SKIP, 0 FAIL. Commit `b20869d` enviado a `origin/feat/mysql-auth`. Producción permanece en `workspace-24994ef`: cambio NO publicado; requiere autorización explícita para desplegar. Captura Android de Continuidad aún pendiente.


## 68. Publicación de mejora de Expedientes (19/10/2026)

Con autorización explícita del usuario se publicó la mejora de etiquetas y singular/plural de Expedientes. Release aislado `dossier-b20869d` creado desde compilación Next.js exitosa en `/opt/geocontrol-hub-build-workspace`; `.next/BUILD_ID` comprobado. Servicio `geocontrol-hub` cambiado al release y confirmado `active`. Configuración anterior respaldada en `release.conf.pre-dossier-b20869d`; release `workspace-24994ef` conservado para reversión. `/login` HTTP 200 y 68/68 pruebas públicas PASS después del despliegue. Sin migraciones ni cambios en proyectos, tareas o bases Traccar. Pendiente: captura Android para confirmar etiquetas en Expedientes y captura de Continuidad.


## 69. Revisión visual móvil automatizada (19/10/2026)

Con autorización del usuario se capturaron y revisaron visualmente Expedientes y Continuidad mediante Chromium headless móvil (375 px), utilizando el código del release `dossier-b20869d` en entorno de desarrollo aislado con esquema MySQL desechable. Se comprobó la visualización completa de siete tarjetas de Expedientes, estado «En planificación», selector de proyecto, formulario y bitácora de Continuidad, acciones e historial. Sin desbordamiento horizontal. Suite de navegador PASS, código de salida 0 (71.56 s); esquema temporal eliminado. Capturas de prueba en `/tmp/hub-dossier-mobile-review.png` y `/tmp/hub-continuity-mobile-review.png`. Se observó insignia de Next.js propia del modo desarrollo, no de producción. El campo de fecha mostró formato mm/dd/yyyy bajo el locale del navegador de prueba; revisar en navegador real si procede. Falta confirmación visual de Continuidad en una sesión real de producción; no se utilizaron credenciales ni datos reales para esta prueba. Sin cambios en producción.


## 70. Captura Android real de Continuidad (19/10/2026)

El usuario proporcionó una captura de Chrome Android en `hub.geocontrol.online/continuidad`. Se validaron visualmente navegación Workspace/Continuidad, encabezado, botón de retorno, selector Geocontrol GPS Manager y parte superior del formulario Nuevo registro (tipo, fecha, título y detalles). No se aprecian cortes ni desbordamiento horizontal. El control de fecha muestra `dd/mm/aaaa` en Android, confirmando que el formato `mm/dd/yyyy` visto en Chromium aislado era dependiente del locale de pruebas. La captura no incluye la parte inferior del formulario ni la bitácora; esas zonas ya pasaron pruebas de navegador aislado, pero no han sido inspeccionadas en una captura Android real. Sin cambios de código ni producción.


## 71. Cierre de revisión visual Android de Continuidad (19/10/2026)

Segunda captura real de Chrome Android aportada por el usuario: parte inferior del formulario Nuevo registro y sección Bitácora. Verificados campos de título y detalles, botón Registrar deshabilitado con título vacío, tarjeta Bitácora y estado vacío «No hay decisiones, hitos ni próximas acciones registrados». Alineación y legibilidad correctas; sin cortes ni desbordamiento horizontal apreciables. Con ambas capturas se completa la revisión visual de Continuidad en Android real, complementada por E2E aislado de acciones, historial y permisos. No se observaron defectos visuales que requieran corrección. Sin cambios de código ni despliegue.


## 72. Inicio de Fase 5 — Dashboard de seguimiento (19/10/2026)

El usuario autorizó iniciar Fase 5 de forma autónoma, manteniendo aprobación separada para despliegues. Se revisaron Dashboard existente y memoria canónica: ya existen progreso por proyecto, métricas, alertas y filtros; se evita duplicarlos. Primer avance: el bloque «Próximas tareas» selecciona primero vencidas, próximas (3 días), futuras y sin fecha; dentro de cada grupo ordena por prioridad, fecha e ID. Excluye completadas y no muta la lista original. Nuevo helper `dashboardNextTasks` en `src/lib/task-filters.mjs`, usado en `src/app/page.tsx`, con prueba en `tests/task-filters.test.mjs`. `tsc --noEmit` PASS; `npm test` 51 PASS, 18 SKIP, 0 FAIL. Commit `14fa38d` enviado a `feat/mysql-auth`. Solo desarrollo/GitHub, NO desplegado. Próximos pasos: revisión de seguimiento de Continuidad y permisos; compilar y validar en entorno aislado; solicitar autorización antes de publicar.


## 73. Fase 5 — vínculo Continuidad → Tareas (19/10/2026)

Se añadió enlace «Ver tareas de este proyecto» en Bitácora de Continuidad. El enlace abre `/?section=Tareas&projectId=<id>`; Dashboard ahora respeta `projectId` válido de URL en la carga inicial y conserva el comportamiento predeterminado si no existe o no pertenece a los proyectos disponibles. Esto evita perder el contexto del proyecto al pasar de Continuidad a Tareas. `tsc --noEmit` PASS, suite 51 PASS/18 SKIP/0 FAIL; compilación Next.js completa en `/opt/geocontrol-hub-build-workspace` PASS, sin tocar release de producción. Commit `2e4ea1c` enviado a GitHub. Mejora anterior de ordenación Dashboard `14fa38d` incluida en build aislado. Pendiente: E2E de enlace en navegador y auditoría de permisos; solicitar autorización antes de desplegar Fase 5. Producción sigue en `dossier-b20869d`.


## 74. Fase 5 — pruebas de navegación y permisos (19/10/2026)

Capturas Android de Continuidad, Dashboard y Tareas revisadas: registro de Continuidad y su historial visibles; Dashboard muestra una tarea pendiente y una próxima; se detectó texto «Total: 1 tareas» en gráfica. Corregido a singular/plural en `src/app/page.tsx`, commit `212ead4`, con TypeScript y 51 pruebas PASS. Se amplió `scripts/e2e-continuity-browser-isolated.mjs` para verificar enlace Continuidad → Tareas, selección del proyecto correcto, tarea visible y permisos de lectura sin POST/PATCH. Prueba completa de Chromium escritorio/móvil PASS (66.31 s, exit 0): continuidad, historial, Expedientes, Memorias, Documentos, control de revisiones y usuario lector; esquema desechable limpiado. Commit de pruebas `e56ab53` enviado a GitHub. Compilación aislada de la Fase 5 ya realizada anteriormente; cambio de singular posterior requiere nueva compilación antes de publicar. Producción sigue en `dossier-b20869d`, sin modificaciones. Pendiente: unificar formato visual de fechas y validación final de release; solicitar aprobación explícita antes de publicar.


## 75. Fase 5 publicada con autorización (19/10/2026)

Se unificó el formato visible de fechas objetivo en Continuidad y vencimientos de Tareas a dd/mm/aaaa, conservando valores originales de base de datos; commit `dfbc7cd`. Pruebas: TypeScript OK, 51/51 unitarias activas OK (18 omitidas), compilación Next.js aislada OK, navegador Chromium E2E aislado completo PASS (70.92 s, exit 0), incluyendo Continuidad → Tareas y permisos de lector; esquema temporal eliminado. Respaldo previo MySQL `geocontrol-hub-20261019T062415Z.sql.gz` verificado. Con autorización expresa del usuario se publicó release `/opt/geocontrol-hub-releases/phase5-dfbc7cd` por override systemd, preservando versión previa `/opt/geocontrol-hub-releases/dossier-b20869d`. Validación posterior: systemd active, NRestarts=0, `/login` HTTPS 200, rutas `/continuidad`, `/expedientes`, `/` redirigen 307 a login sin sesión; servicio Next.js listo. Sin migraciones ni cambios de datos de proyectos/tareas/continuidad. Pendiente: comprobación visual Android autenticada del enlace y formato de fechas, seguimiento de funcionamiento real.


## 76. Correcciones visuales Fase 5 publicadas (19/10/2026)

Con autorización explícita del usuario se corrigieron dos detalles observados en capturas Android: la fecha en «Requieren atención» ahora usa dd/mm/aaaa, y el contador de filtros de tareas utiliza singular «1 de 1 tarea» en ambas presentaciones. Solo se modificó `src/app/page.tsx`, sin alterar datos ni fechas almacenadas. Commit `996757a` enviado a `origin/feat/mysql-auth`. `tsc --noEmit` PASS; `npm test` 51 PASS, 18 SKIP, 0 FAIL; compilación Next.js aislada PASS. Respaldo previo MySQL `geocontrol-hub-20261019T062956Z.sql.gz` verificado. Release `/opt/geocontrol-hub-releases/phase5-fix-996757a` activado por systemd; anterior `/opt/geocontrol-hub-releases/phase5-dfbc7cd` conservado. Comprobaciones posteriores: servicio active, NRestarts=0, HTTPS /login 200, /continuidad /expedientes y / redirigen 307 sin sesión. Pendiente: confirmación visual de estas correcciones en Android autenticado y del enlace Continuidad → Tareas. Sin migraciones ni modificaciones a proyectos, tareas o bases de Traccar.


## 77. Eliminación segura de proyectos vacíos — desarrollo (19/10/2026)

El usuario autorizó implementar eliminación segura de proyectos vacíos. Se añadió DELETE `/api/projects/[id]` con autenticación, permisos owner/admin, validación de origen e ID, confirmación por nombre exacto, transacción y bloqueo FOR UPDATE; revisa dependencias en fases, tareas, documentos, continuidad, memorias/versiones y fichas técnicas/versiones antes de borrar. Rechaza proyectos con contenido (409) para evitar cascadas, registra auditoría al eliminar. En Proyectos → Editar datos se añadió «Eliminar proyecto vacío» con confirmación explícita y errores visibles. No se eliminaron proyectos reales. Commit `6c1ef22` enviado a `feat/mysql-auth`; TypeScript PASS, npm test 51 PASS/18 SKIP/0 FAIL, compilación Next.js aislada PASS. Backup MySQL `geocontrol-hub-20261019T063700Z.sql.gz`. No desplegado: producción sigue en `phase5-fix-996757a`. Pendiente: pruebas de API con proyecto temporal y controles de rol, revisión final y autorización separada antes de publicar.


## 78. Publicación de eliminación segura (19/10/2026)

Con autorización expresa se publicó la versión `project-delete-6c1ef22`, partiendo de compilación Next.js aislada exitosa, TypeScript PASS y npm test 51 PASS/18 SKIP/0 FAIL. Copia de respaldo de MySQL verificada: `geocontrol-hub-20261019T063700Z.sql.gz`. Producción activa mediante systemd con WorkingDirectory `/opt/geocontrol-hub-releases/project-delete-6c1ef22`. Verificado: login local 200, login público 200, API proyectos sin sesión 401, DELETE sin sesión 401; arranque normal. No se eliminaron proyectos existentes. La prueba integral de eliminación con base temporal fue bloqueada por controles de seguridad, por lo que no se afirma que el flujo de borrado haya sido validado extremo a extremo. Pendiente: verificar con un proyecto vacío de prueba autorizado, rechazos con dependencias y roles; revisar experiencia visual móvil. Se conserva release anterior `phase5-fix-996757a` para reversión.


## 79. Fase 5 — contexto de prioridad en próximas tareas (19/10/2026)

Se retomó Fase 5 tras confirmación del usuario de que puede eliminar proyectos vacíos. Mejora en desarrollo: bloque Dashboard «Próximas tareas» ahora muestra junto a cada tarea su prioridad y fecha de vencimiento con etiqueta Vencida/Próxima/Vence o Sin fecha límite; conserva selección de tareas y checkbox existentes. Modificados `src/app/page.tsx` y estilos `src/app/globals.css` con adaptación móvil y modo oscuro. TypeScript PASS, npm test 51 PASS, 18 SKIP, 0 FAIL; compilación Next.js de producción aislada PASS en `/opt/geocontrol-hub-build-workspace`. Commit `b4ee0df` enviado a `origin/feat/mysql-auth`. Respaldo MySQL `geocontrol-hub-20261019T064645Z.sql.gz` verificado. NO publicado: servicio de producción continúa usando `/opt/geocontrol-hub-releases/project-delete-6c1ef22`. Siguiente paso: validación visual aislada y autorización específica antes de publicar.


## 80. Publicación autorizada de Dashboard Fase 5 (19/10/2026)

Con autorización expresa del usuario se publicó el cambio `b4ee0df`: Próximas tareas del Dashboard muestra prioridad y fecha con estado vencida/próxima/vence/sin fecha. Antes de publicar: npm test 51 PASS/18 SKIP/0 FAIL, TypeScript PASS, Next.js build aislada PASS, E2E navegador aislado `scripts/e2e-continuity-browser-isolated.mjs` PASS (escritorio/móvil, continuidad, permisos, enlaces y ausencia de desbordamientos). Respaldo MySQL verificado `geocontrol-hub-20261019T064736Z.sql.gz`. Release activa `/opt/geocontrol-hub-releases/phase5-dashboard-b4ee0df`, sistema activo con NRestarts=0; login local y público HTTP 200, API sin sesión HTTP 401. Release anterior `project-delete-6c1ef22` conservada y release.conf anterior respaldado. Pendiente: confirmación visual del nuevo contenido Dashboard en sesión autenticada del usuario, especialmente Android.


## 81. Fase 5 — compactación de Avance vertical (19/10/2026)

A partir de las capturas Android enviadas por el usuario se detectó espacio vertical excesivo en «Avance vertical» con un solo proyecto. Se implementó en desarrollo presentación compacta horizontal cuando projects.length===1, conservando gráfico comparativo original para varios proyectos, porcentajes, recuentos, interacción para abrir fases, compatibilidad móvil y modo oscuro. Se ajustó levemente el espaciado móvil de «Hoja de ruta». Cambios `src/app/page.tsx` y `src/app/design-system.css`, commit `2e8a39c` enviado a GitHub. Verificaciones: TypeScript PASS, npm test 51 PASS/18 SKIP/0 FAIL, Next.js build aislada PASS. Respaldo MySQL verificado `geocontrol-hub-20261019T071406Z.sql.gz`. No publicado; producción sigue en `/opt/geocontrol-hub-releases/phase5-dashboard-b4ee0df`. Pendiente: validar diseño móvil en navegador aislado y solicitar autorización explícita antes del despliegue.


## 82. Publicación de gráfica compacta Fase 5 (19/10/2026)
Con autorización expresa se publicó el cambio 2e8a39c: Avance vertical compacto cuando hay un proyecto y ajustes de Hoja de ruta móvil. Pruebas: TypeScript PASS, 51 PASS, 18 SKIP, 0 FAIL; compilación aislada PASS; navegador aislado escritorio/móvil PASS. Respaldo verificado geocontrol-hub-20261019T071517Z.sql.gz. Release activa phase5-compact-2e8a39c, systemd activo sin reinicios; login local y público HTTP 200; API sin sesión HTTP 401. Versión anterior phase5-dashboard-b4ee0df conservada. Pendiente: validación visual Android por usuario.


## 83. Fase 5 — navegación directa desde Hoja de ruta (19/10/2026)
Se implementó en desarrollo la apertura directa de cada fase desde Dashboard → Hoja de ruta, con botón accesible por teclado y selección de la fase en la sección Fases. Se conservan estados, orden y controles existentes. Se añadieron estilos de interacción para claro/oscuro. Archivos src/app/page.tsx y src/app/design-system.css. Commit 8e4714a enviado a GitHub. TypeScript PASS, npm test 51 PASS/18 SKIP/0 FAIL, Next.js build aislada PASS. Respaldo MySQL verificado geocontrol-hub-20261019T071939Z.sql.gz. No publicado; producción continúa en phase5-compact-2e8a39c. Pendiente: prueba de navegación en navegador aislado y autorización separada antes de publicar.


## 84. Publicación autorizada de navegación Hoja de ruta (19/10/2026)
Con autorización expresa se publicó commit 8e4714a: desde Dashboard → Hoja de ruta cada fase es seleccionable y abre la sección Fases con la fase seleccionada, con soporte de teclado y estilos claro/oscuro. TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, compilación Next.js aislada PASS y E2E general navegador aislado PASS en escritorio y móvil (continuidad, permisos, enlaces y sin desbordamientos). Respaldo MySQL verificado geocontrol-hub-20261019T072022Z.sql.gz. Release activa /opt/geocontrol-hub-releases/phase5-roadmap-8e4714a, systemd activo NRestarts=0, login local y público HTTP 200, API sin sesión HTTP 401. Release anterior phase5-compact-2e8a39c conservada. Pendiente: verificar específicamente el clic en una fase de Hoja de ruta desde una sesión autenticada en Android.


## 85. Fase 5 — acceso directo a tareas por fase desde Hoja de ruta (19/10/2026)
El usuario confirmó que la navegación Dashboard → Hoja de ruta → Fases funciona en Android. Se añadió en desarrollo un enlace «Ver tareas →» independiente bajo cada fase en la Hoja de ruta del Dashboard: abre Tareas con taskPhaseFilter y draftPhase configurados para la fase seleccionada, conservando proyecto activo y navegación original a detalles de fase. Estilos accesibles para teclado y modo oscuro. Modificados src/app/page.tsx y src/app/design-system.css, commit 5b8be1f enviado a GitHub. TypeScript PASS, npm test 51 PASS/18 SKIP/0 FAIL y build Next.js aislada PASS. Backup verificado geocontrol-hub-20261019T072729Z.sql.gz. No publicado; producción continúa en phase5-roadmap-8e4714a. Pendiente: E2E de navegación a tareas filtradas y autorización separada para publicar.


## 86. Publicación de acceso a tareas desde Hoja de ruta (19/10/2026)
Con autorización expresa se publicó commit 5b8be1f: Dashboard → Hoja de ruta incorpora enlace «Ver tareas →» por fase para abrir Tareas con filtro por fase y conservar proyecto activo. Antes: TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, compilación Next.js aislada PASS y E2E general navegador aislado PASS en escritorio/móvil. Backup MySQL verificado geocontrol-hub-20261019T072855Z.sql.gz. Release activa /opt/geocontrol-hub-releases/phase5-roadmap-tasks-5b8be1f, systemd active NRestarts=0, login local/público HTTP 200 y API sin sesión HTTP 401. Primer sondeo local durante reinicio falló por arranque transitorio; segundo sondeo PASS. Release anterior phase5-roadmap-8e4714a conservada. Pendiente: validación funcional específica de enlace «Ver tareas →» desde sesión autenticada y confirmación visual Android.


## 87. Validación Android del acceso a tareas por fase (19/10/2026)
El usuario confirmó desde Android que Dashboard → Hoja de ruta → «Ver tareas →» funciona y abre las tareas de la fase seleccionada. Se cierra como validada la mejora de navegación entre Hoja de ruta, Fases y Tareas de la Fase 5. Producción activa en phase5-roadmap-tasks-5b8be1f, sin nuevos cambios. Respaldo MySQL verificado geocontrol-hub-20261019T073714Z.sql.gz. Siguiente paso: continuar con la siguiente mejora de Fase 5 en desarrollo, probar, registrar en GitHub y solicitar aprobación antes de publicar.


## 88. Fase 5 — limpieza de filtros al navegar a tareas de una fase (19/10/2026)
En desarrollo se centralizó la navegación Fases/Hoja de ruta → Tareas en openPhaseTasks(phaseId). Al entrar en tareas de una fase, conserva el proyecto activo y filtro de fase, limpia búsqueda, prioridad, vencimiento y vista semanal previas para evitar resultados vacíos por filtros incompatibles. Conserva orden y preferencias de agrupación. Archivo src/app/page.tsx; commit f8d33ad enviado a GitHub. TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, compilación Next.js aislada PASS y E2E general escritorio/móvil PASS. Backup MySQL verificado geocontrol-hub-20261019T074139Z.sql.gz. No publicado; producción continúa en phase5-roadmap-tasks-5b8be1f. Pendiente: autorización expresa para publicar y validación funcional específica de filtros en Android.


## 89. Publicación autorizada de limpieza de filtros por fase (19/10/2026)
Con autorización expresa se publicó commit f8d33ad: al navegar de Hoja de ruta o Fases hacia Tareas, se mantiene el proyecto y la fase seleccionados y se limpian filtros anteriores de búsqueda, prioridad, vencimiento y vista semanal. Antes: TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, build aislada Next.js PASS y E2E general navegador escritorio/móvil PASS. Backup MySQL verificado geocontrol-hub-20261019T074311Z.sql.gz. Release activa /opt/geocontrol-hub-releases/phase5-phase-filters-f8d33ad; systemd active NRestarts=0; login local/público HTTP 200 y API sin sesión HTTP 401. Release anterior phase5-roadmap-tasks-5b8be1f conservada. Pendiente: confirmación funcional en Android de que una búsqueda/filtro previo no oculta tareas al pulsar «Ver tareas» desde una fase.


## 90. Confirmación Android de limpieza de filtros por fase (19/10/2026)
El usuario confirmó en Android que al introducir una búsqueda en Tareas y después navegar Dashboard → Hoja de ruta → «Ver tareas» de una fase, se limpia la búsqueda anterior y se muestran las tareas correspondientes a la fase. Mejora Fase 5 cerrada y validada. Producción continúa activa en phase5-phase-filters-f8d33ad; no se realizaron cambios adicionales. Backup MySQL verificado geocontrol-hub-20261019T074658Z.sql.gz. Siguiente paso: continuar con la próxima mejora de Fase 5 en desarrollo, probar y pedir autorización antes de publicar.


## 91. Fase 5 — resumen de tareas completadas por fase (19/10/2026)
En desarrollo se añadió al banner de Tareas filtradas por fase un resumen dinámico «N de M tareas completadas» de la fase seleccionada, calculado desde tareas de dicha fase y no del proyecto entero; maneja singular y fase vacía. Archivo src/app/page.tsx, commit 4bab98c enviado a GitHub. TypeScript PASS, npm test 51 PASS/18 SKIP/0 FAIL, compilación Next.js aislada PASS y E2E general navegador escritorio/móvil PASS. Backup MySQL verificado geocontrol-hub-20261019T074930Z.sql.gz. No publicado; producción sigue en phase5-phase-filters-f8d33ad. Pendiente: autorización expresa para publicar y comprobación visual del resumen en Android.


## 92. Publicación autorizada de resumen de avance por fase (19/10/2026)
Con autorización expresa se publicó commit 4bab98c: banner de Tareas filtradas por fase muestra resumen dinámico «N de M tareas completadas» correspondiente exclusivamente a la fase seleccionada. Antes: TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, build Next.js aislada PASS y E2E general navegador escritorio/móvil PASS. Backup MySQL verificado geocontrol-hub-20261019T075005Z.sql.gz. Release activa /opt/geocontrol-hub-releases/phase5-phase-summary-4bab98c; systemd active NRestarts=0; login local/público HTTP 200 y API sin sesión HTTP 401. Release anterior phase5-phase-filters-f8d33ad conservada. Pendiente: confirmación visual en Android de que el resumen refleja el progreso de la fase elegida.


## 93. Validación visual Android del resumen de fase (19/10/2026)
El usuario aportó captura Android de Tareas del proyecto Geocontrol GPS Manager, con filtro de fase «Análisis y requisitos» y resumen «0 de 1 tarea completada». La tarea visible «Prueba de tarea de la fase principal» aparece pendiente. Se confirma visualmente el resumen correcto y se cierra la mejora de Fase 5. Producción permanece en phase5-phase-summary-4bab98c, servicio activo y sin cambios adicionales. Backup MySQL verificado geocontrol-hub-20261019T075217Z.sql.gz. Pendiente administrativo: sincronizar en GitHub los apartados 92 y 93 de la memoria principal, tras bloqueo de seguridad anterior de la herramienta. Siguiente paso: continuar con nueva mejora de Fase 5.


## 94. Fase 5 — avance de tareas en cada fase de Hoja de ruta (19/10/2026)
En desarrollo se añadió a cada fase de Dashboard → Hoja de ruta un contador dinámico «N de M tareas completadas», calculado desde las tareas correspondientes al ID de esa fase, además de su estado y enlace «Ver tareas». No cambia navegación ni estado de fases. Archivo src/app/page.tsx; commit c15e3c1 enviado a GitHub. TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, build Next.js aislada PASS y E2E general navegador escritorio/móvil PASS. Backup MySQL verificado geocontrol-hub-20261019T075503Z.sql.gz. No publicado; producción continúa en phase5-phase-summary-4bab98c. Pendiente: autorización expresa para publicar y validación visual Android de contadores en Hoja de ruta.


## 95. Publicación de contadores por fase en Hoja de ruta (19/10/2026)
El primer intento de despliegue autorizado fue bloqueado por control de seguridad y no modificó producción. A petición expresa del usuario se reintentó por vía regular y se publicó commit c15e3c1: cada fase de Dashboard → Hoja de ruta muestra «N de M tareas completadas». Build aislada, TypeScript, 51 pruebas y E2E general escritorio/móvil habían pasado. Backup MySQL verificado geocontrol-hub-20261019T080737Z.sql.gz. Release activa /opt/geocontrol-hub-releases/phase5-roadmap-progress-c15e3c1, systemd active NRestarts=0, login local/público HTTP 200, API sin sesión HTTP 401. Release anterior phase5-phase-summary-4bab98c conservada. Pendiente: confirmación visual Android de los contadores en Hoja de ruta.


## 96. Validación Android de contadores en Hoja de ruta (19/10/2026)
El usuario aportó captura Android de Dashboard → Hoja de ruta y confirmó visualmente los contadores: «Análisis y requisitos» 0 de 1 tarea completada; «Arquitectura», «Desarrollo», «Integración Traccar» y «Pruebas y producción» 0 de 0 tareas completadas. Se observan cinco fases, enlaces «Ver tareas →» y disposición móvil en dos columnas sin desbordamiento visible. Se cierra como validada esta mejora de Fase 5. Producción permanece activa en phase5-roadmap-progress-c15e3c1, sin cambios adicionales. Backup MySQL verificado geocontrol-hub-20261019T081005Z.sql.gz. Siguiente paso: continuar con la siguiente mejora pendiente de Fase 5.


## 97. Fase 5 — mensaje claro para fases sin tareas (19/10/2026)
En desarrollo se mejoró el contador de Dashboard → Hoja de ruta: las fases con cero tareas muestran «Sin tareas asignadas» en vez de «0 de 0 tareas completadas»; las fases con tareas mantienen el resumen dinámico. No cambia navegación ni datos. Archivo src/app/page.tsx; commit 9b18648 enviado a GitHub. TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, build Next.js aislada PASS y E2E general navegador escritorio/móvil PASS. Backup MySQL verificado geocontrol-hub-20261019T081249Z.sql.gz. No publicado; producción continúa en phase5-roadmap-progress-c15e3c1. Pendiente: autorización expresa para publicar y comprobación visual Android.


## 98. Publicación autorizada de mensaje para fases sin tareas (19/10/2026)
Con autorización expresa se publicó commit 9b18648: Dashboard → Hoja de ruta muestra «Sin tareas asignadas» cuando una fase tiene cero tareas; conserva contadores de fases con tareas. Previamente: TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, build Next.js aislada PASS y E2E general escritorio/móvil PASS. Backup MySQL verificado geocontrol-hub-20261019T081411Z.sql.gz. Release activa /opt/geocontrol-hub-releases/phase5-empty-phase-label-9b18648; systemd active NRestarts=0; login local/público HTTP 200 y API sin sesión HTTP 401. Release anterior phase5-roadmap-progress-c15e3c1 conservada. Pendiente: confirmación visual Android de los mensajes para fases sin tareas.


## 99. Confirmación Android de fases sin tareas (19/10/2026)
El usuario confirmó en Android que Dashboard → Hoja de ruta muestra «Sin tareas asignadas» en las fases vacías y conserva el contador de progreso para las fases con tareas. Mejora de Fase 5 validada y cerrada. Producción permanece activa en phase5-empty-phase-label-9b18648; sin cambios adicionales. Backup MySQL verificado geocontrol-hub-20261019T081526Z.sql.gz. Siguiente paso: continuar con la siguiente mejora pendiente de Fase 5, con pruebas y aprobación previa a publicar.


## 100. Fase 5 — volver a la sección de origen desde tareas de fase (19/10/2026)
En desarrollo se corrigió el botón de retorno en el banner de Tareas filtradas por fase: cuando el usuario entra desde Dashboard → Hoja de ruta aparece «← Volver a Hoja de ruta» y retorna al Dashboard; cuando entra desde Fases muestra «← Volver a fases» y retorna a Fases. Se conserva el proyecto y filtro de fase; no se alteran datos. Archivo src/app/page.tsx; commit 63c294a enviado a GitHub. TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, build Next.js aislada PASS y E2E general navegador escritorio/móvil PASS. Backup MySQL verificado geocontrol-hub-20261019T081810Z.sql.gz. No publicado; producción continúa en phase5-empty-phase-label-9b18648. Pendiente: autorización expresa para publicar y validación funcional Android de ambos retornos.


## 101. Publicación autorizada del retorno al origen desde tareas de fase (19/10/2026)
Con autorización expresa se publicó commit 63c294a: el botón del banner de Tareas filtradas por fase retorna al Dashboard/Hoja de ruta si se accedió desde allí, o a Fases si se accedió desde Fases. Previamente: TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, build Next.js aislada PASS y E2E general navegador escritorio/móvil PASS. Backup MySQL verificado geocontrol-hub-20261019T082444Z.sql.gz. Release activa /opt/geocontrol-hub-releases/phase5-return-origin-63c294a; systemd active NRestarts=0; login local/público HTTP 200 y API sin sesión HTTP 401. Release anterior phase5-empty-phase-label-9b18648 conservada. Pendiente: confirmación funcional Android de ambos retornos.


## 102. Confirmación Android del retorno a sección de origen (19/10/2026)
El usuario confirmó que desde Tareas filtradas por fase el botón de retorno funciona correctamente en Android para ambos recorridos: Dashboard → Hoja de ruta → Ver tareas → volver a Dashboard; Fases → Ver tareas → volver a Fases. Mejora de Fase 5 validada y cerrada. Producción permanece activa en phase5-return-origin-63c294a, sin cambios adicionales. Backup MySQL verificado geocontrol-hub-20261019T082644Z.sql.gz. Siguiente paso: continuar con la siguiente mejora pendiente de Fase 5, previa comprobación del estado, pruebas y autorización expresa para producción.


## 103. Fase 5 — estado vacío específico de tareas por fase (19/10/2026)
En desarrollo se mejoró el estado vacío de Tareas: al filtrar por una fase que no contiene tareas, muestra «Esta fase aún no tiene tareas» y «Crea la primera tarea de esta fase usando el formulario superior», incluso cuando el proyecto contiene tareas de otras fases. Evita el mensaje genérico engañoso de filtros. Conserva acciones existentes. Archivo src/app/page.tsx; commit a335724 enviado a GitHub. TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, build Next.js aislada PASS y E2E general navegador escritorio/móvil PASS. Backup MySQL verificado geocontrol-hub-20261019T083928Z.sql.gz. No publicado; producción continúa en phase5-return-origin-63c294a. Pendiente: autorización expresa para publicar y comprobación visual Android de una fase sin tareas.


## 104. Publicación autorizada de estado vacío de tareas por fase (19/10/2026)
Tras autorización expresa, un primer intento de copiar la release fue bloqueado por seguridad. A petición del usuario se reintentó por el procedimiento regular y se publicó commit a335724: las fases sin tareas muestran mensaje específico e indicación para crear la primera tarea. Previamente: TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, build Next.js aislada PASS y E2E general escritorio/móvil PASS. Backup MySQL verificado geocontrol-hub-20261019T085118Z.sql.gz. Release activa /opt/geocontrol-hub-releases/phase5-empty-tasks-a335724; systemd active NRestarts=0; login local/público HTTP 200 y API sin sesión HTTP 401. Release anterior phase5-return-origin-63c294a conservada. Pendiente: confirmación visual Android en una fase vacía.


## 105. Confirmación Android de estado vacío de tareas por fase (19/10/2026)
El usuario aportó captura Android en producción de Tareas filtradas por una fase vacía. Se confirma visualmente el mensaje «Esta fase aún no tiene tareas», la indicación «Crea la primera tarea de esta fase usando el formulario superior» y la acción «Mostrar todas las tareas». Mejora de Fase 5 validada y cerrada. Captura previa de Fases revela mejora pendiente: allí las fases vacías todavía muestran «0 de 0 tareas completadas»; sustituir por «Sin tareas asignadas», manteniendo contadores de fases con tareas. Producción activa en phase5-empty-tasks-a335724, sin cambios adicionales. Backup MySQL verificado geocontrol-hub-20261019T091642Z.sql.gz. Siguiente paso: implementar mejora pendiente en sección Fases, probar y solicitar autorización expresa antes de publicar.


## 106. Fase 5 — mensaje de fases sin tareas en administrador (19/10/2026)
En desarrollo se corrigió la sección Fases: en cada tarjeta de fase sin tareas se sustituye «0 de 0 tareas completadas» por «Sin tareas asignadas», en coherencia con Dashboard → Hoja de ruta. Las fases con tareas conservan contador y ahora usan singular/plural correcto. Archivo src/app/page.tsx; commit c1e690a enviado a GitHub. TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, build Next.js aislada PASS y E2E general navegador escritorio/móvil PASS. Backup MySQL verificado geocontrol-hub-20261019T091859Z.sql.gz. No publicado; producción continúa en phase5-empty-tasks-a335724. Pendiente: autorización expresa para publicar y comprobación visual Android de tarjetas de fases vacías y con tareas.


## 107. Publicación autorizada del mensaje de fases vacías (19/10/2026)
Con autorización expresa se publicó commit c1e690a: en Fases, tarjetas de fases sin tareas muestran «Sin tareas asignadas» y las que contienen tareas conservan contador con singular/plural correcto. Previamente: TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, build Next.js aislada PASS y E2E general navegador escritorio/móvil PASS. Backup MySQL verificado geocontrol-hub-20261019T091938Z.sql.gz. Release activa /opt/geocontrol-hub-releases/phase5-manager-empty-label-c1e690a; systemd active NRestarts=0; login local/público HTTP 200 y API sin sesión HTTP 401. Release anterior phase5-empty-tasks-a335724 conservada. Pendiente: confirmación visual Android en sección Fases de tarjetas vacías y con tareas.


## 108. Confirmación Android del mensaje de fases vacías (19/10/2026)
El usuario aportó capturas Android en producción de la sección Fases que confirman que las tarjetas Desarrollo, Integración Traccar y Pruebas y producción muestran «Sin tareas asignadas», conservando sus controles de estado, navegación a tareas y opciones de administración. La corrección de fases vacías de Fase 5 queda visualmente validada y cerrada. No se realizó ningún cambio adicional de producción. Producción permanece activa en phase5-manager-empty-label-c1e690a. Backup MySQL verificado geocontrol-hub-20261019T092308Z.sql.gz. Siguiente paso: continuar con la siguiente mejora pendiente de Fase 5, previa inspección del estado y autorización expresa antes de publicar.


## 109. Fase 5 — mensaje de fases vacías en encabezado de Tareas (19/10/2026)
En desarrollo se corrigió el banner de Tareas filtradas por fase: cuando la fase seleccionada tiene cero tareas, muestra «Sin tareas asignadas» en lugar de «0 de 0 tareas completadas», coherente con Dashboard → Hoja de ruta, Fases y estado vacío de Tareas. Las fases con tareas conservan contador y singular/plural. Archivo src/app/page.tsx; commit 4367a45 enviado a GitHub. TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, build Next.js aislada PASS y E2E general navegador escritorio/móvil PASS. Backup MySQL verificado geocontrol-hub-20261019T092537Z.sql.gz. No publicado; producción continúa en phase5-manager-empty-label-c1e690a. Pendiente: autorización expresa para publicar y comprobación visual Android del encabezado de una fase sin tareas.


## 110. Publicación autorizada del encabezado de fase vacía en Tareas (19/10/2026)
Con autorización expresa se publicó commit 4367a45: el banner de Tareas filtradas por una fase sin tareas muestra «Sin tareas asignadas» en lugar de «0 de 0 tareas completadas»; los contadores de fases con tareas se conservan. Previamente: TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, build Next.js aislada PASS y E2E general escritorio/móvil PASS. Backup MySQL verificado geocontrol-hub-20261019T092726Z.sql.gz. Release activa /opt/geocontrol-hub-releases/phase5-task-banner-empty-4367a45; systemd active NRestarts=0; login local/público HTTP 200 y API sin sesión HTTP 401. Release anterior phase5-manager-empty-label-c1e690a conservada. Pendiente: confirmación visual Android del encabezado de Tareas al abrir una fase vacía.


## 111. Confirmación Android del encabezado de fase vacía en Tareas (19/10/2026)
El usuario aportó tres capturas Android de producción al abrir Fases → Arquitectura → Ver tareas. Se confirma visualmente el encabezado «Fase: Arquitectura · Sin tareas asignadas», la selección de Arquitectura en el formulario, el estado vacío específico y los botones de retorno y mostrar todas las tareas. La mejora del encabezado queda validada y cerrada. Observación pendiente para siguiente mejora: en Tareas filtradas por una fase vacía, el resumen semanal y «Requieren atención» todavía muestran tareas de otras fases; aclarar su alcance de todo el proyecto o adecuarlo al filtro sin perder funcionalidad. Producción activa en phase5-task-banner-empty-4367a45, sin cambios adicionales. Backup MySQL verificado geocontrol-hub-20261019T093043Z.sql.gz. Siguiente paso: inspeccionar y corregir coherencia del resumen semanal con el filtro de fase, probar y solicitar autorización expresa antes de publicar.


## 112. Fase 5 — alcance explícito del resumen semanal de Tareas (19/10/2026)
En desarrollo se aclaró el alcance del resumen semanal al filtrar Tareas por una fase: se muestra «Resumen semanal de todo el proyecto · incluye tareas de otras fases.» sobre los indicadores; el encabezado de atención pasa a «Requieren atención · Todo el proyecto». No se cambian cifras, acciones, filtros ni tareas. Archivo src/app/page.tsx; commit d81a8ac enviado a GitHub. TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, build Next.js aislada PASS y E2E general navegador escritorio/móvil PASS. Backup MySQL verificado geocontrol-hub-20261019T093323Z.sql.gz. No publicado; producción continúa en phase5-task-banner-empty-4367a45. Pendiente: autorización expresa para publicar y comprobación visual Android de aclaración del resumen semanal en fase filtrada.


## 113. Publicación autorizada del alcance del resumen semanal (19/10/2026)
Con autorización expresa se publicó commit d81a8ac: al filtrar Tareas por una fase, sobre el resumen semanal aparece «Resumen semanal de todo el proyecto · incluye tareas de otras fases.» y la sección «Requieren atención» se identifica como «Requieren atención · Todo el proyecto». No se modifican los contadores ni los filtros. Previamente: TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, build Next.js aislada PASS y E2E general escritorio/móvil PASS. Backup MySQL verificado geocontrol-hub-20261019T093411Z.sql.gz. Release activa /opt/geocontrol-hub-releases/phase5-weekly-scope-d81a8ac; systemd active NRestarts=0; login local/público HTTP 200 y API sin sesión HTTP 401. Release anterior phase5-task-banner-empty-4367a45 conservada. Pendiente: confirmación visual Android de la aclaración del resumen semanal en fase seleccionada.


## 114. Confirmación Android del alcance del resumen semanal (19/10/2026)
El usuario aportó dos capturas Android en producción de Tareas filtradas por Arquitectura. Se confirma visualmente «Resumen semanal de todo el proyecto · incluye tareas de otras fases», «Requieren atención · Todo el proyecto», encabezado «Fase: Arquitectura · Sin tareas asignadas», fase Arquitectura seleccionada en formulario y estado vacío específico. La mejora de aclaración del resumen semanal de Fase 5 queda validada y cerrada. No se realizaron cambios adicionales de producción. Producción activa en phase5-weekly-scope-d81a8ac. Backup MySQL verificado geocontrol-hub-20261019T093704Z.sql.gz. Siguiente paso: continuar la siguiente mejora pendiente de Fase 5 previa inspección, pruebas y autorización expresa para publicar.


## 115. Fase 5 — sincronización de fase del formulario al usar resumen semanal (19/10/2026)
En desarrollo se corrigió la transición desde Tareas filtradas por fase hacia vistas de todo el proyecto: al pulsar un indicador semanal o abrir una tarea de «Requieren atención», junto con retirar el filtro de fase se limpia la selección preestablecida de fase en el formulario de nueva tarea (draftPhase), evitando que una tarea nueva se asigne involuntariamente a la fase anterior. No se modifican tareas ni datos existentes. Archivo src/app/page.tsx; commit 60219e8 enviado a GitHub. TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, build Next.js aislada PASS y E2E general navegador escritorio/móvil PASS. Backup MySQL verificado geocontrol-hub-20261019T094006Z.sql.gz. No publicado; producción continúa en phase5-weekly-scope-d81a8ac. Pendiente: autorización expresa para publicar y comprobación funcional Android de la fase seleccionada en el formulario tras pulsar indicador semanal.


## 116. Publicación autorizada de sincronización del formulario y resumen semanal (19/10/2026)
Con autorización expresa y tras reintento solicitado por el usuario, se publicó commit 60219e8: al abrir indicadores semanales o tareas de «Requieren atención» desde una fase filtrada, se limpian juntos el filtro de fase y la fase preseleccionada del formulario de nueva tarea (draftPhase). Un intento anterior fue bloqueado por controles de seguridad; el reintento regular completó correctamente. Previamente: TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, build Next.js aislada PASS y E2E general escritorio/móvil PASS. Backup MySQL verificado geocontrol-hub-20261019T094048Z.sql.gz. Release activa /opt/geocontrol-hub-releases/phase5-weekly-draft-phase-60219e8; systemd active NRestarts=0; login local/público HTTP 200 y API sin sesión HTTP 401. Release anterior phase5-weekly-scope-d81a8ac conservada. Pendiente: confirmación funcional Android de fase del formulario tras pulsar un indicador semanal desde Arquitectura.


## 117. Confirmación Android de sincronización de filtros y fase del formulario (19/10/2026)
El usuario aportó tres capturas Android en producción tras pulsar «Vencen hoy» desde Tareas filtradas por Arquitectura. Se confirma visualmente que desaparece el filtro de Arquitectura, queda activa «Vista actual: Semana: Hoy», el selector del formulario pasa a «Sin fase», se destaca el indicador «1 Vencen hoy» y la lista muestra 1 de 1 tarea correspondiente a Análisis y requisitos. La corrección de Fase 5 (commit 60219e8) queda validada y cerrada. No se realizaron cambios adicionales en producción. Release activa phase5-weekly-draft-phase-60219e8; backup MySQL verificado geocontrol-hub-20261019T094612Z.sql.gz. Siguiente paso: inspeccionar y desarrollar la siguiente mejora pendiente de Fase 5; pruebas y autorización expresa antes de publicar.


## 118. Fase 5 — sincronización de fase al limpiar filtros de Tareas (19/10/2026)
En desarrollo se corrigieron cinco acciones que retiraban el filtro de fase sin limpiar la fase preseleccionada en el formulario de nueva tarea (draftPhase): Restablecer vista, Limpiar filtros × del buscador, Limpiar filtros del listado, Mostrar todas las tareas del estado vacío y quitar manualmente el chip «Fase: ... ×». Todas limpian también draftPhase, evitando asignaciones involuntarias a la fase anterior. Archivo src/app/page.tsx; commit dc37f7c enviado a GitHub. TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, build Next.js aislada PASS y E2E general navegador escritorio/móvil PASS. Backup MySQL verificado geocontrol-hub-20261019T095109Z.sql.gz. No publicado; producción continúa en phase5-weekly-draft-phase-60219e8. Pendiente: autorización expresa para publicar y comprobación Android de «Limpiar filtros» desde Arquitectura con selector «Sin fase».


## 119. Publicación autorizada de limpieza sincronizada de filtros de Tareas (19/10/2026)
Con autorización expresa se publicó la corrección de Fase 5 commit dc37f7c: Restablecer vista, Limpiar filtros (dos accesos), Mostrar todas las tareas desde estado vacío y quitar el chip de fase limpian también la fase preseleccionada del formulario de nueva tarea (draftPhase). Antes de publicar: TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, build Next.js aislada PASS y E2E general navegador escritorio/móvil PASS. Backup MySQL verificado geocontrol-hub-20261019T095204Z.sql.gz. Release activa /opt/geocontrol-hub-releases/phase5-filter-reset-dc37f7c; systemd active NRestarts=0; login local/público HTTP 200 y API sin sesión HTTP 401. Release anterior phase5-weekly-draft-phase-60219e8 conservada. Pendiente: comprobación funcional Android de limpiar filtros desde fase Arquitectura y verificar «Sin fase» en el formulario.


## 120. Confirmación Android de limpieza sincronizada de filtros (19/10/2026)
El usuario confirmó explícitamente que, al limpiar los filtros de Tareas desde la fase Arquitectura, desaparece el filtro de fase y el formulario vuelve a mostrar «Sin fase». La corrección de Fase 5 publicada en commit dc37f7c queda validada y cerrada por confirmación del usuario. Producción sigue activa en phase5-filter-reset-dc37f7c, sin modificaciones adicionales. Backup MySQL verificado geocontrol-hub-20261020T003759Z.sql.gz. Siguiente paso: continuar con la siguiente mejora pendiente de Fase 5, previa inspección, pruebas y autorización expresa antes de publicar.


## 121. Fase 5 — sincronización de fase al navegar globalmente a Tareas (19/10/2026)
En desarrollo se corrigió la navegación global: al abrir secciones mediante el menú, y al pulsar los indicadores del Dashboard «Vencidas», «Próximos 3 días» y «Urgentes», cuando se retira el filtro de fase de Tareas se limpia también la fase preseleccionada en el formulario de nueva tarea (draftPhase). Evita asignaciones involuntarias a una fase visitada anteriormente. Archivo src/app/page.tsx; commit bacc9b4 enviado a GitHub. TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, build Next.js aislada PASS y E2E general navegador escritorio/móvil PASS. Backup MySQL verificado geocontrol-hub-20261020T004306Z.sql.gz. No publicado; producción continúa en phase5-filter-reset-dc37f7c. Pendiente: autorización expresa para publicar y confirmación funcional Android del selector «Sin fase» tras usar indicadores del Dashboard.


## 122. Publicación autorizada de navegación global sincronizada de Tareas (19/10/2026)
Tras autorización expresa y un reintento regular solicitado por el usuario, se publicó commit bacc9b4: menú de navegación e indicadores del Dashboard «Vencidas», «Próximos 3 días» y «Urgentes» limpian draftPhase al retirar el filtro de fase. Un intento anterior de conexión remota fue bloqueado por controles de seguridad y se respetó el bloqueo. Previamente: TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, build Next.js aislada PASS y E2E general navegador escritorio/móvil PASS. Backup MySQL verificado geocontrol-hub-20261020T005057Z.sql.gz. Release activa /opt/geocontrol-hub-releases/phase5-global-navigation-bacc9b4; systemd active NRestarts=0; login local/público HTTP 200 y API sin sesión HTTP 401. Release anterior phase5-filter-reset-dc37f7c conservada. Pendiente: confirmación funcional Android de «Sin fase» en formulario tras navegar desde indicadores del Dashboard.


## 123. Incidencia Android: selector de fase persiste tras limpiar filtros (19/10/2026)
El usuario aportó capturas Android donde, después de limpiar filtros, desaparecía «Fase: Arquitectura» y se mostraba 1 de 1 tarea, pero el selector nativo del formulario seguía mostrando «Arquitectura». No se considera validada la corrección anterior. Se implementó remount explícito del select de fase de nueva tarea mediante key dependiente de taskPhaseFilter y draftPhase, para forzar actualización del selector nativo al cambiar fase o limpiar filtros. Se añadió regresión real en scripts/e2e-continuity-browser-isolated.mjs: crear fase Arquitectura en BD aislada, entrar desde Fases en vista móvil, limpiar filtros y verificar valor vacío y etiqueta «Sin fase». Resultado PASS. TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, build Next.js aislada PASS, E2E navegador móvil y continuidad general PASS. Commit befd93f enviado a GitHub. Backup MySQL verificado geocontrol-hub-20261020T011421Z.sql.gz. Producción NO modificada: release activa phase5-global-navigation-bacc9b4. Pendiente: autorización expresa para publicar, comprobación de endpoints y validación final en Chrome Android del usuario.


## 124. Publicación autorizada de corrección de selector nativo de fase (19/10/2026)
Tras autorización expresa del usuario y reintento regular de conexión solicitado, se publicó la corrección befd93f: el select de fase de nueva tarea se remonta con key dependiente de taskPhaseFilter y draftPhase, evitando que Chrome Android muestre visualmente la fase anterior tras limpiar filtros. La prueba automatizada móvil de regresión PASS, 51 pruebas unitarias PASS/18 SKIP/0 FAIL, build Next.js aislada PASS y E2E general PASS. Backup MySQL verificado geocontrol-hub-20261020T011711Z.sql.gz. Release activa /opt/geocontrol-hub-releases/phase5-native-select-befd93f, systemd active NRestarts=0, login local/público HTTP 200 y API sin sesión HTTP 401. Release anterior phase5-global-navigation-bacc9b4 conservada. Pendiente: confirmación funcional del usuario en Chrome Android tras entrar a fase Arquitectura y limpiar filtros; el formulario debe mostrar «Sin fase».


## 125. Confirmación Android de corrección del selector nativo de fase (19/10/2026)
El usuario aportó captura de Chrome Android tras limpiar filtros desde Arquitectura. Se verifica visualmente que desapareció el chip «Fase: Arquitectura», el listado muestra 1 de 1 tarea y el selector de nueva tarea muestra «Sin fase». Incidencia previamente reproducida queda VALIDADA Y CERRADA. Release de producción phase5-native-select-befd93f sigue activa; no se requieren cambios adicionales. Backup MySQL verificado geocontrol-hub-20261020T012115Z.sql.gz. Siguiente paso: retomar la siguiente mejora de Fase 5 cuando el usuario indique «Continúa», previa inspección de memoria y estado real.


## 126. Fase 5 — conservar fase al crear tareas desde vista filtrada (19/10/2026)
Detectado: addTask restablecía draftPhase a null tras guardar incluso cuando taskPhaseFilter continuaba activo; una segunda tarea podía quedar sin fase y desaparecer de la vista filtrada. Corregido: tras guardar, setDraftPhase(taskPhaseFilter), conservando la fase seleccionada mientras su filtro está activo, y manteniendo «Sin fase» en vista global. Regresión de navegador móvil ampliada: crear tarea dentro de Arquitectura, verificar selector conserva Arquitectura tras guardar, después limpiar filtros y verificar «Sin fase». Resultado PASS, además de E2E general navegador escritorio/móvil PASS. TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, build Next.js aislada PASS. Commit 44b36d5 enviado a GitHub. Backup MySQL verificado geocontrol-hub-20261020T012433Z.sql.gz. Producción sin cambios en phase5-native-select-befd93f. Pendiente: autorización expresa de despliegue y validación Android tras publicar.


## 127. Publicación y validación Android: conservar fase al crear tareas (19/10/2026)
Con autorización expresa del usuario y reintento regular se publicó el commit 44b36d5: después de guardar una tarea en una vista filtrada por fase, el formulario conserva la fase seleccionada para la siguiente tarea. Release activa /opt/geocontrol-hub-releases/phase5-preserve-draft-phase-44b36d5; verificados login local/público HTTP 200, API sin sesión HTTP 401, systemd active y NRestarts=0. Release anterior phase5-native-select-befd93f conservada. Validación final aportada por el usuario mediante capturas Chrome Android: tarea Test3 creada, chip «Fase: Arquitectura» activo, listado 2 de 4 tareas, formulario vacío y selector conservando «Arquitectura». Mejora VALIDADA Y CERRADA. Prueba E2E móvil específica, 51 pruebas unitarias y build aislada aprobadas antes de publicar. Backup MySQL verificado geocontrol-hub-20261020T020025Z.sql.gz. Siguiente paso: continuar con la siguiente mejora de Fase 5 al recibir «Continúa», sin publicar sin autorización.


## 128. Fase 5 — confirmación de guardado visible en formulario de Tareas (19/10/2026)
Mejora en desarrollo: tras crear una tarea, se muestra confirmación junto al formulario «Tarea creada correctamente.». Si la tarea se asigna a una fase distinta de la fase filtrada, o se guarda sin fase mientras la vista está filtrada, se informa «Tarea guardada ... No aparece en la vista filtrada actual.» para evitar confundir un guardado correcto con desaparición de la tarea. El formulario conserva la fase filtrada para la siguiente tarea según mejora anterior. Código src/app/page.tsx; prueba E2E aislada ampliada en scripts/e2e-continuity-browser-isolated.mjs, validando creación en Arquitectura, mensaje de éxito, creación sin fase desde vista filtrada, mensaje de tarea no visible y mantenimiento del selector. E2E navegador móvil PASS, E2E general escritorio/móvil PASS; TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, build Next.js aislada PASS. Commit 9f65160 enviado a GitHub. Backup MySQL verificado geocontrol-hub-20261020T020402Z.sql.gz. NO publicado; producción permanece en phase5-preserve-draft-phase-44b36d5. Pendiente: autorización expresa para publicar y comprobación visual Android del mensaje junto al formulario.


## 129. Publicación y validación Android del aviso de guardado de tareas (19/10/2026)
El usuario autorizó expresamente publicar la mejora commit 9f65160 y solicitó reintentar conexión tras bloqueos temporales. Se desplegó la build aislada a /opt/geocontrol-hub-releases/phase5-task-feedback-9f65160, conservando release anterior phase5-preserve-draft-phase-44b36d5. systemd confirmó ActiveState=active, NRestarts=0 y WorkingDirectory correcto. La comprobación HTTP automatizada fue bloqueada por controles de seguridad; no declarar que se ejecutó. Posteriormente el usuario aportó captura de Chrome Android en https://hub.geocontrol.online: filtro «Fase: Arquitectura» activo, selector del formulario «Arquitectura», mensaje «✓ Tarea guardada sin fase. No aparece en la vista filtrada actual.» y contador 2 de 5 tareas. Esta evidencia confirma funcionamiento real de web pública y mensaje de guardado, así como conservación de fase. Mejora VALIDADA Y CERRADA. Backup MySQL verificado geocontrol-hub-20261020T021639Z.sql.gz. Siguiente paso: continuar con la siguiente mejora de Fase 5 al recibir «Continúa»; requerir aprobación antes de otra publicación.


## 130. Fase 5 — limpiar confirmación anterior al editar otra tarea (19/10/2026)
Se detectó que el aviso de guardado de Tareas podía persistir cuando el usuario empezaba a crear una tarea nueva, haciendo parecer que el aviso correspondía al nuevo formulario. Corregido en src/app/page.tsx: limpiar taskCreatedNotice al editar el título de la nueva tarea o cambiar su fase. El aviso sigue mostrándose después de guardar, con distinción entre tarea visible y tarea fuera de la fase filtrada. Regresión de navegador móvil ampliada en scripts/e2e-continuity-browser-isolated.mjs: crear tarea en Arquitectura, comprobar confirmación, empezar siguiente tarea y comprobar que desaparece la confirmación anterior, crear sin fase desde Arquitectura y comprobar aviso de no visible; PASS. E2E general desktop/mobile PASS; TypeScript PASS; 51 pruebas PASS/18 SKIP/0 FAIL; build Next.js aislada PASS. Commit ff1d0f3 enviado a GitHub. Backup MySQL verificado geocontrol-hub-20261020T022010Z.sql.gz. Producción SIN CAMBIOS en /opt/geocontrol-hub-releases/phase5-task-feedback-9f65160. Pendiente: autorización expresa para publicar y validación visual Android.


## 131. Publicación autorizada de limpieza de aviso anterior al editar otra tarea (19/10/2026)
Tras autorización expresa y reintento regular solicitado por el usuario, se publicó commit ff1d0f3: al empezar a escribir una tarea nueva o cambiar su fase, se limpia el aviso de guardado anterior. Release activa /opt/geocontrol-hub-releases/phase5-clear-stale-task-notice-ff1d0f3; respaldo de configuración systemd conservado y release anterior phase5-task-feedback-9f65160 disponible. Servicio systemd ActiveState=active, NRestarts=0, WorkingDirectory verificado. Login local y público HTTP 200; API sin sesión HTTP 401. Backup MySQL previo verificado geocontrol-hub-20261020T022120Z.sql.gz. Pruebas previas: TypeScript PASS, 51 pruebas PASS/18 SKIP, build aislada PASS, E2E desktop/mobile PASS con comprobación de desaparición del aviso al editar siguiente tarea. Pendiente: validación visual Android del usuario tras crear una tarea y empezar a escribir otra.


## 132. Confirmación Android: desaparece aviso anterior al escribir otra tarea (19/10/2026)
El usuario aportó captura de Chrome Android de la web pública tras comenzar a escribir «G» en el campo de nueva tarea. Se comprueba visualmente que el mensaje verde de confirmación anterior ya no aparece, mientras se mantiene el chip «Fase: Arquitectura», el selector de fase «Arquitectura» y el contador 3 de 6 tareas. Se valida en dispositivo real la corrección publicada en commit ff1d0f3, release /opt/geocontrol-hub-releases/phase5-clear-stale-task-notice-ff1d0f3. Servicio comprobado active, NRestarts=0. Incidencia VALIDADA Y CERRADA. Backup MySQL verificado geocontrol-hub-20261020T022832Z.sql.gz. Siguiente paso: continuar con próxima mejora de Fase 5 cuando el usuario indique «Continúa»; no publicar cambios nuevos sin autorización.


## 133. Fase 5 — limpiar aviso anterior al cambiar prioridad o vencimiento (19/10/2026)
Continuidad tras validación Android de la mejora anterior: se completó el comportamiento de limpieza del aviso de guardado de nueva tarea. Además de título y fase, ahora los cambios en prioridad o fecha de vencimiento también limpian taskCreatedNotice para evitar asociar el éxito anterior con el borrador actual. Código src/app/page.tsx, regresión móvil ampliada en scripts/e2e-continuity-browser-isolated.mjs: tras mensaje de guardado de tarea fuera de filtro, cambiar prioridad a Alta y comprobar desaparición del aviso. TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, build Next.js aislada PASS y E2E general escritorio/móvil PASS. Commit a6d6cdc enviado a GitHub. Backup MySQL verificado geocontrol-hub-20261020T023211Z.sql.gz. Producción SIN CAMBIOS: release activa phase5-clear-stale-task-notice-ff1d0f3. Pendiente: autorización expresa para publicar y comprobación Android.


## 134. Publicación autorizada de limpieza de aviso al cambiar prioridad o vencimiento (19/10/2026)
Con autorización expresa del usuario y reintento regular solicitado tras bloqueo temporal, se publicó commit a6d6cdc: al cambiar prioridad o vencimiento del borrador de una nueva tarea desaparece el aviso de guardado anterior. Release activa /opt/geocontrol-hub-releases/phase5-task-notice-all-fields-a6d6cdc. Configuración systemd anterior respaldada y release previa phase5-clear-stale-task-notice-ff1d0f3 conservada. Comprobación posterior: systemd ActiveState=active, NRestarts=0, WorkingDirectory correcto; login local HTTP 200, login público HTTP 200 y API sin sesión HTTP 401. Backup MySQL previo verificado geocontrol-hub-20261020T023314Z.sql.gz. Pruebas previas: TypeScript PASS, 51 pruebas PASS/18 SKIP, build aislada PASS, E2E escritorio/móvil PASS. Pendiente: validación visual Android del usuario de que cambiar prioridad o fecha elimina aviso de confirmación previo.


## 135. Fase 5 — aviso de creación con cierre automático (22/10/2026)
El usuario informó desde Android que el aviso verde «Tarea creada correctamente» nunca desaparece por sí solo. Se verificó en src/app/page.tsx que taskCreatedNotice solo se limpiaba al editar el siguiente borrador, sin temporizador. Se implementó useEffect dependiente de taskCreatedNotice con setTimeout de 5000 ms y cleanup clearTimeout; así el aviso de éxito se cierra automáticamente después de cinco segundos y sigue cerrándose inmediatamente al editar título, fase, prioridad o vencimiento. Código en commit 5b6cd4d, enviado a GitHub feat/mysql-auth. TypeScript PASS; 51 pruebas PASS/18 SKIP; compilación Next.js aislada PASS; E2E navegador escritorio/móvil PASS. Backup MySQL verificado geocontrol-hub-20261022T112213Z.sql.gz. Producción NO modificada; permanece release phase5-task-notice-all-fields-a6d6cdc. Pendiente: aprobación expresa para publicar y validación Android de cierre automático.


## 136. Publicación autorizada: aviso de tarea se oculta a los cinco segundos (22/10/2026)
Tras autorización expresa y reintento solicitado por el usuario, se publicó el commit 5b6cd4d de cierre automático de taskCreatedNotice a los 5000 ms. Release activa /opt/geocontrol-hub-releases/phase5-task-notice-autohide-5b6cd4d; configuración systemd anterior respaldada en release.conf.pre-phase5-task-notice-autohide-5b6cd4d y release previa phase5-task-notice-all-fields-a6d6cdc conservada. Verificación posterior: systemd ActiveState=active, NRestarts=0 y WorkingDirectory correcto; login local HTTP 200, login público HTTP 200 y API sin sesión HTTP 401. Respaldo MySQL verificado geocontrol-hub-20261023T002635Z.sql.gz. TypeScript, pruebas unitarias, build aislada y E2E navegador comprobados antes de publicar. Pendiente: validación visual Android de desaparición automática del aviso tras cinco segundos sin interacción.


## 137. Validación Android: aviso de creación se oculta automáticamente (22/10/2026)
El usuario confirmó expresamente «Confirmado, ya desaparece» tras probar en Android la versión publicada 5b6cd4d. Se valida el cierre automático del aviso verde de tarea creada después de aproximadamente cinco segundos sin interacción. Incidencia VALIDADA Y CERRADA; no se requieren cambios adicionales en producción. Release activa comprobada /opt/geocontrol-hub-releases/phase5-task-notice-autohide-5b6cd4d, systemd ActiveState=active, NRestarts=0. Backup MySQL verificado geocontrol-hub-20261023T002942Z.sql.gz. Siguiente paso: continuar próxima mejora de Fase 5 cuando el usuario indique «Continúa»; solicitar autorización antes de publicar.


## 138. Fase 5 — cierre automático del aviso de edición de tareas (22/10/2026)
Tras confirmar el usuario en Android que el aviso de creación se oculta solo, se revisó el aviso distinto de edición «Cambios guardados: ...» y se encontró que taskSavedNotice tampoco tenía cierre automático. Implementado useEffect con setTimeout 5000 ms y limpieza del temporizador para ocultarlo sin interacción, manteniendo las limpiezas previas al abrir/editar otra tarea. Commit 33a78d8 enviado a GitHub feat/mysql-auth. TypeScript PASS; 51 pruebas PASS/18 SKIP/0 FAIL; build Next.js aislada PASS; E2E navegador escritorio/móvil general PASS. Backup MySQL verificado geocontrol-hub-20261023T003319Z.sql.gz. Producción SIN CAMBIOS: release activa phase5-task-notice-autohide-5b6cd4d. Pendiente: autorización expresa para publicar y validación Android del aviso «Cambios guardados».


## 139. Publicación autorizada del cierre automático del aviso de edición de tareas (22/10/2026)
Con autorización expresa del usuario se publicó commit 33a78d8: el aviso verde «Cambios guardados: ...» tras editar una tarea existente se oculta automáticamente después de 5000 ms. Release activa /opt/geocontrol-hub-releases/phase5-task-edit-notice-autohide-33a78d8; copia de configuración systemd anterior conservada en release.conf.pre-phase5-task-edit-notice-autohide-33a78d8 y release previa phase5-task-notice-autohide-5b6cd4d disponible. Comprobaciones posteriores: ActiveState=active, NRestarts=0, WorkingDirectory correcto, login local HTTP 200, login público HTTP 200 y API sin sesión HTTP 401. Backup MySQL verificado geocontrol-hub-20261023T003409Z.sql.gz. Pruebas previas: TypeScript PASS, 51 pruebas PASS/18 SKIP, compilación aislada PASS y E2E escritorio/móvil general PASS. Pendiente: confirmación Android del usuario de que el aviso «Cambios guardados» desaparece solo.


## 140. Validación Android: aviso «Cambios guardados» se oculta automáticamente (22/10/2026)
El usuario confirmó expresamente «Confirmado, desaparece» tras probar en Android la versión 33a78d8 del aviso verde «Cambios guardados» al editar tareas existentes. La mejora de cierre automático a los cinco segundos queda VALIDADA Y CERRADA, sin cambios adicionales necesarios en producción. Release activa comprobada /opt/geocontrol-hub-releases/phase5-task-edit-notice-autohide-33a78d8; systemd ActiveState=active, NRestarts=0. Backup MySQL verificado geocontrol-hub-20261023T003812Z.sql.gz. Siguiente paso: continuar próxima mejora de Fase 5 cuando el usuario indique «Continúa»; pedir autorización expresa antes de publicar.


## 141. Fase 5 — prueba de regresión del cierre automático de avisos (22/10/2026)
Tras validar ambos avisos verdes de Tareas en Android, se reforzó el E2E de navegador aislado para comprobar expresamente que «Tarea creada correctamente.» desaparece sin interacción dentro de ocho segundos. Antes solo se verificaba que desapareciera al empezar a escribir, lo que no detectaba la ausencia de temporizador. Script scripts/e2e-continuity-browser-isolated.mjs, commit eae73a7 enviado a GitHub feat/mysql-auth. node --check PASS, git diff --check PASS, E2E navegador aislado escritorio/móvil PASS, incluyendo prueba de cierre automático y navegación por fases. Backup MySQL verificado geocontrol-hub-20261023T004114Z.sql.gz. Cambio exclusivamente en pruebas; producción SIN CAMBIOS y continúa activa release phase5-task-edit-notice-autohide-33a78d8. Próximo paso: definir siguiente mejora funcional de Fase 5; cualquier publicación de código que afecte producción requiere autorización previa.


## 142. Fase 5 — cerrar manualmente avisos verdes de tareas (22/10/2026)
Se preparó mejora de interfaz: los avisos de éxito «Tarea creada correctamente» y «Cambios guardados» ahora incluyen botón accesible «Cerrar ×», que permite ocultarlos inmediatamente sin esperar cinco segundos. Se mantiene el cierre automático de ambos a los 5000 ms. Se añadieron estilos compactos, responsivos y foco de teclado visible en src/app/design-system.css; componentes en src/app/page.tsx. Commit 85d3651 enviado a GitHub feat/mysql-auth. TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, compilación Next.js aislada PASS, E2E navegador aislado escritorio/móvil PASS con limpieza de esquema descartable. Backup MySQL verificado geocontrol-hub-20261023T004617Z.sql.gz. Producción SIN CAMBIOS: sigue release phase5-task-edit-notice-autohide-33a78d8. Pendiente: autorización expresa para publicar y validación visual Android de los botones «Cerrar ×».


## 143. Decisión de diseño: descartar botón de cierre en avisos verdes (22/10/2026)
El usuario consideró innecesario el botón «Cerrar ×» de los avisos verdes porque añade carga visual y los mensajes ya desaparecen automáticamente después de cinco segundos. Decisión: NO publicar dicha mejora y conservar los avisos limpios, sin botón adicional. Se revirtió íntegramente el cambio de interfaz del commit 85d3651 mediante commit 4fd5089, enviado a GitHub feat/mysql-auth; TypeScript PASS y git diff --check PASS. El cierre automático existente permanece intacto. Producción no se modificó y sigue activa release phase5-task-edit-notice-autohide-33a78d8. Backup MySQL verificado geocontrol-hub-20261023T005202Z.sql.gz. Criterio para siguientes mejoras: priorizar interfaz limpia, no añadir controles redundantes a notificaciones transitorias. Pendiente: seleccionar próxima mejora funcional de Fase 5.


## 144. Auditoría funcional y proyecto demostrativo WhatsApp bot (22/10/2026)
A solicitud expresa del usuario se auditó el recorrido de gestión del Hub y se creó un proyecto demostrativo visible en la base de datos de producción, sin desplegar código: hub_projects id=4, título WhatsApp bot, slug demo-whatsapp-bot-20261022, estado planning y resumen claramente marcado como SIMULACIÓN. Se crearon cinco fases (Requisitos y alcance, Arquitectura y conversaciones, Desarrollo del bot, Integración con WhatsApp, Pruebas y lanzamiento), diez tareas pendientes (dos por fase) y un documento versionado «Alcance inicial — WhatsApp bot (ejemplo)». No se conectó WhatsApp ni se enviaron mensajes reales. Antes del alta se verificó respaldo MySQL geocontrol-hub-20261023T005548Z.sql.gz; transacción y auditoría de creación registradas. Después se verificó SQL: proyecto id=4, 5 fases, 10 tareas, 1 documento; proyecto preexistente id=1 intacto. Web pública login HTTP 200, API sin sesión HTTP 401, servicio activo y release sin cambios phase5-task-edit-notice-autohide-33a78d8. Auditoría técnica: 51 pruebas unitarias PASS, 18 SKIP, TypeScript PASS y E2E aislado escritorio/móvil PASS; esquema temporal limpiado. Capacidades comprobadas: proyectos, fases, tareas, documentos con historial, memorias y control de permisos. Oportunidades: asignación de responsables no implementada en API de tareas, dependencias entre tareas no implementadas, automatización de flujos no implementada. Próximo paso: validar visualmente el proyecto demostrativo en Android y recorrer una tarea de principio a fin; priorizar mejoras según hallazgos. No eliminar el ejemplo sin confirmación del usuario.


## 145. Decisión funcional: administrador único y dependencias de tareas (22/10/2026)
El usuario estableció que por ahora Geocontrol Project Hub se gestionará con un solo administrador, sin otros responsables. La asignación de responsables queda EN CONSTRUCCIÓN PARA EL FUTURO y no debe añadirse a la interfaz ni desarrollarse sin nueva solicitud. Se explicó el concepto de dependencias entre tareas: una tarea puede necesitar que otra finalice antes de avanzar; ejemplo en proyecto demostrativo WhatsApp bot: Definir requisitos → Diseñar conversaciones → Desarrollar bot. Actualmente las tareas pueden gestionarse sin relaciones formales de dependencia. Se propuso, únicamente como posible mejora futura, registrar relaciones informativas «Depende de», mostrar bloqueos y evitar automatismos restrictivos de inicio. No se implementó ninguna dependencia ni cambio en producción. Backup verificado geocontrol-hub-20261023T010100Z.sql.gz.


## 146. Fase 5 — dependencias informativas de tareas preparadas (22/10/2026)
El usuario aprobó implementar dependencias entre tareas. Se preparó en desarrollo una versión inicial con un único prerrequisito opcional por tarea: campo depends_on_task_id en hub_tasks, clave foránea ON DELETE SET NULL y migración database/migrations/20261022_task_dependencies.sql. API GET de tareas incluye la dependencia; PATCH valida ID, misma pertenencia de proyecto, prohíbe autodependencias y ciclos recursivos; permite quitar la dependencia con null. Interfaz en editor de tarea: selector «DEPENDE DE (OPCIONAL)» y texto informativo si la tarea anterior no está completada; indicador discreto en listado. No bloquea cambios de estado: relación informativa y reversible, sin responsables adicionales. Commit 0237b15 enviado a GitHub feat/mysql-auth. Verificaciones: TypeScript PASS, 51 pruebas PASS/18 SKIP/0 FAIL, compilación Next.js aislada PASS, E2E navegador aislado escritorio/móvil PASS, incluyendo pruebas API de crear, leer, detectar ciclo, autodependencia y desvincular; esquema descartable limpiado. Backup MySQL verificado geocontrol-hub-20261023T010730Z.sql.gz. IMPORTANTE: migración NO aplicada a geocontrol_hub, producción SIN CAMBIOS y release activa phase5-task-edit-notice-autohide-33a78d8. Antes de publicar se requiere autorización expresa del usuario tanto para migración de base de datos como despliegue, respaldo actualizado y comprobación posterior de interfaz Android. No ejecutar la nueva versión sin migración correspondiente.


## 147. Publicación autorizada de dependencias informativas (22/10/2026)
El usuario autorizó expresamente publicar dependencias de tareas. Conexión Desktop Commander restablecida. Respaldo MySQL previo verificado: geocontrol-hub-20261023T011118Z.sql.gz (3542669 bytes). Migración database/migrations/20261022_task_dependencies.sql aplicada exclusivamente a geocontrol_hub: columna hub_tasks.depends_on_task_id y FK ON DELETE SET NULL confirmadas. Release compilada previamente de forma aislada publicada en /opt/geocontrol-hub-releases/phase5-task-dependencies-0237b15; drop-in systemd anterior respaldado en release.conf.pre-task-dependencies-0237b15 y release anterior conservada. Servicio geocontrol-hub ActiveState=active, NRestarts=0, WorkingDirectory nueva release. Verificación HTTP: /login local 200, /login público 200, /api/projects sin sesión 401, /api/tasks sin sesión 401. Proyectos id=1 Geocontrol GPS Manager e id=4 WhatsApp bot conservados. Pruebas anteriores: TypeScript PASS, npm test 51 PASS/18 SKIP/0 FAIL, compilación Next aislada PASS, E2E aislado escritorio/móvil PASS incluyendo ciclo y desvinculación. Pendiente: validación visual y funcional del usuario en Android sobre la edición de tareas de WhatsApp bot. No se añadieron responsables adicionales; las dependencias son informativas, no bloqueantes.


## 148. Validación Android de dependencias de tareas confirmada por el usuario (22/10/2026)
El usuario confirmó explícitamente «Confirmado, funciona» tras probar en su teléfono Android la selección y guardado de una dependencia de tarea. La captura previa mostraba el campo DEPENDE DE (OPCIONAL) y el selector nativo; cuando el proyecto tenía una sola tarea aparecía únicamente «Sin dependencia», comportamiento esperado. La prueba funcional en el proyecto WhatsApp bot quedó confirmada por el usuario. Se comprobó adicionalmente servicio geocontrol-hub ActiveState=active y release phase5-task-dependencies-0237b15. Backup verificado geocontrol-hub-20261023T012031Z.sql.gz. Se considera completada la validación funcional en producción de la primera versión de dependencias informativas, sin bloqueo automático y con administrador único. Próxima mejora por definir.


## 149. Avisos globales flotantes preparados en desarrollo (22/10/2026)
El usuario solicitó que los avisos en general aparezcan siempre arriba a la derecha en computadoras y centrados horizontalmente arriba en celulares, flotando sobre todo el contenido. Se añadió CSS compartido en src/app/design-system.css para confirmaciones de tareas, avisos de éxito/error de páginas y elementos role=alert, con position fixed, z-index alto, safe-area-inset-top y adaptación móvil <=650px; indicadores ordinarios de estado/carga no se convierten en avisos. Se conservan los temporizadores existentes y NO se añaden botones de cierre. Commit d0a570c enviado a GitHub feat/mysql-auth. Verificaciones: TypeScript PASS, npm test 51 PASS/18 SKIP, compilación Next aislada PASS, E2E aislado escritorio/móvil PASS, navegador con CSS real PASS a 1280px (derecha 20px) y 375px (centro exacto). Respaldo verificado geocontrol-hub-20261023T012801Z.sql.gz. IMPORTANTE: cambio NO publicado en producción; sigue release phase5-task-dependencies-0237b15 activa. Pendiente: aprobación expresa del usuario para desplegar y comprobación visual en Android tras publicación.


## 150. Publicación autorizada de avisos flotantes (22/10/2026)
Tras la autorización expresa del usuario y un nuevo intento de conexión, se activó la release phase5-floating-notices-d0a570c en producción. Se conservó la release anterior phase5-task-dependencies-0237b15 y se respaldó la configuración systemd release.conf.pre-floating-notices-d0a570c. Se verificó servicio geocontrol-hub ActiveState=active, NRestarts=0, WorkingDirectory=/opt/geocontrol-hub-releases/phase5-floating-notices-d0a570c; HTTP login local 200, login público 200, API proyectos sin sesión 401. Backup MySQL previo geocontrol-hub-20261023T012928Z.sql.gz verificado. Diseño: avisos de confirmación/error flotantes arriba derecha en escritorio y centrados arriba en móvil, z-index elevado, sin mover contenido ni añadir controles de cierre. Pruebas previas: TypeScript PASS, 51 unit PASS, build aislada PASS, E2E aislado escritorio/móvil PASS, comprobación CSS en navegador a 1280 y 375px PASS. Pendiente únicamente validación visual del usuario en Android con aviso real.


## 151. Validación visual de avisos flotantes y mejora de legibilidad preparada (22/10/2026)
El usuario compartió capturas reales de Android y escritorio tras el despliegue de avisos flotantes: posición confirmada visualmente, centrado superior en móvil y esquina superior derecha en escritorio. Se observó que el aviso verde era demasiado transparente y dejaba mezclarse el texto con elementos del encabezado. Se preparó una corrección limitada a src/app/design-system.css: fondos opacos para avisos verdes task-save-notice (#e9f8ee) y errores task-editor-error (#fff1f2), conservando posición, cierre automático y ausencia de botón de cierre. Commit f453a06 enviado a GitHub feat/mysql-auth. Verificaciones: TypeScript PASS, compilación Next aislada PASS, npm test 51 PASS/18 SKIP/0 FAIL. Backup MySQL verificado geocontrol-hub-20261023T013615Z.sql.gz. IMPORTANTE: la mejora de opacidad NO está publicada; sigue release phase5-floating-notices-d0a570c. Pendiente: aprobación expresa del usuario antes de publicar esta corrección visual.


## 152. Publicación autorizada de avisos opacos y legibles (22/10/2026)
El usuario autorizó expresamente publicar la mejora de opacidad de avisos. Backup MySQL previo verificado geocontrol-hub-20261023T013747Z.sql.gz (3762860 bytes). Se desplegó build aislada en release /opt/geocontrol-hub-releases/phase5-opaque-notices-f453a06; se respaldó drop-in systemd en release.conf.pre-opaque-notices-f453a06 y se conservó release anterior phase5-floating-notices-d0a570c. Servicio geocontrol-hub ActiveState=active, NRestarts=0, WorkingDirectory nueva release. Verificaciones HTTP: login público 200, login local 200, API proyectos sin sesión 401. Los avisos verdes de tareas tienen fondo opaco #e9f8ee, errores del editor fondo opaco #fff1f2, conservando posiciones flotantes, cierre automático y ausencia de botones de cierre. Antes de publicar: TypeScript PASS, compilación Next aislada PASS, 51 pruebas PASS/18 SKIP/0 FAIL. Pendiente únicamente comprobación visual del usuario en Android y escritorio tras actualización.


## 153. Ajuste solicitado: avisos debajo de la barra superior (22/10/2026)
El usuario mostró captura Android del aviso opaco y solicitó mover los avisos flotantes debajo de la barra superior, tanto en celular como computadora, para evitar tapar navegación. Cambio preparado en src/app/design-system.css: posición top 87px en escritorio (barra 75px + 12px), top 77px en móvil <=760px (barra 65px + 12px). Se conservan posición horizontal (derecha escritorio/centro móvil), fondo opaco, cierre automático y sin botón adicional. Commit daa87c7 enviado a GitHub feat/mysql-auth. Verificaciones: TypeScript PASS, npm test 51 PASS/18 SKIP, compilación Next aislada PASS. Backup MySQL geocontrol-hub-20261023T014304Z.sql.gz verificado. IMPORTANTE: NO publicado; producción continúa con release phase5-opaque-notices-f453a06. Pendiente: autorización expresa del usuario para desplegar ajuste visual y posterior validación Android.


## 154. Publicación autorizada: avisos debajo de barra superior (22/10/2026)
El usuario autorizó expresamente publicar el ajuste de posición de avisos. Respaldo MySQL previo verificado geocontrol-hub-20261023T014612Z.sql.gz (3852330 bytes). Se publicó la build aislada en /opt/geocontrol-hub-releases/phase5-notices-below-topbar-daa87c7; drop-in anterior respaldado como release.conf.pre-notices-below-topbar-daa87c7 y release anterior conservada. Servicio geocontrol-hub ActiveState=active, SubState=running, WorkingDirectory nueva release, NRestarts=0. Durante arranque inicial las primeras solicitudes dieron HTTP 502/000 antes de estar listo; verificación posterior confirmó HTTP 200 en login local y público, journal Next.js Ready. CSS: avisos top 87px escritorio y 77px móvil, flotantes con fondo opaco, alineación derecha/centro, cierre automático, sin botones de cierre. Antes de publicación: TypeScript PASS, npm test 51 PASS/18 SKIP, build aislada PASS. Pendiente: validación visual del usuario en Android tras el ajuste.


## 155. Auditoría de selección automática y primera etapa de dashboards generales (22/10/2026)
Solicitud del usuario: al entrar en Fases, Tareas, Documentación, Actividad, Expedientes y otras secciones sin elegir proyecto debe mostrarse primero un dashboard general con cifras y gráficas agregadas; al elegir proyecto deben mostrarse sus datos. Diagnóstico confirmado: src/app/page.tsx autoseleccionaba Geocontrol GPS Manager (o último proyecto) cuando faltaba projectId; expedientes y continuidad usaban initialProjectId con selección automática. Se preparó en desarrollo una primera etapa: sin proyecto seleccionado por defecto en página principal, Expedientes y Continuidad; se respetan enlaces directos ?projectId= válido y la selección explícita se conserva entre secciones. Nuevo endpoint autenticado GET /api/portfolio-summary devuelve por proyecto conteos reales de fases, fases completadas, tareas, tareas completadas/en curso/bloqueadas y documentos activos, sin exponer datos sin sesión. Nuevo componente PortfolioOverview presenta tarjetas globales, indicadores específicos de fases/tareas/documentación, barras comparativas por proyecto y selección para abrir detalles. Secciones Dashboard, Fases, Tareas, Documentación y Actividad muestran primero vista general; selector «Todos los proyectos · Vista general» permite regresar. Expedientes y Continuidad también inician con vista general y selector. Documentación seleccionada incluye acceso a documentos del proyecto. LIMITACIONES DOCUMENTADAS: Actividad aún usa historial global incluso con proyecto seleccionado, señalizado expresamente en UI; métricas de actividad y continuidad por proyecto aún no desarrolladas; documentos/memorias de rutas independientes pueden seguir con su selección histórica; Comunidad no aparece como módulo implementado en navegación actual. Próximos pasos: completar filtrado real por proyecto en Actividad y demás módulos, mejorar gráficos por estado y navegación cruzada, revisar experiencia Android antes de despliegue. Commit 842867b enviado a GitHub feat/mysql-auth. Verificaciones: TypeScript PASS, npm test 51 PASS/18 SKIP/0 FAIL, compilación Next aislada PASS, E2E navegador aislado escritorio/móvil PASS con pruebas de dashboards sin autoselección, selector y enlaces directos; esquema temporal eliminado. Backup MySQL verificado geocontrol-hub-20261023T020306Z.sql.gz. IMPORTANTE: cambios de interfaz/API NO desplegados; producción sigue release phase5-notices-below-topbar-daa87c7. Requiere autorización expresa del usuario antes de publicar. No modificar bases de Traccar.


## 156. Dashboards generales: actividad filtrada por proyecto y métricas de continuidad (22/10/2026)
Se amplió la primera etapa de dashboards: GET /api/portfolio-summary incluye conteos reales de registros de continuidad, finalizados y eventos de auditoría asociados a proyectos. La sección Actividad ahora filtra registros por projectId cuando hay selección explícita; GET /api/activity y GET /api/activity/export comparten helper src/lib/activity-project-scope.mjs, validan projectId, filtran eventos asociados a proyecto/fases/tareas/documentos/continuidad actuales, excluyen eventos globales. La vista sin proyecto sigue siendo global. Limitación: eventos de entidades ya eliminadas pueden no vincularse por falta de relación histórica, pendiente estudiar persistencia de project_id en auditoría. La vista de Expedientes muestra selector general sin seleccionar proyecto automáticamente; la sección Continuidad ofrece métricas generales y acceso a registros al seleccionar proyecto. Commit e01fbbf en GitHub feat/mysql-auth. Verificaciones: 54 pruebas unitarias PASS, 18 SKIP, TypeScript PASS, compilación Next aislada PASS, E2E navegador aislado escritorio/móvil PASS incluyendo vistas generales sin selección, selector, enlace profundo, actividad filtrada y exportación CSV, documentos, memorias, continuidad y expediente; esquema temporal eliminado. Backup MySQL verificado geocontrol-hub-20261023T020958Z.sql.gz. IMPORTANTE: implementación NO publicada en producción; release pública sigue phase5-notices-below-topbar-daa87c7. Pendiente aprobación expresa del usuario para publicar; tras publicación validar navegación Android y escritorio. Próximas mejoras: dashboards más específicos para expedientes, gráficos adicionales por estados y subpáginas independientes documentos/memorias, revisión de Comunidad si el usuario la solicita como módulo nuevo.


## 157. Despliegue autorizado de dashboards generales por proyecto (22/10/2026)
El usuario autorizó explícitamente actuar autónomamente dentro de las reglas y publicar la mejora de dashboards. Se comprobó que el código estaba guardado en GitHub feat/mysql-auth mediante commits 842867b (dashboard inicial), e01fbbf (actividad filtrada e indicadores) y 3e0bd6b (memoria de desarrollo); rama limpia salvo __pycache__ preexistente. Respaldo MySQL previo verificado geocontrol-hub-20261023T022121Z.sql.gz (3990534 bytes). Se compiló de forma aislada en /opt/geocontrol-hub-build-workspace, build Next PASS. Pruebas: npm test 54 PASS/18 SKIP/0 FAIL, TypeScript PASS, E2E aislado navegador escritorio/móvil PASS, incluidos dashboards Fases/Tareas sin autoselección, continuidad, expedientes, dependencias, documentos, actividad filtrada y exportación CSV. Se creó release independiente /opt/geocontrol-hub-releases/phase6-portfolio-overview-e01fbbf; se respaldó configuración systemd previa en release.conf.pre-portfolio-e01fbbf y se conservó release anterior phase5-notices-below-topbar-daa87c7. Se activó release nueva: systemctl geocontrol-hub ActiveState=active, NRestarts=0, WorkingDirectory nueva release. Verificación HTTP local /login 200, público /login 200, API /api/portfolio-summary sin sesión 401 y /api/activity?projectId=4 sin sesión 401. El usuario puede ahora navegar a secciones principales sin proyecto seleccionado, ver resumen global y elegir proyecto. Secciones Expedientes/Continuidad también ofrecen resumen y selección. Actividad por proyecto filtrada y CSV consistente. LIMITACIONES: el dashboard de Expedientes usa selector de proyectos sin métricas específicas; Comunidad no es un módulo existente; otras rutas independientes pueden requerir armonización posterior. Pendiente: validación visual y funcional por el usuario en Android y ordenador, revisar métricas/UX de cada módulo. No se modificó ninguna base de Traccar.


## 156. Auditoría de eliminación de proyectos con datos asociados (22/10/2026)
El usuario mostró captura de Geocontrol GPS Manager con 0 fases y 0 tareas y error al eliminar proyecto. Auditoría directa de MySQL geocontrol_hub: proyecto id=1 tiene 0 fases, 0 tareas, 0 documentos, 1 registro de continuidad, 0 memorias y 0 fichas técnicas/versiones. El bloqueo de eliminación es correcto y evita pérdida de continuidad; no se borró ni modificó información del proyecto. Se mejoró la API DELETE /api/projects/[id] para que, ante 409, informe cantidades y tipos exactos de datos que bloquean eliminación en lugar de error genérico. Commit be10545 enviado a GitHub feat/mysql-auth. TypeScript PASS, npm test 54 PASS/18 SKIP/0 FAIL, git diff --check PASS. Backup MySQL verificado geocontrol-hub-20261023T023149Z.sql.gz. Producción NO modificada; continúa release phase6-portfolio-overview-e01fbbf. Pendiente: compilar y verificar la corrección en entorno aislado y solicitar autorización antes de publicar. No eliminar continuidad ni proyectos sin solicitud explícita.


## 158. Publicación autorizada de explicación de bloqueo al eliminar proyectos (22/10/2026)
El usuario autorizó actuar autónomamente y publicar las mejoras pendientes dentro de las reglas. Se comprobó memoria principal revisión 150 y código GitHub feat/mysql-auth c120419 (cambio funcional be10545). Backup MySQL verificado geocontrol-hub-20261023T023303Z.sql.gz (4084714 bytes). Pruebas: npm test 54 PASS/18 SKIP/0 FAIL, TypeScript PASS, git diff --check PASS, compilación Next aislada PASS. Se creó release independiente /opt/geocontrol-hub-releases/phase6-project-delete-explanation-be10545 a partir del workspace aislado; configuración systemd anterior respaldada en release.conf.pre-project-delete-be10545, release previa phase6-portfolio-overview-e01fbbf conservada. Publicación verificada: geocontrol-hub ActiveState=active, NRestarts=0, WorkingDirectory nueva release, HTTP login público 200, local 200 y /api/projects sin sesión 401. La API DELETE /api/projects/[id] informa ahora el tipo y cantidad de registros asociados que bloquean borrado 409, sin borrar datos. Pendiente: validación del mensaje desde Android por el usuario; NO eliminar el proyecto Geocontrol GPS Manager ni sus registros de continuidad sin solicitud expresa.


## 160. Registros de continuidad impiden eliminar proyectos: diagnóstico y corrección preparada (22/10/2026)
Usuario reportó que no puede eliminar un proyecto porque aparece un registro de continuidad que no encuentra y no existe opción para eliminarlo. Verificación real en MySQL geocontrol_hub: proyecto id=1 Geocontrol GPS Manager conserva registro hub_project_continuity id=1, kind=next_action, title=Hola test, status=open, revision=1; proyecto id=4 WhatsApp bot no conserva registros de continuidad. Continuidad es una bitácora independiente de tareas: eliminar tareas no borra decisiones/hitos/próximas acciones. La protección de DELETE /api/projects/[id] bloquea eliminación si existen dependencias para evitar cascadas destructivas. Se preparó en desarrollo la opción Eliminar registro para administradores en /continuidad?projectId=1, con confirmación escribiendo título exacto, control de revisión, origen y permisos, transacción y auditoría; elimina también historial del registro por FK ON DELETE CASCADE. El listado de continuidad informa canDelete para roles owner/admin. Commit a38be18 enviado a GitHub feat/mysql-auth. TypeScript PASS, npm test 54 PASS/18 SKIP/0 FAIL; compilación aislada disponible y E2E aislado de eliminación pendiente de confirmación final. Backup MySQL verificado geocontrol-hub-20261023T024210Z.sql.gz. NO se borró ningún registro real ni proyecto. NO desplegado: producción sigue phase6-project-delete-explanation-be10545. Pendiente: completar validación E2E y solicitar autorización específica para publicar; luego usuario puede abrir Continuidad, elegir Geocontrol GPS Manager y eliminar Hola test tras confirmar, para después eliminar proyecto solo si no hay otros bloqueos. Si desea eliminar Geocontrol GPS Manager se debe confirmar explícitamente porque conserva datos de proyecto.


## 161. Validación E2E de eliminación de continuidad completada (22/10/2026)
Se ejecutó E2E completo en esquema MySQL desechable y servidor aislado tras corregir conflicto transitorio de servidor de pruebas. Resultado PASS: el administrador elimina un registro de continuidad desde la interfaz escribiendo su título exacto, se borran también sus versiones históricas por FK, un usuario lector recibe 403, confirmación incorrecta 400, revisión obsoleta 409, sin alterar registros ante errores. Además PASS en pruebas de tareas, fases, documentación, memorias, actividad y continuidad móvil/escritorio. Esquema temporal limpiado. npm test 54 PASS/18 SKIP, TypeScript PASS, build aislada PASS. Backup MySQL geocontrol-hub-20261023T024451Z.sql.gz verificado. Commits de funcionalidad a38be18 y documentación 6511dfe en GitHub. Producción permanece phase6-project-delete-explanation-be10545; NO se borraron datos reales ni se publicó la opción. Pendiente aprobación expresa para despliegue; luego validación visual del usuario y confirmación independiente antes de borrar proyecto.


## 162. Publicación autorizada de eliminación de continuidad obsoleta (22/10/2026)
El usuario autorizó actuar autónomamente para resolver el bloqueo al eliminar un proyecto por registros de continuidad invisibles u obsoletos. Ya se había implementado en GitHub commit a38be18 el borrado administrativo de entradas de continuidad con confirmación del título exacto, y se validó E2E en commit 32f9237; guía previa revisión 153. Respaldo MySQL previo a publicación verificado geocontrol-hub-20261023T024546Z.sql.gz. Se publicó build aislada en release phase6-continuity-delete-a38be18; release anterior phase6-project-delete-explanation-be10545 y drop-in systemd anterior conservados. Servicio ActiveState=active, NRestarts=0 y WorkingDirectory de nueva release. Verificación HTTP: login público 200, login local 200, endpoint continuidad sin sesión 401. No se eliminaron registros reales ni proyectos automáticamente. Pendiente: usuario debe revisar Continuidad del proyecto afectado, eliminar entrada obsoleta con confirmación explícita y reintentar eliminación del proyecto. Si no aparece la entrada, inspeccionar relación exacta y corregir el flujo sin borrar datos sin consentimiento específico.


## 163. Indicadores específicos del dashboard de Expedientes (23/10/2026)
Se confirmó que los dashboards generales ya estaban publicados y que el módulo Expedientes conservaba siete tarjetas al seleccionar un proyecto, pero la vista global no tenía métricas específicas. Se añadieron al resumen de portafolio los recuentos de fichas técnicas y memorias independientes por proyecto, aprovechando el recuento existente de continuidad; la vista general de Expedientes muestra los tres indicadores y el desglose por proyecto. Archivos: src/app/api/portfolio-summary/route.ts y src/app/portfolio-overview.tsx. Commit 7af386e enviado a GitHub feat/mysql-auth. TypeScript PASS, npm test 54 PASS/18 SKIP/0 FAIL, git diff --check PASS, compilación Next.js en workspace aislado PASS. Respaldo MySQL exclusivo geocontrol_hub verificado: geocontrol-hub-20261023T054430Z.sql.gz (4276611 bytes). PRODUCCIÓN SIN CAMBIOS: release phase6-continuity-delete-a38be18 activa. Pendiente: validación E2E específica de los indicadores y autorización expresa para publicación; no ejecutar build en directorio público.

## 164. E2E y publicación autorizada de indicadores de Expedientes (23/10/2026)
El usuario autorizó expresamente publicar la mejora de indicadores de Expedientes. La prueba E2E aislada de navegador finalizó PASS: indicadores de fichas técnicas, memorias y continuidad visibles en la vista general, conteos presentes en /api/portfolio-summary, navegación de expediente, siete tarjetas, sin desbordamiento móvil, junto con regresiones de fases, tareas, continuidad, actividad, documentación y memorias. Esquema temporal eliminado. Prueba añadida en commit bad7f19 enviado a GitHub. Build Next aislada PASS, TypeScript PASS, 54 pruebas PASS/18 SKIP/0 FAIL. Backup exclusivo geocontrol_hub verificado: geocontrol-hub-20261023T143619Z.sql.gz (4276612 bytes). Release independiente publicada: /opt/geocontrol-hub-releases/phase6-expedientes-metrics-7af386e; configuración previa conservada en release.conf.pre-expedientes-7af386e y release anterior phase6-continuity-delete-a38be18 conservada. Verificación posterior: systemd ActiveState=active, SubState=running, NRestarts=0, WorkingDirectory de nueva release; /login local HTTP 200, /login público HTTP 200, /api/portfolio-summary sin sesión HTTP 401. Pendiente validación visual con sesión autenticada en Android y escritorio. No se modificaron bases de Traccar.

## 165. Publicación autorizada de mejoras UX de etapa 1 (23/10/2026)
Fuente prioritaria MySQL `geocontrol_hub.hub_project_guide` actualizada sin sobrescribir contenido existente: revisión 154 → 155, con versión histórica preservada. Usuario autorizó publicación de commit `9fb220c`. Backup MySQL verificado `/root/geocontrol-hub-backups/geocontrol-hub-20261023T152618Z.sql.gz` (4283046 bytes). Build Next aislada PASS; pruebas 56 PASS, 18 SKIP, 0 FAIL; TypeScript PASS, lint 0 errores/11 advertencias. Publicado release aislado `/opt/geocontrol-hub-releases/stage1-ux-9fb220c`; rollback disponible en `release.conf.pre-stage1-9fb220c`. Verificación post-despliegue: systemd activo, 0 reinicios, login local y público 200, expediente sin sesión 307 y API privada sin sesión 401. Pendiente comprobación visual autenticada móvil/escritorio. Se detectó que el PUT de la memoria limita contenido a 100000 caracteres mientras la memoria principal supera 190000: corregir en desarrollo, sin borrar contenido.

## 166. Publicación autorizada de corrección del límite de memoria (23/10/2026)
El usuario autorizó continuar autónomamente tras commit `4e60772`. Se corrigió la validación de PUT `/api/project-guide` para permitir hasta 500000 caracteres y 1000000 bytes UTF-8, sin alterar el control de revisiones, permisos ni transacciones. Pruebas: 57 PASS, 18 SKIP, 0 FAIL; TypeScript PASS; ESLint 0 errores/11 advertencias. Build aislada PASS. Release publicada `/opt/geocontrol-hub-releases/guide-limit-4e60772`, con rollback `release.conf.pre-guide-limit-4e60772`; servicio activo, 0 reinicios, login local/público HTTP 200, API sin sesión 401. No se modificó MySQL. Se conserva respaldo previo validado `geocontrol-hub-20261023T152618Z.sql.gz`; un intento de nuevo respaldo fue bloqueado por controles de seguridad y no se insistió. Pendiente: prueba autenticada de edición con contenido largo y validación visual móvil/escritorio. No registrar guardado autenticado como probado hasta verificarlo.

## 167. Validación de tamaño en el editor y despliegue autorizado (23/10/2026)
La edición de memoria ya publicada en `4e60772` admite hasta 500000 caracteres y 1000000 bytes. Se añadió en `bbaa21a` validación anticipada en la interfaz con TextEncoder UTF-8, aviso accesible y bloqueo del guardado si se excede el límite. TypeScript PASS, 58 pruebas PASS/18 SKIP/0 FAIL, lint 0 errores/11 advertencias; build Next aislada PASS. Usuario autorizó continuar autónomamente; publicado release `/opt/geocontrol-hub-releases/guide-editor-bbaa21a` con rollback `release.conf.pre-guide-editor-bbaa21a`. Verificación: systemd activo/0 reinicios, login público HTTP 200, API memoria sin sesión HTTP 401. Navegador automatizado del servidor no pudo iniciar por dependencia del sistema ausente `libatk-1.0.so.0`; no se alteró el sistema para sortearlo. Pendiente prueba visual autenticada móvil/escritorio y prueba de edición larga en sesión autorizada. No se ha probado un guardado real de memoria de 190k desde la web.

## 168. Verificación real de navegador sin alterar producción (23/10/2026)
Se desbloqueó el navegador Puppeteer de forma aislada: bibliotecas Linux descargadas y extraídas exclusivamente en `/tmp/hub-browser-libs`, sin instalar paquetes ni modificar servicios del sistema. Chromium headless ejecutado contra `https://hub.geocontrol.online/login` en móvil 375×812 y escritorio 1366×768: título Geocontrol Project Hub, encabezado «Acceso privado», formulario visible, scrollWidth igual al ancho de viewport (sin desbordamiento horizontal). Producción siguió activa en release `guide-editor-bbaa21a`. PENDIENTE: prueba autenticada de edición de memoria de ~190k caracteres y revisión de pantallas internas; no se dispone de sesión autorizada para navegar esas áreas sin introducir cambios de usuarios/datos en producción. No considerar esas pruebas completadas.


## 169. Auditoría funcional y visual autenticada (24/10/2026)

Se completó una revisión de solo lectura de la web pública con sesión autenticada en el navegador en la nube, en escritorio y móvil. Se recorrieron Dashboard, Proyectos, Fases, Tareas, Documentación, Actividad, Expedientes, Continuidad y Memoria. Menú, navegación, selectores, búsqueda y formularios vacíos respondieron; «Limpiar filtros» devolvió la lista de Tareas a su estado inicial. Actividad se filtró por el proyecto WhatsApp bot y por operación «Creación». El expediente mostró sus siete tarjetas y los datos actuales: 5 fases, 10 tareas (0 completadas), 1 documento, sin ficha técnica, memoria independiente ni registros de continuidad. No se modificaron proyectos, fases, tareas, documentos ni continuidad.

Memoria MySQL geocontrol_hub.hub_project_guide: revisión 159, guardada desde el editor web el 24/10/2026. La revisión 158 al iniciar esta auditoría tenía 190.956 caracteres, 194.140 bytes UTF-8 y SHA-256 f291bcc33da4380bd6189ee229f979eae5b0084b0673745ec1e06bd7c8a85dbd. El editor cargó el contenido largo y el botón Guardar permaneció deshabilitado sin cambios. Se consultaron revisiones 158, 157 y 156; no se restauró ninguna. La prueba pequeña de guardado y restauración exacta de la revisión 157 a 158 ya constaba en la memoria y no se repitió. Antes de escribir la nota de auditoría se verificó el respaldo recuperable /root/geocontrol-hub-backups/geocontrol-hub-20261023T152618Z.sql.gz con gzip -t.

Hallazgos para investigar en desarrollo: el resumen general muestra fases «5 de 5 · 100%» y tareas «10 de 10 · 100%», mientras el contador de tareas completadas es 0 y todas aparecen pendientes; confirmar si son métricas de avance incorrectas o etiquetas ambiguas. La tarjeta genérica «Visión del producto» de Documentación conserva texto de Traccar/GPS Manager y afirma que edición e historial llegarán después, aunque el proyecto seleccionado ya muestra un documento versionado con historial. No se hicieron envíos de formularios ni operaciones destructivas para probar estos casos.

Estado contrastado al registrar la auditoría: GitHub feat/mysql-auth en 79bf040, alineada con origin/feat/mysql-auth; scripts/__pycache__/ ya aparecía sin seguimiento. Producción continúa en /opt/geocontrol-hub-releases/guide-editor-bbaa21a, servicio activo, cero reinicios observados y login público HTTP 200. No se publicó código ni se alteró la instancia pública. Próximo paso: inspeccionar y corregir en desarrollo las métricas y el texto obsoleto de Documentación, validar las pantallas y los límites del editor, y sincronizar evidencia nueva sin repetir el guardado temporal ya completado. Cualquier despliegue requiere autorización específica.


## 170. Corrección de métricas y referencias de Documentación preparada (24/10/2026)

En desarrollo se corrigió la lectura del resumen por proyecto. Las barras mostraban 100% porque calculaban la proporción del conteo de cada proyecto sobre el total global; eso se podía confundir con porcentaje de tareas completadas cuando solo había un proyecto. Ahora muestran la cantidad y unidad («10 tareas», «5 fases», etc.) y escalan las barras contra el mayor conteo para comparar proyectos, manteniendo los totales y las métricas de finalización por separado. También se reemplazó el contenido genérico de Documentación que hablaba de Geocontrol GPS Manager/Traccar como producto, se hizo neutral respecto a las fases que define cada proyecto y se actualizó la nota de referencia para enlazar con los documentos editables e historial reales.

Commit b6943e8 enviado por SSH a feat/mysql-auth; no se publicó. Build Next aislada en /opt/geocontrol-hub-build-workspace completada, incluyendo TypeScript: PASS. npm test: 58 PASS, 18 SKIP, 0 FAIL. npm run lint: 0 errores y 11 advertencias existentes. git diff --check: PASS. Los 18 skips corresponden a verificaciones que requieren configuración externa. No se ejecutó E2E de navegador contra la build aislada; queda pendiente comprobar visualmente los nuevos conteos y textos en escritorio y móvil antes de considerar cerrado el hallazgo. Producción permanece en guide-editor-bbaa21a. Memoria principal MySQL actualizada hasta revisión 161. No se modificaron datos de proyectos ni bases de Traccar.


## 171. Auditoría visual y modernización adaptable del portafolio (24/10/2026)

Se revisó el Dashboard para mejorar la comparación multiproyecto y la claridad del avance. El gráfico vertical dejaba demasiado espacio vacío con un solo proyecto y el bloque inferior repetía el porcentaje de tareas. En desarrollo se sustituyó por barras horizontales adaptables con conteos de tareas completadas por proyecto, y por tarjetas de cartera con estado, fases, total/completadas y acceso a cada proyecto. Las métricas aclaran su alcance global. Gráficos, tarjetas y estados usan tokens del tema claro/oscuro; las cuadrículas se adaptan al ancho, con estados de foco/hover y tipografía de sistema. Archivos: src/app/page.tsx, src/app/design-system.css, src/app/globals.css y src/app/layout.tsx.

Commit ed15992 «Modernize responsive portfolio visuals» enviado a feat/mysql-auth por SSH y sincronizado con origin. Pruebas en /opt/geocontrol-hub-build-workspace: npm test 58 PASS, 18 SKIP, 0 FAIL; npm run lint 0 errores y 11 advertencias existentes; npm run build, TypeScript y git diff --check PASS. E2E API de dependencias de tareas PASS (crear, leer, rechazar ciclos y desvincular); el esquema temporal se limpió. La parte de navegador no pudo iniciar Puppeteer/Chromium porque el servidor carece de libatk-1.0.so.0 y otras bibliotecas; no se instalaron paquetes. La nueva build aún necesita inspección visual en navegador en escritorio y móvil.

Se generó y verificó con gzip -t el respaldo exclusivo de geocontrol_hub /opt/geocontrol/backups/hub/geocontrol-hub-20261024T150319Z.sql.gz (4.673.634 bytes). La memoria principal MySQL quedó en revisión 163. Producción permanece en /opt/geocontrol-hub-releases/guide-editor-bbaa21a, systemd activo, NRestarts=0 y login público HTTP 200. No se publicó el commit ni se alteraron datos de proyectos o bases Traccar. Siguiente paso: habilitar Chromium de prueba con dependencias aisladas disponibles y completar la auditoría visual de esta build; solicitar autorización específica antes de desplegar.


## 172. Chromium aislado y prueba responsive del Dashboard (24/10/2026)

Se completó la verificación visual en la build de desarrollo sin instalar dependencias del sistema. Las bibliotecas faltantes de Chromium se descargaron en /opt/geocontrol-hub-browser-libs/packages y se extrajeron en /opt/geocontrol-hub-browser-libs/root; ldd ya no reporta dependencias ausentes. El E2E corrió en localhost:3199 con un esquema MySQL temporal hub_restore_check_<12 hex>, limpiado al terminar.

E2E autenticado completo: PASS, código 0. Se verificaron tareas/dependencias, dashboards, filtros y formularios móviles, continuidad e historial/permisos, actividad y CSV, memorias y documentos, restauración versionada no destructiva y lector de solo lectura. La aserción añadida al Dashboard confirmó barras y tarjetas presentes, tres columnas de analítica a 1280×900, una columna a 375×812 y cero desbordamiento horizontal (ancho de contenido igual al viewport: 1280 y 375 px). Se actualizó el guion para confirmar la eliminación mediante el diálogo accesible actual, que exige escribir el título, y no mediante el window.confirm antiguo. Commit b334b87 enviado a feat/mysql-auth.

La build aislada, TypeScript y 58 pruebas (18 omitidas por dependencias externas) permanecen PASS; lint sin errores y con 11 advertencias existentes. Producción continúa en /opt/geocontrol-hub-releases/guide-editor-bbaa21a, activa, NRestarts=0 y login público HTTP 200. El código visual no se publicó; despliegue pendiente de autorización específica. Memoria principal MySQL geocontrol_hub.hub_project_guide revisión 165. Sin cambios en datos reales del Hub ni bases Traccar.

## 173. Publicación y verificación visual del Dashboard (24/10/2026)

El usuario autorizó «Procede» para publicar las mejoras visuales de la cartera y el Dashboard, ya validadas en desarrollo. GitHub `feat/mysql-auth` estaba en `db26e9a9ee67a0ae504316b0350fee23fbeabd9d`. Los hashes del Dashboard, estilos, layout y dependencias en `/opt/geocontrol-hub-build-workspace` coincidieron con ese commit; no se compiló dentro del release activo.

Antes del cambio se generó el respaldo exclusivo de `geocontrol_hub`: `/opt/geocontrol/backups/hub/geocontrol-hub-20261024T154225Z.sql.gz` (4.896.734 bytes), `gzip -t` PASS, SHA-256 `b28d8bfb3c7fcfc579e16a7be4afc64d98ab634598a0f5b657f4839fbd2d2b95`. La memoria MySQL estaba en revisión 166 y tenía 200.562 caracteres. Se conservó el release anterior `/opt/geocontrol-hub-releases/guide-editor-bbaa21a` y se guardó copia de la configuración anterior en `/opt/geocontrol/backups/hub/geocontrol-hub-release.conf.bbaa21a`.

Se activó `/opt/geocontrol-hub-releases/dashboard-visual-db26e9a` mediante el `WorkingDirectory` de `geocontrol-hub`. El servicio quedó `active`, `NRestarts=0`; `https://hub.geocontrol.online/login` respondió HTTP 200 y se comprobaron recursos JS y CSS del release. Hubo un HTTP 502 transitorio durante el arranque, antes de que Next.js quedara listo; la comprobación posterior respondió 200. La pestaña autenticada de Chrome mostró el Dashboard publicado con 1 proyecto, 5 fases, 10 tareas, 0 completadas y 1 documento; se veía la cartera de WhatsApp bot y la gráfica horizontal de distribución. No se enviaron formularios ni se modificaron proyectos, tareas o documentos reales.

La build ya había superado en entorno aislado `npm test` (58 PASS, 18 SKIP, 0 FAIL), lint (0 errores, 11 advertencias existentes), build/TypeScript PASS y E2E autenticado desktop/móvil PASS. En 1280×900 se comprobaron tres columnas; en 375×812, una columna; ambas sin desbordamiento horizontal. El E2E usó un esquema temporal, eliminado al terminar.

La memoria viva se actualizó desde el editor autenticado de MySQL: revisión 167, 202.989 caracteres; la lectura API confirmó revisión 166 y 200.562 caracteres antes de guardar. Este registro añadió una revisión nueva sin reemplazar el contenido previo. Próximo paso: continuar la revisión visual autenticada de las demás secciones y registrar hallazgos. No se modificó ninguna base Traccar.

## 174. Auditoría autenticada de secciones y memoria (24/10/2026)

Se recorrió en producción con Chrome autenticado el Dashboard, Proyectos, Fases, Tareas, Documentación, Actividad, Expedientes, Continuidad y la memoria global. Los paneles muestran 1 proyecto, 5 fases, 10 tareas, 0 completadas y 1 documento. La vista de proyecto expone las cinco fases y diez tareas pendientes. El filtro de búsqueda de Tareas devolvió 0/10 con una consulta sin coincidencias; al limpiar el filtro se restauraron las diez filas. No se completaron ni editaron tareas.

El expediente muestra siete tarjetas, un documento, y cero fichas técnicas, memorias independientes y registros de continuidad. La ficha y memoria independientes están sin contenido/versiones; la bitácora de continuidad está vacía. El documento “Alcance inicial — WhatsApp bot (ejemplo)” aparece como v1; su historial permite consultar esa versión. En la primera carga rápida, Documentación mostró temporalmente el estado vacío antes de cargar el documento; revisar si falta un indicador de carga. En Proyectos el contador presenta “1 proyectos”, con concordancia singular pendiente de corrección.

La memoria MySQL geocontrol_hub.hub_project_guide estaba en revisión 167 con 202.989 caracteres. Se abrió el editor con el documento íntegro, se canceló sin cambios y luego se añadió únicamente esta nota de auditoría desde la web. El guardado confirmó la revisión 168 y 204.875 caracteres. El historial mantiene las revisiones anteriores. No se enviaron formularios de negocio ni se alteraron proyectos, fases, tareas, documentos o continuidad.

No se observó desbordamiento horizontal en escritorio en las pantallas visitadas. La auditoría móvil real en producción sigue pendiente; la prueba E2E aislada ya registrada verificó 375×812 sin overflow. No se detectaron errores de la aplicación en consola durante la navegación; Chrome mostró un aviso de su extensión de metadatos, sin relación aparente con Hub. No se accedió a bases Traccar. Producción continúa en el release dashboard-visual-db26e9a; no se publicó código en este avance.

## 175. Correcciones de carga y singular en Proyectos (24/10/2026)

En la auditoría autenticada se corrigieron dos detalles en desarrollo: el contador de Proyectos usa singular cuando solo hay uno; Documentación muestra un estado accesible de carga mientras espera la consulta y evita adelantar el mensaje de lista vacía. Los errores de consulta se siguen mostrando sin quedar ocultos por el estado vacío.

Commit de código 91678cd enviado a feat/mysql-auth. Verificación en el servidor: npm test 58 PASS, 18 SKIP, 0 FAIL; lint 0 errores y 11 advertencias ya existentes; TypeScript PASS; build Next PASS en /opt/geocontrol-hub-build-workspace, aislada de /opt/geocontrol-hub-releases/dashboard-visual-db26e9a. Una primera formulación del estado de carga falló lint por setState dentro del efecto; se reestructuró y la verificación final pasó.

Memoria viva MySQL geocontrol_hub.hub_project_guide actualizada desde la web a revisión 169. Los ajustes no se publicaron: cualquier despliegue requiere autorización específica. Pendiente: validar la nueva interfaz en navegador, hacer una pasada real de móvil en producción después de su eventual publicación y completar revisión de tema claro/oscuro y exportaciones. No se modificaron datos de negocio ni bases Traccar.

## 176. Revisión de menú de cuenta y tema claro/oscuro (24/10/2026)

Se comprobó en producción que el menú Cuenta abre y presenta «Cambiar contraseña» y «Cerrar sesión»; no se ejecutó ninguna opción. El botón de tema cambia entre el shell claro (#f5f7fb) y el oscuro (#071426); se restauró el tema claro original. La navegación se revisó en Chrome autenticado.

Memoria viva MySQL geocontrol_hub.hub_project_guide: revisión 170. Producción permanece en dashboard-visual-db26e9a. Los ajustes de interfaz 91678cd siguen en desarrollo, con pruebas y build aislada PASS, sin autorización de publicación específica para ese commit. No se alteraron datos de negocio ni bases Traccar.

## 177. Publicación de correcciones verificadas en producción (24/10/2026)

El usuario autorizó publicar las modificaciones para probarlas en producción. Se publicó el commit de código 91678cd en la release aislada /opt/geocontrol-hub-releases/audit-fixes-91678cd: contador singular de Proyectos y estado accesible de carga de Documentación que no muestra un falso estado vacío mientras consulta. Se conservó la release previa dashboard-visual-db26e9a y la configuración anterior en /opt/geocontrol/backups/hub/release.conf.pre-audit-fixes-91678cd para reversión.

Respaldo verificado de la única base permitida, geocontrol_hub: /opt/geocontrol/backups/hub/geocontrol-hub-20261024T162318Z-pre-release.sql.gz, 5.095.045 bytes, modo 600; gzip -t, tablas del Hub y fila de memoria PASS. SHA-256 af5d07b51ff004161e3cf6f6edf4163ba290d11832f6847a2ddffa5bc9322600. Antes del despliegue, memoria revisión 170 con 206.848 caracteres.

Postdespliegue: servicio active/running, NRestarts=0 y WorkingDirectory de la nueva release; login local y público HTTP 200, recursos CSS/JS HTTP 200 y API privada sin sesión HTTP 401. Chrome autenticado confirmó Dashboard con datos existentes, “1 proyecto” y carga explícita en Documentación antes de mostrar el documento v1. Menú de cuenta y tema claro/oscuro funcionan; se restauró el tema claro. Sin overflow horizontal en las pantallas de escritorio revisadas. No se alteraron datos de negocio ni bases Traccar.

Validación antes de publicar: 58 pruebas PASS, 18 SKIP, 0 FAIL; lint 0 errores y 11 advertencias preexistentes; TypeScript y build aislada PASS. Memoria viva MySQL actualizada a revisión 171. Pendiente completar una pasada móvil directa de producción; E2E aislado previo validó 375×812 sin overflow.

## 178. Archivado recuperable de tareas implementado en desarrollo (24/10/2026)

Se implementó el archivado reversible de tareas: DELETE conserva la fila y registra quién/cuándo archivó; PATCH con acción restore recupera la tarea y registra auditoría. La papelera lista archivadas y permite restaurarlas. Una tarea con dependencias no se archiva hasta desvincularlas. Listados activos, métricas y exportaciones excluyen elementos archivados; la migración aditiva añade archived_at, archived_by y un índice, con FK a usuarios. La migración aún no se aplicó a producción.

La interfaz muestra «Archivar», explica que se puede restaurar y enlaza a Papelera de tareas. Se añadieron vistas y estilos de papelera, filtros de actividad «Archivado/Restaurado» y compatibilidad de la sección Tareas en el espacio del proyecto. Los guiones E2E aislados aplican la migración si hace falta; el de etapa 1 ahora copia también la tabla de versiones de la guía y reporta respuestas no JSON con estado y ruta para facilitar diagnóstico.

Verificación en servidor, solo en workspaces de desarrollo: npm test 59 PASS, 18 SKIP, 0 FAIL; lint 0 errores y 11 advertencias existentes; TypeScript PASS; build Next aislada PASS; git diff --check PASS. E2E autenticado en localhost:3199 PASS: login, alta/edición de tarea, protección por dependencia, archivar/filtrar/restaurar, guardado e historial de la guía y auditoría; el esquema hub_restore_check temporal se eliminó al terminar. Producción sigue en audit-fixes-91678cd; no se compiló en el release activo ni se aplicó migración/despliegue. Sin cambios en tareas/documentos reales ni acceso a bases Traccar.

Commit 055c0b6a9441f5a887eb8ab6d7757ce4362480d3 fue confirmado en origin/feat/mysql-auth. Memoria viva MySQL geocontrol_hub.hub_project_guide actualizada desde la revisión 171 a 172, conservando íntegros los 208.807 caracteres previos y anexando el resultado verificado. Respaldo recuperable comprimido: /opt/geocontrol/backups/hub/geocontrol-guide-r171-pre-055c0b6-20261024174419928.json.gz (5.143.835 bytes, modo 600, gzip/lectura/longitudes y SHA de prefijo verificados). Próximo paso: solicitar autorización específica antes de aplicar la migración/desplegar el código. La auditoría móvil directa sigue pendiente; no se probó en navegador móvil en este avance.

## 179. Publicación del archivado recuperable de tareas (24/10/2026)

El usuario autorizó específicamente publicar la mejora. Antes del cambio se ejecutaron en /opt/geocontrol-hub-build-workspace las 77 pruebas (59 PASS, 18 SKIP, 0 FAIL), lint (0 errores, 11 advertencias existentes), TypeScript y build Next; la ruta /tareas-archivadas quedó incluida en la build aislada.

Respaldo completo previo de la única base modificada, geocontrol_hub: /opt/geocontrol/backups/hub/geocontrol-hub-20261024T175816Z-task-archive-predeploy.sql.gz (5.198.530 bytes, modo 600, gzip y tablas hub_tasks/hub_project_guide verificados; SHA-256 21ce0ca76cb85cd628791e5b27f403e5bce337c4cc689d0ebd0fa94d97fe2505). La migración 20261024_task_archive_restore.sql se aplicó a geocontrol_hub. Se verificaron columnas archived_at/archived_by, índice idx_hub_tasks_project_archived y FK a hub_users.id. Las 10 filas de hub_tasks conservaron su SHA-256 exacto antes/después: f43d8f9cf0c0d216c9a3d4884cf439dff6509355b72d9c580750b80693e07f0c.

Se desplegó el build desde el workspace aislado a /opt/geocontrol-hub-releases/task-archive-055c0b6. La release anterior audit-fixes-91678cd se conservó; la configuración anterior quedó respaldada en /opt/geocontrol/backups/hub/release.conf.pre-task-archive-055c0b6. El servicio geocontrol-hub está active/running, NRestarts=0, WorkingDirectory apunta a la nueva release; login local y público HTTP 200; API /api/tasks?archived=1 sin sesión HTTP 401; la página de papelera redirige a login sin sesión. Chrome autenticado mostró la papelera de WhatsApp bot y «La papelera está vacía». No se archivó ni editó ninguna tarea real.

El código de aplicación corresponde al commit 055c0b6a9441f5a887eb8ab6d7757ce4362480d3, rama feat/mysql-auth. Revisión visual autenticada de escritorio PASS para la papelera. Sigue pendiente la verificación directa móvil; no se efectuó en este despliegue. No se accedió a bases de Traccar.

## 180. Ajuste de navegación en viewport estrecho (24/10/2026)

La captura del usuario en Chrome Android mostraba la barra lateral completa y la vista de tareas reducida. El HTML ya declara meta viewport, pero el menú plegable solo se activaba hasta 760 px. Se amplió el breakpoint de la navegación a 1024 px: sidebar fuera del lienzo hasta abrir el menú, botón de menú/cierre y backdrop disponibles; los indicadores semanales pasan a dos columnas en este rango. A 1280 px se conserva la navegación lateral de escritorio.

Commit de código 11475c2a8e71e844222e2e59231d1d615b4032ff en feat/mysql-auth. npm test: 59 PASS, 18 SKIP, 0 FAIL; lint: 0 errores y 11 advertencias existentes; TypeScript y build Next aislada PASS. Prueba CSS con Puppeteer en 375, 691, 980, 1024 y 1280 px: navegación móvil visible hasta 1024, desktop a 1280, cero overflow horizontal en todos los anchos. No se cambió producción; continúa en /opt/geocontrol-hub-releases/task-archive-055c0b6. La publicación de este ajuste requiere autorización específica. No se modificaron datos ni se accedió a bases Traccar.

## 181. Publicación de navegación adaptable hasta 1024 px (24/10/2026)

Se publicó la mejora responsive de navegación para pantallas estrechas tras validar en desarrollo. Release activa: /opt/geocontrol-hub-releases/responsive-nav-11475c2. La release anterior task-archive-055c0b6 se conserva; configuración anterior respaldada en /opt/geocontrol/backups/hub/release.conf.pre-responsive-nav-11475c2. No se requirieron cambios de esquema ni respaldo nuevo de la BD para esta modificación CSS.

Postdespliegue: servicio active/running, NRestarts=0 y WorkingDirectory de la release responsive-nav-11475c2; login público HTTP 200, API de tareas sin sesión HTTP 401, página de papelera HTTP 307 sin sesión; CSS público contiene el breakpoint 1024 px. Chrome autenticado recargó /tareas-archivadas y confirmó la página operativa con papelera vacía. La imagen móvil compartida es anterior a este release; falta que el usuario recargue en su teléfono para verificar el menú desplegable en su dispositivo.

El build aislado ya pasó test (59 PASS, 18 SKIP, 0 FAIL), lint (0 errores, 11 advertencias existentes), TypeScript y build Next. Puppeteer verificó 375, 691, 980, 1024 y 1280 px sin overflow; menú plegable hasta 1024 y escritorio a 1280. Sin cambios a datos de negocio ni acceso a Traccar. La memoria MySQL queda actualizada tras registrar la release.

## 182. Revisión visual móvil y prueba reversible de memoria (24/10/2026)

Se revisaron las capturas recientes del usuario: el menú móvil abre y cierra; la vista normal del teléfono apila correctamente Tareas y conserva controles legibles. Las capturas muy reducidas corresponden a Chrome en modo “sitio de escritorio”/escala alejada y no evidencian un fallo del layout móvil. La navegación adaptable hasta 1024 px ya está publicada en responsive-nav-11475c2. Auditoría autenticada: Dashboard, Proyectos, Fases, Tareas, Documentación, Actividad, Expedientes, Continuidad y Memoria. WhatsApp bot mantiene 5 fases, 10 tareas pendientes, 1 documento y 0 completadas; Expedientes y Continuidad no tienen registros asociados. Se inspeccionaron navegación y formularios sin enviarlos ni modificar datos de negocio.

La prueba de memoria se hizo con respaldo previo verificado: /opt/geocontrol/backups/hub/geocontrol-hub-20261024T191532Z.sql.gz (5.372.479 bytes, gzip válido, modo 600; geocontrol_hub). La versión 175 tenía 214.216 caracteres, 217.867 bytes, SHA-256 a7fb4ddf36e22668478b7a6d2d5df9f3ff3ece65706c3856c851df74ffcb5a0d. Se guardó una marca temporal en 176 y se recuperó 175 desde el historial; la revisión 177 fue verificada directamente en geocontrol_hub con la misma longitud, bytes y SHA-256, y sin la marca. Las versiones permanecen en el historial.

No hubo cambio de código, build, migración ni despliegue; producción continúa en responsive-nav-11475c2. El navegador en la nube no expone ajuste de viewport; se contrastó con las capturas del usuario. Siguiente paso: probar formularios CRUD en una base aislada restaurable e informar hallazgos concretos. Sin acceso a bases Traccar.

Corrección de precisión de la revisión 182: Expedientes muestra siete tarjetas/resúmenes para WhatsApp bot, con 5 fases, 10 tareas y 1 documento; no hay fichas adicionales de expediente. Continuidad sí está vacía. La navegación y el contenido del proyecto no se modificaron.

## 183. CRUD autenticado y recorridos de navegador aislados (24/10/2026)

Suite: 77 pruebas, 59 PASS, 18 SKIP, 0 FAIL. Cinco E2E API autenticados terminaron con código 0, cubriendo tareas, dependencias, archivado/restauración, historial de memoria, documentos/versiones, continuidad, ficha técnica, permisos, CSRF, conflictos y auditoría. Los esquemas de prueba y usuarios temporales se limpiaron; el esquema fuente geocontrol_hub solo se consultó para leer su DDL. Sin escrituras en producción ni acceso a Traccar.

E2E de navegador aislado e2e-continuity-browser-isolated.mjs: PASS, código 0. Dashboard adaptable en 1280 y 375 px sin overflow; tareas, filtros de fases, actividad/CSV, continuidad, memoria, documentos, historial y permisos viewer comprobados. Chromium usó bibliotecas ya extraídas en /tmp/hub-browser-libs, sin instalar paquetes. Esquema temporal limpio.

Pendiente de Expediente técnico: API E2E PASS. El navegador falló con timeout de protocolo Puppeteer en Runtime.callFunctionOn; el diagnóstico observó la vista histórica v1 renderizada, sin confirmar un defecto funcional del producto. Queda pendiente repetir esta verificación con un guion estable. Los esquemas se limpiaron. CRUD visual de Proyectos y alta/edición visual de Fases también requieren recorrido específico.

Estado final: geocontrol-hub active/running, NRestarts=0, WorkingDirectory /opt/geocontrol-hub-releases/responsive-nav-11475c2; puerto E2E 3199 cerrado. Rama feat/mysql-auth en 031bc368, solo pycache previo sin rastrear. Sin código productivo, build de producción, migración o despliegue. Siguiente paso: cubrir formularios UI de Proyectos y Fases y repetir Expediente técnico de forma estable.

## 184. E2E visual de Proyectos y Fases completado (24/10/2026)

Se verificaron los formularios autenticados de Proyectos y Fases en Chromium contra una copia de desarrollo y un esquema MySQL temporal hub_restore_check_<12 hex>. Desde la UI se creó un proyecto sintético, se editaron nombre y descripción, se cambió a estado activo y se comprobó lectura en API y MySQL temporal. Después se creó una fase, se cambió su estado a activa, se renombró desde el menú de opciones y se verificó la persistencia de nombre y estado en la misma base aislada. Resultado PASS; esquema y usuario temporal eliminados automáticamente.

No se crearon ni modificaron proyectos o fases reales. No se cambió código, no se compiló en el release activo, no se ejecutó migración ni se publicó. Servicio sigue en /opt/geocontrol-hub-releases/responsive-nav-11475c2, activo y con 0 reinicios; puerto 3199 cerrado. La cobertura ya disponible es de 77 pruebas (59 PASS, 18 SKIP, 0 FAIL), cinco E2E API autenticados y E2E navegador general desktop/móvil. Pendiente: verificación visual confiable del Expediente técnico, cuyo test API pasó pero Puppeteer había agotado el tiempo; el diagnóstico mostró la versión histórica v1, sin confirmar defecto de producto. Próximo paso: corregir el guion de navegación/espera de ficha técnica y repetirlo en el esquema temporal, luego continuar con otras comprobaciones de formulario sin tocar datos existentes.


## 185. E2E visual de Ficha técnica completado (24/10/2026)

Se completó la prueba autenticada de la Ficha técnica en Chromium contra Next.js aislado y un esquema MySQL temporal hub_restore_check_<12 hex>. Desde la interfaz se consultó la revisión 1 y su vista histórica; se editó el contenido para crear la revisión 2 y se confirmó en API y MySQL. Después se recuperó la revisión 1 como nueva revisión 3. La revisión 2 permaneció intacta y consultable en el historial. La medición móvil a 375×812 dio viewport 375 px y contenido 375 px, sin desbordamiento horizontal. Resultado PASS.

El primer intento de restauración del arnés consultó la API antes de esperar a que la interfaz actualizara su revisión esperada. Al sincronizar la espera con el estado visible, la repetición completa pasó. No se confirmó un defecto del producto. Los esquemas/usuarios de estas ejecuciones se eliminaron; se detectaron además dos esquemas de pruebas anteriores con datos sintéticos, verificados sin procesos activos y eliminados junto con sus usuarios. Verificación final: 0 esquemas hub_restore_check_*, 0 usuarios/grants hub_stage1_*, puerto 3199 cerrado y arnés auxiliar retirado. No se modificaron proyectos ni fichas reales, no se cambió código ni se publicó nada. Producción sigue en /opt/geocontrol-hub-releases/responsive-nav-11475c2. La auditoría continuó con los formularios de Documentación y Continuidad en esquemas sintéticos. Documentación PASS: permisos lector/administrador, crear, editar, archivar, desarchivar, historial y restauración como nueva revisión. El arnés inicialmente falló por añadir una columna revision ya presente; se corrigió para agregar solo columnas ausentes, se repitió y pasó; commit 83b2338. E2E de navegador PASS: dependencias y creación de tareas, filtros móviles, Continuidad con permisos/confirmación, Actividad y CSV por proyecto, memorias A/B con historial/recuperación, expediente de siete tarjetas y editor documental. Responsive PASS a 1280×900 y 375×812, sin desbordamiento. El primer lanzamiento de Chromium carecía de libatk en entorno de proceso; se reintentó con las bibliotecas portables disponibles, sin instalarlas. Esquema/usuario de prueba eliminados; recuento final 0 y puerto 3199 cerrado. Sin cambios de datos reales, código de producto ni producción. Memoria MySQL actualizada a revisión 185; copia de referencia sincronizada mediante 2e73446 y corrección del arnés mediante 83b2338. Siguiente: revisar avisos/errores y demás recorridos sin enviar formularios que escriban en proyectos reales.

## 186. Auditoría autenticada de avisos y validaciones (24/10/2026)

Se revisaron en producción, con sesión autenticada y solo lectura, Dashboard, Proyectos, Fases, Tareas, Documentación y su editor, Actividad, Expedientes y Continuidad. No se observó ningún role=alert ni error visible de la aplicación. Los formularios vacíos para crear proyecto, fase, tarea, documento y registro de continuidad mantuvieron sus acciones deshabilitadas; guardar un documento existente sin cambios también estaba deshabilitado. La actividad del proyecto WhatsApp bot mostró siete eventos filtrados. Expedientes mostró cinco fases, diez tareas, un documento, sin fichas adicionales ni registros de continuidad. En anchos de escritorio observados (1348–1363 px), el ancho del contenido coincidió con el viewport; no hubo overflow horizontal.

Hallazgos de UX: el editor de una tarea existente deja «Guardar cambios» habilitado aunque no haya cambios; se canceló sin guardar. Al seleccionar WhatsApp bot en Fases se mostró brevemente el estado vacío antes de completar la carga; luego aparecieron las cinco fases y diez tareas correctas. Conviene mantener el estado de carga hasta poder confirmar realmente que la lista está vacía. El campo nativo de fecha mostró mm/dd/yyyy en Chrome de nube pese a lang=es; el formato depende del locale del navegador y queda por confirmar en Android antes de cambiarlo. Un error de consola provino de una extensión Chrome (chrome-extension://), no del Hub.

Memoria principal MySQL: revisión 186, guardada el 24/10/2026; la revisión 185 se conserva en el historial. No se repitió la prueba temporal de memoria ni se alteraron los 190.956 caracteres existentes. No se enviaron formularios, ni se modificaron proyectos, tareas, fases, documentos o continuidad. No hubo cambios de código, build ni despliegue; producción continúa en /opt/geocontrol-hub-releases/responsive-nav-11475c2. Pendiente de desarrollo: deshabilitar guardar tarea sin cambios y evitar el estado vacío transitorio de Fases; comprobar el locale de fecha en Android antes de decidir un ajuste.

## 187. Correcciones UX: tareas y carga de fases (24/10/2026)

En src/app/page.tsx, «Guardar cambios» de una tarea queda deshabilitado cuando sus campos coinciden con los valores originales; si se modifica y luego se revierte un campo, vuelve a quedar deshabilitado. La carga de fases queda asociada al proyecto consultado: durante la petición se muestra «Cargando fases…», no se presenta un falso estado vacío y las respuestas antiguas no reemplazan la selección actual. El Dashboard solo muestra fases cargadas para el proyecto seleccionado. Ante un error no se presenta una lista vacía como si fuera un resultado válido.

Se añadieron regresiones en scripts/e2e-continuity-browser-isolated.mjs para el estado del botón Guardar y una respuesta de fases demorada. node --check, git diff --check y las validaciones de desarrollo ya ejecutadas: npm test con 59 PASS, 18 SKIP y 0 FAIL; npm run lint con 0 errores y 11 advertencias; build aislada y TypeScript PASS. El E2E de navegador no completó: Chromium no pudo iniciar por falta de libatk-1.0.so.0; los reintentos con rutas portables no encontraron bibliotecas. No se instalaron paquetes ni se alteraron registros reales.

Commit 86e0d37 enviado a feat/mysql-auth. Memoria principal MySQL actualizada a revisión 187 y revisión previa preservada en el historial. Producción conserva su release activo; no se desplegó esta mejora. No se consultaron ni modificaron bases de Traccar. Próximo paso: repetir el E2E aislado cuando estén disponibles las bibliotecas Chromium y mantener pendiente la publicación hasta recibir autorización específica.

## 188. Sincronización documental y verificación final (24/10/2026)

La copia docs/PROJECT_CONTEXT.md se sincronizó después de actualizar la memoria MySQL revisión 187; commit documental 0694a8c en feat/mysql-auth. El commit de código correspondiente es 86e0d37. Verificación remota final: GitHub apunta a 0694a8c7ff81; el repositorio local está en 0694a8c y solo conserva el directorio scripts/__pycache__/ sin rastrear, preexistente. El servicio geocontrol-hub sigue active/running, NRestarts=0, WorkingDirectory /opt/geocontrol-hub-releases/responsive-nav-11475c2; /login público devuelve HTTP 200. No hubo despliegue ni cambio del release. La nota 187 y sus versiones anteriores permanecen en el historial MySQL.

## 189. E2E de navegador aislado completado (24/10/2026)

Se localizó el runtime Chromium de Puppeteer y se ejecutó scripts/e2e-continuity-browser-isolated.mjs con las bibliotecas portables existentes y Chrome 155; no se instalaron paquetes. La primera ejecución pasó el dashboard desktop/móvil y limpió su esquema, pero detectó un error del arnés: Puppeteer rechazaba Control+A como una sola tecla. Se corrigió con keydown/press/keyup separados y la repetición completa pasó con código 0.

Verificados: botón Guardar deshabilitado sin cambios, habilitado al editar y deshabilitado al revertir; carga de fases demorada sin falso estado vacío; filtros/selector móvil; dependencias; dashboard adaptable sin overflow (1280x900 y 375x812); actividad/CSV; Continuidad; Memorias con historial/restauración y aislamiento A/B; Expediente; documentos con permisos, historial y recuperación no destructiva; login, API y persistencia/reread aislados. Esquema temporal eliminado. Suite general: 59 PASS, 18 SKIP, 0 FAIL; lint 0 errores/11 advertencias; TypeScript y build aislada PASS.

El arnés corregido quedó en 5ed31b2; código de producto 86e0d37; documentación previa d43c8b0; rama feat/mysql-auth. Esta revisión ocurrió antes de publicar; producción seguía en /opt/geocontrol-hub-releases/responsive-nav-11475c2. No se modificaron proyectos reales ni bases Traccar.

## 190. Publicación de correcciones de UX de tareas y fases (24/10/2026)

Con la autorización previa del usuario se publicó la build aislada del commit de producto 86e0d37 en /opt/geocontrol-hub-releases/phase7-task-phase-ux-86e0d37. La fuente page.tsx del workspace de build coincidía con el código revisado; no se compiló en el release activo. Se conservó el release anterior responsive-nav-11475c2 y la configuración previa release.conf.pre-task-phase-ux-86e0d37. No hubo migraciones ni escrituras en datos de proyectos.

Respaldo previo: /opt/geocontrol/backups/hub/geocontrol-hub-20261024T210219Z.sql.gz (6.186.207 bytes); health check confirmó timer enabled/active y respaldo reciente legible. Después del cambio: servicio active/running, NRestarts=0, WorkingDirectory nueva release; /login local y público 200; seis assets CSS/JS de Next verificados en ambos destinos 200; /api/projects sin sesión 401. El primer verificador de assets tenía un regex incorrecto; se repitió con parser HTML y pasó. E2E aislado completo PASS, escritorio/móvil, esquema temporal limpio. Commits: producto 86e0d37, arnés 5ed31b2 y documentación previa c867298. No se accedió a bases Traccar.

Siguiente paso: validación del usuario en https://hub.geocontrol.online, sección Tareas: confirmar que Guardar cambios permanece deshabilitado sin cambios y vuelve a deshabilitarse al revertirlos. La respuesta de fases demorada se cubrió en E2E aislado. Release anterior disponible para reversión si se detecta una regresión.

## 191. Validación visual móvil del botón Guardar de tareas (24/10/2026)

Tras publicar phase7-task-phase-ux-86e0d37, el usuario compartió una captura móvil del editor de «Revisar resultados y preparar aprobación de lanzamiento». Los campos visibles conservan sus valores originales y «Guardar cambios» aparece deshabilitado; queda confirmada visualmente en producción la condición sin cambios. No se guardó ni modificó la tarea. La activación al editar y desactivación al revertir se verificaron en el E2E aislado de la revisión 189; la captura acredita el estado inicial sin cambios. Release activa: /opt/geocontrol-hub-releases/phase7-task-phase-ux-86e0d37. No se modificaron proyectos ni bases Traccar.
