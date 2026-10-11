-- Stage 2: additive document versioning and reversible archive.
-- Only geocontrol_hub. Apply after backup; do not touch other databases.
ALTER TABLE hub_documents
 ADD COLUMN revision INT UNSIGNED NOT NULL DEFAULT 1,
 ADD COLUMN archived_at TIMESTAMP NULL DEFAULT NULL,
 ADD COLUMN archived_by BIGINT UNSIGNED NULL;
CREATE TABLE hub_document_versions (
 id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
 document_id BIGINT UNSIGNED NOT NULL,
 revision INT UNSIGNED NOT NULL,
 title VARCHAR(255) NOT NULL,
 body LONGTEXT NOT NULL,
 archived_at TIMESTAMP NULL DEFAULT NULL,
 updated_by BIGINT UNSIGNED NULL,
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 UNIQUE KEY uq_document_revision (document_id,revision),
 KEY idx_document_created (document_id,created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO hub_document_versions(document_id,revision,title,body,archived_at)
 SELECT id,revision,title,body,archived_at FROM hub_documents;
