import { motion } from "framer-motion";
import { ChevronDown, ArrowRight, Shield } from "lucide-react";
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
                        We are dedicated to preserving his vision of equality, education, and social justice for future generations.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-4 w-full md:w-auto">
                        <Link
                            to="/history"
                            className="btn-primary"
                        >
                            Read History <ArrowRight size={18} />
                        </Link>
                    </div>
                </motion.div>

                {/* Right Image (Logo or Statue) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative flex justify-center lg:justify-end"
                >
                    <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full border-[1px] border-primary/10 p-8 flex items-center justify-center bg-white shadow-2xl shadow-primary/5">
                        {/* Spinning decorative ring */}
                        <div className="absolute inset-0 border border-dashed border-primary/40 rounded-full animate-spin-slow pointer-events-none" style={{ animationDuration: '60s' }} />

                        <img
                            src="/images/logo.png"
                            alt="Rahul Mitra Mandal Logo"
                            className="w-full h-full object-contain drop-shadow-xl"
                        />
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#0F172A]/40">Scroll</span>
                <ChevronDown className="text-[#1D4ED8] animate-bounce" size={20} />
            </motion.div>
        </section>
    );
};

export default Hero;
