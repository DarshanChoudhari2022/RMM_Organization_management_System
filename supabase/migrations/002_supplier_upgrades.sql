-- Upgrade suppliers table with payment and agreement tracking
ALTER TABLE suppliers 
ADD COLUMN IF NOT EXISTS total_amount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS paid_amount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS terms TEXT,
ADD COLUMN IF NOT EXISTS is_confirmed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS supplier_comment TEXT;

-- Add a comment to columns for clarity
COMMENT ON COLUMN suppliers.total_amount IS 'The total amount discussed/agreed with the supplier';
COMMENT ON COLUMN suppliers.paid_amount IS 'The amount already paid to the supplier';
COMMENT ON COLUMN suppliers.terms IS 'Terms and conditions agreed with the supplier';
COMMENT ON COLUMN suppliers.is_confirmed IS 'Whether the supplier has confirmed the agreement/payment';
COMMENT ON COLUMN suppliers.supplier_comment IS 'Any feedback or message from the supplier during confirmation';
