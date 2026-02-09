import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, X } from "lucide-react";
import { getEvents } from "@/lib/api";
import type { EventEntry } from "@/types";

const years = Array.from({ length: 12 }, (_, i) => 2014 + i);

const Events = () => {
  const [events, setEvents] = useState<EventEntry[]>([]);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    getEvents().then(setEvents);
  }, []);

  const filteredEvents = events.filter((e) => e.year === selectedYear);

  return (
    <div className="bg-background min-h-screen pt-20">
      {/* Header */}
      <section className="section-padding pb-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-devanagari text-4xl md:text-5xl text-gradient-gold mb-3">कार्यक्रम</h1>
          <p className="font-serif text-xl text-secondary">Events (2014–2025)</p>
        </div>
      </section>

      {/* Year Selector */}
      <section className="px-6 mb-12 overflow-x-auto">
        <div className="flex gap-2 justify-center min-w-max mx-auto">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedYear === year
                  ? "bg-primary text-primary-foreground glow-saffron"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </section>

      {/* Events Grid */}
      <section className="px-6 md:px-12 lg:px-24 pb-20">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedYear}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
            >
              {filteredEvents.length === 0 && (
                <div className="col-span-full text-center py-20">
                  <p className="text-muted-foreground text-lg">
                    या वर्षीचे कार्यक्रम उपलब्ध नाहीत / No events for this year
                  </p>
                </div>
              )}
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="break-inside-avoid glass rounded-xl overflow-hidden hover:glow-saffron transition-shadow duration-300"
                >
                  {/* Image grid */}
                  <div className="grid grid-cols-2 gap-1">
                    {event.images.map((img, j) => (
                      <div
                        key={j}
                        onClick={() => setLightboxImage(img)}
                        className={`cursor-pointer bg-gradient-to-br from-primary/15 to-secondary/15 hover:from-primary/25 hover:to-secondary/25 transition-colors ${
                          event.images.length === 1 ? "col-span-2 h-48" : "h-32"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="p-5">
                    <h3 className="font-devanagari text-lg text-secondary mb-1">{event.titleMarathi}</h3>
                    <p className="text-sm text-foreground/80 mb-2">{event.titleEnglish}</p>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar size={12} />{event.date}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} />{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl flex items-center justify-center p-8"
            onClick={() => setLightboxImage(null)}
          >
            <button className="absolute top-6 right-6 text-foreground/60 hover:text-foreground">
              <X size={28} />
            </button>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="w-full max-w-3xl h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center"
            >
              <p className="text-muted-foreground">Image Placeholder</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;
