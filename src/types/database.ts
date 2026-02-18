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
                    name: string
                    phone: string
                    role: string // 'President' | 'Treasurer' | 'Member'
                    joined_year: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    phone: string
                    role?: string
                    joined_year?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    phone?: string
                    role?: string
                    joined_year?: number
                    created_at?: string
                }
            }
            vargani_payments: {
                Row: {
                    id: string
                    member_id: string
                    year: number
                    amount: number
                    paid: boolean
                    paid_date: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    member_id: string
                    year: number
                    amount?: number
                    paid?: boolean
                    paid_date?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    member_id?: string
                    year?: number
                    amount?: number
                    paid?: boolean
                    paid_date?: string | null
                    created_at?: string
                }
            }
            tasks: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    date: string
                    time: string
                    location: string
                    year: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    date: string
                    time: string
                    location?: string
                    year: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    date?: string
                    time?: string
                    location?: string
                    year?: number
                    created_at?: string
                }
            }
            task_responses: {
                Row: {
                    id: string
                    task_id: string
                    member_name: string
                    status: string // 'approved' | 'declined'
                    comment: string | null
                    responded_at: string
                }
                Insert: {
                    id?: string
                    task_id: string
                    member_name: string
                    status: string
                    comment?: string | null
                    responded_at?: string
                }
                Update: {
                    id?: string
                    task_id?: string
                    member_name?: string
                    status?: string
                    comment?: string | null
                    responded_at?: string
                }
            }
            expenses: {
                Row: {
                    id: string
                    description: string
                    amount: number
                    category: string
                    date: string
                    status: string // 'pending' | 'approved' | 'rejected'
                    year: number
                    paid_by: string
                    is_refunded: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    description: string
                    amount: number
                    category: string
                    date: string
                    status?: string
                    year: number
                    paid_by?: string
                    is_refunded?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    description?: string
                    amount?: number
                    category?: string
                    date?: string
                    status?: string
                    year?: number
                    paid_by?: string
                    is_refunded?: boolean
                    created_at?: string
                }
            }
            suppliers: {
                Row: {
                    id: string
                    name: string
                    category: string // 'Sound' | 'Decoration' | 'Stage' | 'Banner' | 'Other'
                    contact: string
                    address: string | null
                    notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    category: string
                    contact: string
                    address?: string | null
                    notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    category?: string
                    contact?: string
                    address?: string | null
                    notes?: string | null
                    created_at?: string
                }
            }
            invitations: {
                Row: {
                    id: string
                    title: string
                    message: string | null
                    date: string
                    time: string
                    location: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    message?: string | null
                    date: string
                    time: string
                    location: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    message?: string | null
                    date?: string
                    time?: string
                    location?: string
                    created_at?: string
                }
            }
        }
    }
}
