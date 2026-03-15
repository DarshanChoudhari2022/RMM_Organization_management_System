import { UserProfile, VarganiSlip } from "@/types/admin";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase as supabaseClient } from "@/lib/supabase";
import { createLog } from "./admin-api";

const supabase = supabaseClient as any;

// ==========================================
// User Profiles & Role Management
// ==========================================

export const useUserProfile = () => {
    return useQuery({
        queryKey: ["user-profile"],
        queryFn: async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) return null;

            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('auth_user_id', session.user.id)
                .single();

            // No profile found → auto-create
            if (error && error.code === 'PGRST116') {
                // Check if ANY admin exists. If not, first user becomes admin.
                const { count } = await supabase
                    .from('user_profiles')
                    .select('*', { count: 'exact', head: true });

                const role = count === 0 ? 'admin' : 'sub_admin';

                const { data: newProfile, error: createError } = await supabase
                    .from('user_profiles')
                    .insert([{
                        auth_user_id: session.user.id,
                        email: session.user.email,
                        display_name: session.user.email?.split('@')[0] || 'User',
                        role: role
                    }])
                    .select()
                    .single();

                if (createError) throw createError;
                return newProfile as UserProfile;
            }

            if (error) throw error;
            return data as UserProfile;
        },
    });
};

export const useAllProfiles = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["all-profiles"],
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
            createLog("User Role Changed", `Changed user role to ${role}${display_name ? ` (Name: ${display_name})` : ''}`);
        },
        // Optimistic Update
        onMutate: async (newUserData) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ["all-profiles"] });

            // Snapshot the previous value
            const previousProfiles = queryClient.getQueryData<UserProfile[]>(["all-profiles"]);

            // Optimistically update to the new value
            if (previousProfiles) {
                queryClient.setQueryData<UserProfile[]>(["all-profiles"], (old) =>
                    old?.map((profile) =>
                        profile.id === newUserData.id
                            ? { ...profile, ...newUserData }
                            : profile
                    )
                );
            }

            // Return a context object with the snapshotted value
            return { previousProfiles };
        },
        // If the mutation fails, use the context returned from onMutate to roll back
        onError: (err, newUserData, context) => {
            if (context?.previousProfiles) {
                queryClient.setQueryData(["all-profiles"], context.previousProfiles);
            }
        },
        // Always refetch after error or success to ensure we're in sync with the server
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["all-profiles"] });
            queryClient.invalidateQueries({ queryKey: ["user-profile"] });
        },
    });

    return { ...query, updateProfile };
};

// ==========================================
// Vargani Slips
// ==========================================

// Helper: Get current user's display name from profile
const getCurrentUserName = async (): Promise<{ userId: string | undefined; userName: string }> => {
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

    return { userId: user?.id, userName };
};

// Helper: Generate slip number SGP-YYYY-XXXX
const generateSlipNumber = async (): Promise<string> => {
    const year = new Date().getFullYear();
    const { count } = await supabase
        .from('vargani_slips')
        .select('*', { count: 'exact', head: true });
    const num = ((count || 0) + 1).toString().padStart(4, '0');
    return `SGP-${year}-${num}`;
};

export const useVarganiSlips = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["vargani-slips"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('vargani_slips')
                .select('*')
                .order('created_at', { ascending: false });

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
        }) => {
            const { userId, userName } = await getCurrentUserName();
            const slipNumber = await generateSlipNumber();

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
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vargani-slips"] }),
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
        }) => {
            const { userId, userName } = await getCurrentUserName();

            // Build update object with only provided fields
            const updateData: any = {};
            if (update.name !== undefined) updateData.name = update.name;
            if (update.shop_name !== undefined) updateData.shop_name = update.shop_name;
            if (update.amount !== undefined) updateData.amount = update.amount;
            if (update.location !== undefined) updateData.location = update.location;
            if (update.address !== undefined) updateData.address = update.address;
            if (update.mobile !== undefined) updateData.mobile = update.mobile;
            if (update.tentative_date !== undefined) updateData.tentative_date = update.tentative_date;

            // Handle status change
            if (update.status !== undefined) {
                updateData.status = update.status;
                if (update.status === 'paid') {
                    updateData.confirmed_by_user_id = userId;
                    updateData.confirmed_by_name = userName;
                    updateData.confirmed_at = new Date().toISOString();
                } else if (update.status === 'pending') {
                    // Reverting to pending clears confirmation
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
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vargani-slips"] }),
    });

    const confirmPayment = useMutation({
        mutationFn: async (id: string) => {
            const { userId, userName } = await getCurrentUserName();

            const { data, error } = await supabase
                .from('vargani_slips')
                .update({
                    status: 'paid',
                    confirmed_by_user_id: userId,
                    confirmed_by_name: userName,
                    confirmed_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            createLog("Payment Confirmed", `Confirmed payment for slip ${data.slip_number} - ${data.name} - ₹${data.amount}`);
            return data as VarganiSlip;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vargani-slips"] }),
    });

    const deleteSlip = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('vargani_slips').delete().eq('id', id);
            if (error) throw error;
            createLog("Vargani Slip Deleted", `Deleted slip ID: ${id}`);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vargani-slips"] }),
    });

    return { ...query, addSlip, updateSlip, confirmPayment, deleteSlip };
};
