import { UserProfile, VarganiSlip } from "@/types/admin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase as supabaseClient } from "@/lib/supabase";
import { createLog } from "./admin-api";

const supabase = supabaseClient as any;

// ==========================================
// User Profiles & Role Management
// ==========================================

// Cache user info in memory to avoid repeated Supabase calls
let _cachedUser: { userId: string; userName: string; expiresAt: number } | null = null;

const getCachedUserName = async (): Promise<{ userId: string | undefined; userName: string }> => {
    // Return cached if still valid (5 minutes)
    if (_cachedUser && Date.now() < _cachedUser.expiresAt) {
        return { userId: _cachedUser.userId, userName: _cachedUser.userName };
    }

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    let userName = user?.email?.split('@')[0] || 'Unknown';

    if (user) {
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('display_name')
            .eq('auth_user_id', user.id)
            .single();
        if (profile?.display_name) userName = profile.display_name;
    }

    // Cache for 5 minutes
    if (user) {
        _cachedUser = { userId: user.id, userName, expiresAt: Date.now() + 5 * 60 * 1000 };
    }

    return { userId: user?.id, userName };
};

// Clear cached user on logout
export const clearCachedUser = () => { _cachedUser = null; };

export const useUserProfile = () => {
    const query = useQuery({
        queryKey: ["user-profile"],
        staleTime: 5 * 60 * 1000,   // 5 min — profile rarely changes
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        queryFn: async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) return null;

            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('auth_user_id', session.user.id);

            if (error) throw error;
            
            if (!data || data.length === 0) {
                return null;
            }

            return data[0] as UserProfile;
        },
    });
    return query;
};

export const useAllProfiles = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["all-profiles"],
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) {
                if (error.code === '42P01') return [];
                throw error;
            }
            return data as UserProfile[];
        },
    });

    const updateProfile = useMutation({
        mutationFn: async ({ id, role, display_name }: { id: string; role: 'admin' | 'sub_admin'; display_name?: string }) => {
            const updateData: any = { role, updated_at: new Date().toISOString() };
            if (display_name !== undefined) updateData.display_name = display_name;

            const { error } = await supabase
                .from('user_profiles')
                .update(updateData)
                .eq('id', id);

            if (error) throw error;
            // Clear user cache since a profile changed
            _cachedUser = null;
            createLog("User Role Changed", `Changed user role to ${role}${display_name ? ` (Name: ${display_name})` : ''}`);
        },
        onMutate: async (newUserData) => {
            await queryClient.cancelQueries({ queryKey: ["all-profiles"] });
            const previousProfiles = queryClient.getQueryData<UserProfile[]>(["all-profiles"]);
            if (previousProfiles) {
                queryClient.setQueryData<UserProfile[]>(["all-profiles"], (old) =>
                    old?.map((profile) =>
                        profile.id === newUserData.id
                            ? { ...profile, ...newUserData }
                            : profile
                    )
                );
            }
            return { previousProfiles };
        },
        onError: (err, newUserData, context) => {
            if (context?.previousProfiles) {
                queryClient.setQueryData(["all-profiles"], context.previousProfiles);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["all-profiles"] });
            queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        },
    });

    return { ...query, updateProfile };
};

// ==========================================
// Vargani Slips — Performance Optimized
// ==========================================

// Generate slip number using timestamp + random — ZERO network calls
const generateSlipNumberFast = (): string => {
    const year = new Date().getFullYear();
    const ts = Date.now().toString(36).slice(-4).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 4).toUpperCase();
    return `SGP-${year}-${ts}${rand}`;
};

export const useVarganiSlips = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["vargani-slips"],
        staleTime: 60_000,          // 1 min — reduce refetch frequency
        gcTime: 10 * 60 * 1000,     // 10 min cache
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        queryFn: async () => {
            const { data, error } = await supabase.from('vargani_slips').select('*').order('created_at', { ascending: false });

            if (error) {
                if (error.code === '42P01') return [];
                throw error;
            }
            return data as VarganiSlip[];
        },
    });

    const addSlip = useMutation({
        mutationFn: async (newSlip: {
            name: string;
            shop_name: string;
            amount: number;
            location: string;
            address: string;
            mobile: string;
            status: 'paid' | 'pending';
            tentative_date?: string | null;
            payment_mode?: 'cash' | 'online' | null;
        }) => {
            // Parallel: get user name + generate slip number simultaneously
            const [{ userId, userName }, slipNumber] = await Promise.all([
                getCachedUserName(),
                Promise.resolve(generateSlipNumberFast())
            ]);

            const insertData: any = {
                name: newSlip.name,
                shop_name: newSlip.shop_name,
                amount: newSlip.amount,
                location: newSlip.location,
                address: newSlip.address,
                mobile: newSlip.mobile,
                status: newSlip.status,
                slip_number: slipNumber,
                created_by_user_id: userId,
                created_by_name: userName,
                payment_mode: newSlip.payment_mode || 'cash'
            };

            if (newSlip.status === 'paid') {
                insertData.confirmed_by_user_id = userId;
                insertData.confirmed_by_name = userName;
                insertData.confirmed_at = new Date().toISOString();
            }

            if (newSlip.tentative_date) {
                insertData.tentative_date = newSlip.tentative_date;
            }

            const { data, error } = await supabase
                .from('vargani_slips')
                .insert([insertData])
                .select()
                .single();

            if (error) throw error;
            createLog("Vargani Slip Created", `Slip ${slipNumber} for ${newSlip.name} - ₹${newSlip.amount} (${newSlip.status})`);
            return data as VarganiSlip;
        },
        // Optimistic Update: Add to list immediately
        onMutate: async (newSlip) => {
            await queryClient.cancelQueries({ queryKey: ["vargani-slips"] });
            const previous = queryClient.getQueryData<VarganiSlip[]>(["vargani-slips"]);
            const optimistic: VarganiSlip = {
                id: `temp-${Date.now()}`,
                name: newSlip.name,
                shop_name: newSlip.shop_name,
                amount: newSlip.amount,
                location: newSlip.location,
                address: newSlip.address || '',
                mobile: newSlip.mobile,
                status: newSlip.status,
                slip_number: generateSlipNumberFast(),
                created_at: new Date().toISOString(),
                created_by_user_id: _cachedUser?.userId || '',
                created_by_name: _cachedUser?.userName || 'Admin',
                payment_mode: newSlip.payment_mode || 'cash',
                tentative_date: newSlip.tentative_date || null,
                confirmed_at: newSlip.status === 'paid' ? new Date().toISOString() : null,
                confirmed_by_user_id: newSlip.status === 'paid' ? (_cachedUser?.userId || '') : null,
                confirmed_by_name: newSlip.status === 'paid' ? (_cachedUser?.userName || 'Admin') : null,
            } as VarganiSlip;
            queryClient.setQueryData<VarganiSlip[]>(["vargani-slips"], (old) => [optimistic, ...(old || [])]);
            return { previous };
        },
        onError: (err, newSlip, context) => {
            if (context?.previous) queryClient.setQueryData(["vargani-slips"], context.previous);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["vargani-slips"] }),
    });

    const updateSlip = useMutation({
        mutationFn: async (update: {
            id: string;
            name?: string;
            shop_name?: string;
            amount?: number;
            location?: string;
            address?: string;
            mobile?: string;
            status?: 'paid' | 'pending';
            tentative_date?: string | null;
            payment_mode?: 'cash' | 'online' | null;
        }) => {
            const { userId, userName } = await getCachedUserName();

            const updateData: any = {};
            if (update.name !== undefined) updateData.name = update.name;
            if (update.shop_name !== undefined) updateData.shop_name = update.shop_name;
            if (update.amount !== undefined) updateData.amount = update.amount;
            if (update.location !== undefined) updateData.location = update.location;
            if (update.address !== undefined) updateData.address = update.address;
            if (update.mobile !== undefined) updateData.mobile = update.mobile;
            if (update.tentative_date !== undefined) updateData.tentative_date = update.tentative_date;
            if (update.payment_mode !== undefined) updateData.payment_mode = update.payment_mode;

            if (update.status !== undefined) {
                updateData.status = update.status;
                if (update.status === 'paid') {
                    updateData.confirmed_by_user_id = userId;
                    updateData.confirmed_by_name = userName;
                    updateData.confirmed_at = new Date().toISOString();
                } else if (update.status === 'pending') {
                    updateData.confirmed_by_user_id = null;
                    updateData.confirmed_by_name = null;
                    updateData.confirmed_at = null;
                }
            }

            const { data, error } = await supabase
                .from('vargani_slips')
                .update(updateData)
                .eq('id', update.id)
                .select()
                .single();

            if (error) throw error;
            createLog("Vargani Slip Updated", `Updated slip ${data.slip_number} - ${data.name} - ₹${data.amount} (${data.status})`);
            return data as VarganiSlip;
        },
        // Optimistic Update
        onMutate: async (update) => {
            await queryClient.cancelQueries({ queryKey: ["vargani-slips"] });
            const previous = queryClient.getQueryData<VarganiSlip[]>(["vargani-slips"]);
            queryClient.setQueryData<VarganiSlip[]>(["vargani-slips"], (old) =>
                old?.map(s => s.id === update.id ? { ...s, ...update } as VarganiSlip : s)
            );
            return { previous };
        },
        onError: (err, update, context) => {
            if (context?.previous) queryClient.setQueryData(["vargani-slips"], context.previous);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["vargani-slips"] }),
    });

    const confirmPayment = useMutation({
        mutationFn: async ({ id, payment_mode }: { id: string; payment_mode?: 'cash' | 'online' }) => {
            const { userId, userName } = await getCachedUserName();

            const updateData: any = {
                status: 'paid',
                confirmed_by_user_id: userId,
                confirmed_by_name: userName,
                confirmed_at: new Date().toISOString()
            };

            if (payment_mode) {
                updateData.payment_mode = payment_mode;
            }

            const { data, error } = await supabase
                .from('vargani_slips')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            createLog("Payment Confirmed", `Confirmed payment for slip ${data.slip_number} - ${data.name} - ₹${data.amount}`);
            return data as VarganiSlip;
        },
        // Optimistic: mark as paid instantly
        onMutate: async ({ id }) => {
            await queryClient.cancelQueries({ queryKey: ["vargani-slips"] });
            const previous = queryClient.getQueryData<VarganiSlip[]>(["vargani-slips"]);
            queryClient.setQueryData<VarganiSlip[]>(["vargani-slips"], (old) =>
                old?.map(s => s.id === id ? {
                    ...s,
                    status: 'paid' as const,
                    confirmed_at: new Date().toISOString(),
                    confirmed_by_name: _cachedUser?.userName || 'Admin'
                } : s)
            );
            return { previous };
        },
        onError: (err, vars, context) => {
            if (context?.previous) queryClient.setQueryData(["vargani-slips"], context.previous);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["vargani-slips"] }),
    });

    const deleteSlip = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('vargani_slips').delete().eq('id', id);
            if (error) throw error;
            createLog("Vargani Slip Deleted", `Deleted slip ID: ${id}`);
        },
        // Optimistic: remove from list instantly
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["vargani-slips"] });
            const previous = queryClient.getQueryData<VarganiSlip[]>(["vargani-slips"]);
            queryClient.setQueryData<VarganiSlip[]>(["vargani-slips"], (old) => old?.filter(s => s.id !== id));
            return { previous };
        },
        onError: (err, id, context) => {
            if (context?.previous) queryClient.setQueryData(["vargani-slips"], context.previous);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["vargani-slips"] }),
    });

    return { ...query, addSlip, updateSlip, confirmPayment, deleteSlip };
};
