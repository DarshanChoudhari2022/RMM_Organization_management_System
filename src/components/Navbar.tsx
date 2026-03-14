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
    { name: "About", path: "/history" },
    { name: "Gallery", path: "/gallery" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white p-2 rounded z-50">Skip to content</a>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 h-[70px] flex items-center ${scrolled
          ? "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
          : "bg-white/80 backdrop-blur-md border-b border-gray-100"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between w-full">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-4 group">
            <div className="relative">
              <img
                src="/images/logo.png"
                alt="RMM Logo"
                className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl tracking-tight leading-none text-[#2C3E50] uppercase">
                RAHUL MITRA MANDAL
              </span>
              <span className="text-[10px] font-sans font-bold text-[#1D4ED8] uppercase tracking-[0.25em]">
                Dapodi, Pune
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-5 py-2 text-[13px] font-display font-bold uppercase tracking-[0.1em] transition-all duration-300 rounded-sm ${isActive(link.path)
                  ? "text-[#1D4ED8]"
                  : "text-[#2C3E50] hover:text-[#1D4ED8]"
                  }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#1D4ED8]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            <div className={`w-[1px] h-6 mx-4 bg-gray-200`}></div>

            <Link
              to="/login"
              className="px-6 py-2 border border-[#1D4ED8] text-[#1D4ED8] text-[12px] font-display font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-sm hover:bg-[#1D4ED8] hover:text-white"
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
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden absolute top-[70px] left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-[#1D4ED8]/10 shadow-2xl z-[90] overflow-hidden"
            >
              <div className="flex flex-col p-8 gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`py-5 px-6 text-[15px] font-display font-black tracking-widest uppercase transition-all rounded-lg ${isActive(link.path)
                      ? "text-[#1D4ED8] bg-[#1D4ED8]/5 pl-8"
                      : "text-[#2C3E50]/70 hover:text-[#1D4ED8] hover:pl-8 hover:bg-gray-50"
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="h-[1px] bg-gray-100 my-4 mx-6"></div>

                <Link
                  to="/login"
                  className="mx-6 py-5 rounded-xl bg-[#1D4ED8] text-white text-center font-display font-black uppercase tracking-widest shadow-lg shadow-[#1D4ED8]/20 active:scale-95 transition-all"
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
