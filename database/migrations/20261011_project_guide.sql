-- Hub only: editable project context, independent of deploy artifacts.
CREATE TABLE IF NOT EXISTS hub_project_guide (
 id TINYINT UNSIGNED PRIMARY KEY,
 content MEDIUMTEXT NOT NULL,
 revision INT UNSIGNED NOT NULL DEFAULT 1,
 updated_by INT NULL,
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
