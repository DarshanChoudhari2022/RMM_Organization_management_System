import { useParams } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CheckCircle2, Shield, Loader2, Handshake, Info, Landmark, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { supabase as supabaseClient } from "@/lib/supabase";
import { Supplier } from "@/types/admin";

const supabase = supabaseClient as any;

const ConfirmSupplier = () => {
    const { id } = useParams<{ id: string }>();
    const [submitted, setSubmitted] = useState(false);

    // Fetch Supplier Details
    const { data: supplier, isLoading } = useQuery({
        queryKey: ["supplier-confirmation", id],
        queryFn: async () => {
            if (!id) return null;
            const { data, error } = await supabase
                .from('suppliers')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data as Supplier;
        },
        enabled: !!id
    });

    // Confirm Mutation
    const confirmMutation = useMutation({
        mutationFn: async () => {
            if (!id) throw new Error("Missing ID");
            const { error } = await supabase
                .from('suppliers')
                .update({
                    is_confirmed: true,
                    confirmed_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            setSubmitted(true);
        }
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
                <Loader2 className="animate-spin text-[#D95D1E]" size={40} />
            </div>
        );
    }

    if (!supplier) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-center">
                <Landmark className="text-gray-300 mb-4" size={48} />
                <h1 className="text-xl font-bold text-[#2C1810]">पुरवठादार सापडला नाही</h1>
                <p className="text-gray-500 mt-2">Invalid or expired link. Please contact the administrator.</p>
            </div>
        );
    }

    if (submitted || supplier.is_confirmed) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 text-black">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-sm w-full text-center"
                >
                    <div className="w-24 h-24 bg-green-500 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-xl shadow-green-500/20">
                        <CheckCircle2 size={48} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-display font-black text-[#2C1810] mb-3">धन्यवाद!</h1>
                    <p className="text-gray-600 font-medium">
                        Agreement Confirmed successfully.
                    </p>
                    <div className="mt-8 p-4 bg-white rounded-2xl border border-green-100 shadow-sm">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-green-600 mb-2">Details Confirmed for</div>
                        <div className="text-lg font-bold text-[#2C1810]">{supplier.name}</div>
                        <div className="text-sm text-gray-500 mt-1">{supplier.category} Services</div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-12 font-black uppercase tracking-widest">श्रीमंत शिवगर्जना प्रतिष्ठान • पुणे</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 relative overflow-hidden text-black">
            {/* Background patterns */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#D95D1E] rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D95D1E] rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full relative z-10"
            >
                <div className="bg-white border border-gray-100 shadow-2xl rounded-[2.5rem] p-8 md:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#D95D1E]/10 rounded-full blur-xl"></div>
                                <img src="/images/logo.png" alt="Logo" className="w-24 h-24 object-contain relative transition-transform hover:scale-105" />
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#D95D1E]/10 text-[#D95D1E] rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                            <Shield size={14} /> Agreement Confirmation
                        </div>
                        <h1 className="text-3xl font-display font-black text-[#2C1810] mb-2">{supplier.name}</h1>
                        <p className="text-gray-500 text-sm font-medium">{supplier.category} Service Provider</p>
                    </div>

                    {/* Details Card */}
                    <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 space-y-6 mb-8">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm text-[#D95D1E]">
                                <Handshake size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Agreed Amount</div>
                                <div className="text-2xl font-black text-[#2C1810]">₹{supplier.total_amount?.toLocaleString()}</div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm text-green-600">
                                <Landmark size={20} />
                            </div>
                            <div className="flex-1">
                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Advance Received</div>
                                <div className="text-2xl font-black text-green-600">₹{supplier.paid_amount?.toLocaleString() || 0}</div>
                                <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">
                                    Remaining: ₹{((supplier.total_amount || 0) - (supplier.paid_amount || 0)).toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 mb-3">
                                <Info size={14} className="text-[#D95D1E]" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Terms & Conditions</span>
                            </div>
                            <p className="text-sm font-medium text-[#2C1810] leading-relaxed italic bg-white/50 p-4 rounded-xl border border-gray-100">
                                "{supplier.terms || "Standard terms as per discussion."}"
                            </p>
                        </div>
                    </div>

                    {/* Action */}
                    <button
                        onClick={() => confirmMutation.mutate()}
                        disabled={confirmMutation.isPending}
                        className="w-full bg-[#D95D1E] text-white py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm shadow-xl shadow-[#D95D1E]/30 hover:bg-[#B94A15] transition-all active:scale-95 disabled:opacity-50"
                    >
                        {confirmMutation.isPending ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <CheckCircle2 size={24} /> संमती कळवा (Confirm Now)
                            </>
                        )}
                    </button>

                    <p className="text-center mt-6 text-[10px] text-gray-400 font-medium">
                        By clicking confirm, you agree to the terms and amounts mentioned above.
                    </p>
                </div>

                <div className="mt-8 text-center flex items-center justify-center gap-8">
                    <div className="flex flex-col items-center gap-1 opacity-40">
                        <div className="w-1.5 h-1.5 bg-[#D95D1E] rounded-full"></div>
                        <div className="text-[8px] font-black uppercase tracking-widest">Swarajya</div>
                    </div>
                    <div className="flex flex-col items-center gap-1 opacity-40">
                        <div className="w-1.5 h-1.5 bg-[#D95D1E] rounded-full"></div>
                        <div className="text-[8px] font-black uppercase tracking-widest">Mandal</div>
                    </div>
                    <div className="flex flex-col items-center gap-1 opacity-40">
                        <div className="w-1.5 h-1.5 bg-[#D95D1E] rounded-full"></div>
                        <div className="text-[8px] font-black uppercase tracking-widest">Audit</div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ConfirmSupplier;
