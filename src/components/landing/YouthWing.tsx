import { motion } from "framer-motion";
import { Gamepad2, BrainCircuit, Trophy, Users } from "lucide-react";

const YouthWing = () => {
    return (
        <section className="bg-white py-24 md:py-32 relative overflow-hidden" id="youth">
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-shiv-saffron font-bold text-[11px] uppercase tracking-[0.3em] mb-6 block">Building Future Leaders</span>
                        <h2 className="text-shiv-navy text-4xl md:text-5xl lg:text-6xl mb-10 leading-tight font-display font-black">
                            The <span className="text-shiv-saffron italic">Yuva</span> Force
                        </h2>
                        <p className="text-lg text-shiv-navy/60 leading-relaxed font-sans mb-12 max-w-xl">
                            Our youth wing connects the energy of today's volunteers with the timeless discipline and strategic brilliance of Maharaja's administration.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
                            {[
                                { icon: BrainCircuit, title: "Historical Quizzes", desc: "Digital contests exploring Maratha strategy and fort architecture." },
                                { icon: Trophy, title: "Skill Development", desc: "Training sessions in leadership, public speaking, and traditional arts." },
                                { icon: Users, title: "Seva Mentorship", desc: "Engaging with elders in the community for heritage knowledge." },
                                { icon: Gamepad2, title: "Fort VR Tours", desc: "Virtual reality sessions exploring our historic forts for students." },
                            ].map((item, i) => (
                                <div key={i} className="group flex items-start gap-5">
                                    <div className="w-14 h-14 bg-shiv-surface rounded-2xl flex items-center justify-center text-shiv-saffron group-hover:bg-shiv-saffron group-hover:text-white transition-all duration-300 shadow-sm">
                                        <item.icon size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-[11px] font-black uppercase tracking-widest text-shiv-navy">{item.title}</h4>
                                        <p className="text-xs text-shiv-navy/40 leading-relaxed font-sans max-w-[200px]">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="aspect-square rounded-[60px] overflow-hidden border-8 border-shiv-surface relative group">
                            <img
                                src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2069"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                alt="Youth Engagement"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-shiv-navy/80 via-transparent to-transparent" />

                            <div className="absolute bottom-16 left-16 z-10">
                                <div className="text-shiv-saffron font-black text-7xl mb-2 tracking-tighter drop-shadow-lg">150+</div>
                                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Active Volunteers</div>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full border border-shiv-saffron/10 p-2 shadow-2xl animate-float">
                            <div className="w-full h-full bg-shiv-saffron rounded-full flex items-center justify-center text-center p-6 border-4 border-white shadow-inner">
                                <span className="text-white text-[10px] font-black uppercase tracking-widest leading-tight">Strength of Youth</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-shiv-saffron/5 rounded-full blur-[120px] pointer-events-none" />
        </section>
    );
};

export default YouthWing;
