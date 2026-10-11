

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
