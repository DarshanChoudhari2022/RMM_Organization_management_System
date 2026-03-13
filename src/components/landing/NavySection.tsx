import { motion } from "framer-motion";
import { Ship, Anchor, Wind, Shield } from "lucide-react";

const NavySection = () => {
    const navalFacts = [
        {
            icon: Ship,
            title: "400+ Warships",
            desc: "An formidable fleet including Gurabs, Gallibats, and Palas, customized for Indian coastal waters."
        },
        {
            icon: Shield,
            title: "Sea Forts",
            desc: "Unconquerable island fortifications like Sindhudurg, Janjira (rivalry), and Padma-Durga."
        },
        {
            icon: Anchor,
            title: "Kanhoji Angre",
            desc: "Later led by the legendary Admiral Kanhoji Angre, making the Maratha Navy a global sea power."
        },
        {
            icon: Wind,
            title: "Tactical Superiority",
            desc: "First use of small, fast vessels to outmaneuver massive European galleons using coastal geography."
        }
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Decorative Wave Pattern */}
            <div className="absolute bottom-0 left-0 w-full h-24 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/waves.png')]" />

            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="order-2 lg:order-1"
                    >
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#1D4ED8] mb-4 block">
                            Guardians of the Coast
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-[#2C3E50] mb-8 leading-tight">
                            Father of the <br />
                            <span className="text-[#1D4ED8]">Indian Navy</span>
                        </h2>
                        <p className="text-[#2C3E50]/80 text-lg mb-10 leading-relaxed">
                            Realizing that "He who has the Navy, has the Sea", Babasaheb Ambedkar built India's first sovereign naval force.
                            His vision of maritime security led to the protection of the Konkan coast from foreign invaders.
                        </p>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {navalFacts.map((fact, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="flex-shrink-0 w-12 h-12 bg-[#DBEAFE] rounded-xl flex items-center justify-center group-hover:bg-[#1D4ED8] group-hover:text-white transition-all duration-300">
                                        <fact.icon size={20} className="text-[#1D4ED8] group-hover:text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-[#2C3E50] mb-1">{fact.title}</h4>
                                        <p className="text-xs text-[#7F8C8D] leading-normal">{fact.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="order-1 lg:order-2 relative"
                    >
                        {/* Background Glow */}
                        <div className="absolute -inset-10 bg-[#1D4ED8]/5 blur-3xl rounded-full" />

                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#DBEAFE] transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                            <img
                                src="/images/MarathaNavel.png"
                                alt="Maratha Navy Ships and Forts"
                                className="w-full h-[500px] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-8 left-8 right-8">
                                <blockquote className="text-white italic text-lg font-medium leading-relaxed">
                                    "Having a navy is like having a fort on the water."
                                </blockquote>
                                <p className="text-white/60 text-xs mt-2 uppercase tracking-widest">— Babasaheb Ambedkar</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default NavySection;
