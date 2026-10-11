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
