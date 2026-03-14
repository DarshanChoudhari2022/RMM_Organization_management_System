import { motion } from "framer-motion";
import { Heart, Users, School, Landmark, ArrowRight, CheckCircle2 } from "lucide-react";
import Footer from "@/components/landing/Footer";

const initiatives = [
    {
        title: "Ambedkarite Literature Drive",
        titleMarathi: "आंबेडकरवादी साहित्य प्रसार",
        category: "Education",
        icon: Landmark,
        description: "Distributing books and literature about Babasaheb Ambedkar's philosophy to local libraries.",
        metrics: "50+ Libraries supported",
        impact: "Promoting the vision of educated and informed community."
    },
    {
        title: "Rural Education Sponsorship",
        titleMarathi: "ग्रामीण शिक्षण साहाय्य",
        category: "Education",
        icon: School,
        description: "Providing stationery, books, and scholarship funds to students in peripheral Pune villages.",
        metrics: "500+ Students supported",
        impact: "Ensured uninterrupted schooling for underprivileged children."
    },
    {
        title: "Community Health Hub",
        titleMarathi: "आरोग्य शिबिर",
        category: "Health",
        icon: Heart,
        description: "Quarterly free health checkup camps and blood donation drives in Dapodi Gavthan.",
        metrics: "2.5k Beneficiaries",
        impact: "Early diagnosis and medical support for daily wage workers."
    },
    {
        title: "Youth Leadership Wing",
        titleMarathi: "युवा नेतृत्व",
        category: "Community",
        icon: Users,
        description: "Training the next generation in constitutional rights and leadership skills.",
        metrics: "150+ Volunteers",
        impact: "Creating responsible citizens rooted in Constitutional values."
    }
];

const Impact = () => {
    return (
        <div className="bg-shiv-cream min-h-screen pt-32">
            <div className="texture-overlay" />

            <div className="max-w-7xl mx-auto px-6 mb-24 relative z-10">
                <div className="text-center mb-24">
                    <div className="text-shiv-saffron font-bold text-[10px] uppercase tracking-shivTag mb-6">
                        Our Mission in Action
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black text-shiv-navy mb-8">
                        Community <span className="text-shiv-saffron italic">Impact</span>
                    </h1>
                    <p className="text-xl text-shiv-navy/60 font-serif max-w-3xl mx-auto italic leading-relaxed">
                        Beyond the celebrations, RAHUL MITRA MANDAL works tirelessly for social welfare and heritage preservation.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {initiatives.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group p-10 bg-white border border-shiv-gold/10 hover:border-shiv-saffron/30 transition-all shadow-xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 text-shiv-navy/5 group-hover:scale-110 transition-transform duration-700">
                                <item.icon size={120} />
                            </div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-shiv-saffron/10 flex items-center justify-center text-shiv-saffron mb-8">
                                    <item.icon size={32} />
                                </div>

                                <div className="flex flex-col mb-6">
                                    <span className="logo-marathi text-2xl text-shiv-navy mb-2">{item.titleMarathi}</span>
                                    <h3 className="text-2xl font-black text-shiv-navy group-hover:text-shiv-saffron transition-colors">
                                        {item.title}
                                    </h3>
                                </div>

                                <p className="text-shiv-navy/60 font-serif italic text-lg leading-relaxed mb-8">
                                    {item.description}
                                </p>

                                <div className="grid sm:grid-cols-2 gap-8 pt-8 border-t border-shiv-gold/10">
                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-shiv-navy/40 mb-2">Metrics</div>
                                        <div className="text-xl font-black text-shiv-navy">{item.metrics}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-shiv-navy/40 mb-2">Primary Impact</div>
                                        <div className="text-sm text-shiv-navy/70 font-serif italic">{item.impact}</div>
                                    </div>
                                </div>

                                <button className="mt-10 flex items-center gap-3 text-xs font-black uppercase tracking-widest text-shiv-navy hover:text-shiv-saffron transition-colors">
                                    Read Case Study <ArrowRight size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Accountability Section */}
                <section className="mt-32 p-12 bg-shiv-navy text-white relative overflow-hidden">
                    <div className="texture-overlay opacity-10" />
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="max-w-xl">
                            <h2 className="text-3xl md:text-4xl font-black mb-6">Transparency & Accountability</h2>
                            <p className="text-white/60 font-serif italic mb-8">
                                Download our audited annual reports and social impact whitepapers. We ensure every rupee contributed goes to the intended cause.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                {[2025, 2024, 2023].map(year => (
                                    <button key={year} className="px-6 py-3 bg-white/10 hover:bg-shiv-saffron text-white text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2">
                                        <CheckCircle2 size={14} /> Annual Report {year}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="text-center lg:text-right">
                            <div className="text-6xl font-black text-shiv-gold mb-2">80G</div>
                            <div className="text-xs font-black uppercase tracking-[0.3em] text-white/40">Tax Exempt Donations</div>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
};

export default Impact;
