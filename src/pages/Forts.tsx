import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { MapPin, Mountain, Calendar, Shield, Anchor, ChevronDown, BookOpen, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/landing/Footer";

interface Fort {
  name: string;
  marathi: string;
  type: "hill" | "sea" | "land";
  location: string;
  captured: string;
  elevation?: string;
  description: string;
  significance: string;
  reference: string;
  image: string;
}

const forts: Fort[] = [
  {
    name: "Raigad Fort",
    marathi: "रायगड",
    type: "hill",
    location: "Raigad District",
    captured: "1656",
    elevation: "2,700 ft",
    description: "Known as the 'Gibraltar of the East', Raigad was the capital of the Maratha Empire. Site of the grand coronation ceremony in 1674.",
    significance: "The heart of Swarajya. Houses the Samadhi of Chhatrapati Shivaji Maharaj and the Jagdishwar Temple.",
    reference: "Sarkar, 'Shivaji and His Times'",
    image: ""
  },
  {
    name: "Torna Fort",
    marathi: "तोरणा",
    type: "hill",
    location: "Velhe, Pune",
    captured: "1646",
    elevation: "4,603 ft",
    description: "The first fort captured by Chhatrapati Shivaji Maharaj at age 16, marking the dawn of the Maratha Empire.",
    significance: "Cradle of Swarajya. Renamed 'Prachandagad' due to its massive spread.",
    reference: "Sabhasad Bakhar",
    image: ""
  },
  {
    name: "Rajgad Fort",
    marathi: "राजगड",
    type: "hill",
    location: "Bhor, Pune",
    captured: "1647",
    elevation: "4,514 ft",
    description: "Served as the first capital of Swarajya for 26 years. Known as the 'King of Forts'.",
    significance: "Political powerhouse. Famous for Padmavati, Suvela, and Sanjivani machis.",
    reference: "Purandare, 'Raja Shivchhatrapati'",
    image: ""
  },
  {
    name: "Pratapgad Fort",
    marathi: "प्रतापगड",
    type: "hill",
    location: "Satara District",
    captured: "1656 (Built)",
    elevation: "3,543 ft",
    description: "Strategically built to control Jawali region. Famous for the duel between Chhatrapati Shivaji Maharaj and Afzal Khan.",
    significance: "Symbol of Maratha valor and guerrilla tactics. Houses Bhawani Temple.",
    reference: "Sarkar, p. 78",
    image: ""
  },
  {
    name: "Sindhudurg Fort",
    marathi: "सिंधुदुर्ग",
    type: "sea",
    location: "Malvan, Konkan",
    captured: "1664 (Built)",
    description: "A naval masterpiece built on Kurte Island with foundations of molten lead.",
    significance: "Headquarters of the Maratha Navy. Contains a temple dedicated to Shivaji Maharaj.",
    reference: "Sarkar, p. 240",
    image: ""
  },
  {
    name: "Sinhagad Fort",
    marathi: "सिंहगड",
    type: "hill",
    location: "Haveli, Pune",
    captured: "1647",
    elevation: "4,300 ft",
    description: "Originally Kondana, famous for Tanaji Malusare's heroic scaling of the Donaje cliff.",
    significance: "Renamed 'Lion's Fort' in honor of Tanaji. Critical outpost for Pune's defense.",
    reference: "Purandare, p. 302",
    image: ""
  },
  {
    name: "Shivneri Fort",
    marathi: "शिवनेरी",
    type: "hill",
    location: "Junnar, Pune",
    captured: "Birthplace",
    elevation: "3,500 ft",
    description: "Sacred birthplace of Chhatrapati Shivaji Maharaj, featuring seven defensive gates.",
    significance: "The dawn of Swarajya. Houses Shiv Kunj and Shivai Temple.",
    reference: "Sarkar, p. 12",
    image: ""
  },
  {
    name: "Panhala Fort",
    marathi: "पन्हाळगड",
    type: "hill",
    location: "Kolhapur District",
    captured: "1659",
    elevation: "3,127 ft",
    description: "Site of the daring night escape to Vishalgad during Siddhi Johar's siege.",
    significance: "Witnessed the sacrifice of Baji Prabhu Deshpande at Pavan Khind.",
    reference: "Purandare, p. 198",
    image: ""
  },
  {
    name: "Vijaydurg Fort",
    marathi: "विजयदुर्ग",
    type: "sea",
    location: "Devgad, Sindhudurg",
    captured: "1653",
    description: "Considered the 'Gibraltar of Asia', featuring a triple line of naval fortifications.",
    significance: "Key naval base. Features an underwater stone wall for defense.",
    reference: "Sarkar, p. 250",
    image: ""
  },
  {
    name: "Purandar Fort",
    marathi: "पुरंदर",
    type: "hill",
    location: "Saswad, Pune",
    captured: "1648",
    elevation: "4,472 ft",
    description: "Site of Murarbaji's last stand. Birthplace of Chhatrapati Sambhaji Maharaj.",
    significance: "Strategic twin-fort. Witnessed the Treaty of Purandar (1665).",
    reference: "Sarkar, p. 142",
    image: ""
  },
  {
    name: "Lohagad Fort",
    marathi: "लोहगड",
    type: "hill",
    location: "Maval, Pune",
    captured: "1648",
    elevation: "3,400 ft",
    description: "Strong treasury fort near Bor Ghat. Famous for the Vinchu Kata spur.",
    significance: "Impregnable storage for Surat campaign treasury.",
    reference: "Kincaid, p. 50",
    image: ""
  },
  {
    name: "Jinji Fort",
    marathi: "जिंजी",
    type: "hill",
    location: "Tamil Nadu",
    captured: "1677",
    elevation: "800 ft",
    description: "Eastern stronghold described as an 'Eastern Troy' by Europeans.",
    significance: "Southern capital. Withstood an 8-year Mughal siege (1690-1698).",
    reference: "Sarkar, p. 270",
    image: ""
  },
  {
    name: "Vishalgad Fort",
    marathi: "विशाळगड",
    type: "hill",
    location: "Kolhapur",
    captured: "1659",
    elevation: "3,630 ft",
    description: "Surrounded by dense forests, it was the safe haven during the Panhala escape.",
    significance: "Site of extreme loyalty. Guards the Konkan trade routes.",
    reference: "Sarkar, p. 78",
    image: ""
  },
  {
    name: "Suvarnadurg Fort",
    marathi: "सुवर्णदुर्ग",
    type: "sea",
    location: "Dapoli, Ratnagiri",
    captured: "1660",
    description: "A golden guardian on the coast, birthplace of Admiral Kanhoji Angre.",
    significance: "Major shipbuilding yard for the Maratha Navy.",
    reference: "Kincaid, p. 77",
    image: ""
  },
  {
    name: "Kolaba Fort",
    marathi: "कुलाबा",
    type: "sea",
    location: "Alibag, Raigad",
    captured: "1662 (Built/Strengthened)",
    description: "Strategic island fortress used to check Portuguese and Siddhi influence.",
    significance: "Last major sea fort strengthened by Shivaji Maharaj.",
    reference: "Sarkar, 'Maratha Navy'",
    image: ""
  },
  {
    name: "Khanderi Fort",
    marathi: "खांदेरी",
    type: "sea",
    location: "Alibag Coast",
    captured: "1679 (Built)",
    description: "Challenged British naval superiority near Mumbai.",
    significance: "Sentinel of the Arabian Sea. Key to Karwar campaign.",
    reference: "Gazetteer",
    image: ""
  },
  {
    name: "Salher Fort",
    marathi: "साल्हेर",
    type: "hill",
    location: "Baglan, Nashik",
    captured: "1671",
    elevation: "5,141 ft",
    description: "Highest fort in Maharashtra. Site of a decisive battle against Mughals.",
    significance: "Symbol of Maratha resurgence in Baglan region.",
    reference: "Sabhasad",
    image: ""
  },
  {
    name: "Mulher Fort",
    marathi: "मुल्हेर",
    type: "hill",
    location: "Nashik Region",
    captured: "1671",
    elevation: "4,300 ft",
    description: "Strategic fort guarding the Baglan trade routes alongside Salher.",
    significance: "Crucial for control over the Surat-Khandesh trade corridor.",
    reference: "Gazetteer",
    image: ""
  },
  {
    name: "Tikona Fort",
    marathi: "तिकोणा",
    type: "hill",
    location: "Kamshet, Pune",
    captured: "1657",
    elevation: "3,500 ft",
    description: "Triangular hill fort offering views of the entire Pawana region.",
    significance: "Strategic observation point for Maval region.",
    reference: "Local Records",
    image: ""
  },
  {
    name: "Tung Fort",
    marathi: "तुंग",
    type: "hill",
    location: "Kamshet, Pune",
    captured: "1657",
    elevation: "3,526 ft",
    description: "Also known as Kathingad (Difficult Fort) due to its conical shape.",
    significance: "Sentinel of Pawana Maval. Difficult to climb and defend.",
    reference: "Local Records",
    image: ""
  },
  {
    name: "Visapur Fort",
    marathi: "विसापूर",
    type: "hill",
    location: "Maval, Pune",
    captured: "1648",
    elevation: "3,556 ft",
    description: "Twin fort of Lohagad, featuring massive plateaus and stone carvings.",
    significance: "Part of the Lohagad-Visapur protective barrier.",
    reference: "Gazetteer",
    image: ""
  },
  {
    name: "Korigad Fort",
    marathi: "कोरीगड",
    type: "hill",
    location: "Lonavala",
    captured: "1657",
    elevation: "3,028 ft",
    description: "Impregnable fort near Aamby Valley, known for its massive perimeter walls.",
    significance: "Controlled the trade routes passing through Mulshi valley.",
    reference: "Local Records",
    image: ""
  },
  {
    name: "Sajjangad Fort",
    marathi: "सज्जनगड",
    type: "hill",
    location: "Satara",
    captured: "1663",
    elevation: "3,000 ft",
    description: "Spiritual residence of Samarth Ramdas Swami, the Guru of Shivaji Maharaj.",
    significance: "Center of spiritual guidance for Swarajya.",
    reference: "Saints of Maharashtra",
    image: ""
  },
  {
    name: "Ajinkyatara",
    marathi: "अजिंक्यतारा",
    type: "hill",
    location: "Satara City",
    captured: "1673",
    elevation: "3,300 ft",
    description: "The 'Invincible Star', overlooking the historic Satara city.",
    significance: "Important administrative seat during the late Swarajya period.",
    reference: "Gazetteer",
    image: ""
  },
  {
    name: "Vasota Fort",
    marathi: "वासोटा",
    type: "hill",
    location: "Koyna Sanctuary",
    captured: "1655",
    elevation: "3,842 ft",
    description: "Among the most difficult 'jungle' forts, surrounded by deep valleys.",
    significance: "Used as a high-security prison for important captives.",
    reference: "Purandare",
    image: ""
  },
  {
    name: "Harishchandragad",
    marathi: "हरिश्चंद्रगड",
    type: "hill",
    location: "Ahmednagar",
    captured: "1647",
    elevation: "4,600 ft",
    description: "Ancient fort known for the Konkan Kada cliff and Kedareshwar Cave.",
    significance: "Strategic northern boundary protector of Swarajya.",
    reference: "Gazetteer",
    image: ""
  },
  {
    name: "Ratangad Fort",
    marathi: "रतनगड",
    type: "hill",
    location: "Bhandardara",
    captured: "1648",
    elevation: "4,250 ft",
    description: "Known as the 'Jewel of Forts', it has a natural rock hole (Nedhe).",
    significance: "Controlled the passes between Ahmednagar and Konkan.",
    reference: "Gazetteer",
    image: ""
  },
  {
    name: "Rajmachi Fort",
    marathi: "राजमाची",
    type: "hill",
    location: "Lonavala",
    captured: "1657",
    elevation: "2,710 ft",
    description: "Strategic fort complex with Shrivardhan and Manoranjan peaks.",
    significance: "Controlled the Bor Ghat trade route between Pune and Mumbai.",
    reference: "Gazetteer",
    image: ""
  }
];

const typeIcons = {
  hill: Mountain,
  sea: Anchor,
  land: Shield,
};

const typeLabels = {
  hill: "Hill",
  sea: "Sea",
  land: "Land",
};

const FortCard = ({ fort, index }: { fort: Fort; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });
  const TypeIcon = typeIcons[fort.type];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.02 }}
      className="group h-full"
    >
      <div
        className={`h-full bg-white rounded-lg border border-[#FBE8D3] shadow-sm hover:shadow-md transition-all duration-300 p-5 flex flex-col cursor-pointer ${expanded ? 'ring-1 ring-[#D95D1E]/30' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-[#D95D1E] font-sans font-bold text-[9px] uppercase tracking-widest mb-0.5">{fort.marathi}</p>
            <h3 className="font-display font-black text-lg text-[#2C3E50] leading-tight">{fort.name}</h3>
          </div>
          <span className={`flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-sans font-black uppercase tracking-widest ${fort.type === "sea"
            ? "bg-[#2980B9]/10 text-[#2980B9]"
            : fort.type === "hill"
              ? "bg-[#27AE60]/10 text-[#27AE60]"
              : "bg-[#D35400]/10 text-[#D35400]"
            }`}>
            <TypeIcon size={10} />
            {typeLabels[fort.type]}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-1 text-[#7F8C8D] text-[10px] font-bold uppercase tracking-tight">
            <MapPin size={10} className="text-[#D95D1E]" />
            {fort.location}
          </span>
          {fort.elevation && (
            <span className="inline-flex items-center gap-1 text-[#7F8C8D] text-[10px] font-bold uppercase tracking-tight">
              <Mountain size={10} className="text-[#D95D1E]" />
              {fort.elevation}
            </span>
          )}
        </div>

        <p className={`text-[#2C3E50]/80 text-[13px] leading-relaxed mb-4 ${expanded ? '' : 'line-clamp-2'}`}>
          {fort.description}
        </p>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="pt-4 mt-auto border-t border-[#FBE8D3]/50 space-y-3"
          >
            <div>
              <h4 className="text-[#D95D1E] text-[9px] font-black uppercase tracking-widest mb-1">Significance</h4>
              <p className="text-[#2C3E50] text-[12px] leading-relaxed">{fort.significance}</p>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="text-[#D95D1E] font-black uppercase tracking-tighter">Captured:</span>
                <span className="text-[#2C3E50] font-bold">{fort.captured}</span>
              </div>
              <div className="flex items-center gap-1.5 opacity-60 italic">
                <BookOpen size={10} className="text-[#D95D1E]" />
                <span>{fort.reference}</span>
              </div>
            </div>
          </motion.div>
        )}

        {!expanded && (
          <div className="mt-auto pt-2 flex items-center gap-1 text-[9px] font-black text-[#D95D1E] uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
            Click to read details <ChevronDown size={10} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Forts = () => {
  const [filter, setFilter] = useState<"all" | "hill" | "sea" | "land">("all");
  const [search, setSearch] = useState("");

  const filteredForts = forts.filter((f) => {
    const matchesFilter = filter === "all" || f.type === filter;
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.location.toLowerCase().includes(search.toLowerCase()) ||
      f.marathi.includes(search);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="relative pt-[140px] pb-24 px-6 md:px-12 overflow-hidden bg-[#FFFFFF] text-center">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D95D1E] to-transparent opacity-30" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#D95D1E]/20 bg-[#FBE8D3]/30 text-[#D95D1E] text-[11px] font-bold uppercase tracking-[0.2em] mb-6">
              Guardians of Swarajya
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-black text-[#2C3E50] tracking-tight mb-6 leading-[1.1]">
              <span className="text-[#D95D1E]">350+</span> Forts of the <br />
              <span className="text-[#2C3E50]">Maratha Empire</span>
            </h1>
            <p className="text-[#2C3E50]/70 text-lg md:text-xl font-sans font-light leading-relaxed max-w-2xl mx-auto mb-12">
              Explore the majestic network of hill, sea, and land forts that formed the backbone of Chhatrapati Shivaji Maharaj's Hindavi Swarajya.
            </p>
          </motion.div>

          {/* Search & Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-2xl mx-auto"
          >
            <div className="relative w-full md:w-[60%]">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D95D1E]" />
              <input
                type="text"
                placeholder="Find a fort (e.g. 'Raigad', 'Sea Fort')..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-[#FBE8D3] focus:border-[#D95D1E] rounded-[4px] py-4 pl-12 pr-4 text-[#2C3E50] placeholder:text-[#2C3E50]/40 outline-none transition-all shadow-sm focus:shadow-md"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2C3E50]/40 hover:text-[#D95D1E]"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {[
                { key: "all", label: "All" },
                { key: "hill", label: "Hill" },
                { key: "sea", label: "Sea" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setFilter(item.key as any)}
                  className={`px-6 py-4 rounded-[4px] text-[11px] font-bold uppercase tracking-wider transition-all border min-w-fit ${filter === item.key
                    ? "bg-[#D95D1E] text-white border-[#D95D1E] shadow-md"
                    : "bg-white text-[#2C3E50] border-[#FBE8D3] hover:border-[#D95D1E] hover:text-[#D95D1E]"
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fort Grid */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredForts.map((fort, i) => (
            <FortCard key={fort.name} fort={fort} index={i} />
          ))}
        </div>

        {filteredForts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#2C3E50]/30 text-sm">No forts found matching your search.</p>
          </div>
        )}

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-[#2C3E50]/40 text-xs max-w-lg mx-auto leading-relaxed">
            Chhatrapati Shivaji Maharaj's empire included over 350 forts. This page showcases the most historically
            significant ones. Fort images are sourced from high-quality digital repositories and serve as historical representation.
          </p>
        </motion.div>
      </section>

      <StrategicImportance />
      <Footer />
    </div>
  );
};

const StrategicImportance = () => {
  const stats = [
    { label: "Giri-Durg", type: "Hill Forts", count: "250+", desc: "The strategic backbone, built on inaccessible Sahyadri peaks for absolute land control." },
    { label: "Jala-Durg", type: "Sea Forts", count: "50+", desc: "Maritime bastions that established the Maratha Navy's dominance over the Arabian Sea." },
    { label: "Bhumi-Durg", type: "Land Forts", count: "50+", desc: "Fortified city centers and strategic transit hubs across the Deccan plateau." }
  ];

  return (
    <section className="py-24 bg-[#F7F6F3] border-t border-[#FBE8D3]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-[#D95D1E] font-display font-black text-3xl md:text-4xl mb-4">The Science of Fortification</h2>
          <p className="text-[#2C3E50]/60 max-w-2xl mx-auto uppercase tracking-widest text-[10px] font-black">
            Chhatrapati Shivaji Maharaj's 3-Tier Defense System for Perpetual Sovereignty
          </p>
          <div className="w-12 h-1 bg-[#D95D1E] mx-auto mt-6" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="bg-white p-8 rounded-2xl border border-[#FBE8D3] shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className="text-[10px] font-black text-[#D95D1E] uppercase tracking-[0.2em] mb-2">{s.label}</div>
              <h4 className="text-2xl font-display font-black text-[#2C3E50] mb-1">{s.type}</h4>
              <div className="text-4xl font-display font-black text-[#D95D1E]/20 mb-6">{s.count}</div>
              <p className="text-sm text-[#2C3E50]/70 leading-relaxed font-medium">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-8 bg-[#2C3E50] rounded-3xl text-white relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="text-2xl font-display font-black mb-4">"Gad aala pan Sinha gela"</h3>
              <p className="text-white/70 text-sm leading-relaxed italic">
                The capture of Kondana (Sinhagad) by Tanaji Malusare remains the ultimate symbol of the bravery associated with these guardian peaks. Every stone of these forts tells a story of blood, iron, and the indomitable spirit of Swarajya.
              </p>
            </div>
            <Link
              to="/history"
              className="px-8 py-4 bg-[#D95D1E] text-white rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              Explore Timeline
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Forts;
