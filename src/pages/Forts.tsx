import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { MapPin, Mountain, Calendar, Shield, Anchor, ChevronDown, BookOpen, Search, X } from "lucide-react";
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
    location: "Raigad District, Maharashtra",
    captured: "1656 (from Chandrarao More)",
    elevation: "2,700 ft",
    description: "The capital of the Maratha Empire. Originally known as 'Rairi', Shivaji captured it from Chandrarao More and renovated it extensively to serve as the royal capital. The coronation ceremony of 1674 took place here.",
    significance: "Capital of Swarajya where Shivaji was crowned Chhatrapati in 1674. Contains the royal court (Rajsabha), Hirakani Bastion, Takmak Tok, and the Samadhi (memorial) of Shivaji Maharaj.",
    reference: "Sarkar, 'Shivaji and His Times', pp. 58-60, 198-220",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Raigad_Fort_structures.jpg/1280px-Raigad_Fort_structures.jpg"
  },
  {
    name: "Torna Fort",
    marathi: "तोरणा (प्रचंडगड)",
    type: "hill",
    location: "Velhe, Pune District",
    captured: "1646 — First fort captured",
    elevation: "4,603 ft",
    description: "The first fort captured by Shivaji at the age of 16, marking the beginning of Swarajya. It is the highest fort in the Pune district. Shivaji renamed it 'Prachandagad' (Fort of Immense Strength).",
    significance: "The birthplace of Swarajya. Treasure found here funded the fortification of nearby Rajgad. It represents the very beginning of Shivaji's empire-building campaign.",
    reference: "Sarkar, 'Shivaji and His Times', Ch. III, pp. 27-30",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/FortTorna3.JPG/1280px-FortTorna3.JPG"
  },
  {
    name: "Rajgad Fort",
    marathi: "राजगड",
    type: "hill",
    location: "Bhor, Pune District",
    captured: "1647",
    elevation: "4,514 ft",
    description: "The first capital of the Maratha Empire before Raigad. Known as 'King of Forts', it served as the capital for 26 years (1648-1674). It has three machis (plateaus): Suvela, Padmavati, and Sanjivani.",
    significance: "Capital for the longest period. Shivaji planned most of his campaigns from here. The fort witnessed the birth of Rajaram (Shivaji's younger son) and multiple sieges by Bijapuri and Mughal forces.",
    reference: "Purandare, 'Raja Shivchhatrapati', Vol. 1, Ch. 5, pp. 48-60",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Rajgad_balekilla.JPG/1280px-Rajgad_balekilla.JPG"
  },
  {
    name: "Pratapgad Fort",
    marathi: "प्रतापगड",
    type: "hill",
    location: "Satara District, Maharashtra",
    captured: "Built in 1656",
    elevation: "3,543 ft",
    description: "Built by Shivaji in 1656 under the supervision of Moropant Pingle. This is the site of the legendary battle with Afzal Khan in November 1659.",
    significance: "Site of the legendary killing of Afzal Khan. The Afzal Tower and a statue of Shivaji Maharaj stand here as memorials. The Battle of Pratapgad is one of the most celebrated events in Maratha history.",
    reference: "Sarkar, 'Shivaji and His Times', Ch. VII, pp. 78-95",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Pratapgad_from_distance.JPG/1280px-Pratapgad_from_distance.JPG"
  },
  {
    name: "Sinhagad Fort",
    marathi: "सिंहगड",
    type: "hill",
    location: "Haveli, Pune District",
    captured: "1647, Recaptured 1670",
    elevation: "4,300 ft",
    description: "Originally called 'Kondana', this fort was captured early by Shivaji, lost to the Mughals in the Treaty of Purandar (1665), and dramatically recaptured by Tanaji Malusare in 1670.",
    significance: "Renamed 'Sinhagad' (Lion's Fort) after Tanaji Malusare's heroic sacrifice during the night attack in 1670. Shivaji's famous words: 'Gad aala, pan Sinha gela' (The fort is won, but the Lion is lost).",
    reference: "Purandare, 'Raja Shivchhatrapati', Vol. 2, Ch. 28, pp. 302-320",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Sinhagad_Fort_Pune.jpg/1280px-Sinhagad_Fort_Pune.jpg"
  },
  {
    name: "Shivneri Fort",
    marathi: "शिवनेरी",
    type: "hill",
    location: "Junnar, Pune District",
    captured: "Ancestral — Birthplace of Shivaji",
    elevation: "3,500 ft",
    description: "The birthplace of Chhatrapati Shivaji Maharaj. Located near Junnar, this fort was in the Bhosale family's control. Jijabai gave birth to Shivaji here on 19th February 1630.",
    significance: "Birthplace of Shivaji Maharaj. Contains the temple of Goddess Shivai after whom Shivaji was named. Also known for the Ambarkhana (granary) and the Shivkund water cisterns.",
    reference: "Sarkar, 'Shivaji and His Times', Ch. I, pp. 12-15",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Shivneri01.JPG"
  },
  {
    name: "Sindhudurg Fort",
    marathi: "सिंधुदुर्ग",
    type: "sea",
    location: "Malvan, Sindhudurg District",
    captured: "Built 1664-1667",
    description: "A sea fort built by Shivaji on a rocky island off the coast of Malvan. Constructed by Hiroji Indulkar with 3,000 workers over 3 years. It covers an area of 48 acres and has walls 30 feet high.",
    significance: "Masterpiece of Shivaji's naval architecture. Contains temples of Shivrajeshwar and imprint of Shivaji's palm and foot (the only physical imprints of Shivaji in existence). Demonstrates his vision of naval supremacy.",
    reference: "Sarkar, 'Shivaji and His Times', Ch. XX, pp. 240-248",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Sindhudurg_Fort.jpg/1280px-Sindhudurg_Fort.jpg"
  },
  {
    name: "Panhala Fort",
    marathi: "पन्हाळगड",
    type: "hill",
    location: "Kolhapur District, Maharashtra",
    captured: "1659 (from Bijapur)",
    elevation: "3,127 ft",
    description: "One of the largest forts in the Deccan, Panhala was strategically important for controlling southern Maharashtra. Shivaji was besieged here in 1660 by Siddhi Johar, leading to the Battle of Pavan Khind.",
    significance: "Site of the famous siege of 1660 from which Shivaji escaped, leading to Baji Prabhu Deshpande's legendary sacrifice at Pavan Khind. The Teen Darwaza (Three Gates) is an iconic structure.",
    reference: "Purandare, 'Raja Shivchhatrapati', Vol. 1, Ch. 18, pp. 198-212",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Panhala_fort.JPG/1280px-Panhala_fort.JPG"
  },
  {
    name: "Lohagad Fort",
    marathi: "लोहगड",
    type: "hill",
    location: "Maval, Pune District",
    captured: "1648",
    elevation: "3,400 ft",
    description: "Located near Lonavala, Lohagad (Iron Fort) is named for its impregnable defenses. Connected to the nearby Visapur Fort, it controlled the trade routes between the Konkan and the Deccan plateau.",
    significance: "Used as a treasury fort. The famous Vinchukata (Scorpion's tail) bastion is a unique defensive structure. Changed hands multiple times between Marathas, Mughals, and the British.",
    reference: "Kincaid & Parasnis, 'A History of the Maratha People', Vol. 1, pp. 50-52",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Lohagad-3.jpg/1280px-Lohagad-3.jpg"
  },
  {
    name: "Vijaydurg Fort",
    marathi: "विजयदुर्ग",
    type: "sea",
    location: "Devgad, Sindhudurg District",
    captured: "1653 (from Bijapur)",
    description: "The oldest sea fort on the Maharashtra coast, originally built by the Shilahara dynasty. Shivaji captured it from the Bijapuris and made it a key naval base. It has triple fortification walls.",
    significance: "Strongest sea fort on the Konkan coast. Served as the primary base for the Maratha Navy. Later, Admiral Kanhoji Angre made it his headquarters. The triple walls made it virtually impregnable from the sea.",
    reference: "Sarkar, 'Shivaji and His Times', Ch. XX, pp. 250-255",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Vijaydurg_1.jpg/1280px-Vijaydurg_1.jpg"
  },
  {
    name: "Purandar Fort",
    marathi: "पुरंदर",
    type: "hill",
    location: "Saswad, Pune District",
    captured: "1648",
    elevation: "4,472 ft",
    description: "A twin fort (Purandar and Vajragad) that played a crucial role in Maratha history. Birthplace of Sambhaji (eldest son of Shivaji). Site of the Treaty of Purandar in 1665.",
    significance: "One of the strongest forts in the Pune region. Murarbaji Deshpande died defending it against Jai Singh's Mughal forces in 1665. Birthplace of Sambhaji Maharaj. Treaty of Purandar signed here.",
    reference: "Sarkar, 'Shivaji and His Times', Ch. XII, pp. 142-158",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Purandar_Fort_view.jpg/1280px-Purandar_Fort_view.jpg"
  },
  {
    name: "Jinji (Senji) Fort",
    marathi: "जिंजी",
    type: "hill",
    location: "Tamil Nadu",
    captured: "1677 (Southern Campaign)",
    elevation: "800 ft",
    description: "Captured during Shivaji's Dakshin Digvijay (Southern Campaign) in 1677. This massive fort complex with three hills served as a Maratha stronghold in South India for decades.",
    significance: "Farthest southern conquest of Shivaji. Later served as capital for Rajaram (Shivaji's son) from 1689-1698 during the Mughal siege of Maharashtra. Demonstrates the vast extent of Shivaji's campaigns.",
    reference: "Sarkar, 'Shivaji and His Times', Ch. XXII, pp. 270-280",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Rajagiri-2.jpg/1280px-Rajagiri-2.jpg"
  },
  {
    name: "Vishalgad Fort",
    marathi: "विशाळगड",
    type: "hill",
    location: "Kolhapur District, Maharashtra",
    captured: "1659",
    elevation: "3,630 ft",
    description: "Known as Khelna, captured by Shivaji after the Battle of Pratapgad. This is where he safely reached after escaping from the siege of Panhala, thanks to Baji Prabhu's sacrifice.",
    significance: "Crucial for control over the Konkan region. The destination of Shivaji's escape from Panhala. Known for its difficult terrain and strategic location.",
    reference: "Sarkar, 'Shivaji and His Times', Ch. VI, pp. 78-83",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Vishalgad_Fort.jpg/1280px-Vishalgad_Fort.jpg"
  },
  {
    name: "Suvarnadurg Fort",
    marathi: "सुवर्णदुर्ग",
    type: "sea",
    location: "Dapoli, Ratnagiri District",
    captured: "1660",
    description: "The 'Golden Fort', captured from the Siddis of Janjira. It became a major shipbuilding center for the Maratha Navy.",
    significance: "A key naval base and shipbuilding center. Helped challenge the naval supremacy of the Europeans and the Siddis on the Konkan coast.",
    reference: "Kincaid, 'A History of the Maratha People', Vol. 1, p. 77",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Suvarnadurg_Fort.jpg/1280px-Suvarnadurg_Fort.jpg"
  }
];

const typeIcons = {
  hill: Mountain,
  sea: Anchor,
  land: Shield,
};

const typeLabels = {
  hill: "Hill Fort (Giridurug)",
  sea: "Sea Fort (Jaladurug)",
  land: "Land Fort (Bhumidurug)",
};

const FortCard = ({ fort, index }: { fort: Fort; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const TypeIcon = typeIcons[fort.type];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group h-full"
    >
      <div
        className="h-full bg-white rounded-[4px] border border-[#FBE8D3] shadow-[0_4px_12px_rgba(230,126,34,0.06)] hover:shadow-[0_12px_30px_rgba(230,126,34,0.12)] transition-all duration-500 overflow-hidden flex flex-col"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden clip-path-slant">
          <img
            src={fort.image}
            alt={`${fort.name} — ${fort.location}`}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

          {/* Type Badge */}
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] text-[10px] font-sans font-bold uppercase tracking-widest shadow-sm ${fort.type === "sea"
              ? "bg-[#2980B9] text-white"
              : fort.type === "hill"
                ? "bg-[#27AE60] text-white"
                : "bg-[#D35400] text-white"
              }`}>
              <TypeIcon size={12} />
              {typeLabels[fort.type]}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <p className="text-[#F39C12] font-sans font-bold text-[10px] uppercase tracking-widest mb-1">{fort.marathi}</p>
            <h3 className="font-display font-bold text-2xl leading-none">{fort.name}</h3>
          </div>
        </div>

        {/* Info */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-[#FBE8D3]/50">
            <span className="inline-flex items-center gap-2 text-[#7F8C8D] text-[11px] font-medium uppercase tracking-[0.05em]">
              <MapPin size={14} className="text-[#E67E22]" />
              {fort.location}
            </span>
            {fort.elevation && (
              <span className="inline-flex items-center gap-2 text-[#7F8C8D] text-[11px] font-medium uppercase tracking-[0.05em]">
                <Mountain size={14} className="text-[#E67E22]" />
                {fort.elevation}
              </span>
            )}
          </div>

          <p className="text-[#2C3E50] text-[15px] leading-relaxed mb-4 line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
            {fort.description}
          </p>

          <div className="mt-auto">
            {/* Expand Toggle */}
            <button className="flex items-center gap-2 text-[#E67E22] text-[11px] font-bold uppercase tracking-widest group/btn">
              {expanded ? "Read Less" : "Discover History"}
              <div className="w-6 h-[1px] bg-[#E67E22] group-hover/btn:w-10 transition-all duration-300" />
            </button>

            {/* Expanded Content */}
            <motion.div
              initial={false}
              animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
              transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="overflow-hidden"
            >
              <div className="pt-6 mt-6 border-t border-[#FBE8D3] space-y-4 bg-[#FBE8D3]/10 -mx-6 px-6 pb-4">
                <div>
                  <h4 className="text-[#E67E22] text-[11px] font-bold uppercase tracking-widest mb-2">Historical Significance</h4>
                  <p className="text-[#2C3E50] text-sm leading-relaxed">{fort.significance}</p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-[#E67E22] font-bold text-xs">Captured:</span>
                  <span className="text-[#2C3E50] text-xs">{fort.captured}</span>
                </div>

                <div className="flex items-start gap-2 p-3 bg-white border border-[#FBE8D3] rounded-[4px]">
                  <BookOpen size={14} className="text-[#E67E22] flex-shrink-0 mt-0.5" />
                  <p className="text-[#7F8C8D] text-[11px] italic font-medium">{fort.reference}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
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
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#E67E22] to-transparent opacity-30" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#E67E22]/20 bg-[#FBE8D3]/30 text-[#E67E22] text-[11px] font-bold uppercase tracking-[0.2em] mb-6">
              Guardians of Swarajya
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-black text-[#2C3E50] tracking-tight mb-6 leading-[1.1]">
              <span className="text-[#E67E22]">350+</span> Forts of the <br />
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
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E67E22]" />
              <input
                type="text"
                placeholder="Find a fort (e.g. 'Raigad', 'Sea Fort')..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-[#FBE8D3] focus:border-[#E67E22] rounded-[4px] py-4 pl-12 pr-4 text-[#2C3E50] placeholder:text-[#2C3E50]/40 outline-none transition-all shadow-sm focus:shadow-md"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2C3E50]/40 hover:text-[#E67E22]"
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
                    ? "bg-[#E67E22] text-white border-[#E67E22] shadow-md"
                    : "bg-white text-[#2C3E50] border-[#FBE8D3] hover:border-[#E67E22] hover:text-[#E67E22]"
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
            <p className="text-white/30 text-sm">No forts found matching your search.</p>
          </div>
        )}

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-foreground/40 text-xs max-w-lg mx-auto leading-relaxed">
            Shivaji Maharaj's empire included over 350 forts. This page showcases the most historically
            significant ones. Fort images are sourced from Wikimedia Commons (CC-BY-SA) and serve as historical records.
          </p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Forts;
