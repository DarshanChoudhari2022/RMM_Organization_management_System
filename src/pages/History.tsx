import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BookOpen, Filter, Search, Shield, Swords, ScrollText } from "lucide-react";

import type { HistoryEntry } from "@/types";
import { getHistory } from "@/lib/api";

const CATEGORIES: Array<{ id: HistoryEntry["category"] | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "fort", label: "Forts" },
  { id: "battle", label: "Battles" },
  { id: "treaty", label: "Treaties" },
  { id: "event", label: "Events" },
];

function categoryIcon(category: HistoryEntry["category"]) {
  switch (category) {
    case "battle":
      return Swords;
    case "treaty":
      return ScrollText;
    case "event":
      return Shield;
    case "fort":
    default:
      return BookOpen;
  }
}

const History = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<HistoryEntry["category"] | "all">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["history"],
    queryFn: getHistory,
  });

  const entries = useMemo(() => {
    const list = (data ?? []).slice().sort((a, b) => a.year - b.year);
    const q = query.trim().toLowerCase();

    return list.filter((e) => {
      const matchesCategory = category === "all" || e.category === category;
      const matchesQuery =
        !q ||
        e.titleEnglish.toLowerCase().includes(q) ||
        e.titleMarathi.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        `${e.year}`.includes(q) ||
        e.source.book.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [data, query, category]);

  return (
    <div className="bg-shiv-dark min-h-screen pt-24">
      {/* Header */}
      <section className="px-6 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-3 px-5 py-2 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm">
            <ScrollText className="text-shiv-orange" size={16} />
            <span className="text-[10px] text-white font-black uppercase tracking-[0.5em]">History Portal</span>
          </div>
          <h1 className="text-white mt-8 mb-4">Chronicles of Swarajya</h1>
          <p className="text-white/60 font-serif italic text-lg max-w-3xl leading-shiv">
            Verified highlights with book + page references. Search by year, fort/battle, or source.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 border-y border-white/5 bg-shiv-dark/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search: year, title, description, or book…"
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-shiv-orange/30"
            />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            <div className="hidden lg:flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-widest pr-2">
              <Filter size={14} className="text-shiv-orange" /> Category
            </div>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.3em] border transition-all whitespace-nowrap ${
                  category === c.id
                    ? "bg-shiv-orange text-white border-shiv-orange shadow-[0_10px_30px_rgba(255,94,0,0.25)]"
                    : "bg-white/5 text-white/60 border-white/10 hover:border-white/20 hover:text-white"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12">
          {/* Left rail */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-40 space-y-6">
              <div className="p-8 bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Results</div>
                <div className="text-4xl font-black text-white mt-3">{isLoading ? "…" : entries.length}</div>
                <div className="text-white/40 text-sm font-serif italic mt-2 leading-shiv">
                  Scroll the timeline for story cards. Each card includes the source reference.
                </div>
              </div>
              <div className="h-px bg-gradient-to-r from-shiv-orange/60 to-transparent" />
              <div className="text-white/30 text-[10px] font-black uppercase tracking-widest">
                Tip: try searching “Purandar”, “1665”, or a book name
              </div>
            </div>
          </div>

          {/* Timeline list */}
          <div className="lg:col-span-9">
            {isLoading ? (
              <div className="text-white/60 font-serif italic">Loading history…</div>
            ) : entries.length === 0 ? (
              <div className="bg-white/5 border border-white/10 p-10 text-white/60 font-serif italic">
                No results match your search/filter.
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-shiv-orange/60 via-white/10 to-transparent" />

                <div className="space-y-10">
                  {entries.map((e, idx) => {
                    const Icon = categoryIcon(e.category);
                    return (
                      <motion.article
                        key={e.id}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5, delay: Math.min(idx * 0.03, 0.2) }}
                        className="relative pl-16"
                      >
                        <div className="absolute left-[7px] top-8 w-3 h-3 rounded-full bg-shiv-orange shadow-[0_0_18px_rgba(255,94,0,0.8)]" />

                        <div className="bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden">
                          <div className="grid md:grid-cols-12 gap-0">
                            <div className="md:col-span-4">
                              <div className="aspect-[4/3] bg-black/20 relative overflow-hidden">
                                <img
                                  src={e.image}
                                  alt={e.titleEnglish}
                                  className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-shiv-dark/80 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4">
                                  <div className="text-shiv-orange font-black text-4xl">{e.year}</div>
                                  <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">
                                    {e.category}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="md:col-span-8 p-10">
                              <div className="flex items-center gap-3 text-shiv-orange mb-6">
                                <Icon size={18} />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                                  Source: {e.source.book} • p.{e.source.page}
                                </span>
                              </div>

                              <div className="space-y-4">
                                <span className="logo-marathi text-3xl text-white block leading-tight">
                                  {e.titleMarathi}
                                </span>
                                <h3 className="text-white text-xl italic">{e.titleEnglish}</h3>
                                <p className="text-white/60 font-serif italic leading-shiv">{e.description}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default History;
