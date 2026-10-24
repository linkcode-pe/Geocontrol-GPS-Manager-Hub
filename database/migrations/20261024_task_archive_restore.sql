-- Add recoverable task archiving without rewriting or deleting existing tasks.
ALTER TABLE hub_tasks
  ADD COLUMN archived_at TIMESTAMP NULL DEFAULT NULL,
  ADD COLUMN archived_by BIGINT UNSIGNED NULL,
  ADD INDEX idx_hub_tasks_project_archived(project_id, archived_at, id),
  ADD CONSTRAINT fk_hub_tasks_archived_by FOREIGN KEY (archived_by) REFERENCES hub_users(id) ON DELETE SET NULL;
