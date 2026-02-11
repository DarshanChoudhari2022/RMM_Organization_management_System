import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { MapPin, Mountain, Calendar, Shield, Anchor, ChevronDown, BookOpen, Search, X, ScrollText, History as HistoryIcon, Flag } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/landing/Footer";

import { allForts, type Fort } from "@/data/forts";

const forts = allForts;

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
  const [visibleCount, setVisibleCount] = useState(12);

  const filteredForts = forts.filter((f) => {
    const matchesFilter = filter === "all" || f.type === filter;
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.location.toLowerCase().includes(search.toLowerCase()) ||
      f.marathi.includes(search);
    return matchesFilter && matchesSearch;
  });

  const displayedForts = filteredForts.slice(0, visibleCount);

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
                placeholder="Search 350+ forts (e.g. 'Raigad', 'Pune')..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisibleCount(12); // Reset view on search
                }}
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
                  onClick={() => {
                    setFilter(t);
                    setVisibleCount(12); // Reset view on filter
                  }}
                  className={`flex-grow md:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === t
                    ? 'bg-[#D95D1E] text-white shadow-lg shadow-[#D95D1E]/30'
                    : 'bg-[#F7F6F3] text-[#2C3E50] hover:bg-[#FBE8D3]'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="mt-6 text-[10px] font-black uppercase tracking-widest text-[#2C3E50]/40">
            Showing {displayedForts.length} of {filteredForts.length} Total Forts
          </div>
        </div>
      </section>

      {/* Forts Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedForts.map((fort, i) => (
            <FortCard key={`${fort.name}-${i}`} fort={fort} index={i} />
          ))}
        </div>

        {visibleCount < filteredForts.length && (
          <div className="mt-16 text-center">
            <button
              onClick={() => setVisibleCount(prev => prev + 24)}
              className="px-12 py-4 bg-white border-2 border-[#D95D1E] text-[#D95D1E] rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-[#D95D1E] hover:text-white transition-all shadow-lg active:scale-95"
            >
              Show More Forts
            </button>
          </div>
        )}

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
          className="mt-32 p-10 bg-[#2C3E50] rounded-[2rem] text-white relative overflow-hidden"
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
