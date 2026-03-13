import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Shield, UserCog, X, Check, Search } from "lucide-react";
import { useAllProfiles } from "@/lib/slip-api";
import { UserProfile } from "@/types/admin";
import { toast } from "sonner";

const UserManagementTab = () => {
    const { data: profiles, isLoading, updateProfile } = useAllProfiles();
    const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
    const [editName, setEditName] = useState("");
    const [editRole, setEditRole] = useState<'admin' | 'sub_admin'>('sub_admin');
    const [search, setSearch] = useState("");

    const filteredProfiles = profiles?.filter(p =>
        p.email.toLowerCase().includes(search.toLowerCase()) ||
        (p.display_name || '').toLowerCase().includes(search.toLowerCase())
    ) || [];

    const adminCount = profiles?.filter(p => p.role === 'admin').length || 0;
    const subAdminCount = profiles?.filter(p => p.role === 'sub_admin').length || 0;

    const openEdit = (profile: UserProfile) => {
        setEditingUser(profile);
        setEditName(profile.display_name || '');
        setEditRole(profile.role);
    };

    const handleSave = async () => {
        if (!editingUser) return;
        try {
            await updateProfile.mutateAsync({
                id: editingUser.id,
                role: editRole,
                display_name: editName
            });
            toast.success(`${editName || editingUser.email} updated successfully!`);
            setEditingUser(null);
        } catch (err: any) {
            toast.error(err.message || "Failed to update user");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-[#1D4ED8]/20 border-t-[#1D4ED8] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-display font-black text-[#0F172A]">User Management</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-[#F5F5F0] border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 w-64"
                        placeholder="Search users..."
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-2">Total Users</div>
                    <div className="text-3xl font-black text-[#0F172A]">{profiles?.length || 0}</div>
                </div>
                <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#1D4ED8] mb-2">Admins</div>
                    <div className="text-3xl font-black text-[#1D4ED8]">{adminCount}</div>
                </div>
                <div className="p-6 bg-white border border-blue-100 rounded-2xl shadow-sm bg-blue-50/30">
                    <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">Sub-Admins</div>
                    <div className="text-3xl font-black text-blue-600">{subAdminCount}</div>
                </div>
            </div>

            {/* User List */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="min-w-[600px]">
                        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-[#F5F5F0] text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60">
                            <div className="col-span-4">User</div>
                            <div className="col-span-3">Email</div>
                            <div className="col-span-2">Role</div>
                            <div className="col-span-3 text-right">Actions</div>
                        </div>
                    </div>
                </div>

                {filteredProfiles.length === 0 ? (
                    <div className="p-10 text-center text-[#0F172A]/60 text-sm">No users found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <div className="min-w-[600px]">
                            {filteredProfiles.map((profile) => (
                                <div key={profile.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-50 items-center hover:bg-[#FDFBF7] transition-colors">
                                    <div className="col-span-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm ${profile.role === 'admin' ? 'bg-[#1D4ED8]' : 'bg-blue-500'}`}>
                                                {(profile.display_name || profile.email)[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-[#0F172A]">{profile.display_name || 'Unnamed'}</div>
                                                <div className="text-[10px] text-[#0F172A]/50">
                                                    Joined {new Date(profile.created_at).toLocaleDateString('en-IN')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-3 text-sm text-[#0F172A]/70 font-mono truncate">{profile.email}</div>
                                    <div className="col-span-2">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${profile.role === 'admin'
                                            ? 'bg-[#1D4ED8]/10 text-[#1D4ED8]'
                                            : 'bg-blue-100 text-blue-600'
                                            }`}>
                                            {profile.role === 'admin' ? '🛡️ Admin' : '👤 Sub-Admin'}
                                        </span>
                                    </div>
                                    <div className="col-span-3 flex justify-end">
                                        <button
                                            onClick={() => openEdit(profile)}
                                            className="flex items-center gap-2 px-4 py-2 bg-[#F5F5F0] hover:bg-[#1D4ED8]/10 text-[#0F172A]/70 hover:text-[#1D4ED8] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-gray-200 hover:border-[#1D4ED8]/20"
                                        >
                                            <UserCog size={14} />
                                            Edit Role
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingUser && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                            className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-display font-black text-[#0F172A]">Edit User</h3>
                                <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <X size={18} className="text-[#0F172A]/60" />
                                </button>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1">Email</label>
                                    <div className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm text-[#0F172A]/50 font-mono">
                                        {editingUser.email}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1">Display Name</label>
                                    <input
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
                                        placeholder="Enter display name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-3">Role</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => setEditRole('admin')}
                                            className={`p-4 rounded-xl border-2 text-center transition-all ${editRole === 'admin'
                                                ? 'border-[#1D4ED8] bg-[#1D4ED8]/5'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <Shield size={24} className={`mx-auto mb-2 ${editRole === 'admin' ? 'text-[#1D4ED8]' : 'text-gray-400'}`} />
                                            <div className={`text-xs font-black uppercase tracking-wider ${editRole === 'admin' ? 'text-[#1D4ED8]' : 'text-gray-500'}`}>Admin</div>
                                            <div className="text-[9px] text-[#0F172A]/40 mt-1">Full access</div>
                                        </button>
                                        <button
                                            onClick={() => setEditRole('sub_admin')}
                                            className={`p-4 rounded-xl border-2 text-center transition-all ${editRole === 'sub_admin'
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <Users size={24} className={`mx-auto mb-2 ${editRole === 'sub_admin' ? 'text-blue-500' : 'text-gray-400'}`} />
                                            <div className={`text-xs font-black uppercase tracking-wider ${editRole === 'sub_admin' ? 'text-blue-600' : 'text-gray-500'}`}>Sub-Admin</div>
                                            <div className="text-[9px] text-[#0F172A]/40 mt-1">Vargani slips only</div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={() => setEditingUser(null)}
                                    className="flex-1 py-3 text-[#0F172A]/70 font-bold text-sm bg-gray-100 rounded-xl hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={updateProfile.isPending}
                                    className="flex-1 py-3 text-white font-bold text-sm bg-[#1D4ED8] rounded-xl hover:bg-[#B94A15] disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {updateProfile.isPending ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Check size={16} /> Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserManagementTab;
