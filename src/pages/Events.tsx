import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, X, ZoomIn } from "lucide-react";

import type { EventEntry } from "@/types";
import { getEvents } from "@/lib/api";

const Events = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  const years = useMemo(() => {
    const unique = new Set<number>();
    (data ?? []).forEach((e) => unique.add(e.year));
    return Array.from(unique).sort((a, b) => b - a);
  }, [data]);

  const [activeYear, setActiveYear] = useState<number | null>(null);
  const resolvedYear = activeYear ?? years[0] ?? new Date().getFullYear();

  const eventsForYear = useMemo(() => {
    return (data ?? []).filter((e) => e.year === resolvedYear);
  }, [data, resolvedYear]);

  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  return (
    <div className="bg-shiv-dark min-h-screen pt-24">
      {/* Hero */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-3 px-5 py-2 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm">
            <Calendar className="text-shiv-orange" size={16} />
            <span className="text-[10px] text-white font-black uppercase tracking-[0.5em]">Event Archives</span>
          </div>
          <h1 className="text-white mt-8 mb-4">
            Celebrations <span className="italic text-shiv-orange">1972–2025</span>
          </h1>
          <p className="text-white/60 font-serif italic text-lg max-w-3xl leading-shiv">
            Year-wise archives with highlights, location, and photo sets. (Mock data today; backend-ready service layer.)
          </p>
        </div>
      </section>

      {/* Year selector */}
      <section className="sticky top-16 z-30 border-y border-white/5 bg-shiv-dark/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3 overflow-x-auto no-scrollbar">
          {years.map((y) => (
            <button
              key={y}
              onClick={() => setActiveYear(y)}
              className={`px-6 py-3 text-[10px] font-black uppercase tracking-[0.3em] border transition-all whitespace-nowrap ${resolvedYear === y
                  ? "bg-shiv-orange text-white border-shiv-orange shadow-[0_10px_30px_rgba(255,94,0,0.25)]"
                  : "bg-white/5 text-white/60 border-white/10 hover:border-white/20 hover:text-white"
                }`}
            >
              {y}
            </button>
          ))}
          {years.length === 0 && (
            <div className="text-white/50 text-sm font-serif italic">{isLoading ? "Loading…" : "No events found."}</div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="text-white/60 font-serif italic">Loading events…</div>
          ) : eventsForYear.length === 0 ? (
            <div className="bg-white/5 border border-white/10 p-10 text-white/60 font-serif italic">
              No event entries for {resolvedYear}.
            </div>
          ) : (
            <div className="space-y-10">
              {eventsForYear.map((e, idx) => (
                <motion.article
                  key={e.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: Math.min(idx * 0.05, 0.2) }}
                  className="bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden"
                >
                  <div className="p-10 border-b border-white/5">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                      <div>
                        <span className="logo-marathi text-4xl text-white block mb-2">{e.titleMarathi}</span>
                        <h2 className="text-white text-2xl italic">{e.titleEnglish}</h2>
                        <p className="text-white/60 font-serif italic mt-4 leading-shiv max-w-3xl">{e.description}</p>
                      </div>
                      <div className="text-white/60 text-sm font-serif italic space-y-2">
                        <div className="flex items-center gap-3">
                          <Calendar size={16} className="text-shiv-orange" />
                          <span>{e.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin size={16} className="text-shiv-orange" />
                          <span>{e.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Masonry-ish grid */}
                  <div className="p-6 md:p-10 bg-black/10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {e.images.map((src, i) => (
                        <button
                          key={`${e.id}-${i}`}
                          onClick={() => setLightbox({ src, alt: `${e.titleEnglish} photo ${i + 1}` })}
                          className="group relative aspect-square overflow-hidden border border-white/10 bg-white/5 focus-visible:ring-2 focus-visible:ring-shiv-saffron focus-visible:outline-none"
                          aria-label={`View ${e.titleEnglish} photo ${i + 1}`}
                        >
                          <img src={src} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-shiv-dark/60 flex items-center justify-center">
                            <div className="w-12 h-12 bg-shiv-orange text-white flex items-center justify-center shadow-2xl">
                              <ZoomIn size={20} aria-hidden="true" />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-8 right-8 text-white/60 hover:text-shiv-orange transition-colors p-3 border border-white/10"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              <X size={26} />
            </button>
            <motion.img
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-h-[85vh] max-w-[95vw] object-contain border border-white/10"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;
