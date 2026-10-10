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
