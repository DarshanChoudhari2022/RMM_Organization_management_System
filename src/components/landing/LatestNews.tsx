import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const newsItems = [
    {
        date: "Feb 15, 2026",
        title: "Dhol Tasha Pathak Practice Commences",
        titleMarathi: "ढोल ताशा पथकाचा सराव सुरू",
        excerpt: "Our 100-member strong 'RAHUL MITRA MANDAL Dhol Tasha Pathak' has started vigorous daily rehearsals for the upcoming grand procession.",
        image: "https://images.unsplash.com/photo-1620766182577-b8a9134a6ee1?q=80&w=2070",
        category: "Utsav Prep"
    },
    {
        date: "Jan 28, 2026",
        title: "Constitution Awareness Drive",
        titleMarathi: "संविधान जागृती अभियान",
        excerpt: "Our Mandal organized a grand rally through Dapodi to spread awareness about the fundamental rights and duties enshrined in the Indian Constitution.",
        image: "https://images.unsplash.com/photo-1627998672583-050f53198084?auto=format&fit=crop&q=80",
        category: "Awareness"
    },
    {
        date: "Jan 10, 2026",
        title: "Winter Blankets Distribution at Dapodi",
        titleMarathi: "थंडीत ऊब : कंबल वाटप उपक्रम",
        excerpt: "Our Mandal distributed 200 high-quality blankets to the needy residents and senior citizens in our community context.",
        image: "https://images.unsplash.com/photo-1576091160550-217359f4b84c?q=80&w=2070",
        category: "Social Work"
    }
];

const LatestNews = () => {
    return (
        <section className="bg-white py-24 md:py-32 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="text-left">
                        <span className="text-shiv-saffron font-bold text-[11px] uppercase tracking-[0.3em] mb-4 block">Mandal Bulletins</span>
                        <h2 className="text-shiv-navy text-4xl md:text-5xl font-black">Latest <span className="text-shiv-saffron italic">Activities</span></h2>
                    </div>
                    <Link to="/gallery" className="group flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-shiv-navy hover:text-shiv-saffron transition-all">
                        Full Activity Archive <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {newsItems.map((item, i) => (
                        <motion.article
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                            className="bg-shiv-surface rounded-[32px] overflow-hidden hover:shadow-2xl hover:shadow-shiv-saffron/10 transition-all duration-500 group border border-transparent hover:border-shiv-saffron/10"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden">
                                <img
                                    src={item.image}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt={item.title}
                                />
                                <div className="absolute top-6 left-6 bg-shiv-saffron text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg">
                                    {item.category}
                                </div>
                            </div>

                            <div className="p-10">
                                <div className="flex items-center gap-3 text-shiv-navy/40 text-[10px] font-black uppercase tracking-widest mb-6">
                                    <Calendar size={14} className="text-shiv-saffron" />
                                    {item.date}
                                </div>

                                <div className="font-marathi text-shiv-saffron text-lg font-bold mb-2 group-hover:text-shiv-saffron transition-colors">
                                    {item.titleMarathi}
                                </div>

                                <h3 className="text-shiv-navy text-xl font-bold mb-6 leading-tight min-h-[3rem] group-hover:text-shiv-saffron transition-colors">
                                    {item.title}
                                </h3>

                                <p className="text-shiv-navy/60 text-sm leading-relaxed mb-8 line-clamp-3 font-sans">
                                    {item.excerpt}
                                </p>

                                <button className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-shiv-navy group/link border-b-2 border-shiv-saffron/20 pb-1 hover:border-shiv-saffron transition-all">
                                    Read Report
                                    <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LatestNews;
