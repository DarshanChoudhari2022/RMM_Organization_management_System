import { motion } from "framer-motion";
import { Heart, Users, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const Support = () => {
    return (
        <section className="bg-white py-24 md:py-32 relative overflow-hidden" id="support">
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <span className="text-shiv-saffron font-bold text-[11px] uppercase tracking-[0.3em] mb-4 block">Contribute & Serve</span>
                    <h2 className="text-shiv-navy text-4xl md:text-5xl font-black mb-6">Uphold <span className="text-shiv-saffron italic">The Legacy</span></h2>
                    <div className="w-20 h-1 bg-shiv-saffron mx-auto rounded-full mb-10" />
                    <p className="max-w-2xl mx-auto text-shiv-navy/60 font-sans leading-relaxed">
                        Every contribution helps us magnify the grand celebrations of Ambedkar Jayanti and sustain our community welfare programs throughout the year.
                    </p>
                </motion.div>

                {/* Donation Tracker */}
                <div className="max-w-4xl mx-auto mb-20 p-10 lg:p-14 bg-shiv-surface rounded-[40px] relative z-20 border border-shiv-saffron/10 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 gap-6">
                        <div className="text-center md:text-left">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-shiv-saffron mb-2">Current Utsav Fund</div>
                            <h3 className="text-2xl font-black text-shiv-navy tracking-tight">Shivrajyabhishek Sohala 2026</h3>
                        </div>
                        <div className="text-center md:text-right">
                            <span className="text-shiv-saffron font-black text-4xl">₹3,85,000</span>
                            <span className="text-shiv-navy/40 font-bold text-sm"> / ₹5,00,000</span>
                        </div>
                    </div>

                    <div className="w-full h-4 bg-white rounded-full overflow-hidden border border-shiv-saffron/10 mb-6 p-1">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: "77%" }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-shiv-saffron rounded-full relative"
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </motion.div>
                    </div>

                    <div className="flex justify-between items-center px-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-shiv-navy/40">
                            <Users size={14} className="text-shiv-saffron" />
                            840+ Local Contributors
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-shiv-saffron font-marathi">
                            ७७% पूर्ण झाले
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 text-left">
                    {/* Donate Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-12 bg-shiv-surface rounded-[40px] border border-transparent hover:border-shiv-saffron/20 hover:shadow-2xl hover:shadow-shiv-saffron/5 transition-all duration-500 group"
                    >
                        <Heart className="text-shiv-saffron mb-8 group-hover:scale-110 transition-transform duration-500" size={48} />
                        <h3 className="text-3xl font-black text-shiv-navy mb-6 tracking-tight">Make a Donation</h3>
                        <p className="text-shiv-navy/60 leading-relaxed mb-10 font-sans">
                            Your donation directly funds heritage weapons exhibitions, Dhol Tasha logistics, and grand decorative lighting for Dapodi.
                        </p>

                        <div className="space-y-4 mb-12">
                            {[
                                { amount: "₹1,100", label: "Heritage Sahayyak", desc: "Supports weapon exhibition setups" },
                                { amount: "₹5,001", label: "Mandal Mavala", desc: "Sponsors 10 student study kits" }
                            ].map((tier, i) => (
                                <div key={i} className="p-6 bg-white rounded-2xl border border-transparent hover:border-shiv-saffron/30 transition-all cursor-pointer group/tier flex items-center justify-between shadow-sm">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl font-black text-shiv-navy font-display">{tier.amount}</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-shiv-saffron px-2 py-0.5 bg-shiv-saffron/10 rounded">{tier.label}</span>
                                        </div>
                                        <div className="text-xs text-shiv-navy/40 font-medium">{tier.desc}</div>
                                    </div>
                                    <CheckCircle2 size={20} className="text-shiv-saffron opacity-0 group-hover/tier:opacity-100 transition-all" />
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <button className="btn-primary w-full sm:w-auto px-12">Donate Now</button>
                            <button className="text-[10px] font-black uppercase tracking-widest text-shiv-navy/40 hover:text-shiv-saffron transition-all p-4">
                                View Accounts
                            </button>
                        </div>
                    </motion.div>

                    {/* Join Panel - White/Orange Theme */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-12 bg-shiv-saffron rounded-[40px] text-white relative group overflow-hidden shadow-2xl"
                    >
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <div className="texture-overlay" />
                        </div>

                        <Users className="text-white mb-8 group-hover:scale-110 transition-transform duration-500 relative z-10" size={48} />
                        <h3 className="text-3xl font-black mb-6 tracking-tight relative z-10">Join the Mandal</h3>
                        <p className="text-white/80 leading-relaxed mb-10 font-sans relative z-10">
                            Become a registered volunteer of RAHUL MITRA MANDAL. Contribute to community leadership and event management at Dapodi.
                        </p>

                        <div className="space-y-6 mb-12 relative z-10">
                            {[
                                "Official Volunteer ID Card",
                                "Leadership Training Opportunities",
                                "Active Participation in Planning",
                                "Certificate of Social Impact"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                    </div>
                                    <span className="text-sm font-bold tracking-wide">{item}</span>
                                </div>
                            ))}
                        </div>

                        <Link to="/contact" className="inline-block px-12 py-5 bg-white text-shiv-saffron font-black uppercase tracking-widest text-[11px] rounded-full hover:bg-shiv-navy hover:text-white transition-all duration-300 relative z-10 shadow-xl shadow-black/10">
                            Volunteer Registration
                        </Link>
                    </motion.div>
                </div>

                {/* Supporters Preview */}
                <div className="pt-24 mt-20 border-t border-shiv-saffron/10">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-shiv-navy/30 mb-10 text-center">Patrons of Swarajya</div>
                    <div className="flex flex-wrap justify-center gap-16 opacity-40 hover:opacity-100 transition-opacity duration-700">
                        {["K. Deshmukh", "S. Dhone", "P. Barathe", "R. More", "M. Jagtap"].map(name => (
                            <div key={name} className="text-[12px] font-black uppercase tracking-[0.2em] text-shiv-navy">{name}</div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Support;
