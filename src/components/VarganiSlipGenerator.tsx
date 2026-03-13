import { useState, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus, Trash2, Search, CheckCircle2, XCircle, Calendar,
    Download, Share2, Phone, MapPin, Store, User, IndianRupee,
    Clock, Filter, X, AlertCircle, Loader2, Edit3, Home
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
        width: '800px',
        background: '#FFFFFF',
        fontFamily: "'Noto Sans Devanagari', 'Mangal', 'Segoe UI', Arial, sans-serif",
        overflow: 'visible',
        border: '5px solid #1a237e',
        position: 'relative',
        boxSizing: 'border-box'
    }}>
        {/* Inner decorative border */}
        <div style={{
            position: 'absolute', inset: '5px',
            border: '2px solid #5c6bc0',
            pointerEvents: 'none',
            zIndex: 10
        }} />

        {/* ====== HEADER â€” Blue Gradient with Portraits ====== */}
        <div style={{
            background: 'linear-gradient(135deg, #0d1257 0%, #1a237e 20%, #283593 40%, #3949ab 60%, #5c6bc0 80%, #7986cb 100%)',
            padding: '0',
            position: 'relative',
            overflow: 'hidden',
            height: '180px'
        }}>
            {/* Stupa watermark in header */}
            <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '220px', height: '160px',
                opacity: 0.08,
                zIndex: 0,
                pointerEvents: 'none'
            }}>
                <img
                    src="/images/deekshabhoomi-stupa.png"
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    crossOrigin="anonymous"
                />
            </div>

            {/* Ambedkar Portrait â€” Left */}
            <div style={{
                position: 'absolute',
                left: '14px', bottom: '0',
                width: '120px', height: '160px',
                zIndex: 3
            }}>
                <img
                    src="/images/ambedkar-formal.png"
                    alt="Dr. B.R. Ambedkar"
                    style={{
                        width: '100%', height: '100%', objectFit: 'contain',
                        objectPosition: 'bottom',
                        filter: 'drop-shadow(2px 2px 8px rgba(0,0,0,0.5))'
                    }}
                    crossOrigin="anonymous"
                />
            </div>

            {/* Shivaji Maharaj â€” Right */}
            <div style={{
                position: 'absolute',
                right: '14px', bottom: '0',
                width: '110px', height: '150px',
                zIndex: 3
            }}>
                <img
                    src="/images/shivaji-maharaj.png"
                    alt="Chhatrapati Shivaji Maharaj"
                    style={{
                        width: '100%', height: '100%', objectFit: 'contain',
                        objectPosition: 'bottom',
                        filter: 'drop-shadow(2px 2px 8px rgba(0,0,0,0.5))'
                    }}
                    crossOrigin="anonymous"
                />
            </div>

            {/* Center Text */}
            <div style={{
                position: 'relative', zIndex: 2,
                textAlign: 'center',
                padding: '20px 150px 0'
            }}>
                <div style={{
                    fontSize: '42px', fontWeight: 900, color: 'white',
                    letterSpacing: '5px', lineHeight: 1.15,
                    textShadow: '0 3px 10px rgba(0,0,0,0.5)',
                    marginBottom: '6px'
                }}>
                    à¤°à¤¾à¤¹à¥à¤² à¤®à¤¿à¤¤à¥à¤° à¤®à¤‚à¤¡à¤³
                </div>
                <div style={{
                    fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.85)',
                    letterSpacing: '3px'
                }}>
                    à¤¬à¤¾à¤°à¤¥à¥‡ à¤¬à¤¸à¥à¤¤à¥€, à¤¦à¤¾à¤¯à¥‹à¤¡à¥€ à¤—à¤¾à¤µà¤ à¤¾à¤£, à¤ªà¥à¤£à¥‡-à¥§à¥¨.
                </div>
            </div>

            {/* Event Title â€” Bottom Strip */}
            <div style={{
                position: 'absolute',
                bottom: '0', left: '0', right: '0',
                background: 'linear-gradient(90deg, rgba(13,18,87,0.95), rgba(26,35,126,0.9), rgba(13,18,87,0.95))',
                padding: '10px 40px',
                textAlign: 'center',
                zIndex: 4,
                borderTop: '1px solid rgba(255,255,255,0.15)'
            }}>
                <div style={{
                    fontSize: '18px', fontWeight: 900, color: 'white',
                    letterSpacing: '4px', lineHeight: 1.3,
                    textShadow: '0 2px 6px rgba(0,0,0,0.4)'
                }}>
                    à¤­à¤¾à¤°à¤¤à¤°à¤¤à¥à¤¨ à¤¡à¥‰. à¤¬à¤¾à¤¬à¤¾à¤¸à¤¾à¤¹à¥‡à¤¬ à¤†à¤‚à¤¬à¥‡à¤¡à¤•à¤° à¤œà¤¯à¤‚à¤¤à¥€ à¤®à¤¹à¥‹à¤¤à¥à¤¸à¤µ
                </div>
            </div>
        </div>

        {/* ====== FORM BODY â€” Cheque Style ====== */}
        <div style={{
            position: 'relative',
            padding: '28px 36px 24px',
            background: '#FFFFFF',
            minHeight: '300px'
        }}>
            {/* Stupa watermark in body */}
            <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '300px', height: '220px',
                opacity: 0.04,
                zIndex: 0,
                pointerEvents: 'none'
            }}>
                <img
                    src="/images/deekshabhoomi-stupa.png"
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    crossOrigin="anonymous"
                />
            </div>

            <div style={{ position: 'relative', zIndex: 2 }}>

                {/* Row 1: à¤ªà¤¾à¤µà¤¤à¥€ à¤•à¥à¤°. & à¤¦à¤¿à¤¨à¤¾à¤‚à¤• */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'baseline', marginBottom: '28px'
                }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a' }}>
                        à¤ªà¤¾à¤µà¤¤à¥€ à¤•à¥à¤°. : <span style={{
                            fontWeight: 900, color: '#1a237e', fontSize: '18px',
                            borderBottom: '2px solid #333', paddingBottom: '2px',
                            paddingLeft: '10px', paddingRight: '30px',
                            display: 'inline-block', minWidth: '160px'
                        }}>{slip.slip_number || 'N/A'}</span>
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a' }}>
                        à¤¦à¤¿à¤¨à¤¾à¤‚à¤• : <span style={{
                            fontWeight: 900, color: '#1a237e', fontSize: '18px',
                            borderBottom: '2px solid #333', paddingBottom: '2px',
                            paddingLeft: '10px', paddingRight: '10px',
                            display: 'inline-block', minWidth: '140px'
                        }}>
                            {new Date(slip.confirmed_at || slip.created_at).toLocaleDateString('en-IN', {
                                day: '2-digit', month: '2-digit', year: 'numeric'
                            })}
                        </span>
                    </div>
                </div>

                {/* Row 2: à¤†à¤¯à¥. _____________ à¤¯à¤¾à¤‚à¤œà¤•à¤¡à¥‚à¤¨ (SAME LINE like cheque) */}
                <div style={{
                    display: 'flex', alignItems: 'baseline',
                    marginBottom: '28px'
                }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a', whiteSpace: 'nowrap', paddingRight: '10px' }}>
                        à¤†à¤¯à¥.
                    </div>
                    <div style={{
                        flex: 1, fontSize: '18px', fontWeight: 900, color: '#111',
                        borderBottom: '2px solid #333', paddingBottom: '4px',
                        paddingLeft: '10px', paddingRight: '10px',
                        textAlign: 'left', minHeight: '24px'
                    }}>
                        {slip.name}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a', whiteSpace: 'nowrap', paddingLeft: '10px' }}>
                        à¤¯à¤¾à¤‚à¤œà¤•à¤¡à¥‚à¤¨
                    </div>
                </div>

                {/* Row 3: Shop + Location + Address â€” full width underline */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{
                        fontSize: '17px', fontWeight: 800, color: '#111',
                        borderBottom: '2px solid #333', paddingBottom: '4px',
                        paddingLeft: '4px', minHeight: '24px'
                    }}>
                        {slip.shop_name}{slip.location ? ` ,${slip.location}` : ''}
                        {slip.address ? ` , ${slip.address}` : ''}
                    </div>
                </div>

                {/* Row 4: à¤®à¥‹à¤¬à¤¾à¤ˆà¤² â€” full width underline */}
                <div style={{
                    display: 'flex', alignItems: 'baseline',
                    marginBottom: '24px'
                }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#1a1a1a', whiteSpace: 'nowrap', paddingRight: '10px' }}>
                        à¤®à¥‹à¤¬à¤¾à¤ˆà¤²
                    </div>
                    <div style={{
                        flex: 1, fontSize: '17px', fontWeight: 900, color: '#111',
                        borderBottom: '2px solid #333', paddingBottom: '4px',
                        paddingLeft: '10px', minHeight: '24px',
                        fontFamily: "'Segoe UI', monospace", letterSpacing: '1px'
                    }}>
                        {slip.mobile}
                    </div>
                </div>

                {/* Row 5: Purpose text with underline */}
                <div style={{
                    fontSize: '15px', fontWeight: 700, color: '#1a1a1a',
                    marginBottom: '8px', lineHeight: 1.8,
                    borderBottom: '2px solid #333', paddingBottom: '6px'
                }}>
                    à¤­à¤¾à¤°à¤¤à¤°à¤¤à¥à¤¨ à¤¡à¥‰. à¤¬à¤¾à¤¬à¤¾à¤¸à¤¾à¤¹à¥‡à¤¬ à¤†à¤‚à¤¬à¥‡à¤¡à¤•à¤° à¤œà¤¯à¤‚à¤¤à¥€ à¤®à¤¹à¥‹à¤¤à¥à¤¸à¤µà¤¾à¤¨à¤¿à¤®à¤¿à¤¤à¥à¤¤ à¤…à¤•à¥à¤·à¤°à¥€ à¤°à¥à¤ªà¤¯à¥‡
                </div>

                {/* Row 6: Amount display */}
                <div style={{
                    display: 'flex', alignItems: 'center',
                    marginTop: '16px', marginBottom: '16px', gap: '16px'
                }}>
                    <div style={{
                        width: '44px', height: '44px',
                        background: 'linear-gradient(135deg, #1a237e, #3949ab)',
                        borderRadius: '8px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: '22px', fontWeight: 900,
                        boxShadow: '0 3px 10px rgba(26,35,126,0.35)',
                        flexShrink: 0
                    }}>
                        â‚¹
                    </div>
                    <div style={{
                        flex: 1, fontSize: '34px', fontWeight: 900, color: '#1a237e',
                        letterSpacing: '1px', lineHeight: 1,
                        borderBottom: '2px solid #333', paddingBottom: '4px'
                    }}>
                        {Number(slip.amount).toLocaleString('en-IN')}/-
                    </div>
                </div>

                {/* Row 7: Acknowledgement */}
                <div style={{
                    fontSize: '16px', fontWeight: 700, color: '#1a1a1a',
                    marginTop: '12px', marginBottom: '12px', lineHeight: 1.6,
                    paddingTop: '8px'
                }}>
                    à¤¦à¥‡à¤£à¤—à¥€ à¤°à¥‹à¤– à¤®à¤¿à¤³à¤¾à¤²à¥€. à¤†à¤­à¤¾à¤°à¥€ à¤†à¤¹à¥‹à¤¤!
                </div>

                {/* Confirmed By */}
                {slip.confirmed_by_name && (
                    <div style={{
                        fontSize: '12px', fontWeight: 600, color: '#555',
                        marginTop: '4px'
                    }}>
                        Confirmed by: <span style={{ fontWeight: 900, color: '#1a237e' }}>{slip.confirmed_by_name}</span>
                        {slip.confirmed_at && (
                            <span style={{ marginLeft: '8px', color: '#888' }}>
                                ({new Date(slip.confirmed_at).toLocaleString('en-IN', {
                                    day: '2-digit', month: 'short', year: 'numeric',
                                    hour: '2-digit', minute: '2-digit', hour12: true
                                })})
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* ====== FOOTER â€” Blue with â‚¹, à¤§à¤¨à¥à¤¯à¤µà¤¾à¤¦!, à¤ªà¥à¤°à¤¾à¤¸à¤•à¤°à¥à¤¤à¤¾ ====== */}
        <div style={{
            background: 'linear-gradient(90deg, #0d1257, #1a237e, #283593, #1a237e, #0d1257)',
            padding: '20px 36px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
            {/* Left: Gold â‚¹ Badge */}
            <div style={{
                width: '48px', height: '48px',
                background: '#FFD700',
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#1a237e', fontSize: '24px', fontWeight: 900,
                boxShadow: '0 3px 10px rgba(0,0,0,0.3)'
            }}>
                â‚¹
            </div>

            {/* Center: à¤§à¤¨à¥à¤¯à¤µà¤¾à¤¦! */}
            <div style={{
                fontSize: '36px', fontWeight: 900, color: '#D32F2F',
                textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 0 30px rgba(211,47,47,0.3)',
                fontStyle: 'italic',
                letterSpacing: '5px'
            }}>
                à¤§à¤¨à¥à¤¯à¤µà¤¾à¤¦!
            </div>

            {/* Right: à¤ªà¥à¤°à¤¾à¤¸à¤•à¤°à¥à¤¤à¤¾ */}
            <div style={{
                fontSize: '18px', fontWeight: 900, color: 'white',
                letterSpacing: '4px',
                textShadow: '0 2px 4px rgba(0,0,0,0.4)'
            }}>
                à¤ªà¥à¤°à¤¾à¤¸à¤•à¤°à¥à¤¤à¤¾
            </div>
        </div>

        {/* ====== Powered By ====== */}
        <div style={{
            padding: '10px 36px',
            textAlign: 'center',
            background: '#0a0f3a'
        }}>
            <div style={{
                fontSize: '11px', color: '#AAAACC', fontWeight: 700,
                letterSpacing: '5px', textTransform: 'uppercase'
            }}>
                Powered by <span style={{ color: '#FFD700', fontWeight: 900 }}>busyhub.in</span>
            </div>
        </div>
    </div>
);


// ============================================
// Main Vargani Slip Tab Component
// ============================================

const VarganiSlipTab = () => {
    const { data: slips, isLoading, addSlip, updateSlip, confirmPayment, deleteSlip } = useVarganiSlips();

    // State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingSlip, setEditingSlip] = useState<VarganiSlip | null>(null);
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
        address: '',
        mobile: '',
        paymentStatus: 'paid' as 'paid' | 'pending',
        tentative_date: ''
    });

    // Edit Form State
    const [editData, setEditData] = useState({
        name: '',
        shop_name: '',
        amount: '',
        location: '',
        address: '',
        mobile: '',
        status: 'paid' as 'paid' | 'pending',
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
        setFormData({ name: '', shop_name: '', amount: '', location: '', address: '', mobile: '', paymentStatus: 'paid', tentative_date: '' });
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
            tentative_date: slip.tentative_date || ''
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
                mobile: editData.mobile.replace(/\s/g, ''),
                status: editData.status,
                tentative_date: editData.status === 'pending' ? editData.tentative_date : null
            });
            toast.success(`âœ… Slip updated for ${editData.name}`);
            setIsEditOpen(false);
            setEditingSlip(null);
        } catch (err: any) {
            toast.error(err.message || "Error updating slip");
        }
    };

    // Validate WhatsApp number
    const isValidMobile = (num: string) => /^[6-9]\d{9}$/.test(num.replace(/\s/g, ''));

    // Handle form submit
    const handleSubmit = async () => {
        if (!formData.name.trim()) return toast.error("à¤•à¥ƒà¤ªà¤¯à¤¾ à¤¨à¤¾à¤µ à¤­à¤°à¤¾ / Please enter name");
        if (!formData.shop_name.trim()) return toast.error("à¤•à¥ƒà¤ªà¤¯à¤¾ à¤¦à¥à¤•à¤¾à¤¨à¤¾à¤šà¥‡ à¤¨à¤¾à¤µ à¤­à¤°à¤¾ / Please enter shop name");
        if (!formData.amount || parseFloat(formData.amount) <= 0) return toast.error("à¤•à¥ƒà¤ªà¤¯à¤¾ à¤°à¤•à¥à¤•à¤® à¤­à¤°à¤¾ / Please enter valid amount");
        if (!formData.location.trim()) return toast.error("à¤•à¥ƒà¤ªà¤¯à¤¾ à¤ à¤¿à¤•à¤¾à¤£ à¤­à¤°à¤¾ / Please enter location");
        if (!isValidMobile(formData.mobile)) return toast.error("à¤•à¥ƒà¤ªà¤¯à¤¾ à¤µà¥ˆà¤§ 10 à¤…à¤‚à¤•à¥€ WhatsApp à¤¨à¤‚à¤¬à¤° à¤­à¤°à¤¾ / Please enter valid 10-digit WhatsApp number");
        if (formData.paymentStatus === 'pending' && !formData.tentative_date) return toast.error("à¤•à¥ƒà¤ªà¤¯à¤¾ à¤…à¤‚à¤¦à¤¾à¤œà¤¿à¤¤ à¤¤à¤¾à¤°à¥€à¤– à¤­à¤°à¤¾ / Please enter tentative date");

        try {
            const result = await addSlip.mutateAsync({
                name: formData.name.trim(),
                shop_name: formData.shop_name.trim(),
                amount: parseFloat(formData.amount),
                location: formData.location.trim(),
                address: formData.address.trim(),
                mobile: formData.mobile.replace(/\s/g, ''),
                status: formData.paymentStatus,
                tentative_date: formData.paymentStatus === 'pending' ? formData.tentative_date : null
            });

            toast.success(formData.paymentStatus === 'paid'
                ? `âœ… à¤ªà¤¾à¤µà¤¤à¥€ à¤¤à¤¯à¤¾à¤°! / Slip generated for ${formData.name}`
                : `â³ Pending entry saved for ${formData.name}`
            );

            // If paid, auto-trigger slip download
            if (formData.paymentStatus === 'paid' && result) {
                setTimeout(() => handleDownloadSlip(result), 500);
            }

            resetForm();
            setIsFormOpen(false);
        } catch (err: any) {
            toast.error(err.message || "à¤¤à¥à¤°à¥à¤Ÿà¥€ / Error saving slip");
        }
    };

    // Confirm pending payment
    const handleConfirmPayment = async (id: string) => {
        setConfirmingId(id);
        try {
            const result = await confirmPayment.mutateAsync(id);
            toast.success(`âœ… Payment confirmed for ${result.name}!`);
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

            toast.success("ðŸ“¥ Slip downloaded!");
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
                        title: `à¤µà¤°à¥à¤—à¤£à¥€ à¤ªà¤¾à¤µà¤¤à¥€ - ${slip.name}`,
                        text: `ðŸš© à¤°à¤¾à¤¹à¥à¤² à¤®à¤¿à¤¤à¥à¤° à¤®à¤‚à¤¡à¤³ - à¤µà¤°à¥à¤—à¤£à¥€ à¤ªà¤¾à¤µà¤¤à¥€\n\nà¤¨à¤¾à¤µ: ${slip.name}\nà¤°à¤•à¥à¤•à¤®: â‚¹${Number(slip.amount).toLocaleString('en-IN')}\nà¤ªà¤¾à¤µà¤¤à¥€: ${slip.slip_number}\n\nConfirmed by: ${slip.confirmed_by_name}\n\nPowered by busyhub.in`,
                        files: [file]
                    });
                    toast.success("âœ… Shared successfully!");
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

            const msg = `ðŸš© *à¤°à¤¾à¤¹à¥à¤² à¤®à¤¿à¤¤à¥à¤° à¤®à¤‚à¤¡à¤³ - à¤µà¤°à¥à¤—à¤£à¥€ à¤ªà¤¾à¤µà¤¤à¥€*\n\nà¤¨à¤¾à¤µ: ${slip.name}\nà¤¦à¥à¤•à¤¾à¤¨: ${slip.shop_name}\nà¤°à¤•à¥à¤•à¤®: â‚¹${Number(slip.amount).toLocaleString('en-IN')}\nà¤ªà¤¾à¤µà¤¤à¥€ à¤•à¥à¤°à¤®à¤¾à¤‚à¤•: ${slip.slip_number}\n\nConfirmed by: ${slip.confirmed_by_name}\n\nà¤†à¤ªà¤²à¥à¤¯à¤¾ à¤¸à¤¹à¤•à¤¾à¤°à¥à¤¯à¤¾à¤¬à¤¦à¥à¤¦à¤² à¤§à¤¨à¥à¤¯à¤µà¤¾à¤¦! ðŸ™\n\n_Powered by busyhub.in_`;
            window.open(`https://wa.me/91${slip.mobile}?text=${encodeURIComponent(msg)}`, '_blank');

            toast.success("ðŸ“¥ Slip downloaded! WhatsApp opened.");
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
                <div className="w-8 h-8 border-4 border-[#1D4ED8]/20 border-t-[#1D4ED8] rounded-full animate-spin" />
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
                            <Loader2 size={32} className="text-[#1D4ED8] animate-spin" />
                            <div className="text-sm font-black uppercase tracking-widest text-[#0F172A]">Generating Slip...</div>
                            <div className="text-[10px] text-[#0F172A]/50">Please wait</div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ======= Header ======= */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h2 className="text-xl font-display font-black text-[#0F172A]">à¤µà¤°à¥à¤—à¤£à¥€ à¤ªà¤¾à¤µà¤¤à¥€ / Vargani Slips</h2>
                    <p className="text-[10px] font-bold text-[#0F172A]/50 uppercase tracking-widest mt-1">Generate & manage vargani receipts</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsFormOpen(true); }}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1D4ED8] text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#B94A15] transition-all shadow-lg shadow-[#1D4ED8]/20"
                >
                    <Plus size={16} /> New Vargani Entry
                </button>
            </div>

            {/* ======= Stats ======= */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="p-4 md:p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1 md:mb-2">Total Entries</div>
                    <div className="text-xl md:text-3xl font-black text-[#0F172A]">{stats.total}</div>
                </div>
                <div className="p-4 md:p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-green-600 mb-1 md:mb-2">Collected</div>
                    <div className="text-xl md:text-3xl font-black text-green-600">â‚¹{stats.totalCollected.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-green-600/60 mt-1 hidden md:block">{stats.paidCount} Paid</div>
                </div>
                <div className="p-4 md:p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-red-500 mb-1 md:mb-2">Pending</div>
                    <div className="text-xl md:text-3xl font-black text-red-500">â‚¹{stats.totalPending.toLocaleString('en-IN')}</div>
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

            {/* ======= Filter + Search ======= */}
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
                            {f === 'all' ? `All (${stats.total})` : f === 'paid' ? `âœ… Paid (${stats.paidCount})` : `â³ Pending (${stats.pendingCount})`}
                        </button>
                    ))}
                </div>
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 shadow-sm"
                        placeholder="Search by name, shop, mobile, slip no..."
                    />
                </div>
            </div>

            {/* ======= Slips Table ======= */}
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
                            <div className="col-span-3 text-right">Actions</div>
                        </div>
                    </div>
                </div>

                {filteredSlips.length === 0 ? (
                    <div className="p-10 text-center">
                        <div className="text-4xl mb-3">ðŸ“ƒ</div>
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
                                {filteredSlips.map((slip) => (
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
                                            <div className="font-black text-[#0F172A] text-sm">â‚¹{Number(slip.amount).toLocaleString('en-IN')}</div>
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
                                                        âœ… {slip.confirmed_by_name}
                                                    </div>
                                                    <div className="text-[9px] text-[#0F172A]/40">
                                                        {slip.confirmed_at && new Date(slip.confirmed_at).toLocaleDateString('en-IN')}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className="text-[10px] text-amber-600 font-bold flex items-center gap-1">
                                                        <Calendar size={10} /> Tentative
                                                    </div>
                                                    <div className="text-[11px] text-[#0F172A] font-bold">
                                                        {slip.tentative_date ? new Date(slip.tentative_date).toLocaleDateString('en-IN') : 'Not set'}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-span-3 flex justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(slip)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-all"
                                            >
                                                <Edit3 size={12} /> Edit
                                            </button>
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
                                            <div className="font-bold text-[#0F172A]">{slip.name}</div>
                                            <div className="text-[10px] text-[#0F172A]/50 flex items-center gap-1 mt-0.5">
                                                <Store size={10} /> {slip.shop_name}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-black text-[#1D4ED8] text-lg">â‚¹{Number(slip.amount).toLocaleString('en-IN')}</div>
                                            <div className="text-[9px] text-[#0F172A]/40 font-mono">{slip.slip_number}</div>
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
                                            âœ… Confirmed by {slip.confirmed_by_name} â€¢ {slip.confirmed_at && new Date(slip.confirmed_at).toLocaleDateString('en-IN')}
                                        </div>
                                    )}

                                    <div className="flex gap-2 pt-1">
                                        <button
                                            onClick={() => openEditModal(slip)}
                                            className="flex items-center justify-center gap-1 py-2 px-3 bg-amber-50 text-amber-600 border border-amber-200 rounded-xl text-[10px] font-black uppercase"
                                        >
                                            <Edit3 size={12} /> Edit
                                        </button>
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
                                    <h3 className="text-xl font-display font-black text-[#0F172A]">à¤¨à¤µà¥€à¤¨ à¤µà¤°à¥à¤—à¤£à¥€ / New Entry</h3>
                                    <p className="text-[10px] text-[#0F172A]/50 font-bold uppercase tracking-widest mt-1">Fill in contribution details</p>
                                </div>
                                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <X size={18} className="text-[#0F172A]/60" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1">
                                        <User size={10} className="inline mr-1" /> à¤¨à¤¾à¤µ / Name *
                                    </label>
                                    <input
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
                                        placeholder="Enter full name"
                                    />
                                </div>

                                {/* Shop Name */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1">
                                        <Store size={10} className="inline mr-1" /> à¤¦à¥à¤•à¤¾à¤¨ / Shop Name *
                                    </label>
                                    <input
                                        value={formData.shop_name}
                                        onChange={e => setFormData({ ...formData, shop_name: e.target.value })}
                                        className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
                                        placeholder="Enter shop / business name"
                                    />
                                </div>

                                {/* Amount */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1">
                                        <IndianRupee size={10} className="inline mr-1" /> à¤°à¤•à¥à¤•à¤® / Amount (â‚¹) *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.amount}
                                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                        className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
                                        placeholder="e.g. 1500"
                                        min="1"
                                    />
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1">
                                        <MapPin size={10} className="inline mr-1" /> à¤ à¤¿à¤•à¤¾à¤£ / Location *
                                    </label>
                                    <input
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
                                        placeholder="e.g. Wanwadi, Pune"
                                    />
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1">
                                        <Home size={10} className="inline mr-1" /> à¤ªà¤¤à¥à¤¤à¤¾ / Address
                                    </label>
                                    <textarea
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 resize-none"
                                        placeholder="Full address (optional)"
                                        rows={2}
                                    />
                                </div>

                                {/* WhatsApp Number */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1">
                                        <Phone size={10} className="inline mr-1" /> WhatsApp Number *
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-[#0F172A]/60 bg-[#F5F5F0] border border-gray-200 rounded-xl px-3 py-3">+91</span>
                                        <input
                                            type="tel"
                                            value={formData.mobile}
                                            onChange={e => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                            className="flex-1 bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 font-mono"
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
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-3">
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
                                            <div className="text-[9px] text-[#0F172A]/40 mt-1">Slip will be generated</div>
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
                                            <div className="text-[9px] text-[#0F172A]/40 mt-1">No slip until paid</div>
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
                                                    <Calendar size={10} className="inline mr-1" /> à¤…à¤‚à¤¦à¤¾à¤œà¤¿à¤¤ à¤¤à¤¾à¤°à¥€à¤– / Tentative Payment Date *
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
                                    className="flex-1 py-3 text-[#0F172A]/70 font-bold text-sm bg-gray-100 rounded-xl hover:bg-gray-200"
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

            {/* ======= Edit Entry Modal ======= */}
            <AnimatePresence>
                {isEditOpen && editingSlip && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            className="bg-white rounded-2xl w-full max-w-lg p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-display font-black text-[#0F172A]">âœï¸ Edit Entry</h3>
                                    <p className="text-[10px] text-[#0F172A]/50 font-bold uppercase tracking-widest mt-1">
                                        Slip: {editingSlip.slip_number}
                                    </p>
                                </div>
                                <button onClick={() => { setIsEditOpen(false); setEditingSlip(null); }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <X size={18} className="text-[#0F172A]/60" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1">
                                        <User size={10} className="inline mr-1" /> à¤¨à¤¾à¤µ / Name *
                                    </label>
                                    <input value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })}
                                        className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1">
                                        <Store size={10} className="inline mr-1" /> à¤¦à¥à¤•à¤¾à¤¨ / Shop Name *
                                    </label>
                                    <input value={editData.shop_name} onChange={e => setEditData({ ...editData, shop_name: e.target.value })}
                                        className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1">
                                        <IndianRupee size={10} className="inline mr-1" /> à¤°à¤•à¥à¤•à¤® / Amount (â‚¹) *
                                    </label>
                                    <input type="number" value={editData.amount} onChange={e => setEditData({ ...editData, amount: e.target.value })}
                                        className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20" min="1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1">
                                        <MapPin size={10} className="inline mr-1" /> à¤ à¤¿à¤•à¤¾à¤£ / Location *
                                    </label>
                                    <input value={editData.location} onChange={e => setEditData({ ...editData, location: e.target.value })}
                                        className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1">
                                        <Home size={10} className="inline mr-1" /> à¤ªà¤¤à¥à¤¤à¤¾ / Address
                                    </label>
                                    <textarea value={editData.address} onChange={e => setEditData({ ...editData, address: e.target.value })}
                                        className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 resize-none" rows={2}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-1">
                                        <Phone size={10} className="inline mr-1" /> WhatsApp Number *
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-[#0F172A]/60 bg-[#F5F5F0] border border-gray-200 rounded-xl px-3 py-3">+91</span>
                                        <input type="tel" value={editData.mobile}
                                            onChange={e => setEditData({ ...editData, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                            className="flex-1 bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 font-mono" maxLength={10}
                                        />
                                    </div>
                                </div>

                                {/* Status Toggle */}
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#0F172A]/60 mb-3">
                                        Payment Status *
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button type="button" onClick={() => setEditData({ ...editData, status: 'paid' })}
                                            className={`p-3 rounded-xl border-2 text-center transition-all ${editData.status === 'paid' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <CheckCircle2 size={24} className={`mx-auto mb-1 ${editData.status === 'paid' ? 'text-green-500' : 'text-gray-300'}`} />
                                            <div className={`text-xs font-black uppercase ${editData.status === 'paid' ? 'text-green-600' : 'text-gray-500'}`}>Paid âœ…</div>
                                        </button>
                                        <button type="button" onClick={() => setEditData({ ...editData, status: 'pending' })}
                                            className={`p-3 rounded-xl border-2 text-center transition-all ${editData.status === 'pending' ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <Clock size={24} className={`mx-auto mb-1 ${editData.status === 'pending' ? 'text-amber-500' : 'text-gray-300'}`} />
                                            <div className={`text-xs font-black uppercase ${editData.status === 'pending' ? 'text-amber-600' : 'text-gray-500'}`}>Pending â³</div>
                                        </button>
                                    </div>
                                </div>

                                {/* Tentative Date (pending only) */}
                                <AnimatePresence>
                                    {editData.status === 'pending' && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                                <label className="block text-[10px] font-black uppercase tracking-widest text-amber-700 mb-2">
                                                    <Calendar size={10} className="inline mr-1" /> Tentative Date *
                                                </label>
                                                <input type="date" value={editData.tentative_date}
                                                    onChange={e => setEditData({ ...editData, tentative_date: e.target.value })}
                                                    className="w-full bg-white border border-amber-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/30"
                                                />
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
