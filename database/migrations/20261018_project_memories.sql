-- Stage 3 project-specific memory; never replaces the global Hub guide.
-- Apply only to geocontrol_hub after approved deployment and verified backup.
CREATE TABLE hub_project_memories (
 project_id BIGINT UNSIGNED NOT NULL PRIMARY KEY,
 content LONGTEXT NOT NULL,
 revision INT UNSIGNED NOT NULL DEFAULT 1,
 updated_by BIGINT UNSIGNED NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 CONSTRAINT fk_memory_project FOREIGN KEY (project_id) REFERENCES hub_projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE hub_project_memory_versions (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
 project_id BIGINT UNSIGNED NOT NULL,
 revision INT UNSIGNED NOT NULL,
 content LONGTEXT NOT NULL,
 updated_by BIGINT UNSIGNED NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY uq_memory_revision (project_id,revision),
 KEY idx_memory_created (project_id,created_at),
 CONSTRAINT fk_memory_version_project FOREIGN KEY (project_id) REFERENCES hub_projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
