-- Supabase Migration: Add research_status columns to reports table
-- Run this in the Supabase SQL Editor
-- This enables async research processing with callback-based status updates

-- Add research_status column to track the state of research
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS research_status TEXT DEFAULT 'pending';

-- Add research_error column to store error messages when research fails
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS research_error TEXT;

-- Add a check constraint to ensure valid status values
ALTER TABLE reports
DROP CONSTRAINT IF EXISTS reports_research_status_check;

ALTER TABLE reports
ADD CONSTRAINT reports_research_status_check
CHECK (research_status IN ('pending', 'processing', 'completed', 'error'));

-- Create index for faster status lookups (useful for dashboard queries)
CREATE INDEX IF NOT EXISTS reports_research_status_idx ON reports(research_status);

-- Update existing reports to have 'completed' status (since they already have data)
UPDATE reports
SET research_status = 'completed'
WHERE response_data IS NOT NULL
  AND research_status = 'pending';

-- Comment on columns for documentation
COMMENT ON COLUMN reports.research_status IS 'Status of research processing: pending, processing, completed, or error';
COMMENT ON COLUMN reports.research_error IS 'Error message if research processing failed';
