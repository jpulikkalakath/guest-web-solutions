import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import PaymentModal from "@/components/PaymentModal";

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: "Starter",
    price: "10,000",
    description: "Perfect for personal sites & small businesses",
    featured: false,
    features: ["5-Page Responsive Website", "Mobile & Tablet Optimized", "Contact Form Integration", "Basic SEO Setup", "1 Month Free Support", "Social Media Links"],
  },
  {
    name: "Business",
    price: "25,000",
    description: "Complete solution for growing businesses",
    featured: true,
    features: ["10-Page Responsive Website", "Advanced SEO Optimization", "Google Analytics Setup", "Blog / News Section", "3 Months Free Support", "Admin Dashboard", "Speed Optimization"],
  },
  {
    name: "Enterprise",
    price: "50,000",
    description: "Full-scale digital transformation",
    featured: false,
    features: ["Unlimited Pages", "E-Commerce Integration", "Custom Web Applications", "Database Integration", "Priority 24/7 Support", "6 Months Free Maintenance", "Performance Monitoring"],
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string; numericAmount: string } | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headlineRef.current, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: headlineRef.current, start: "top 80%", toggleActions: "play none none reverse" },
      });
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(card, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.6, delay: i * 0.12, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleGetStarted = (plan: typeof plans[0]) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setSelectedPlan({ name: plan.name, price: plan.price, numericAmount: plan.price.replace(/,/g, "") });
  };

  return (
    <section ref={sectionRef} id="pricing" className="bg-[#111111] py-20 md:py-[120px]">
      <div className="max-w-[1280px] mx-auto px-6">
        <div ref={headlineRef} className="text-center mb-16">
          <div className="font-body text-[12px] font-light uppercase tracking-[0.15em] text-[#6B6B6B]">TRANSPARENT PRICING</div>
          <h2 className="font-display text-[36px] md:text-[52px] font-medium text-[#F5F5F5] leading-[1.2] mt-4">Premium Quality, Fair Price</h2>
          <p className="font-body text-[16px] text-[#A0A0A0] max-w-[500px] mx-auto mt-4 leading-[1.7]">No hidden fees. No surprises. Just world-class websites at prices that make sense.</p>
          {!isAuthenticated && (
            <p className="font-body text-[13px] text-[#D4A574] mt-3 flex items-center justify-center gap-1">
              <Lock size={12} />
              Sign in to unlock payment options
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1000px] mx-auto items-start">
          {plans.map((plan, i) => (
            <div key={plan.name} className="relative">
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-[#D4A574] text-[#0A0A0A] font-body text-[11px] font-medium uppercase tracking-[0.1em] px-4 py-1.5 rounded-sm">MOST POPULAR</span>
                </div>
              )}
              <div ref={(el) => { cardsRef.current[i] = el; }}
                className={`rounded-lg p-8 md:p-10 h-full ${plan.featured ? "bg-gradient-to-b from-[rgba(212,165,116,0.08)] to-[rgba(10,10,10,0.5)] border border-[rgba(212,165,116,0.3)] md:-translate-y-3" : "bg-[rgba(255,255,255,0.02)] border border-[rgba(212,165,116,0.1)]"}`}>
                <div className={`font-body text-[14px] font-medium uppercase tracking-[0.1em] ${plan.featured ? "text-[#D4A574]" : "text-[#A0A0A0]"}`}>{plan.name}</div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className={`font-display font-bold ${plan.featured ? "text-[56px] text-[#D4A574]" : "text-[48px] text-[#F5F5F5]"}`}>{plan.price}</span>
                  <span className={`font-body text-[16px] ${plan.featured ? "text-[#C4956A]" : "text-[#A0A0A0]"}`}>RS</span>
                </div>
                <div className="font-body text-[12px] text-[#6B6B6B]">/one-time</div>
                <p className="font-body text-[14px] text-[#A0A0A0] mt-2">{plan.description}</p>
                <div className="my-6 h-px bg-[rgba(212,165,116,0.1)]" />
                <ul className="space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 font-body text-[14px] text-[#A0A0A0]">
                      <Check size={16} className="text-[#D4A574] mt-0.5 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleGetStarted(plan)}
                  className={`w-full mt-8 font-body text-[14px] font-medium py-3 rounded transition-all duration-300 flex items-center justify-center gap-2 ${plan.featured ? "bg-gradient-to-br from-[#D4A574] to-[#C4956A] text-[#0A0A0A] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(212,165,116,0.3)]" : "bg-[rgba(212,165,116,0.1)] border border-[rgba(212,165,116,0.3)] text-[#D4A574] hover:bg-[rgba(212,165,116,0.2)]"}`}>
                  {!isAuthenticated && <Lock size={14} />}
                  {isAuthenticated ? "Get Started" : "Sign in to Order"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPlan && (
        <PaymentModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
      )}
    </section>
  );
}
