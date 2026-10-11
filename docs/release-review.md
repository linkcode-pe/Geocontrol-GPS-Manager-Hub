# Revisión previa a publicación — Geocontrol Project Hub

Estado: **pendiente de aprobación y despliegue**. Rama: `feat/mysql-auth`; destino propuesto: `main`.

## Cambios a revisar

- Autenticación, autorización por roles, registro de actividad y persistencia en MySQL exclusivo del Hub.
- Gestión de proyectos, fases y tareas, incluidos estados, prioridades y fechas.
- Edición de tareas con prevención de guardados duplicados, avisos de errores y controles móviles.
- Pruebas automatizadas y validación de compilación.

## Verificaciones realizadas

- `HUB_SMOKE_URL=https://hub.geocontrol.online npm test`: **58/58** aprobadas.
- `npm run lint` y `npm run build`: correctos.
- La rama de desarrollo está sincronizada con GitHub por SSH.
- La instancia pública está activa; **estos cambios no se han desplegado**.

## Riesgos y condiciones obligatorias

1. **Separar el entorno de construcción del servicio público.** El servicio actual utiliza `/opt/geocontrol-project-hub`, el mismo directorio de trabajo donde se compila la rama de desarrollo. No ejecutar compilaciones futuras en ese directorio mientras se atiende tráfico público.
2. Confirmar permisos y acceso de todos los roles con pruebas autenticadas; no depender únicamente de las pruebas HTTP sin sesión.
3. Revisar las migraciones `database/migrations/20261011_task_planning.sql` y `20261011_login_rate_limit.sql` contra el esquema real del Hub. La primera agrega columnas y un índice: **no es idempotente** y no debe ejecutarse dos veces.
4. Comprobar un respaldo válido y su restauración en una base aislada antes de aplicar migraciones. No acceder ni modificar `traccar` ni `traccar_dev`.
5. Revisar variables de entorno, secretos, cabeceras, sesiones, autorización y registros sin publicar credenciales.
6. Preparar versión anterior y procedimiento de reversión. Un rollback de código no revierte automáticamente cambios en MySQL.
7. Aprobar explícitamente la publicación; fusionar la rama solo después de la revisión.

## Secuencia recomendada

1. Abrir una solicitud de revisión `feat/mysql-auth` → `main` en GitHub y comprobar sus verificaciones automáticas.
2. Preparar una copia o directorio de release separado del servicio activo; instalar dependencias y compilar allí.
3. Validar la aplicación con entorno aislado y revisar migraciones y respaldos.
4. Tras aprobación, planificar la ventana de despliegue y cambio de versión con reversión preparada.
5. Verificar autenticación, tareas, registros y disponibilidad pública después del despliegue.

No realizar fusión, migración ni reinicio automático desde este documento.
