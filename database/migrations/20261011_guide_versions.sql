-- Stage 2: immutable guide history, additive and idempotent.
-- Apply only to geocontrol_hub after a verified backup and deployment planning.
CREATE TABLE IF NOT EXISTS hub_project_guide_versions (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
 guide_id TINYINT UNSIGNED NOT NULL,
 revision INT UNSIGNED NOT NULL,
 content MEDIUMTEXT NOT NULL,
 updated_by BIGINT UNSIGNED NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY uq_guide_revision (guide_id,revision),
 KEY idx_guide_created (guide_id,created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- Baseline: retain the currently live revision, without overwriting existing snapshots.
INSERT IGNORE INTO hub_project_guide_versions(guide_id,revision,content,updated_by)
SELECT id,revision,content,updated_by FROM hub_project_guide WHERE id=1;
