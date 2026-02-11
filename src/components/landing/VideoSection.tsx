import { motion } from "framer-motion";
import { Play, Star } from "lucide-react";

const VideoSection = () => {
    return (
        <section className="py-24 bg-[#0a0a0f] relative overflow-hidden text-white">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#D95D1E]/10 rounded-full blur-[120px]" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6"
                    >
                        <Star size={14} className="text-[#E67E22] fill-[#E67E22]" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Cinematic Experience</span>
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-display font-black mb-6">Experience the Legend</h2>
                    <p className="text-white/60 max-w-2xl mx-auto leading-relaxed">
                        Witness the epic journey of Swarajya through our curated video archive, featuring cultural celebrations and historical narrations.
                    </p>
                </div>

                {/* Video Embed Placeholder / Iframe */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative aspect-video max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(230,126,34,0.15)] group"
                >
                    {/* Cover Overlay before play */}
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all duration-500 pointer-events-none">
                        <div className="w-20 h-20 bg-[#E67E22] rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-500">
                            <Play fill="white" size={32} className="text-white ml-1" />
                        </div>
                    </div>

                    {/* YouTube Embed (Cinematic Trailer/Documentary) */}
                    <iframe
                        className="w-full h-full relative z-10"
                        src="https://www.youtube.com/embed/S2Hn8OQ-YtY?autoplay=0&mute=1&loop=1&playlist=S2Hn8OQ-YtY"
                        title="Chhatrapati Shivaji Maharaj Documentary"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>

                    {/* Cinematic Boarder Effects */}
                    <div className="absolute inset-x-0 top-0 h-4 md:h-8 bg-gradient-to-b from-black/80 to-transparent z-30" />
                    <div className="absolute inset-x-0 bottom-0 h-4 md:h-8 bg-gradient-to-t from-black/80 to-transparent z-30" />
                </motion.div>

                <div className="mt-12 flex justify-center">
                    <a
                        href="https://www.youtube.com/@shivgarjanaprathisthan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-3 border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                    >
                        Visit Our Official Channel
                    </a>
                </div>
            </div>
        </section>
    );
};

export default VideoSection;
