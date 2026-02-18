import { Member, Task, Expense, Invitation, TaskResponse, Supplier } from "@/types/admin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

// --- Members & Vargani ---

export const useMembers = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["members"],
        queryFn: async () => {
            // Fetch members with their vargani history
            const { data, error } = await supabase
                .from('members')
                .select('*, vargani_payments(*)');

            if (error) throw error;

            // Transform to frontend Member type
            return data.map((m: any) => ({
                id: m.id,
                name: m.name,
                phone: m.phone,
                role: m.role,
                joinedYear: m.joined_year,
                varganiHistory: m.vargani_payments.map((v: any) => ({
                    year: v.year,
                    amount: v.amount,
                    paid: v.paid,
                    paidDate: v.paid_date
                }))
            })) as Member[];
        },
    });

    const addMember = useMutation({
        mutationFn: async (newMember: Omit<Member, "id" | "varganiHistory">) => {
            // 1. Insert Member
            const { data: memberData, error: memberError } = await supabase
                .from('members')
                .insert([{
                    name: newMember.name,
                    phone: newMember.phone,
                    role: newMember.role,
                    joined_year: newMember.joinedYear
                }])
                .select()
                .single();

            if (memberError) throw memberError;

            // 2. Initialize Vargani record for current year
            const currentYear = new Date().getFullYear();
            const { error: varganiError } = await supabase
                .from('vargani_payments')
                .insert([{
                    member_id: memberData.id,
                    year: currentYear,
                    amount: 1500,
                    paid: false
                }]);

            if (varganiError) console.error("Failed to init vargani", varganiError); // Non-critical

            return memberData;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members"] }),
    });

    const updateVargani = useMutation({
        mutationFn: async ({ id, paid, year, amount }: { id: string; paid: boolean; year: number; amount: number }) => {
            // Upsert: Create or Update based on (member_id, year) unique constraint
            const { error } = await supabase
                .from('vargani_payments')
                .upsert({
                    member_id: id,
                    year: year,
                    paid: paid,
                    amount: amount,
                    paid_date: paid ? new Date().toISOString() : null
                }, { onConflict: 'member_id, year' });

            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members"] }),
    });

    const deleteMember = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('members').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members"] }),
    });

    return { ...query, addMember, updateVargani, deleteMember };
};

// --- Tasks ---

export const useTasks = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["tasks"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data as Task[];
        },
    });

    const addTask = useMutation({
        mutationFn: async (newTask: Omit<Task, "id" | "assignedMembers">) => {
            const { data, error } = await supabase
                .from('tasks')
                .insert([{
                    title: newTask.title,
                    description: newTask.description,
                    date: newTask.date,
                    time: newTask.time,
                    location: newTask.location
                }])
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });

    const updateTask = useMutation({
        mutationFn: async (task: Partial<Task> & { id: string }) => {
            const { data, error } = await supabase
                .from('tasks')
                .update({
                    title: task.title,
                    description: task.description,
                    date: task.date,
                    time: task.time,
                    location: task.location
                })
                .eq('id', task.id)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });

    const deleteTask = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('tasks').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });

    return { ...query, addTask, updateTask, deleteTask };
};

export const useTaskResponses = (taskId?: string) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["task-responses", taskId],
        queryFn: async () => {
            if (!taskId) return [];
            const { data, error } = await supabase
                .from('task_responses')
                .select('*')
                .eq('task_id', taskId)
                .order('responded_at', { ascending: false });
            if (error) throw error;

            return data.map((d: any) => ({
                id: d.id,
                taskId: d.task_id,
                memberName: d.member_name,
                status: d.status,
                comment: d.comment,
                respondedAt: d.responded_at
            })) as TaskResponse[];
        },
        enabled: !!taskId
    });

    const addResponse = useMutation({
        mutationFn: async ({ taskId, memberName, status, comment }: { taskId: string, memberName: string, status: 'approved' | 'declined', comment?: string }) => {
            const { data, error } = await supabase
                .from('task_responses')
                .insert([{
                    task_id: taskId,
                    member_name: memberName,
                    status: status,
                    comment: comment || "",
                    responded_at: new Date().toISOString()
                }])
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["task-responses", taskId] }),
    });

    const deleteResponse = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('task_responses').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["task-responses", taskId] }),
    });

    return { ...query, addResponse, deleteResponse };
};

// --- Expenses ---

export const useExpenses = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["expenses"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('expenses')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            return data.map((e: any) => ({
                id: e.id,
                description: e.description,
                amount: e.amount,
                category: e.category,
                date: e.date,
                status: e.status,
                year: parseInt(e.date.split('-')[0]), // Extract year from date
                paidBy: e.paid_by || 'Mandal',
                isRefunded: e.is_refunded || false
            })) as Expense[];
        },
    });

    const addExpense = useMutation({
        mutationFn: async (newExpense: any) => {
            const { data, error } = await supabase
                .from('expenses')
                .insert([{
                    description: newExpense.description,
                    amount: newExpense.amount,
                    category: newExpense.category,
                    date: newExpense.date,
                    status: newExpense.status,
                    paid_by: newExpense.paidBy,
                    is_refunded: newExpense.isRefunded
                }])
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["expenses"] }),
    });

    const updateRefundStatus = useMutation({
        mutationFn: async ({ id, isRefunded }: { id: string, isRefunded: boolean }) => {
            const { error } = await supabase
                .from('expenses')
                .update({ is_refunded: isRefunded })
                .eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["expenses"] }),
    });

    const deleteExpense = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('expenses').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["expenses"] }),
    });

    const updateExpense = useMutation({
        mutationFn: async (expense: Partial<Expense> & { id: string }) => {
            const { data, error } = await supabase
                .from('expenses')
                .update({
                    description: expense.description,
                    amount: expense.amount,
                    category: expense.category,
                    date: expense.date,
                    // status: expense.status, // Keep existing status unless explicitly changed? Or allow update.
                    paid_by: expense.paidBy,
                    // is_refunded: expense.isRefunded // handled by specific mutation usually, but can be here
                })
                .eq('id', expense.id)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["expenses"] }),
    });

    return { ...query, addExpense, updateRefundStatus, deleteExpense, updateExpense };
};

// --- Suppliers ---

export const useSuppliers = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["suppliers"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('suppliers')
                .select('*')
                .order('category', { ascending: true }); // Group by category roughly
            if (error) {
                // Return empty if table doesn't exist yet to avoid crashing app completely
                if (error.code === '42P01') return [];
                throw error;
            }
            return data as Supplier[];
        },
    });

    const addSupplier = useMutation({
        mutationFn: async (newSup: Omit<Supplier, "id">) => {
            const { data, error } = await supabase
                .from('suppliers')
                .insert([{
                    name: newSup.name,
                    category: newSup.category,
                    contact: newSup.contact,
                    address: newSup.address,
                    notes: newSup.notes
                }])
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["suppliers"] }),
    });

    const updateSupplier = useMutation({
        mutationFn: async (sup: Partial<Supplier> & { id: string }) => {
            const { data, error } = await supabase
                .from('suppliers')
                .update({
                    name: sup.name,
                    category: sup.category,
                    contact: sup.contact,
                    address: sup.address,
                    notes: sup.notes
                })
                .eq('id', sup.id)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["suppliers"] }),
    });

    const deleteSupplier = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('suppliers').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["suppliers"] }),
    });

    return { ...query, addSupplier, updateSupplier, deleteSupplier };
};

// --- Invitations ---

export const useInvitations = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["invitations"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('invitations')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data as Invitation[];
        },
    });

    const addInvitation = useMutation({
        mutationFn: async (newInv: any) => {
            const { data, error } = await supabase
                .from('invitations')
                .insert([{
                    title: newInv.title,
                    message: newInv.message,
                    date: newInv.date,
                    time: newInv.time,
                    location: newInv.location
                }])
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invitations"] }),
    });

    const deleteInvitation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('invitations').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invitations"] }),
    });

    return { ...query, addInvitation, deleteInvitation };
};
