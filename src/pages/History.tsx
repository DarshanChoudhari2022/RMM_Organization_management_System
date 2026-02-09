import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, BookOpen } from "lucide-react";
import { getHistory } from "@/lib/api";
import type { HistoryEntry } from "@/types";

const categories = [
  { value: "all", label: "सर्व / All" },
  { value: "fort", label: "किल्ले / Forts" },
  { value: "battle", label: "लढाया / Battles" },
  { value: "treaty", label: "तह / Treaties" },
  { value: "event", label: "घटना / Events" },
];

const History = () => {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    getHistory().then(setEntries);
  }, []);

  const filtered = entries.filter((e) => {
    const matchesSearch =
      e.titleMarathi.includes(search) ||
      e.titleEnglish.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || e.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-background min-h-screen pt-20">
      {/* Header */}
      <section className="section-padding pb-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-devanagari text-4xl md:text-5xl text-gradient-gold mb-3">
            इतिहास पोर्टल
          </h1>
          <p className="font-serif text-xl text-secondary">History Portal</p>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Journey through the remarkable history of Chhatrapati Shivaji Maharaj and the Maratha Empire.
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="px-6 md:px-12 lg:px-24 mb-12">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="शोधा / Search history..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 glass rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  category === cat.value
                    ? "bg-primary text-primary-foreground"
                    : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="px-6 md:px-12 lg:px-24 pb-20">
        <div className="max-w-4xl mx-auto relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-secondary to-primary/20" />

          {filtered.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className={`relative flex items-start gap-8 mb-16 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary glow-saffron z-10 mt-6" />

              {/* Content */}
              <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                <div className="glass rounded-xl overflow-hidden hover:glow-gold transition-shadow duration-300">
                  {/* Image area */}
                  <div className="h-40 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                    <span className="text-6xl font-bold text-primary/20">{entry.year}</span>
                  </div>
                  <div className="p-6">
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded uppercase tracking-wider">
                      {entry.category}
                    </span>
                    <h3 className="font-devanagari text-xl text-secondary mt-3 mb-1">{entry.titleMarathi}</h3>
                    <h4 className="font-serif text-base text-foreground/80 mb-3">{entry.titleEnglish}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{entry.description}</p>

                    {/* Source */}
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground border-t border-border/30 pt-3">
                      <BookOpen size={12} />
                      <span>{entry.source.book}, p. {entry.source.page}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default History;
