-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Members Table
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    role TEXT DEFAULT 'Member', -- 'President', 'Treasurer', 'Member'
    joined_year INTEGER DEFAULT 2026,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Vargani Payments (Yearly)
CREATE TABLE IF NOT EXISTS vargani_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    amount NUMERIC DEFAULT 1500,
    paid BOOLEAN DEFAULT FALSE,
    paid_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(member_id, year)
);

-- 3. Tasks
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    location TEXT DEFAULT 'Kedari Nagar Chowk',
    year INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Task Responses
CREATE TABLE IF NOT EXISTS task_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    member_name TEXT NOT NULL,
    status TEXT NOT NULL, -- 'approved' | 'declined'
    comment TEXT,
    responded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Expenses
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL,
    status TEXT DEFAULT 'approved',
    year INTEGER NOT NULL,
    paid_by TEXT DEFAULT 'Mandal',
    is_refunded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Invitations
CREATE TABLE IF NOT EXISTS invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    message TEXT,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    year INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    contact TEXT NOT NULL,
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. User Profiles for Role Management
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE NOT NULL,
    email TEXT NOT NULL,
    display_name TEXT,
    role TEXT DEFAULT 'sub_admin' CHECK (role IN ('admin', 'sub_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Vargani Slips Table
CREATE TABLE IF NOT EXISTS vargani_slips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    shop_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    location TEXT NOT NULL,
    address TEXT DEFAULT '',
    mobile TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('paid', 'pending')),
    tentative_date DATE,
    slip_number TEXT,
    confirmed_by_user_id UUID,
    confirmed_by_name TEXT,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    created_by_user_id UUID,
    created_by_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE vargani_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vargani_slips ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for demo purposes (Development)
CREATE POLICY "Public Access" ON members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON vargani_payments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON task_responses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON expenses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON invitations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON suppliers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON user_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON vargani_slips FOR ALL USING (true) WITH CHECK (true);
