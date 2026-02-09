import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Upload, CheckCircle, Clock, XCircle } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getBudget, getExpenses, getMonthlyBudget } from "@/lib/api";
import type { BudgetItem, Expense } from "@/types";

const statusIcon: Record<string, React.ReactNode> = {
  approved: <CheckCircle size={14} className="text-green-400" />,
  pending: <Clock size={14} className="text-yellow-400" />,
  rejected: <XCircle size={14} className="text-red-400" />,
};

const Dashboard = () => {
  const [budget, setBudget] = useState<BudgetItem[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState<{ month: string; budget: number; actual: number }[]>([]);

  useEffect(() => {
    getBudget().then(setBudget);
    getExpenses().then(setExpenses);
    getMonthlyBudget().then(setMonthlyBudget);
  }, []);

  const totalAllocated = budget.reduce((s, b) => s + b.allocated, 0);
  const totalSpent = budget.reduce((s, b) => s + b.spent, 0);

  return (
    <div className="bg-background min-h-screen pt-20">
      <section className="section-padding pb-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-devanagari text-4xl text-gradient-gold mb-3">डॅशबोर्ड</h1>
          <p className="font-serif text-xl text-secondary">Admin Dashboard</p>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-24 pb-20">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "एकूण बजेट / Total Budget", value: `₹${(totalAllocated / 1000).toFixed(0)}K`, icon: DollarSign },
              { label: "खर्च / Spent", value: `₹${(totalSpent / 1000).toFixed(0)}K`, icon: TrendingUp },
              { label: "शिल्लक / Remaining", value: `₹${((totalAllocated - totalSpent) / 1000).toFixed(0)}K`, icon: DollarSign },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-6 glow-gold"
              >
                <div className="flex items-center gap-3 mb-2">
                  <stat.icon size={20} className="text-secondary" />
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-3xl font-bold text-gradient-saffron">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass rounded-xl p-6">
              <h3 className="font-devanagari text-lg text-secondary mb-4">खर्च विभागवार / Expenses by Category</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={budget}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 16%)" />
                  <XAxis dataKey="category" tick={{ fill: "hsl(240 5% 55%)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "hsl(240 5% 55%)", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: "hsl(240 10% 7%)", border: "1px solid hsl(240 10% 16%)", borderRadius: 8 }}
                    labelStyle={{ color: "hsl(0 0% 95%)" }}
                  />
                  <Bar dataKey="allocated" fill="hsl(43 76% 53%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="spent" fill="hsl(30 100% 50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass rounded-xl p-6">
              <h3 className="font-devanagari text-lg text-secondary mb-4">मासिक बजेट / Monthly Budget</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyBudget}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 10% 16%)" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(240 5% 55%)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "hsl(240 5% 55%)", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: "hsl(240 10% 7%)", border: "1px solid hsl(240 10% 16%)", borderRadius: 8 }}
                    labelStyle={{ color: "hsl(0 0% 95%)" }}
                  />
                  <Line type="monotone" dataKey="budget" stroke="hsl(43 76% 53%)" strokeWidth={2} dot={{ fill: "hsl(43 76% 53%)" }} />
                  <Line type="monotone" dataKey="actual" stroke="hsl(30 100% 50%)" strokeWidth={2} dot={{ fill: "hsl(30 100% 50%)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expenses Table */}
          <div className="glass rounded-xl overflow-hidden">
            <div className="p-6 border-b border-border/30">
              <h3 className="font-devanagari text-lg text-secondary">खर्च यादी / Expense List</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left p-4 text-xs uppercase tracking-wider text-secondary">Description</th>
                    <th className="text-left p-4 text-xs uppercase tracking-wider text-secondary">Amount</th>
                    <th className="text-left p-4 text-xs uppercase tracking-wider text-secondary">Date</th>
                    <th className="text-left p-4 text-xs uppercase tracking-wider text-secondary">Category</th>
                    <th className="text-left p-4 text-xs uppercase tracking-wider text-secondary">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                      <td className="p-4 text-sm text-foreground">{expense.description}</td>
                      <td className="p-4 text-sm text-primary font-semibold">₹{expense.amount.toLocaleString()}</td>
                      <td className="p-4 text-sm text-muted-foreground">{expense.date}</td>
                      <td className="p-4 text-sm text-muted-foreground">{expense.category}</td>
                      <td className="p-4 text-sm">
                        <span className="flex items-center gap-1.5">
                          {statusIcon[expense.status]}
                          <span className="capitalize text-muted-foreground">{expense.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Upload Area */}
          <div className="glass rounded-xl p-12 border-2 border-dashed border-border/40 text-center">
            <Upload size={40} className="text-muted-foreground mx-auto mb-4" />
            <p className="font-devanagari text-lg text-secondary mb-1">फाइल्स अपलोड करा</p>
            <p className="text-sm text-muted-foreground">Drag & drop files here or click to upload</p>
            <p className="text-xs text-muted-foreground mt-2">(UI placeholder — no actual upload)</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
