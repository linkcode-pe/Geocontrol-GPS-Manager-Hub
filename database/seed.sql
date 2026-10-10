INSERT INTO hub_projects(slug,title,summary,status) VALUES('geocontrol-gps-manager','Geocontrol GPS Manager','Plataforma administrativa independiente para Traccar GPS','planning') ON DUPLICATE KEY UPDATE slug=VALUES(slug);
INSERT INTO hub_phases(project_id,title,description,position,status)
SELECT p.id,x.title,x.description,x.position,'pending' FROM hub_projects p JOIN (
SELECT 'Análisis y requisitos' title,'Alcance y auditoría segura' description,1 position UNION ALL
SELECT 'Arquitectura','Modelo de datos y permisos',2 UNION ALL
SELECT 'Desarrollo','Administración y usuarios',3 UNION ALL
SELECT 'Integración Traccar','API y pruebas',4 UNION ALL
SELECT 'Pruebas y producción','Seguridad y despliegue',5
) x WHERE p.slug='geocontrol-gps-manager' AND NOT EXISTS (SELECT 1 FROM hub_phases h WHERE h.project_id=p.id);
