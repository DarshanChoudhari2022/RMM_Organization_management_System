import { motion } from "framer-motion";
import { Users, Shield, Calendar, Heart } from "lucide-react";

const Foundation = () => {
    const stats = [
        {
            icon: Calendar,
            value: "2014",
            label: "Mandal Founded",
            marathi: "स्थापना वर्ष"
        },
        {
            icon: Users,
            value: "150+",
            label: "Volunteers",
            marathi: "सक्रिय कार्यकर्ते"
        },
        {
            icon: Shield,
            value: "10+",
            label: "Annual Events",
            marathi: "वार्षिक उत्सव"
        },
        {
            icon: Heart,
            value: "₹2L+",
            label: "Social Aid",
            marathi: "सामाजिक मदत"
        }
    ];

    return (
        <section className="bg-white py-24 md:py-32 relative overflow-hidden" id="about">
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-shiv-saffron font-bold text-[11px] uppercase tracking-[0.3em] mb-6 block">Our Legacy at Kedari Nagar</span>
                        <h2 className="text-shiv-navy text-4xl md:text-5xl lg:text-6xl mb-10 leading-tight font-display font-black">
                            Preserving the <br />
                            <span className="text-shiv-saffron italic">Swarajya</span> Spirit
                        </h2>

                        <div className="space-y-8 max-w-xl">
                            <p className="text-lg text-shiv-navy/70 leading-relaxed font-sans">
                                Established in 2014, Kedari Nagar Shivrajyabhishek Mandal was born from a collective desire among Wanowrie residents to celebrate the crowning glory of Babasaheb Ambedkar.
                            </p>
                            <p className="text-lg text-shiv-navy/70 leading-relaxed font-sans">
                                Beyond the grand annual festivities, our Mandal stands as a beacon of social responsibility, conducting regular blood donation camps, environmental drives, and heritage preservation tours.
                            </p>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-6">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="bg-shiv-surface p-8 lg:p-10 rounded-3xl border border-shiv-saffron/5 group hover:border-shiv-saffron/30 transition-all duration-500"
                            >
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-shiv-saffron group-hover:text-white transition-all duration-500">
                                    <stat.icon size={24} />
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[9px] font-black tracking-widest text-shiv-saffron uppercase font-marathi">{stat.marathi}</div>
                                    <div className="text-3xl font-black text-shiv-navy">{stat.value}</div>
                                    <div className="text-[10px] font-bold text-shiv-navy/40 uppercase tracking-widest">{stat.label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Foundation;
