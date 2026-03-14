import { motion } from "framer-motion";
import { ChevronDown, ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden pt-24 pb-12" id="main-content">
            {/* Elegant Background Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-[20%] -right-[10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[0%] -left-[10%] w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[100px]" />
            </div>

            <div className="container px-6 md:px-12 relative z-10 grid xl:grid-cols-2 gap-16 items-center">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-left"
                >
                    {/* Est Badge */}
                    <div className="inline-flex items-center gap-3 mb-8 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm">
                        <span className="text-primary font-sans font-black text-xs uppercase tracking-[0.25em]">
                            Dapodi, Pune
                        </span>
                    </div>

                    {/* Main Heading - Playfair Display (Serif) */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black text-foreground leading-[1.1] mb-6 drop-shadow-sm">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#E5C158] to-primary">
                            Rahul Mitra
                        </span> <br />
                        <span className="font-italic tracking-tight">Mandal</span>
                    </h1>

                    <p className="text-foreground/80 text-lg md:text-xl font-sans font-light leading-relaxed mb-10 max-w-xl">
                        Celebrating the eternal legacy of <strong className="text-primary font-bold">Dr. Babasaheb Ambedkar</strong>. 
                        We are dedicated to preserving his majestic vision of equality, education, and social justice for countless future generations.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/history"
                            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-sans font-black uppercase tracking-widest text-sm rounded-xl transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1"
                        >
                            Read History <ArrowRight size={18} />
                        </Link>
                        <a
                            href="#about"
                            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border-2 border-foreground/20 text-foreground font-sans font-black uppercase tracking-widest text-sm rounded-xl transition-all hover:bg-foreground/5 hover:border-primary/50"
                        >
                            Our Mission <BookOpen size={18} className="text-primary" />
                        </a>
                    </div>
                </motion.div>

                {/* Right Image (Logo or Statue) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    className="relative flex justify-center xl:justify-end"
                >
                    <div className="relative w-[320px] h-[320px] sm:w-[450px] sm:h-[450px] lg:w-[500px] lg:h-[500px] rounded-full border border-primary/20 p-8 flex items-center justify-center bg-card/60 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden group">
                        {/* Spinning decorative rings */}
                        <div className="absolute inset-0 border-[2px] border-dashed border-primary/30 rounded-full animate-spin-slow pointer-events-none" style={{ animationDuration: '40s' }} />
                        <div className="absolute inset-4 border border-primary/10 rounded-full pointer-events-none" />
                        
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <img
                            src="/images/logo.png"
                            alt="Rahul Mitra Mandal Logo"
                            className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(212,175,55,0.15)] relative z-10 scale-95 group-hover:scale-100 transition-transform duration-700"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
            >
                <span className="text-[9px] font-sans font-black uppercase tracking-[0.3em] text-foreground/40">Discover</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-primary/50 to-transparent animate-pulse" />
            </motion.div>
        </section>
    );
};

export default Hero;
