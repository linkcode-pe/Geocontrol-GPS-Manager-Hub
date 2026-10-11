# Geocontrol Project Hub

Centro de documentación y seguimiento de **Geocontrol GPS Manager**.

## Estado

MVP inicial en desarrollo. No desplegar públicamente hasta implementar autenticación y persistencia MySQL.

## Tecnologías

Next.js, TypeScript, Tailwind CSS. MySQL planificado para persistencia independiente.

## Módulos

- Dashboard ejecutivo
- Proyectos y fases
- Tareas (almacenamiento local provisional)
- Documentación base
- Actividad (provisional)

## Desarrollo

```bash
npm install
npm run dev
```

## Seguridad

No incluir credenciales, datos de Traccar, copias de seguridad ni secretos en Git. La instancia MySQL del Hub deberá usar base y usuario independientes. El dominio hub.geocontrol.online está reservado para su despliegue posterior.

## Objetivo del gestor de proyectos
El Hub evolucionará a un gestor multiproyecto: crear y administrar proyectos, fases propias de cada proyecto y tareas por fase, con estados, prioridades, fechas y seguimiento de avance. Mantener una interfaz ejecutiva responsive con tema claro/azul marino y estilos globales. Flujo de trabajo: ChatGPT → Desktop Commander remoto → GitHub → producción. Nunca modificar Traccar en producción.

### Implementación por etapas
1. Catálogo de proyectos: listado, creación y estadísticas (implementado).
2. Selección del proyecto activo y administración de sus fases.
3. Tareas vinculadas al proyecto seleccionado; estados, prioridades y fechas.
4. Edición, archivado seguro y panel de progreso por proyecto.
