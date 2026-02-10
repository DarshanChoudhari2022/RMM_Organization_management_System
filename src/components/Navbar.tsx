import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, History, Image as ImageIcon, Shield, Users, Crown, Mountain } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location.pathname === "/";

  const navLinks = [
    { name: "The Legend", path: "/history", icon: History },
    { name: "Forts", path: "/forts", icon: Mountain },
    { name: "Archives", path: "/gallery", icon: ImageIcon },
    { name: "Celebrations", path: "/events", icon: Shield },
    { name: "Committee", path: "/committee", icon: Users },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled
        ? "bg-[#1a0505]/95 backdrop-blur-xl border-b border-white/5 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
        : isHome ? "bg-transparent py-8" : "bg-[#1a0505] py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo - Heritage Style */}
        <Link to="/" className="flex flex-col group leading-none">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-shiv-orange/30 flex items-center justify-center bg-shiv-orange/5 group-hover:bg-shiv-orange/20 transition-all">
              <Crown size={20} className="text-shiv-orange" />
            </div>
            <div>
              <span className="logo-marathi font-devanagari text-shiv-orange text-3xl font-black transition-all group-hover:tracking-wider">
                शिवगर्जना
              </span>
              <span className="text-[8px] font-black uppercase tracking-[0.5em] mt-1 text-white/40 block">
                PUNE HEADQUARTERS
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all relative group py-2 ${location.pathname === link.path ? "text-shiv-orange" : "text-white/60 hover:text-white"
                }`}
            >
              {link.name}
              <motion.span
                layoutId="nav-underline"
                className={`absolute -bottom-1 left-0 h-[1.5px] bg-shiv-orange shadow-[0_0_10px_rgba(255,94,0,0.8)] ${location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </Link>
          ))}
          <Link to="/login">
            <button className="px-10 py-3.5 bg-shiv-orange text-white font-black uppercase tracking-widest text-[10px] shadow-[0_5px_15px_rgba(255,94,0,0.3)] hover:scale-105 active:scale-95 transition-all">
              Establish Link
            </button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-3 bg-white/5 border border-white/5 text-white hover:border-shiv-orange transition-all"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 bg-[#1a0505] z-[60] p-12 flex flex-col items-center justify-center text-center space-y-12"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-10 right-10 text-white border border-white/10 p-4 hover:border-shiv-orange transition-all"
            >
              <X size={32} />
            </button>

            <div className="flex flex-col items-center gap-4">
              <Crown size={40} className="text-shiv-orange mb-4" />
              <span className="logo-marathi text-6xl">शिवगर्जना</span>
              <span className="text-[10px] font-black uppercase tracking-[0.8em] text-white/30">Mandal Pune</span>
            </div>

            <nav className="flex flex-col gap-8 w-full max-w-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-2xl font-black uppercase tracking-[0.2em] py-4 border-b border-white/5 transition-all ${location.pathname === link.path ? "text-shiv-orange" : "text-white/40 hover:text-white"
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-12">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <button className="btn-shiv w-full !py-6 !text-lg">Access Portal</button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
