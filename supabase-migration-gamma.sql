-- Supabase Migration: Add Gamma presentation fields to reports table
-- Run this in the Supabase SQL Editor

-- Add Gamma URL fields
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS gamma_url TEXT,
ADD COLUMN IF NOT EXISTS gamma_embed_url TEXT,
ADD COLUMN IF NOT EXISTS gamma_download_url TEXT;

-- Add comments for documentation
COMMENT ON COLUMN reports.gamma_url IS 'URL to the Gamma presentation viewer';
COMMENT ON COLUMN reports.gamma_embed_url IS 'Embeddable iframe URL for the Gamma presentation';
COMMENT ON COLUMN reports.gamma_download_url IS 'URL to download the Gamma presentation as PDF/PPTX';
