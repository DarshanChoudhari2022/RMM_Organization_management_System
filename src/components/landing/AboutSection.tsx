import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen, MapPin, Users, Calendar, Swords, Crown, Landmark, Star, Scale, GraduationCap, HeartHandshake, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const AboutSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const missionCards = [
        {
            title: "Equality",
            icon: Scale,
            desc: "Striving for a society free from caste discrimination, where every individual is treated with absolute dignity and respect."
        },
        {
            title: "Education",
            icon: GraduationCap,
            desc: "Empowering the youth through knowledge, guided by Babasaheb's core mantra: 'Educate, Agitate, Organize'."
        },
        {
            title: "Social Justice",
            icon: HeartHandshake,
            desc: "Actively working to uplift the marginalized and ensure equal opportunities are accessible to all sections of society."
        }
    ];

    return (
        <section ref={ref} id="about" className="relative bg-[#081221] py-24 md:py-32 overflow-hidden border-t border-primary/10">
            {/* Background Texture & Glow */}
            <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/ag-square.png')]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                
                {/* Mission Statements (From Stitch Generation) */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="grid md:grid-cols-3 gap-8 mb-32"
                >
                    {missionCards.map((card, idx) => (
                        <div key={idx} className="bg-card/40 backdrop-blur-md border border-primary/20 rounded-2xl p-8 hover:border-primary/50 transition-colors group">
                            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                <card.icon size={28} className="text-primary" />
                            </div>
                            <h3 className="text-2xl font-display font-bold text-foreground mb-4">{card.title}</h3>
                            <p className="text-foreground/70 font-sans leading-relaxed">{card.desc}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-center mb-16 md:mb-20"
                >
                    <span className="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-primary mb-4 block">
                        The Architect of Modern India
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-black text-foreground tracking-tight mb-6">
                        Babasaheb{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#E5C158] italic">Ambedkar</span>
                    </h2>
                    <p className="text-foreground/70 text-base md:text-xl max-w-3xl mx-auto font-sans font-light leading-relaxed">
                        The chief architect of the Indian Constitution, an unparalleled social reformer, and a visionary leader who
                        dedicated his life to justice, equality, and the absolute empowerment of the marginalized.
                    </p>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid xl:grid-cols-5 gap-12 lg:gap-16 items-center mb-24">
                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="relative group xl:col-span-2"
                    >
                        <div className="absolute -inset-2 bg-gradient-to-br from-primary/30 to-transparent rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative overflow-hidden rounded-[2rem] border border-primary/30 shadow-2xl shadow-black/60">
                            <img
                                src="/images/ambedkar-portrait.png"
                                alt="Dr. B.R. Ambedkar — Historical Portrait"
                                className="w-full h-[500px] md:h-[600px] object-cover object-top transform group-hover:scale-[1.03] transition-transform duration-700 sepia-[0.2]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-[#0B192C]/50 to-transparent opacity-90" />
                            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                                <div className="w-10 h-1 bg-primary mb-6" />
                                <p className="text-[10px] text-primary uppercase tracking-[0.3em] font-black mb-2">
                                    Historical Portrait
                                </p>
                                <p className="text-foreground font-display font-bold text-2xl md:text-3xl mb-2 drop-shadow-md">
                                    Dr. B.R. Ambedkar
                                </p>
                                <p className="text-foreground/50 text-xs font-sans">
                                    Source: British Museum Collection, London
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Key Facts */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="space-y-4 xl:col-span-3"
                    >
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                {
                                    icon: Calendar,
                                    title: "Born — 14 April 1891",
                                    desc: "Born in Mhow, Central Provinces (now Madhya Pradesh). The 14th child of Ramji & Bhimabai.",
                                },
                                {
                                    icon: Swords,
                                    title: "Education — Columbia & LSE",
                                    desc: "Earned doctorates from Columbia University and the London School of Economics against all odds.",
                                },
                                {
                                    icon: Crown,
                                    title: "Constitution — 1949",
                                    desc: "Chairman of the Drafting Committee. Presented the Indian Constitution to the Assembly.",
                                },
                                {
                                    icon: Landmark,
                                    title: "Social Reform",
                                    desc: "Led movements for Dalit rights, fought untouchability, organized the historic Mahad Satyagraha.",
                                },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                                    className="bg-card/40 backdrop-blur-sm border border-primary/10 hover:border-primary/40 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                            <item.icon size={18} className="text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="text-foreground font-bold font-sans text-sm mb-2">{item.title}</h4>
                                            <p className="text-foreground/60 text-xs leading-relaxed font-sans">{item.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="pt-6">
                            <Link
                                to="/history"
                                className="inline-flex items-center gap-3 text-primary font-black uppercase tracking-[0.2em] hover:text-[#E5C158] transition-colors py-4 group text-sm"
                            >
                                <BookOpen size={18} />
                                View Full Biography 
                                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* About Mandal Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    <div className="relative overflow-hidden bg-card/60 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 md:p-16 shadow-2xl">
                        {/* Decorative Background for Card */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                        
                        <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4 block">
                                    About Our Organization
                                </span>
                                <h3 className="text-3xl md:text-4xl font-display font-black text-foreground mb-6 leading-tight">
                                    Rahul Mitra Mandal <br/>
                                    <span className="text-foreground/50 text-2xl font-sans font-light">Pune</span>
                                </h3>
                                <p className="text-foreground/70 text-base font-light leading-relaxed mb-6 font-sans">
                                    Established in 2014, our Mandal in Dapodi Gavthan has been passionately celebrating Ambedkar Jayanti
                                    on <strong className="text-primary font-bold">14th April</strong> every year with grand processions,
                                    educational campaigns, and cultural programs to keep the spirit of social equality brilliantly alive.
                                </p>
                                <p className="text-foreground/70 text-base font-light leading-relaxed font-sans">
                                    Our core mission is to actively educate the youth about the monumental life, achievements, and reform
                                    principles of Babasaheb Ambedkar, ensuring his legacy continues to heavily inspire our generations to come.
                                </p>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[
                                    { value: "12+", label: "Years Active" },
                                    { value: "14 Apr", label: "Jayanti Celebration" },
                                    { value: "100+", label: "Active Members" },
                                    { value: "2014", label: "Year Established" },
                                ].map((s, i) => (
                                    <div key={i} className="bg-background/40 backdrop-blur-sm rounded-2xl p-6 text-center border border-primary/10 hover:border-primary/40 transition-colors">
                                        <div className="text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#E5C158] mb-2">{s.value}</div>
                                        <div className="text-[10px] text-foreground/60 uppercase tracking-widest font-black font-sans">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutSection;
