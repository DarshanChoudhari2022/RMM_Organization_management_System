-- =====================================================
-- Rahul Mitra Mandal - DATABASE SCHEMA
-- =====================================================
-- Run this in your Supabase SQL Editor to create all tables
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. MEMBERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Personal Details
    full_name VARCHAR(255) NOT NULL,
    full_name_marathi VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) NOT NULL,
    whatsapp_number VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    photo_url TEXT,
    
    -- Membership Details
    member_id VARCHAR(50) UNIQUE NOT NULL,
    join_date DATE DEFAULT CURRENT_DATE,
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('super_admin', 'event_manager', 'finance_manager', 'media_manager', 'committee_member', 'member', 'volunteer')),
    is_active BOOLEAN DEFAULT true,
    
    -- Skills & Participation
    skills TEXT[],
    total_vargani_paid DECIMAL(10,2) DEFAULT 0,
    events_attended INTEGER DEFAULT 0,
    tasks_completed INTEGER DEFAULT 0,
    
    -- Emergency Contact
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    
    -- Auth user reference (if using Supabase Auth)
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- =====================================================
-- 2. EVENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Event Details
    title_english VARCHAR(255) NOT NULL,
    title_marathi VARCHAR(255) NOT NULL,
    description TEXT,
    description_marathi TEXT,
    event_type VARCHAR(50) DEFAULT 'other' CHECK (event_type IN ('ambedkar_jayanti', 'meeting', 'social_work', 'fort_trek', 'cultural_program', 'other')),
    
    -- Date & Time
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    
    -- Location
    location VARCHAR(255) NOT NULL,
    location_marathi VARCHAR(255),
    venue_address TEXT,
    
    -- Attendance
    expected_attendance INTEGER,
    actual_attendance INTEGER,
    
    -- Budget
    budget_allocated DECIMAL(10,2) DEFAULT 0,
    budget_spent DECIMAL(10,2) DEFAULT 0,
    year INTEGER NOT NULL,
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'ongoing', 'completed', 'cancelled')),
    
    -- Media
    cover_image_url TEXT,
    gallery_images TEXT[],
    video_urls TEXT[],
    
    -- Additional Info
    agenda JSONB,
    highlights TEXT[],
    
    -- Audit
    created_by UUID REFERENCES members(id) ON DELETE SET NULL
);

-- =====================================================
-- 3. TASKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Task Details
    title VARCHAR(255) NOT NULL,
    title_marathi VARCHAR(255),
    description TEXT,
    task_type VARCHAR(50) DEFAULT 'other' CHECK (task_type IN ('flag_hoisting', 'sound_dj', 'stage_setup', 'decoration', 'murti_installation', 'guest_coordination', 'food_prasad', 'printing', 'transportation', 'other')),
    
    -- Event Link
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    
    -- Schedule
    scheduled_date DATE NOT NULL,
    scheduled_time TIME,
    location VARCHAR(255),
    
    -- Requirements & Budget
    requirements TEXT[],
    budget_allocated DECIMAL(10,2) DEFAULT 0,
    budget_spent DECIMAL(10,2) DEFAULT 0,
    
    -- Vendor
    vendor_name VARCHAR(255),
    vendor_contact VARCHAR(50),
    
    -- Status
    status VARCHAR(50) DEFAULT 'planning' CHECK (status IN ('planning', 'approval_pending', 'approved', 'in_progress', 'completed', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Checklist & Notes
    checklist JSONB,
    notes TEXT,
    
    -- Audit
    created_by UUID REFERENCES members(id) ON DELETE SET NULL
);

-- =====================================================
-- 4. TASK ASSIGNMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS task_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    role VARCHAR(100),
    
    UNIQUE(task_id, member_id)
);

-- =====================================================
-- 5. VARGANI SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS vargani_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year INTEGER UNIQUE NOT NULL,
    total_budget DECIMAL(10,2) NOT NULL,
    per_head_amount DECIMAL(10,2) NOT NULL,
    active_members_count INTEGER NOT NULL,
    collection_start_date DATE,
    collection_end_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. VARGANI PAYMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS vargani_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    amount_due DECIMAL(10,2) NOT NULL,
    amount_paid DECIMAL(10,2) DEFAULT 0,
    payment_date DATE,
    payment_mode VARCHAR(50) CHECK (payment_mode IN ('cash', 'upi', 'bank_transfer', 'cheque', 'other')),
    transaction_id VARCHAR(255),
    receipt_url TEXT,
    status VARCHAR(20) DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partial', 'paid')),
    notes TEXT,
    collected_by UUID REFERENCES members(id) ON DELETE SET NULL,
    
    UNIQUE(member_id, year)
);

-- =====================================================
-- 7. EXPENSES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    category VARCHAR(50) NOT NULL CHECK (category IN ('flag_hoisting', 'sound_dj', 'stage_construction', 'decoration', 'murti', 'food_prasad', 'printing', 'guest_honorarium', 'transportation', 'miscellaneous')),
    subcategory VARCHAR(255),
    vendor_name VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    expense_date DATE NOT NULL,
    payment_mode VARCHAR(50) CHECK (payment_mode IN ('cash', 'online', 'cheque', 'other')),
    bill_receipt_url TEXT,
    paid_by_member_id UUID REFERENCES members(id) ON DELETE SET NULL,
    approved_by_member_id UUID REFERENCES members(id) ON DELETE SET NULL,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    year INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    description TEXT
);

-- =====================================================
-- 8. PHOTOS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    file_size INTEGER,
    dimensions VARCHAR(50),
    
    year INTEGER NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('flag_hoisting', 'stage_setup', 'murti_installation', 'cultural_program', 'food_distribution', 'team_moments', 'guest_speakers', 'decoration', 'other')),
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    description TEXT,
    tags TEXT[],
    
    uploaded_by UUID REFERENCES members(id) ON DELETE SET NULL,
    is_featured BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0
);

-- =====================================================
-- 9. APPROVALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    response VARCHAR(20) DEFAULT 'pending' CHECK (response IN ('pending', 'confirmed', 'declined')),
    response_date TIMESTAMP WITH TIME ZONE,
    comment TEXT,
    reminder_count INTEGER DEFAULT 0,
    last_reminder_sent TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(event_id, member_id)
);

-- =====================================================
-- 10. TIMELINE EVENTS TABLE (For Biography)
-- =====================================================
CREATE TABLE IF NOT EXISTS timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    event_date DATE NOT NULL,
    year INTEGER NOT NULL,
    title_english VARCHAR(255) NOT NULL,
    title_marathi VARCHAR(255) NOT NULL,
    description TEXT,
    description_marathi TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('birth', 'education', 'social_reform', 'political', 'constitution', 'conversion', 'death', 'other')),
    location VARCHAR(255),
    
    -- Historical References
    historical_reference TEXT,
    book_name VARCHAR(255),
    author VARCHAR(255),
    chapter VARCHAR(50),
    page_number VARCHAR(50),
    
    images TEXT[],
    importance VARCHAR(20) DEFAULT 'minor' CHECK (importance IN ('major', 'minor'))
);

-- =====================================================
-- 11. NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('payment_due', 'task_assigned', 'event_update', 'approval_request', 'photo_upload', 'general')),
    is_read BOOLEAN DEFAULT false,
    action_url TEXT
);

-- =====================================================
-- 12. SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES members(id) ON DELETE SET NULL
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_members_role ON members(role);
CREATE INDEX IF NOT EXISTS idx_members_active ON members(is_active);
CREATE INDEX IF NOT EXISTS idx_events_year ON events(year);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_tasks_event ON tasks(event_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_vargani_year ON vargani_payments(year);
CREATE INDEX IF NOT EXISTS idx_vargani_member ON vargani_payments(member_id);
CREATE INDEX IF NOT EXISTS idx_expenses_year ON expenses(year);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_photos_year ON photos(year);
CREATE INDEX IF NOT EXISTS idx_photos_category ON photos(category);
CREATE INDEX IF NOT EXISTS idx_approvals_event ON approvals(event_id);
CREATE INDEX IF NOT EXISTS idx_timeline_year ON timeline_events(year);
CREATE INDEX IF NOT EXISTS idx_notifications_member ON notifications(member_id);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vargani_payments_updated_at BEFORE UPDATE ON vargani_payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_approvals_updated_at BEFORE UPDATE ON approvals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vargani_settings_updated_at BEFORE UPDATE ON vargani_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vargani_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vargani_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read access for timeline_events (historical data)
CREATE POLICY "Public read access for timeline" ON timeline_events FOR SELECT USING (true);

-- Public read access for published events
CREATE POLICY "Public read access for published events" ON events FOR SELECT USING (status = 'published' OR status = 'completed');

-- Public read access for public photos
CREATE POLICY "Public read access for public photos" ON photos FOR SELECT USING (is_public = true);

-- Authenticated users can read all data
CREATE POLICY "Authenticated can read members" ON members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can read events" ON events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can read tasks" ON tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can read photos" ON photos FOR SELECT TO authenticated USING (true);

-- Super admins can do everything
CREATE POLICY "Super admins full access members" ON members FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM members WHERE auth_user_id = auth.uid() AND role = 'super_admin'));
CREATE POLICY "Super admins full access events" ON events FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM members WHERE auth_user_id = auth.uid() AND role = 'super_admin'));
CREATE POLICY "Super admins full access tasks" ON tasks FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM members WHERE auth_user_id = auth.uid() AND role = 'super_admin'));

-- =====================================================
-- INSERT SAMPLE TIMELINE EVENTS (Ambedkar History)
-- =====================================================
INSERT INTO timeline_events (event_date, year, title_english, title_marathi, description, category, location, book_name, author, importance) VALUES
('1891-04-14', 1891, 'Birth of Babasaheb Ambedkar', 'डॉ. बाबासाहेब आंबेडकरांचा जन्म', 'Born in Mhow, Central Provinces (now Madhya Pradesh)', 'birth', 'Mhow', 'Ambedkar Life', 'Keer', 'major'),
('1927-03-20', 1927, 'Mahad Satyagraha', 'महाड सत्याग्रह', 'Led the movement to drink water from Chavadar Tank', 'social_reform', 'Mahad', 'Ambedkar Life', 'Keer', 'major'),
('1947-08-29', 1947, 'Chairman of Drafting Committee', 'मसुदा समितीचे अध्यक्ष', 'Appointed as Chairman of the Constitution Drafting Committee', 'constitution', 'New Delhi', 'Ambedkar Life', 'Keer', 'major'),
('1956-10-14', 1956, 'Conversion to Buddhism', 'धम्मचक्र प्रवर्तन', 'Converted to Buddhism with lakhs of followers', 'conversion', 'Nagpur', 'Ambedkar Life', 'Keer', 'major'),
('1956-12-06', 1956, 'Mahaparinirvan', 'महापरिनिर्वाण', 'Passed away in New Delhi', 'death', 'New Delhi', 'Ambedkar Life', 'Keer', 'major');

-- =====================================================
-- INSERT INITIAL SETTINGS
-- =====================================================
INSERT INTO settings (key, value, description) VALUES
('organization_name', '"Rahul Mitra Mandal"', 'Organization name'),
('organization_name_marathi', '"राहुल मित्र मंडळ"', 'Organization name in Marathi'),
('location', '"Dapodi Gavthan "', 'Organization location'),
('established_year', '1972', 'Year organization was established'),
('contact_email', '"info@rahulmitramandal.org"', 'Contact email'),
('contact_phone', '"+91-XXXXXXXXXX"', 'Contact phone'),
('social_facebook', '""', 'Facebook page URL'),
('social_instagram', '""', 'Instagram page URL'),
('social_youtube', '""', 'YouTube channel URL'),
('next_ambedkar_jayanti', '"2026-04-14"', 'Next Ambedkar Jayanti date');

COMMIT;
