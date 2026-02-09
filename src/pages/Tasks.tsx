import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, MessageSquare, AlertTriangle } from "lucide-react";
import { getTasks } from "@/lib/api";
import type { Task } from "@/types";

const priorityColors: Record<string, string> = {
  high: "text-red-400 bg-red-400/10",
  medium: "text-yellow-400 bg-yellow-400/10",
  low: "text-green-400 bg-green-400/10",
};

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [commentingId, setCommentingId] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    getTasks().then(setTasks);
  }, []);

  const handleAction = (taskId: string, action: string) => {
    console.log(`[Task Action] ID: ${taskId}, Action: ${action}`);
    if (action === "comment") {
      setCommentingId(commentingId === taskId ? null : taskId);
    }
  };

  const submitComment = (taskId: string) => {
    console.log(`[Task Comment] ID: ${taskId}, Comment: ${comment}`);
    setComment("");
    setCommentingId(null);
  };

  return (
    <div className="bg-background min-h-screen pt-20">
      <section className="section-padding pb-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-devanagari text-4xl text-gradient-gold mb-3">कार्य मंजूरी</h1>
          <p className="font-serif text-xl text-secondary">Task Approval</p>
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-lg mx-auto space-y-4">
          {tasks.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-devanagari text-lg text-secondary">{task.titleMarathi}</h3>
                  <p className="text-sm text-foreground/80">{task.titleEnglish}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
              <div className="text-xs text-muted-foreground mb-4 flex flex-wrap gap-3">
                <span>👤 {task.assignedTo}</span>
                <span>📅 {task.dueDate}</span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(task.id, "available")}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors text-sm"
                >
                  <CheckCircle size={16} />
                  <span className="font-devanagari">उपलब्ध</span>
                </button>
                <button
                  onClick={() => handleAction(task.id, "unavailable")}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm"
                >
                  <XCircle size={16} />
                  <span className="font-devanagari">अनुपलब्ध</span>
                </button>
                <button
                  onClick={() => handleAction(task.id, "comment")}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm"
                >
                  <MessageSquare size={16} />
                  <span className="font-devanagari">टिप्पणी</span>
                </button>
              </div>

              {/* Comment area */}
              {commentingId === task.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3"
                >
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="टिप्पणी लिहा / Write your comment..."
                    className="w-full p-3 rounded-lg glass text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                    rows={3}
                  />
                  <button
                    onClick={() => submitComment(task.id)}
                    className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold"
                  >
                    पाठवा / Submit
                  </button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Tasks;
