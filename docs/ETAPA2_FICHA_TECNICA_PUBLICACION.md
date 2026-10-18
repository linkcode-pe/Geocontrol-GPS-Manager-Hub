## 49. Producción — fichas técnicas publicadas (18/10/2026)

**Autorización:** el usuario respondió «Te autorizo que continúes de forma autónoma» a la solicitud explícita de publicar las fichas técnicas en `hub.geocontrol.online` con migración, respaldo y reversión.

**Respaldo y migración:** generado y verificado `/opt/geocontrol/backups/hub/geocontrol-hub-20261018T174139Z.sql.gz` (161268 bytes); restauración aislada desde este respaldo PASS (3 proyectos, 0 documentos, memoria conservada, tablas y escritura de versión). En producción se aplicó únicamente `database/migrations/20261018_technical_sheets.sql` sobre `geocontrol_hub`; se comprobaron las tablas `hub_project_technical_sheets` y `hub_project_technical_sheet_versions`. Ninguna base de Traccar modificada.

**Release:** `/opt/geocontrol-hub-releases/stage2-3c5bef9`, compilado con `npm run build` fuera del release activo (Next 16.4, TypeScript PASS). Se guardó configuración systemd anterior en `/etc/systemd/system/geocontrol-hub.service.d/release.conf.pre-3c5bef9`; se actualizó `release.conf`, `daemon-reload`, `restart`. El servicio `geocontrol-hub` quedó `active` y apunta a `stage2-3c5bef9`. Release anterior `stage2-806899a` intacto.

**Verificación producción:** `https://hub.geocontrol.online/login` HTTP 200; `/fichas-tecnicas`, `/documentos`, `/guia-proyecto` redirigen a login sin sesión (307); API proyectos y fichas rechaza anónimos (401). Prueba autenticada de solo lectura con token temporal firmado localmente desde cuenta owner/admin activa, sin revelar ni registrar credenciales: rutas `/`, `/fichas-tecnicas`, `/documentos`, `/guia-proyecto`, `/api/projects`, `/api/projects/1/technical-sheet` todas HTTP 200, ficha inicial nula y `canEdit=true`. Script temporal eliminado. Se conservaron 3 proyectos y memoria revisión 37 previa a este registro. No se han creado fichas reales ni realizado escrituras de contenido de usuarios en la verificación.

**Reversión:** si falla el nuevo release, restaurar el drop-in `release.conf.pre-3c5bef9` a `release.conf`, ejecutar `systemctl daemon-reload && systemctl restart geocontrol-hub` y verificar servicio/login. **No borrar tablas nuevas** ni restaurar el respaldo completo automáticamente: cualquier reversión de esquema debe evaluar datos generados desde la publicación.

**Siguiente paso:** vigilar funcionamiento y logs, recopilar feedback real y planificar Etapa 3 (expediente de siete tarjetas). No se requiere volver a publicar esta funcionalidad.
