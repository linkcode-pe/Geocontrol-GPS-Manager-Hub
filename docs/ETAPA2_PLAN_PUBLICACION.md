# Etapa 2 — procedimiento de publicación pendiente de aprobación

Estado: **NO EJECUTADO**. Producción sigue en `/opt/geocontrol-hub-releases/stage1-6398c74`.

## Prerrequisitos
1. Confirmar aprobación explícita para publicación en producción; comprobar `git status` limpio y commit exacto.
2. Comprobar servicio activo, release vigente, memoria MySQL actual y tablas reales. Nunca modificar otras bases.
3. Crear respaldo **nuevo** de `geocontrol_hub` en el servidor, comprobar gzip y restaurar a esquema temporal; validar que revisión y documentos coinciden con producción. Registrar ruta y hora.
4. Compilar el commit aprobado en **directorio aislado nuevo** (nunca en release activo). Ejecutar lint, TypeScript, pruebas y E2E con esquema temporal.
5. Crear release independiente con artefactos verificados y variables de entorno del servicio, sin sustituir la release anterior.

## Ventana de cambio
1. Prevenir escrituras concurrentes de la aplicación durante el cambio, con mecanismo de mantenimiento autorizado y duración breve. Mantener respaldo íntegro.
2. Aplicar **solo** en `geocontrol_hub` y en este orden:
   - `database/migrations/20261011_guide_versions.sql` (aditiva/idempotente).
   - `database/migrations/20261011_document_versions.sql` (**NO idempotente**, ejecutar una sola vez, verificar columnas y tabla antes).
3. Validar baseline de la memoria y documentos existentes: revisiones, títulos, contenido, cantidades; no sobrescribir revisiones actuales.
4. Cambiar el `WorkingDirectory` de systemd mediante override hacia release nueva y reiniciar solo `geocontrol-hub`.
5. Probar login, lectura, creación/edición/historial/restauración de un documento de prueba **autorizado**, `/guia-proyecto`, `/documentos`, salud del servicio y Nginx; verificar logs.

## Reversión
- Si falla el release, apuntar systemd a `stage1-6398c74` y reiniciar el servicio; comprobar funcionamiento. **No borrar las columnas/tablas nuevas** durante rollback de aplicación: la migración es aditiva y la release antigua puede ignorarlas.
- Si se requiere restaurar datos desde respaldo, detener y evaluar: la restauración completa podría borrar escrituras posteriores. **Nunca restaurar ni reemplazar datos automáticamente**.
- Conservar release anterior y respaldo local; documentar incidente y pasos.
- Finalizar solo con verificación funcional y memoria principal MySQL actualizada; sincronizar GitHub sin reemplazar contenido más reciente.

**Riesgo identificado:** no existe reversión SQL automática para `20261011_document_versions.sql`; es una migración de esquema de una sola ejecución. La reversión de aplicación no equivale a revertir esquema ni datos.
