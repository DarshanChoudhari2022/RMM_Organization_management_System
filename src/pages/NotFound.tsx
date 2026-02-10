import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Flag, ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center max-w-2xl"
      >
        <div className="flex justify-center mb-8">
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              y: [0, -5, 5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-24 h-24 rounded-3xl bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/40"
          >
            <Flag size={48} />
          </motion.div>
        </div>

        <h1 className="font-devanagari text-8xl font-black text-secondary mb-4">४०४</h1>
        <h2 className="font-devanagari text-4xl font-bold text-secondary mb-6">क्षमा करा, हे पान सापडले नाही</h2>
        <p className="text-xl text-muted-foreground font-serif mb-12">
          The path you seek is currently unavailable in Swarajya. Let us return to the main fort.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-serif font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <Home size={20} /> Return to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-8 py-4 bg-muted text-secondary rounded-xl font-serif font-bold hover:bg-muted/80 transition-all"
          >
            <ArrowLeft size={20} /> Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
