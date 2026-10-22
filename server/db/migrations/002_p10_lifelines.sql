-- server/db/migrations/002_p10_lifelines.sql

ALTER TABLE words ADD COLUMN IF NOT EXISTS fun_fact TEXT;
ALTER TABLE words ADD COLUMN IF NOT EXISTS jp_meaning_note TEXT;
ALTER TABLE words ADD COLUMN IF NOT EXISTS zh_meaning_note TEXT;
