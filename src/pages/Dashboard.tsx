import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  ImageIcon,
  LayoutDashboard,
  LineChart,
  LogOut,
  Shield,
  Users,
  Wallet,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart as ReLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { getBudget, getExpenses, getMonthlyBudget, getTasks } from "@/lib/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "vargani" | "tasks" | "expenses" | "archives">("overview");

  useEffect(() => {
    const isAuth = localStorage.getItem("isCommander");
    if (!isAuth) navigate("/login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isCommander");
    navigate("/login");
  };

  const budgetQ = useQuery({ queryKey: ["budget"], queryFn: getBudget });
  const expensesQ = useQuery({ queryKey: ["expenses"], queryFn: getExpenses });
  const monthlyQ = useQuery({ queryKey: ["monthlyBudget"], queryFn: getMonthlyBudget });
  const tasksQ = useQuery({ queryKey: ["tasks"], queryFn: getTasks });

  const totals = useMemo(() => {
    const allocated = (budgetQ.data ?? []).reduce((s, b) => s + b.allocated, 0);
    const spent = (budgetQ.data ?? []).reduce((s, b) => s + b.spent, 0);
    const expenseTotal = (expensesQ.data ?? []).reduce((s, e) => s + e.amount, 0);
    const pendingTasks = (tasksQ.data ?? []).filter((t) => t.status === "pending").length;
    return { allocated, spent, expenseTotal, pendingTasks };
  }, [budgetQ.data, expensesQ.data, tasksQ.data]);

  return (
    <div className="min-h-screen bg-shiv-dark flex">
      {/* Sidebar */}
      <aside className="w-80 bg-black/40 text-white flex flex-col fixed inset-y-0 left-0 z-50 border-r border-white/5 backdrop-blur-xl">
        <div className="p-10 border-b border-white/5">
          <Link to="/" className="flex flex-col gap-3">
            <span className="logo-marathi text-shiv-orange text-4xl font-black">शिवगर्जना</span>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-shiv-orange animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/40">Admin Portal</span>
            </div>
          </Link>
        </div>

        <nav className="flex-grow p-8 space-y-3 mt-8">
          {[
            { id: "overview", label: "Dashboard", icon: LayoutDashboard },
            { id: "vargani", label: "Budget", icon: Wallet },
            { id: "tasks", label: "Approvals", icon: Shield },
            { id: "expenses", label: "Expenses", icon: CreditCard },
            { id: "archives", label: "Media", icon: ImageIcon },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-6 px-6 py-5 transition-all relative rounded-sm ${
                activeTab === item.id ? "bg-shiv-orange/10 text-shiv-orange" : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">{item.label}</span>
              {activeTab === item.id && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute left-0 w-1.5 h-6 bg-shiv-orange rounded-r-full shadow-[0_0_15px_rgba(255,94,0,0.5)]"
                />
              )}
            </button>
          ))}
        </nav>

        <div className="p-10">
          <button onClick={handleLogout} className="flex items-center gap-4 text-white/30 hover:text-red-300 transition-all w-full">
            <LogOut size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-grow ml-80 p-12 lg:p-16 max-w-[1600px] mx-auto w-full">
        <header className="flex items-end justify-between mb-12 border-b border-white/5 pb-10">
          <div>
            <div className="flex items-center gap-3 text-shiv-orange font-black tracking-widest text-[10px] uppercase mb-4">
              <LineChart size={14} /> Swarajya Operations
            </div>
            <h1 className="text-white text-5xl font-black">
              Commander <span className="text-shiv-orange italic">Admin</span>
            </h1>
            <p className="text-white/50 font-serif italic text-lg leading-shiv mt-3">
              UI-only dashboard powered by mock JSON via service functions.
            </p>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Allocated" value={`₹${totals.allocated.toLocaleString("en-IN")}`} icon={Wallet} trend="Total budget" />
                <StatCard label="Spent" value={`₹${totals.spent.toLocaleString("en-IN")}`} icon={CreditCard} trend="Budget used" />
                <StatCard label="Expenses" value={`₹${totals.expenseTotal.toLocaleString("en-IN")}`} icon={CreditCard} trend="Logged items" />
                <StatCard label="Pending Tasks" value={`${totals.pendingTasks}`} icon={Shield} trend="Awaiting response" />
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white/5 border border-white/10 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white text-lg font-black uppercase tracking-widest">Monthly Budget vs Actual</h2>
                  </div>
                  <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReLineChart data={monthlyQ.data ?? []}>
                        <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                        <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" />
                        <YAxis stroke="rgba(255,255,255,0.4)" />
                        <Tooltip contentStyle={{ background: "#120606", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
                        <Line type="monotone" dataKey="budget" stroke="#FF5E00" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="actual" stroke="#D4AF37" strokeWidth={2} dot={false} />
                      </ReLineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white text-lg font-black uppercase tracking-widest">Category Spend</h2>
                  </div>
                  <div className="h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={budgetQ.data ?? []}>
                        <CartesianGrid stroke="rgba(255,255,255,0.08)" />
                        <XAxis dataKey="category" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 10 }} interval={0} height={80} />
                        <YAxis stroke="rgba(255,255,255,0.4)" />
                        <Tooltip contentStyle={{ background: "#120606", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }} />
                        <Bar dataKey="allocated" fill="rgba(255,94,0,0.35)" />
                        <Bar dataKey="spent" fill="rgba(212,175,55,0.55)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "tasks" && (
            <motion.div key="tasks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="bg-white/5 border border-white/10 p-8">
                <h2 className="text-white text-lg font-black uppercase tracking-widest mb-6">Pending Approvals</h2>
                <div className="grid gap-4">
                  {(tasksQ.data ?? []).slice(0, 6).map((t) => (
                    <div key={t.id} className="p-6 border border-white/10 bg-black/20 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div>
                        <div className="text-white font-black">{t.titleEnglish}</div>
                        <div className="text-white/50 text-sm font-serif italic">{t.description}</div>
                      </div>
                      <div className="text-white/50 text-sm font-serif italic">
                        Assigned: <span className="text-white/70">{t.assignedTo}</span> • Due: <span className="text-white/70">{t.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "expenses" && (
            <motion.div key="expenses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
              <div className="bg-white/5 border border-white/10 p-8">
                <h2 className="text-white text-lg font-black uppercase tracking-widest mb-6">Expense Ledger</h2>
                <div className="grid gap-4">
                  {(expensesQ.data ?? []).map((e) => (
                    <div key={e.id} className="p-6 border border-white/10 bg-black/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="text-white font-black">{e.description}</div>
                        <div className="text-white/40 text-sm font-serif italic">
                          {e.date} • {e.category} • <span className="text-white/60">{e.status}</span>
                        </div>
                      </div>
                      <div className="text-shiv-orange font-black">₹{e.amount.toLocaleString("en-IN")}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "archives" && (
            <motion.div key="archives" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="bg-white/5 border border-white/10 p-10 text-white/60 font-serif italic">
                Google Drive sync + bulk upload is a backend feature (PRD FR-6.x). UI placeholder only for now.
              </div>
            </motion.div>
          )}

          {activeTab === "vargani" && (
            <motion.div key="vargani" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="bg-white/5 border border-white/10 p-10 text-white/60 font-serif italic">
                Vargani collection + receipts + reminders are backend features (PRD FR-3.x). This mock UI currently focuses on budgets/expenses.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, trend }: { label: string; value: string; icon: any; trend: string }) => (
  <div className="bg-white/5 border border-white/10 p-8 overflow-hidden relative group">
    <div className="relative z-10 flex justify-between items-start">
      <div>
        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-3">{label}</span>
        <div className="text-3xl font-black text-white mb-3">{value}</div>
        <div className="text-[10px] font-black text-shiv-orange uppercase tracking-widest">{trend}</div>
      </div>
      <div className="p-4 bg-white/5 text-white/70 group-hover:bg-shiv-orange group-hover:text-white transition-all duration-500">
        <Icon size={22} />
      </div>
    </div>
  </div>
);

export default Dashboard;
