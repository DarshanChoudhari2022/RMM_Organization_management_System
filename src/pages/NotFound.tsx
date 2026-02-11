import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="text-8xl font-display font-black text-primary/20 mb-4">404</div>
        <h1 className="text-2xl font-display font-black text-foreground mb-3">Page Not Found</h1>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
          Return to explore the history of Chhatrapati Shivaji Maharaj.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="btn-primary"
          >
            <Home size={16} />
            Back to Home
          </Link>
          <Link
            to="/history"
            className="btn-outline"
          >
            <ArrowLeft size={16} />
            Explore History
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
