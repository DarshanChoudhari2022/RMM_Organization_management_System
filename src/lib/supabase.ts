import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = 'https://vxuhvsgtmvemynlicvci.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4dWh2c2d0bXZlbXlubGljdmNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MzMwOTIsImV4cCI6MjA4NjIwOTA5Mn0.ivzN2QJ8RonskTgPphdSvKIb2EbnJdkkreDpwHdthzw';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const signUp = async (email: string, password: string, metadata?: { full_name?: string; phone?: string }) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: metadata,
        },
    });
    return { data, error };
};

export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
};

export const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
};

// Data fetching helpers
export const fetchMembers = async () => {
    const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });
    return { data, error };
};

export const fetchEvents = async () => {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });
    return { data, error };
};

export const fetchTasks = async () => {
    const { data, error } = await supabase
        .from('tasks')
        .select('*, assigned_members:task_assignments(member_id)')
        .order('due_date', { ascending: true });
    return { data, error };
};

export const fetchVargani = async (year?: number) => {
    let query = supabase.from('vargani_payments').select('*, member:members(*)');
    if (year) {
        query = query.eq('year', year);
    }
    const { data, error } = await query.order('payment_date', { ascending: false });
    return { data, error };
};

export const fetchExpenses = async (year?: number) => {
    let query = supabase.from('expenses').select('*');
    if (year) {
        query = query.eq('year', year);
    }
    const { data, error } = await query.order('expense_date', { ascending: false });
    return { data, error };
};

export const fetchPhotos = async (year?: number, category?: string) => {
    let query = supabase.from('photos').select('*');
    if (year) {
        query = query.eq('year', year);
    }
    if (category) {
        query = query.eq('category', category);
    }
    const { data, error } = await query.order('upload_date', { ascending: false });
    return { data, error };
};

export const fetchApprovals = async (eventId?: string) => {
    let query = supabase.from('approvals').select('*, member:members(*), event:events(*)');
    if (eventId) {
        query = query.eq('event_id', eventId);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
};

// Fort data for Shivaji Maharaj biography section
export const fetchForts = async (category?: string, region?: string) => {
    let query = supabase.from('forts').select('*');
    if (category) {
        query = query.eq('category', category);
    }
    if (region) {
        query = query.eq('region', region);
    }
    const { data, error } = await query.order('conquest_date', { ascending: true });
    return { data, error };
};

// Timeline data for biography section
export const fetchTimelineEvents = async () => {
    const { data, error } = await supabase
        .from('timeline_events')
        .select('*')
        .order('event_date', { ascending: true });
    return { data, error };
};

export default supabase;
