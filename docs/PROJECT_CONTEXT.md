# Geocontrol Project Hub — memoria y guía permanente

**Última actualización:** 11 de octubre de 2026 (publicación de guía editable)  
**Estado:** desarrollo activo; la web `https://hub.geocontrol.online` está en servicio, pero no debe confundirse con la rama aprobada para publicación.  
**Repositorio:** `linkcode-pe/Geocontrol-GPS-Manager-Hub`  
**Rama de trabajo:** `feat/mysql-auth`  
**Rama principal:** `main`

## 1. ¿Para qué sirve?

Geocontrol Project Hub es una aplicación privada para organizar el desarrollo de Geocontrol GPS Manager. Centraliza proyectos, fases, tareas, prioridades, fechas, documentos, decisiones y actividad. **No es Traccar ni el panel de rastreo GPS.** La integración futura con Traccar será exclusivamente por una API backend autorizada.

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
