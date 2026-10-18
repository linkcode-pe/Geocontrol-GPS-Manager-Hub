## 56. Etapa 3 — navegación por proyecto y memoria en expediente (18/10/2026)

Se añadió `src/lib/project-selection.ts` para validar `?projectId=<entero positivo>` y elegir el proyecto solicitado solo si figura en el listado autorizado de la API. Las pantallas `/expedientes`, `/documentos`, `/fichas-tecnicas` y `/memorias` respetan ese parámetro al cargar, con selección predeterminada cuando no existe o no corresponde a un proyecto visible. Los enlaces del expediente llevan a cada editor conservando `projectId`; las pantallas de ficha, documentos y memoria permiten volver al expediente correspondiente.

La tarjeta 6 del expediente consulta la API de memoria independiente y muestra su revisión y extracto, o estado sin memoria, sin mezclarla con la guía global. Al cambiar de proyecto se limpia también la memoria anterior y se cancela la aplicación de resultados de peticiones obsoletas.

**Verificado:** `npm run build` en el entorno aislado `/opt/geocontrol-hub-build-stage2-806899a` PASS, TypeScript PASS, 23 rutas estáticas y dinámicas. `git diff --check` PASS. **Pendiente:** E2E de navegación profunda con `projectId`, completar continuidad/decisiones y verificar despliegue solo tras aprobación específica. Producción intacta.
