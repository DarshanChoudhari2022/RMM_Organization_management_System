import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:5050/api";

const Approve = () => {
  const { token } = useParams<{ token: string }>();
  const [comment, setComment] = useState("");

  const mutation = useMutation({
    mutationFn: async (action: "APPROVED" | "DECLINED") => {
      if (!token) throw new Error("Missing token");
      const res = await fetch(`${API_BASE}/tasks/approve/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, comment }),
      });
      if (!res.ok) {
        throw new Error("Link expired or invalid");
      }
      return res.json() as Promise<{ status: string }>;
    },
  });

  const handle = (action: "APPROVED" | "DECLINED") => mutation.mutate(action);

  return (
    <div className="min-h-screen bg-shiv-dark flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white/5 border border-white/10 p-8 text-white">
        <h1 className="text-xl font-black mb-2">कार्य स्वीकृती लिंक</h1>
        <p className="text-white/60 text-sm font-serif italic mb-6">
          Tap one option to confirm your availability. This updates the admin dashboard in real deployments.
        </p>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Optional comment / reason…"
          className="w-full min-h-[90px] p-3 bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-shiv-orange/30 mb-6 resize-y"
        />

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            disabled={mutation.isPending}
            onClick={() => handle("APPROVED")}
            className="py-3 bg-[#228B22] text-white text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {mutation.isPending && <Loader2 size={14} className="animate-spin" />}
            उपलब्ध
          </button>
          <button
            disabled={mutation.isPending}
            onClick={() => handle("DECLINED")}
            className="py-3 bg-[#DC143C] text-white text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {mutation.isPending && <Loader2 size={14} className="animate-spin" />}
            अनुपलब्ध
          </button>
        </div>

        {mutation.isSuccess && (
          <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm">
            <CheckCircle2 size={18} /> प्रतिसाद नोंदवला गेला आहे.
          </div>
        )}
        {mutation.isError && (
          <div className="mt-4 flex items-center gap-2 text-red-400 text-sm">
            <XCircle size={18} /> लिंक कालबाह्य किंवा अवैध आहे.
          </div>
        )}
      </div>
    </div>
  );
};

export default Approve;

