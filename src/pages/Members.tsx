import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, UserPlus, Search, Filter,
    MoreVertical, Mail, Phone, MapPin,
    Shield, Star, CheckCircle2, XCircle,
    Download, ArrowUpRight, MessageSquare,
    Clock, Flag, Crown, Scroll
} from "lucide-react";

// Member roles based on requirements
const roles = [
    { id: "all", label: "All Commanders", labelMr: "सर्व सदस्य" },
    { id: "super_admin", label: "Pramukh", labelMr: "मुख्य प्रशासक" },
    { id: "committee", label: "Council", labelMr: "कार्यकारिणी" },
    { id: "member", label: "Member", labelMr: "सभासद" },
    { id: "volunteer", label: "Volunteer", labelMr: "स्वयंसेवक" },
];

const mockMembers = [
    {
        id: "M1",
        name: "राहुल सतीश कदम",
        nameMr: "राहुल सतीश कदम",
        role: "super_admin",
        phone: "+91 98765 43210",
        email: "rahul.k@RAHUL MITRA MANDAL.org",
        joined: "२०१४",
        varganiStatus: "paid",
        totalPaid: "₹५,०००",
        avatar: "RK"
    },
    {
        id: "M2",
        name: "विशाल दादा माने",
        nameMr: "विशाल दादा माने",
        role: "committee",
        phone: "+91 98765 43211",
        email: "vishal.m@RAHUL MITRA MANDAL.org",
        joined: "२०१६",
        varganiStatus: "partial",
        totalPaid: "₹२,५००",
        avatar: "VM"
    },
    {
        id: "M3",
        name: "अमित संजय भोसले",
        nameMr: "अमित संजय भोसले",
        role: "member",
        phone: "+91 98765 43212",
        email: "amit.b@gmail.com",
        joined: "२०२२",
        varganiStatus: "unpaid",
        totalPaid: "₹०",
        avatar: "AB"
    },
    {
        id: "M4",
        name: "साहिल सूर्यवंशी",
        nameMr: "साहिल सूर्यवंशी",
        role: "volunteer",
        phone: "+91 98765 43213",
        email: "sahil.s@gmail.com",
        joined: "२०२४",
        varganiStatus: "paid",
        totalPaid: "₹५,०००",
        avatar: "SS"
    }
];

const Members = () => {
    const [selectedRole, setSelectedRole] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredMembers = mockMembers.filter(member => {
        const matchesRole = selectedRole === "all" || member.role === selectedRole;
        const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.nameMr.includes(searchQuery);
        return matchesRole && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#2a0a0a] relative overflow-hidden">
            {/* 🚩 RAIGAD BACKDROP - MAJESTIC THEME */}
            <div className="fixed inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1624314138470-5a2f24623f10?q=80&w=2070&auto=format&fit=crop"
                    className="w-full h-full object-cover opacity-20 filter grayscale(50%)"
                    alt="Raigad Backdrop"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#2a0a0a] via-[#1a0505]/95 to-[#2a0a0a]" />
            </div>

            <div className="relative z-10 pt-32 pb-24 px-6 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Header Section */}
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 mb-16 border-b border-white/5 pb-12">
                        <div>
                            <div className="flex items-center gap-3 text-shiv-orange font-black tracking-widest text-[10px] uppercase mb-4">
                                <Crown size={14} /> Swarajya Council Registry
                            </div>
                            <h1 className="font-devanagari text-5xl md:text-6xl text-white mb-4">
                                सदस्य व्यवस्थापन <span className="text-shiv-orange italic font-serif text-3xl md:text-4xl block md:inline mt-2 md:mt-0 font-bold ml-0 md:ml-4 border-l-0 md:border-l border-white/10 pl-0 md:pl-6 leading-none">Council Management</span>
                            </h1>
                            <p className="text-white/50 font-serif italic text-lg leading-shiv max-w-2xl">
                                Managing the strength of the Rahul Mitra Mandal. Overseeing roles, mission contributions, and troop status.
                            </p>
                        </div>
                        <div className="flex gap-4 w-full md:w-auto">
                            <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 border border-white/10 bg-white/5 text-white/80 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm">
                                <Download size={16} /> Export Records
                            </button>
                            <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-4 bg-shiv-orange text-white rounded-sm text-[10px] font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(255,94,0,0.3)] hover:scale-105 active:scale-95 transition-all">
                                <UserPlus size={18} /> Enlist Member
                            </button>
                        </div>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                        {[
                            { label: "Total Strength", value: "54", icon: Users, trend: "Troops" },
                            { label: "Commanders", value: "8", icon: Shield, trend: "Pramukh" },
                            { label: "Mission Paid", value: "42", icon: CheckCircle2, trend: "Settled" },
                            { label: "Outstanding", value: "12", icon: Clock, trend: "Pending" },
                        ].map((stat, i) => (
                            <div key={i} className="bg-[#1a0505] p-10 border border-white/5 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <stat.icon size={80} />
                                </div>
                                <div className="relative z-10">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30 block mb-4">{stat.label}</span>
                                    <div className="text-4xl font-black text-white mb-2">{stat.value}</div>
                                    <div className="text-[10px] font-bold text-shiv-orange uppercase tracking-widest">{stat.trend}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Filtering Command Center */}
                    <div className="bg-[#1a0505] p-8 border border-white/5 shadow-2xl mb-12 backdrop-blur-md">
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="flex-1 relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-shiv-orange transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by name, phone or identifier..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-16 pr-6 py-4 bg-white/5 border border-white/5 focus:border-shiv-orange/50 transition-all outline-none text-white font-serif italic text-lg"
                                />
                            </div>
                            <div className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2">
                                {roles.map((role) => (
                                    <button
                                        key={role.id}
                                        onClick={() => setSelectedRole(role.id)}
                                        className={`px-8 py-3 rounded-sm text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${selectedRole === role.id
                                            ? "bg-shiv-orange border-shiv-orange text-white shadow-lg shadow-shiv-orange/20"
                                            : "bg-white/5 border-white/5 text-white/40 hover:text-white/70 hover:bg-white/10"
                                            }`}
                                    >
                                        <span className="font-devanagari text-xs mr-3">{role.labelMr}</span>
                                        <span className="opacity-50 font-serif italic">{role.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Registry Ledger (Table) */}
                    <div className="bg-[#1a0505] border border-white/5 shadow-2xl overflow-hidden mb-20 backdrop-blur-md">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/5">
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Mandal Member</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-center">Designation</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-center">Status</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-right">Contribution</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 text-right">Dispatch</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredMembers.map((member) => (
                                        <tr key={member.id} className="hover:bg-white/5 transition-all group">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-14 h-14 bg-white/5 border border-white/10 flex items-center justify-center font-black text-shiv-orange text-lg shadow-inner group-hover:border-shiv-orange transition-colors">
                                                        {member.avatar}
                                                    </div>
                                                    <div>
                                                        <p className="font-devanagari font-bold text-white text-xl mb-1 group-hover:text-shiv-orange transition-colors">{member.nameMr}</p>
                                                        <div className="flex items-center gap-4">
                                                            <span className="flex items-center gap-2 text-[10px] text-white/40 font-black uppercase tracking-widest">
                                                                <Phone size={12} className="text-shiv-orange/50" /> {member.phone}
                                                            </span>
                                                            <span className="w-1 h-1 bg-white/10 rounded-full" />
                                                            <span className="text-[10px] text-white/30 font-serif italic tracking-tighter">Established {member.joined}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-center text-center">
                                                <span className={`inline-block px-4 py-2 text-[8px] font-black uppercase tracking-[0.25em] border ${member.role === 'super_admin' ? 'border-[#800000] text-[#800000] bg-[#800000]/10 ring-1 ring-[#800000]/20' :
                                                        member.role === 'committee' ? 'border-shiv-orange text-shiv-orange bg-shiv-orange/10 ring-1 ring-shiv-orange/20' :
                                                            'border-white/20 text-white/40 bg-white/5'
                                                    }`}>
                                                    {roles.find(r => r.id === member.role)?.label}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center justify-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${member.varganiStatus === 'paid' ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]' :
                                                        member.varganiStatus === 'partial' ? 'bg-shiv-orange shadow-[0_0_15px_rgba(255,94,0,0.6)]' :
                                                            'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]'
                                                        }`} />
                                                    <span className="font-black text-[9px] uppercase tracking-widest text-white/60">
                                                        {member.varganiStatus}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="font-serif font-black text-2xl text-shiv-orange">
                                                    {member.totalPaid}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex justify-end gap-3">
                                                    <button className="p-3 bg-white/5 border border-white/5 hover:border-shiv-orange transition-all text-white/40 hover:text-shiv-orange">
                                                        <MessageSquare size={16} />
                                                    </button>
                                                    <button className="p-3 bg-white/5 border border-white/5 hover:border-shiv-orange transition-all text-white/40 hover:text-shiv-orange">
                                                        <ArrowUpRight size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Empty State */}
                    {filteredMembers.length === 0 && (
                        <div className="text-center py-24 bg-[#1a0505] border border-dashed border-white/10">
                            <Scroll size={60} className="text-white/10 mx-auto mb-6" />
                            <h3 className="font-devanagari text-3xl font-bold text-white mb-2">सदस्य सापडले नाहीत</h3>
                            <p className="text-white/40 font-serif italic underline decoration-shiv-orange/30 underline-offset-8">No commanders matching your search criteria in the registry.</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Members;
