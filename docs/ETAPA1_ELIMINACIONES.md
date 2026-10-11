## 19. Etapa 1 — eliminación atómica de fases y tareas (11/10/2026)

**Estado:** desarrollado y probado por contratos, NO desplegado. `DELETE /api/tasks/:id` y `DELETE /api/phases/:id` ahora bloquean el registro con `SELECT ... FOR UPDATE` dentro de una transacción MySQL, eliminan y registran la auditoría antes del commit, con rollback y liberación de conexión ante error. En fases se conserva el rechazo 409 si hay tareas asociadas; se realiza la comprobación dentro de la transacción.

**Validación:** dos nuevas pruebas de contrato en `tests/atomic-delete.test.mjs`; suite total **66 pruebas: 48 correctas, 18 omitidas, 0 fallidas**. Estas pruebas no sustituyen integración con base aislada ni verificación de recuperación.

**Importante:** la eliminación sigue siendo física en estas API. El archivado reversible, historial de versiones y recuperación funcional corresponden a la Etapa 2; no se deben presentar como implementados.

**Pendiente para cerrar Etapa 1:** restauración real en base temporal aislada y comparación de datos; respaldo cifrado fuera del servidor; pruebas autenticadas de guardado/lectura; verificación TypeScript en entorno aislado; revisar alertas y fallos transaccionales. Ningún cambio en producción sin aprobación.
