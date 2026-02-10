export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            members: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    full_name: string
                    full_name_marathi: string | null
                    email: string | null
                    phone: string
                    whatsapp_number: string | null
                    address: string | null
                    date_of_birth: string | null
                    photo_url: string | null
                    member_id: string
                    join_date: string
                    role: 'super_admin' | 'event_manager' | 'finance_manager' | 'media_manager' | 'committee_member' | 'member' | 'volunteer'
                    is_active: boolean
                    skills: string[] | null
                    emergency_contact_name: string | null
                    emergency_contact_phone: string | null
                    total_vargani_paid: number
                    events_attended: number
                    tasks_completed: number
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    full_name: string
                    full_name_marathi?: string | null
                    email?: string | null
                    phone: string
                    whatsapp_number?: string | null
                    address?: string | null
                    date_of_birth?: string | null
                    photo_url?: string | null
                    member_id: string
                    join_date?: string
                    role?: 'super_admin' | 'event_manager' | 'finance_manager' | 'media_manager' | 'committee_member' | 'member' | 'volunteer'
                    is_active?: boolean
                    skills?: string[] | null
                    emergency_contact_name?: string | null
                    emergency_contact_phone?: string | null
                    total_vargani_paid?: number
                    events_attended?: number
                    tasks_completed?: number
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    full_name?: string
                    full_name_marathi?: string | null
                    email?: string | null
                    phone?: string
                    whatsapp_number?: string | null
                    address?: string | null
                    date_of_birth?: string | null
                    photo_url?: string | null
                    member_id?: string
                    join_date?: string
                    role?: 'super_admin' | 'event_manager' | 'finance_manager' | 'media_manager' | 'committee_member' | 'member' | 'volunteer'
                    is_active?: boolean
                    skills?: string[] | null
                    emergency_contact_name?: string | null
                    emergency_contact_phone?: string | null
                    total_vargani_paid?: number
                    events_attended?: number
                    tasks_completed?: number
                }
            }
            events: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    title_english: string
                    title_marathi: string
                    description: string | null
                    description_marathi: string | null
                    event_type: 'shiv_jayanti' | 'meeting' | 'social_work' | 'fort_trek' | 'cultural_program' | 'other'
                    event_date: string
                    start_time: string | null
                    end_time: string | null
                    location: string
                    location_marathi: string | null
                    venue_address: string | null
                    expected_attendance: number | null
                    actual_attendance: number | null
                    budget_allocated: number
                    budget_spent: number
                    year: number
                    status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled'
                    cover_image_url: string | null
                    gallery_images: string[] | null
                    video_urls: string[] | null
                    agenda: Json | null
                    highlights: string[] | null
                    created_by: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                    title_english: string
                    title_marathi: string
                    description?: string | null
                    description_marathi?: string | null
                    event_type?: 'shiv_jayanti' | 'meeting' | 'social_work' | 'fort_trek' | 'cultural_program' | 'other'
                    event_date: string
                    start_time?: string | null
                    end_time?: string | null
                    location: string
                    location_marathi?: string | null
                    venue_address?: string | null
                    expected_attendance?: number | null
                    actual_attendance?: number | null
                    budget_allocated?: number
                    budget_spent?: number
                    year: number
                    status?: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled'
                    cover_image_url?: string | null
                    gallery_images?: string[] | null
                    video_urls?: string[] | null
                    agenda?: Json | null
                    highlights?: string[] | null
                    created_by?: string | null
                }
                Update: { /* ... same structure */ }
            }
            tasks: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    title: string
                    title_marathi: string | null
                    description: string | null
                    task_type: 'flag_hoisting' | 'sound_dj' | 'stage_setup' | 'decoration' | 'murti_installation' | 'guest_coordination' | 'food_prasad' | 'printing' | 'transportation' | 'other'
                    event_id: string | null
                    scheduled_date: string
                    scheduled_time: string | null
                    location: string | null
                    requirements: string[] | null
                    budget_allocated: number
                    budget_spent: number
                    vendor_name: string | null
                    vendor_contact: string | null
                    status: 'planning' | 'approval_pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled'
                    priority: 'low' | 'medium' | 'high' | 'urgent'
                    checklist: Json | null
                    notes: string | null
                    created_by: string | null
                }
                Insert: { /* ... */ }
                Update: { /* ... */ }
            }
            task_assignments: {
                Row: {
                    id: string
                    task_id: string
                    member_id: string
                    assigned_at: string
                    role: string | null
                }
                Insert: {
                    id?: string
                    task_id: string
                    member_id: string
                    assigned_at?: string
                    role?: string | null
                }
                Update: { /* ... */ }
            }
            vargani_settings: {
                Row: {
                    id: string
                    year: number
                    total_budget: number
                    per_head_amount: number
                    active_members_count: number
                    collection_start_date: string | null
                    collection_end_date: string | null
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: { /* ... */ }
                Update: { /* ... */ }
            }
            vargani_payments: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    member_id: string
                    year: number
                    amount_due: number
                    amount_paid: number
                    payment_date: string | null
                    payment_mode: 'cash' | 'upi' | 'bank_transfer' | 'cheque' | 'other'
                    transaction_id: string | null
                    receipt_url: string | null
                    status: 'unpaid' | 'partial' | 'paid'
                    notes: string | null
                    collected_by: string | null
                }
                Insert: { /* ... */ }
                Update: { /* ... */ }
            }
            expenses: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    category: 'flag_hoisting' | 'sound_dj' | 'stage_construction' | 'decoration' | 'murti' | 'food_prasad' | 'printing' | 'guest_honorarium' | 'transportation' | 'miscellaneous'
                    subcategory: string | null
                    vendor_name: string
                    amount: number
                    expense_date: string
                    payment_mode: 'cash' | 'online' | 'cheque' | 'other'
                    bill_receipt_url: string | null
                    paid_by_member_id: string | null
                    approved_by_member_id: string | null
                    event_id: string | null
                    year: number
                    status: 'pending' | 'approved' | 'rejected'
                    description: string | null
                }
                Insert: { /* ... */ }
                Update: { /* ... */ }
            }
            photos: {
                Row: {
                    id: string
                    created_at: string
                    file_name: string
                    file_url: string
                    thumbnail_url: string | null
                    file_size: number | null
                    dimensions: string | null
                    year: number
                    category: 'flag_hoisting' | 'stage_setup' | 'murti_installation' | 'cultural_program' | 'food_distribution' | 'team_moments' | 'guest_speakers' | 'decoration' | 'other'
                    event_id: string | null
                    description: string | null
                    tags: string[] | null
                    uploaded_by: string | null
                    is_featured: boolean
                    is_public: boolean
                    view_count: number
                }
                Insert: { /* ... */ }
                Update: { /* ... */ }
            }
            approvals: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                    event_id: string
                    member_id: string
                    response: 'pending' | 'confirmed' | 'declined'
                    response_date: string | null
                    comment: string | null
                    reminder_count: number
                    last_reminder_sent: string | null
                }
                Insert: { /* ... */ }
                Update: { /* ... */ }
            }
            forts: {
                Row: {
                    id: string
                    name_english: string
                    name_marathi: string
                    category: 'sea_fort' | 'hill_fort' | 'land_fort'
                    region: string
                    conquest_date: string | null
                    conquest_year: number | null
                    strategic_importance: string | null
                    gps_coordinates: string | null
                    current_status: string | null
                    visit_info: string | null
                    historical_reference: string | null
                    book_name: string | null
                    author: string | null
                    chapter: string | null
                    page_number: string | null
                    images: string[] | null
                    has_3d_model: boolean
                    description: string | null
                    description_marathi: string | null
                }
                Insert: { /* ... */ }
                Update: { /* ... */ }
            }
            timeline_events: {
                Row: {
                    id: string
                    event_date: string
                    year: number
                    title_english: string
                    title_marathi: string
                    description: string | null
                    description_marathi: string | null
                    category: 'birth' | 'conquest' | 'battle' | 'treaty' | 'coronation' | 'administration' | 'death' | 'other'
                    location: string | null
                    historical_reference: string | null
                    book_name: string | null
                    author: string | null
                    chapter: string | null
                    page_number: string | null
                    images: string[] | null
                    related_fort_id: string | null
                    importance: 'major' | 'minor'
                }
                Insert: { /* ... */ }
                Update: { /* ... */ }
            }
            notifications: {
                Row: {
                    id: string
                    created_at: string
                    member_id: string
                    title: string
                    message: string
                    type: 'payment_due' | 'task_assigned' | 'event_update' | 'approval_request' | 'photo_upload' | 'general'
                    is_read: boolean
                    action_url: string | null
                }
                Insert: { /* ... */ }
                Update: { /* ... */ }
            }
            settings: {
                Row: {
                    id: string
                    key: string
                    value: Json
                    description: string | null
                    updated_at: string
                    updated_by: string | null
                }
                Insert: { /* ... */ }
                Update: { /* ... */ }
            }
        }
        Views: { /* ... */ }
        Functions: { /* ... */ }
        Enums: { /* ... */ }
    }
}
