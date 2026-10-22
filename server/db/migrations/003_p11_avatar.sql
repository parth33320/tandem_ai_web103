-- Migration 003: Avatar customization columns
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS avatar_color VARCHAR(7) DEFAULT '#6c63ff';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS avatar_bg    VARCHAR(7) DEFAULT '#21253a';
