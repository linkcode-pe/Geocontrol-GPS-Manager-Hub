# Recuperación del Hub desde consola — guía segura

**Alcance:** solo Geocontrol Project Hub, base MySQL `geocontrol_hub`. No tocar las bases de Traccar. La copia es local al mismo servidor y no protege de la pérdida física del servidor o disco.

## 1. Conectar y comprobar (solo lectura)

Accede a la consola del servidor `geocontrol.online` desde tu PC con tu cuenta autorizada. Una vez conectado:

```bash
systemctl status geocontrol-hub --no-pager
systemctl status geocontrol-hub-backup.timer --no-pager
ls -lh /opt/geocontrol/backups/hub/
journalctl -u geocontrol-hub-backup.service --no-pager -n 25
```

Los respaldos se llaman `geocontrol-hub-AAAAMMDDTHHMMSSZ.sql.gz`. El servicio diario está configurado a las **04:00 UTC**. El directorio tiene permisos restringidos y puede requerir una sesión administrativa.

## 2. Comprobar el respaldo antes de utilizarlo

```bash
gzip -t /opt/geocontrol/backups/hub/geocontrol-hub-AAAAMMDDTHHMMSSZ.sql.gz
```

Sustituye el nombre de ejemplo por el archivo real elegido. Para verificar que se puede restaurar, sin sobrescribir la base de producción, el repositorio dispone de:

```bash
cd /opt/geocontrol-project-hub
python3 scripts/verify-restore-hub.py
```

**Advertencia:** este comando crea y elimina una base **temporal** `hub_restore_check_...` en el mismo servidor MySQL. No debe ejecutarse simultáneamente con otros procesos de recuperación. Selecciona automáticamente el respaldo más reciente, no uno arbitrario. Si falla la importación antes de completarse, puede quedar un esquema temporal para revisión manual.

## 3. Si el servicio está caído

Primero revisa el estado y los errores, sin borrar ni reemplazar datos:

```bash
systemctl status geocontrol-hub --no-pager
journalctl -u geocontrol-hub --no-pager -n 80
```

**No importar un respaldo sobre `geocontrol_hub` directamente.** Una restauración de producción puede sustituir información más reciente. Antes de realizarla hay que identificar la causa, preservar la base actual, comprobar fechas y solicitar autorización expresa. Tampoco copiar una versión antigua de `docs/PROJECT_CONTEXT.md` encima de la memoria MySQL.

## 4. Contacto y continuidad

Tras recuperar la conexión, comunicar: fecha del último respaldo, resultado de `gzip -t`, estado de `geocontrol-hub` y cualquier error del diario. El trabajo en GitHub puede ser distinto del código desplegado; no publicar automáticamente.

**Comprobación real previa:** restauración aislada de 8 tablas realizada satisfactoriamente el 11/10/2026. Esta guía no implica que se haya restaurado producción.
