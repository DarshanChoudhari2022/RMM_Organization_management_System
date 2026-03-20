import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Trash2, Search, CheckCircle2, XCircle, Calendar,
    Download, Share2, Phone, MapPin, Store, User, IndianRupee,
    Clock, Filter, X, AlertCircle, Loader2, Edit3, Home
} from "lucide-react";
import html2canvas from "html2canvas";
import { useVarganiSlips, useUserProfile } from "@/lib/slip-api";
import { VarganiSlip } from "@/types/admin";
import { toast } from "sonner";
import SlipPreviewContent from "./SlipPreview";

// ============================================
// Main Vargani Slip Tab Component
// ============================================

const VarganiSlipTab = ({ year }: { year?: number }) => {
    const { data: slips, isLoading, addSlip, updateSlip, confirmPayment, deleteSlip } = useVarganiSlips();
    const { data: userProfile } = useUserProfile();
    const isSubAdmin = userProfile?.role === 'sub_admin';

    // State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingSlip, setEditingSlip] = useState<VarganiSlip | null>(null);
    const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');
    const [search, setSearch] = useState("");
    const [activeSlip, setActiveSlip] = useState<VarganiSlip | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [confirmingId, setConfirmingId] = useState<string | null>(null);
    const [groupBy, setGroupBy] = useState<'none' | 'location' | 'date' | 'admin'>('none');

    // Form State with Persistence
    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem('vargani_form_cache');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Error parsing form cache:", e);
            }
        }
        return {
            name: '',
            shop_name: '',
            amount: '',
            location: '',
            address: '',
            mobile: '',
            paymentStatus: 'paid' as 'paid' | 'pending',
            tentative_date: '',
            paymentMode: 'cash' as 'cash' | 'online'
        };
    });

    // Save form to cache whenever it changes
    useEffect(() => {
        localStorage.setItem('vargani_form_cache', JSON.stringify(formData));
    }, [formData]);

    // Edit Form State
    const [editData, setEditData] = useState({
        name: '',
        shop_name: '',
        amount: '',
        location: '',
        address: '',
        mobile: '',
        status: 'paid' as 'paid' | 'pending',
        tentative_date: '',
        payment_mode: 'cash' as 'cash' | 'online'
    });

    const slipRef = useRef<HTMLDivElement>(null);

    // Year-filtered slips (base filter)
    const yearFilteredSlips = useMemo(() => {
        let result = slips ? [...slips] : [];
        if (year) {
            result = result.filter(s => {
                const slipYear = new Date(s.created_at).getFullYear();
                return slipYear === year;
            });
        }
        return result;
    }, [slips, year]);

    // Filtered + searched slips
    const filteredSlips = useMemo(() => {
        let result = [...yearFilteredSlips];
        if (filter !== 'all') result = result.filter(s => s.status === filter);
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(s => {
                const dateStr = s.created_at ? new Date(s.created_at).toLocaleDateString('en-IN') : '';
                return s.name.toLowerCase().includes(q) ||
                    s.shop_name.toLowerCase().includes(q) ||
                    s.mobile.includes(q) ||
                    (s.slip_number || '').toLowerCase().includes(q) ||
                    (s.location || '').toLowerCase().includes(q) ||
                    (s.created_by_name || '').toLowerCase().includes(q) ||
                    dateStr.includes(q);
            });
        }

        // Sort date-wise (newest first)
        result.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

        return result;
    }, [yearFilteredSlips, filter, search]);

    // Stats
    const stats = useMemo(() => {
        const all = yearFilteredSlips;
        const paid = all.filter(s => s.status === 'paid');
        const pending = all.filter(s => s.status === 'pending');
        const totalCollected = paid.reduce((sum, s) => sum + Number(s.amount), 0);
        const totalPending = pending.reduce((sum, s) => sum + Number(s.amount), 0);
        
        const locMap: Record<string, number> = {};
        pending.forEach(s => {
            const loc = s.location?.trim() || 'Other';
            locMap[loc] = (locMap[loc] || 0) + Number(s.amount);
        });
        const locationPendingArray = Object.entries(locMap)
            .map(([location, amount]) => ({ location, amount }))
            .sort((a, b) => b.amount - a.amount);

        const adminMap: Record<string, number> = {};
        all.forEach(s => {
            const admin = s.created_by_name?.trim() || 'Main Admin';
            adminMap[admin] = (adminMap[admin] || 0) + 1;
        });
        const adminStatsArray = Object.entries(adminMap)
            .map(([admin, count]) => ({ admin, count }))
            .sort((a, b) => b.count - a.count);

        return { total: all.length, paidCount: paid.length, pendingCount: pending.length, totalCollected, totalPending, locationPendingArray, adminStatsArray };
    }, [yearFilteredSlips]);

    // Reset form and clear cache
    const resetForm = () => {
        setFormData({ name: '', shop_name: '', amount: '', location: '', address: '', mobile: '', paymentStatus: 'paid', tentative_date: '', paymentMode: 'cash' });
        localStorage.removeItem('vargani_form_cache');
    };

    // Validate WhatsApp number
    const isValidMobile = (num: any) => {
        const cleaned = (num || "").toString().replace(/\s/g, '');
        return cleaned === "" || /^[6-9]\d{9}$/.test(cleaned);
    };

    // Open edit modal
    const openEditModal = (slip: VarganiSlip) => {
        setEditingSlip(slip);
        setEditData({
            name: slip.name,
            shop_name: slip.shop_name,
            amount: String(slip.amount),
            location: slip.location,
            address: slip.address || '',
            mobile: slip.mobile,
            status: slip.status,
            tentative_date: slip.tentative_date || '',
            payment_mode: slip.payment_mode || 'cash'
        });
        setIsEditOpen(true);
    };

    // Handle edit submit
    const handleEditSubmit = async () => {
        if (!editingSlip) return;
        if (!editData.name.trim()) return toast.error("Name is required");
        if (!editData.amount || parseFloat(editData.amount) <= 0) return toast.error("Valid amount required");
        if (!isValidMobile(editData.mobile)) return toast.error("Valid 10-digit mobile required");
        if (editData.status === 'pending' && !editData.tentative_date) return toast.error("Tentative date required for pending");

        try {
            await updateSlip.mutateAsync({
                id: editingSlip.id,
                name: editData.name.trim(),
                shop_name: editData.shop_name.trim(),
                amount: parseFloat(editData.amount),
                location: editData.location.trim(),
                address: editData.address.trim(),
                mobile: (editData.mobile || "").toString().replace(/\s/g, ''),
                status: editData.status,
                tentative_date: editData.status === 'pending' ? editData.tentative_date : null,
                payment_mode: editData.payment_mode
            });
            toast.success("Slip updated successfully!");
            setIsEditOpen(false);
            setEditingSlip(null);
        } catch (err: any) {
            toast.error(err.message || "Error updating slip");
        }
    };

    // Handle form submit
    const handleSubmit = async () => {
        if (!formData.name.trim()) return toast.error("Please enter name");
        if (!formData.shop_name.trim()) return toast.error("Please enter shop name");
        if (!formData.amount || parseFloat(formData.amount) <= 0) return toast.error("Please enter valid amount");
        if (!formData.location.trim()) return toast.error("Please enter location");
        if (!isValidMobile(formData.mobile)) return toast.error("Please enter valid 10-digit WhatsApp number");
        if (formData.paymentStatus === 'pending' && !formData.tentative_date) return toast.error("Please enter tentative date");

        try {
            const result = await addSlip.mutateAsync({
                name: formData.name.trim(),
                shop_name: formData.shop_name.trim(),
                amount: parseFloat(formData.amount),
                location: formData.location.trim(),
                address: formData.address.trim(),
                mobile: (formData.mobile || "").toString().replace(/\s/g, ''),
                status: formData.paymentStatus,
                tentative_date: formData.paymentStatus === 'pending' ? formData.tentative_date : null,
                payment_mode: formData.paymentMode
            });

            toast.success(formData.paymentStatus === 'paid'
                ? `Slip generated for ${formData.name}`
                : `Pending entry saved for ${formData.name}`
            );

            if (formData.paymentStatus === 'paid' && result) {
                setTimeout(() => handleDownloadSlip(result), 500);
            }

            resetForm();
            setIsFormOpen(false);
        } catch (err: any) {
            toast.error(err.message || "Error saving slip");
        }
    };

    // Confirm pending payment
    const handleConfirmPayment = async (id: string) => {
        setConfirmingId(id);
        try {
            const result = await confirmPayment.mutateAsync({ id, payment_mode: 'cash' }); // Default to cash on quick confirm
            toast.success(`Payment confirmed for ${result.name}!`);
            setTimeout(() => handleDownloadSlip(result), 500);
        } catch (err: any) {
            toast.error(err.message || "Error confirming payment");
        } finally {
            setConfirmingId(null);
        }
    };

    // Generate and download slip image
    const handleDownloadSlip = useCallback(async (slip: VarganiSlip) => {
        setActiveSlip(slip);
        setIsGenerating(true);
        await new Promise(r => setTimeout(r, 300));

        try {
            const el = document.getElementById('slip-preview-capture');
            if (!el) throw new Error("Slip preview not found");

            const canvas = await html2canvas(el, {
                scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false
            });

            const link = document.createElement('a');
            link.download = `Vargani_${slip.slip_number || 'slip'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast.success("Slip downloaded!");
        } catch (err) {
            console.error("Slip generation error:", err);
            toast.error("Slip download failed. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    }, []);

    // Share slip via WhatsApp — opens chat IMMEDIATELY, then downloads slip in background
    const handleShareSlip = useCallback(async (slip: VarganiSlip) => {
        if (slip.status !== 'paid') {
            toast.error("Slip can only be shared after payment is confirmed!");
            return;
        }

        // 1. Sanitize mobile number
        const mobile = (slip.mobile || "").toString().replace(/\D/g, '').slice(-10);

        if (!mobile) {
            toast.error("No valid WhatsApp number found for this donor.");
            return;
        }

        // 2. Build WhatsApp message
        const msg = `*राहुल मित्र मंडल - वर्गणी पावती*\n\nName: ${slip.name}\nShop: ${slip.shop_name}\nAmount: ₹${Number(slip.amount).toLocaleString('en-IN')}\nSlip No: ${slip.slip_number}\nDate: ${slip.confirmed_at ? new Date(slip.confirmed_at).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')}\n\nConfirmed by: ${slip.confirmed_by_name || 'Admin'}\n\nदेणगी रोख मिळाली. आभारी आहोत! 🙏\n\n_कृपया पावती (receipt) खाली attach केली आहे._`;

        // 3. OPEN WHATSAPP IMMEDIATELY — this MUST happen synchronously inside the click handler
        //    Browsers block window.open if it's called after an async operation (like html2canvas).
        //    wa.me works universally: WhatsApp app on mobile, WhatsApp Web on desktop.
        //    No need to save the contact number.
        const waUrl = `https://wa.me/91${mobile}?text=${encodeURIComponent(msg)}`;
        window.open(waUrl, '_blank');

        // 4. NOW generate the slip image in the background (download + clipboard)
        setActiveSlip(slip);
        setIsGenerating(true);

        toast.info("Opening WhatsApp... Generating slip in background...", { duration: 2000 });

        try {
            // Small delay to let React render the off-screen slip preview
            await new Promise(r => setTimeout(r, 150));

            const el = document.getElementById('slip-preview-capture');
            if (!el) throw new Error("Slip preview element not found");

            const canvas = await html2canvas(el, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                allowTaint: true,
                imageTimeout: 0,
            });

            const blob = await new Promise<Blob | null>(resolve =>
                canvas.toBlob(resolve, 'image/png', 0.92)
            );

            if (blob) {
                // Auto-download the slip
                const objectUrl = URL.createObjectURL(blob);
                const downloadLink = document.createElement('a');
                downloadLink.download = `Vargani_${slip.slip_number || 'slip'}.png`;
                downloadLink.href = objectUrl;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);

                // Copy slip image to clipboard (for paste in WhatsApp chat)
                try {
                    if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
                        const clipboardItem = new ClipboardItem({ 'image/png': blob });
                        await navigator.clipboard.write([clipboardItem]);
                    }
                } catch (clipErr) {
                    console.warn("Clipboard copy not supported:", clipErr);
                }

                toast.success("✅ Slip downloaded & copied! Paste it in the WhatsApp chat (Ctrl+V).", {
                    duration: 5000,
                });
            } else {
                throw new Error("Failed to generate slip image blob");
            }
        } catch (err) {
            console.error("Slip generation error:", err);
            toast.error("Slip download failed. WhatsApp chat was opened — try downloading the slip separately.");
        } finally {
            setIsGenerating(false);
        }
    }, []);

    const groupedSlips = useMemo(() => {
        if (groupBy === 'none') return [['All Slips', filteredSlips]] as const;
        const groups: Record<string, typeof filteredSlips> = {};
        filteredSlips.forEach(s => {
            let key = 'Other';
            if (groupBy === 'location') key = s.location?.trim() || 'Other';
            else if (groupBy === 'date') key = s.created_at ? new Date(s.created_at).toLocaleDateString('en-IN') : 'Unknown Date';
            else if (groupBy === 'admin') key = s.created_by_name?.trim() || 'Main Admin';
            
            if (!groups[key]) groups[key] = [];
            groups[key].push(s);
        });
        return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
    }, [filteredSlips, groupBy]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-[#1D4ED8]/20 border-t-[#1D4ED8] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Off-screen Slip Preview for html2canvas */}
            {activeSlip && (
                <div style={{ position: 'fixed', left: '-9999px', top: '0', zIndex: -1 }}>
                    <div id="slip-preview-capture">
                        <SlipPreviewContent slip={activeSlip} />
                    </div>
                </div>
            )}

            {/* Loading Overlay */}
            <AnimatePresence>
                {isGenerating && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                            className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4"
                        >
                            <Loader2 size={32} className="text-[#1D4ED8] animate-spin" />
                            <div className="text-sm font-black uppercase tracking-widest text-[#0F172A]">Generating Slip...</div>
                            <div className="text-[10px] text-[#0F172A]/50">Please wait</div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h2 className="text-xl font-display font-black text-[#0F172A]">Vargani Slips</h2>
                    <p className="text-[10px] font-bold text-[#0F172A]/50 uppercase tracking-widest mt-1">Generate & manage vargani receipts</p>
                </div>
                <button
                    onClick={() => { setIsFormOpen(true); }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1D4ED8] text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#B94A15] transition-all shadow-lg shadow-[#1D4ED8]/20"
                >
                    <Plus size={16} /> {formData.name || formData.shop_name || formData.amount ? 'Resume Vargani Entry' : 'New Vargani Entry'}
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="p-4 md:p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1 md:mb-2">Total Entries</div>
                    <div className="text-xl md:text-3xl font-black text-[#0F172A]">{stats.total}</div>
                </div>
                <div className="p-4 md:p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-green-600 mb-1 md:mb-2">Collected</div>
                    <div className="text-xl md:text-3xl font-black text-green-600">{'\u20B9'}{stats.totalCollected.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-green-600/60 mt-1 hidden md:block">{stats.paidCount} Paid</div>
                </div>
                <div className="p-4 md:p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-red-500 mb-1 md:mb-2">Pending</div>
                    <div className="text-xl md:text-3xl font-black text-red-500">{'\u20B9'}{stats.totalPending.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-red-500/60 mt-1 hidden md:block">{stats.pendingCount} Pending</div>
                </div>
                <div className="p-4 md:p-6 bg-white border border-green-100 rounded-2xl shadow-sm bg-green-50/30">
                    <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-green-700 mb-1 md:mb-2">Paid Slips</div>
                    <div className="text-xl md:text-3xl font-black text-green-700">{stats.paidCount}</div>
                </div>
                <div className="p-4 md:p-6 bg-white border border-orange-100 rounded-2xl shadow-sm bg-orange-50/30">
                    <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#1D4ED8] mb-1 md:mb-2">Pending Slips</div>
                    <div className="text-xl md:text-3xl font-black text-[#1D4ED8]">{stats.pendingCount}</div>
                </div>
            </div>

            {/* Location & Admin Wise Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stats.locationPendingArray.length > 0 && (
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 shadow-sm">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-800 mb-3 flex items-center gap-2">
                            <MapPin size={14} /> Pending Location-Wise ({'\u20B9'}{stats.totalPending.toLocaleString('en-IN')})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {stats.locationPendingArray.map((loc) => (
                                <div key={loc.location} className="bg-white px-3 py-2 rounded-xl border border-amber-200 flex items-center gap-2 shadow-sm">
                                    <span className="font-bold text-[#0F172A] text-xs">{loc.location}</span>
                                    <span className="text-amber-600 font-black text-xs bg-amber-100 px-2 py-0.5 rounded-full">{'\u20B9'}{loc.amount.toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {stats.adminStatsArray.length > 0 && (
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 shadow-sm">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-800 mb-3 flex items-center gap-2">
                            <User size={14} /> Slips Generated By Admin
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {stats.adminStatsArray.map((admin) => (
                                <button 
                                    key={admin.admin} 
                                    onClick={() => setSearch(admin.admin === 'Main Admin' ? '' : admin.admin)}
                                    className="bg-white px-3 py-2 rounded-xl border border-blue-200 flex items-center gap-2 shadow-sm hover:bg-blue-50 transition-colors"
                                >
                                    <span className="font-bold text-[#0F172A] text-xs">{admin.admin}</span>
                                    <span className="text-blue-600 font-black text-xs bg-blue-100 px-2 py-0.5 rounded-full">{admin.count} Slips</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Filter + Search */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    {(['all', 'paid', 'pending'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${filter === f
                                ? 'bg-[#1D4ED8] text-white'
                                : 'text-[#0F172A]/60 hover:text-[#0F172A] hover:bg-[#F5F5F0]'
                                }`}
                        >
                            {f === 'all' ? `All (${stats.total})` : f === 'paid' ? `Paid (${stats.paidCount})` : `Pending (${stats.pendingCount})`}
                        </button>
                    ))}
                </div>
                <div className="flex bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm items-center px-4 w-full sm:w-auto">
                    <Filter size={14} className="text-[#0F172A]/40 mr-2 shrink-0" />
                    <select
                        value={groupBy}
                        onChange={e => { setGroupBy(e.target.value as any); setFilter('all'); }}
                        className="w-full py-2.5 text-[10px] font-black uppercase tracking-widest text-[#0F172A]/80 bg-transparent outline-none cursor-pointer"
                    >
                        <option value="none">Group By: None</option>
                        <option value="location">Group: Location</option>
                        <option value="date">Group: Date</option>
                        <option value="admin">Group: Admin</option>
                    </select>
                </div>

                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 shadow-sm"
                        placeholder="Search by name, location, admin, date (DD/MM/YYYY)..."
                    />
                </div>
            </div>

            {/* Slips Table */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                {/* Desktop Header */}
                <div className="hidden md:block overflow-x-auto">
                    <div className="min-w-[900px]">
                        <div className="grid grid-cols-12 gap-3 p-4 border-b border-gray-100 bg-[#F5F5F0] text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60">
                            <div className="col-span-1">Slip #</div>
                            <div className="col-span-2">Name / Shop</div>
                            <div className="col-span-1">Amount</div>
                            <div className="col-span-2">Mobile</div>
                            <div className="col-span-1">Status</div>
                            <div className="col-span-2">Date / Info</div>
                            <div className="col-span-1">Mode</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>
                    </div>
                </div>

                {filteredSlips.length === 0 ? (
                    <div className="p-10 text-center">
                        <div className="text-4xl mb-3">📃</div>
                        <div className="text-[#0F172A]/60 text-sm font-bold">No slips found.</div>
                        <button
                            onClick={() => { resetForm(); setIsFormOpen(true); }}
                            className="mt-4 text-[#1D4ED8] font-bold text-sm hover:underline"
                        >
                            Create your first vargani entry
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <div className="min-w-[900px]">
                                {groupedSlips.map(([groupName, groupList]) => (
                                    <div key={groupName}>
                                        {groupBy !== 'none' && (
                                            <div className="bg-[#1D4ED8]/5 border-b border-gray-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#1D4ED8] flex justify-between items-center sticky left-0">
                                                <span>{groupName}</span>
                                                <span className="opacity-60">{groupList.length} Entries</span>
                                            </div>
                                        )}
                                        {groupList.map((slip) => (
                                    <div key={slip.id} className="grid grid-cols-12 gap-3 p-4 border-b border-gray-50 items-center hover:bg-[#FDFBF7] transition-colors">
                                        <div className="col-span-1">
                                            <span className="text-[11px] font-bold text-[#1D4ED8] font-mono">{slip.slip_number?.split('-').pop()}</span>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="font-bold text-[#0F172A] text-sm">{slip.name}</div>
                                            <div className="text-[10px] text-[#0F172A]/50 flex items-center gap-1">
                                                <Store size={10} /> {slip.shop_name}
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className="font-black text-[#0F172A] text-sm">{'\u20B9'}{Number(slip.amount).toLocaleString('en-IN')}</div>
                                        </div>
                                        <div className="col-span-2">
                                            {slip.mobile ? (
                                                <a href={`https://wa.me/91${slip.mobile}`} target="_blank" rel="noreferrer"
                                                    className="text-sm text-green-600 font-mono hover:underline flex items-center gap-1">
                                                    <Phone size={12} /> {slip.mobile}
                                                </a>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">No mobile</span>
                                            )}
                                        </div>
                                        <div className="col-span-1">
                                            {slip.status === 'paid' ? (
                                                <span className="px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-green-100 text-green-700 flex items-center gap-1 w-fit">
                                                    <CheckCircle2 size={12} /> Paid
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 flex items-center gap-1 w-fit">
                                                    <Clock size={12} /> Pending
                                                </span>
                                            )}
                                        </div>
                                        <div className="col-span-2">
                                            {slip.status === 'paid' ? (
                                                <div>
                                                    <div className="text-[10px] text-green-600 font-bold">{slip.confirmed_by_name}</div>
                                                    <div className="text-[9px] text-[#0F172A]/40">{slip.confirmed_at && new Date(slip.confirmed_at).toLocaleDateString('en-IN')}</div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="text-[10px] text-amber-600 font-bold flex items-center gap-1"><Calendar size={10} /> Tentative</div>
                                                    <div className="text-[11px] text-[#0F172A] font-bold">{slip.tentative_date ? new Date(slip.tentative_date).toLocaleDateString('en-IN') : 'Not set'}</div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-span-1">
                                            {slip.payment_mode && (
                                                <span className="text-[10px] font-bold text-[#1D4ED8] bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wider">
                                                    {slip.payment_mode}
                                                </span>
                                            )}
                                        </div>
                                        <div className="col-span-2 flex justify-end gap-2">
                                            <button onClick={() => openEditModal(slip)} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-all">
                                                <Edit3 size={12} /> Edit
                                            </button>
                                            {slip.status === 'pending' && (
                                                <button onClick={() => handleConfirmPayment(slip.id)} disabled={confirmingId === slip.id}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all disabled:opacity-50 shadow-sm">
                                                    {confirmingId === slip.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                                                    Confirm
                                                </button>
                                            )}
                                            {slip.status === 'paid' && (
                                                <>
                                                    <button onClick={() => handleDownloadSlip(slip)} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all">
                                                        <Download size={12} /> Slip
                                                    </button>
                                                    <button onClick={() => handleShareSlip(slip)} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 border border-green-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-green-100 transition-all">
                                                        <Share2 size={12} /> Share
                                                    </button>
                                                </>
                                            )}
                                            {!isSubAdmin && (
                                                <button onClick={() => { if (window.confirm("Delete this entry?")) deleteSlip.mutate(slip.id); }}
                                                    className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                        </div>
                                    ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-gray-50">
                            {groupedSlips.map(([groupName, groupList]) => (
                                <div key={groupName}>
                                    {groupBy !== 'none' && (
                                        <div className="bg-[#1D4ED8]/5 border-y border-gray-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#1D4ED8] flex justify-between items-center">
                                            <span>{groupName}</span>
                                            <span className="opacity-60">{groupList.length} Entries</span>
                                        </div>
                                    )}
                                    {groupList.map((slip) => (
                                <div key={slip.id} className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-bold text-[#0F172A]">{slip.name}</div>
                                            <div className="text-[10px] text-[#0F172A]/50 flex items-center gap-1 mt-0.5">
                                                <Store size={10} /> {slip.shop_name}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-black text-[#1D4ED8] text-lg">{'\u20B9'}{Number(slip.amount).toLocaleString('en-IN')}</div>
                                            <div className="text-[9px] text-[#0F172A]/40 font-mono">{slip.slip_number}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        {slip.mobile ? (
                                            <a href={`https://wa.me/91${slip.mobile}`} target="_blank" rel="noreferrer"
                                                className="text-xs text-green-600 font-mono flex items-center gap-1">
                                                <Phone size={12} /> {slip.mobile}
                                            </a>
                                        ) : (
                                            <span className="text-[10px] text-gray-400 italic">No mobile</span>
                                        )}
                                        {slip.status === 'paid' ? (
                                            <span className="px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-green-100 text-green-700 flex items-center gap-1">
                                                <CheckCircle2 size={10} /> Paid
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-700 flex items-center gap-1">
                                                <Clock size={10} /> Pending
                                            </span>
                                        )}
                                        {slip.payment_mode && (
                                            <span className="text-[9px] font-bold text-[#1D4ED8] bg-blue-50 px-2 py-0.5 rounded-md uppercase">
                                                {slip.payment_mode}
                                            </span>
                                        )}
                                    </div>

                                    {slip.status === 'pending' && slip.tentative_date && (
                                        <div className="text-[10px] text-amber-600 font-bold flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg">
                                            <Calendar size={10} /> Tentative: {new Date(slip.tentative_date).toLocaleDateString('en-IN')}
                                        </div>
                                    )}

                                    {slip.status === 'paid' && (
                                        <div className="text-[10px] text-green-600 font-bold bg-green-50 px-3 py-1.5 rounded-lg">
                                            Confirmed by {slip.confirmed_by_name} {slip.confirmed_at && new Date(slip.confirmed_at).toLocaleDateString('en-IN')}
                                        </div>
                                    )}

                                    <div className="flex gap-2 pt-1">
                                        <button onClick={() => openEditModal(slip)}
                                            className="flex items-center justify-center gap-1 py-2 px-3 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl text-[10px] font-black uppercase">
                                            <Edit3 size={12} /> Edit
                                        </button>
                                        {slip.status === 'pending' && (
                                            <button onClick={() => handleConfirmPayment(slip.id)} disabled={confirmingId === slip.id}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 disabled:opacity-50">
                                                {confirmingId === slip.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                                                Confirm Payment
                                            </button>
                                        )}
                                        {slip.status === 'paid' && (
                                            <>
                                                <button onClick={() => handleDownloadSlip(slip)}
                                                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl text-[10px] font-black uppercase">
                                                    <Download size={12} /> Download
                                                </button>
                                                <button onClick={() => handleShareSlip(slip)}
                                                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-50 text-green-600 border border-green-200 rounded-xl text-[10px] font-black uppercase">
                                                    <Share2 size={12} /> WhatsApp
                                                </button>
                                            </>
                                        )}
                                        {!isSubAdmin && (
                                            <button onClick={() => { if (window.confirm("Delete?")) deleteSlip.mutate(slip.id); }}
                                                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl">
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                    </div>
                                ))}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Add Entry Modal */}
            <AnimatePresence>
                {isFormOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-display font-black text-[#0F172A]">New Vargani Entry</h3>
                                    <p className="text-[10px] text-[#0F172A]/50 font-bold uppercase tracking-widest mt-1">Fill in contribution details</p>
                                </div>
                                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <X size={18} className="text-[#0F172A]/60" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1">
                                        <User size={10} className="inline mr-1" /> Name *
                                    </label>
                                    <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20" placeholder="Enter full name" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1">
                                        <Store size={10} className="inline mr-1" /> Shop Name *
                                    </label>
                                    <input value={formData.shop_name} onChange={e => setFormData({ ...formData, shop_name: e.target.value })}
                                        className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20" placeholder="Enter shop / business name" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1">
                                        <IndianRupee size={10} className="inline mr-1" /> Amount ({'\u20B9'}) *
                                    </label>
                                    <input type="number" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                        className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20" placeholder="e.g. 1500" min="1" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1">
                                        <MapPin size={10} className="inline mr-1" /> Location *
                                    </label>
                                    <input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20" placeholder="e.g. Dapodi, Pune" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1">
                                        <Home size={10} className="inline mr-1" /> Address
                                    </label>
                                    <textarea value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 resize-none" placeholder="Full address (optional)" rows={2} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1">
                                        <Phone size={10} className="inline mr-1" /> WhatsApp Number
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-[#0F172A]/60 bg-[#F5F5F0] border border-gray-200 rounded-xl px-3 py-3">+91</span>
                                        <input type="tel" value={formData.mobile}
                                            onChange={e => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                            className="flex-1 bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 font-mono"
                                            placeholder="10 digit WhatsApp number" maxLength={10} />
                                    </div>
                                    {formData.mobile && !isValidMobile(formData.mobile) && (
                                        <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                                            <AlertCircle size={10} /> Please enter a valid 10-digit mobile number
                                        </p>
                                    )}
                                </div>

                                {/* Payment Status */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-3">Payment Status *</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button type="button" onClick={() => setFormData({ ...formData, paymentStatus: 'paid' })}
                                            className={`p-4 rounded-xl border-2 text-center transition-all ${formData.paymentStatus === 'paid' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <CheckCircle2 size={28} className={`mx-auto mb-2 ${formData.paymentStatus === 'paid' ? 'text-green-500' : 'text-gray-300'}`} />
                                            <div className={`text-xs font-black uppercase tracking-wider ${formData.paymentStatus === 'paid' ? 'text-green-600' : 'text-gray-500'}`}>Payment Received</div>
                                            <div className="text-[9px] text-[#0F172A]/40 mt-1">Slip will be generated</div>
                                        </button>
                                        <button type="button" onClick={() => setFormData({ ...formData, paymentStatus: 'pending' })}
                                            className={`p-4 rounded-xl border-2 text-center transition-all ${formData.paymentStatus === 'pending' ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <Clock size={28} className={`mx-auto mb-2 ${formData.paymentStatus === 'pending' ? 'text-amber-500' : 'text-gray-300'}`} />
                                            <div className={`text-xs font-black uppercase tracking-wider ${formData.paymentStatus === 'pending' ? 'text-amber-600' : 'text-gray-500'}`}>Pending</div>
                                            <div className="text-[9px] text-[#0F172A]/40 mt-1">No slip until paid</div>
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Payment Mode */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-2">Payment Mode *</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button type="button" onClick={() => setFormData({ ...formData, paymentMode: 'cash' })}
                                            className={`py-2.5 rounded-xl border-2 text-center transition-all text-xs font-bold ${formData.paymentMode === 'cash' ? 'border-[#1D4ED8] bg-blue-50 text-[#1D4ED8]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                                            Cash
                                        </button>
                                        <button type="button" onClick={() => setFormData({ ...formData, paymentMode: 'online' })}
                                            className={`py-2.5 rounded-xl border-2 text-center transition-all text-xs font-bold ${formData.paymentMode === 'online' ? 'border-[#1D4ED8] bg-blue-50 text-[#1D4ED8]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                                            Online
                                        </button>
                                    </div>
                                </div>

                                {/* Tentative Date */}
                                <AnimatePresence>
                                    {formData.paymentStatus === 'pending' && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-amber-700 mb-2">
                                                    <Calendar size={10} className="inline mr-1" /> Tentative Payment Date *
                                                </label>
                                                <input type="date" value={formData.tentative_date}
                                                    onChange={e => setFormData({ ...formData, tentative_date: e.target.value })}
                                                    className="w-full bg-white border border-amber-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                                                    min={new Date().toISOString().split('T')[0]} />
                                                <p className="text-[9px] text-amber-600/70 mt-2 flex items-center gap-1">
                                                    <AlertCircle size={10} /> No slip will be generated until payment is confirmed
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button onClick={() => setIsFormOpen(false)} className="flex-1 py-3 text-[#0F172A]/70 font-bold text-sm bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
                                <button onClick={handleSubmit} disabled={addSlip.isPending}
                                    className={`flex-1 py-3 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${formData.paymentStatus === 'paid' ? 'bg-green-500 hover:bg-green-600' : 'bg-amber-500 hover:bg-amber-600'}`}>
                                    {addSlip.isPending ? <Loader2 size={16} className="animate-spin" /> : formData.paymentStatus === 'paid' ? <><CheckCircle2 size={16} /> Confirm & Generate Slip</> : <><Clock size={16} /> Save as Pending</>}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit Entry Modal */}
            <AnimatePresence>
                {isEditOpen && editingSlip && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-display font-black text-[#0F172A]">Edit Vargani Entry</h3>
                                    <p className="text-[10px] text-[#0F172A]/50 font-bold uppercase tracking-widest mt-1">Slip: {editingSlip.slip_number}</p>
                                </div>
                                <button onClick={() => { setIsEditOpen(false); setEditingSlip(null); }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <X size={18} className="text-[#0F172A]/60" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1"><User size={10} className="inline mr-1" /> Name *</label>
                                    <input value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })}
                                        className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1"><Store size={10} className="inline mr-1" /> Shop Name *</label>
                                    <input value={editData.shop_name} onChange={e => setEditData({ ...editData, shop_name: e.target.value })}
                                        className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1"><IndianRupee size={10} className="inline mr-1" /> Amount ({'\u20B9'}) *</label>
                                    <input type="number" value={editData.amount} onChange={e => setEditData({ ...editData, amount: e.target.value })}
                                        className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20" min="1" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1"><MapPin size={10} className="inline mr-1" /> Location *</label>
                                    <input value={editData.location} onChange={e => setEditData({ ...editData, location: e.target.value })}
                                        className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1"><Home size={10} className="inline mr-1" /> Address</label>
                                    <textarea value={editData.address} onChange={e => setEditData({ ...editData, address: e.target.value })}
                                        className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 resize-none" rows={2} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1"><Phone size={10} className="inline mr-1" /> WhatsApp Number</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-[#0F172A]/60 bg-[#F5F5F0] border border-gray-200 rounded-xl px-3 py-3">+91</span>
                                        <input type="tel" value={editData.mobile}
                                            onChange={e => setEditData({ ...editData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                            className="flex-1 bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 font-mono" maxLength={10} />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-3">Payment Status *</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button type="button" onClick={() => setEditData({ ...editData, status: 'paid' })}
                                            className={`p-3 rounded-xl border-2 text-center transition-all ${editData.status === 'paid' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <CheckCircle2 size={24} className={`mx-auto mb-1 ${editData.status === 'paid' ? 'text-green-500' : 'text-gray-300'}`} />
                                            <div className={`text-xs font-black uppercase ${editData.status === 'paid' ? 'text-green-600' : 'text-gray-500'}`}>Paid</div>
                                        </button>
                                        <button type="button" onClick={() => setEditData({ ...editData, status: 'pending' })}
                                            className={`p-3 rounded-xl border-2 text-center transition-all ${editData.status === 'pending' ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <Clock size={24} className={`mx-auto mb-1 ${editData.status === 'pending' ? 'text-amber-500' : 'text-gray-300'}`} />
                                            <div className={`text-xs font-black uppercase ${editData.status === 'pending' ? 'text-amber-600' : 'text-gray-500'}`}>Pending</div>
                                        </button>
                                    </div>
                                </div>

                                {/* Edit Payment Mode */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-2">Payment Mode *</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button type="button" onClick={() => setEditData({ ...editData, payment_mode: 'cash' })}
                                            className={`py-2.5 rounded-xl border-2 text-center transition-all text-xs font-bold ${editData.payment_mode === 'cash' ? 'border-[#1D4ED8] bg-blue-50 text-[#1D4ED8]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                                            Cash
                                        </button>
                                        <button type="button" onClick={() => setEditData({ ...editData, payment_mode: 'online' })}
                                            className={`py-2.5 rounded-xl border-2 text-center transition-all text-xs font-bold ${editData.payment_mode === 'online' ? 'border-[#1D4ED8] bg-blue-50 text-[#1D4ED8]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                                            Online
                                        </button>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {editData.status === 'pending' && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-amber-700 mb-2">
                                                    <Calendar size={10} className="inline mr-1" /> Tentative Date *
                                                </label>
                                                <input type="date" value={editData.tentative_date}
                                                    onChange={e => setEditData({ ...editData, tentative_date: e.target.value })}
                                                    className="w-full bg-white border border-amber-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button onClick={() => { setIsEditOpen(false); setEditingSlip(null); }}
                                    className="flex-1 py-3 text-[#0F172A]/70 font-bold text-sm bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
                                <button onClick={handleEditSubmit} disabled={updateSlip.isPending}
                                    className="flex-1 py-3 text-white font-bold text-sm rounded-xl bg-[#1D4ED8] hover:bg-[#B94A15] flex items-center justify-center gap-2 disabled:opacity-50">
                                    {updateSlip.isPending ? <Loader2 size={16} className="animate-spin" /> : <><Edit3 size={16} /> Save Changes</>}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VarganiSlipTab;
