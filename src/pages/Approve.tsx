import { useParams } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CheckCircle2, XCircle, MessageSquare, Shield, Calendar, Clock, MapPin, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Member } from "@/types/admin";

const Approve = () => {
  // The 'token' param is now actually the Task ID (UUID)
  const { token: taskId } = useParams<{ token: string }>();
  const [selectedAction, setSelectedAction] = useState<"approved" | "declined" | null>(null);
  const [comment, setComment] = useState("");
  const [selectedMemberName, setSelectedMemberName] = useState("");
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showComment, setShowComment] = useState(false);

  // Fetch Task Details
  const { data: task, isLoading: isTaskLoading } = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      if (!taskId) return null;
      const { data, error } = await supabase.from('tasks').select('*').eq('id', taskId).single();
      if (error) throw error;
      return data as any;
    },
    enabled: !!taskId
  });

  // Fetch Members for Dropdown
  const { data: members, isLoading: isMembersLoading } = useQuery({
    queryKey: ["members_list"],
    queryFn: async () => {
      const { data, error } = await supabase.from('members').select('name').order('name');
      if (error) throw error;
      return data as { name: string }[];
    }
  });

  // Submit Response
  const submitResponse = useMutation({
    mutationFn: async (status: "approved" | "declined") => {
      if (!taskId || !selectedMemberName) throw new Error("Missing data");

      const { error } = await supabase.from('task_responses').insert([
        {
          task_id: taskId,
          member_name: selectedMemberName,
          status: status,
          comment: comment,
          responded_at: new Date().toISOString()
        }
      ] as any);
      if (error) throw error;
    },
    onSuccess: (_, status) => {
      setSelectedAction(status);
      setSubmitted(true);
    }
  });

  const handleSubmit = (action: "approved" | "declined") => {
    if (!selectedMemberName) {
      alert("कृपया आपलं नाव निवडा (Please select your name)");
      return;
    }

    if (action === "declined" && !comment.trim()) {
      setShowComment(true);
      alert("कृपया न येण्याचं कारण नमूद करा (Please provide a reason for unavailability)");
      return;
    }

    submitResponse.mutate(action);
  };

  if (isTaskLoading || isMembersLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin text-shiv-saffron" size={40} />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <Shield className="text-gray-300 mb-4" size={48} />
        <h1 className="text-xl font-bold text-gray-800">कार्य सापडले नाही</h1>
        <p className="text-gray-500 mt-2">Invalid Task Link or Task Deleted.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm w-full text-center"
        >
          <div className={`w-20 h-20 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-xl ${selectedAction === "approved" ? "bg-green-500 shadow-green-500/20" : "bg-red-500 shadow-red-500/20"
            }`}>
            {selectedAction === "approved" ? <CheckCircle2 size={36} className="text-white" /> : <XCircle size={36} className="text-white" />}
          </div>
          <h1 className="text-2xl font-display font-black text-[#1A1A1A] mb-3">
            {selectedAction === "approved" ? "Attendance Confirmed!" : "Marked Unavailable"}
          </h1>
          <p className="text-gray-400 text-sm mb-2">
            Thank you, <strong>{selectedMemberName}</strong>!
            <br />
            {selectedAction === "approved"
              ? "Your attendance has been confirmed."
              : "Your unavailability has been recorded."}
          </p>

          <p className="text-xs text-gray-300 mt-8 font-bold uppercase tracking-widest">Rahul Mitra Mandal • Kedari Nagar</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-shiv-saffron/5 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-shiv-saffron/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white border border-gray-100 shadow-[0_20px_80px_rgba(0,0,0,0.06)] rounded-3xl p-8 md:p-10">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <img src="/images/logo.png" alt="Logo" className="w-20 h-20 object-contain drop-shadow-xl" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-shiv-saffron/10 text-shiv-saffron rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              <Shield size={12} /> Rahul Mitra Mandal
            </div>
            <h1 className="text-2xl font-display font-black text-[#1A1A1A] mb-2">{task.title}</h1>
            <p className="text-gray-500 text-sm leading-relaxed">{task.description}</p>
          </div>

          <div className="space-y-3 mb-8 bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Calendar size={16} className="text-shiv-saffron" />
              <span className="font-bold">{task.date}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Clock size={16} className="text-shiv-saffron" />
              <span className="font-bold">{task.time}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MapPin size={16} className="text-shiv-saffron" />
              <span>{task.location}</span>
            </div>
          </div>

          {/* Member Selection */}
          <div className="mb-6">
            <div className="flex justify-between items-baseline mb-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Your Name</label>
              <button
                onClick={() => {
                  setIsManualEntry(!isManualEntry);
                  setSelectedMemberName("");
                }}
                className="text-[10px] font-bold text-shiv-saffron hover:underline"
              >
                {isManualEntry ? "Select from List" : "Type Manually"}
              </button>
            </div>

            <div className="space-y-4">
              {isManualEntry ? (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <input
                    type="text"
                    value={selectedMemberName}
                    onChange={(e) => setSelectedMemberName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 pl-4 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-shiv-saffron/20 placeholder:font-normal"
                    autoFocus
                  />
                  <p className="mt-1.5 text-[10px] text-gray-400 italic">Please enter your full name for the record.</p>
                </motion.div>
              ) : (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <select
                    value={selectedMemberName}
                    onChange={(e) => setSelectedMemberName(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-10 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-shiv-saffron/20 appearance-none"
                  >
                    <option value="">Select Name</option>
                    {members?.map((m: any) => (
                      <option key={m.name} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => handleSubmit("approved")}
              disabled={submitResponse.isPending}
              className="py-5 rounded-2xl bg-green-50 border-2 border-green-100 text-green-600 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all flex flex-col items-center gap-2 group active:scale-95 disabled:opacity-50"
            >
              <CheckCircle2 size={28} className="group-hover:scale-110 transition-transform" />
              <div className="text-sm font-black uppercase tracking-widest">Available</div>
            </button>
            <button
              onClick={() => handleSubmit("declined")}
              disabled={submitResponse.isPending}
              className="py-5 rounded-2xl bg-red-50 border-2 border-red-100 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all flex flex-col items-center gap-2 group active:scale-95 disabled:opacity-50"
            >
              <XCircle size={28} className="group-hover:scale-110 transition-transform" />
              <div className="text-sm font-black uppercase tracking-widest">Not Available</div>
            </button>
          </div>

          {/* Optional Comment Toggle */}
          <button
            onClick={() => setShowComment(!showComment)}
            className="w-full py-2 text-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-shiv-saffron transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare size={14} /> {showComment ? "Hide Comment" : "Add Comment (Optional)"}
          </button>

          {showComment && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="mt-3 overflow-hidden">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Reason / Comment..."
                className="w-full min-h-[90px] p-4 bg-gray-50 border border-gray-100 rounded-xl text-[#1A1A1A] text-sm placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-shiv-saffron/20 resize-y font-marathi"
              />
            </motion.div>
          )}

          {submitResponse.isError && (
            <div className="mt-4 p-3 bg-red-50 text-red-500 text-xs rounded-xl text-center">
              Error submitting response. Please try again.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Approve;
