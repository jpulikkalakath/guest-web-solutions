import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Layout,
  ShoppingCart,
  Briefcase,
  PenTool,
  Globe,
  Smartphone,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Briefcase,
    title: 'Business Websites',
    description:
      'Professional corporate sites that establish credibility and showcase your brand identity with stunning design.',
  },
  {
    icon: ShoppingCart,
    title: 'E-Commerce Stores',
    description:
      'Full-featured online shops with secure payments, inventory management, and conversion-optimized layouts.',
  },
  {
    icon: PenTool,
    title: 'Portfolio Sites',
    description:
      'Creative showcases for artists, photographers, and professionals to display work beautifully.',
  },
  {
    icon: Layout,
    title: 'Landing Pages',
    description:
      'High-converting single-page designs focused on one goal — leads, signups, or sales.',
  },
  {
    icon: Globe,
    title: 'Blog & Magazine',
    description:
      'Content-rich platforms with beautiful typography, easy management, and SEO optimization.',
  },
  {
    icon: Smartphone,
    title: 'Custom Web Apps',
    description:
      'Tailored web applications with advanced functionality, databases, and user management.',
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline animation
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headlineRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards staggered animation
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="bg-[#111111] py-20 md:py-[120px]"
    >
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section Header */}
        <div ref={headlineRef} className="text-center mb-16">
          <div className="font-body text-[12px] font-light uppercase tracking-[0.15em] text-[#6B6B6B]">
            WHAT WE OFFER
          </div>
          <h2 className="font-display text-[36px] md:text-[52px] font-medium text-[#F5F5F5] leading-[1.2] mt-4">
            Every Website You Need
          </h2>
          <p className="font-body text-[16px] text-[#A0A0A0] max-w-[600px] mx-auto mt-5 leading-[1.7]">
            From simple landing pages to complex e-commerce platforms — we craft
            digital experiences that drive results.
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                ref={(el) => { cardsRef.current[i] = el; }}
                className="group bg-[rgba(255,255,255,0.03)] border border-[rgba(212,165,116,0.1)] rounded-lg p-8 md:p-10 hover:border-[rgba(212,165,116,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(212,165,116,0.08)] transition-all duration-400 cursor-default"
              >
                <Icon
                  size={48}
                  className="text-[#D4A574] mb-6 group-hover:scale-110 transition-transform duration-300"
                  strokeWidth={1.5}
                />
                <h3 className="font-body text-[20px] font-medium text-[#F5F5F5] mb-3">
                  {service.title}
                </h3>
                <p className="font-body text-[14px] text-[#A0A0A0] leading-[1.6]">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
