import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { getGallery } from "@/lib/api";
import type { GalleryAlbum, GalleryImage } from "@/types";

const Gallery = () => {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    getGallery().then((data) => {
      setAlbums(data);
      if (data.length > 0) setSelectedAlbum(data[0]);
    });
  }, []);

  const currentImages = selectedAlbum?.images || [];

  const navigate = (dir: number) => {
    if (lightboxIndex === null) return;
    const next = (lightboxIndex + dir + currentImages.length) % currentImages.length;
    setLightboxIndex(next);
  };

  return (
    <div className="bg-background min-h-screen pt-20">
      {/* Header */}
      <section className="section-padding pb-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="font-devanagari text-4xl md:text-5xl text-gradient-gold mb-3">गॅलरी</h1>
          <p className="font-serif text-xl text-secondary">Gallery</p>
        </div>
      </section>

      {/* Album Selector */}
      <section className="px-6 md:px-12 lg:px-24 mb-12">
        <div className="flex gap-4 justify-center flex-wrap">
          {albums.map((album) => (
            <button
              key={album.id}
              onClick={() => { setSelectedAlbum(album); setLightboxIndex(null); }}
              className={`glass rounded-xl p-4 w-40 text-center transition-all hover:scale-105 ${
                selectedAlbum?.id === album.id ? "ring-2 ring-primary glow-saffron" : ""
              }`}
            >
              <div className="w-full h-20 rounded-lg bg-gradient-to-br from-primary/15 to-secondary/15 mb-3" />
              <p className="font-devanagari text-sm text-secondary">{album.nameMarathi}</p>
              <p className="text-xs text-muted-foreground">{album.name}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="px-6 md:px-12 lg:px-24 pb-20">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {selectedAlbum && (
              <motion.div
                key={selectedAlbum.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {currentImages.map((img, i) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setLightboxIndex(i)}
                    className="group cursor-pointer rounded-xl overflow-hidden glass hover:glow-gold transition-all duration-300"
                  >
                    <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-colors flex items-center justify-center">
                      <span className="text-muted-foreground text-xs">{img.alt}</span>
                    </div>
                    {img.caption && (
                      <p className="p-3 text-xs text-muted-foreground font-devanagari">{img.caption}</p>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center"
          >
            <button className="absolute top-6 right-6 text-foreground/60 hover:text-foreground z-10" onClick={() => setLightboxIndex(null)}>
              <X size={28} />
            </button>
            <button className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground" onClick={() => navigate(-1)}>
              <ChevronLeft size={36} />
            </button>
            <button className="absolute right-6 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground" onClick={() => navigate(1)}>
              <ChevronRight size={36} />
            </button>
            <motion.div
              key={lightboxIndex}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-4xl aspect-video bg-gradient-to-br from-primary/15 to-secondary/15 rounded-xl flex flex-col items-center justify-center mx-8"
            >
              <p className="text-foreground/60">{currentImages[lightboxIndex]?.alt}</p>
              {currentImages[lightboxIndex]?.caption && (
                <p className="font-devanagari text-secondary mt-2">{currentImages[lightboxIndex].caption}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
