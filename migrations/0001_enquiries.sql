CREATE TABLE IF NOT EXISTS enquiries (
 id TEXT PRIMARY KEY,
 payload TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT (datetime('now')),
 rate_key TEXT,
 consent_version TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS enquiries_rate_created ON enquiries(rate_key,created_at);
CREATE INDEX IF NOT EXISTS enquiries_created ON enquiries(created_at);
