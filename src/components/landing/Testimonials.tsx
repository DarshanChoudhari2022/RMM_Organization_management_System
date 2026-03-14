import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
    {
        name: "Vijay Deshpande",
        role: "Dapodi Resident",
        content: "The Rahul Mitra Mandal has transformed our neighborhood's spirit. Their discipline during the grand procession is unmatched, and their social work is truly inspiring.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?bg=202020&fit=crop&h=150&q=80&w=150"
    },
    {
        name: "Anjali Kadam",
        role: "Youth Volunteer",
        content: "Being part of the Youth Wing has taught me so much about our heritage. It's not just about the celebrations; it's about the core values Babasaheb Ambedkar stood for.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?bg=202020&fit=crop&h=150&q=80&w=150"
    },
    {
        name: "Suresh Kedari",
        role: "Social Activist",
        content: "I've seen many Mandals, but RAHUL MITRA MANDAL's commitment to clean and purposeful celebrations is remarkable. Their blood donation drives are a lifesaver for the community.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?bg=202020&fit=crop&h=150&q=80&w=150"
    }
];

const Testimonials = () => {
    return (
        <section className="bg-white py-24 md:py-32 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <span className="text-shiv-saffron font-bold text-[11px] uppercase tracking-[0.3em] mb-4 block">Voice of the People</span>
                    <h2 className="text-shiv-navy text-4xl md:text-5xl font-black mb-6">Community <span className="text-shiv-saffron italic">Reflections</span></h2>
                    <div className="w-20 h-1 bg-shiv-saffron mx-auto rounded-full" />
                </motion.div>

                <div className="grid md:grid-cols-3 gap-12">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-shiv-surface p-12 rounded-[48px] border border-shiv-saffron/10 hover:border-shiv-saffron/30 hover:shadow-2xl hover:shadow-shiv-saffron/5 transition-all duration-500 group relative"
                        >
                            <div className="absolute top-10 right-10 opacity-10 group-hover:opacity-100 group-hover:text-shiv-saffron transition-all duration-500">
                                <Quote size={40} />
                            </div>

                            <p className="text-shiv-navy/70 text-lg leading-relaxed mb-10 font-sans relative z-10">
                                "{t.content}"
                            </p>

                            <div className="flex items-center gap-5 relative z-10">
                                <div className="w-16 h-16 rounded-3xl overflow-hidden border-2 border-shiv-saffron/30 shadow-xl group-hover:scale-110 transition-transform duration-500">
                                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-shiv-navy font-black text-lg leading-none">{t.name}</h4>
                                    <p className="text-shiv-saffron font-bold text-[10px] uppercase tracking-widest">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-shiv-saffron/5 rounded-full blur-[150px] pointer-events-none" />
        </section>
    );
};

export default Testimonials;
