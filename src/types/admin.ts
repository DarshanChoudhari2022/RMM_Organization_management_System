export interface VarganiRecord {
    year: number;
    amount: number;
    paid: boolean;
    paidDate?: string | null;
}

export interface Member {
    id: string;
    name: string;
    phone: string;
    role: string; // 'President' | 'Treasurer' | 'Member'
    joinedYear: number;
    varganiHistory: VarganiRecord[];
}

export interface Task {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    // responses?: TaskResponse[]; // Optional if we fetch them
}

export interface TaskResponse {
    id: string;
    taskId: string;
    memberName: string;
    status: 'approved' | 'declined';
    comment?: string;
    respondedAt: string;
}

export interface Expense {
    id: string;
    description: string;
    amount: number;
    category: string;
    date: string;
    status: 'pending' | 'approved' | 'rejected';
    year: number; // For filtering
    paidBy: string; // Who paid originally
    isRefunded: boolean; // Has Mandal refunded them?
    vendorName?: string; // New field from database
}

export interface Invitation {
    id: string;
    title: string;
    message: string;
    date: string;
    time: string;
    location: string;
}

export type TaskCategory = "flag_hosting" | "sound_dj" | "stage_construction" | "decoration" | "murti_installation" | "other";

export interface Supplier {
    id: string;
    name: string;
    category: 'Sound' | 'Decoration' | 'Stage' | 'Banner' | 'Other';
    contact: string;
    address?: string;
    notes?: string;
}

export interface SystemLog {
    id: string;
    created_at: string;
    action: string;
    details: string;
    user_id?: string;
    user_name?: string;
}
