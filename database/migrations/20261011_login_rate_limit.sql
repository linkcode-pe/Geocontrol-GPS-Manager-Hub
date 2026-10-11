-- Hub only. Store a salted hash of email and client IP, never raw credentials.
CREATE TABLE IF NOT EXISTS hub_login_attempts (
 attempt_key CHAR(64) PRIMARY KEY,
 failures INT UNSIGNED NOT NULL DEFAULT 0,
 window_started TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
