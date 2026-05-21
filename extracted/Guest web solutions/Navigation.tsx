import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Menu, X, LayoutDashboard, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  // Hide nav on auth/admin pages
  if (["/login", "/signup", "/forgot-password", "/admin"].includes(location.pathname)) {
    return null;
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 h-[70px] flex items-center transition-all duration-300 ${isScrolled ? "bg-[rgba(10,10,10,0.85)] backdrop-blur-[12px] border-b border-[rgba(212,165,116,0.1)]" : "bg-transparent"}`}>
        <div className="max-w-[1280px] w-full mx-auto px-6 flex items-center justify-between">
          <button onClick={() => scrollToSection("#home")} className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="Guest Web Solutions Logo" className="h-9 w-auto" />
          </button>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button key={link.href} onClick={() => scrollToSection(link.href)}
                className="font-body text-[14px] uppercase tracking-[0.06em] text-[#A0A0A0] hover:text-[#D4A574] transition-colors duration-300">
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user?.role === "admin" && (
              <button onClick={() => navigate("/admin")}
                className="flex items-center gap-2 font-body text-[12px] uppercase tracking-[0.06em] text-[#D4A574] hover:text-[#F5F5F5] transition-colors">
                <LayoutDashboard size={16} />Dashboard
              </button>
            )}
            {isAuthenticated ? (
              <>
                <span className="font-body text-[12px] text-[#A0A0A0]">{user?.name || "User"}</span>
                <button onClick={logout}
                  className="flex items-center gap-2 font-body text-[12px] uppercase tracking-[0.06em] text-[#A0A0A0] hover:text-[#D4A574] transition-colors">
                  <LogOut size={16} />Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate("/login")}
                  className="flex items-center gap-2 font-body text-[12px] uppercase tracking-[0.06em] text-[#A0A0A0] hover:text-[#D4A574] transition-colors">
                  <LogIn size={16} />Sign In
                </button>
                <button onClick={() => navigate("/signup")}
                  className="font-body text-[12px] font-medium uppercase tracking-[0.06em] px-4 py-2 rounded border border-[rgba(212,165,116,0.3)] text-[#D4A574] hover:bg-[rgba(212,165,116,0.1)] transition-colors">
                  Sign Up
                </button>
              </>
            )}
            <button onClick={() => scrollToSection("#contact")}
              className="font-body text-[12px] font-medium uppercase tracking-[0.08em] px-6 py-2.5 rounded bg-gradient-to-br from-[#D4A574] to-[#C4956A] text-[#0A0A0A] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(212,165,116,0.3)] transition-all duration-300">
              Get Started
            </button>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-[#D4A574]" aria-label="Toggle menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0A0A0A] flex flex-col items-center justify-center gap-8 md:hidden">
          {navLinks.map((link) => (
            <button key={link.href} onClick={() => scrollToSection(link.href)}
              className="font-body text-[28px] text-[#F5F5F5] hover:text-[#D4A574] transition-colors">
              {link.label}
            </button>
          ))}
          {isAuthenticated && user?.role === "admin" && (
            <button onClick={() => { navigate("/admin"); setIsMenuOpen(false); }}
              className="font-body text-[20px] text-[#D4A574] hover:text-[#F5F5F5] transition-colors flex items-center gap-2">
              <LayoutDashboard size={20} />Dashboard
            </button>
          )}
          {isAuthenticated ? (
            <button onClick={() => { logout(); setIsMenuOpen(false); }}
              className="font-body text-[16px] text-[#A0A0A0] hover:text-[#D4A574] transition-colors flex items-center gap-2">
              <LogOut size={18} />Logout ({user?.name})
            </button>
          ) : (
            <>
              <button onClick={() => { navigate("/login"); setIsMenuOpen(false); }}
                className="font-body text-[20px] text-[#A0A0A0] hover:text-[#D4A574] transition-colors flex items-center gap-2">
                <LogIn size={18} />Sign In
              </button>
              <button onClick={() => { navigate("/signup"); setIsMenuOpen(false); }}
                className="font-body text-[20px] text-[#D4A574] hover:text-[#F5F5F5] transition-colors flex items-center gap-2">
                <User size={18} />Sign Up
              </button>
            </>
          )}
          <button onClick={() => scrollToSection("#contact")}
            className="mt-4 font-body text-[14px] font-medium uppercase tracking-[0.08em] px-8 py-3 rounded bg-gradient-to-br from-[#D4A574] to-[#C4956A] text-[#0A0A0A]">
            Get Started
          </button>
        </div>
      )}
    </>
  );
}
