-- Add capacity field to delivery_agents table
ALTER TABLE delivery_agents ADD COLUMN IF NOT EXISTS capacity integer NOT NULL DEFAULT 1 CHECK (capacity >= 1 AND capacity <= 5);

-- Update existing agents to have capacity 3
UPDATE delivery_agents SET capacity = 3 WHERE capacity IS NULL;