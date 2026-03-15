import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Camera, Calendar, X, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import Footer from "@/components/landing/Footer";

interface GalleryItem {
  id: number;
  year: number;
  title: string;
  description: string;
  image: string;
}

// Placeholder gallery — the user will upload their own images via the admin dashboard
// For now, using representative images
const galleryData: GalleryItem[] = [
  {
    id: 1,
    year: 2024,
    title: "Ambedkar Jayanti Celebration 2024",
    description: "Grand procession through Dapodi Gavthan with traditional decorations and musical performances.",
    image: "https://images.unsplash.com/photo-1604604296972-1e5a17e3aeae?q=80&w=1000"
  },
  {
    id: 2,
    year: 2024,
    title: "Cultural Program 2024",
    description: "Youth cultural program showcasing Maratha heritage and historical dramas.",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000"
  },
  {
    id: 3,
    year: 2023,
    title: "Ambedkar Jayanti Miravnuk 2023",
    description: "Massive Ambedkar Jayanti procession with decorated floats and community participation.",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000"
  },
  {
    id: 4,
    year: 2023,
    title: "Community Gathering 2023",
    description: "Annual meeting of Rahul Mitra Mandal members at Dapodi Gavthan.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000"
  },
  {
    id: 5,
    year: 2022,
    title: "Decoration & Stage Setup 2022",
    description: "Elaborate stage setup with Babasaheb Ambedkar theme and traditional artwork.",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000"
  },
  {
    id: 6,
    year: 2022,
    title: "Youth Rally 2022",
    description: "Youth wing rally promoting awareness about Maratha history and culture.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000"
  },
  {
    id: 7,
    year: 2021,
    title: "Ambedkar Jayanti 2021",
    description: "Intimate celebration during challenging times, keeping the spirit of Swarajya alive.",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000"
  },
  {
    id: 8,
    year: 2020,
    title: "Virtual Celebration 2020",
    description: "Community celebration adapting to new formats while maintaining traditions.",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1000"
  },
];

const Gallery = () => {
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const years = [...new Set(galleryData.map((g) => g.year))].sort((a, b) => b - a);

  const filtered = selectedYear === "all"
    ? galleryData
    : galleryData.filter((g) => g.year === selectedYear);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () => {
    if (lightboxIndex !== null) setLightboxIndex((lightboxIndex + 1) % filtered.length);
  };
  const prevImage = () => {
    if (lightboxIndex !== null) setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden bg-muted">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[200px]" />
        </div>

        <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-4 block">
              Our Memories · Since 1972
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-secondary tracking-tight mb-6">
              Photo <span className="text-primary italic">Gallery</span>
            </h1>
            <p className="text-foreground/70 text-base md:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
              Relive the moments from our Ambedkar Jayanti Celebrations, cultural programs, and community
              events at Rahul Mitra Mandal, Dapodi Gavthan.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Year Filters */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 mb-10 mt-10">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedYear("all")}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${selectedYear === "all"
              ? "bg-primary text-white border-primary"
              : "bg-white text-foreground hover:bg-muted border-foreground/10"
              }`}
          >
            All Years
          </button>
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${selectedYear === year
                ? "bg-primary text-white border-primary"
                : "bg-white text-foreground hover:bg-muted border-foreground/10"
                }`}
            >
              {year}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section ref={ref} className="max-w-6xl mx-auto px-6 md:px-12 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="group cursor-pointer"
              onClick={() => openLightbox(i)}
            >
              <div className="clean-card group p-0 relative overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera size={24} className="text-white drop-shadow-lg" />
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={12} className="text-primary/70" />
                    <span className="text-primary font-bold text-[10px] uppercase tracking-wider">{item.year}</span>
                  </div>
                  <h3 className="text-foreground font-bold text-sm mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <ImageIcon size={40} className="text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-sm">No photos for this year yet.</p>
          </div>
        )}

        {/* Upload CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white/[0.03] border border-dashed border-white/10 rounded-2xl p-8 max-w-lg mx-auto">
            <Camera size={28} className="text-shiv-saffron/30 mx-auto mb-4" />
            <h3 className="text-white/60 font-bold text-sm mb-2">Want to Add Photos?</h3>
            <p className="text-white/30 text-xs leading-relaxed">
              Mandal admins can upload new photos through the Admin Dashboard.
              Contact the Mandal President for access.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all z-10"
              onClick={closeLightbox}
            >
              <X size={20} />
            </button>

            {/* Navigation */}
            <button
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all z-10"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all z-10"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              <ChevronRight size={20} />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-4xl max-h-[80vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filtered[lightboxIndex].image}
                alt={filtered[lightboxIndex].title}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />
              <div className="mt-4 text-center">
                <h3 className="text-white font-bold text-lg">{filtered[lightboxIndex].title}</h3>
                <p className="text-white/40 text-sm mt-1">{filtered[lightboxIndex].description}</p>
                <p className="text-shiv-saffron/40 text-xs mt-2">{filtered[lightboxIndex].year}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Gallery;
