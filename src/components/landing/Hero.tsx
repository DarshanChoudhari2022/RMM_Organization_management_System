import { motion } from "framer-motion";
import { ChevronDown, ArrowRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center bg-background overflow-hidden pt-20" id="main-content">
            {/* Background Texture (Optional, very subtle) */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/ag-square.png')]" />

            <div className="container px-6 md:px-12 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Content */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-left"
                >
                    {/* Est Badge */}
                    <div className="inline-flex items-center gap-3 mb-6 border-b border-primary/30 pb-2">
                        <span className="text-primary font-sans font-bold text-sm uppercase tracking-[0.2em]">
                            · Dapodi, Pune
                        </span>
                    </div>

                    {/* Main Heading - Playfair Display (Serif) */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight mb-4">
                        <span className="text-primary">Rahul Mitra</span> <br />
                        <span className="text-4xl md:text-5xl lg:text-6xl text-highlight font-italic">Mandal</span>
                    </h1>

                    <p className="text-foreground/80 text-lg md:text-xl font-sans font-light leading-relaxed mb-8 max-w-xl">
                        Celebrating the eternal legacy of <strong>Babasaheb Ambedkar</strong>.
                        We are dedicated to preserving his majestic vision of equality, education, and social justice for countless future generations.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            to="/history"
                            className="btn-primary"
                        >
                            Read History <ArrowRight size={18} />
                        </Link>
                        <a
                            href="#about"
                            className="btn-outline"
                        >
                            Our Mission <BookOpen size={18} className="text-primary" />
                        </a>
                    </div>
                </motion.div>

                {/* Right Image (Logo or Statue) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative flex justify-center lg:justify-end"
                >
                    <div className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] rounded-full flex items-center justify-center bg-white shadow-2xl shadow-primary/20 group mx-auto lg:mr-0 z-10">
                        {/* Spinning decorative rings outside */}
                        <div className="absolute -inset-4 md:-inset-6 border-2 border-dashed border-primary/30 rounded-full animate-spin-slow pointer-events-none" style={{ animationDuration: '40s' }} />
                        <div className="absolute -inset-8 md:-inset-12 border border-primary/10 rounded-full pointer-events-none" />
                        
                        <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20 pointer-events-none" />
                            <img
                                src="/images/logo.png"
                                alt="Rahul Mitra Mandal Logo"
                                className="w-[110%] h-[110%] max-w-[110%] object-cover scale-100 group-hover:scale-105 transition-transform duration-700 relative z-10"
                            />
                        </div>
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
