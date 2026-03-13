import { useState, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Trash2, Search, CheckCircle2, XCircle, Calendar,
    Download, Share2, Phone, MapPin, Store, User, IndianRupee,
    Clock, Filter, X, AlertCircle, Loader2
} from "lucide-react";
import html2canvas from "html2canvas";
import { useVarganiSlips } from "@/lib/slip-api";
import { VarganiSlip } from "@/types/admin";
import { toast } from "sonner";

// ============================================
// Slip Preview Component (for html2canvas)
// Uses inline styles for reliable image capture
// ============================================

const SlipPreviewContent = ({ slip }: { slip: VarganiSlip }) => (
    <div style={{
        width: '480px',
        background: '#FFFFFF',
        fontFamily: "'Segoe UI', 'Noto Sans Devanagari', Arial, sans-serif",
        overflow: 'hidden',
        border: '3px solid #B8860B',
        position: 'relative'
    }}>
        {/* Decorative Gold Double Border */}
        <div style={{
            position: 'absolute', inset: '3px',
            border: '1px solid #DAA520',
            pointerEvents: 'none',
            zIndex: 5
        }} />

        {/* ====== HEADER — Rich Saffron/Maroon with Logo ====== */}
        <div style={{
            background: 'linear-gradient(180deg, #8B1A1A 0%, #A0522D 30%, #CD6600 70%, #D2691E 100%)',
            padding: '20px 20px 16px',
            textAlign: 'center',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Subtle traditional pattern overlay */}
            <div style={{
                position: 'absolute', inset: 0, opacity: 0.06,
                backgroundImage: `radial-gradient(circle at 20px 20px, rgba(255,215,0,0.3) 2px, transparent 2px)`,
                backgroundSize: '30px 30px'
            }} />

            <div style={{ position: 'relative', zIndex: 2 }}>
                {/* Logo */}
                <div style={{ marginBottom: '8px' }}>
                    <img
                        src="/images/logo.png"
                        alt="Logo"
                        style={{
                            width: '90px', height: '90px', objectFit: 'contain',
                            margin: '0 auto', display: 'block',
                            filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))'
                        }}
                        crossOrigin="anonymous"
                    />
                </div>

                {/* Mandal Name */}
                <div style={{
                    fontSize: '11px', fontWeight: 800, letterSpacing: '6px',
                    opacity: 0.8, marginBottom: '2px'
                }}>
                    ॥ श्री छत्रपती शिवाजी महाराज ॥
                </div>
                <div style={{
                    fontSize: '26px', fontWeight: 900, letterSpacing: '3px',
                    lineHeight: 1.2, textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                    श्रीमंत शिवगर्जना प्रतिष्ठान
                </div>
                <div style={{
                    fontSize: '13px', fontWeight: 700, letterSpacing: '4px',
                    opacity: 0.85, marginTop: '2px'
                }}>
                    वानवडी, पुणे ४११०४०
                </div>

                {/* Receipt Title */}
                <div style={{
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px solid rgba(255,255,255,0.2)'
                }}>
                    <div style={{
                        fontSize: '22px', fontWeight: 900, letterSpacing: '8px',
                        textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                    }}>
                        • वर्गणी पावती •
                    </div>
                    <div style={{
                        fontSize: '10px', fontWeight: 800, letterSpacing: '6px',
                        textTransform: 'uppercase', opacity: 0.7, marginTop: '2px'
                    }}>
                        VARGANI RECEIPT
                    </div>
                </div>
            </div>
        </div>

        {/* ====== Indian Tricolor Stripe ====== */}
        <div style={{ display: 'flex', height: '6px' }}>
            <div style={{ flex: 1, background: '#FF9933' }} />
            <div style={{ flex: 1, background: '#FFFFFF' }} />
            <div style={{ flex: 1, background: '#138808' }} />
        </div>

        {/* ====== Slip Info Bar ====== */}
        <div style={{
            padding: '10px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#FFF8F0',
            borderBottom: '2px solid #E8C07A'
        }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#5C3310' }}>
                पावती क्र.: <span style={{ color: '#CD6600', fontSize: '13px' }}>{slip.slip_number || 'N/A'}</span>
            </div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#5C3310' }}>
                दि.: <span style={{ color: '#CD6600' }}>
                    {new Date(slip.confirmed_at || slip.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit', month: '2-digit', year: 'numeric'
                    })}
                </span>
            </div>
        </div>

        {/* ====== Receipt Details — Traditional Form Style ====== */}
        <div style={{ padding: '18px 24px 14px', background: '#FFFEFB' }}>
            {[
                { label: 'श्री / सौ (Name)', value: slip.name },
                { label: 'दुकान (Shop)', value: slip.shop_name },
                { label: 'ठिकाण (Location)', value: slip.location },
                { label: 'मोबाईल (WhatsApp)', value: slip.mobile },
            ].map((row, i) => (
                <div key={i} style={{
                    display: 'flex', alignItems: 'baseline',
                    marginBottom: '10px', gap: '8px'
                }}>
                    <div style={{
                        fontSize: '12px', fontWeight: 700, color: '#78716C',
                        whiteSpace: 'nowrap', minWidth: '145px'
                    }}>
                        {row.label}:
                    </div>
                    <div style={{
                        flex: 1, fontSize: '15px', fontWeight: 800, color: '#1C1917',
                        borderBottom: '1.5px dotted #D4C5A9', paddingBottom: '3px',
                        paddingLeft: '4px'
                    }}>
                        {row.value}
                    </div>
                </div>
            ))}

            {/* Amount — Highlighted */}
            <div style={{
                display: 'flex', alignItems: 'center',
                marginTop: '14px', padding: '12px 16px',
                background: 'linear-gradient(135deg, #FFF7ED, #FEF3C7)',
                borderRadius: '10px', border: '2px solid #E8C07A'
            }}>
                <div style={{
                    fontSize: '13px', fontWeight: 800, color: '#92400E',
                    minWidth: '130px'
                }}>
                    💰 रक्कम (Amount):
                </div>
                <div style={{
                    flex: 1, fontSize: '28px', fontWeight: 900, color: '#B45309',
                    textAlign: 'right', letterSpacing: '1px'
                }}>
                    ₹ {Number(slip.amount).toLocaleString('en-IN')}/-
                </div>
            </div>
        </div>

        {/* ====== Payment Status Badge ====== */}
        <div style={{
            padding: '14px 24px',
            background: '#F0FDF4',
            borderTop: '2px solid #22C55E',
            borderBottom: '1px solid #BBF7D0',
            textAlign: 'center'
        }}>
            <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'linear-gradient(135deg, #16A34A, #15803D)',
                color: 'white', padding: '10px 32px', borderRadius: '30px',
                fontSize: '13px', fontWeight: 900, letterSpacing: '3px',
                textTransform: 'uppercase',
                boxShadow: '0 2px 8px rgba(22,163,74,0.3)'
            }}>
                ✅ वर्गणी रोख मिळाली
            </div>
            <div style={{
                fontSize: '10px', color: '#15803D', fontWeight: 700,
                letterSpacing: '2px', marginTop: '4px', textTransform: 'uppercase'
            }}>
                PAYMENT RECEIVED
            </div>
        </div>

        {/* ====== Confirmed By ====== */}
        <div style={{
            padding: '12px 24px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderBottom: '1px solid #E5E7EB',
            background: '#FAFAF5'
        }}>
            <div style={{ fontSize: '12px', color: '#57534E' }}>
                <span style={{ fontWeight: 600 }}>Confirmed by: </span>
                <strong style={{ color: '#B45309', fontWeight: 900 }}>{slip.confirmed_by_name || 'N/A'}</strong>
            </div>
            <div style={{ fontSize: '11px', color: '#78716C', fontWeight: 600 }}>
                {slip.confirmed_at && new Date(slip.confirmed_at).toLocaleString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit', hour12: true
                })}
            </div>
        </div>

        {/* ====== Thank You Footer ====== */}
        <div style={{
            padding: '14px 24px',
            textAlign: 'center',
            background: '#FFFEFB',
            borderBottom: '1px solid #E5E7EB'
        }}>
            <div style={{
                fontSize: '14px', fontWeight: 800, color: '#5C3310', marginBottom: '3px'
            }}>
                आपल्या सहकार्याबद्दल मनःपूर्वक धन्यवाद! 🙏
            </div>
            <div style={{ fontSize: '11px', color: '#A8A29E', fontWeight: 600 }}>
                Thank you for your generous contribution!
            </div>
        </div>

        {/* ====== Indian Flag Stripe ====== */}
        <div style={{ display: 'flex', height: '4px' }}>
            <div style={{ flex: 1, background: '#FF9933' }} />
            <div style={{ flex: 1, background: '#FFFFFF' }} />
            <div style={{ flex: 1, background: '#138808' }} />
        </div>

        {/* ====== Powered By Footer ====== */}
        <div style={{
            padding: '10px 24px',
            textAlign: 'center',
            background: '#1C1917'
        }}>
            <div style={{
                fontSize: '10px', color: '#A8A29E', fontWeight: 700,
                letterSpacing: '3px', textTransform: 'uppercase'
            }}>
                Powered by <span style={{ color: '#E8870E', fontWeight: 900 }}>busyhub.in</span>
            </div>
        </div>
    </div>
);

// ============================================
// Main Vargani Slip Tab Component
// ============================================

const VarganiSlipTab = () => {
    const { data: slips, isLoading, addSlip, confirmPayment, deleteSlip } = useVarganiSlips();

    // State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [filter, setFilter] = useState<'all' | 'paid' | 'pending'>('all');
    const [search, setSearch] = useState("");
    const [activeSlip, setActiveSlip] = useState<VarganiSlip | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [confirmingId, setConfirmingId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        shop_name: '',
        amount: '',
        location: '',
        mobile: '',
        paymentStatus: 'paid' as 'paid' | 'pending',
        tentative_date: ''
    });

    const slipRef = useRef<HTMLDivElement>(null);

    // Filtered + searched slips
    const filteredSlips = useMemo(() => {
        let result = slips || [];
        if (filter !== 'all') result = result.filter(s => s.status === filter);
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(s =>
                s.name.toLowerCase().includes(q) ||
                s.shop_name.toLowerCase().includes(q) ||
                s.mobile.includes(q) ||
                (s.slip_number || '').toLowerCase().includes(q)
            );
        }
        return result;
    }, [slips, filter, search]);

    // Stats
    const stats = useMemo(() => {
        const all = slips || [];
        const paid = all.filter(s => s.status === 'paid');
        const pending = all.filter(s => s.status === 'pending');
        const totalCollected = paid.reduce((sum, s) => sum + Number(s.amount), 0);
        const totalPending = pending.reduce((sum, s) => sum + Number(s.amount), 0);
        return { total: all.length, paidCount: paid.length, pendingCount: pending.length, totalCollected, totalPending };
    }, [slips]);

    // Reset form
    const resetForm = () => {
        setFormData({ name: '', shop_name: '', amount: '', location: '', mobile: '', paymentStatus: 'paid', tentative_date: '' });
    };

    // Validate WhatsApp number
    const isValidMobile = (num: string) => /^[6-9]\d{9}$/.test(num.replace(/\s/g, ''));

    // Handle form submit
    const handleSubmit = async () => {
        if (!formData.name.trim()) return toast.error("कृपया नाव भरा / Please enter name");
        if (!formData.shop_name.trim()) return toast.error("कृपया दुकानाचे नाव भरा / Please enter shop name");
        if (!formData.amount || parseFloat(formData.amount) <= 0) return toast.error("कृपया रक्कम भरा / Please enter valid amount");
        if (!formData.location.trim()) return toast.error("कृपया ठिकाण भरा / Please enter location");
        if (!isValidMobile(formData.mobile)) return toast.error("कृपया वैध 10 अंकी WhatsApp नंबर भरा / Please enter valid 10-digit WhatsApp number");
        if (formData.paymentStatus === 'pending' && !formData.tentative_date) return toast.error("कृपया अंदाजित तारीख भरा / Please enter tentative date");

        try {
            const result = await addSlip.mutateAsync({
                name: formData.name.trim(),
                shop_name: formData.shop_name.trim(),
                amount: parseFloat(formData.amount),
                location: formData.location.trim(),
                mobile: formData.mobile.replace(/\s/g, ''),
                status: formData.paymentStatus,
                tentative_date: formData.paymentStatus === 'pending' ? formData.tentative_date : null
            });

            toast.success(formData.paymentStatus === 'paid'
                ? `✅ पावती तयार! / Slip generated for ${formData.name}`
                : `⏳ Pending entry saved for ${formData.name}`
            );

            // If paid, auto-trigger slip download
            if (formData.paymentStatus === 'paid' && result) {
                setTimeout(() => handleDownloadSlip(result), 500);
            }

            resetForm();
            setIsFormOpen(false);
        } catch (err: any) {
            toast.error(err.message || "त्रुटी / Error saving slip");
        }
    };

    // Confirm pending payment
    const handleConfirmPayment = async (id: string) => {
        setConfirmingId(id);
        try {
            const result = await confirmPayment.mutateAsync(id);
            toast.success(`✅ Payment confirmed for ${result.name}!`);
            // Auto-download the slip
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

        // Wait for render
        await new Promise(r => setTimeout(r, 300));

        try {
            const el = document.getElementById('slip-preview-capture');
            if (!el) throw new Error("Slip preview not found");

            const canvas = await html2canvas(el, {
                scale: 3,
                useCORS: true,
                backgroundColor: null,
                logging: false
            });

            const link = document.createElement('a');
            link.download = `Vargani_${slip.slip_number || 'slip'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            toast.success("📥 Slip downloaded!");
        } catch (err) {
            console.error("Slip generation error:", err);
            toast.error("Slip download failed. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    }, []);

    // Share slip via WhatsApp
    const handleShareSlip = useCallback(async (slip: VarganiSlip) => {
        if (slip.status !== 'paid') {
            toast.error("Slip can only be shared after payment is confirmed!");
            return;
        }

        setActiveSlip(slip);
        setIsGenerating(true);

        await new Promise(r => setTimeout(r, 300));

        try {
            const el = document.getElementById('slip-preview-capture');
            if (!el) throw new Error("Slip preview not found");

            const canvas = await html2canvas(el, {
                scale: 3,
                useCORS: true,
                backgroundColor: null,
                logging: false
            });

            // Try Web Share API (works on mobile)
            const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));

            if (blob && navigator.share) {
                const file = new File([blob], `Vargani_${slip.slip_number}.png`, { type: 'image/png' });
                try {
                    await navigator.share({
                        title: `वर्गणी पावती - ${slip.name}`,
                        text: `🚩 शिवगर्जना प्रतिष्ठान - वर्गणी पावती\n\nनाव: ${slip.name}\nरक्कम: ₹${Number(slip.amount).toLocaleString('en-IN')}\nपावती: ${slip.slip_number}\n\nConfirmed by: ${slip.confirmed_by_name}\n\nPowered by busyhub.in`,
                        files: [file]
                    });
                    toast.success("✅ Shared successfully!");
                    return;
                } catch {
                    // User cancelled or API not supported for files, fall through
                }
            }

            // Fallback: Download + open WhatsApp
            const link = document.createElement('a');
            link.download = `Vargani_${slip.slip_number || 'slip'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            const msg = `🚩 *शिवगर्जना प्रतिष्ठान - वर्गणी पावती*\n\nनाव: ${slip.name}\nदुकान: ${slip.shop_name}\nरक्कम: ₹${Number(slip.amount).toLocaleString('en-IN')}\nपावती क्रमांक: ${slip.slip_number}\n\nConfirmed by: ${slip.confirmed_by_name}\n\nआपल्या सहकार्याबद्दल धन्यवाद! 🙏\n\n_Powered by busyhub.in_`;
            window.open(`https://wa.me/91${slip.mobile}?text=${encodeURIComponent(msg)}`, '_blank');

            toast.success("📥 Slip downloaded! WhatsApp opened.");
        } catch (err) {
            console.error("Share error:", err);
            toast.error("Sharing failed. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-[#D95D1E]/20 border-t-[#D95D1E] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* ======= Off-screen Slip Preview for html2canvas ======= */}
            {activeSlip && (
                <div style={{ position: 'fixed', left: '-9999px', top: '0', zIndex: -1 }}>
                    <div id="slip-preview-capture">
                        <SlipPreviewContent slip={activeSlip} />
                    </div>
                </div>
            )}

            {/* ======= Loading Overlay ======= */}
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
                            <Loader2 size={32} className="text-[#D95D1E] animate-spin" />
                            <div className="text-sm font-black uppercase tracking-widest text-[#2C1810]">Generating Slip...</div>
                            <div className="text-[10px] text-[#2C1810]/50">Please wait</div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ======= Header ======= */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h2 className="text-xl font-display font-black text-[#2C1810]">वर्गणी पावती / Vargani Slips</h2>
                    <p className="text-[10px] font-bold text-[#2C1810]/50 uppercase tracking-widest mt-1">Generate & manage vargani receipts</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsFormOpen(true); }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#D95D1E] text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#B94A15] transition-all shadow-lg shadow-[#D95D1E]/20"
                >
                    <Plus size={16} /> New Vargani Entry
                </button>
            </div>

            {/* ======= Stats ======= */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="p-4 md:p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1 md:mb-2">Total Entries</div>
                    <div className="text-xl md:text-3xl font-black text-[#2C1810]">{stats.total}</div>
                </div>
                <div className="p-4 md:p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-green-600 mb-1 md:mb-2">Collected</div>
                    <div className="text-xl md:text-3xl font-black text-green-600">₹{stats.totalCollected.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-green-600/60 mt-1 hidden md:block">{stats.paidCount} Paid</div>
                </div>
                <div className="p-4 md:p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-red-500 mb-1 md:mb-2">Pending</div>
                    <div className="text-xl md:text-3xl font-black text-red-500">₹{stats.totalPending.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-red-500/60 mt-1 hidden md:block">{stats.pendingCount} Pending</div>
                </div>
                <div className="p-4 md:p-6 bg-white border border-green-100 rounded-2xl shadow-sm bg-green-50/30">
                    <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-green-700 mb-1 md:mb-2">Paid Slips</div>
                    <div className="text-xl md:text-3xl font-black text-green-700">{stats.paidCount}</div>
                </div>
                <div className="p-4 md:p-6 bg-white border border-orange-100 rounded-2xl shadow-sm bg-orange-50/30">
                    <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#D95D1E] mb-1 md:mb-2">Pending Slips</div>
                    <div className="text-xl md:text-3xl font-black text-[#D95D1E]">{stats.pendingCount}</div>
                </div>
            </div>

            {/* ======= Filter + Search ======= */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                    {(['all', 'paid', 'pending'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${filter === f
                                ? 'bg-[#D95D1E] text-white'
                                : 'text-[#2C1810]/60 hover:text-[#2C1810] hover:bg-[#F5F5F0]'
                                }`}
                        >
                            {f === 'all' ? `All (${stats.total})` : f === 'paid' ? `✅ Paid (${stats.paidCount})` : `⏳ Pending (${stats.pendingCount})`}
                        </button>
                    ))}
                </div>
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20 shadow-sm"
                        placeholder="Search by name, shop, mobile, slip no..."
                    />
                </div>
            </div>

            {/* ======= Slips Table ======= */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                {/* Desktop Header */}
                <div className="hidden md:block overflow-x-auto">
                    <div className="min-w-[900px]">
                        <div className="grid grid-cols-12 gap-3 p-4 border-b border-gray-100 bg-[#F5F5F0] text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60">
                            <div className="col-span-1">Slip #</div>
                            <div className="col-span-2">Name / Shop</div>
                            <div className="col-span-1">Amount</div>
                            <div className="col-span-2">Mobile</div>
                            <div className="col-span-1">Status</div>
                            <div className="col-span-2">Date / Info</div>
                            <div className="col-span-3 text-right">Actions</div>
                        </div>
                    </div>
                </div>

                {filteredSlips.length === 0 ? (
                    <div className="p-10 text-center">
                        <div className="text-4xl mb-3">📃</div>
                        <div className="text-[#2C1810]/60 text-sm font-bold">No slips found.</div>
                        <button
                            onClick={() => { resetForm(); setIsFormOpen(true); }}
                            className="mt-4 text-[#D95D1E] font-bold text-sm hover:underline"
                        >
                            Create your first vargani entry
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <div className="min-w-[900px]">
                                {filteredSlips.map((slip) => (
                                    <div key={slip.id} className="grid grid-cols-12 gap-3 p-4 border-b border-gray-50 items-center hover:bg-[#FDFBF7] transition-colors">
                                        <div className="col-span-1">
                                            <span className="text-[11px] font-bold text-[#D95D1E] font-mono">{slip.slip_number?.split('-').pop()}</span>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="font-bold text-[#2C1810] text-sm">{slip.name}</div>
                                            <div className="text-[10px] text-[#2C1810]/50 flex items-center gap-1">
                                                <Store size={10} /> {slip.shop_name}
                                            </div>
                                        </div>
                                        <div className="col-span-1">
                                            <div className="font-black text-[#2C1810] text-sm">₹{Number(slip.amount).toLocaleString('en-IN')}</div>
                                        </div>
                                        <div className="col-span-2">
                                            <a
                                                href={`https://wa.me/91${slip.mobile}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sm text-green-600 font-mono hover:underline flex items-center gap-1"
                                            >
                                                <Phone size={12} /> {slip.mobile}
                                            </a>
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
                                                    <div className="text-[10px] text-green-600 font-bold">
                                                        ✅ {slip.confirmed_by_name}
                                                    </div>
                                                    <div className="text-[9px] text-[#2C1810]/40">
                                                        {slip.confirmed_at && new Date(slip.confirmed_at).toLocaleDateString('en-IN')}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                                                        <Calendar size={10} /> Tentative
                                                    </div>
                                                    <div className="text-[11px] text-[#2C1810] font-bold">
                                                        {slip.tentative_date ? new Date(slip.tentative_date).toLocaleDateString('en-IN') : 'Not set'}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-span-3 flex justify-end gap-2">
                                            {slip.status === 'pending' && (
                                                <button
                                                    onClick={() => handleConfirmPayment(slip.id)}
                                                    disabled={confirmingId === slip.id}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all disabled:opacity-50 shadow-sm"
                                                >
                                                    {confirmingId === slip.id ? (
                                                        <Loader2 size={12} className="animate-spin" />
                                                    ) : (
                                                        <CheckCircle2 size={12} />
                                                    )}
                                                    Confirm
                                                </button>
                                            )}
                                            {slip.status === 'paid' && (
                                                <>
                                                    <button
                                                        onClick={() => handleDownloadSlip(slip)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all"
                                                    >
                                                        <Download size={12} /> Slip
                                                    </button>
                                                    <button
                                                        onClick={() => handleShareSlip(slip)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 border border-green-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-green-100 transition-all"
                                                    >
                                                        <Share2 size={12} /> Share
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => {
                                                    if (window.confirm("Delete this entry?")) deleteSlip.mutate(slip.id);
                                                }}
                                                className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden divide-y divide-gray-50">
                            {filteredSlips.map((slip) => (
                                <div key={slip.id} className="p-4 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-bold text-[#2C1810]">{slip.name}</div>
                                            <div className="text-[10px] text-[#2C1810]/50 flex items-center gap-1 mt-0.5">
                                                <Store size={10} /> {slip.shop_name}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-black text-[#D95D1E] text-lg">₹{Number(slip.amount).toLocaleString('en-IN')}</div>
                                            <div className="text-[9px] text-[#2C1810]/40 font-mono">{slip.slip_number}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <a href={`https://wa.me/91${slip.mobile}`} target="_blank" rel="noreferrer"
                                            className="text-xs text-green-600 font-mono flex items-center gap-1">
                                            <Phone size={12} /> {slip.mobile}
                                        </a>
                                        {slip.status === 'paid' ? (
                                            <span className="px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-green-100 text-green-700 flex items-center gap-1">
                                                <CheckCircle2 size={10} /> Paid
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-700 flex items-center gap-1">
                                                <Clock size={10} /> Pending
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
                                            ✅ Confirmed by {slip.confirmed_by_name} • {slip.confirmed_at && new Date(slip.confirmed_at).toLocaleDateString('en-IN')}
                                        </div>
                                    )}

                                    <div className="flex gap-2 pt-1">
                                        {slip.status === 'pending' && (
                                            <button
                                                onClick={() => handleConfirmPayment(slip.id)}
                                                disabled={confirmingId === slip.id}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 disabled:opacity-50"
                                            >
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
                                        <button
                                            onClick={() => { if (window.confirm("Delete?")) deleteSlip.mutate(slip.id); }}
                                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* ======= Add Entry Modal ======= */}
            <AnimatePresence>
                {isFormOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-display font-black text-[#2C1810]">नवीन वर्गणी / New Entry</h3>
                                    <p className="text-[10px] text-[#2C1810]/50 font-bold uppercase tracking-widest mt-1">Fill in contribution details</p>
                                </div>
                                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <X size={18} className="text-[#2C1810]/60" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">
                                        <User size={10} className="inline mr-1" /> नाव / Name *
                                    </label>
                                    <input
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                                        placeholder="Enter full name"
                                    />
                                </div>

                                {/* Shop Name */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">
                                        <Store size={10} className="inline mr-1" /> दुकान / Shop Name *
                                    </label>
                                    <input
                                        value={formData.shop_name}
                                        onChange={e => setFormData({ ...formData, shop_name: e.target.value })}
                                        className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                                        placeholder="Enter shop / business name"
                                    />
                                </div>

                                {/* Amount */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">
                                        <IndianRupee size={10} className="inline mr-1" /> रक्कम / Amount (₹) *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.amount}
                                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                        className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                                        placeholder="e.g. 1500"
                                        min="1"
                                    />
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">
                                        <MapPin size={10} className="inline mr-1" /> ठिकाण / Location *
                                    </label>
                                    <input
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                                        placeholder="e.g. Wanwadi, Pune"
                                    />
                                </div>

                                {/* WhatsApp Number */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">
                                        <Phone size={10} className="inline mr-1" /> WhatsApp Number *
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-[#2C1810]/60 bg-[#F5F5F0] border border-gray-200 rounded-xl px-3 py-3">+91</span>
                                        <input
                                            type="tel"
                                            value={formData.mobile}
                                            onChange={e => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                            className="flex-1 bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20 font-mono"
                                            placeholder="10 digit WhatsApp number"
                                            maxLength={10}
                                        />
                                    </div>
                                    {formData.mobile && !isValidMobile(formData.mobile) && (
                                        <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                                            <AlertCircle size={10} /> Please enter a valid 10-digit mobile number
                                        </p>
                                    )}
                                </div>

                                {/* Payment Status */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-3">
                                        Payment Status *
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, paymentStatus: 'paid' })}
                                            className={`p-4 rounded-xl border-2 text-center transition-all ${formData.paymentStatus === 'paid'
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <CheckCircle2 size={28} className={`mx-auto mb-2 ${formData.paymentStatus === 'paid' ? 'text-green-500' : 'text-gray-300'}`} />
                                            <div className={`text-xs font-black uppercase tracking-wider ${formData.paymentStatus === 'paid' ? 'text-green-600' : 'text-gray-500'}`}>
                                                Payment Received
                                            </div>
                                            <div className="text-[9px] text-[#2C1810]/40 mt-1">Slip will be generated</div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, paymentStatus: 'pending' })}
                                            className={`p-4 rounded-xl border-2 text-center transition-all ${formData.paymentStatus === 'pending'
                                                ? 'border-amber-500 bg-amber-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <Clock size={28} className={`mx-auto mb-2 ${formData.paymentStatus === 'pending' ? 'text-amber-500' : 'text-gray-300'}`} />
                                            <div className={`text-xs font-black uppercase tracking-wider ${formData.paymentStatus === 'pending' ? 'text-amber-600' : 'text-gray-500'}`}>
                                                Pending
                                            </div>
                                            <div className="text-[9px] text-[#2C1810]/40 mt-1">No slip until paid</div>
                                        </button>
                                    </div>
                                </div>

                                {/* Tentative Date (only for pending) */}
                                <AnimatePresence>
                                    {formData.paymentStatus === 'pending' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-amber-700 mb-2">
                                                    <Calendar size={10} className="inline mr-1" /> अंदाजित तारीख / Tentative Payment Date *
                                                </label>
                                                <input
                                                    type="date"
                                                    value={formData.tentative_date}
                                                    onChange={e => setFormData({ ...formData, tentative_date: e.target.value })}
                                                    className="w-full bg-white border border-amber-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                                                    min={new Date().toISOString().split('T')[0]}
                                                />
                                                <p className="text-[9px] text-amber-600/70 mt-2 flex items-center gap-1">
                                                    <AlertCircle size={10} /> No slip will be generated until payment is confirmed
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={() => setIsFormOpen(false)}
                                    className="flex-1 py-3 text-[#2C1810]/70 font-bold text-sm bg-gray-100 rounded-xl hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={addSlip.isPending}
                                    className={`flex-1 py-3 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${formData.paymentStatus === 'paid'
                                        ? 'bg-green-500 hover:bg-green-600'
                                        : 'bg-amber-500 hover:bg-amber-600'
                                        }`}
                                >
                                    {addSlip.isPending ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : formData.paymentStatus === 'paid' ? (
                                        <><CheckCircle2 size={16} /> Confirm & Generate Slip</>
                                    ) : (
                                        <><Clock size={16} /> Save as Pending</>
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

export default VarganiSlipTab;
