import { motion } from "framer-motion";
import { Shield, Swords, Users, Star } from "lucide-react";

const Highlights = () => {
    const items = [
        {
            icon: Swords,
            label: "मिरवणूक",
            title: "Grand Procession",
            desc: "A majestic display of traditional arts and Dhol Tasha Pathaks marching through the heart of Kedari Nagar."
        },
        {
            icon: Shield,
            label: "शिवकाळ प्रदर्शन",
            title: "Heritage Expo",
            desc: "Showcasing historical Maratha weapons, strategic battle maps, and detailed 3D models of our majestic forts."
        },
        {
            icon: Star,
            label: "शिवराज्याभिषेक",
            title: "Coronation Sohala",
            desc: "A solemn and grand reenactment of the 1674 coronation, bringing the golden era of Swarajya back to life."
        },
        {
            icon: Users,
            label: "समाज सेवा",
            title: "Community Seva",
            desc: "Impactful social outreach including mega blood donation drives and distribution of educational kits."
        }
    ];

    return (
        <section className="bg-shiv-surface py-24 md:py-32 relative overflow-hidden" id="highlights">
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <span className="text-shiv-saffron font-bold text-[11px] uppercase tracking-[0.3em] mb-4 block">Utsav Highlights</span>
                    <h2 className="text-shiv-navy text-4xl md:text-5xl font-black mb-6">Experience the <span className="text-shiv-saffron italic">Grandeur</span></h2>
                    <div className="w-20 h-1 bg-shiv-saffron mx-auto rounded-full" />
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {items.map((item, i) => (
                        <motion.div
                            key={i}
                            tabIndex={0}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="group p-10 bg-white rounded-3xl border border-transparent hover:border-shiv-saffron/20 hover:shadow-2xl hover:shadow-shiv-saffron/5 transition-all duration-500 text-center focus-visible:ring-2 focus-visible:ring-shiv-saffron focus-visible:outline-none"
                        >
                            <div className="w-16 h-16 bg-shiv-surface rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-shiv-saffron group-hover:text-white transition-all duration-500 shadow-sm">
                                <item.icon size={28} strokeWidth={1.5} />
                            </div>

                            <div className="text-[10px] font-black tracking-widest text-shiv-saffron uppercase mb-3 font-marathi">
                                {item.label}
                            </div>

                            <h3 className="text-shiv-navy text-xl font-bold mb-4 group-hover:text-shiv-saffron transition-colors leading-tight">
                                {item.title}
                            </h3>

                            <p className="text-shiv-navy/60 text-sm leading-relaxed font-sans">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Highlights;
