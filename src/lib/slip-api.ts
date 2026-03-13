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
            await createLog("User Role Changed", `Changed user role to ${role}${display_name ? ` (Name: ${display_name})` : ''}`);
        },
        onSuccess: () => {
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
            await createLog("Vargani Slip Created", `Slip ${slipNumber} for ${newSlip.name} - ₹${newSlip.amount} (${newSlip.status})`);
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
            await createLog("Payment Confirmed", `Confirmed payment for slip ${data.slip_number} - ${data.name} - ₹${data.amount}`);
            return data as VarganiSlip;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vargani-slips"] }),
    });

    const deleteSlip = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('vargani_slips').delete().eq('id', id);
            if (error) throw error;
            await createLog("Vargani Slip Deleted", `Deleted slip ID: ${id}`);
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vargani-slips"] }),
    });

    return { ...query, addSlip, confirmPayment, deleteSlip };
};
