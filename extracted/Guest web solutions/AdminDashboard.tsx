import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useFirestore, type ContactSubmission, type PaymentRecord, type UserRecord } from "@/hooks/useFirestore";
import {
  LayoutDashboard, LogOut, Users, Mail, CreditCard, RefreshCw,
  ArrowLeft, Trash2, CheckCircle, Clock, AlertCircle, Search,
  Shield, UserCheck
} from "lucide-react";

type Tab = "contacts" | "payments" | "users";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading, logout } = useAuth();
  const firestore = useFirestore();
  const [activeTab, setActiveTab] = useState<Tab>("contacts");
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/login");
    }
  }, [authLoading, isAdmin, navigate]);

  const fetchData = async () => {
    setLoading(true);
    setFetchError("");
    try {
      const [c, p, u] = await Promise.all([
        firestore.getContacts(),
        firestore.getPayments(),
        firestore.getUsers(),
      ]);
      setContacts(c);
      setPayments(p);
      setUsers(u);
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string };
      console.error("Admin fetch error:", e);
      const msg = err.message || "Failed to fetch data from Firestore.";
      setFetchError(msg);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) fetchData();
  }, [isAdmin]);

  const handleUpdateContactStatus = async (id: string, status: string) => {
    await firestore.updateContactStatus(id, status);
    setContacts(contacts.map(c => c.id === id ? { ...c, status: status as "new" | "read" | "archived" } : c));
  };

  const handleUpdatePaymentStatus = async (id: string, status: string) => {
    await firestore.updatePaymentStatus(id, status);
    setPayments(payments.map(p => p.id === id ? { ...p, status: status as "pending" | "completed" | "failed" | "refunded" } : p));
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm("Delete this contact submission?")) return;
    await firestore.deleteContact(id);
    setContacts(contacts.filter(c => c.id !== id));
  };

  const handleDeletePayment = async (id: string) => {
    if (!confirm("Delete this payment record?")) return;
    await firestore.deletePayment(id);
    setPayments(payments.filter(p => p.id !== id));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4A574] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const filteredContacts = contacts.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );
  const filteredPayments = payments.filter(p =>
    !search || p.planName.toLowerCase().includes(search.toLowerCase()) || p.userEmail.toLowerCase().includes(search.toLowerCase())
  );
  const filteredUsers = users.filter(u =>
    !search || (u.name || "").toLowerCase().includes(search.toLowerCase()) || (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    totalContacts: contacts.length,
    newContacts: contacts.filter(c => c.status === "new").length,
    totalPayments: payments.length,
    pendingPayments: payments.filter(p => p.status === "pending").length,
    totalUsers: users.length,
    adminUsers: users.filter(u => u.role === "admin").length,
  };

  const tabs: { id: Tab; label: string; icon: typeof Mail }[] = [
    { id: "contacts", label: `Contact Submissions (${stats.totalContacts})`, icon: Mail },
    { id: "payments", label: `Payments (${stats.totalPayments})`, icon: CreditCard },
    { id: "users", label: `Users (${stats.totalUsers})`, icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <header className="border-b border-[rgba(212,165,116,0.1)] bg-[rgba(10,10,10,0.95)] backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-[70px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="text-[#A0A0A0] hover:text-[#D4A574] transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-[#D4A574]" />
              <span className="font-display text-[18px] font-medium text-[#F5F5F5]">Admin Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-body text-[12px] text-[#A0A0A0] hidden sm:inline">{user?.email}</span>
            <button onClick={logout}
              className="flex items-center gap-2 font-body text-[12px] text-[#A0A0A0] hover:text-[#D4A574] transition-colors">
              <LogOut size={14} />Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard label="Total Contacts" value={stats.totalContacts} icon={Mail} color="#D4A574" />
          <StatCard label="New Contacts" value={stats.newContacts} icon={AlertCircle} color="#FBBC05" />
          <StatCard label="Total Payments" value={stats.totalPayments} icon={CreditCard} color="#4285F4" />
          <StatCard label="Pending Payments" value={stats.pendingPayments} icon={Clock} color="#EA4335" />
          <StatCard label="Total Users" value={stats.totalUsers} icon={Users} color="#34A853" />
        </div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 font-body text-[13px] px-4 py-2 rounded transition-all ${activeTab === tab.id
                    ? "bg-[rgba(212,165,116,0.15)] text-[#D4A574] border border-[rgba(212,165,116,0.3)]"
                    : "text-[#A0A0A0] hover:text-[#F5F5F5] border border-transparent"
                    }`}>
                  <Icon size={14} />{tab.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
              <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                className="bg-[rgba(255,255,255,0.03)] border border-[rgba(212,165,116,0.1)] rounded-lg pl-9 pr-4 py-2 font-body text-[13px] text-[#F5F5F5] placeholder:text-[#6B6B6B] focus:border-[#D4A574] focus:outline-none w-[200px]" />
            </div>
            <button onClick={fetchData} className="p-2 rounded border border-[rgba(212,165,116,0.1)] text-[#A0A0A0] hover:text-[#D4A574] hover:border-[#D4A574] transition-all">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {fetchError && (
          <div className="mb-6 p-4 bg-[rgba(234,67,53,0.08)] border border-[rgba(234,67,53,0.2)] rounded-lg">
            <p className="font-body text-[13px] text-[#EA4335] flex items-center gap-2">
              <AlertCircle size={16} />
              {fetchError}
            </p>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#D4A574] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === "contacts" && (
              <div className="space-y-3">
                {filteredContacts.length === 0 ? (
                  <EmptyState message="No contact submissions yet." />
                ) : (
                  filteredContacts.map(contact => (
                    <div key={contact.id} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(212,165,116,0.08)] rounded-lg p-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-body text-[15px] font-medium text-[#F5F5F5]">{contact.name}</span>
                            <StatusBadge status={contact.status} />
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 font-body text-[12px] text-[#A0A0A0]">
                            <span>{contact.email}</span>
                            {contact.phone && <span>{contact.phone}</span>}
                            {contact.service && <span className="text-[#D4A574]">{contact.service}</span>}
                            <span>{contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : ""}</span>
                          </div>
                          {contact.message && (
                            <p className="font-body text-[13px] text-[#A0A0A0] mt-2 bg-[rgba(255,255,255,0.02)] rounded p-2">{contact.message}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {contact.status === "new" && (
                            <button onClick={() => handleUpdateContactStatus(contact.id!, "read")}
                              className="flex items-center gap-1 font-body text-[11px] px-3 py-1.5 rounded bg-[rgba(212,165,116,0.1)] text-[#D4A574] hover:bg-[rgba(212,165,116,0.2)] transition-all">
                              <CheckCircle size={12} /> Mark Read
                            </button>
                          )}
                          <button onClick={() => handleDeleteContact(contact.id!)}
                            className="p-1.5 rounded text-[#6B6B6B] hover:text-[#EA4335] hover:bg-[rgba(234,67,53,0.1)] transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "payments" && (
              <div className="space-y-3">
                {filteredPayments.length === 0 ? (
                  <EmptyState message="No payment records yet." />
                ) : (
                  filteredPayments.map(payment => (
                    <div key={payment.id} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(212,165,116,0.08)] rounded-lg p-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-body text-[15px] font-medium text-[#F5F5F5]">{payment.planName}</span>
                            <PaymentStatusBadge status={payment.status} />
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 font-body text-[12px] text-[#A0A0A0]">
                            <span className="text-[#D4A574] font-medium">{payment.amount} RS</span>
                            <span>{payment.paymentMethod}</span>
                            <span>{payment.userEmail}</span>
                            <span>{payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : ""}</span>
                          </div>
                          {payment.bankReference && (
                            <p className="font-body text-[12px] text-[#6B6B6B] mt-1">Ref: {payment.bankReference}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {payment.status === "pending" && (
                            <button onClick={() => handleUpdatePaymentStatus(payment.id!, "completed")}
                              className="flex items-center gap-1 font-body text-[11px] px-3 py-1.5 rounded bg-[rgba(37,211,102,0.1)] text-[#25D366] hover:bg-[rgba(37,211,102,0.2)] transition-all">
                              <CheckCircle size={12} /> Verify
                            </button>
                          )}
                          <button onClick={() => handleDeletePayment(payment.id!)}
                            className="p-1.5 rounded text-[#6B6B6B] hover:text-[#EA4335] hover:bg-[rgba(234,67,53,0.1)] transition-all">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "users" && (
              <div className="space-y-3">
                {filteredUsers.length === 0 ? (
                  <EmptyState message="No users yet." />
                ) : (
                  filteredUsers.map(u => (
                    <div key={u.id} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(212,165,116,0.08)] rounded-lg p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[rgba(212,165,116,0.1)] flex items-center justify-center">
                            <Users size={18} className="text-[#D4A574]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-body text-[15px] font-medium text-[#F5F5F5]">{u.name || "No Name"}</span>
                              {u.role === "admin" && (
                                <span className="flex items-center gap-1 font-body text-[10px] px-2 py-0.5 rounded bg-[rgba(212,165,116,0.15)] text-[#D4A574]">
                                  <UserCheck size={10} />Admin
                                </span>
                              )}
                            </div>
                            <div className="font-body text-[12px] text-[#A0A0A0]">{u.email}</div>
                          </div>
                        </div>
                        <span className="font-body text-[11px] text-[#6B6B6B]">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ""}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: typeof Mail; color: string }) {
  return (
    <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(212,165,116,0.08)] rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} style={{ color }} />
        <span className="font-body text-[11px] text-[#6B6B6B]">{label}</span>
      </div>
      <span className="font-display text-[28px] font-bold text-[#F5F5F5]">{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: "bg-[rgba(251,188,5,0.1)] text-[#FBBC05]",
    read: "bg-[rgba(66,133,244,0.1)] text-[#4285F4]",
    archived: "bg-[rgba(107,107,107,0.1)] text-[#6B6B6B]",
  };
  return (
    <span className={`font-body text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${colors[status] || colors.new}`}>
      {status}
    </span>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-[rgba(251,188,5,0.1)] text-[#FBBC05]",
    completed: "bg-[rgba(37,211,102,0.1)] text-[#25D366]",
    failed: "bg-[rgba(234,67,53,0.1)] text-[#EA4335]",
    refunded: "bg-[rgba(107,107,107,0.1)] text-[#6B6B6B]",
  };
  return (
    <span className={`font-body text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${colors[status] || colors.pending}`}>
      {status}
    </span>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16">
      <LayoutDashboard size={40} className="text-[#6B6B6B] mx-auto mb-3" />
      <p className="font-body text-[14px] text-[#A0A0A0]">{message}</p>
    </div>
  );
}
