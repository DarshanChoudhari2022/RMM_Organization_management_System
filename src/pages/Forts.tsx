import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { MapPin, Mountain, Calendar, Shield, Anchor, ChevronDown, BookOpen, Search, X, ScrollText, History as HistoryIcon, Flag } from "lucide-react";
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
  history: string;
  reference: string;
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
    history: "Chhatrapati Shivaji Maharaj captured this fort from Chandrarao More in 1656. He chose it as his capital due to its impregnable position. The coronation took place here on June 6, 1674. It remained a symbol of Maratha power until it was captured by the British in 1818.",
    reference: "Sarkar, 'Shivaji and His Times'"
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
    history: "In 1646, a young Shivaji Maharaj captured Torna from the Bijapur Sultanate. During repairs, he discovered hidden treasure which was used to build Rajgad Fort. This event marked the beginning of his quest for Hindavi Swarajya.",
    reference: "Sabhasad Bakhar"
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
    history: "Constructed using the treasure found at Torna. Chhatrapati Shivaji Maharaj stayed here for over 25 years, more than any other fort. It witnessed many historic events, including the birth of Rajaram Maharaj.",
    reference: "Purandare, 'Raja Shivchhatrapati'"
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
    history: "Built by Moropant Pingale on the orders of Shivaji Maharaj to command the Jawali valley. In 1659, the historic encounter with Afzal Khan took place at the foot of this fort, resulting in a decisive Maratha victory.",
    reference: "Sarkar, p. 78"
  },
  {
    name: "Sindhudurg Fort",
    marathi: "सिंधुदुर्ग",
    type: "sea",
    location: "Malvan, Konkan",
    captured: "1664 (Built)",
    description: "A naval masterpiece built on Kurte Island with foundations of molten lead.",
    significance: "Headquarters of the Maratha Navy. Contains a temple dedicated to Shivaji Maharaj.",
    history: "Personally designed by Chhatrapati Shivaji Maharaj. Over 4,000 pounds of iron were used for the foundation and the walls are built with lead-filled stones to withstand the corrosive sea. It was the centerpiece of Maratha maritime defense.",
    reference: "Sarkar, p. 240"
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
    history: "In 1670, Tanaji Malusare and his men scaled the steep cliff at night using a monitor lizard (Ghorpad). Tanaji fought bravely but died in the battle. Shivaji Maharaj famously said, 'Gad aala pan Sinha gela' (The fort is won, but the lion is lost).",
    reference: "Purandare, p. 302"
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
    history: "Jijabai stayed here during her pregnancy due to the fort's security. Shivaji Maharaj was born on Feb 19, 1630. He spent his early childhood here, learning the basics of administration and warfare from his mother and companions.",
    reference: "Sarkar, p. 12"
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
    history: "Captured from Bijapur in 1659. In 1660, Shivaji Maharaj was trapped here by Siddhi Johar. He made a miraculous escape on a rainy night, while Baji Prabhu Deshpande and 300 soldiers held off the enemy at Ghod Khind (later Pavan Khind).",
    reference: "Purandare, p. 198"
  },
  {
    name: "Vijaydurg Fort",
    marathi: "विजयदुर्ग",
    type: "sea",
    location: "Devgad, Sindhudurg",
    captured: "1653",
    description: "Considered the 'Gibraltar of Asia', featuring a triple line of naval fortifications.",
    significance: "Key naval base. Features an underwater stone wall for defense.",
    history: "One of the oldest forts on the coast, rebuilt by Shivaji Maharaj. It survived multiple attacks by the British, Portuguese, and Dutch. Its unique triple-walled structure made it virtually impregnable from the sea.",
    reference: "Sarkar, p. 250"
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
    history: "Besieged by Jai Singh of Amber in 1665. Murarbaji Deshpande defended the Vajragad peak with incredible bravery until his death. This led to the Treaty of Purandar where Shivaji Maharaj had to surrender 23 forts to the Mughals.",
    reference: "Sarkar, p. 142"
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
    history: "Used to store the wealth looted from Surat. Its high walls and four sequential gates (Ganesh, Narayan, Hanuman, Maha) made it one of the most secure treasury locations in the empire.",
    reference: "Kincaid, p. 50"
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
    history: "Captured during the Dakshin Digvijay campaign. It later became the refuge for Rajaram Maharaj when the Mughals captured Raigad. The fort's three hills (Rajagiri, Krishnagiri, Chandrayandurg) form a massive defensive complex.",
    reference: "Sarkar, p. 270"
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
    history: "Originally Khelna, captured from Adilshahi. The journey from Panhala to Vishalgad is legendary for the sacrifice of Baji Prabhu Deshpande. The fort remains a symbol of extreme loyalty and mountain warfare mastery.",
    reference: "Sarkar, p. 78"
  },
  {
    name: "Suvarnadurg Fort",
    marathi: "सुवर्णदुर्ग",
    type: "sea",
    location: "Dapoli, Ratnagiri",
    captured: "1660",
    description: "A golden guardian on the coast, birthplace of Admiral Kanhoji Angre.",
    significance: "Major shipbuilding yard for the Maratha Navy.",
    history: "Built specifically to counter the Siddis of Janjira. It served as a vital naval base and a site for constructing 'Galbats' and 'Gurabs' (Maratha warships). It was later the headquarters of the famous Admiral Kanhoji Angre.",
    reference: "Kincaid, p. 77"
  },
  {
    name: "Khanderi Fort",
    marathi: "खांदेरी",
    type: "sea",
    location: "Alibag Coast",
    captured: "1679 (Built)",
    description: "Challenged British naval superiority near Mumbai.",
    significance: "Sentinel of the Arabian Sea. Key to Karwar campaign.",
    history: "Built in 1679 despite intense opposition from the British at Mumbai. Shivaji Maharaj successfully fortified the island, forcing the British to acknowledge Maratha dominance in the nearby waters.",
    reference: "Gazetteer"
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
    history: "In 1672, a massive open-field battle took place here where the Marathas defeated a superior Mughal army. This was one of the first major Maratha victories over the Mughals in an open battle.",
    reference: "Sabhasad"
  },
  {
    name: "Harihar Fort",
    marathi: "हरीहर",
    type: "hill",
    location: "Igatpuri, Nashik",
    captured: "1670",
    elevation: "3,676 ft",
    description: "Famous for its nearly vertical rock-cut steps. A masterpiece of rock engineering.",
    significance: "Strategic surveillance point for the Gonda Ghat.",
    history: "Captured during the campaign following the escape from Agra. The fort's almost 80-degree staircase carved into the rock face remains a marvel of engineering and defensive strategy.",
    reference: "Gazetteer"
  },
  {
    name: "Chakan Fort",
    marathi: "चाकण",
    type: "land",
    location: "Chakan, Pune",
    captured: "1647",
    description: "A vital land fort guarding the northern approaches to Pune.",
    significance: "Witnessed the heroic defense by Firangoji Narsala.",
    history: "In 1660, Shaista Khan's massive army besieged this small fort. Firangoji Narsala and his garrison held out for 56 days against overwhelming odds, earning praise even from the enemy general.",
    reference: "Purandare"
  },
  {
    name: "Murud-Janjira",
    marathi: "जंजिरा",
    type: "sea",
    location: "Murud, Raigad",
    captured: "Unconquered",
    description: "The invincible sea fort of the Siddis. Shivaji Maharaj built Padmadurg to challenge it.",
    significance: "The only fort on the west coast that Marathas couldn't capture despite many attempts.",
    history: "A major source of frustration for the Maratha Navy. Shivaji Maharaj attempted to capture it multiple times, even trying to build a stone causeway across the sea. He eventually built Padmadurg to keep the Siddis in check.",
    reference: "Maratha Navy History"
  },
  {
    name: "Padmadurg Fort",
    marathi: "पद्मदुर्ग",
    type: "sea",
    location: "Murud, Raigad",
    captured: "1676 (Built)",
    description: "Built by Shivaji Maharaj specifically to challenge the Siddhi's Janjira.",
    significance: "Lotus-shaped sea fortress. Symbol of Maratha persistence.",
    history: "Known as Kasa Fort, it was built on a rock amidst many obstacles. It provided a base for Maratha ships to monitor and attack the Siddhi fleet of Janjira.",
    reference: "Gazetteer"
  }
];

const typeIcons = {
  hill: Mountain,
  sea: Anchor,
  land: Shield,
};

const typeLabels = {
  hill: "Hill Fort",
  sea: "Sea Fort",
  land: "Land Fort",
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
        className={`h-full bg-white rounded-xl border border-[#FBE8D3] shadow-sm hover:shadow-xl transition-all duration-500 p-6 flex flex-col cursor-pointer ${expanded ? 'ring-2 ring-[#D95D1E]/20 bg-[#F7F6F3]/50' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[#D95D1E] font-sans font-black text-[10px] uppercase tracking-widest mb-1">{fort.marathi}</p>
            <h3 className="font-display font-black text-xl text-[#2C3E50] leading-tight group-hover:text-[#D95D1E] transition-colors">{fort.name}</h3>
          </div>
          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-sans font-black uppercase tracking-widest ${fort.type === "sea"
            ? "bg-[#2980B9] text-white"
            : fort.type === "hill"
              ? "bg-[#27AE60] text-white"
              : "bg-[#D35400] text-white"
            }`}>
            <TypeIcon size={12} />
            {typeLabels[fort.type]}
          </span>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <span className="inline-flex items-center gap-1.5 text-[#7F8C8D] text-[11px] font-bold uppercase tracking-tight">
            <MapPin size={12} className="text-[#D95D1E]" />
            {fort.location}
          </span>
          {fort.elevation && (
            <span className="inline-flex items-center gap-1.5 text-[#7F8C8D] text-[11px] font-bold uppercase tracking-tight">
              <Mountain size={12} className="text-[#D95D1E]" />
              {fort.elevation}
            </span>
          )}
        </div>

        <p className={`text-[#2C3E50] text-[14px] leading-relaxed mb-6 font-medium ${expanded ? '' : 'line-clamp-2'}`}>
          {fort.description}
        </p>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="pt-6 border-t border-[#FBE8D3] space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <HistoryIcon size={14} className="text-[#D95D1E]" />
                <h4 className="text-[#D95D1E] text-[10px] font-black uppercase tracking-[0.2em]">Historical Account</h4>
              </div>
              <p className="text-[#2C3E50] text-[13px] leading-relaxed italic border-l-2 border-[#D95D1E]/20 pl-4">{fort.history}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Flag size={14} className="text-[#D95D1E]" />
                <h4 className="text-[#D95D1E] text-[10px] font-black uppercase tracking-[0.2em]">Significance</h4>
              </div>
              <p className="text-[#2C3E50] text-[13px] leading-relaxed">{fort.significance}</p>
            </div>

            <div className="flex items-center justify-between pt-4 text-[11px] border-t border-[#FBE8D3]/50">
              <div className="flex items-center gap-2">
                <span className="bg-[#D95D1E]/10 text-[#D95D1E] px-2 py-0.5 rounded font-black uppercase">Captured:</span>
                <span className="text-[#2C3E50] font-black">{fort.captured}</span>
              </div>
              <div className="flex items-center gap-1.5 opacity-50 font-bold">
                <BookOpen size={12} />
                <span>{fort.reference}</span>
              </div>
            </div>
          </motion.div>
        )}

        {!expanded && (
          <div className="mt-auto pt-4 flex items-center gap-2 text-[10px] font-black text-[#D95D1E] uppercase tracking-widest border-t border-[#FBE8D3]/30">
            Discover History <ChevronDown size={12} />
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
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-white">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D95D1E]/20 to-transparent" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FBE8D3]/50 border border-[#D95D1E]/20 text-[#D95D1E] text-[11px] font-black uppercase tracking-[0.2em]">
              <Shield size={14} />
              The Fortress Network
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-black text-[#2C3E50] tracking-tighter leading-[1.1]">
              <span className="text-[#D95D1E]">350+</span> Guardians of <br />
              <span className="relative">
                Hindavi Swarajya
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                  <path d="M0 5 Q25 0 50 5 T100 5" fill="none" stroke="#D95D1E" strokeWidth="2" opacity="0.3" />
                </svg>
              </span>
            </h1>
            <p className="text-[#2C3E50]/70 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Explore the strategic network of hill, sea, and land forts that formed the backbone of Chhatrapati Shivaji Maharaj's legendary defense system.
            </p>
          </motion.div>

          {/* Search & Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12 flex flex-col md:flex-row items-center gap-4 max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-xl border border-[#FBE8D3]"
          >
            <div className="relative flex-grow w-full">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D95D1E]" />
              <input
                type="text"
                placeholder="Search forts, locations, or Marathi names..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-4 pl-12 pr-4 bg-transparent text-[#2C3E50] font-bold text-sm outline-none placeholder:text-[#2C3E50]/30"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2C3E50]/30 hover:text-[#D95D1E]">
                  <X size={18} />
                </button>
              )}
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              {(['all', 'hill', 'sea', 'land'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`flex-grow md:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === t
                    ? 'bg-[#D95D1E] text-white shadow-lg shadow-[#D95D1E]/30'
                    : 'bg-[#F7F6F3] text-[#2C3E50] hover:bg-[#FBE8D3]'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Forts Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredForts.map((fort, i) => (
            <FortCard key={fort.name} fort={fort} index={i} />
          ))}
        </div>

        {filteredForts.length === 0 && (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="w-16 h-16 bg-[#F7F6F3] rounded-full flex items-center justify-center mb-4">
              <Search size={24} className="text-[#2C3E50]/20" />
            </div>
            <p className="text-[#2C3E50]/40 font-bold">No results found for your search.</p>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 p-10 bg-[#2C3E50] rounded-[2rem] text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <ScrollText size={200} />
          </div>
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-black mb-6">"A Fort is the Wealth of the Kingdom"</h2>
            <p className="text-white/70 text-sm leading-relaxed mb-8 italic">
              "The forts are the soul of the kingdom. If the forts are strong, the kingdom is secure. If the forts are lost, the kingdom is lost. Every hill should be fortified, and every fort should be a symbol of resistance."
            </p>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D95D1E]">— Administrative Principles of Swarajya</div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Forts;
