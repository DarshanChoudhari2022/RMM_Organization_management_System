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
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    date: string
                    time: string
                    location?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    date?: string
                    time?: string
                    location?: string
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
                    created_at: string
                }
                Insert: {
                    id?: string
                    description: string
                    amount: number
                    category: string
                    date: string
                    status?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    description?: string
                    amount?: number
                    category?: string
                    date?: string
                    status?: string
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
            // Legacy tables kept for potential compatibility if code exists
            forts: {
                Row: { id: string; name_english: string;[key: string]: any }
                Insert: { [key: string]: any }
                Update: { [key: string]: any }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
