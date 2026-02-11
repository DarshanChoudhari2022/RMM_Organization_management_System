import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "History", path: "/history" },
    { name: "Forts", path: "/forts" },
    { name: "Gallery", path: "/gallery" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white p-2 rounded z-50">Skip to content</a>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "bg-background/95 backdrop-blur-xl py-3 shadow-md border-b border-primary/10"
          : "bg-transparent py-6"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative">
              <svg width="48" height="48" viewBox="0 0 100 100" className="group-hover:scale-110 transition-transform duration-300">
                <circle cx="50" cy="50" r="48" fill="#E67E22" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="4 2" />
                <text x="50" y="65" textAnchor="middle" fill="white" fontSize="45" fontWeight="900" fontFamily="Playfair Display">श</text>
                <path d="M50 5 L55 15 L45 15 Z" fill="white" />
                <path d="M50 95 L55 85 L45 85 Z" fill="white" />
                <path d="M5 50 L15 55 L15 45 Z" fill="white" />
                <path d="M95 50 L85 55 L85 45 Z" fill="white" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className={`font-display font-black text-xl tracking-tight leading-none transition-colors ${scrolled ? "text-foreground" : "text-foreground"}`}>
                SHIVGARJANA
              </span>
              <span className={`text-[10px] font-sans font-bold uppercase tracking-[0.3em] transition-colors ${scrolled ? "text-primary" : "text-primary/80"}`}>
                Kedari Nagar
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-5 py-2 text-[11px] font-display font-bold uppercase tracking-[0.15em] transition-all duration-300 rounded-sm ${isActive(link.path)
                  ? "text-primary"
                  : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                  }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            <div className={`w-[1px] h-6 mx-4 ${scrolled ? "bg-foreground/20" : "bg-white/20"}`}></div>

            <Link
              to="/login"
              className={`px-6 py-2 border rounded-sm text-[10px] font-display font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-sm ${scrolled
                ? "border-primary text-primary hover:bg-primary hover:text-white"
                : "bg-primary text-white border-primary hover:bg-primary/90"
                }`}
            >
              Portal
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-background border-t border-primary/20 mt-3 overflow-hidden shadow-xl"
            >
              <div className="flex flex-col p-6 gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`py-4 px-4 text-sm font-display font-bold tracking-widest uppercase transition-all border-b border-foreground/5 last:border-0 ${isActive(link.path)
                      ? "text-primary bg-primary/5 pl-6"
                      : "text-foreground/70 hover:text-primary hover:pl-6"
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  to="/login"
                  className="mt-6 py-4 px-4 btn-primary w-full text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin Portal Login
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;
