import { Member, Task, Expense, Invitation, TaskResponse, Supplier, SystemLog } from "@/types/admin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase as supabaseClient } from "@/lib/supabase";
import { toast } from "sonner"; // For elegant error feedbacks

const supabase = supabaseClient as any;

// --- Members & Vargani ---

export const useMembers = (year?: number) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["members", year],
        staleTime: 2 * 60 * 1000,   // 2 min — reduce network calls
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        queryFn: async () => {
            let membersQuery = supabase.from('members').select('*, vargani_payments(*)');
            
            // If year is provided, we still fetch members but we can't easily filter 
            // the inner vargani_payments without complex subqueries or separate fetches.
            // For now, let's just optimize the main list.
            
            const { data, error } = await membersQuery;

            if (error) throw error;

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

            if (memberError || !memberData) throw memberError || new Error("Member creation failed");

            // 2. Initialize Vargani record for current year
            const { error: varganiError } = await supabase
                .from('vargani_payments')
                .insert([{
                    member_id: memberData.id,
                    year: newMember.joinedYear,
                    amount: 1500,
                    paid: false
                }]);

            if (varganiError) console.error("Failed to init vargani", varganiError); // Non-critical

            createLog("Member Added", `Added member ${newMember.name} with role ${newMember.role}`);

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
            createLog("Vargani Updated", `Updated vargani for member ID ${id} (Year: ${year}, Amount: ₹${amount})`);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members"] }),
    });

    const deleteMember = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('members').delete().eq('id', id);
            if (error) throw error;
            createLog("Member Deleted", `Deleted member with ID ${id}`);
        },
        // Optimistic delete
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["members"] });
            const previous = queryClient.getQueryData<Member[]>(["members", year]);
            queryClient.setQueryData<Member[]>(["members", year], (old) => old?.filter(m => m.id !== id));
            return { previous };
        },
        onError: (err, id, context) => {
            if (context?.previous) queryClient.setQueryData(["members", year], context.previous);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["members"] }),
    });

    return { ...query, addMember, updateVargani, deleteMember };
};

// --- Tasks ---

export const useTasks = (year?: number) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["tasks", year],
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        queryFn: async () => {
            let q = supabase.from('tasks').select('*');
            if (year) {
                q = q.eq('year', year);
            }
            const { data, error } = await q.order('date', { ascending: false });
            
            if (error) throw error;
            return data.map((t: any) => ({
                ...t,
                year: t.year || parseInt(t.date.split('-')[0])
            })) as (Task & { year: number })[];
        },
    });

    const addTask = useMutation({
        mutationFn: async (newTask: Omit<Task, "id" | "assignedMembers"> & { year: number }) => {
            const { data, error } = await supabase
                .from('tasks')
                .insert([{
                    title: newTask.title,
                    description: newTask.description,
                    date: newTask.date,
                    time: newTask.time,
                    location: newTask.location,
                    year: newTask.year
                }])
                .select()
                .single();
            if (error) throw error;
            createLog("Task Added", `Added task: ${newTask.title}`);
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });

    const updateTask = useMutation({
        mutationFn: async (task: Partial<Task> & { id: string, year?: number }) => {
            const { data, error } = await supabase
                .from('tasks')
                .update({
                    title: task.title,
                    description: task.description,
                    date: task.date,
                    time: task.time,
                    location: task.location,
                    year: task.year || (task.date ? parseInt(task.date.split('-')[0]) : undefined)
                })
                .eq('id', task.id)
                .select()
                .single();
            if (error) throw error;
            createLog("Task Updated", `Updated task: ${task.title || task.id}`);
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });

    const deleteTask = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('tasks').delete().eq('id', id);
            if (error) throw error;
            createLog("Task Deleted", `Deleted task ID: ${id}`);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    });

    return { ...query, addTask, updateTask, deleteTask };
};

export const useTaskResponses = (taskId?: string) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["task-responses", taskId],
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
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

export const useExpenses = (year?: number) => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["expenses", year],
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        queryFn: async () => {
            let q = supabase.from('expenses').select('*');
            if (year) {
                q = q.eq('year', year);
            }
            const { data, error } = await q.order('created_at', { ascending: false });

            if (error) throw error;

            return data.map((e: any) => ({
                id: e.id,
                description: e.description,
                amount: e.amount,
                category: e.category,
                date: e.date,
                status: e.status,
                year: e.year || parseInt(e.date.split('-')[0]),
                paidBy: e.paid_by || 'Mandal',
                isRefunded: e.is_refunded || false,
                vendorName: e.vendor_name || 'General'
            })) as Expense[];
        },
    });

    const addExpense = useMutation({
        mutationFn: async (newExpense: Omit<Expense, "id" | "year"> & { year: number }) => {
            const { data, error } = await supabase
                .from('expenses')
                .insert([{
                    description: newExpense.description,
                    amount: newExpense.amount,
                    category: newExpense.category,
                    date: newExpense.date,
                    status: newExpense.status,
                    year: newExpense.year,
                    paid_by: newExpense.paidBy,
                    is_refunded: newExpense.isRefunded,
                    vendor_name: newExpense.vendorName || 'General'
                }])
                .select()
                .single();
            if (error) throw error;
            createLog("Expense Added", `Added expense: ${newExpense.description} (Amount: ₹${newExpense.amount})`);
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
            createLog("Expense Deleted", `Deleted expense ID: ${id}`);
        },
        // Optimistic delete
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["expenses"] });
            const previous = queryClient.getQueryData(["expenses", year]);
            queryClient.setQueryData<Expense[]>(["expenses", year], (old) => old?.filter(e => e.id !== id));
            return { previous };
        },
        onError: (err, id, context) => {
            if (context?.previous) queryClient.setQueryData(["expenses", year], context.previous);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["expenses"] }),
    });

    const updateExpense = useMutation({
        mutationFn: async (expense: Partial<Expense> & { id: string, year?: number }) => {
            const { data, error } = await supabase
                .from('expenses')
                .update({
                    description: expense.description,
                    amount: expense.amount,
                    category: expense.category,
                    date: expense.date,
                    year: expense.year,
                    paid_by: expense.paidBy,
                    is_refunded: expense.isRefunded,
                    vendor_name: expense.vendorName
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
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
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
                    notes: newSup.notes,
                    total_amount: newSup.total_amount || 0,
                    paid_amount: newSup.paid_amount || 0,
                    terms: newSup.terms,
                    supplier_comment: newSup.supplier_comment
                }])
                .select()
                .single();
            if (error) throw error;
            createLog("Supplier Added", `Added supplier: ${newSup.name}`);
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
                    notes: sup.notes,
                    total_amount: sup.total_amount,
                    paid_amount: sup.paid_amount,
                    terms: sup.terms,
                    is_confirmed: sup.is_confirmed,
                    confirmed_at: sup.confirmed_at,
                    supplier_comment: sup.supplier_comment
                })
                .eq('id', sup.id)
                .select()
                .single();
            if (error) throw error;
            createLog("Supplier Updated", `Updated supplier: ${sup.name || sup.id}`);
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["suppliers"] }),
    });

    const deleteSupplier = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('suppliers').delete().eq('id', id);
            if (error) throw error;
            createLog("Supplier Deleted", `Deleted supplier ID: ${id}`);
        },
        // Optimistic delete
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["suppliers"] });
            const previous = queryClient.getQueryData<Supplier[]>(["suppliers"]);
            queryClient.setQueryData<Supplier[]>(["suppliers"], (old) => old?.filter(s => s.id !== id));
            return { previous };
        },
        onError: (err, id, context) => {
            if (context?.previous) queryClient.setQueryData(["suppliers"], context.previous);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["suppliers"] }),
    });

    const confirmSupplier = useMutation({
        mutationFn: async (id: string) => {
            const { data, error } = await supabase
                .from('suppliers')
                .update({
                    is_confirmed: true,
                    confirmed_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            createLog("Supplier Confirmed", `Supplier ${data.name} confirmed the agreement`);
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["suppliers"] }),
    });

    return { ...query, addSupplier, updateSupplier, deleteSupplier, confirmSupplier };
};

// --- Invitations ---

export const useInvitations = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["invitations"],
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
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
// --- System Logs ---

export const useLogs = () => {
    return useQuery({
        queryKey: ["system-logs"],
        staleTime: 2 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('audit_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);
            if (error) {
                if (error.code === '42P01') return [];
                throw error;
            }
            return data.map((l: any) => ({
                id: l.id,
                created_at: l.created_at,
                action: l.action,
                details: l.details,
                user_id: l.user_id,
                user_name: l.user_name
            })) as SystemLog[];
        },
    });
};

// Cache user name for logging — avoid repeated profile lookups
let _logUserCache: { userId: string; userName: string; exp: number } | null = null;

// Fire-and-forget: don't await this — mutations should not wait for logging
export const createLog = (action: string, details: string) => {
    // Run in background, never block the caller
    (async () => {
        try {
            // Use cached user if available
            if (_logUserCache && Date.now() < _logUserCache.exp) {
                await supabase.from('audit_logs').insert([{
                    action,
                    details,
                    user_id: _logUserCache.userId,
                    user_name: _logUserCache.userName
                }]);
                return;
            }

            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user;

            let userName = user?.email;
            if (user) {
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('display_name')
                    .eq('auth_user_id', user.id)
                    .single();
                if (profile?.display_name) userName = profile.display_name;

                // Cache for 10 min
                _logUserCache = { userId: user.id, userName: userName || '', exp: Date.now() + 10 * 60 * 1000 };
            }

            await supabase.from('audit_logs').insert([{
                action,
                details,
                user_id: user?.id,
                user_name: userName
            }]);
        } catch (e) {
            console.warn('Audit log failed (non-critical):', e);
        }
    })();
};
