import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen, MapPin, Users, Calendar, Swords, Crown, Landmark, Star } from "lucide-react";
import { Link } from "react-router-dom";

const AboutSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section ref={ref} className="relative bg-muted py-24 md:py-32 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[200px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 md:mb-20"
                >
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-4 block">
                        The Architect of Modern India
                    </span>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-black text-secondary tracking-tight mb-6">
                        Babasaheb{" "}
                        <span className="text-primary italic">Ambedkar</span>
                    </h2>
                    <p className="text-foreground/80 text-base md:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
                        The chief architect of the Indian Constitution, a social reformer, and a visionary leader who
                        dedicated his life to justice, equality, and the empowerment of the marginalized.
                    </p>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative group"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative overflow-hidden rounded-2xl border border-primary/20 shadow-xl">
                            {/* 
                            Portrait of Babasaheb Ambedkar
                        */}
                            <img
                                src="/images/ambedkar-portrait.png"
                                alt="Dr. B.R. Ambedkar — Historical Portrait"
                                className="w-full h-[500px] md:h-[600px] object-cover object-top transform group-hover:scale-[1.02] transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold mb-1">
                                    Historical Portrait
                                </p>
                                <p className="text-white font-display font-bold text-lg">
                                    Babasaheb Ambedkar
                                </p>
                                <p className="text-white/50 text-xs mt-1">
                                    Source: British Museum Collection, London
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Key Facts */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            {[
                                {
                                    icon: Calendar,
                                    title: "Born — 14 April 1891",
                                    desc: "Born in Mhow, Central Provinces (now Madhya Pradesh). He was the 14th child of Ramji Maloji Sakpal and Bhimabai.",
                                    ref: "Ref: Dhananjay Keer, Dr. Ambedkar: Life and Mission, p. 1"
                                },
                                {
                                    icon: Users,
                                    title: "Parents — Ramji Sakpal & Bhimabai",
                                    desc: "Father Ramji served in the Indian Army. Despite belonging to the Mahar caste and facing severe discrimination, the family emphasized education.",
                                    ref: "Ref: Keer, Dr. Ambedkar: Life and Mission, Ch. 1"
                                },
                                {
                                    icon: Swords,
                                    title: "Education — Columbia & LSE",
                                    desc: "Earned doctorates from Columbia University and the London School of Economics. One of the most educated leaders of his time, breaking barriers of caste discrimination.",
                                    ref: "Ref: Keer, Dr. Ambedkar: Life and Mission, p. 38"
                                },
                                {
                                    icon: Crown,
                                    title: "Constitution — 26 November 1949",
                                    desc: "As Chairman of the Drafting Committee, he presented the Indian Constitution to the Constituent Assembly. It was adopted on 26 November 1949 and came into effect on 26 January 1950.",
                                    ref: "Ref: Granville Austin, The Indian Constitution, p. 15"
                                },
                                {
                                    icon: Landmark,
                                    title: "Social Reform — Annihilation of Caste",
                                    desc: "Led movements for Dalit rights, fought against untouchability, organized the Mahad Satyagraha (1927), and established educational institutions for the marginalized.",
                                    ref: "Ref: Ambedkar, Annihilation of Caste, 1936"
                                },
                                {
                                    icon: Star,
                                    title: "Legacy — Died 6 December 1956",
                                    desc: "Left behind the world's longest written constitution, a vision of social equality, and inspired millions to pursue education and self-respect. Awarded Bharat Ratna in 1990.",
                                    ref: "Ref: Keer, Dr. Ambedkar: Life and Mission, p. 498"
                                },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                                    className="clean-card group border-l-4 border-l-transparent hover:border-l-primary p-5 transition-all duration-300"
                                >
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <item.icon size={18} className="text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-foreground font-bold text-sm mb-1 group-hover:text-primary transition-colors">{item.title}</h4>
                                            <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
                                            <p className="text-primary/60 text-[10px] italic mt-2 font-medium">{item.ref}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <Link
                            to="/history"
                            className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-[0.2em] hover:gap-4 transition-all mt-6 md:mt-8 px-6 py-3 bg-white border border-primary/20 rounded-full shadow-sm hover:shadow-md hover:bg-primary/5 hover:text-primary active:scale-95"
                        >
                            <BookOpen size={16} />
                            Read Complete Timeline <span className="text-xl">→</span>
                        </Link>
                    </motion.div>
                </div>

                {/* About Mandal Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="relative"
                >
                    <div className="bg-white border border-primary/10 rounded-2xl p-8 md:p-12 shadow-xl">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-3 block">
                                    About Our Mandal
                                </span>
                                <h3 className="text-2xl md:text-3xl font-display font-black text-secondary mb-4">
                                    Rahul Mitra Mandal
                                </h3>
                                <p className="text-foreground/80 text-sm leading-relaxed mb-4">
                                    Since 2014, our Mandal in Dapodi Gavthan, Pune has been celebrating Ambedkar Jayanti
                                    on <strong className="text-primary">14th April</strong> every year with grand processions,
                                    educational events, and cultural programs to keep the spirit of social equality alive.
                                </p>
                                <p className="text-foreground/80 text-sm leading-relaxed">
                                    Our mission is to educate the youth about the life, achievements, and social reform
                                    principles of Babasaheb Ambedkar so that his legacy continues to inspire
                                    future generations.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { value: "12+", label: "Years Active" },
                                    { value: "14 Apr", label: "Ambedkar Jayanti" },
                                    { value: "100+", label: "Members" },
                                    { value: "2014", label: "Established" },
                                ].map((s, i) => (
                                    <div key={i} className="bg-muted rounded-xl p-5 text-center border border-primary/10 hover:shadow-md transition-all">
                                        <div className="text-2xl font-display font-black text-primary">{s.value}</div>
                                        <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-1">{s.label}</div>
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
