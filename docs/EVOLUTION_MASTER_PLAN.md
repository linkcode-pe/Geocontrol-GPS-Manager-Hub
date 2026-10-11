## 14. Plan maestro de evolución multiproyecto — versión 1.0 (11/10/2026)

**Estado:** PLAN APROBADO PARA DOCUMENTACIÓN; implementación NO iniciada. Este apartado define objetivos futuros, no funciones existentes. Documento externo de continuidad: `Geocontrol_Project_Hub_Plan_de_Evolucion.pdf` (conservar copia descargada fuera del servidor).

### Visión y principios
Geocontrol Project Hub es el centro de gestión de múltiples proyectos presentes y futuros de Jim, con asistencia de ChatGPT y, cuando corresponda, Codex. Traccar Manager puede ser uno de esos proyectos, pero no es el propósito principal del Hub. Cada proyecto debe conservar su información, contexto y trazabilidad independientemente.

**Prioridad absoluta: no perder datos.** Guardar no basta: implementar respaldos automáticos verificables, copias fuera del servidor, restauraciones de prueba, historial de versiones, eliminación reversible y confirmación fiable de escritura. Ninguna modificación destructiva sin respaldo y análisis de consecuencias.

### Expediente individual por proyecto: siete tarjetas
1. **Memoria:** propósito, alcance, contexto, situación actual, problemas y próximo paso.
2. **Historial:** actividad cronológica, autor, cambios y versiones recuperables.
3. **Tareas:** fases, estados, prioridades, vencimientos y evidencias.
4. **Decisiones:** decisión, motivos, alternativas descartadas, consecuencias y fecha.
5. **Documentos:** notas, archivos, enlaces, metadatos y versiones persistentes.
6. **Hitos:** entregables, fechas, validaciones, aprobaciones y resultados.
7. **Ficha técnica:** lenguajes (Java, JavaScript, TypeScript, etc.), frameworks, versiones, herramientas (ChatGPT, Codex), repositorios y ramas, rutas de código, bases de datos (MySQL u otras), migraciones, dominios, servidores, servicios, entornos, dependencias, pruebas, despliegues y reversión.

La ficha técnica debe admitir varios repositorios, servidores y bases cuando un proyecto lo requiera; será editable y versionada. **No almacenar secretos**: solo referencias seguras a su gestión. La memoria global del Hub permanece separada de las memorias individuales de proyectos.

### Etapas obligatorias, en orden
**Etapa 1 — Integridad y seguridad de datos.** Reproducir y resolver el problema de guardado desde una sesión autenticada; confirmar persistencia y lectura. Auditar respaldos existentes; automatizar respaldos MySQL con retención y copia externa; ensayar restauración aislada; documentar recuperación, errores y alertas. **Criterio de salida:** guardado real verificado, respaldo restaurable y procedimiento escrito.

**Etapa 2 — Trazabilidad y recuperación.** Historial de versiones de memorias/documentos/fichas, auditoría útil y archivado reversible; impedir sobrescrituras concurrentes. **Criterio:** poder consultar y recuperar una versión anterior sin perder la actual.

**Etapa 3 — Expedientes multiproyecto.** Implementar siete tarjetas por proyecto, documentos persistentes, ficha técnica y memoria independiente; relaciones correctas con proyecto y permisos. **Criterio:** dos proyectos pueden conservar contextos diferentes sin mezclar datos.

**Etapa 4 — Continuidad con ChatGPT.** Bitácora, decisiones, hitos, estado comprobado, siguiente acción y botón «Copiar contexto completo para ChatGPT» por proyecto. **Criterio:** un nuevo chat puede retomar un proyecto con su información sin depender de recuerdos informales.

**Etapa 5 — Organización y búsqueda.** Buscador global con filtros por proyecto/fecha/tipo, etiquetas y relaciones; navegación y consultas eficientes. **Criterio:** localizar datos históricos sin recorrer manualmente cada sección.

**Etapa 6 — Optimización.** Informes, métricas, recordatorios y automatizaciones según necesidades reales; evitar complejidad prematura. **Criterio:** mejoras comprobables sin degradar estabilidad ni recuperación.

### Procedimiento de trabajo y continuidad
- Antes de cada etapa: consultar `geocontrol_hub.hub_project_guide` (fuente principal), comparar con `docs/PROJECT_CONTEXT.md` (respaldo), comprobar GitHub, servidor, datos y pendientes.
- Ejecutar cambios graduales y pruebas aisladas; documentar evidencia y criterios de aceptación. Guardar commits en GitHub sin confundirlos con despliegues.
- **Producción requiere aprobación previa de Jim** para cualquier publicación o cambio que pueda afectarla. No compilar en el directorio del release activo.
- Después de cada avance: actualizar primero memoria MySQL, luego sincronizar GitHub sin pisar revisiones nuevas. Registrar fecha, pruebas, commit, despliegue sí/no, incidencias y siguiente paso.
- Si se pierde el chat o conexión: adjuntar el PDF maestro, indicar «Continúa el plan maestro de Geocontrol Project Hub», revisar la memoria viva y verificar el estado real antes de actuar.

### Punto exacto de reanudación
**Próxima tarea de desarrollo: Etapa 1**, comenzando por diagnóstico de guardado autenticado y revisión de respaldos y restauración. **Ninguna etapa de evolución se considera implementada por haber escrito este plan.** La aplicación pública no debe modificarse sin aprobación.
