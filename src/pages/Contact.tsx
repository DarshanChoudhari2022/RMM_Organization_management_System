import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import Footer from "@/components/landing/Footer";

const Contact = () => {
    return (
        <div className="bg-shiv-cream min-h-screen pt-32">
            <div className="texture-overlay" />

            <div className="max-w-7xl mx-auto px-6 mb-24 relative z-10">
                <div className="text-center mb-20">
                    <div className="text-shiv-saffron font-bold text-[10px] uppercase tracking-shivTag mb-6">
                        Get In Touch
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-shiv-navy mb-8">
                        Connect With the <span className="text-shiv-saffron italic">Mandal</span>
                    </h1>
                    <p className="text-xl text-shiv-navy/60 font-serif max-w-2xl mx-auto italic">
                        Whether you want to join, volunteer, or contribute, we are here to hear from you.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-20">
                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-12"
                    >
                        <div className="grid sm:grid-cols-2 gap-8">
                            {[
                                { icon: MapPin, title: "Our Location", detail: "Kedari Nagar, Wanowrie, Pune - 411040" },
                                { icon: Phone, title: "Hotline", detail: "+91 98765 43210 (10 AM - 8 PM)" },
                                { icon: Mail, title: "Email Us", detail: "contact@shivgarjana.in" },
                                { icon: MessageCircle, title: "WhatsApp", detail: "Connect for instant updates" },
                            ].map((item, i) => (
                                <div key={i} className="p-8 border border-shiv-gold/10 bg-white group hover:border-shiv-saffron/30 transition-all shadow-sm">
                                    <item.icon className="text-shiv-saffron mb-6 group-hover:scale-110 transition-transform" size={32} />
                                    <h3 className="text-xs font-black uppercase tracking-widest text-shiv-navy mb-2">{item.title}</h3>
                                    <p className="text-sm text-shiv-navy/60 font-serif italic">{item.detail}</p>
                                </div>
                            ))}
                        </div>

                        <div className="p-10 bg-shiv-navy text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:scale-110 transition-transform duration-700">
                                <MessageCircle size={100} />
                            </div>
                            <h3 className="text-2xl font-black mb-4">Quick Communication</h3>
                            <p className="text-white/60 font-serif italic mb-8 max-w-sm">
                                Join our WhatsApp community group to receive live updates about events and social drives.
                            </p>
                            <button className="px-10 py-4 bg-green-600 text-white font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-green-700 transition-colors">
                                <MessageCircle size={18} /> Join WhatsApp Group
                            </button>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="p-10 bg-white border border-shiv-gold/10 shadow-2xl"
                    >
                        <form className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-shiv-navy/40 block mb-2">Subject</label>
                                    <select className="w-full bg-shiv-cream border border-shiv-gold/10 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-shiv-saffron">
                                        <option>General Inquiry</option>
                                        <option>Volunteer Registration</option>
                                        <option>Donation Inquiry</option>
                                        <option>Membership Portal Issue</option>
                                        <option>Event Information</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-shiv-navy/40 block mb-2">Full Name</label>
                                    <input type="text" className="w-full bg-shiv-cream border border-shiv-gold/10 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-shiv-saffron" placeholder="Enter your name" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-shiv-navy/40 block mb-2">Email Address</label>
                                <input type="email" className="w-full bg-shiv-cream border border-shiv-gold/10 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-shiv-saffron" placeholder="Enter your email" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-shiv-navy/40 block mb-2">Message</label>
                                <textarea rows={5} className="w-full bg-shiv-cream border border-shiv-gold/10 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-shiv-saffron" placeholder="How can we help you?"></textarea>
                            </div>
                            <button className="btn-primary w-full flex items-center justify-center gap-4 py-5">
                                Send Message <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Contact;
