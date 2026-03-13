import { Link } from "react-router-dom";
import { Crown, MapPin, Phone, Mail, ArrowUpRight, Instagram, Facebook } from "lucide-react";

const Footer = () => {
    return (
        <footer className="w-full bg-[#F8FAFC] pt-[60px] pb-0 border-t-2 border-[#DBEAFE]">
            <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-[60px]">
                {/* About */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <span className="text-[32px] font-display font-black text-[#1D4ED8] leading-none">श</span>
                        <div className="flex flex-col">
                            <span className="text-[14px] font-display font-bold text-[#1D4ED8] uppercase tracking-widest leading-none">RAHUL MITRA MANDAL</span>
                        </div>
                    </div>
                    <p className="text-[13px] text-[#2C3E50] leading-[1.6] max-w-[280px]">
                        Celebrating the legacy of Babasaheb Ambedkar through education, culture, and community engagement at Wanowrie, Pune.
                    </p>
                    <div className="flex gap-4 mt-2">
                        <a href="https://instagram.com/rahulmitramandal_wanowrie" className="w-9 h-9 bg-white border border-[#DBEAFE] rounded-full flex items-center justify-center text-[#1D4ED8] hover:bg-[#1D4ED8] hover:text-white transition-all shadow-sm">
                            <Instagram size={18} />
                        </a>
                        <a href="https://facebook.com/rahulmitramandal.wanowrie" className="w-9 h-9 bg-white border border-[#DBEAFE] rounded-full flex items-center justify-center text-[#1D4ED8] hover:bg-[#1D4ED8] hover:text-white transition-all shadow-sm">
                            <Facebook size={18} />
                        </a>
                    </div>
                </div>

                {/* Navigate */}
                <div>
                    <h4 className="text-[11px] font-sans font-bold text-[#1D4ED8] uppercase tracking-[0.2em] mb-6">NAVIGATE</h4>
                    <ul className="flex flex-col gap-3">
                        {[
                            { name: "Home", path: "/" },
                            { name: "History & Timeline", path: "/history" },
                            { name: "About Ambedkar", path: "/history" },
                            { name: "Photo Gallery", path: "/gallery" },
                        ].map((item) => (
                            <li key={item.name}>
                                <Link to={item.path} className="text-[13px] text-[#2C3E50] hover:text-[#1D4ED8] hover:underline transition-all flex items-center gap-2 group">
                                    <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#1D4ED8]" />
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Sources */}
                <div>
                    <h4 className="text-[11px] font-sans font-bold text-[#1D4ED8] uppercase tracking-[0.2em] mb-6">SOURCES</h4>
                    <ul className="flex flex-col gap-4">
                        {[
                            "Waiting for a Visa — Dr. B.R. Ambedkar",
                            "Dr. Ambedkar: Life and Mission — Dhananjay Keer",
                            "The Indian Constitution — Granville Austin",
                            "Annihilation of Caste — Dr. B.R. Ambedkar"
                        ].map((item) => (
                            <li key={item} className="text-[12px] text-[#2C3E50] leading-tight opacity-80 flex items-start gap-2">
                                <span className="w-1 h-1 rounded-full bg-[#1D4ED8]/40 mt-1.5 flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="text-[11px] font-sans font-bold text-[#1D4ED8] uppercase tracking-[0.2em] mb-6">CONTACT</h4>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-3 text-[13px] text-[#2C3E50]">
                            <MapPin size={16} className="text-[#1D4ED8] shrink-0 mt-0.5" />
                            <span>Kedari Nagar, Wanowrie,<br />Pune 411040, Maharashtra</span>
                        </div>
                        <div className="flex items-start gap-3 text-[13px] text-[#2C3E50]">
                            <Mail size={16} className="text-[#1D4ED8] shrink-0 mt-0.5" />
                            <span>info@rahulmitramandal.org</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="w-full border-t border-[#DBEAFE] py-8 bg-white/50">
                <div className="max-w-[1200px] mx-auto px-6 text-center flex flex-col gap-2">
                    <p className="text-[11px] text-[#7F8C8D]">© {new Date().getFullYear()} Rahul Mitra Mandal. All rights reserved.</p>
                    <p className="text-[13px] font-display font-medium text-[#1D4ED8] tracking-widest mt-1 uppercase">जय भीम · शिक्षित बनो, संगठित रहो, संघर्ष करो</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
