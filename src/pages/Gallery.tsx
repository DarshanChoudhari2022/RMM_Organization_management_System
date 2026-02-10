import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Hash, X, ZoomIn } from "lucide-react";

import type { GalleryAlbum, GalleryImage } from "@/types";
import { getGallery } from "@/lib/api";

const Gallery = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: getGallery,
  });

  const albums = data ?? [];
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(albums[0]?.id ?? null);

  const activeAlbum = useMemo(() => {
    return albums.find((a) => a.id === activeAlbumId) ?? albums[0] ?? null;
  }, [albums, activeAlbumId]);

  const flatCount = useMemo(() => albums.reduce((sum, a) => sum + a.images.length, 0), [albums]);
  const [lightbox, setLightbox] = useState<{ image: GalleryImage; album: GalleryAlbum } | null>(null);

  return (
    <div className="bg-shiv-dark min-h-screen pt-24">
      {/* Hero */}
      <section className="px-6 pb-12 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-3 px-5 py-2 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm">
            <Film className="text-shiv-orange" size={16} />
            <span className="text-[10px] text-white font-black uppercase tracking-[0.5em]">Media Gallery</span>
          </div>
          <h1 className="text-white mt-8 mb-4">
            Mandal <span className="italic text-shiv-orange">Records</span>
          </h1>
          <p className="text-white/60 font-serif italic text-lg max-w-3xl leading-shiv">
            Album-based archives with lightbox viewing. (Mock data today; designed for future bulk upload + Drive sync.)
          </p>
        </div>
      </section>

      {/* Album selector */}
      <section className="sticky top-16 z-30 border-y border-white/5 bg-shiv-dark/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {albums.map((a) => (
              <button
                key={a.id}
                onClick={() => setActiveAlbumId(a.id)}
                className={`px-6 py-3 text-[10px] font-black uppercase tracking-[0.3em] border transition-all whitespace-nowrap ${
                  (activeAlbum?.id ?? null) === a.id
                    ? "bg-shiv-orange text-white border-shiv-orange shadow-[0_10px_30px_rgba(255,94,0,0.25)]"
                    : "bg-white/5 text-white/60 border-white/10 hover:border-white/20 hover:text-white"
                }`}
              >
                {a.name}
              </button>
            ))}
            {albums.length === 0 && (
              <div className="text-white/50 text-sm font-serif italic">{isLoading ? "Loading…" : "No albums found."}</div>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/30">
            <Hash size={12} className="text-shiv-orange" /> {flatCount} Assets
          </div>
        </div>
      </section>

      {/* Album grid */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          {!activeAlbum ? (
            <div className="bg-white/5 border border-white/10 p-10 text-white/60 font-serif italic">No album selected.</div>
          ) : (
            <div className="space-y-10">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <span className="logo-marathi text-4xl text-white block">{activeAlbum.nameMarathi}</span>
                  <div className="text-white/50 text-sm font-serif italic mt-2">{activeAlbum.name}</div>
                </div>
                <div className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                  Category: <span className="text-shiv-orange">{activeAlbum.category}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <AnimatePresence mode="popLayout">
                  {activeAlbum.images.map((img, i) => (
                    <motion.button
                      layout
                      key={img.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.35, delay: Math.min(i * 0.02, 0.2) }}
                      className="group relative aspect-square overflow-hidden border border-white/10 bg-white/5"
                      onClick={() => setLightbox({ image: img, album: activeAlbum })}
                      aria-label="Open image"
                    >
                      <img src={img.src} alt={img.alt} className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 flex items-center justify-center">
                        <div className="w-12 h-12 bg-shiv-orange text-white flex items-center justify-center">
                          <ZoomIn size={20} />
                        </div>
                      </div>
                      {img.caption && (
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-left">
                          <div className="text-white/90 text-[10px] font-black uppercase tracking-widest line-clamp-1">{img.caption}</div>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
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
            <div className="max-w-6xl w-full grid lg:grid-cols-3 gap-10 items-center" onClick={(e) => e.stopPropagation()}>
              <div className="lg:col-span-2 border border-white/10 bg-black/30">
                <img src={lightbox.image.src} alt={lightbox.image.alt} className="w-full h-auto object-contain max-h-[80vh]" />
              </div>
              <div className="text-white space-y-6">
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
                  Album: <span className="text-shiv-orange">{lightbox.album.name}</span>
                </div>
                <div className="text-3xl logo-marathi">{lightbox.image.caption ?? "Gallery Asset"}</div>
                <div className="text-white/50 font-serif italic leading-shiv">{lightbox.image.alt}</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
