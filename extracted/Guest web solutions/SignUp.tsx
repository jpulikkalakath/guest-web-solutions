import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { UserPlus, Mail, Lock, User, ArrowLeft } from "lucide-react";

export default function SignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate("/login");
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "Sign up failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-[#A0A0A0] hover:text-[#D4A574] transition-colors mb-8 font-body text-[14px]"><ArrowLeft size={16} /> Back to Website</button>
        <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(212,165,116,0.1)] rounded-lg p-8">
          <div className="text-center mb-8">
            <img src="/assets/logo.png" alt="Guest Web Solutions" className="h-12 mx-auto mb-4" />
            <h1 className="font-display text-[24px] font-medium text-[#F5F5F5]">Create Account</h1>
            <p className="font-body text-[13px] text-[#6B6B6B] mt-1">Join Guest Web Solutions</p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="relative"><User size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-[#6B6B6B]" /><input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required className="w-full bg-transparent border-b border-[rgba(212,165,116,0.2)] text-[#F5F5F5] font-body text-[15px] py-3 pl-7 pr-0 placeholder:text-[#6B6B6B] focus:border-[#D4A574] focus:outline-none transition-colors" /></div>
            <div className="relative"><Mail size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-[#6B6B6B]" /><input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-transparent border-b border-[rgba(212,165,116,0.2)] text-[#F5F5F5] font-body text-[15px] py-3 pl-7 pr-0 placeholder:text-[#6B6B6B] focus:border-[#D4A574] focus:outline-none transition-colors" /></div>
            <div className="relative"><Lock size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-[#6B6B6B]" /><input type="password" placeholder="Password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-transparent border-b border-[rgba(212,165,116,0.2)] text-[#F5F5F5] font-body text-[15px] py-3 pl-7 pr-0 placeholder:text-[#6B6B6B] focus:border-[#D4A574] focus:outline-none transition-colors" /></div>
            <div className="relative"><Lock size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-[#6B6B6B]" /><input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full bg-transparent border-b border-[rgba(212,165,116,0.2)] text-[#F5F5F5] font-body text-[15px] py-3 pl-7 pr-0 placeholder:text-[#6B6B6B] focus:border-[#D4A574] focus:outline-none transition-colors" /></div>
            {error && <div className="font-body text-[13px] text-[#EA4335] bg-[rgba(234,67,53,0.08)] rounded px-3 py-2">{error}</div>}
            <button type="submit" disabled={loading} className="w-full mt-2 font-body text-[14px] font-medium uppercase tracking-[0.08em] py-3.5 rounded bg-gradient-to-br from-[#D4A574] to-[#C4956A] text-[#0A0A0A] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(212,165,116,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"><UserPlus size={16} />{loading ? "Creating Account..." : "Sign Up"}</button>
          </form>
          <div className="mt-6 text-center"><p className="font-body text-[13px] text-[#6B6B6B]">Already have an account? <Link to="/login" className="text-[#D4A574] hover:text-[#F5F5F5] transition-colors">Sign In</Link></p></div>
        </div>
      </div>
    </div>
  );
}
