import { motion, useInView, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ChevronDown, Mail, MapPin, BookOpen, Landmark, Shield, Swords } from "lucide-react";
import { Link } from "react-router-dom";

// Colors (as per requirements)
const colors = {
  primary: "#1D4ED8", // Deep Saffron (Ambedkar Memorial Match)
  secondary: "#F39C12", // Vibrant Orange
  light: "#DBEAFE", // Pastel Orange
  white: "#FFFFFF",
  warmGray: "#F8FAFC",
  darkText: "#2C3E50",
  mutedText: "#7F8C8D"
};

interface TimelineEvent {
  year: string;
  title: string;
  category: "EARLY LIFE" | "POLITICAL MILESTONE" | "SOCIAL REFORM" | "LEGACY";
  description: string;
  details: string;
  reference: string;
  image: string;
}

const timelineData: TimelineEvent[] = [
  {
    year: "1891",
    category: "EARLY LIFE",
    title: "Birth of a Visionary (Mhow)",
    description: "Born on 14th April 1891 in Mhow, Central Provinces (now Madhya Pradesh).",
    details: "Born to Ramji Maloji Sakpal and Bhimabai, he was the 14th child in a poor Mahar family. Despite severe caste discrimination, his father's emphasis on education shaped young Bhimrao's determination to fight for social justice and equality.",
    reference: "Keer, 'Dr. Ambedkar: Life and Mission', p. 1",
    image: "/images/ambedkar_mhow_realistic.png"
  },
  {
    year: "1927",
    category: "SOCIAL REFORM",
    title: "Mahad Satyagraha",
    description: "Led thousands of Dalits to the Chavadar Tank to assert their right to public water.",
    details: "The Mahad Satyagraha was a landmark event in the Dalit rights movement. Babasaheb Ambedkar led thousands of Dalits to publicly drink water from the Chavadar Tank in Mahad, Maharashtra, asserting their fundamental right to access public resources. He also publicly burned the Manusmriti as a symbol of rejecting caste oppression.",
    reference: "Keer, 'Dr. Ambedkar: Life and Mission', p. 85",
    image: "/images/mahad_satyagraha.png"
  },
  {
    year: "1949",
    category: "POLITICAL MILESTONE",
    title: "Architect of the Indian Constitution",
    description: "Drafted and presented the Constitution of India to the Constituent Assembly.",
    details: "As Chairman of the Drafting Committee, Babasaheb Ambedkar meticulously crafted the Indian Constitution — the world's longest written constitution. It enshrined fundamental rights, abolished untouchability (Article 17), and established a framework for social justice, liberty, equality, and fraternity for all citizens.",
    reference: "Granville Austin, 'The Indian Constitution', p. 15",
    image: "/images/ambedkar-portrait.png"
  },
  {
    year: "1956",
    category: "LEGACY",
    title: "A Legacy of Equality & Justice",
    description: "A lifetime dedicated to social reform, education, and empowerment of the marginalized.",
    details: "Babasaheb Ambedkar converted to Buddhism with over 500,000 followers in October 1956, rejecting the caste system. He established institutions like the People's Education Society and wrote extensively on caste, economics, and democracy. He was posthumously awarded the Bharat Ratna in 1990.",
    reference: "Keer, 'Dr. Ambedkar: Life and Mission', p. 498",
    image: "/images/ambedkar-portrait.png"
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
      <div className="hidden md:flex absolute left-1/2 top-0 -translate-x-1/2 z-10 w-[80px] h-[50px] bg-[#1D4ED8] text-white font-display font-bold text-[28px] items-center justify-center rounded-[4px] shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
        {event.year}
      </div>

      {/* Mobile Year Badge */}
      <div className="md:hidden flex self-start ml-[50px] mb-4 bg-[#1D4ED8] text-white px-4 py-1.5 font-display font-bold text-[18px] rounded-[4px] shadow-sm">
        {event.year}
      </div>

      <div className={`w-full flex flex-col md:flex-row items-center gap-8 ${isEven ? "md:flex-row-reverse" : ""}`}>
        {/* Content Container */}
        <div className={`w-full ${event.image ? "md:w-1/2" : "w-full"} flex justify-center`}>
          <motion.div
            initial={{ opacity: 0, x: isEven ? 50 : -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className={`w-full ${event.image ? "max-w-[450px]" : "max-w-[800px]"} bg-white p-8 rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-[#DBEAFE] hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] transition-all relative group h-full flex flex-col`}
          >
            <div className={`text-[#1D4ED8] text-[11px] font-sans font-black uppercase tracking-[2px] mb-4 flex items-center gap-2`}>
              <span className="w-8 h-[1px] bg-[#1D4ED8]" />
              {event.category}
            </div>
            <h3 className={`${event.image ? "text-[24px]" : "text-[32px]"} font-display font-black text-[#2C3E50] mb-4 leading-tight group-hover:text-[#1D4ED8] transition-colors`}>{event.title}</h3>
            <p className="text-[15px] md:text-[16px] text-[#2C3E50] leading-[1.7] mb-6 opacity-90 flex-grow">
              {isExpanded ? event.details : event.description}
            </p>
            <div className="flex flex-col gap-4 mt-auto">
              <div className="flex items-center gap-2 text-[12px] font-medium italic text-[#7F8C8D]">
                <BookOpen size={14} className="text-[#1D4ED8]" />
                {event.reference}
              </div>
              <div
                className="flex items-center gap-2 text-[13px] font-black text-[#1D4ED8] mt-2 group-hover:underline cursor-pointer"
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
              className={`w-full md:max-w-[500px] aspect-[4/3] rounded-[12px] border-2 border-[#DBEAFE] overflow-hidden shadow-[0_12px_24px_rgba(0,0,0,0.1)] hover:scale-[1.02] transition-transform duration-300 relative`}
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
    { title: "Justice", name: "Article 14", role: "Equality Before Law" },
    { title: "Liberty", name: "Article 19", role: "Freedom of Speech & Expression" },
    { title: "Equality", name: "Article 15", role: "Prohibition of Discrimination" },
    { title: "Fraternity", name: "Preamble", role: "Unity & Integrity of the Nation" },
    { title: "Education", name: "Article 21A", role: "Right to Education" },
    { title: "Abolition", name: "Article 17", role: "Abolition of Untouchability" },
    { title: "Reservation", name: "Article 15(4)", role: "Social & Educational Advancement" },
    { title: "Democracy", name: "Article 326", role: "Universal Adult Suffrage" }
  ];

  return (
    <section className="py-24 bg-[#F8FAFC] border-t border-[#DBEAFE]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-[#1D4ED8] font-display font-black text-[36px] mb-4">Key Constitutional Principles</h2>
          <p className="text-[#2C3E50] opacity-80 max-w-2xl mx-auto italic font-medium uppercase tracking-widest text-xs" style={{ fontFamily: "Inter, sans-serif" }}>
            The Pillars of the Indian Constitution: Babasaheb Ambedkar's Vision for a Just Society
          </p>
          <div className="w-[60px] h-1 bg-[#1D4ED8] mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ministers.map((m, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-xl shadow-sm border border-[#DBEAFE] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-12 h-12 bg-[#DBEAFE] opacity-10 rounded-bl-full group-hover:bg-[#1D4ED8] group-hover:opacity-10 transition-all" />
              <h4 className="text-[#1D4ED8] font-display font-black text-xl mb-1">{m.title}</h4>
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
    <footer className="w-full bg-[#F8FAFC] pt-[60px] pb-0 border-t-2 border-[#DBEAFE]">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-[60px]">
        {/* About */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="RMM Logo" className="w-10 h-10 object-contain" />
            <span className="text-[14px] font-sans font-bold text-[#1D4ED8] uppercase tracking-widest leading-none">RAHUL MITRA MANDAL<br />PRATHISTHAN</span>
          </div>
          <p className="text-[13px] text-[#2C3E50] leading-[1.6] max-w-[280px]">
            Celebrating the legacy of Babasaheb Ambedkar through education, culture, and community engagement at Dapodi, Pune.
          </p>
        </div>

        {/* Navigate */}
        <div>
          <h4 className="text-[14px] font-sans font-bold text-[#1D4ED8] uppercase tracking-widest mb-6">NAVIGATE</h4>
          <ul className="flex flex-col gap-3">
            {["Home", "History & Timeline", "Photo Gallery"].map((item) => (
              <li key={item}>
                <Link to={item === "Home" ? "/" : item === "Photo Gallery" ? "/gallery" : "/history"} className="text-[13px] text-[#2C3E50] hover:text-[#1D4ED8] hover:underline transition-all">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Sources */}
        <div>
          <h4 className="text-[14px] font-sans font-bold text-[#1D4ED8] uppercase tracking-widest mb-6">SOURCES</h4>
          <ul className="flex flex-col gap-3">
            {[
              "Waiting for a Visa — Dr. B.R. Ambedkar",
              "Dr. Ambedkar: Life and Mission — Dhananjay Keer",
              "The Indian Constitution — Granville Austin",
              "Annihilation of Caste — Dr. B.R. Ambedkar"
            ].map((item) => (
              <li key={item} className="text-[13px] text-[#2C3E50] leading-tight opacity-90">{item}</li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[14px] font-sans font-bold text-[#1D4ED8] uppercase tracking-widest mb-6">CONTACT</h4>
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4 text-[13px] text-[#2C3E50]">
              <MapPin size={18} className="text-[#1D4ED8] shrink-0" />
              <span>बाराथे वस्ती, दापोडी गावठाण,<br />पुणे ४११०१२, महाराष्ट्र, भारत</span>
            </div>
            <div className="flex items-start gap-4 text-[13px] text-[#2C3E50]">
              <Mail size={18} className="text-[#1D4ED8] shrink-0" />
              <span>digitalwithpr@gmail.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full border-t border-[#DBEAFE] py-8 bg-white/50">
        <div className="max-w-[1200px] mx-auto px-6 text-center flex flex-col gap-2">
          <p className="text-[12px] text-[#7F8C8D]">© 2026 Rahul Mitra Mandal. All rights reserved.</p>
          <p className="text-[14px] font-display font-bold text-[#1D4ED8] tracking-widest mt-2 uppercase">जय भीम · शिक्षित बनो, संगठित रहो, संघर्ष करो</p>
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
        className="fixed top-[70px] left-0 right-0 h-1 bg-[#1D4ED8] origin-left z-[90]"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Hero Section */}
      <header className="w-full pt-[150px] pb-[80px] px-6 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#DBEAFE] px-5 py-1.5 rounded-[20px] text-[13px] font-display font-medium text-[#1D4ED8] mb-6"
        >
          Babasaheb Ambedkar • 1891–1956
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#1D4ED8] font-display font-extrabold text-[48px] md:text-[56px] tracking-[1px] mb-4 leading-tight"
        >
          Historical Timeline
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[#2C3E50] text-[18px] md:text-[20px] max-w-[700px] font-sans italic opacity-90 leading-relaxed mb-8"
        >
          From birth to legacy: The journey of Babasaheb Ambedkar.
        </motion.p>

        <div className="w-[100px] h-[3px] bg-[#1D4ED8] rounded-full mx-auto" />
      </header>

      {/* Timeline Section */}
      <section className="max-w-[1100px] mx-auto px-6 md:px-12 py-[60px] relative">
        <motion.div
          className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] bg-[#DBEAFE] md:-translate-x-1/2 origin-top"
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
