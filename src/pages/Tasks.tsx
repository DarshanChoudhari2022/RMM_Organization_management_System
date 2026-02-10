import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, CheckCircle2, MessageSquare, Search, User, XCircle } from "lucide-react";

import type { Task } from "@/types";
import { getTasks } from "@/lib/api";

type TaskAction = "available" | "not_available" | "comment";

const Tasks = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const [query, setQuery] = useState("");
  const [commentById, setCommentById] = useState<Record<string, string>>({});
  const [selectedActionById, setSelectedActionById] = useState<Record<string, TaskAction | null>>({});

  const filtered = useMemo(() => {
    const list = data ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((t) => {
      return (
        t.titleEnglish.toLowerCase().includes(q) ||
        t.titleMarathi.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.assignedTo.toLowerCase().includes(q) ||
        t.dueDate.toLowerCase().includes(q)
      );
    });
  }, [data, query]);

  const logAction = (task: Task, action: TaskAction, comment?: string) => {
    // PRD expects backend tracking; for now we keep this UI-only.
    // eslint-disable-next-line no-console
    console.log("[TASK_RESPONSE]", {
      taskId: task.id,
      action,
      comment: comment?.trim() || undefined,
      at: new Date().toISOString(),
    });
  };

  return (
    <div className="bg-shiv-dark min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-white">
            Task Approval <span className="text-shiv-orange italic">(Mobile-First)</span>
          </h1>
          <p className="text-white/60 font-serif italic mt-3 leading-shiv max-w-3xl">
            Tap one action: <span className="text-white/80">उपलब्ध</span>, <span className="text-white/80">अनुपलब्ध</span>, or{" "}
            <span className="text-white/80">टिप्पणी</span>. This logs to console for now (backend-ready).
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks…"
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-shiv-orange/30"
          />
        </div>

        {/* Cards */}
        {isLoading ? (
          <div className="text-white/60 font-serif italic">Loading tasks…</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white/5 border border-white/10 p-10 text-white/60 font-serif italic">No tasks match your search.</div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((task, i) => {
                const selected = selectedActionById[task.id] ?? null;
                const comment = commentById[task.id] ?? "";
                const showComment = selected === "comment";

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.2) }}
                    className="bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden"
                  >
                    <div className="p-8">
                      <div className="flex items-start justify-between gap-6">
                        <div>
                          <span className="logo-marathi text-3xl text-white block">{task.titleMarathi}</span>
                          <div className="text-white/50 text-sm font-serif italic mt-1">{task.titleEnglish}</div>
                        </div>
                        <div className="text-right text-white/60 text-sm font-serif italic space-y-2">
                          <div className="flex items-center justify-end gap-2">
                            <User size={16} className="text-shiv-orange" />
                            <span>{task.assignedTo}</span>
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <Calendar size={16} className="text-shiv-orange" />
                            <span>{task.dueDate}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-white/60 font-serif italic mt-6 leading-shiv">{task.description}</p>

                      <div className="mt-8 grid grid-cols-3 gap-3">
                        <button
                          className={`py-4 text-[10px] font-black uppercase tracking-[0.3em] border transition-all ${
                            selected === "available"
                              ? "bg-[#228B22] text-white border-[#228B22]"
                              : "bg-white/5 text-white/70 border-white/10 hover:border-white/20"
                          }`}
                          onClick={() => {
                            setSelectedActionById((s) => ({ ...s, [task.id]: "available" }));
                            logAction(task, "available");
                          }}
                        >
                          उपलब्ध
                        </button>
                        <button
                          className={`py-4 text-[10px] font-black uppercase tracking-[0.3em] border transition-all ${
                            selected === "not_available"
                              ? "bg-[#DC143C] text-white border-[#DC143C]"
                              : "bg-white/5 text-white/70 border-white/10 hover:border-white/20"
                          }`}
                          onClick={() => {
                            setSelectedActionById((s) => ({ ...s, [task.id]: "not_available" }));
                            logAction(task, "not_available");
                          }}
                        >
                          अनुपलब्ध
                        </button>
                        <button
                          className={`py-4 text-[10px] font-black uppercase tracking-[0.3em] border transition-all ${
                            selected === "comment"
                              ? "bg-shiv-orange text-white border-shiv-orange"
                              : "bg-white/5 text-white/70 border-white/10 hover:border-white/20"
                          }`}
                          onClick={() => setSelectedActionById((s) => ({ ...s, [task.id]: "comment" }))}
                        >
                          टिप्पणी
                        </button>
                      </div>

                      <AnimatePresence>
                        {showComment && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-5 overflow-hidden"
                          >
                            <textarea
                              value={comment}
                              onChange={(e) => setCommentById((s) => ({ ...s, [task.id]: e.target.value }))}
                              placeholder="Write a comment / reason…"
                              className="w-full min-h-[110px] p-4 bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-shiv-orange/30 resize-y"
                            />
                            <div className="mt-3 flex items-center justify-between gap-3">
                              <div className="text-white/40 text-xs font-serif italic">
                                This will be stored in backend later; for now it logs to console.
                              </div>
                              <div className="flex gap-3">
                                <button
                                  className="px-6 py-3 bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-all text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2"
                                  onClick={() => {
                                    setSelectedActionById((s) => ({ ...s, [task.id]: null }));
                                    setCommentById((s) => ({ ...s, [task.id]: "" }));
                                  }}
                                >
                                  <XCircle size={16} className="text-white/40" /> Cancel
                                </button>
                                <button
                                  className="px-6 py-3 bg-shiv-orange text-white border border-shiv-orange transition-all text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2"
                                  onClick={() => logAction(task, "comment", comment)}
                                >
                                  <MessageSquare size={16} /> Submit
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
                          Priority: <span className="text-white/60">{task.priority}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-widest">
                          <CheckCircle2 size={14} className="text-shiv-orange" /> Status: {task.status}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
