-- Stage 2: one technical sheet per project, versioned, never store credentials.
-- Apply ONLY to geocontrol_hub after a verified backup; not yet deployed.
CREATE TABLE hub_project_technical_sheets (
 project_id BIGINT UNSIGNED NOT NULL PRIMARY KEY,
 content LONGTEXT NOT NULL,
 revision INT UNSIGNED NOT NULL DEFAULT 1,
 updated_by BIGINT UNSIGNED NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 CONSTRAINT fk_technical_project FOREIGN KEY (project_id) REFERENCES hub_projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE hub_project_technical_sheet_versions (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 revision INT UNSIGNED NOT NULL,
 content LONGTEXT NOT NULL,
 updated_by BIGINT UNSIGNED NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY uq_technical_revision (project_id,revision),
 KEY idx_technical_created (project_id,created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
