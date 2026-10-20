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

