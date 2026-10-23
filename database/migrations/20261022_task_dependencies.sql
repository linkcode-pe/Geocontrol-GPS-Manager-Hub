-- Phase 5: optional single predecessor per task. Apply to geocontrol_hub only after approval.
ALTER TABLE hub_tasks
  ADD COLUMN depends_on_task_id BIGINT UNSIGNED NULL DEFAULT NULL,
  ADD KEY idx_hub_tasks_depends_on (depends_on_task_id),
  ADD CONSTRAINT fk_hub_tasks_depends_on FOREIGN KEY (depends_on_task_id)
    REFERENCES hub_tasks(id) ON DELETE SET NULL;
