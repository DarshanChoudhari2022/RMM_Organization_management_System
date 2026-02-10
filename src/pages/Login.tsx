import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Lock, User, ArrowRight, ChevronLeft, Sparkles, Scroll, AlertCircle } from "lucide-react";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Specific Mandal Admin Credentials
        setTimeout(() => {
            if (username === "Admin" && password === "Bliss@108") {
                localStorage.setItem("isCommander", "true");
                setIsLoading(false);
                navigate("/dashboard");
            } else {
                setIsLoading(false);
                setError("Unauthorized access. Invalid Cipher or Identifier.");
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-[#FFF8DC] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
                <Scroll size={800} className="absolute -top-40 -left-60 -rotate-12" />
                <Shield size={600} className="absolute -bottom-40 -right-40 rotate-12" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full relative z-10"
            >
                <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-shiv-orange transition-colors mb-12 group">
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Return to Swarajya</span>
                </Link>

                <div className="bg-white border border-gray-100 shadow-2xl p-10 md:p-14 relative overflow-hidden">
                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-shiv-orange/10 flex items-center justify-center -rotate-45 translate-x-12 -translate-y-12">
                        <Sparkles className="text-shiv-orange rotate-45" size={20} />
                    </div>

                    <div className="text-center mb-12">
                        <span className="logo-marathi text-4xl mb-2 block">शिवगर्जना Portal</span>
                        <h1 className="text-2xl mb-4 font-serif italic text-gray-400 border-b border-gray-50 pb-6">Restricted Archives Access</h1>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">Authorized Commanders Only</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-8">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
                            >
                                <AlertCircle size={14} /> {error}
                            </motion.div>
                        )}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block">Commander Identifier</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-shiv-orange transition-colors" size={18} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter Identifier"
                                    className="w-full bg-gray-50 border-transparent border-b-2 border-b-gray-100 py-4 pl-12 pr-4 focus:bg-white focus:border-b-shiv-orange transition-all outline-none font-serif"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 block">Security Cipher</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-shiv-orange transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-gray-50 border-transparent border-b-2 border-b-gray-100 py-4 pl-12 pr-4 focus:bg-white focus:border-b-shiv-orange transition-all outline-none font-serif"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-shiv !py-5 flex items-center justify-center gap-4 group"
                        >
                            {isLoading ? "Authenticating..." : "Establish Secure Link"}
                            {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-gray-50 text-center">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-loose">
                            By accessing this portal, you agree to uphold the <br /><strong>Code of Swarajya</strong> and protect the archives.
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-gray-400 text-xs font-serif italic">Lost your cipher? Contact the Council scribe.</p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
