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
    location: "Raigad District, Maharashtra",
    captured: "1656 (from Chandrarao More)",
    elevation: "2,700 ft",
    description: "Known as the 'Gibraltar of the East', Raigad was the capital of the Maratha Empire. Chhatrapati Shivaji Maharaj seized it in 1656 from the More dynasty and extensively renovated it to be an impregnable capital. The fort complex covers approx. 1300 acres and includes the Queen's Chambers, the Public Durbar, and the famous Takmak Tok (execution point). It was chosen for its steep, inaccessible sides, making it naturally fortified. The grand coronation ceremony (Rajyabhishek) took place here on 6th June 1674.",
    significance: "The heart of Swarajya. It houses the Jagdishwar Temple and the Samadhi of Chhatrapati Shivaji Maharaj. The layout of the market (Peth) and the Royal Court (Raj Sabha) demonstrates advanced town planning and acoustic engineering.",
    reference: "Sarkar, 'Shivaji and His Times', pp. 58-60, 198-220",
    image: "https://images.unsplash.com/photo-1572948622722-1d54625b1285?auto=format&fit=crop&q=80"
    // Prompt: "Realistic landscape photograph of Raigad Fort in Raigad District, Maharashtra, seen from slightly below the hill, showing stone walls and bastions, green hillsides and cloudy sky, no tourists visible, soft daylight, 16:9 horizontal, high resolution, no text, suitable as a website card background for a Maratha history project."
  },
  {
    name: "Torna Fort",
    marathi: "तोरणा (प्रचंडगड)",
    type: "hill",
    location: "Velhe, Pune District",
    captured: "1646 — First fort captured",
    elevation: "4,603 ft",
    description: "Torna was the very first fort captured by Chhatrapati Shivaji Maharaj at the young age of 16, marking the dawn of the Maratha Empire. Recognizing its massive spread, he renamed it 'Prachandagad' (Huge Fort). It is the highest hill fort in the Pune district. The fort divides into two distinct machis (plateaus): the Zunjar Machi and the Budhla Machi, both offering strategic vantage points over the surrounding valleys.",
    significance: "The cradle of Swarajya. A hidden treasure discovered during its repair was used to finance the construction of the Rajgad fort. Its capture sent a powerful message to the Bijapur Sultanate about the rising Maratha power.",
    reference: "Sarkar, 'Shivaji and His Times', Ch. III, pp. 27-30",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80"
    // Prompt: "Realistic landscape photograph of Torna Fort in Pune District, Maharashtra, seen from slightly below the hill, showing stone walls and bastions, green hillsides and cloudy sky, no tourists visible, soft daylight, 16:9 horizontal, high resolution, no text, suitable as a website card background for a Maratha history project."
  },
  {
    name: "Rajgad Fort",
    marathi: "राजगड",
    type: "hill",
    location: "Bhor, Pune District",
    captured: "1647",
    elevation: "4,514 ft",
    description: "Rajgad (King of Forts) served as the first capital of the Maratha Empire for over 26 years before the capital moved to Raigad. It is famous for its unique construction, featuring three expansive machis: Padmavati, Suvela, and Sanjivani, and a central Balekilla (citadel). The Sanjivani Machi's double-curtain walls are a marvel of military architecture, designed to trap invaders.",
    significance: "The political powerhouse of early Swarajya. Chhatrapati Shivaji Maharaj lived here for the longest period of his life. It witnessed the birth of his son Rajaram and the tragic death of Queen Saibai. Strategically, it was considered unconquerable due to its complex fortification.",
    reference: "Purandare, 'Raja Shivchhatrapati', Vol. 1, Ch. 5, pp. 48-60",
    image: "https://images.unsplash.com/photo-1566417730635-f02737604f81?auto=format&fit=crop&q=80"
    // Prompt: "Realistic landscape photograph of Rajgad Fort in Pune District, Maharashtra, seen from slightly below the hill, showing stone walls and bastions, green hillsides and cloudy sky, no tourists visible, soft daylight, 16:9 horizontal, high resolution, no text, suitable as a website card background for a Maratha history project."
  },
  {
    name: "Pratapgad Fort",
    marathi: "प्रतापगड",
    type: "hill",
    location: "Satara District, Maharashtra",
    captured: "Built in 1656",
    elevation: "3,543 ft",
    description: "Strategically built by Chhatrapati Shivaji Maharaj to control the rebellious Jawali region and protect the Par pass. The fort is divided into a lower fort and an upper fort. It is most famous for the epic duel between Chhatrapati Shivaji Maharaj and the Bijapur general Afzal Khan in 1659, a turning point in Maratha history where a smaller force defeated a mighty army through guerrilla warfare.",
    significance: "Symbol of Maratha valor and guerrilla tactics. It houses a temple of Goddess Bhawani, the family deity. The 'Afzal Buruj' stands as a testament to the decisive victory against the Adilshahi forces.",
    reference: "Sarkar, 'Shivaji and His Times', Ch. VII, pp. 78-95",
    image: "https://images.unsplash.com/photo-1623838385002-2334863f6955?auto=format&fit=crop&q=80"
    // Prompt: "Realistic landscape photograph of Pratapgad Fort in Satara District, Maharashtra, seen from slightly below the hill, showing stone walls and bastions, green hillsides and cloudy sky, no tourists visible, soft daylight, 16:9 horizontal, high resolution, no text, suitable as a website card background for a Maratha history project."
  },
  {
    name: "Sinhagad Fort",
    marathi: "सिंहगड",
    type: "hill",
    location: "Haveli, Pune District",
    captured: "1647, Recaptured 1670",
    elevation: "4,300 ft",
    description: "Originally 'Kondana', this fort has seen many battles. The most legendary is the Battle of Sinhagad in 1670, where Subhedar Tanaji Malusare and his mawlas scaled the sheer 'Donaje' cliff at night using monitor lizards. Tanaji fought valiantly against Udaybhan Rathod and sacrificed his life to secure the fort for Swarajya.",
    significance: "Renamed 'Sinhagad' (Lion's Fort) in honor of Tanaji Malusare. The memorial of Tanaji and the tomb of Rajaram Chhatrapati are located here. It served as a critical outpost for protecting Pune city.",
    reference: "Purandare, 'Raja Shivchhatrapati', Vol. 2, Ch. 28, pp. 302-320",
    image: "https://images.unsplash.com/photo-1620766165457-a8085a00d51b?auto=format&fit=crop&q=80"
    // Prompt: "Realistic landscape photograph of Sinhagad Fort in Pune District, Maharashtra, seen from slightly below the hill, showing stone walls and bastions, green hillsides and cloudy sky, no tourists visible, soft daylight, 16:9 horizontal, high resolution, no text, suitable as a website card background for a Maratha history project."
  },
  {
    name: "Shivneri Fort",
    marathi: "शिवनेरी",
    type: "hill",
    location: "Junnar, Pune District",
    captured: "Ancestral — Birthplace",
    elevation: "3,500 ft",
    description: "A triangular fort with seven defensive gates, Shivneri is the sacred birthplace of Chhatrapati Shivaji Maharaj. His father Shahaji entrusted the fort to his pregnant wife Jijabai for her safety during turbulent times. It was here, under the tutelage of Jijau and Dadaji Konddev, that the young Shivaji's character and vision for Swarajya were molded.",
    significance: "The birthplace of the vision of Hindavi Swarajya. The room where he was born (Shiv Kunj) and the temple of Goddess Shivai are revered sites. The fort's water management system (Badami Talav) is a marvel of engineering.",
    reference: "Sarkar, 'Shivaji and His Times', Ch. I, pp. 12-15",
    image: "https://images.unsplash.com/photo-1627998672583-050f53198084?auto=format&fit=crop&q=80"
    // Prompt: "Realistic landscape photograph of Shivneri Fort in Junnar, Pune District, Maharashtra, seen from slightly below the hill, showing stone walls and bastions, green hillsides and cloudy sky, no tourists visible, soft daylight, 16:9 horizontal, high resolution, no text, suitable as a website card background for a Maratha history project."
  },
  {
    name: "Sindhudurg Fort",
    marathi: "सिंधुदुर्ग",
    type: "sea",
    location: "Malvan, Sindhudurg District",
    captured: "Built 1664-1667",
    description: "A marvel of naval engineering built on the rocky Kurte Island. Realizing the need for a strong navy to counter the Siddis, Portuguese, and British, Chhatrapati Shivaji Maharaj commissioned this fort. Its foundation was laid with molten lead to withstand the pounding waves. The zig-zag fortification walls were designed to hide Maratha troops and cannons from enemy ships.",
    significance: "The headquarters of the Maratha Navy. It symbolizes Chhatrapati Shivaji Maharaj's foresight in understanding that 'He who has the Navy, owns the Sea'. It contains the only temple dedicated to Chhatrapati Shivaji Maharaj (Shivrajeshwar Temple) built by his son Rajaram.",
    reference: "Sarkar, 'Shivaji and His Times', Ch. XX, pp. 240-248",
    image: "https://images.unsplash.com/photo-1588416936097-4188d9b2e04e?auto=format&fit=crop&q=80"
  },
  {
    name: "Panhala Fort",
    marathi: "पन्हाळगड",
    type: "hill",
    location: "Kolhapur District, Maharashtra",
    captured: "1659 (from Bijapur)",
    elevation: "3,127 ft",
    description: "A massive fort with a perimeter of 14 km, Panhala is famous for the 'Siege of Panhala' (1660). Trapped by Siddhi Johar's army for months, Chhatrapati Shivaji Maharaj made a daring escape on a rainy night to Vishalgad, while his loyal commander Baji Prabhu Deshpande held the pursuing army at Ghodkhind (later Pavan Khind) with a handful of soldiers.",
    significance: "Site of one of the greatest escapes and sacrifices in history. The Ambarkhana (granary) here could store enough grain to withstand years of siege. It was also the capital of the Karveer (Kolhapur) branch of the Maratha Empire under Queen Tarabai.",
    reference: "Purandare, 'Raja Shivchhatrapati', Vol. 1, Ch. 18, pp. 198-212",
    image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80"
  },
  {
    name: "Lohagad Fort",
    marathi: "लोहगड",
    type: "hill",
    location: "Maval, Pune District",
    captured: "1648",
    elevation: "3,400 ft",
    description: "Overlooking the pivotal trade route of Bor Ghat, Lohagad (Iron Fort) was structurally reinforced to be one of the strongest forts. It was used primarily to store the Surat loot and other treasury. The distinct 'Vinchu Kata' (Scorpion's Tail) is a long, fortified spur jutting out from the main fort, providing a strategic defense line.",
    significance: "A vital treasury and strategic outpost. Its proximity to Visapur Fort made it a formidable twin-fort complex. During the later Peshwa period, it was used to keep prisoners and treasury.",
    reference: "Kincaid & Parasnis, 'A History of the Maratha People', Vol. 1, pp. 50-52",
    image: "https://images.unsplash.com/photo-1596726915243-7f2832870e28?auto=format&fit=crop&q=80"
  },
  {
    name: "Vijaydurg Fort",
    marathi: "विजयदुर्ग",
    type: "sea",
    location: "Devgad, Sindhudurg District",
    captured: "1653 (from Bijapur)",
    description: "Known as the 'Gibraltar of Asia', Vijaydurg was considered impregnable from the sea due to its triple line of fortifications and an underwater wall that trapped enemy ships. Captured from Bijapur, it became the main naval base of the Maratha Empire. Under Admiral Kanhoji Angre, it became a terror for European naval powers.",
    significance: "The naval powerhouse of the Marathas. It witnessed the Helium discovery in 1868. Its strategic location at the mouth of the Vaghotan river made it a perfect dock for the Maratha warships.",
    reference: "Sarkar, 'Shivaji and His Times', Ch. XX, pp. 250-255",
    image: "https://images.unsplash.com/photo-1598545279626-d62153573c05?auto=format&fit=crop&q=80"
  },
  {
    name: "Purandar Fort",
    marathi: "पुरंदर",
    type: "hill",
    location: "Saswad, Pune District",
    captured: "1648",
    elevation: "4,472 ft",
    description: "A fort of immense strategic value, Purandar witnessed the heroic last stand of Murarbaji Deshpande against the Mughal commander Diler Khan. Though Murarbaji fell, his bravery is legendary. The 'Treaty of Purandar' (1665) was signed here between Chhatrapati Shivaji Maharaj and Jai Singh, where Shivaji Maharaj had to cede 23 forts to the Mughals.",
    significance: "Birthplace of Chhatrapati Sambhaji Maharaj. It was the temporary capital during the conflict with the Mughals. The fort is actually a twin-fort system with Purandar and the smaller Vajragad.",
    reference: "Sarkar, 'Shivaji and His Times', Ch. XII, pp. 142-158",
    image: "https://images.unsplash.com/photo-1532417302055-3a67d5594b29?auto=format&fit=crop&q=80"
  },
  {
    name: "Jinji (Senji) Fort",
    marathi: "जिंजी",
    type: "hill",
    location: "Tamil Nadu",
    captured: "1677 (Southern Campaign)",
    elevation: "800 ft",
    description: "During his Southern Campaign (Dakshin Digvijay), Chhatrapati Shivaji Maharaj captured Jinji and fortified it to be an 'Eastern Troy'. It spans three hills: Rajagiri, Krishnagiri, and Chandrayandurg. He foresaw its need as a final refuge, which came true when his son Rajaram used it as the capital during the 27-year war against Aurangzeb.",
    significance: "The ultimate safety vault of the Maratha Empire. It withstood a massive Mughal siege for 8 years (1690–1698), allowing the Maratha resistance to survive and eventually reclaim Swarajya.",
    reference: "Sarkar, 'Shivaji and His Times', Ch. XXII, pp. 270-280",
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80"
  },
  {
    name: "Vishalgad Fort",
    marathi: "विशाळगड",
    type: "hill",
    location: "Kolhapur District, Maharashtra",
    captured: "1659",
    elevation: "3,630 ft",
    description: "Anciently known as Khelna, this fort is surrounded by dense forests and difficult terrain. It became famous as the destination of Chhatrapati Shivaji Maharaj's escape from Panhala. While Shivaji Maharaj reached this fort safely, Baji Prabhu Deshpande and his men laid down their lives at Pavan Khind to stop the enemy pursuit.",
    significance: "A symbol of loyalty and sacrifice. The tomb of reformist social leader Haji Hazrat Peer Malik Rehan is also located here. It served as a key watchtower over the Konkan trade routes.",
    reference: "Sarkar, 'Shivaji and His Times', Ch. VI, pp. 78-83",
    image: "https://images.unsplash.com/photo-1623838385002-2334863f6955?auto=format&fit=crop&q=80"
  },
  {
    name: "Suvarnadurg Fort",
    marathi: "सुवर्णदुर्ग",
    type: "sea",
    location: "Dapoli, Ratnagiri District",
    captured: "1660",
    description: "The 'Golden Fort' is a sea fort located on a small island near Harnai. Chhatrapati Shivaji Maharaj captured it from the Siddis to counter their naval power. It was strengthened and used as a major shipbuilding facility for the Maratha Navy. It has a secret underwater tunnel connecting it to the land fort Kanakdurg.",
    significance: "A cornerstone of Maratha naval power. It was the birthplace of the legendary Admiral Kanhoji Angre, who later became the Sarkhel (Grand Admiral) of the Maratha Navy and remained undefeated by European powers.",
    reference: "Kincaid, 'A History of the Maratha People', Vol. 1, p. 77",
    image: "https://images.unsplash.com/photo-1588416936097-4188d9b2e04e?auto=format&fit=crop&q=80"
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
              <MapPin size={14} className="text-[#D95D1E]" />
              {fort.location}
            </span>
            {fort.elevation && (
              <span className="inline-flex items-center gap-2 text-[#7F8C8D] text-[11px] font-medium uppercase tracking-[0.05em]">
                <Mountain size={14} className="text-[#D95D1E]" />
                {fort.elevation}
              </span>
            )}
          </div>

          <p className="text-[#2C3E50] text-[15px] leading-relaxed mb-4 line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
            {fort.description}
          </p>

          <div className="mt-auto">
            {/* Expand Toggle */}
            <button className="flex items-center gap-2 text-[#D95D1E] text-[11px] font-bold uppercase tracking-widest group/btn">
              {expanded ? "Read Less" : "Discover History"}
              <div className="w-6 h-[1px] bg-[#D95D1E] group-hover/btn:w-10 transition-all duration-300" />
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
                  <h4 className="text-[#D95D1E] text-[11px] font-bold uppercase tracking-widest mb-2">Historical Significance</h4>
                  <p className="text-[#2C3E50] text-sm leading-relaxed">{fort.significance}</p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-[#D95D1E] font-bold text-xs">Captured:</span>
                  <span className="text-[#2C3E50] text-xs">{fort.captured}</span>
                </div>

                <div className="flex items-start gap-2 p-3 bg-white border border-[#FBE8D3] rounded-[4px]">
                  <BookOpen size={14} className="text-[#D95D1E] flex-shrink-0 mt-0.5" />
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
