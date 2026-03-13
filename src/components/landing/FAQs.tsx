import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const faqs = [
    {
        question: "How can I participate in the grand procession?",
        answer: "You can participate by joining our Dhol Tasha Pathak practice sessions starting Feb 15th, or by registering as a volunteer for crowd management and logistics."
    },
    {
        question: "Is there an entry fee for the Heritage Expo?",
        answer: "No, the Maratha Heritage Expo organized by Rahul Mitra Mandal is completely free for all residents and visitors to encourage historical awareness."
    },
    {
        question: "How does the Mandal use my donations?",
        answer: "Donations are used for event logistics (lighting, sound, security), social initiatives like medical camps, and educational aid for underprivileged students in Wanowrie."
    },
    {
        question: "Can I join the Dhol Tasha Pathak?",
        answer: "Yes! We welcome enthusiasts of all skill levels. Practice sessions happen daily at the Mandal ground from 6 PM to 9 PM."
    }
];

const FAQs = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="bg-shiv-surface py-24 md:py-32 relative overflow-hidden" id="faq">
            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-shiv-saffron font-bold text-[11px] uppercase tracking-[0.3em] mb-4 block">Help Center</span>
                    <h2 className="text-shiv-navy text-4xl md:text-5xl font-black mb-6">Common <span className="text-shiv-saffron italic">Enquiries</span></h2>
                    <div className="w-20 h-1 bg-shiv-saffron mx-auto rounded-full" />
                </motion.div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`rounded-[32px] overflow-hidden transition-all duration-500 border ${openIndex === i ? "bg-white border-shiv-saffron/20 shadow-xl shadow-shiv-saffron/5" : "bg-white/50 border-transparent hover:border-shiv-saffron/10"
                                }`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full p-8 md:p-10 flex items-center justify-between text-left group"
                            >
                                <span className={`text-lg md:text-xl font-bold transition-colors ${openIndex === i ? "text-shiv-saffron" : "text-shiv-navy group-hover:text-shiv-saffron/70"}`}>
                                    {faq.question}
                                </span>
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${openIndex === i ? "bg-shiv-saffron text-white rotate-180" : "bg-shiv-surface text-shiv-navy"}`}>
                                    {openIndex === i ? <Minus size={20} /> : <Plus size={20} />}
                                </div>
                            </button>

                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                    >
                                        <div className="px-8 md:px-10 pb-10">
                                            <div className="w-full h-px bg-shiv-saffron/10 mb-8" />
                                            <p className="text-shiv-navy/60 leading-relaxed font-sans text-lg">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-shiv-navy/40 text-sm font-sans">
                        Have more questions? <Link to="/contact" className="text-shiv-saffron font-bold hover:underline">Connect with us directly.</Link>
                    </p>
                </div>
            </div>
        </section>
    );
};

export default FAQs;
