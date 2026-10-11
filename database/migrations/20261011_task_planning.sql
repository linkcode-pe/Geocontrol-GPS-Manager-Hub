-- Hub only: priority and optional due date for task planning.
ALTER TABLE hub_tasks ADD COLUMN priority ENUM('low','normal','high','urgent') NOT NULL DEFAULT 'normal', ADD COLUMN due_date DATE NULL;
CREATE INDEX idx_hub_tasks_due_date ON hub_tasks(due_date);
