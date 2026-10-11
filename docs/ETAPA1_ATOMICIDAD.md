## 16. Etapa 1 — atomicidad de creación y validación (11/10/2026)

**Estado:** avance en rama de desarrollo, NO desplegado. Se identificó que las API POST de proyectos y tareas insertaban primero la entidad y después la auditoría en operaciones separadas: si la segunda fallaba, podía persistir un dato aunque la API devolviera error.

**Cambio:** `src/app/api/projects/route.ts` y `src/app/api/tasks/route.ts` ahora usan una sola conexión MySQL y transacción `beginTransaction` / `commit`, con `rollback` ante error y liberación de conexión en `finally`. Se añadieron dos pruebas de contrato en `tests/atomic-creation.test.mjs`.

**Pruebas:** suite previa 58 pruebas: 40 correctas, 18 omitidas, 0 fallidas. Las dos nuevas pruebas pasaron individualmente. `git diff --check` sin problemas. Comprobación TypeScript completa **no superada por dependencias de desarrollo no disponibles**: `react-markdown`, `remark-gfm` y dos errores de tipado relacionados en `guide-editor.tsx`. No afirmar validación total ni corregir con compilaciones que puedan afectar el release público.

**Pendiente:** ejecutar suite completa con las dos nuevas pruebas; resolver dependencias aisladas y comprobar tipos; pruebas autenticadas reales de guardado y lectura; restauración aislada y copia externa de respaldo. Las API de actualización/eliminación y otras entidades requieren revisión de atomicidad. Ningún despliegue sin aprobación de Jim.

**Siguiente paso:** comprobar las dependencias en entorno aislado, ampliar transacciones a las demás escrituras de forma gradual, validar respaldo restaurable y sesión autenticada.
