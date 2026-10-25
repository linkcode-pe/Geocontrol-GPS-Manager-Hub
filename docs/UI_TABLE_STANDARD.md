# Estándar de tablas del Hub

## Uso predeterminado

Usar `HubTable` para presentar colecciones de registros del proyecto: proyectos, fases, tareas, actividad, documentos, expedientes, continuidad, elementos archivados e historiales. Mantener la misma estructura en todas las páginas y en los registros que se creen en el futuro.

## Presentación y comportamiento

- Usar una tabla HTML semántica con encabezados explícitos y filas alineadas.
- Nombrar la región desplazable con `label` accesible en `HubTable`.
- Definir las columnas en el encabezado; no insertar campos como tarjetas dentro de cada registro.
- Aplicar una clase de ancho mínimo según la densidad de columnas. El desplazamiento horizontal ocurre dentro de la tabla y mueve encabezados y todas las columnas juntas; no fijar columnas individuales.
- Mantener el texto de ayuda de desplazamiento en vistas estrechas, foco visible de teclado, colores de tema claro/oscuro y estados hover coherentes.
- Mantener datos extensos legibles con saltos de línea; fechas, estados, acciones y valores vacíos deben conservar una columna identificable.
- Insertar editores expandidos como filas de detalle con `colSpan`, preservando las acciones existentes.

## Aplicación

El estándar compartido está implementado por `src/app/hub-table.tsx` y `src/app/design-system.css`. Las tareas conservan el grid tabular propio con un único contenedor de desplazamiento para soportar la agrupación por vencimiento y el editor expandible; sus columnas también se desplazan juntas.

Se aplica a proyectos, fases, actividad, cartera, hoja de ruta, próximas tareas y tareas que requieren atención del dashboard, catálogo de documentos base, papelera, documentos e historiales, fichas técnicas e historial, memorias e historial, continuidad y su historial, además del resumen del expediente. Formularios, métricas y gráficos conservan su presentación especializada cuando no representan registros tabulares.
