# Instrucciones para Codex — Geocontrol Project Hub

## Objetivo
Crear una aplicación privada para gestionar proyectos, fases, tareas, documentación, decisiones y auditoría de Geocontrol GPS Manager.

## Flujo obligatorio
ChatGPT planifica → Codex desarrolla y propone PR en GitHub → Desktop Commander despliega versiones aprobadas → producción.

## Arquitectura
- Next.js + TypeScript; MySQL exclusivo `geocontrol_hub`.
- Nunca consultar, modificar o migrar bases `traccar` ni `traccar_dev`.
- Integración futura con Traccar exclusivamente por API backend.
- No exponer secretos, tokens, contraseñas ni datos internos en frontend o Git.
- Autenticación, autorización por rol y registro de auditoría antes de desplegar en Internet.
- Mantener el estilo SaaS ejecutivo responsive, modo claro/oscuro y accesibilidad.

## Calidad
- Ejecutar `npm run lint` y `npm run build` antes de PR.
- Crear migraciones reversibles, sin cambios destructivos automáticos.
- Documentar claramente los cambios y riesgos.
- No presentar tareas simuladas como completadas.

## Estado inicial
La UI usa localStorage solo como prototipo. Sustituirlo por API autenticada y MySQL; no considerar este MVP apto para producción.
