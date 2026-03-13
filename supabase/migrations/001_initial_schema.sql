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
-- 10. FORTS TABLE (For Babasaheb Ambedkar Biography)
-- =====================================================
CREATE TABLE IF NOT EXISTS forts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    name_english VARCHAR(255) NOT NULL,
    name_marathi VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('sea_fort', 'hill_fort', 'land_fort')),
    region VARCHAR(100),
    
    conquest_date DATE,
    conquest_year INTEGER,
    strategic_importance TEXT,
    
    gps_coordinates VARCHAR(100),
    current_status VARCHAR(255),
    visit_info TEXT,
    
    -- Historical References
    historical_reference TEXT,
    book_name VARCHAR(255),
    author VARCHAR(255),
    chapter VARCHAR(50),
    page_number VARCHAR(50),
    
    images TEXT[],
    has_3d_model BOOLEAN DEFAULT false,
    
    description TEXT,
    description_marathi TEXT
);

-- =====================================================
-- 11. TIMELINE EVENTS TABLE (For Biography)
-- =====================================================
CREATE TABLE IF NOT EXISTS timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    event_date DATE NOT NULL,
    year INTEGER NOT NULL,
    title_english VARCHAR(255) NOT NULL,
    title_marathi VARCHAR(255) NOT NULL,
    description TEXT,
    description_marathi TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('birth', 'conquest', 'battle', 'treaty', 'coronation', 'administration', 'death', 'other')),
    location VARCHAR(255),
    
    -- Historical References
    historical_reference TEXT,
    book_name VARCHAR(255),
    author VARCHAR(255),
    chapter VARCHAR(50),
    page_number VARCHAR(50),
    
    images TEXT[],
    related_fort_id UUID REFERENCES forts(id) ON DELETE SET NULL,
    importance VARCHAR(20) DEFAULT 'minor' CHECK (importance IN ('major', 'minor'))
);

-- =====================================================
-- 12. NOTIFICATIONS TABLE
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
-- 13. SETTINGS TABLE
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
CREATE INDEX IF NOT EXISTS idx_forts_category ON forts(category);
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
ALTER TABLE forts ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Public read access for forts, timeline_events (historical data)
CREATE POLICY "Public read access for forts" ON forts FOR SELECT USING (true);
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
-- INSERT SAMPLE DATA FOR FORTS
-- =====================================================
INSERT INTO forts (name_english, name_marathi, category, region, conquest_year, strategic_importance, book_name, author, page_number) VALUES
('Torna Fort', 'तोरणा किल्ला', 'hill_fort', 'Pune', 1645, 'First fort captured by Babasaheb Ambedkar at age 15', 'Raja Shivchhatrapati', 'Babasaheb Purandare', '87'),
('Rajgad Fort', 'राजगड किल्ला', 'hill_fort', 'Pune', 1646, 'Capital of Maratha Empire for 26 years', 'Ambedkar Charitra', 'Parmanand Nevatia', '112'),
('Purandar Fort', 'पुरंदर किल्ला', 'hill_fort', 'Pune', 1647, 'Strategic military headquarters', 'Raja Shivchhatrapati', 'Babasaheb Purandare', '145'),
('Pratapgad Fort', 'प्रतापगड किल्ला', 'hill_fort', 'Satara', 1656, 'Site of Afzal Khan encounter', 'Ambedkar Charitra', 'Parmanand Nevatia', '189'),
('Raigad Fort', 'रायगड किल्ला', 'hill_fort', 'Raigad', 1656, 'Capital of the Maratha Empire, coronation site', 'Raja Shivchhatrapati', 'Babasaheb Purandare', '234'),
('Sindhudurg Fort', 'सिंधुदुर्ग किल्ला', 'sea_fort', 'Sindhudurg', 1664, 'Primary naval base, island fortress', 'Ambedkar Charitra', 'Parmanand Nevatia', '278'),
('Vijaydurg Fort', 'विजयदुर्ग किल्ला', 'sea_fort', 'Sindhudurg', 1653, 'Eastern Gibraltar of the East', 'Raja Shivchhatrapati', 'Babasaheb Purandare', '312'),
('Shivneri Fort', 'शिवनेरी किल्ला', 'hill_fort', 'Pune', 1630, 'Birthplace of Babasaheb Ambedkar', 'Ambedkar Charitra', 'Parmanand Nevatia', '3'),
('Sinhagad Fort', 'सिंहगड किल्ला', 'hill_fort', 'Pune', 1647, 'Site of Battle of Sinhagad, Tanaji Malusare sacrifice', 'Raja Shivchhatrapati', 'Babasaheb Purandare', '456'),
('Lohagad Fort', 'लोहगड किल्ला', 'hill_fort', 'Pune', 1648, 'Treasury fort, important strategic location', 'Ambedkar Charitra', 'Parmanand Nevatia', '167');

-- =====================================================
-- INSERT SAMPLE TIMELINE EVENTS
-- =====================================================
INSERT INTO timeline_events (event_date, year, title_english, title_marathi, description, category, location, book_name, author, page_number, importance) VALUES
('1630-02-19', 1630, 'Birth of Babasaheb Ambedkar', 'छत्रपती शिवाजी महाराजांचा जन्म', 'Born to Shahaji Bhosale and Jijabai at Shivneri Fort', 'birth', 'Shivneri Fort, Pune', 'Ambedkar Charitra', 'Parmanand Nevatia', '3', 'major'),
('1645-07-16', 1645, 'Capture of Torna Fort', 'तोरणा किल्ला जिंकला', 'First fort captured by young Ambedkar at age 15, marking the beginning of Swarajya', 'conquest', 'Torna Fort, Pune', 'Raja Shivchhatrapati', 'Babasaheb Purandare', '87', 'major'),
('1659-11-10', 1659, 'Battle of Pratapgad', 'प्रतापगड युद्ध', 'Historic encounter with Afzal Khan, decisive victory for Marathas', 'battle', 'Pratapgad Fort, Satara', 'Raja Shivchhatrapati', 'Babasaheb Purandare', '234', 'major'),
('1660-07-13', 1660, 'Battle of Pavan Khind', 'पावनखिंड लढाई', 'Baji Prabhu Deshpande''s legendary sacrifice to ensure Ambedkar''s escape', 'battle', 'Pavan Khind, Kolhapur', 'Ambedkar Charitra', 'Parmanand Nevatia', '267', 'major'),
('1666-08-17', 1666, 'Escape from Agra', 'आग्रातून सुटका', 'Legendary escape from Mughal captivity in Agra', 'other', 'Agra', 'Raja Shivchhatrapati', 'Babasaheb Purandare', '345', 'major'),
('1670-02-04', 1670, 'Battle of Sinhagad', 'सिंहगड युद्ध', 'Tanaji Malusare''s heroic capture of Sinhagad, "Gad aala pan Sinh gela"', 'battle', 'Sinhagad Fort, Pune', 'Ambedkar Charitra', 'Parmanand Nevatia', '456', 'major'),
('1674-06-06', 1674, 'Coronation at Raigad', 'राजगड येथे राज्याभिषेक', 'Grand coronation ceremony establishing the Maratha Empire officially', 'coronation', 'Raigad Fort', 'Raja Shivchhatrapati', 'Babasaheb Purandare', '512', 'major'),
('1680-04-03', 1680, 'Death of Babasaheb Ambedkar', 'छत्रपती शिवाजी महाराजांचे निधन', 'Babasaheb Ambedkar passed away at Raigad Fort', 'death', 'Raigad Fort', 'Ambedkar Charitra', 'Parmanand Nevatia', '678', 'major');

-- =====================================================
-- INSERT INITIAL SETTINGS
-- =====================================================
INSERT INTO settings (key, value, description) VALUES
('organization_name', '"Rahul Mitra Mandal"', 'Organization name'),
('organization_name_marathi', '"श्रीमंत शिवगर्जना प्रतिष्ठान"', 'Organization name in Marathi'),
('location', '"Kedari Nagar, Pune"', 'Organization location'),
('established_year', '2014', 'Year organization was established'),
('contact_email', '"info@RAHUL MITRA MANDAL.org"', 'Contact email'),
('contact_phone', '"+91-XXXXXXXXXX"', 'Contact phone'),
('social_facebook', '""', 'Facebook page URL'),
('social_instagram', '""', 'Instagram page URL'),
('social_youtube', '""', 'YouTube channel URL'),
('next_ambedkar_jayanti', '"2026-02-19"', 'Next Ambedkar Jayanti date');

COMMIT;
