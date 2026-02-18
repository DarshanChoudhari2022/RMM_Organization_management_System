-- Migration script for Shiv Garjana Chronicles
-- Adds year-based management and expense tracking enhancements

-- 1. Update tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS year INTEGER;
UPDATE tasks SET year = EXTRACT(YEAR FROM date::DATE) WHERE year IS NULL;
ALTER TABLE tasks ALTER COLUMN year SET NOT NULL;

-- 2. Update expenses table
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS year INTEGER;
UPDATE expenses SET year = EXTRACT(YEAR FROM date::DATE) WHERE year IS NULL;
ALTER TABLE expenses ALTER COLUMN year SET NOT NULL;

ALTER TABLE expenses ADD COLUMN IF NOT EXISTS paid_by TEXT DEFAULT 'Mandal';
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS is_refunded BOOLEAN DEFAULT FALSE;

-- 3. Update invitations table (Optional but recommended for consistency)
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS year INTEGER;
UPDATE invitations SET year = EXTRACT(YEAR FROM date::DATE) WHERE year IS NULL;
-- Keep nullable for now as we didn't update the UI for invitations yet

-- 4. Suppliers Table (if not exists)
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Sound' | 'Decoration' | 'Stage' | 'Banner' | 'Other'
    contact TEXT NOT NULL,
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for suppliers
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access for suppliers" ON suppliers FOR SELECT USING (true);
CREATE POLICY "Allow authenticated full access for suppliers" ON suppliers 
    FOR ALL USING (auth.role() = 'authenticated');
