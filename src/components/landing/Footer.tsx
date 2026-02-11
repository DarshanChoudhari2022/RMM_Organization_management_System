import { Link } from "react-router-dom";
import { Crown, MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";

const Footer = () => {
    return (
        <footer className="w-full bg-[#F7F6F3] pt-[60px] pb-0 border-t-2 border-[#FBE8D3]">
            <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-[60px]">
                {/* About */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                        <span className="text-[32px] font-display font-black text-[#E67E22] leading-none">श</span>
                        <div className="flex flex-col">
                            <span className="text-[14px] font-display font-bold text-[#E67E22] uppercase tracking-widest leading-none">SHIVGARJANA</span>
                            <span className="text-[9px] font-sans font-bold text-[#2C3E50] uppercase tracking-[0.3em] opacity-60">Prathisthan</span>
                        </div>
                    </div>
                    <p className="text-[13px] text-[#2C3E50] leading-[1.6] max-w-[280px]">
                        Celebrating the legacy of Chhatrapati Shivaji Maharaj through education, culture, and community engagement at Wanowrie, Pune.
                    </p>
                </div>

                {/* Navigate */}
                <div>
                    <h4 className="text-[11px] font-sans font-bold text-[#E67E22] uppercase tracking-[0.2em] mb-6">NAVIGATE</h4>
                    <ul className="flex flex-col gap-3">
                        {[
                            { name: "Home", path: "/" },
                            { name: "History & Timeline", path: "/history" },
                            { name: "Forts of Swarajya", path: "/forts" },
                            { name: "Photo Gallery", path: "/gallery" },
                        ].map((item) => (
                            <li key={item.name}>
                                <Link to={item.path} className="text-[13px] text-[#2C3E50] hover:text-[#E67E22] hover:underline transition-all flex items-center gap-2 group">
                                    <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#E67E22]" />
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Sources */}
                <div>
                    <h4 className="text-[11px] font-sans font-bold text-[#E67E22] uppercase tracking-[0.2em] mb-6">SOURCES</h4>
                    <ul className="flex flex-col gap-4">
                        {[
                            "Shivaji and His Times — Sir Jadunath Sarkar",
                            "Raja Shivchhatrapati — Babasaheb Purandare",
                            "A History of the Maratha People — Kincaid & Parasnis",
                            "Sabhasad Bakhar — Krishnaji Anant Sabhasad"
                        ].map((item) => (
                            <li key={item} className="text-[12px] text-[#2C3E50] leading-tight opacity-80 flex items-start gap-2">
                                <span className="w-1 h-1 rounded-full bg-[#E67E22]/40 mt-1.5 flex-shrink-0" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="text-[11px] font-sans font-bold text-[#E67E22] uppercase tracking-[0.2em] mb-6">CONTACT</h4>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-3 text-[13px] text-[#2C3E50]">
                            <MapPin size={16} className="text-[#E67E22] shrink-0 mt-0.5" />
                            <span>Kedari Nagar, Wanowrie,<br />Pune 411040, Maharashtra</span>
                        </div>
                        <div className="flex items-start gap-3 text-[13px] text-[#2C3E50]">
                            <Mail size={16} className="text-[#E67E22] shrink-0 mt-0.5" />
                            <span>info@shivgarjana.org</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="w-full border-t border-[#FBE8D3] py-8 bg-white/50">
                <div className="max-w-[1200px] mx-auto px-6 text-center flex flex-col gap-2">
                    <p className="text-[11px] text-[#7F8C8D]">© {new Date().getFullYear()} Shrimant Shivgarjana Prathisthan. All rights reserved.</p>
                    <p className="text-[13px] font-display font-medium text-[#E67E22] tracking-widest mt-1 uppercase">जय शिवराय · हर हर महादेव</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
