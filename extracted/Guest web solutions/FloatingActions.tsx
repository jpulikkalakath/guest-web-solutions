import { useState, useRef, useEffect } from "react";
import { MessageCircle, Mail, Phone, X, PhoneCall } from "lucide-react";

const WHATSAPP_NUMBER = "917902327681";
const EMAIL = "jpulikkalakath@gmail.com";
const PHONE_NUMBER = "+917902327681";

const actions = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    color: "#25D366",
    href: `https://wa.me/${WHATSAPP_NUMBER}?text=Hi!%20I%20am%20interested%20in%20getting%20a%20website%20built%20by%20Guest%20Web%20Solutions.`,
  },
  {
    icon: Mail,
    label: "Email",
    color: "#EA4335",
    href: `mailto:${EMAIL}?subject=Website%20Development%20Enquiry&body=Hi,%0A%0AI%20am%20interested%20in%20getting%20a%20website%20built%20by%20Guest%20Web%20Solutions.%0A%0ARegards,`,
  },
  {
    icon: Phone,
    label: "Call Now",
    color: "#D4A574",
    href: `tel:${PHONE_NUMBER}`,
  },
];

export default function FloatingActions() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div
      ref={menuRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
    >
      {/* Action buttons - only show when open */}
      {isOpen && (
        <div className="flex flex-col items-end gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <a
                key={action.label}
                href={action.href}
                target={action.href.startsWith("http") ? "_blank" : undefined}
                rel={action.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-3 bg-[#1A1A1A] border border-[rgba(255,255,255,0.08)] rounded-full pl-4 pr-3 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.6)] transition-all duration-300 hover:-translate-y-0.5 animate-fab-in"
                style={{ "--fab-color": action.color } as React.CSSProperties}
              >
                <span className="font-body text-[13px] font-medium text-[#F5F5F5] whitespace-nowrap">
                  {action.label}
                </span>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: action.color }}
                >
                  <Icon size={18} className="text-white" strokeWidth={2} />
                </div>
              </a>
            );
          })}
        </div>
      )}

      {/* Main toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(212,165,116,0.3)] hover:shadow-[0_4px_28px_rgba(212,165,116,0.5)] transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          background: isOpen
            ? "linear-gradient(135deg, #555, #777)"
            : "linear-gradient(135deg, #D4A574, #C4956A)",
        }}
        aria-label={isOpen ? "Close menu" : "Open contact menu"}
      >
        {isOpen ? (
          <X size={22} className="text-white" />
        ) : (
          <PhoneCall size={22} className="text-[#0A0A0A]" strokeWidth={2.5} />
        )}
      </button>

      {/* Inline CSS for animation */}
      <style>{`
        @keyframes fabIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.85);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fab-in {
          animation: fabIn 0.25s ease-out both;
        }
        .animate-fab-in:nth-child(1) { animation-delay: 0ms; }
        .animate-fab-in:nth-child(2) { animation-delay: 60ms; }
        .animate-fab-in:nth-child(3) { animation-delay: 120ms; }
      `}</style>
    </div>
  );
}
