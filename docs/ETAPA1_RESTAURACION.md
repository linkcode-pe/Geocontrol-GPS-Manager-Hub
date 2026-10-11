## 20. Etapa 1 — restauración aislada verificada (11/10/2026)

**Resultado confirmado:** se restauró el respaldo local más reciente `geocontrol-hub-20261011T205249Z.sql.gz` en un esquema temporal con nombre aleatorio `hub_restore_check_...`. Se comprobaron las **8 tablas** y recuentos restaurados: **3 proyectos, 1 tarea, 1 guía principal**. El proceso terminó satisfactoriamente. La base `geocontrol_hub` de producción no fue destino de restauración.

**Mejora de seguridad:** el script antiguo reemplazaba globalmente `geocontrol_hub` en todo el dump, con riesgo de alterar contenidos textuales. Ahora `scripts/restore-dump-safety.py` valida el esquema temporal y las ocho tablas y reemplaza solo las directivas `CREATE DATABASE` y `USE`. `scripts/verify-restore-hub.py` restaura, valida tablas y recuentos y elimina únicamente el esquema temporal que creó tras completar la importación. Se añadió `tests/restore-safety.test.mjs`.

**Pruebas:** suite **67 pruebas: 49 correctas, 18 omitidas, 0 fallidas**. No se modificó ni desplegó código de la web pública.

**Limitaciones:** esta prueba acredita la recuperación del respaldo probado, no demuestra copias externas ni recuperación ante pérdida total del servidor. Aún faltan copia externa cifrada con retención, alertas, guardado autenticado E2E, verificación TypeScript y pruebas de fallos de transacciones.

**Próximo paso:** investigar almacenamiento externo de respaldos y ejecutar pruebas E2E autenticadas de guardado/lectura en entorno aislado.
