import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown, Mail, MapPin, BookOpen, Crown, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

// Colors (as per requirements)
const colors = {
  primary: "#E67E22", // Deep Saffron
  secondary: "#F39C12", // Vibrant Orange
  light: "#FBE8D3", // Pastel Orange
  white: "#FFFFFF",
  warmGray: "#F7F6F3",
  darkText: "#2C3E50",
  mutedText: "#7F8C8D"
};

interface TimelineEvent {
  year: string;
  title: string;
  category: "EARLY LIFE" | "POLITICAL MILESTONE" | "MILITARY CAMPAIGN" | "LEGACY";
  description: string;
  details: string;
  reference: string;
  image: string;
}

const timelineData: TimelineEvent[] = [
  {
    year: "1630",
    category: "EARLY LIFE",
    title: "Birth of Shivaji Maharaj",
    description: "Born on 19th February 1630 at Shivneri Fort.",
    details: "Shivaji was born to Shahaji Bhosale and Jijabai. He was named 'Shivaji' after the local deity Goddess Shivai at Shivneri Fort, near Junnar.",
    reference: "Sarkar, Jadunath. 'Shivaji and His Times', p. 12",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Shivneri01.JPG"
  },
  {
    year: "1645",
    category: "POLITICAL MILESTONE",
    title: "Oath of Swarajya",
    description: "Young Shivaji took the oath of Swarajya at Raireshwar.",
    details: "At age 15, Shivaji and his companions pledged to establish Hindavi Swarajya at the Raireshwar temple, dedicating their lives to the cause of freedom.",
    reference: "Sabhasad Bakhar, p. 8",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80"
  },
  {
    year: "1646",
    category: "MILITARY CAMPAIGN",
    title: "Capture of Torna Fort",
    description: "First conquest: Captured Torna Fort from Bijapur.",
    details: "This marked the beginning of Swarajya. He renamed it 'Prachandagad'. The treasure found during repairs funded the fortification of Rajgad.",
    reference: "Sarkar, 'Shivaji and His Times', p. 27",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/FortTorna3.JPG/1280px-FortTorna3.JPG"
  },
  {
    year: "1659",
    category: "MILITARY CAMPAIGN",
    title: "Battle of Pratapgad",
    description: "Defeat of Afzal Khan.",
    details: "Shivaji killed the mighty Afzal Khan in a legendary one-on-one encounter at the foot of Pratapgad, proving his tactical brilliance against a superior force.",
    reference: "Sarkar, 'Shivaji and His Times', p. 78",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Pratapgad_from_distance.JPG/1280px-Pratapgad_from_distance.JPG"
  },
  {
    year: "1674",
    category: "POLITICAL MILESTONE",
    title: "Coronation",
    description: "Crowned Chhatrapati at Raigad Fort.",
    details: "Grand coronation ceremony establishing the sovereign Maratha Kingdom (Hindavi Swarajya). He was formally enthroned as Chhatrapati by Gaga Bhatt on June 6, 1674.",
    reference: "Sarkar, 'Shivaji and His Times', p. 195",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80"
  },
  {
    year: "1680",
    category: "LEGACY",
    title: "Legacy",
    description: "Passed away at Raigad.",
    details: "Left behind a powerful empire that would dominate India for the next century. His administrative, naval, and military reforms remained the blueprint for future rulers of Bharat.",
    reference: "Sarkar, 'Shivaji and His Times', p. 306",
    image: "https://images.unsplash.com/photo-1620311397333-e99d86899f8d?auto=format&fit=crop&q=80"
  }
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "HISTORY", path: "/history" },
    { name: "FORTS", path: "/forts" },
    { name: "GALLERY", path: "/gallery" },
  ];

  const activePath = location.pathname;

  return (
    <nav className={`fixed top-0 left-0 w-full h-[70px] bg-white z-[100] flex items-center px-6 md:px-12 transition-all duration-300 ${isScrolled ? "shadow-[0_2px_8px_rgba(0,0,0,0.08)]" : "border-b border-gray-100"}`}>
      <div className="max-w-[1200px] w-full mx-auto flex justify-between items-center">
        {/* Logo Left */}
        <Link to="/" className="flex items-center gap-4 group h-[70px]">
          <div className="relative">
            <svg width="42" height="42" viewBox="0 0 100 100" className="group-hover:scale-110 transition-transform duration-300">
              <circle cx="50" cy="50" r="48" fill="#E67E22" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="4 2" />
              <text x="50" y="65" textAnchor="middle" fill="white" fontSize="45" fontWeight="900" fontFamily="Playfair Display">श</text>
              <path d="M50 5 L55 15 L45 15 Z" fill="white" />
              <path d="M50 95 L55 85 L45 85 Z" fill="white" />
              <path d="M5 50 L15 55 L15 45 Z" fill="white" />
              <path d="M95 50 L85 55 L85 45 Z" fill="white" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[16px] font-display font-black text-[#2C3E50] tracking-tight leading-none uppercase">SHIVGARJANA</span>
            <span className="text-[10px] font-sans font-bold text-[#E67E22] uppercase tracking-[0.25em]">Kedari Nagar</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-5 py-2 text-[14px] font-sans font-semibold tracking-wide transition-all relative group h-[70px] flex items-center ${activePath === link.path ? "text-[#E67E22]" : "text-[#2C3E50] hover:text-[#E67E22]"}`}
            >
              {link.name}
              <div className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#E67E22] transition-transform duration-300 ${activePath === link.path ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
            </Link>
          ))}
          <Link
            to="/login"
            className="ml-5 px-6 py-2 border border-[#E67E22] text-[#E67E22] text-[14px] font-sans font-bold uppercase tracking-widest rounded-sm hover:bg-[#E67E22] hover:text-white transition-all duration-300"
          >
            PORTAL
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-[#2C3E50]">
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-[70px] left-0 w-full bg-white border-b border-gray-100 shadow-xl md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-lg font-bold tracking-widest ${activePath === link.path ? "text-[#E67E22]" : "text-[#2C3E50]"}`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-4 px-6 py-3 bg-[#E67E22] text-white text-center font-bold tracking-widest rounded-sm"
              >
                ADMIN PORTAL
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const TimelineCard = ({ event, index }: { event: TimelineEvent; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const isEven = index % 2 === 1;

  return (
    <div ref={ref} className="relative w-full flex flex-col md:flex-row items-center gap-12 md:gap-0 mb-[120px] last:mb-0">
      {/* Central Year Badge (Desktop) */}
      <div className="hidden md:flex absolute left-1/2 top-0 -translate-x-1/2 z-10 w-[80px] h-[50px] bg-[#E67E22] text-white font-display font-bold text-[28px] items-center justify-center rounded-[4px] shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
        {event.year}
      </div>

      {/* Mobile Year Badge */}
      <div className="md:hidden flex self-start ml-[50px] mb-4 bg-[#E67E22] text-white px-4 py-1.5 font-display font-bold text-[18px] rounded-[4px] shadow-sm">
        {event.year}
      </div>

      <div className={`w-full flex flex-col md:flex-row items-center ${isEven ? "md:flex-row-reverse" : ""}`}>
        {/* Content Card */}
        <div className={`w-full md:w-1/2 flex ${isEven ? "md:justify-start" : "md:justify-end"}`}>
          <motion.div
            initial={{ opacity: 0, x: isEven ? 50 : -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`max-w-full md:max-w-[450px] bg-white border border-[#FBE8D3] p-8 rounded-[8px] shadow-[0_4px_12px_rgba(230,126,34,0.06)] hover:shadow-[0_8px_24px_rgba(230,126,34,0.12)] transition-all duration-300 ${isEven ? "md:ml-16" : "md:mr-16"} cursor-pointer group`}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className="bg-[#F39C12] text-white text-[11px] font-sans font-bold uppercase tracking-[1px] px-3 py-1.5 rounded-[4px] w-fit mb-4">
              {event.category}
            </div>
            <h3 className="text-[24px] font-display font-bold text-[#2C3E50] mb-3 leading-tight group-hover:text-[#E67E22] transition-colors">{event.title}</h3>
            <p className="text-[15px] text-[#2C3E50] leading-[1.6] mb-5">
              {isExpanded ? event.details : event.description}
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[12px] italic text-[#7F8C8D]">
                <BookOpen size={14} className="text-[#E67E22]" />
                {event.reference}
              </div>
              <div className="flex items-center gap-1 text-[13px] font-bold text-[#E67E22] mt-2 group-hover:underline">
                {isExpanded ? "Collapse" : "Expand"}
                <ChevronDown size={16} className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Image Container */}
        <div className={`w-full md:w-1/2 flex ${isEven ? "md:justify-end" : "md:justify-start"}`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`w-full md:max-w-[400px] aspect-[4/3] rounded-[8px] border-2 border-[#FBE8D3] overflow-hidden shadow-[0_6px_16px_rgba(0,0,0,0.12)] hover:scale-[1.02] transition-transform duration-300 ${isEven ? "md:mr-12" : "md:ml-12"}`}
          >
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" loading="lazy" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="w-full bg-[#F7F6F3] pt-[60px] pb-0 border-t-2 border-[#FBE8D3]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-[60px]">
        {/* About */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[32px] font-display font-black text-[#E67E22]">श</span>
            <span className="text-[14px] font-sans font-bold text-[#E67E22] uppercase tracking-widest leading-none">SHIVGARJANA<br />PRATHISTHAN</span>
          </div>
          <p className="text-[13px] text-[#2C3E50] leading-[1.6] max-w-[280px]">
            Celebrating the legacy of Chhatrapati Shivaji Maharaj through education, culture, and community engagement at Wanowrie, Pune.
          </p>
        </div>

        {/* Navigate */}
        <div>
          <h4 className="text-[14px] font-sans font-bold text-[#E67E22] uppercase tracking-widest mb-6">NAVIGATE</h4>
          <ul className="flex flex-col gap-3">
            {["Home", "History & Timeline", "Forts of Swarajya", "Photo Gallery"].map((item) => (
              <li key={item}>
                <Link to="/" className="text-[13px] text-[#2C3E50] hover:text-[#E67E22] hover:underline transition-all">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Sources */}
        <div>
          <h4 className="text-[14px] font-sans font-bold text-[#E67E22] uppercase tracking-widest mb-6">SOURCES</h4>
          <ul className="flex flex-col gap-3">
            {[
              "Shivaji and His Times — Sir Jadunath Sarkar",
              "Raja Shivchhatrapati — Babasaheb Purandare",
              "A History of the Maratha People — Kincaid & Parasnis",
              "Sabhasad Bakhar — Krishnaji Anant Sabhasad"
            ].map((item) => (
              <li key={item} className="text-[13px] text-[#2C3E50] leading-tight opacity-90">{item}</li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[14px] font-sans font-bold text-[#E67E22] uppercase tracking-widest mb-6">CONTACT</h4>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4 text-[13px] text-[#2C3E50]">
              <MapPin size={18} className="text-[#E67E22] shrink-0" />
              <span>Kedari Nagar, Wanowrie,<br />Pune 411040, Maharashtra, India</span>
            </div>
            <div className="flex items-start gap-4 text-[13px] text-[#2C3E50]">
              <Mail size={18} className="text-[#E67E22] shrink-0" />
              <span>info@shivgarjana.org</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full border-t border-[#FBE8D3] py-8 bg-white/50">
        <div className="max-w-[1200px] mx-auto px-6 text-center flex flex-col gap-2">
          <p className="text-[12px] text-[#7F8C8D]">© 2026 Shrimant Shivgarjana Prathisthan. All rights reserved.</p>
          <p className="text-[14px] font-display font-bold text-[#E67E22] tracking-widest mt-2 uppercase">जय शिवराय · हर हर महादेव</p>
        </div>
      </div>
    </footer>
  );
};

const History = () => {
  return (
    <div className="w-full bg-[#FFFFFF] font-sans text-[#2C3E50]">
      <Navbar />

      {/* Hero Section */}
      <header className="w-full pt-[150px] pb-[80px] px-6 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#FBE8D3] px-5 py-1.5 rounded-[20px] text-[13px] font-display font-medium text-[#E67E22] mb-6"
        >
          Chhatrapati Shivaji Maharaj • 1630–1680
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#E67E22] font-display font-extrabold text-[48px] md:text-[56px] tracking-[1px] mb-4 leading-tight"
        >
          Historical Timeline
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[#2C3E50] text-[18px] md:text-[20px] max-w-[700px] font-sans italic opacity-90 leading-relaxed mb-8"
        >
          From birth to legacy: The journey of Chhatrapati Shivaji Maharaj.
        </motion.p>

        <div className="w-[100px] h-[3px] bg-[#E67E22] rounded-full mx-auto" />
      </header>

      {/* Timeline Section */}
      <section className="max-w-[1100px] mx-auto px-6 md:px-12 py-[60px] relative">
        {/* Vertical Center Line */}
        <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-[#FBE8D3] md:-translate-x-1/2" />

        <div className="flex flex-col">
          {timelineData.map((event, i) => (
            <TimelineCard key={i} event={event} index={i} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default History;
