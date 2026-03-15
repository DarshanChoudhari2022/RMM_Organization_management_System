import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Lock, Mail, ArrowRight, ChevronLeft, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setMessage("");

        // Support simple usernames by appending a hidden domain
        const finalEmail = email.includes('@') ? email : `${email.trim().toLowerCase()}@rmm.auth`;

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: finalEmail,
                password,
            });
            if (error) throw error;
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message || "Authentication failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/royal.png')]" />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full relative z-10"
            >
                <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group font-display font-bold uppercase tracking-widest text-xs">
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="clean-card p-10 md:p-12 relative overflow-hidden">
                    {/* Orange Border Accent */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0" />

                    <div className="text-center mb-10 relative z-10 w-full flex flex-col items-center">
                        <div className="w-16 h-16 bg-primary/10 text-primary rounded-sm mx-auto mb-6 flex items-center justify-center shadow-lg transform rotate-45 border border-primary/20">
                            <Shield className="transform -rotate-45" size={28} />
                        </div>
                        <h1 className="text-3xl font-display font-black text-foreground mb-2 uppercase tracking-wide">
                            Admin Portal
                        </h1>
                        <p className="font-marathi text-secondary font-bold text-lg mb-1">राहुल मित्र मंडळ</p>
                        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em]">Authorized Access Only</p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-6 relative z-10">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-3 bg-red-900/40 border border-red-500/30 rounded text-red-200 text-xs font-bold flex items-center gap-3"
                            >
                                <AlertCircle size={16} /> {error}
                            </motion.div>
                        )}
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-3 bg-green-900/40 border border-green-500/30 rounded text-green-200 text-xs font-bold flex items-center gap-3"
                            >
                                <Shield size={16} /> {message}
                            </motion.div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">Username or Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your username or email"
                                    className="input-clean pl-12"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="input-clean pl-12"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full py-4 text-xs"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Access Dashboard
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
            
            <div className="absolute bottom-6 left-0 right-0 text-center z-10 w-full">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 w-full inline-block text-center">
                    Powered by PR Digital Services
                </p>
            </div>
        </div>
    );
};

export default Login;
