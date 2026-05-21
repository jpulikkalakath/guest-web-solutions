import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Mail, ArrowLeft, Send } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setSuccess("Password reset link sent! Check your email inbox and spam folder. Email sender: noreply@push-to-github.firebaseapp.com");
    } catch (err: unknown) {
      const e = err as { message?: string; code?: string };
      console.error("[ForgotPassword] Error:", e.code, e.message);
      let msg = "Failed to send reset email. Try again.";
      if (e.code === "auth/user-not-found") {
        msg = "This email is not registered. Please sign up first.";
      } else if (e.code === "auth/invalid-email") {
        msg = "Invalid email address. Please check and try again.";
      } else if (e.code === "auth/too-many-requests") {
        msg = "Too many attempts. Please wait a few minutes before trying again.";
      }
      setError(msg);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        <button onClick={() => navigate("/login")} className="flex items-center gap-2 text-[#A0A0A0] hover:text-[#D4A574] transition-colors mb-8 font-body text-[14px]">
          <ArrowLeft size={16} /> Back to Sign In
        </button>
        <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(212,165,116,0.1)] rounded-lg p-8">
          <div className="text-center mb-8">
            <img src="/assets/logo.png" alt="Guest Web Solutions" className="h-12 mx-auto mb-4" />
            <h1 className="font-display text-[24px] font-medium text-[#F5F5F5]">Reset Password</h1>
            <p className="font-body text-[13px] text-[#6B6B6B] mt-1">Enter your email to receive a reset link</p>
          </div>

          {success ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-[rgba(37,211,102,0.1)] flex items-center justify-center mx-auto mb-4">
                <Send size={24} className="text-[#25D366]" />
              </div>
              <p className="font-body text-[15px] text-[#25D366] mb-4">{success}</p>
              <button onClick={() => navigate("/login")}
                className="font-body text-[14px] text-[#D4A574] hover:text-[#F5F5F5] transition-colors">
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="relative">
                <Mail size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-[#6B6B6B]" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-[rgba(212,165,116,0.2)] text-[#F5F5F5] font-body text-[15px] py-3 pl-7 pr-0 placeholder:text-[#6B6B6B] focus:border-[#D4A574] focus:outline-none transition-colors"
                />
              </div>
              {error && <div className="font-body text-[13px] text-[#EA4335] bg-[rgba(234,67,53,0.08)] rounded px-3 py-2">{error}</div>}
              <button
                type="submit"
                disabled={loading}
                className="w-full font-body text-[14px] font-medium uppercase tracking-[0.08em] py-3.5 rounded bg-gradient-to-br from-[#D4A574] to-[#C4956A] text-[#0A0A0A] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(212,165,116,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send size={16} />{loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="font-body text-[13px] text-[#6B6B6B]">
              Remember your password? <Link to="/login" className="text-[#D4A574] hover:text-[#F5F5F5] transition-colors">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
