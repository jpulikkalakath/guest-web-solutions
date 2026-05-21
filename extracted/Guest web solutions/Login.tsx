import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, Mail, Lock, ArrowLeft } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login, googleSignIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "Invalid email or password");
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await googleSignIn();
      navigate("/");
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message || "Google sign in failed");
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
            <h1 className="font-display text-[24px] font-medium text-[#F5F5F5]">Sign In</h1>
            <p className="font-body text-[13px] text-[#6B6B6B] mt-1">Welcome back</p>
          </div>
          <button onClick={handleGoogle} disabled={loading} className="w-full flex items-center justify-center gap-3 py-3 rounded border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.06)] transition-all mb-6 disabled:opacity-50">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5.04c1.75 0 3.32.61 4.55 1.8l3.41-3.41C17.95 1.18 15.2 0 12 0 7.34 0 3.25 2.7 1.41 6.64l3.95 3.06C6.22 6.83 8.89 5.04 12 5.04z"/><path fill="#34A853" d="M23.5 12.23c0-.84-.08-1.65-.21-2.43H12v4.6h6.45c-.28 1.5-1.1 2.76-2.33 3.61l3.78 2.93c2.2-2.03 3.6-5.02 3.6-8.71z"/><path fill="#FBBC05" d="M5.36 14.04l-3.95 3.06C3.25 21.3 7.34 24 12 24c3.2 0 5.95-1.18 8.11-3.07l-3.78-2.93c-1.06.72-2.42 1.14-4.33 1.14-3.33 0-6.15-2.25-7.16-5.28z"/><path fill="#4285F4" d="M12 4.78c3.11 0 5.78 1.79 7.05 4.19l-3.41 3.41c-.86-1.36-2.35-2.33-4.14-2.33-3.11 0-5.78 1.79-7.16 4.53l-3.95-3.06C3.25 2.48 7.34 4.78 12 4.78z"/></svg>
            <span className="font-body text-[14px] font-medium text-[#F5F5F5]">Sign in with Google</span>
          </button>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[rgba(212,165,116,0.1)]" />
            <span className="font-body text-[11px] text-[#6B6B6B] uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-[rgba(212,165,116,0.1)]" />
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="relative"><Mail size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-[#6B6B6B]" /><input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-transparent border-b border-[rgba(212,165,116,0.2)] text-[#F5F5F5] font-body text-[15px] py-3 pl-7 pr-0 placeholder:text-[#6B6B6B] focus:border-[#D4A574] focus:outline-none transition-colors" /></div>
            <div className="relative"><Lock size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-[#6B6B6B]" /><input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-transparent border-b border-[rgba(212,165,116,0.2)] text-[#F5F5F5] font-body text-[15px] py-3 pl-7 pr-0 placeholder:text-[#6B6B6B] focus:border-[#D4A574] focus:outline-none transition-colors" /></div>
            <div className="flex justify-end"><Link to="/forgot-password" className="font-body text-[12px] text-[#D4A574] hover:text-[#F5F5F5] transition-colors">Forgot Password?</Link></div>
            {error && <div className="font-body text-[13px] text-[#EA4335] bg-[rgba(234,67,53,0.08)] rounded px-3 py-2">{error}</div>}
            <button type="submit" disabled={loading} className="w-full font-body text-[14px] font-medium uppercase tracking-[0.08em] py-3.5 rounded bg-gradient-to-br from-[#D4A574] to-[#C4956A] text-[#0A0A0A] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(212,165,116,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"><LogIn size={16} />{loading ? "Signing in..." : "Sign In"}</button>
          </form>
          <div className="mt-6 text-center"><p className="font-body text-[13px] text-[#6B6B6B]">Don&apos;t have an account? <Link to="/signup" className="text-[#D4A574] hover:text-[#F5F5F5] transition-colors">Sign Up</Link></p></div>
        </div>
      </div>
    </div>
  );
}
