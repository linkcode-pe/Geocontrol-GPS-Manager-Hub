# Geocontrol Project Hub — memoria y guía permanente

**Última actualización:** 11 de octubre de 2026 (revisión integral multiproyecto y ficha técnica)
**Estado:** desarrollo activo; la web `https://hub.geocontrol.online` está en servicio, pero no debe confundirse con la rama aprobada para publicación.  
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

**Incidencia histórica:** el servicio público utilizaba el mismo directorio en que se ejecutaban compilaciones de desarrollo; esto causó un error de carga por archivos estáticos faltantes. El 11/10/2026 se cambió el servicio a `/opt/geocontrol-hub-releases/807-guide`, un directorio de release independiente. Se verificaron login y archivos CSS/JS. Mantener siempre compilaciones fuera del directorio activo y verificar reversión.

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
**Prioridad 2:** mantener los despliegues en releases separados, verificar reversión y automatizar el procedimiento.  
**Prioridad 3:** completar revisión de seguridad, respaldo/restauración y propuesta de fusión a `main`.  
**Prioridad 4:** enriquecer documentación persistente, historial, decisiones, métricas y seguimiento multiproyecto.  
**Futuro:** integración backend autorizada con Traccar, sin modificar sus bases directamente.

## 9. Guía editable publicada

- En la web, abrir el menú lateral y pulsar **Memoria del proyecto · Ver y editar**, encima de «Entorno de planificación».
- Ruta web: `/guia-proyecto`, protegida por inicio de sesión.
- Los usuarios `owner` y `admin` pueden editar y guardar; los demás solo leer.
- Las ediciones se almacenan en la tabla MySQL `hub_project_guide` con control de versiones concurrentes y registro de auditoría. **La copia en MySQL es la versión viva de la web**; el archivo `docs/PROJECT_CONTEXT.md` de GitHub es la base inicial y debe sincronizarse deliberadamente al actualizar hitos importantes, sin sobrescribir las ediciones del usuario.
- La guía editable se publicó el 11/10/2026 mediante commit `35594dc`. Se realizó respaldo SQL antes de crear su tabla y se comprobó la carga de archivos públicos.

## 10. Estado GitHub y documentación

- Publicación confirmada: `35594dc` (`Add editable persistent project guide in Hub`).
- La rama `feat/mysql-auth` estaba sincronizada con GitHub.
- Guía de revisión previa: `docs/release-review.md`.
- Verificar siempre `git status -sb`, historial, pruebas y estado real del servicio al retomar.
- **Actualizar esta memoria en cada hito significativo**: cambios hechos, pruebas realizadas, commit, si se publicó o no, incidencias y siguiente paso.

## 11. Instrucción para el siguiente chat

> Estamos trabajando en **Geocontrol Project Hub** (`hub.geocontrol.online`), no en Traccar Manager. Consulta primero la guía editable en `/guia-proyecto` (MySQL, fuente viva) cuando sea accesible y lee también `docs/PROJECT_CONTEXT.md` del repositorio `linkcode-pe/Geocontrol-GPS-Manager-Hub`, revisa el estado real por Desktop Commander remoto y GitHub, y continúa con las prioridades e incidencias abiertas. No supongas que los cambios en GitHub ya están publicados. No modifiques producción sin autorización. Mantén esta guía actualizada después de cada hito.

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
