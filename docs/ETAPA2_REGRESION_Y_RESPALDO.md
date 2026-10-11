## 35. Etapa 2 — respaldo actualizado y regresión aislada (11/10/2026)

**Respaldo actualizado:** `geocontrol-hub-20261011T220202Z.sql.gz` (20 507 bytes) generado por `scripts/backup-hub.py` en el mismo servidor. Se restauró en esquema temporal, se aplicaron las dos migraciones Stage 2 allí y se verificó que la memoria de respaldo estaba en **revisión 23** (vigente al momento de generar el respaldo) y que un documento existente conserva contenido y snapshot inicial. No se alteró la base productiva.

**Pruebas:** `npm test` en entorno aislado: 68 pruebas, 50 superadas, 18 omitidas porque requieren URL de servidor (0 fallos). E2E autenticado `e2e-stage2-documents-isolated.mjs` nuevamente **PASS** (documentos, archivo/desarchivo, restauración, historial, 409, memoria, tareas, auditoría); esquema temporal eliminado. Corrección menor de interfaz: impide guardar cambios sobre documento archivado y limpia historial cuando desaparece de la lista.

**Estado:** producción continúa en Etapa 1. **Falta:** prueba visual de navegador de `/documentos`, verificación de esquema de producción y preparación/publicación de migraciones y release aislada con plan de reversión. No ejecutar migraciones productivas sin autorización de despliegue.
