-- Etapa 4: bitácora por proyecto, aditiva y sin cambios sobre tablas existentes.
-- Aplicar exclusivamente a geocontrol_hub tras respaldo y aprobación de despliegue.
CREATE TABLE hub_project_continuity (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 kind ENUM('decision','milestone','next_action') NOT NULL,
 title VARCHAR(255) NOT NULL,
 details TEXT NOT NULL,
 status ENUM('open','done') NOT NULL DEFAULT 'open',
 due_date DATE NULL,
 revision INT UNSIGNED NOT NULL DEFAULT 1,
 created_by BIGINT UNSIGNED NULL,
 updated_by BIGINT UNSIGNED NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 KEY idx_continuity_project (project_id,kind,status,id),
 CONSTRAINT fk_continuity_project FOREIGN KEY(project_id) REFERENCES hub_projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE hub_project_continuity_versions (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
 entry_id BIGINT UNSIGNED NOT NULL,
 revision INT UNSIGNED NOT NULL,
 title VARCHAR(255) NOT NULL,
 details TEXT NOT NULL,
 status ENUM('open','done') NOT NULL,
 due_date DATE NULL,
 updated_by BIGINT UNSIGNED NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY uq_continuity_revision (entry_id,revision),
 CONSTRAINT fk_continuity_version_entry FOREIGN KEY(entry_id) REFERENCES hub_project_continuity(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
