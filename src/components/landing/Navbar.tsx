import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Crown } from "lucide-react";

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "The Legend", path: "/history" },
        { name: "Forts", path: "/forts" },
        { name: "Archives", path: "/gallery" },
        { name: "Celebrations", path: "/events" },
        { name: "Committee", path: "/members" },
        { name: "Login", path: "/login" },
    ];

    return (
        <nav
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
                ? "bg-background/95 backdrop-blur-md py-3 shadow-xl border-b border-primary/20"
                : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-sm rotate-45 group-hover:rotate-0 transition-transform duration-500 shadow-lg shadow-primary/20">
                        <Crown size={20} className="text-white -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-xl font-bold tracking-tighter transition-colors font-marathi leading-none ${isScrolled ? "text-foreground" : "text-foreground md:text-white"}`}>
                            शिवगर्जना
                        </span>
                        <span className="text-[10px] uppercase tracking-widest text-primary font-bold">
                            Kedari Nagar
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`text-xs uppercase tracking-widest font-bold transition-colors hover:text-primary ${isScrolled ? "text-foreground" : "text-foreground md:text-foreground"}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link
                        to="/events"
                        className="btn-primary !py-2 !px-6 !text-[10px]"
                    >
                        Join Utsav
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className={`md:hidden transition-colors ${isScrolled ? "text-foreground" : "text-foreground"}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-background border-b border-primary/20 p-6 flex flex-col gap-6 md:hidden animate-in fade-in slide-in-from-top-4 duration-300 shadow-xl">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="text-sm uppercase tracking-widest font-bold text-foreground hover:text-primary"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
