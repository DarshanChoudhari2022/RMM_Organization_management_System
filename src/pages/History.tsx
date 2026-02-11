import { motion, useInView, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ChevronDown, Mail, MapPin, BookOpen, Landmark, Shield, Swords } from "lucide-react";
import { Link } from "react-router-dom";

// Colors (as per requirements)
const colors = {
  primary: "#D95D1E", // Deep Saffron (Shivsrushti Match)
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
    title: "Birth of a Legend (Shivneri)",
    description: "Born on 19th February 1630 at the strategic Shivneri Fort.",
    details: "Born to Jijabai and Shahaji Bhosale, his upbringing at Shivneri under the guidance of Jijau shaped the vision of 'Hindavi Swarajya'. The fort's naturally fortified position inspired his lifelong mastery of mountain warfare.",
    reference: "Sarkar, 'Shivaji and His Times', p. 12",
    image: "/images/BirthatShivneri.png"
  },
  {
    year: "1646",
    category: "MILITARY CAMPAIGN",
    title: "The First Conquest: Torna Fort",
    description: "At age 16, Chhatrapati Shivaji Maharaj captured his first fort, Torna.",
    details: "This pivotal event marked the beginning of the Maratha Empire. By capturing Torna, Chhatrapati Shivaji Maharaj sent a clear message of independence to the Bijapur Sultanate and began his legendary campaign of fort administration.",
    reference: "Sabhasad Bakhar, p. 8",
    image: ""
  },
  {
    year: "1674",
    category: "POLITICAL MILESTONE",
    title: "The Coronation at Raigad",
    description: "Establishment of the independent Hindu Sovereignty.",
    details: "On June 6, 1674, Raigad witnessed the birth of a Sovereign Power. He was crowned Chhatrapati, symbolizing the formal rebirth of Hindavi Swarajya and establishing a separate legal identity for the Maratha people.",
    reference: "Sarkar, p. 195",
    image: ""
  },
  {
    year: "1680",
    category: "LEGACY",
    title: "Legacy of 300+ Forts",
    description: "A lifetime dedicated to sovereignty and mountain warfare.",
    details: "By the time of his passing, Chhatrapati Shivaji Maharaj had built and rebuilt a network of over 300 forts across the Sahyadri range and the Konkan coast, creating an impenetrable defense system that protected Swarajya for centuries.",
    reference: "Kincaid, 'History of Maratha People', p. 280",
    image: ""
  }
];

const TimelineCard = ({ event, index }: { event: TimelineEvent; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const isEven = index % 2 === 1;

  return (
    <div ref={ref} className="relative w-full flex flex-col md:flex-row items-center gap-12 md:gap-0 mb-[120px] last:mb-0">
      {/* Central Year Badge (Desktop) */}
      <div className="hidden md:flex absolute left-1/2 top-0 -translate-x-1/2 z-10 w-[80px] h-[50px] bg-[#D95D1E] text-white font-display font-bold text-[28px] items-center justify-center rounded-[4px] shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
        {event.year}
      </div>

      {/* Mobile Year Badge */}
      <div className="md:hidden flex self-start ml-[50px] mb-4 bg-[#D95D1E] text-white px-4 py-1.5 font-display font-bold text-[18px] rounded-[4px] shadow-sm">
        {event.year}
      </div>

      <div className={`w-full flex flex-col md:flex-row items-center gap-8 ${isEven ? "md:flex-row-reverse" : ""}`}>
        {/* Content Container */}
        <div className={`w-full ${event.image ? "md:w-1/2" : "w-full"} flex justify-center`}>
          <motion.div
            initial={{ opacity: 0, x: isEven ? 50 : -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className={`w-full ${event.image ? "max-w-[450px]" : "max-w-[800px]"} bg-white p-8 rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-[#FBE8D3] hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all relative group h-full flex flex-col`}
          >
            <div className={`text-[#D95D1E] text-[11px] font-sans font-black uppercase tracking-[2px] mb-4 flex items-center gap-2`}>
              <span className="w-8 h-[1px] bg-[#D95D1E]" />
              {event.category}
            </div>
            <h3 className={`${event.image ? "text-[24px]" : "text-[32px]"} font-display font-black text-[#2C3E50] mb-4 leading-tight group-hover:text-[#D95D1E] transition-colors`}>{event.title}</h3>
            <p className="text-[15px] md:text-[16px] text-[#2C3E50] leading-[1.7] mb-6 opacity-90 flex-grow">
              {isExpanded ? event.details : event.description}
            </p>
            <div className="flex flex-col gap-4 mt-auto">
              <div className="flex items-center gap-2 text-[12px] font-medium italic text-[#7F8C8D]">
                <BookOpen size={14} className="text-[#D95D1E]" />
                {event.reference}
              </div>
              <div
                className="flex items-center gap-2 text-[13px] font-black text-[#D95D1E] mt-2 group-hover:underline cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Show Less" : "Read More"}
                <ChevronDown size={16} className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Image Container (Conditional) */}
        {event.image && (
          <div className="w-full md:w-1/2 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`w-full md:max-w-[500px] aspect-[4/3] rounded-[12px] border-2 border-[#FBE8D3] overflow-hidden shadow-[0_12px_24px_rgba(0,0,0,0.1)] hover:scale-[1.02] transition-transform duration-300 relative`}
            >
              <img src={event.image} alt={event.title} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

const AshtapradhanSection = () => {
  const ministers = [
    { title: "Peshwa", name: "Moropant Pingale", role: "Prime Minister / Administration" },
    { title: "Amatya", name: "Ramchandra Nilkanth", role: "Finance Minister / Accounts" },
    { title: "Surnis", name: "Annaji Datto", role: "General Secretary / Records" },
    { title: "Waqia-Navis", name: "Dattaji Limaye", role: "Intelligence / Home Minister" },
    { title: "Sar-i-Naubat", name: "Hambirrao Mohite", role: "Commander-in-Chief / Military" },
    { title: "Dabir", name: "Somnath Pant", role: "Foreign Minister / Ethics" },
    { title: "Nyayadhish", name: "Niraji Rauji", role: "Chief Justice / Law" },
    { title: "Panditrao", name: "Moreshwar Panditrao", role: "High Priest / Religious Affairs" }
  ];

  return (
    <section className="py-24 bg-[#F7F6F3] border-t border-[#FBE8D3]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-[#D95D1E] font-display font-black text-[36px] mb-4">Ashtapradhan Mandal</h2>
          <p className="text-[#2C3E50] opacity-80 max-w-2xl mx-auto italic font-medium uppercase tracking-widest text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
            The Council of Eight: Chhatrapati Shivaji Maharaj's Blueprint for Governance
          </p>
          <div className="w-[60px] h-1 bg-[#D95D1E] mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ministers.map((m, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-xl shadow-sm border border-[#FBE8D3] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-12 h-12 bg-[#FBE8D3] opacity-10 rounded-bl-full group-hover:bg-[#D95D1E] group-hover:opacity-10 transition-all" />
              <h4 className="text-[#D95D1E] font-display font-black text-xl mb-1">{m.title}</h4>
              <p className="text-[#2C3E50] font-bold text-sm mb-4">{m.name}</p>
              <div className="h-[1px] w-full bg-gray-100 mb-4" />
              <p className="text-[11px] text-[#7F8C8D] uppercase tracking-widest font-black leading-tight" style={{ fontFamily: "Inter, sans-serif" }}>{m.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="w-full bg-[#F7F6F3] pt-[60px] pb-0 border-t-2 border-[#FBE8D3]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-[60px]">
        {/* About */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[32px] font-display font-black text-[#D95D1E]">श</span>
            <span className="text-[14px] font-sans font-bold text-[#D95D1E] uppercase tracking-widest leading-none">SHIVGARJANA<br />PRATHISTHAN</span>
          </div>
          <p className="text-[13px] text-[#2C3E50] leading-[1.6] max-w-[280px]">
            Celebrating the legacy of Chhatrapati Shivaji Maharaj through education, culture, and community engagement at Wanowrie, Pune.
          </p>
        </div>

        {/* Navigate */}
        <div>
          <h4 className="text-[14px] font-sans font-bold text-[#D95D1E] uppercase tracking-widest mb-6">NAVIGATE</h4>
          <ul className="flex flex-col gap-3">
            {["Home", "History & Timeline", "Forts of Swarajya", "Photo Gallery"].map((item) => (
              <li key={item}>
                <Link to="/" className="text-[13px] text-[#2C3E50] hover:text-[#D95D1E] hover:underline transition-all">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Sources */}
        <div>
          <h4 className="text-[14px] font-sans font-bold text-[#D95D1E] uppercase tracking-widest mb-6">SOURCES</h4>
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
          <h4 className="text-[14px] font-sans font-bold text-[#D95D1E] uppercase tracking-widest mb-6">CONTACT</h4>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4 text-[13px] text-[#2C3E50]">
              <MapPin size={18} className="text-[#D95D1E] shrink-0" />
              <span>Kedari Nagar, Wanowrie,<br />Pune 411040, Maharashtra, India</span>
            </div>
            <div className="flex items-start gap-4 text-[13px] text-[#2C3E50]">
              <Mail size={18} className="text-[#D95D1E] shrink-0" />
              <span>info@shivgarjana.org</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full border-t border-[#FBE8D3] py-8 bg-white/50">
        <div className="max-w-[1200px] mx-auto px-6 text-center flex flex-col gap-2">
          <p className="text-[12px] text-[#7F8C8D]">© 2026 Shrimant Shivgarjana Prathisthan. All rights reserved.</p>
          <p className="text-[14px] font-display font-bold text-[#D95D1E] tracking-widest mt-2 uppercase">जय शिवराय · हर हर महादेव</p>
        </div>
      </div>
    </footer>
  );
};

const History = () => {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="w-full bg-[#FFFFFF] font-sans text-[#2C3E50]">

      {/* Progress Bar (Sticky) */}
      <motion.div
        className="fixed top-[70px] left-0 right-0 h-1 bg-[#D95D1E] origin-left z-[90]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Hero Section */}
      <header className="w-full pt-[150px] pb-[80px] px-6 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#FBE8D3] px-5 py-1.5 rounded-[20px] text-[13px] font-display font-medium text-[#D95D1E] mb-6"
        >
          Chhatrapati Shivaji Maharaj • 1630–1680
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#D95D1E] font-display font-extrabold text-[48px] md:text-[56px] tracking-[1px] mb-4 leading-tight"
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

        <div className="w-[100px] h-[3px] bg-[#D95D1E] rounded-full mx-auto" />
      </header>

      {/* Timeline Section */}
      <section className="max-w-[1100px] mx-auto px-6 md:px-12 py-[60px] relative">
        <motion.div
          className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-[#FBE8D3] md:-translate-x-1/2 origin-top"
          style={{ scaleY }}
        />
        <div className="flex flex-col">
          {timelineData.map((event, i) => (
            <TimelineCard key={i} event={event} index={i} />
          ))}
        </div>
      </section>

      <AshtapradhanSection />

      <Footer />
    </div>
  );
};

export default History;
