import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Wallet,
  Shield,
  CreditCard,
  Send,
  LogOut,
  Plus,
  Trash2,
  Phone,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  MapPin,
  Search,
  Users,
  ChevronDown,
  Filter,
  Share2,
  MessageSquare,
  MoreHorizontal,
  Menu,
  X
} from "lucide-react";
import { useMembers, useTasks, useExpenses, useInvitations, useTaskResponses } from "@/lib/admin-api";
import { supabase } from "@/lib/supabase";
import { Task, Expense, Invitation, Member, TaskCategory } from "@/types/admin";

// --- Components ---

const SidebarItem = ({ id, label, icon: Icon, active, onClick }: any) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex items-center gap-4 px-6 py-4 transition-all relative rounded-xl text-left mb-1 font-bold ${active
      ? "bg-[#D95D1E]/10 text-[#D95D1E]"
      : "text-[#2C1810]/60 hover:text-[#2C1810] hover:bg-[#2C1810]/5"
      }`}
  >
    <Icon size={20} className={active ? "text-[#D95D1E]" : "text-[#2C1810]/40"} />
    <span className="text-[11px] uppercase tracking-[0.15em]">{label}</span>
    {active && (
      <motion.div
        layoutId="active-nav"
        className="absolute left-0 w-1 h-8 bg-[#D95D1E] rounded-r-full"
      />
    )}
  </button>
);

const YearSelector = ({ selected, onChange }: { selected: number, onChange: (y: number) => void }) => {
  const years = [2024, 2025, 2026, 2027];
  return (
    <div className="relative">
      <select
        value={selected}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="appearance-none bg-white border border-gray-200 px-4 py-2 pr-8 rounded-xl text-sm font-bold text-[#2C1810]/90 outline-none focus:ring-2 focus:ring-[#D95D1E]/20 cursor-pointer"
      >
        {years.map(y => <option key={y} value={y}>Year {y}</option>)}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2C1810]/60 pointer-events-none" size={14} />
    </div>
  )
}

// --- Tabs ---

const MembersTab = () => {
  const { data: members, addMember, deleteMember, updateVargani } = useMembers();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", phone: "", role: "Member" });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editingVargani, setEditingVargani] = useState<{ id: string, amount: number } | null>(null);

  const stats = useMemo(() => {
    const total = members?.length || 0;
    const yearPayments = members?.map(m => m.varganiHistory.find(v => v.year === selectedYear)).filter(Boolean);
    const paid = yearPayments?.filter(v => v?.paid).length || 0;
    const collected = yearPayments?.reduce((sum, v) => sum + (v?.paid ? (v?.amount || 0) : 0), 0) || 0;
    const pending = yearPayments?.reduce((sum, v) => sum + (!v?.paid ? (v?.amount || 0) : 0), 0) || 0;
    return { total, paid, collected, pending };
  }, [members, selectedYear]);

  const handleAdd = () => {
    if (!newMember.name || !newMember.phone) return;
    addMember.mutate({ ...newMember, joinedYear: selectedYear, role: newMember.role });
    setNewMember({ name: "", phone: "", role: "Member" });
    setIsAddOpen(false);
  };

  const saveVarganiAmount = (id: string, amount: number) => {
    // Keep paid status same, just update amount
    const member = members?.find(m => m.id === id);
    const vargani = member?.varganiHistory.find(v => v.year === selectedYear);
    const isPaid = vargani?.paid || false;
    updateVargani.mutate({ id, paid: isPaid, year: selectedYear, amount });
    setEditingVargani(null);
  };

  return (
    <div className="space-y-8">
      {/* Toolbar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-display font-black text-[#2C1810]">Member Directory</h2>
          <YearSelector selected={selectedYear} onChange={setSelectedYear} />
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-[#D95D1E] text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#B94A15] transition-all shadow-lg shadow-[#D95D1E]/20"
        >
          <Plus size={16} /> Add Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <div className="text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-2">Total Members</div>
          <div className="text-3xl font-black text-[#2C1810]">{stats.total}</div>
        </div>
        <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <div className="text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-2">Vargani Collected</div>
          <div className="text-3xl font-black text-green-600">₹{stats.collected.toLocaleString()}</div>
          <div className="text-xs text-[#2C1810]/60 mt-1">{stats.paid} Members Paid</div>
        </div>
        <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <div className="text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-2">Pending Amount</div>
          <div className="text-3xl font-black text-red-500">₹{stats.pending.toLocaleString()}</div>
          <div className="text-xs text-[#2C1810]/60 mt-1">{stats.total - stats.paid} Members Pending</div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-x-auto">
        <div className="min-w-[800px] grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-[#F5F5F0] text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60">
          <div className="col-span-4">Name & Role</div>
          <div className="col-span-3">Contact</div>
          <div className="col-span-3">Vargani ({selectedYear})</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        {members?.length === 0 ? (
          <div className="p-10 text-center text-[#2C1810]/60 text-sm">No members found. Add one to get started.</div>
        ) : (
          members?.map((member) => {
            const vargani = member.varganiHistory.find(v => v.year === selectedYear);
            const isPaid = vargani?.paid;
            const amount = vargani?.amount || 1500;
            const isEditing = editingVargani?.id === member.id;

            return (
              <div key={member.id} className="min-w-[800px] grid grid-cols-12 gap-4 p-4 border-b border-gray-50 items-center hover:bg-[#FDFBF7] transition-colors">
                <div className="col-span-4">
                  <div className="font-bold text-[#2C1810]">{member.name}</div>
                  <div className="text-[10px] text-[#2C1810]/60">{member.role}</div>
                </div>
                <div className="col-span-3 text-sm text-[#2C1810]/80 font-mono">{member.phone}</div>
                <div className="col-span-3 flex items-center gap-3">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="w-20 px-2 py-1 border border-[#D95D1E] rounded text-sm font-bold outline-none"
                        value={editingVargani.amount}
                        onChange={(e) => setEditingVargani({ ...editingVargani, amount: parseInt(e.target.value) || 0 })}
                      />
                      <button
                        onClick={() => saveVarganiAmount(member.id, editingVargani.amount)}
                        className="p-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <button
                        onClick={() => setEditingVargani(null)}
                        className="p-1 bg-red-50 text-red-500 rounded hover:bg-red-100"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-bold text-[#2C1810] w-12">₹{amount}</span>
                      <button
                        onClick={() => setEditingVargani({ id: member.id, amount })}
                        className="p-1 text-[#D95D1E]/60 hover:text-[#D95D1E] rounded transition-colors"
                        title="Edit Amount"
                      >
                        <div className="w-4 h-4 border border-current rounded-sm flex items-center justify-center text-[10px] font-sans">✎</div>
                      </button>
                      <button
                        onClick={() => updateVargani.mutate({ id: member.id, paid: !isPaid, year: selectedYear, amount })}
                        disabled={updateVargani.isPending}
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 w-fit transition-all ${isPaid ? "bg-green-100 text-green-700" : "bg-red-50 text-red-500 hover:bg-red-100"
                          } disabled:opacity-50`}
                      >
                        {isPaid ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {isPaid ? "Paid" : "Pending"}
                      </button>
                    </>
                  )}
                </div>
                <div className="col-span-2 flex justify-end gap-2">
                  <button
                    onClick={() => {
                      const msg = `नमस्कार ${member.name}, कृपया ${selectedYear} ची वर्गणी (₹${amount}) जमा करावी ही विनंती. - शिवगर्जना मंडळ`;
                      window.open(`https://wa.me/91${member.phone}?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Send WhatsApp Reminder"
                  >
                    <MessageSquare size={16} />
                  </button>
                  <button
                    onClick={() => deleteMember.mutate(member.id)}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Member"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl"
            >
              <h3 className="text-xl font-display font-black text-[#2C1810] mb-6">Add New Member</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Full Name</label>
                  <input
                    value={newMember.name}
                    onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                    className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Mobile Number</label>
                  <input
                    value={newMember.phone}
                    onChange={e => setNewMember({ ...newMember, phone: e.target.value })}
                    className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                    placeholder="10 digit mobile number"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Role</label>
                  <select
                    value={newMember.role}
                    onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                    className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                  >
                    <option value="Member">Member</option>
                    <option value="President">President</option>
                    <option value="Treasurer">Treasurer</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setIsAddOpen(false)} className="flex-1 py-3 text-[#2C1810]/70 font-bold text-sm bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
                <button onClick={handleAdd} className="flex-1 py-3 text-white font-bold text-sm bg-[#D95D1E] rounded-xl hover:bg-[#B94A15]">Add Member</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Components ---

const AttendanceList = ({ taskId }: { taskId: string }) => {
  const { data: responses, isLoading } = useTaskResponses(taskId);

  if (isLoading) return <div className="p-4 text-xs text-center text-gray-400">Loading attendance...</div>;

  const approved = responses?.filter(r => r.status === 'approved') || [];
  const declined = responses?.filter(r => r.status === 'declined') || [];

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Available ({approved.length})</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {approved.length === 0 ? (
            <span className="text-[10px] text-gray-400">No one marked available yet.</span>
          ) : (
            approved.map(r => (
              <div key={r.id} className="px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] font-bold group relative">
                {r.memberName}
                {r.comment && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-[9px] rounded opacity-0 group-hover:opacity-100 transition-opacity w-32 pointer-events-none z-10">
                    {r.comment}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <div className="pt-2 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Not Available ({declined.length})</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {declined.length === 0 ? (
            <span className="text-[10px] text-gray-400">No absences recorded.</span>
          ) : (
            declined.map(r => (
              <div key={r.id} className="px-2 py-1 bg-red-50 text-red-600 rounded text-[10px] font-bold group relative">
                {r.memberName}
                {r.comment && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-[9px] rounded opacity-0 group-hover:opacity-100 transition-opacity w-32 pointer-events-none z-10">
                    {r.comment}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const TasksTab = () => {
  const { data: tasks, addTask, updateTask, deleteTask } = useTasks();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({ title: "", description: "", date: "", time: "", location: "Kedari Nagar Chowk" });
  const [showAttendees, setShowAttendees] = useState<string | null>(null);

  const handleSave = () => {
    if (editingTask) {
      if (!editingTask.title || !editingTask.date) return;
      updateTask.mutate(editingTask);
      setEditingTask(null);
      setIsAddOpen(false);
    } else {
      if (!newTask.title || !newTask.date) return;
      addTask.mutate(newTask as any);
      setNewTask({ title: "", description: "", date: "", time: "", location: "Kedari Nagar Chowk" });
      setIsAddOpen(false);
    }
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setIsAddOpen(true);
  };

  const generateShareText = (task: Task) => {
    const approvalLink = `${window.location.origin}/approve/${task.id}`;
    return `🚩 *शिवगर्जना मंडळ - नवीन कार्य*\n\n🔹 *${task.title}*\n📅 ${task.date} | 🕐 ${task.time}\n📍 ${task.location}\n\n📝 ${task.description}\n\n✅ खालील लिंकवर क्लिक करून उपस्थिती कळवा:\n${approvalLink}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-display font-black text-[#2C1810]">Task Manager</h2>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-[#D95D1E] text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#D95D1E]/90 transition-all shadow-lg shadow-[#D95D1E]/20"
        >
          <Plus size={16} /> Assign Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks?.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-[#F5F5F0] rounded-3xl border border-dashed border-gray-200">
            <div className="text-[#2C1810]/60 font-medium">No tasks scheduled yet.</div>
            <button onClick={() => setIsAddOpen(true)} className="mt-4 text-[#D95D1E] font-bold text-sm hover:underline">Create your first task</button>
          </div>
        ) : (
          tasks?.map(task => (
            <div key={task.id} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-orange-50 text-[#D95D1E] rounded-xl">
                  <CheckCircle2 size={20} />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(task)}
                    className="p-2 text-[#D95D1E]/60 hover:text-[#D95D1E] hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    <div className="w-4 h-4 border border-current rounded-sm flex items-center justify-center text-[10px] font-sans">✎</div>
                  </button>
                  <button onClick={() => deleteTask.mutate(task.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#2C1810] mb-2">{task.title}</h3>
              <p className="text-sm text-[#2C1810]/70 line-clamp-2 mb-4">{task.description}</p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs text-[#2C1810]/70 font-medium">
                  <Calendar size={14} className="text-[#D95D1E]" /> {task.date}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#2C1810]/70 font-medium">
                  <Clock size={14} className="text-[#D95D1E]" /> {task.time}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#2C1810]/70 font-medium">
                  <MapPin size={14} className="text-[#D95D1E]" /> {task.location}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowAttendees(showAttendees === task.id ? null : task.id)}
                  className={`w-full py-2 ${showAttendees === task.id ? "bg-[#2C1810] text-white" : "bg-gray-100 text-[#2C1810]/60"} rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all`}
                >
                  {showAttendees === task.id ? "Close Attendance" : "View Attendance"}
                </button>

                {showAttendees === task.id && <AttendanceList taskId={task.id} />}

                <button
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(generateShareText(task))}`, '_blank')}
                  className="w-full py-3 bg-green-50 text-green-600 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-green-100 transition-colors"
                >
                  <Share2 size={14} /> Share on WhatsApp
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Add Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <h3 className="text-xl font-display font-black text-[#2C1810] mb-6">{editingTask ? "Edit Task" : "Assign New Task"}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Task Title</label>
                  <input
                    value={editingTask ? editingTask.title : newTask.title}
                    onChange={e => editingTask ? setEditingTask({ ...editingTask, title: e.target.value }) : setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                    placeholder="e.g. Stage Decoration"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Description</label>
                  <textarea
                    value={editingTask ? editingTask.description : newTask.description}
                    onChange={e => editingTask ? setEditingTask({ ...editingTask, description: e.target.value }) : setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20 min-h-[80px]"
                    placeholder="Details about the task..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Date</label>
                    <input
                      type="date"
                      value={editingTask ? editingTask.date : newTask.date}
                      onChange={e => editingTask ? setEditingTask({ ...editingTask, date: e.target.value }) : setNewTask({ ...newTask, date: e.target.value })}
                      className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Time</label>
                    <input
                      type="time"
                      value={editingTask ? editingTask.time : newTask.time}
                      onChange={e => editingTask ? setEditingTask({ ...editingTask, time: e.target.value }) : setNewTask({ ...newTask, time: e.target.value })}
                      className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Location</label>
                  <input
                    value={editingTask ? editingTask.location : newTask.location}
                    onChange={e => editingTask ? setEditingTask({ ...editingTask, location: e.target.value }) : setNewTask({ ...newTask, location: e.target.value })}
                    className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                    placeholder="Location"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingTask(null);
                  }}
                  className="flex-1 py-3 text-[#2C1810]/70 font-bold text-sm bg-gray-100 rounded-xl hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button onClick={handleSave} className="flex-1 py-3 text-white font-bold text-sm bg-[#D95D1E] rounded-xl hover:bg-[#D95D1E]/90">
                  {editingTask ? "Update Task" : "Create Task"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const ExpensesTab = () => {
  const { data: expenses, addExpense, updateRefundStatus } = useExpenses();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newEx, setNewEx] = useState({ description: "", amount: "", category: "Other", date: new Date().toISOString().split("T")[0], paidBy: "Mandal" });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Filter by year
  const filteredExpenses = useMemo(() => {
    return expenses?.filter(e => {
      const year = parseInt(e.date.split("-")[0]);
      return year === selectedYear;
    }) || [];
  }, [expenses, selectedYear]);

  const totalSpent = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  const handleAdd = () => {
    if (!newEx.description || !newEx.amount) return;
    addExpense.mutate({
      description: newEx.description,
      amount: parseFloat(newEx.amount),
      category: newEx.category,
      date: newEx.date,
      status: "approved",
      year: parseInt(newEx.date.split("-")[0]),
      paidBy: newEx.paidBy,
      isRefunded: false
    });
    setNewEx({ description: "", amount: "", category: "Other", date: new Date().toISOString().split("T")[0], paidBy: "Mandal" });
    setIsAddOpen(false);
  };

  const toggleRefund = (id: string, currentStatus: boolean) => {
    updateRefundStatus.mutate({ id, isRefunded: !currentStatus });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-display font-black text-[#2C1810]">Expenses</h2>
          <YearSelector selected={selectedYear} onChange={setSelectedYear} />
          <p className="text-xs text-[#2C1810]/60 font-bold uppercase tracking-wider ml-4 border-l pl-4 border-gray-100">
            Total for {selectedYear}: <span className="text-[#D95D1E] text-lg ml-1">₹{totalSpent.toLocaleString()}</span>
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-[#D95D1E] text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#D95D1E]/90 transition-all shadow-lg shadow-[#D95D1E]/20"
        >
          <Plus size={16} /> Add Expense
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-x-auto">
        <div className="min-w-[800px] grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-[#F5F5F0] text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60">
          <div className="col-span-4">Description</div>
          <div className="col-span-2">Paid By</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2 text-right">Amount & Status</div>
        </div>
        {filteredExpenses.length === 0 ? (
          <div className="p-10 text-center text-[#2C1810]/60 text-sm">No expenses recorded for {selectedYear}.</div>
        ) : (
          filteredExpenses.map((ex) => (
            <div key={ex.id} className="min-w-[800px] grid grid-cols-12 gap-4 p-4 border-b border-gray-50 items-center hover:bg-[#FDFBF7] transition-colors">
              <div className="col-span-4">
                <div className="font-bold text-[#2C1810]">{ex.description}</div>
              </div>
              <div className="col-span-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${ex.paidBy === 'Mandal' ? 'bg-[#D95D1E]/10 text-[#D95D1E]' : 'bg-purple-100 text-purple-700'}`}>
                  {ex.paidBy}
                </span>
              </div>
              <div className="col-span-2">
                <span className="bg-gray-100 text-[#2C1810]/80 px-2 py-1 rounded-md text-xs font-medium">{ex.category}</span>
              </div>
              <div className="col-span-2 text-sm text-[#2C1810]/70 font-mono">{ex.date}</div>
              <div className="col-span-2 text-right">
                <div className="font-black text-[#D95D1E] mb-1">₹{ex.amount.toLocaleString()}</div>
                {ex.paidBy !== 'Mandal' && (
                  <button
                    onClick={() => toggleRefund(ex.id, ex.isRefunded)}
                    className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border transition-all ${ex.isRefunded
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100"}`}
                  >
                    {ex.isRefunded ? "Refunded ✅" : "Pending Refund ⚠️"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-sm p-8 shadow-2xl"
            >
              <h3 className="text-xl font-display font-black text-[#2C1810] mb-6">Log Expense</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Description</label>
                  <input
                    value={newEx.description}
                    onChange={e => setNewEx({ ...newEx, description: e.target.value })}
                    className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                    placeholder="Item name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={newEx.amount}
                    onChange={e => setNewEx({ ...newEx, amount: e.target.value })}
                    className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Paid By</label>
                  <input
                    value={newEx.paidBy}
                    onChange={e => setNewEx({ ...newEx, paidBy: e.target.value })}
                    className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                    placeholder="e.g. Mandal, Yash, Rahul"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Date</label>
                  <input
                    type="date"
                    value={newEx.date}
                    onChange={e => setNewEx({ ...newEx, date: e.target.value })}
                    className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Category</label>
                  <select
                    value={newEx.category}
                    onChange={e => setNewEx({ ...newEx, category: e.target.value })}
                    className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                  >
                    <option>Decoration</option>
                    <option>Sound/DJ</option>
                    <option>Food</option>
                    <option>Transport</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setIsAddOpen(false)} className="flex-1 py-3 text-[#2C1810]/70 font-bold text-sm bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
                <button onClick={handleAdd} className="flex-1 py-3 text-white font-bold text-sm bg-[#D95D1E] rounded-xl hover:bg-[#D95D1E]/90">Add</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const InvitationsTab = () => {
  const [invitation, setInvitation] = useState({ title: "", date: "", time: "", location: "Kedari Nagar Chowk", message: "" });
  const generateMsg = () => {
    return `🎉 *ग्रूप निमंत्रण - शिवगर्जना मंडळ*\n\n📣 *${invitation.title}*\n📅 ${invitation.date} | 🕐 ${invitation.time}\n📍 ${invitation.location}\n\n📝 ${invitation.message}\n\nसर्वांनी वेळेवर उपस्थित राहावे!`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-100/50">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#D95D1E]/10 text-[#D95D1E] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Send size={28} />
          </div>
          <h2 className="text-2xl font-display font-black text-[#2C1810]">Create Invitation</h2>
          <p className="text-sm text-[#2C1810]/60 mt-2">Design a message and share it instantly.</p>
        </div>

        <div className="space-y-4">
          <input
            value={invitation.title}
            onChange={e => setInvitation({ ...invitation, title: e.target.value })}
            className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
            placeholder="Event Title (e.g. Planning Meeting)"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={invitation.date}
              onChange={e => setInvitation({ ...invitation, date: e.target.value })}
              className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
            />
            <input
              type="time"
              value={invitation.time}
              onChange={e => setInvitation({ ...invitation, time: e.target.value })}
              className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
            />
          </div>
          <textarea
            value={invitation.message}
            onChange={e => setInvitation({ ...invitation, message: e.target.value })}
            className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20 min-h-[100px]"
            placeholder="Additional details..."
          />

          <div className="bg-green-50 rounded-xl p-4 border border-green-100 mt-6">
            <div className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-2">Preview</div>
            <pre className="whitespace-pre-wrap text-sm text-[#2C1810]/80 font-sans">{generateMsg()}</pre>
          </div>

          <button
            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(generateMsg())}`, '_blank')}
            className="w-full py-4 bg-green-500 text-white rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 mt-4"
          >
            <Share2 size={16} /> Share via WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Main Layout ---

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("members");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/login");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col md:flex-row font-sans overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-30 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/images/logo.png" className="w-10 h-10 object-contain drop-shadow-md" alt="Logo" />
          <div>
            <span className="font-display font-black text-sm tracking-tight text-[#2C1810] block leading-none">SHIV GARJANA</span>
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#D95D1E]">Admin</span>
          </div>
        </div>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 text-[#2C1810]/70 hover:bg-[#F5F5F0] rounded-lg transition-colors border border-gray-100"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
                fixed inset-y-0 left-0 w-72 bg-white border-r border-gray-100 flex flex-col z-50 transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
                md:relative md:translate-x-0
                ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
        <div className="p-8 border-b border-gray-50 bg-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" className="w-12 h-12 object-contain drop-shadow-lg" alt="Logo" />
            <div>
              <span className="font-display font-black text-lg tracking-tight text-[#2C1810] block leading-none">SHIV GARJANA</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#D95D1E]">Admin</span>
            </div>
          </div>
          <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-[#2C1810]/60 hover:text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <SidebarItem id="members" label="Members & Vargani" icon={Users} active={activeTab === "members"} onClick={handleTabChange} />
          <SidebarItem id="tasks" label="Tasks" icon={Shield} active={activeTab === "tasks"} onClick={handleTabChange} />
          <SidebarItem id="expenses" label="Expenses" icon={Wallet} active={activeTab === "expenses"} onClick={handleTabChange} />
          <SidebarItem id="invitations" label="Invitations" icon={Send} active={activeTab === "invitations"} onClick={handleTabChange} />
        </nav>

        <div className="p-4 border-t border-gray-50 bg-[#FDFBF7]">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-bold text-xs uppercase tracking-wider group bg-white border border-gray-200 shadow-sm hover:border-red-200">
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden flex flex-col h-[calc(100vh-65px)] md:h-screen">
        <div className="flex-1 overflow-y-auto p-4 md:p-12 scrollbar-hide">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-20"
          >
            {activeTab === "members" && <MembersTab />}
            {activeTab === "tasks" && <TasksTab />}
            {activeTab === "expenses" && <ExpensesTab />}
            {activeTab === "invitations" && <InvitationsTab />}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
