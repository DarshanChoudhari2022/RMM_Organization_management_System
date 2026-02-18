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
  X,
  FileText,
  Download,
  ClipboardList,
  Activity
} from "lucide-react";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useMembers, useTasks, useExpenses, useInvitations, useTaskResponses, useSuppliers, useLogs } from "@/lib/admin-api";
import { supabase } from "@/lib/supabase";
import { Task, Expense, Invitation, Member, TaskCategory, Supplier, SystemLog } from "@/types/admin";
import { toast } from "sonner";

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

const MembersTab = ({ year }: { year: number }) => {
  const { data: members, addMember, deleteMember, updateVargani } = useMembers();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", phone: "", role: "Member" });
  const [editingVargani, setEditingVargani] = useState<{ id: string, amount: number } | null>(null);

  const { data: expenses } = useExpenses();

  const stats = useMemo(() => {
    const total = members?.length || 0;
    const yearPayments = members?.map(m => m.varganiHistory.find(v => v.year === year)).filter(Boolean);
    const paid = yearPayments?.filter(v => v?.paid).length || 0;
    const collected = yearPayments?.reduce((sum, v) => sum + (v?.paid ? (v?.amount || 0) : 0), 0) || 0;
    const pending = yearPayments?.reduce((sum, v) => sum + (!v?.paid ? (v?.amount || 0) : 0), 0) || 0;

    // Calculate Mandal Expenses for the year
    const mandalExpenses = (expenses || [])
      .filter(e => e.year === year && e.paidBy === 'Mandal')
      .reduce((sum, e) => sum + e.amount, 0);

    return { total, paid, collected, pending, mandalExpenses };
  }, [members, year, expenses]);

  const handleAdd = () => {
    if (!newMember.name || !newMember.phone) return;
    addMember.mutate({ ...newMember, joinedYear: year, role: newMember.role });
    setNewMember({ name: "", phone: "", role: "Member" });
    setIsAddOpen(false);
  };

  const saveVarganiAmount = (id: string, amount: number) => {
    const member = members?.find(m => m.id === id);
    const vargani = member?.varganiHistory.find(v => v.year === year);
    const isPaid = vargani?.paid || false;
    updateVargani.mutate({ id, paid: isPaid, year: year, amount });
    setEditingVargani(null);
  };

  return (
    <div className="space-y-8">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-display font-black text-[#2C1810]">Member Directory ({year})</h2>
        <button
          onClick={() => setIsAddOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#D95D1E] text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#B94A15] transition-all shadow-lg shadow-[#D95D1E]/20"
        >
          <Plus size={16} /> Add Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 md:p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1 md:mb-2">Total Members</div>
          <div className="text-xl md:text-3xl font-black text-[#2C1810]">{stats.total}</div>
        </div>
        <div className="p-4 md:p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1 md:mb-2">Vargani Collected</div>
          <div className="text-xl md:text-3xl font-black text-green-600">₹{stats.collected.toLocaleString()}</div>
          <div className="text-[10px] text-[#2C1810]/60 mt-1 hidden md:block">{stats.paid} Members Paid</div>
        </div>
        <div className="p-4 md:p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
          <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1 md:mb-2">Pending Vargani</div>
          <div className="text-xl md:text-3xl font-black text-red-500">₹{stats.pending.toLocaleString()}</div>
          <div className="text-[10px] text-[#2C1810]/60 mt-1 hidden md:block">{stats.total - stats.paid} Pending</div>
        </div>
        <div className="p-4 md:p-6 bg-white border border-gray-100 rounded-2xl shadow-sm bg-orange-50/30 border-orange-100">
          <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-[#D95D1E] mb-1 md:mb-2">Mandal Expenses</div>
          <div className="text-xl md:text-3xl font-black text-[#D95D1E]">₹{stats.mandalExpenses.toLocaleString()}</div>
          <div className="text-[10px] text-[#D95D1E]/60 mt-1 hidden md:block">Paid by Mandal</div>
        </div>
      </div>

      {/* List - Scrollable Table for all screens */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-[#F5F5F0] text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60">
              <div className="col-span-4 lowercase">Name & Role</div>
              <div className="col-span-3">Contact</div>
              <div className="col-span-3">Vargani ({year})</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
          </div>
        </div>
        {members?.length === 0 ? (
          <div className="p-10 text-center text-[#2C1810]/60 text-sm">No members found. Add one to get started.</div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {members?.map((member) => {
                const vargani = member.varganiHistory.find(v => v.year === year);
                const isPaid = vargani?.paid;
                const amount = vargani?.amount || 1500;
                const isEditing = editingVargani?.id === member.id;

                return (
                  <div key={member.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-50 items-center hover:bg-[#FDFBF7] transition-colors">
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
                            onClick={() => updateVargani.mutate({ id: member.id, paid: !isPaid, year: year, amount })}
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
                          const msg = `नमस्कार ${member.name}, कृपया ${year} ची वर्गणी (₹${amount}) जमा करावी ही विनंती. - शिवगर्जना मंडळ`;
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
              })}
            </div>
          </div>
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
  const { data: responses, isLoading, addResponse, deleteResponse } = useTaskResponses(taskId);
  const { data: members } = useMembers();
  const [manualName, setManualName] = useState("");
  const [manualStatus, setManualStatus] = useState<'approved' | 'declined'>('approved');
  const [manualComment, setManualComment] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  if (isLoading) return <div className="p-4 text-xs text-center text-gray-400">Loading attendance...</div>;

  const approved = responses?.filter(r => r.status === 'approved') || [];
  const declined = responses?.filter(r => r.status === 'declined') || [];

  const handleManualAdd = () => {
    if (!manualName) return;
    addResponse.mutate({ taskId, memberName: manualName, status: manualStatus, comment: manualComment });
    setManualName("");
    setManualComment("");
    setIsAdding(false);
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-6">
      {/* Available Section */}
      <div>
        <div className="flex items-center justify-between mb-3 border-b border-green-100 pb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Available ({approved.length})</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {approved.length === 0 ? (
            <span className="text-[10px] text-gray-400">No one marked available yet.</span>
          ) : (
            approved.map(r => (
              <div key={r.id} className="group relative">
                <div className="px-2 py-1 bg-green-100 text-green-700 rounded text-[10px] font-bold flex items-center gap-1">
                  {r.memberName}
                  <button onClick={() => deleteResponse.mutate(r.id)} className="opacity-0 group-hover:opacity-100 text-green-800 hover:text-red-500 transition-opacity">
                    <X size={10} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Not Available Section with Reason */}
      <div>
        <div className="flex items-center justify-between mb-3 border-b border-red-100 pb-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Not Available ({declined.length})</span>
        </div>
        <div className="space-y-2">
          {declined.length === 0 ? (
            <span className="text-[10px] text-gray-400">No absences recorded.</span>
          ) : (
            declined.map(r => (
              <div key={r.id} className="flex items-center justify-between gap-4 bg-red-50 p-2 rounded-lg border border-red-100 group">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-red-700 whitespace-nowrap">{r.memberName}</span>
                  <span className="text-[9px] text-red-500/80 italic line-clamp-1">{r.comment || "No reason provided"}</span>
                </div>
                <button onClick={() => deleteResponse.mutate(r.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-opacity">
                  <X size={12} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Admin Manual Entry */}
      <div className="pt-4 border-t border-gray-200">
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="text-[9px] font-black uppercase tracking-widest text-[#D95D1E] hover:underline flex items-center gap-1"
          >
            <Plus size={10} /> Add Attendance Manually
          </button>
        ) : (
          <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-3">
            <div className="space-y-2">
              <select
                value={manualName}
                onChange={e => setManualName(e.target.value)}
                className="w-full text-[10px] font-bold p-2 bg-gray-50 border border-gray-100 rounded outline-none"
              >
                <option value="">Select Member...</option>
                {members?.filter(m => !responses?.some(r => r.memberName === m.name)).map(m => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
                <option value="CUSTOM">-- Type Name --</option>
              </select>
              {manualName === "CUSTOM" && (
                <input
                  type="text"
                  placeholder="Enter Name"
                  className="w-full text-[10px] font-bold p-2 bg-gray-50 border border-gray-100 rounded outline-none"
                  onChange={e => setManualName(e.target.value)}
                />
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setManualStatus('approved')}
                className={`flex-1 py-1 px-2 text-[9px] font-bold rounded ${manualStatus === 'approved' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}
              >
                Present
              </button>
              <button
                onClick={() => setManualStatus('declined')}
                className={`flex-1 py-1 px-2 text-[9px] font-bold rounded ${manualStatus === 'declined' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500'}`}
              >
                Absent
              </button>
            </div>
            {manualStatus === 'declined' && (
              <input
                type="text"
                placeholder="Reason (optional)"
                className="w-full text-[10px] p-2 bg-gray-50 border border-gray-100 rounded outline-none"
                value={manualComment}
                onChange={e => setManualComment(e.target.value)}
              />
            )}
            <div className="flex gap-2 pt-1">
              <button onClick={handleManualAdd} className="flex-1 bg-[#D95D1E] text-white py-1 text-[9px] font-black rounded uppercase">Save</button>
              <button onClick={() => setIsAdding(false)} className="flex-1 bg-gray-100 text-gray-500 py-1 text-[9px] font-black rounded uppercase">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TasksTab = ({ year }: { year: number }) => {
  const { data: tasks, addTask, updateTask, deleteTask } = useTasks();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({ title: "", description: "", date: "", time: "", location: "Kedari Nagar Chowk" });
  const [showAttendees, setShowAttendees] = useState<string | null>(null);

  const filteredTasks = tasks?.filter(t => t.year === year) || [];

  const handleSave = () => {
    if (editingTask) {
      if (!editingTask.title || !editingTask.date) return;
      updateTask.mutate({ ...editingTask, year });
      setEditingTask(null);
      setIsAddOpen(false);
    } else {
      if (!newTask.title || !newTask.date) return;
      addTask.mutate({ ...(newTask as any), year });
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-display font-black text-[#2C1810]">Task Manager ({year})</h2>
        <button
          onClick={() => setIsAddOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#D95D1E] text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#D95D1E]/90 transition-all shadow-lg shadow-[#D95D1E]/20"
        >
          <Plus size={16} /> Assign Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-[#F5F5F0] rounded-3xl border border-dashed border-gray-200">
            <div className="text-[#2C1810]/60 font-medium">No tasks scheduled yet.</div>
            <button onClick={() => setIsAddOpen(true)} className="mt-4 text-[#D95D1E] font-bold text-sm hover:underline">Create your first task</button>
          </div>
        ) : (
          filteredTasks.map(task => (
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

const ExpensesTab = ({ year }: { year: number }) => {
  const { data: expenses, addExpense, updateRefundStatus, deleteExpense, updateExpense } = useExpenses();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingEx, setEditingEx] = useState<Expense | null>(null);
  const [newEx, setNewEx] = useState({ description: "", amount: "", category: "miscellaneous", date: new Date().toISOString().split("T")[0], paidBy: "Mandal", vendorName: "" });

  // Filter by year
  const filteredExpenses = useMemo(() => {
    return (expenses || [])
      .filter(e => e.year === year)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, year]);

  const totalSpent = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  const handleSave = async () => {
    try {
      if (editingEx) {
        if (!editingEx.description || !editingEx.amount) {
          toast.error("कृपया वर्णन आणि रक्कम भरा");
          return;
        }
        await updateExpense.mutateAsync(editingEx);
        toast.success("खर्च अपडेट झाला!");
        setEditingEx(null);
        setIsAddOpen(false);
      } else {
        if (!newEx.description || !newEx.amount) {
          toast.error("कृपया वर्णन आणि रक्कम भरा");
          return;
        }
        await addExpense.mutateAsync({
          description: newEx.description,
          amount: parseFloat(newEx.amount),
          category: newEx.category,
          date: newEx.date,
          status: "approved",
          year: year,
          paidBy: newEx.paidBy,
          isRefunded: false,
          vendorName: newEx.vendorName || "General"
        });
        toast.success("नवीन खर्च जोडला गेला!");
        setNewEx({ description: "", amount: "", category: "miscellaneous", date: new Date().toISOString().split("T")[0], paidBy: "Mandal", vendorName: "" });
        setIsAddOpen(false);
      }
    } catch (error: any) {
      toast.error(`त्रुटी: ${error.message || "खर्च जतन करताना अडचण आली"}`);
      console.error("Expense Save Error:", error);
    }
  };

  const openEdit = (ex: Expense) => {
    setEditingEx(ex);
    setIsAddOpen(true);
  };

  const toggleRefund = (id: string, currentStatus: boolean) => {
    updateRefundStatus.mutate({ id, isRefunded: !currentStatus });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-display font-black text-[#2C1810]">Expenses ({year})</h2>
          <p className="text-xs text-[#2C1810]/60 font-bold uppercase tracking-wider ml-4 border-l pl-4 border-gray-100 hidden sm:block">
            Total for {year}: <span className="text-[#D95D1E] text-lg ml-1">₹{totalSpent.toLocaleString()}</span>
          </p>
        </div>
        <button
          onClick={() => {
            setEditingEx(null);
            setIsAddOpen(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#D95D1E] text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#D95D1E]/90 transition-all shadow-lg shadow-[#D95D1E]/20"
        >
          <Plus size={16} /> Add Expense
        </button>
      </div>

      {/* List - Desktop View */}
      <div className="hidden md:block bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-[#F5F5F0] text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60">
              <div className="col-span-2">Description</div>
              <div className="col-span-2">Vendor</div>
              <div className="col-span-1">Paid By</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-1">Date</div>
              <div className="col-span-1 text-right">Amount</div>
              <div className="col-span-2 text-center">Refund?</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
          </div>
        </div>
        {filteredExpenses.length === 0 ? (
          <div className="p-10 text-center text-[#2C1810]/60 text-sm">No expenses recorded for {year}.</div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {filteredExpenses.map((ex) => (
                <div key={ex.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-50 items-center hover:bg-[#FDFBF7] transition-colors">
                  <div className="col-span-2">
                    <div className="font-bold text-[#2C1810] line-clamp-2" title={ex.description}>{ex.description}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs font-bold text-[#2C1810]/60">{ex.vendorName || "General"}</div>
                  </div>
                  <div className="col-span-1">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${ex.paidBy === 'Mandal' ? 'bg-[#D95D1E]/10 text-[#D95D1E]' : 'bg-purple-100 text-purple-700'}`}>
                      {ex.paidBy}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="bg-gray-100 text-[#2C1810]/80 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{ex.category}</span>
                  </div>
                  <div className="col-span-1 text-[11px] text-[#2C1810]/70 font-mono">{ex.date}</div>
                  <div className="col-span-1 text-right">
                    <div className="font-black text-[#D95D1E]">₹{ex.amount.toLocaleString()}</div>
                  </div>
                  <div className="col-span-2 text-center">
                    {ex.paidBy !== 'Mandal' ? (
                      <button
                        onClick={() => toggleRefund(ex.id, ex.isRefunded)}
                        className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border transition-all ${ex.isRefunded
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100"}`}
                      >
                        {ex.isRefunded ? "Paid ✅" : "Pending ⚠️"}
                      </button>
                    ) : (
                      <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">-</span>
                    )}
                  </div>
                  <div className="col-span-1 flex justify-end gap-2">
                    <button
                      onClick={() => openEdit(ex)}
                      className="p-2 text-[#D95D1E]/60 hover:text-[#D95D1E] hover:bg-orange-50 rounded-lg transition-colors border border-transparent hover:border-orange-100"
                    >
                      <div className="w-3.5 h-3.5 border border-current rounded-sm flex items-center justify-center text-[8px] font-sans">✎</div>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure?")) deleteExpense.mutate(ex.id);
                      }}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* List - Mobile View */}
      <div className="md:hidden space-y-4">
        {filteredExpenses.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-2xl border border-gray-100 text-[#2C1810]/60 text-sm">No expenses found for {year}.</div>
        ) : (
          filteredExpenses.map((ex) => (
            <div key={ex.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-bold text-[#2C1810] text-lg leading-tight mb-1">{ex.description}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-[#2C1810]/40">Vendor: {ex.vendorName || "General"}</div>
                </div>
                <div className="text-right">
                  <div className="font-black text-[#D95D1E] text-xl">₹{ex.amount.toLocaleString()}</div>
                  <div className="text-[10px] font-mono text-[#2C1810]/40">{ex.date}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-[#F5F5F0] text-[#2C1810]/70`}>
                  {ex.category}
                </span>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded ${ex.paidBy === 'Mandal' ? 'bg-[#D95D1E]/10 text-[#D95D1E]' : 'bg-purple-100 text-purple-700'}`}>
                  Paid By: {ex.paidBy}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex gap-2">
                  <button onClick={() => openEdit(ex)} className="p-2 bg-orange-50 text-[#D95D1E] rounded-xl"><div className="w-4 h-4 border border-current rounded-sm flex items-center justify-center text-[10px] font-sans">✎</div></button>
                  <button onClick={() => { if (window.confirm("Are you sure?")) deleteExpense.mutate(ex.id); }} className="p-2 bg-red-50 text-red-400 rounded-xl"><Trash2 size={18} /></button>
                </div>

                {ex.paidBy !== 'Mandal' && (
                  <button
                    onClick={() => toggleRefund(ex.id, ex.isRefunded)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${ex.isRefunded
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-yellow-50 text-yellow-600 border-yellow-200"}`}
                  >
                    Refund: {ex.isRefunded ? "Paid ✅" : "Pending ⚠️"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-sm p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <h3 className="text-xl font-display font-black text-[#2C1810] mb-6">{editingEx ? "Edit Expense" : "Log Expense"}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Description</label>
                  <input
                    value={editingEx ? editingEx.description : newEx.description}
                    onChange={e => editingEx ? setEditingEx({ ...editingEx, description: e.target.value }) : setNewEx({ ...newEx, description: e.target.value })}
                    className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                    placeholder="Item name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Vendor Name</label>
                  <input
                    value={editingEx ? editingEx.vendorName : newEx.vendorName}
                    onChange={e => editingEx ? setEditingEx({ ...editingEx, vendorName: e.target.value }) : setNewEx({ ...newEx, vendorName: e.target.value })}
                    className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                    placeholder="Vendor/Shop name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={editingEx ? editingEx.amount : newEx.amount}
                    onChange={e => editingEx ? setEditingEx({ ...editingEx, amount: parseFloat(e.target.value) || 0 }) : setNewEx({ ...newEx, amount: e.target.value })}
                    className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Paid By</label>
                  <input
                    value={editingEx ? editingEx.paidBy : newEx.paidBy}
                    onChange={e => editingEx ? setEditingEx({ ...editingEx, paidBy: e.target.value }) : setNewEx({ ...newEx, paidBy: e.target.value })}
                    className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                    placeholder="e.g. Mandal, Yash, Rahul"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Date</label>
                  <input
                    type="date"
                    value={editingEx ? editingEx.date : newEx.date}
                    onChange={e => editingEx ? setEditingEx({ ...editingEx, date: e.target.value }) : setNewEx({ ...newEx, date: e.target.value })}
                    className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Category</label>
                  <select
                    value={editingEx ? editingEx.category : newEx.category}
                    onChange={e => editingEx ? setEditingEx({ ...editingEx, category: e.target.value }) : setNewEx({ ...newEx, category: e.target.value })}
                    className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                  >
                    <option value="decoration">Decoration</option>
                    <option value="sound_dj">Sound/DJ</option>
                    <option value="food_prasad">Food/Prasad</option>
                    <option value="transportation">Transport</option>
                    <option value="stage_construction">Stage</option>
                    <option value="printing">Printing/Banner</option>
                    <option value="flag_hoisting">Flag Hoisting</option>
                    <option value="murti">Murti/Installation</option>
                    <option value="guest_honorarium">Guest Honorarium</option>
                    <option value="miscellaneous">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setIsAddOpen(false)} className="flex-1 py-3 text-[#2C1810]/70 font-bold text-sm bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-3 text-white font-bold text-sm bg-[#D95D1E] rounded-xl hover:bg-[#D95D1E]/90">{editingEx ? "Update" : "Add"}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const SuppliersTab = () => {
  const { data: suppliers, addSupplier, deleteSupplier, updateSupplier } = useSuppliers();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSup, setEditingSup] = useState<Supplier | null>(null);
  const [newSup, setNewSup] = useState({
    name: "", category: "Other" as Supplier['category'], contact: "", address: "", notes: "", total_amount: 0, paid_amount: 0, terms: "", supplier_comment: ""
  });

  const generateConfirmationLink = (sup: Supplier) => {
    return `${window.location.origin}/confirm-supplier/${sup.id}`;
  };

  const shareConfirmation = (sup: Supplier) => {
    const link = generateConfirmationLink(sup);
    const msg = `🚩 *शिवगर्जना मंडळ - पुरवठादार करार*\n\nनमस्कार ${sup.name},\n\nआपल्याशी ठरल्याप्रमाणे खालील तपशील तपासा:\n💰 एकूण रक्कम: ₹${sup.total_amount || 0}\n💵 जमा रक्कम: ₹${sup.paid_amount || 0}\n📝 अटी: ${sup.terms || 'नेहमीप्रमाणे'}\n\nकृपया खालील लिंकवर क्लिक करून आपली संमती कळवा:\n${link}`;
    window.open(`https://wa.me/91${sup.contact}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleSave = async () => {
    try {
      if (editingSup) {
        if (!editingSup.name || !editingSup.contact) {
          toast.error("नाव आणि संपर्क आवश्यक आहे");
          return;
        }
        await updateSupplier.mutateAsync(editingSup);
        toast.success("पुरवठादार यशस्वीरित्या अपडेट झाला");
        setEditingSup(null);
        setIsAddOpen(false);
      } else {
        if (!newSup.name || !newSup.contact) {
          toast.error("नाव आणि संपर्क आवश्यक आहे");
          return;
        }
        await addSupplier.mutateAsync(newSup);
        toast.success("नवीन पुरवठादार जोडला गेला");
        setNewSup({ name: "", category: "Other", contact: "", address: "", notes: "", total_amount: 0, paid_amount: 0, terms: "", supplier_comment: "" });
        setIsAddOpen(false);
      }
    } catch (error: any) {
      toast.error(`त्रुटी: ${error.message || "काहीतरी चूक झाली"}`);
      console.error("Supplier Save Error:", error);
    }
  };

  const openEdit = (sup: Supplier) => {
    setEditingSup(sup);
    setIsAddOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-display font-black text-[#2C1810]">Supplier Contacts</h2>
        <button
          onClick={() => {
            setEditingSup(null);
            setIsAddOpen(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#D95D1E] text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#D95D1E]/90 transition-all shadow-lg shadow-[#D95D1E]/20"
        >
          <Plus size={16} /> Add Supplier
        </button>
      </div>

      {/* List - Desktop View */}
      <div className="hidden md:block bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-[#F5F5F0] text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60">
              <div className="col-span-2">Supplier</div>
              <div className="col-span-2">Contact</div>
              <div className="col-span-2">Payment Status</div>
              <div className="col-span-1">Confirmed?</div>
              <div className="col-span-3">Terms & Notes</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
          </div>
        </div>
        {suppliers?.length === 0 ? (
          <div className="p-10 text-center text-[#2C1810]/60 text-sm">No suppliers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              {suppliers?.map((sup) => {
                const progress = (sup.paid_amount || 0) / (sup.total_amount || 1) * 100;
                return (
                  <div key={sup.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-50 items-center hover:bg-[#FDFBF7] transition-colors">
                    <div className="col-span-2">
                      <div className="font-bold text-[#2C1810]">{sup.name}</div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#D95D1E]/60">{sup.category}</span>
                    </div>
                    <div className="col-span-2">
                      <div className="text-sm text-[#2C1810]/80 font-mono mb-1">{sup.contact}</div>
                      <a href={`tel:${sup.contact}`} className="text-[#D95D1E] inline-flex items-center gap-1 text-[10px] font-bold"><Phone size={10} /> Call</a>
                    </div>
                    <div className="col-span-2">
                      <div className="flex justify-between text-[10px] font-black mb-1">
                        <span className="text-[#D95D1E]">₹{sup.paid_amount?.toLocaleString() || 0}</span>
                        <span className="text-gray-400">/ ₹{sup.total_amount?.toLocaleString() || 0}</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#D95D1E]" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                      </div>
                    </div>
                    <div className="col-span-1">
                      {sup.is_confirmed ? (
                        <div className="flex flex-col items-center">
                          <span className="text-green-600 font-bold text-[10px] flex items-center gap-1"><CheckCircle2 size={12} /> Yes</span>
                          <span className="text-[8px] text-gray-400 font-mono">{sup.confirmed_at ? new Date(sup.confirmed_at).toLocaleDateString('mr-IN') : ''}</span>
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure you want to revert this confirmation?")) {
                                updateSupplier.mutate({ ...sup, is_confirmed: false, confirmed_at: null as any });
                              }
                            }}
                            className="text-[8px] text-red-400 hover:text-red-600 font-black uppercase tracking-tighter mt-1 hover:underline"
                          >
                            Revert
                          </button>
                        </div>
                      ) : (
                        <span className="text-yellow-600 font-bold text-[10px] flex items-center gap-1"><Clock size={12} /> Pending</span>
                      )}
                    </div>
                    <div className="col-span-3 text-xs text-[#2C1810]/60 space-y-1">
                      {sup.terms && <div className="italic line-clamp-1">"Terms: {sup.terms}"</div>}
                      {sup.supplier_comment && <div className="text-[#D95D1E] font-medium line-clamp-1">"Comment: {sup.supplier_comment}"</div>}
                      {sup.notes && <div className="line-clamp-1">{sup.notes}</div>}
                      {sup.address && <div className="text-[10px] flex items-center gap-1 text-gray-400"><MapPin size={10} /> {sup.address}</div>}
                    </div>
                    <div className="col-span-2 flex justify-end gap-2">
                      <button
                        onClick={() => shareConfirmation(sup)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Share Confirmation Link"
                      >
                        <Share2 size={16} />
                      </button>
                      <button
                        onClick={() => openEdit(sup)}
                        className="p-2 text-[#D95D1E]/60 hover:text-[#D95D1E] hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        <div className="w-4 h-4 border border-current rounded-sm flex items-center justify-center text-[10px] font-sans">✎</div>
                      </button>
                      <button
                        onClick={() => { if (window.confirm("Are you sure?")) deleteSupplier.mutate(sup.id); }}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* List - Mobile View */}
      <div className="md:hidden space-y-4">
        {suppliers?.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-2xl border border-gray-100 text-[#2C1810]/60 text-sm">No suppliers found.</div>
        ) : (
          suppliers?.map((sup) => {
            const progress = (sup.paid_amount || 0) / (sup.total_amount || 1) * 100;
            return (
              <div key={sup.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-[#2C1810] text-lg leading-tight mb-1">{sup.name}</div>
                    <div className="flex items-center gap-2">
                      <span className="bg-orange-50 text-[#D95D1E] px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">{sup.category}</span>
                      {sup.is_confirmed ? (
                        <div className="flex items-center gap-2">
                          <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest flex items-center gap-1"><CheckCircle2 size={10} /> Confirmed</span>
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure you want to revert this confirmation?")) {
                                updateSupplier.mutate({ ...sup, is_confirmed: false, confirmed_at: null as any });
                              }
                            }}
                            className="text-[9px] text-red-500 hover:text-red-700 font-bold uppercase underline"
                          >
                            Revert
                          </button>
                        </div>
                      ) : (
                        <span className="bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest flex items-center gap-1"><Clock size={10} /> Pending</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => shareConfirmation(sup)} className="p-2 bg-green-50 text-green-600 rounded-xl"><Share2 size={18} /></button>
                    <button onClick={() => openEdit(sup)} className="p-2 bg-orange-50 text-[#D95D1E] rounded-xl"><div className="w-4 h-4 border border-current rounded-sm flex items-center justify-center text-[10px] font-sans">✎</div></button>
                    <button onClick={() => { if (window.confirm("Are you sure?")) deleteSupplier.mutate(sup.id); }} className="p-2 bg-red-50 text-red-400 rounded-xl"><Trash2 size={18} /></button>
                  </div>
                </div>

                <div className="space-y-3 py-2">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <div className="flex justify-between text-[11px] font-black mb-1">
                      <span className="text-[#2C1810]/60 uppercase tracking-widest">Payment Status</span>
                      <span className="text-[#D95D1E]">₹{sup.paid_amount || 0} / ₹{sup.total_amount || 0}</span>
                    </div>
                    <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-gray-100">
                      <div className="h-full bg-[#D95D1E]" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                    </div>
                  </div>

                  <a href={`tel:${sup.contact}`} className="flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-xl font-mono text-sm font-bold">
                    <Phone size={16} />
                    {sup.contact}
                    <span className="ml-auto text-[9px] font-black uppercase tracking-[0.1em] bg-green-200/50 px-2 py-1 rounded">Call Now</span>
                  </a>
                </div>

                {(sup.address || sup.notes || sup.terms) && (
                  <div className="bg-[#FDFBF7] p-4 rounded-xl space-y-3">
                    {sup.terms && (
                      <div className="text-xs text-[#2C1810]/70">
                        <span className="font-black text-[9px] uppercase tracking-widest block mb-1 text-[#D95D1E]">Agreed Terms:</span>
                        "{sup.terms}"
                      </div>
                    )}
                    {sup.supplier_comment && (
                      <div className="text-xs text-[#2C1810]/70">
                        <span className="font-black text-[9px] uppercase tracking-widest block mb-1 text-[#D95D1E]">Supplier Comment:</span>
                        "{sup.supplier_comment}"
                      </div>
                    )}
                    {sup.address && (
                      <div className="flex gap-2 items-start text-xs text-[#2C1810]/70">
                        <MapPin size={14} className="text-[#D95D1E] shrink-0 mt-0.5" />
                        {sup.address}
                      </div>
                    )}
                    {sup.notes && (
                      <div className="text-xs text-[#2C1810]/60 italic border-l-2 border-[#D95D1E]/20 pl-3">
                        "{sup.notes}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <AnimatePresence>
        {isAddOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <h3 className="text-xl font-display font-black text-[#2C1810] mb-6">{editingSup ? "Edit Supplier" : "Add Supplier"}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Name</label>
                  <input
                    value={editingSup ? editingSup.name : newSup.name}
                    onChange={e => editingSup ? setEditingSup({ ...editingSup, name: e.target.value }) : setNewSup({ ...newSup, name: e.target.value })}
                    className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                    placeholder="Supplier Name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Category</label>
                  <select
                    value={editingSup ? editingSup.category : newSup.category}
                    onChange={e => editingSup ? setEditingSup({ ...editingSup, category: e.target.value as any }) : setNewSup({ ...newSup, category: e.target.value as any })}
                    className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                  >
                    <option value="Sound">Sound</option>
                    <option value="Decoration">Decoration</option>
                    <option value="Stage">Stage</option>
                    <option value="Banner">Banner</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Contact No</label>
                  <input
                    value={editingSup ? editingSup.contact : newSup.contact}
                    onChange={e => editingSup ? setEditingSup({ ...editingSup, contact: e.target.value }) : setNewSup({ ...newSup, contact: e.target.value })}
                    className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                    placeholder="Phone Number"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Total Amount (₹)</label>
                    <input
                      type="number"
                      value={editingSup ? editingSup.total_amount : newSup.total_amount}
                      onChange={e => editingSup ? setEditingSup({ ...editingSup, total_amount: parseFloat(e.target.value) || 0 }) : setNewSup({ ...newSup, total_amount: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                      placeholder="Agreed Amount"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Paid Amount (₹)</label>
                    <input
                      type="number"
                      value={editingSup ? editingSup.paid_amount : newSup.paid_amount}
                      onChange={e => editingSup ? setEditingSup({ ...editingSup, paid_amount: parseFloat(e.target.value) || 0 }) : setNewSup({ ...newSup, paid_amount: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                      placeholder="Amount Paid"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Terms Agreed</label>
                  <input
                    value={editingSup ? editingSup.terms : newSup.terms}
                    onChange={e => editingSup ? setEditingSup({ ...editingSup, terms: e.target.value }) : setNewSup({ ...newSup, terms: e.target.value })}
                    className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                    placeholder="e.g. 50% advance, full after event"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Shop Address</label>
                  <input
                    value={editingSup ? editingSup.address : newSup.address}
                    onChange={e => editingSup ? setEditingSup({ ...editingSup, address: e.target.value }) : setNewSup({ ...newSup, address: e.target.value })}
                    className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                    placeholder="Shop/Office Address"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Internal Notes</label>
                  <textarea
                    value={editingSup ? editingSup.notes : newSup.notes}
                    onChange={e => editingSup ? setEditingSup({ ...editingSup, notes: e.target.value }) : setNewSup({ ...newSup, notes: e.target.value })}
                    className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20 min-h-[60px]"
                    placeholder="Additional internal details..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Supplier Comment</label>
                  <textarea
                    value={editingSup ? editingSup.supplier_comment : newSup.supplier_comment}
                    onChange={e => editingSup ? setEditingSup({ ...editingSup, supplier_comment: e.target.value }) : setNewSup({ ...newSup, supplier_comment: e.target.value })}
                    className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20 min-h-[60px]"
                    placeholder="Comment from supplier..."
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setIsAddOpen(false)} className="flex-1 py-3 text-[#2C1810]/70 font-bold text-sm bg-gray-100 rounded-xl hover:bg-gray-200">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-3 text-white font-bold text-sm bg-[#D95D1E] rounded-xl hover:bg-[#D95D1E]/90">{editingSup ? "Update" : "Add"}</button>
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

const LetterheadTab = () => {
  const [activeMode, setActiveMode] = useState<'edit' | 'preview'>('edit');
  const [data, setData] = useState({
    dateLabel: "दिनांक :",
    date: new Date().toLocaleDateString('mr-IN'),
    toLabel: "प्रति,",
    toName: "मा. पोलीस निरीक्षक साहेब, वानवडी",
    toDept: "पोलीस स्टेशन, वानवडी विभाग, पुणे शहर.",
    applicantLabel: "अर्जदार:",
    applicant: "हांडे योगेश राजेंद्र",
    address: "सर्व्हे नं. ६३/४ पोस्टमन चाळ केदारी नगर वानवडी पुणे ४११०४०",
    festival: "श्री. छत्रपती शिवाजी महाराज जयंती",
    festDate: "१९ फेब्रुवारी २०२६",
    phoneLabel: "फोन:",
    phone: "८२३७१८९९७७",
    subjectLabel: "विषय :-",
    subject: "ध्वनीक्षेपक परवाना मिळण्याबाबत.",
    content: "आम्ही श्रीमंत शिवगर्जना प्रतिष्ठान केदारी नगर, वानवडीच्या वतीने सालाबादप्रमाणे आगामी उत्सवासाठी ध्वनीक्षेपक परवाना मिळावा ही नम्र विनंती. आमचे मंडळ शासनाने घालून दिलेल्या सर्व नियमांचे पालन करेल याची आम्ही ग्वाही देतो.",
    closingLabel: "कळावे,",
    signLabel: "आपला विश्वासू",
    footerText: "सर्व्हे नं. ६३/४ पोस्टमन चाळ केदारी नगर वानवडी पुणे ४११०४०",
    establishmentLabel: "स्थापना :- २०१५"
  });

  const downloadPDF = async () => {
    const element = document.getElementById('letter-preview');
    if (!element) return;

    const toastId = toast.loading("PDF तयार होत आहे, कृपया थांबा...");

    // Store switch back if needed
    const wasEdit = activeMode === 'edit';
    if (wasEdit) {
      setActiveMode('preview');
      // Give more time for the layout to settle on mobile
      await new Promise(r => setTimeout(r, 500));
    }

    try {
      // Create a canvas with specific dimensions for A4
      // 210mm x 297mm at 2x scale = 1587.4px x 2245.1px
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        allowTaint: true,
        width: 793.7, // exactly 210mm at 96dpi
        height: 1122.5, // exactly 297mm at 96dpi
        windowWidth: 793.7,
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('letter-preview');
          if (el) {
            el.style.transform = 'none';
            el.style.position = 'relative';
            el.style.width = '210mm';
            el.style.height = '297mm';
            el.style.minHeight = '297mm';
            el.style.margin = '0';
            el.style.padding = '0';

            // Remove parent scaling that affects capture
            let parent = el.parentElement;
            while (parent) {
              parent.style.transform = 'none';
              parent.style.scale = 'none';
              parent.style.padding = '0';
              parent.style.margin = '0';
              parent.style.width = 'auto';
              parent.style.height = 'auto';
              parent.style.maxWidth = 'none';
              parent = parent.parentElement;
            }
          }
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Explicitly specify size to avoid zooming/distortion
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Permission_Letter_${data.festival.replace(/\s+/g, '_')}.pdf`);
      toast.success("डाउनलोड पूर्ण झाले!", { id: toastId });
    } catch (error: any) {
      console.error("PDF Generation Error:", error);
      toast.error(`त्रुटी: ${error.message || "PDF तयार करताना अडचण आली"}`, { id: toastId });
    } finally {
      if (wasEdit) {
        // Switch back only after capture is done
        setActiveMode('edit');
      }
    }
  };



  return (
    <div className="space-y-6">
      {/* Mobile Mode Toggle */}
      <div className="lg:hidden flex p-1 bg-gray-100 rounded-2xl border border-gray-100 mb-4">
        <button
          onClick={() => setActiveMode('edit')}
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeMode === 'edit' ? 'bg-[#D95D1E] text-white shadow-md' : 'text-gray-500'}`}
        >
          Edit Details
        </button>
        <button
          onClick={() => setActiveMode('preview')}
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeMode === 'preview' ? 'bg-[#D95D1E] text-white shadow-md' : 'text-gray-500'}`}
        >
          View Preview
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Controls */}
        <div className={`xl:col-span-4 space-y-6 ${activeMode === 'preview' ? 'hidden lg:block' : ''}`}>
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar sticky top-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-display font-black text-[#2C1810]">Letter Details</h3>
              <div className="text-[10px] font-black uppercase tracking-widest text-[#D95D1E] bg-[#D95D1E]/5 px-2 py-1 rounded">Editor</div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Festival Name</label>
              <input
                value={data.festival}
                onChange={e => setData({ ...data, festival: e.target.value })}
                className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20 font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Today's Date</label>
                <input
                  value={data.date}
                  onChange={e => setData({ ...data, date: e.target.value })}
                  className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Phone No</label>
                <input
                  value={data.phone}
                  onChange={e => setData({ ...data, phone: e.target.value })}
                  className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">To Label</label>
                <input
                  value={data.toLabel}
                  onChange={e => setData({ ...data, toLabel: e.target.value })}
                  className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Date Label</label>
                <input
                  value={data.dateLabel}
                  onChange={e => setData({ ...data, dateLabel: e.target.value })}
                  className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Applicant Label</label>
                <input
                  value={data.applicantLabel}
                  onChange={e => setData({ ...data, applicantLabel: e.target.value })}
                  className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Subject Label</label>
                <input
                  value={data.subjectLabel}
                  onChange={e => setData({ ...data, subjectLabel: e.target.value })}
                  className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">To Name</label>
              <input
                value={data.toName}
                onChange={e => setData({ ...data, toName: e.target.value })}
                className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">To Dept</label>
              <input
                value={data.toDept}
                onChange={e => setData({ ...data, toDept: e.target.value })}
                className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Address & Pincode</label>
              <input
                value={data.address}
                onChange={e => setData({ ...data, address: e.target.value })}
                className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Closing Label</label>
                <input
                  value={data.closingLabel}
                  onChange={e => setData({ ...data, closingLabel: e.target.value })}
                  className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Sign Label</label>
                <input
                  value={data.signLabel}
                  onChange={e => setData({ ...data, signLabel: e.target.value })}
                  className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Footer Text</label>
              <input
                value={data.footerText}
                onChange={e => setData({ ...data, footerText: e.target.value })}
                className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Subject Text</label>
              <input
                value={data.subject}
                onChange={e => setData({ ...data, subject: e.target.value })}
                className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 mb-1">Letter Content</label>
              <textarea
                value={data.content}
                onChange={e => setData({ ...data, content: e.target.value })}
                className="w-full bg-[#F5F5F0] border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#D95D1E]/20 min-h-[200px]"
              />
            </div>

            <button
              onClick={downloadPDF}
              className="w-full flex items-center justify-center gap-2 bg-[#D95D1E] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#B94A15] transition-all shadow-lg shadow-[#D95D1E]/20 mt-4"
            >
              <Download size={18} /> Download Full A4 PDF
            </button>
          </div>
        </div>

        {/* Preview Container - Improved Responsive Handling */}
        <div className={`xl:col-span-8 ${activeMode === 'edit' ? 'hidden lg:block' : ''}`}>
          <div className="flex flex-col items-center">
            {/* Download Button - Desktop only */}
            <div className="hidden lg:flex w-full justify-end mb-6">
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 bg-[#D95D1E] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#B84D19] transition-all shadow-lg hover:shadow-orange-200/50 active:scale-95 group"
              >
                <Download size={18} className="group-hover:-translate-y-1 transition-transform" />
                Download PDF
              </button>
            </div>

            {/* Paper Container Wrapper */}
            <div className="w-full bg-gray-200/50 backdrop-blur-sm rounded-[40px] p-4 md:p-12 lg:p-16 border-2 border-dashed border-gray-300 flex justify-center items-start overflow-hidden min-h-[850px] shadow-inner mb-20">
              {/* Scale Wrapper for Responsive Viewport */}
              <div className="origin-top transition-transform bg-white shadow-2xl scale-[0.35] sm:scale-[0.5] md:scale-[0.7] lg:scale-[0.8] xl:scale-90 2xl:scale-100">
                {/* A4 Frame (Capture Target) */}
                <div
                  id="letter-preview"
                  className="bg-white w-[210mm] min-h-[297mm] relative flex flex-col font-serif select-none text-black"
                  style={{ width: '210mm', minWidth: '210mm' }}
                >
                  {/* Professional Header */}
                  <div className="pt-12 px-16 pb-6">
                    <div className="flex justify-between items-start relative z-10">
                      <div className="flex gap-8 items-center">
                        <div className="relative">
                          <div className="absolute -inset-4 bg-[#D95D1E]/10 rounded-full blur-xl"></div>
                          <img src="/images/logo.png" className="w-32 h-32 object-contain relative transition-transform hover:scale-105" alt="Logo" />
                        </div>
                        <div>
                          <h1 className="text-6xl font-black text-[#D95D1E] tracking-tighter leading-none mb-2">
                            श्रीमंत शिवगर्जना प्रतिष्ठान
                          </h1>
                          <p className="text-3xl font-bold text-[#2C1810]/80">वानवडी, पुणे</p>
                          <p className="text-base font-bold text-[#D95D1E] mt-1 uppercase tracking-widest">पोस्टमन चाळ, केदारी नगर</p>
                        </div>
                      </div>
                      <div className="text-right space-y-2 pt-4">
                        <p className="font-black text-lg text-gray-800">{data.establishmentLabel}</p>
                        <div className="h-1 w-full bg-[#D95D1E] rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Zigzag Header Border */}
                  <div className="w-full h-12 bg-[#D95D1E] flex items-center mb-12 relative">
                    <div className="absolute inset-x-0 -bottom-6 flex overflow-hidden">
                      {[...Array(30)].map((_, i) => (
                        <div key={i} className="w-12 h-12 bg-[#D95D1E] rounded-full shrink-0 -mt-6" />
                      ))}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="px-20 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mt-6">
                      <div className="space-y-2 text-xl">
                        <span className="block font-bold text-[#D95D1E] text-sm uppercase tracking-widest">{data.toLabel}</span>
                        <p className="font-black text-[#2C1810]">{data.toName}</p>
                        <p className="font-bold text-gray-600">{data.toDept}</p>
                      </div>
                      <div className="text-right text-xl font-bold">
                        <span className="text-gray-400 text-sm uppercase tracking-widest block mb-1">Date</span>
                        {data.dateLabel} {data.date}
                      </div>
                    </div>

                    <div className="mt-14 flex justify-end">
                      <div className="text-right space-y-2 border-r-[12px] border-[#D95D1E] pr-8 bg-gray-50/50 p-6 rounded-l-[32px] shadow-sm max-w-[400px]">
                        <span className="block font-black italic text-xs text-[#D95D1E] uppercase tracking-[0.3em] mb-2">{data.applicantLabel}</span>
                        <p className="font-black text-3xl text-[#2C1810] leading-none mb-2">{data.applicant}</p>
                        <p className="text-sm font-bold text-gray-500 leading-relaxed">{data.address}</p>
                      </div>
                    </div>

                    <div className="mt-20 text-center">
                      <div className="inline-block relative">
                        <h2 className="text-3xl font-black text-[#2C1810] px-8 py-2 relative z-10 bg-white border-2 border-[#D95D1E] rounded-full shadow-lg">
                          {data.subjectLabel} {data.subject}
                        </h2>
                      </div>
                    </div>

                    <div className="mt-20 space-y-10">
                      <p className="font-bold text-2xl">महोदय,</p>
                      <p className="text-2xl leading-[1.85] text-justify font-medium text-gray-800 indent-24">
                        {data.content}
                      </p>
                    </div>

                    <div className="flex-1 mt-24 flex flex-col justify-end pb-24">
                      <div className="flex justify-end pr-12">
                        <div className="text-center space-y-16">
                          <p className="font-bold text-2xl text-gray-800">{data.closingLabel}</p>
                          <div className="space-y-3">
                            <div className="h-px w-full bg-gray-200 mb-4 mx-auto"></div>
                            <p className="font-black text-3xl text-[#D95D1E] mb-1">{data.applicant}</p>
                            <p className="font-bold text-xl text-gray-600">{data.phoneLabel} {data.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Footer Bar */}
                  <div className="h-20 bg-[#D95D1E] flex items-center justify-center px-20 relative overflow-hidden mt-auto">
                    <p className="text-white font-black text-sm tracking-[0.25em] relative z-10 uppercase text-center leading-relaxed">
                      {data.footerText}
                    </p>
                    <div className="absolute top-0 right-0 w-40 h-full bg-white/10 skew-x-[-45] -mr-20"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LogsTab = () => {
  const { data: logs, isLoading } = useLogs();

  if (isLoading) return <div className="p-20 text-center text-gray-400">Loading system logs...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2 lg:px-0">
        <h2 className="text-xl font-display font-black text-[#2C1810]">Activity History</h2>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#2C1810]/40">
          <Activity size={14} /> Real-time Logs
        </div>
      </div>

      <div className="bg-white lg:border border-gray-100 lg:rounded-3xl shadow-sm overflow-hidden border border-gray-100 rounded-2xl">
        {/* Desktop Header */}
        <div className="hidden lg:grid grid-cols-12 gap-4 p-5 bg-[#F5F5F0] text-[10px] font-black uppercase tracking-widest text-[#2C1810]/60 border-b border-gray-100">
          <div className="col-span-2">Time & Date</div>
          <div className="col-span-3">User</div>
          <div className="col-span-2">Action</div>
          <div className="col-span-5">Details</div>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-50 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {logs?.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-sm">No logs found. Actions will appear here.</div>
          ) : (
            logs?.map((log) => (
              <div key={log.id} className="lg:grid lg:grid-cols-12 gap-4 p-4 lg:p-5 items-center hover:bg-gray-50/50 transition-colors bg-white group">
                {/* Time Section */}
                <div className="lg:col-span-2 mb-2 lg:mb-0 flex lg:flex-col justify-between lg:justify-center whitespace-nowrap">
                  <div className="text-[11px] lg:text-xs font-bold text-[#2C1810]">
                    {new Date(log.created_at).toLocaleDateString('mr-IN')}
                  </div>
                  <div className="text-[10px] text-[#2C1810]/50 font-mono">
                    {new Date(log.created_at).toLocaleTimeString('mr-IN', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* User Section */}
                <div className="lg:col-span-3 mb-2 lg:mb-0">
                  <div className="text-[10px] font-black uppercase tracking-wider text-[#D95D1E] bg-[#D95D1E]/5 lg:bg-[#D95D1E]/10 px-2 py-1 rounded border border-[#D95D1E]/10 truncate max-w-full inline-block align-middle" title={log.user_name || "System"}>
                    {log.user_name || "System"}
                  </div>
                </div>

                {/* Action Section */}
                <div className="lg:col-span-2 mb-1 lg:mb-0">
                  <div className="text-[10px] lg:text-xs font-black uppercase tracking-wider text-[#2C1810] whitespace-nowrap">
                    {log.action}
                  </div>
                </div>

                {/* Details Section */}
                <div className="lg:col-span-5">
                  <p className="text-[11px] lg:text-xs text-[#2C1810]/70 leading-relaxed bg-gray-50 lg:bg-transparent p-2 lg:p-0 rounded-lg lg:rounded-none">
                    <span className="lg:hidden font-black text-[9px] uppercase tracking-widest text-[#2C1810]/40 block mb-1">Details:</span>
                    {log.details || "No details"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main Layout ---

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("members");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
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
            <span className="font-display font-black text-sm tracking-tight text-[#2C1810] block leading-none uppercase">श्रीमंत शिवगर्जना</span>
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#D95D1E]">वानवडी, पुणे</span>
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
        <div className="p-8 border-b border-gray-50 bg-white flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src="/images/logo.png" className="w-14 h-14 object-contain drop-shadow-lg" alt="Logo" />
              <div>
                <span className="font-display font-black text-lg tracking-tight text-[#2C1810] block leading-none uppercase text-primary">शिवगर्जना</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#D95D1E]">वानवडी, पुणे</span>
              </div>
            </div>
            <button onClick={() => setIsMobileOpen(false)} className="md:hidden text-[#2C1810]/60 hover:text-red-500 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="bg-[#FDFBF7] p-3 rounded-xl border border-primary/10">
            <div className="flex items-start gap-2 text-[10px] font-bold text-[#2C1810]/70 leading-tight">
              <MapPin size={10} className="text-[#D95D1E] shrink-0 mt-0.5" />
              <span>सर्व्हे नं. ६३/४ पोस्टमन चाळ केदारी नगर वानवडी पुणे ४१११८४०</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#2C1810]/70 mt-2">
              <Phone size={10} className="text-[#D95D1E] shrink-0" />
              <span>८२३७१८९९७७</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <SidebarItem id="members" label="Members & Vargani" icon={Users} active={activeTab === "members"} onClick={handleTabChange} />
          <SidebarItem id="tasks" label="Tasks" icon={Shield} active={activeTab === "tasks"} onClick={handleTabChange} />
          <SidebarItem id="expenses" label="Expenses" icon={Wallet} active={activeTab === "expenses"} onClick={handleTabChange} />
          <SidebarItem id="suppliers" label="Suppliers" icon={Users} active={activeTab === "suppliers"} onClick={handleTabChange} />
          <SidebarItem id="letterhead" label="Letterhead" icon={FileText} active={activeTab === "letterhead"} onClick={handleTabChange} />
          <SidebarItem id="invitations" label="Invitations" icon={Send} active={activeTab === "invitations"} onClick={handleTabChange} />
          <SidebarItem id="logs" label="System Logs" icon={ClipboardList} active={activeTab === "logs"} onClick={handleTabChange} />
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
        {/* Header with Global Year Selector */}
        <div className="bg-white border-b border-gray-100 p-4 sm:px-6 lg:px-12 flex items-center justify-between shrink-0">
          <h1 className="text-xl md:text-2xl font-black text-[#2C1810] capitalize">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <span className="text-xs font-black uppercase tracking-widest text-[#2C1810]/40 hidden md:block">Active Year</span>
            <YearSelector selected={selectedYear} onChange={setSelectedYear} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-12 scrollbar-hide">
          <motion.div
            key={`${activeTab}-${selectedYear}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto space-y-6 lg:space-y-8 pb-20"
          >
            {activeTab === "members" && <MembersTab year={selectedYear} />}
            {activeTab === "tasks" && <TasksTab year={selectedYear} />}
            {activeTab === "expenses" && <ExpensesTab year={selectedYear} />}
            {activeTab === "invitations" && <InvitationsTab />}
            {activeTab === "suppliers" && <SuppliersTab />}
            {activeTab === "letterhead" && <LetterheadTab />}
            {activeTab === "logs" && <LogsTab />}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
