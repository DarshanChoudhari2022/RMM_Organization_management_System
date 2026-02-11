import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Search, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Task } from "@/types/admin";

const Tasks = () => {
  // Fetch directly from supabase for public page
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["public_tasks"],
    queryFn: async () => {
      const { data, error } = await supabase.from('tasks').select('*').order('date', { ascending: true });
      if (error) throw error;
      return data as Task[];
    }
  });

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = tasks ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((t) =>
      t.title.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q))
    );
  }, [tasks, query]);

  return (
    <div className="bg-[#FFFBF2] min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <span className="text-[#F05A22] font-bold text-[11px] uppercase tracking-[0.3em] mb-3 block">Mandal Operations</span>
          <h1 className="text-[#3E2723] text-3xl md:text-4xl font-display font-black tracking-tight mb-3">
            Active <span className="text-[#F05A22] italic">Tasks</span>
          </h1>
          <p className="text-[#3E2723]/70 text-sm max-w-2xl">
            View upcoming tasks and confirm your availability.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3E2723]/40" size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-[#3E2723]/10 rounded-xl text-[#3E2723] placeholder:text-[#3E2723]/40 focus:outline-none focus:ring-2 focus:ring-[#F05A22]/20 text-sm"
          />
        </div>

        {/* Cards */}
        {isLoading ? (
          <div className="text-[#3E2723]/60 text-sm text-center py-20">Loading tasks...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-[#3E2723]/10 p-10 rounded-2xl text-[#3E2723]/60 text-sm text-center">No active tasks found.</div>
        ) : (
          <div className="space-y-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.05, 0.3) }}
                  className="bg-white border border-[#3E2723]/10 rounded-2xl overflow-hidden hover:border-[#F05A22]/30 hover:shadow-lg transition-all"
                >
                  <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-[#F05A22]/10 text-[#F05A22] rounded-full text-[10px] font-black uppercase tracking-widest">
                          Task
                        </span>
                        <span className="text-xs text-[#3E2723]/60 font-bold uppercase tracking-wider">{task.date}</span>
                      </div>
                      <h3 className="text-xl font-display font-black text-[#3E2723] mb-2">{task.title}</h3>
                      <p className="text-[#3E2723]/80 text-sm mb-4 leading-relaxed max-w-xl">{task.description}</p>

                      <div className="flex flex-wrap gap-4 text-xs text-[#3E2723]/60 font-medium">
                        <span className="flex items-center gap-1.5"><Clock size={14} className="text-[#F05A22]" /> {task.time}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#F05A22]" /> {task.location}</span>
                      </div>
                    </div>

                    <Link
                      to={`/approve/${task.id}`}
                      className="w-full md:w-auto px-8 py-4 bg-[#3E2723] text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#F05A22] transition-colors flex items-center justify-center gap-2 shadow-xl shadow-[#3E2723]/10"
                    >
                      Respond Now <CheckCircle2 size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
