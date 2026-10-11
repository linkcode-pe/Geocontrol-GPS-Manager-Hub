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
