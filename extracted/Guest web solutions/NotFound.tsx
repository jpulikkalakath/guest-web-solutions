import { useNavigate } from "react-router";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
      <div className="text-center">
        <img src="/assets/logo.png" alt="Guest Web Solutions" className="h-16 mx-auto mb-8 opacity-50" />
        <h1 className="font-display text-[72px] font-bold text-[#D4A574] leading-none">404</h1>
        <p className="font-body text-[18px] text-[#A0A0A0] mt-4">Page not found</p>
        <p className="font-body text-[14px] text-[#6B6B6B] mt-2">The page you are looking for does not exist.</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-body text-[14px] text-[#A0A0A0] hover:text-[#D4A574] transition-colors">
            <ArrowLeft size={16} /> Go Back
          </button>
          <button onClick={() => navigate("/")}
            className="flex items-center gap-2 font-body text-[14px] font-medium px-6 py-2.5 rounded bg-gradient-to-br from-[#D4A574] to-[#C4956A] text-[#0A0A0A] hover:-translate-y-0.5 transition-all">
            <Home size={16} /> Home
          </button>
        </div>
      </div>
    </div>
  );
}
