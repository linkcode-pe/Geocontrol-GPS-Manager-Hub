## 39. Etapa 2 — comprobación integral de migraciones y limpieza segura (16/10/2026)

Se reforzó `scripts/verify-stage2-migrations-isolated.py`: después de restaurar la última copia del Hub en un esquema `hub_restore_check_<12hex>`, inserta un documento heredado de prueba **solo en el esquema temporal**, aplica las dos migraciones y compara **todos** los documentos anteriores con su snapshot inicial, incluidos título, cuerpo, fecha de archivo y cantidad total. Verifica también la revisión inicial de la memoria. El bloque `finally` limpia el esquema temporal aun cuando la importación falle después de crearlo; nombre aleatorio estrictamente validado.

**Resultado real:** `PASS: backup restored, 1 legacy documents preserved and versioned, guide baseline revision 26`; `Disposable schema cleaned`. La memoria de producción estaba en revisión 27 al iniciar, por lo que el respaldo disponible era anterior por una revisión; se requiere respaldo nuevo justo antes de desplegar. `npm test` aislado: 68 pruebas, 50 superadas, 18 omitidas (requieren servidor HTTP), 0 fallos. No se modificó el release productivo.

**Siguiente:** verificar preparación de release y publicación solo tras aprobación explícita, respaldo reciente y smoke tests. No aplicar migraciones reales de forma anticipada.
