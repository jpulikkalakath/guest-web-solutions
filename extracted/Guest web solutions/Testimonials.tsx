import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote:
      "Guest Web Solutions transformed our small shop into a thriving online store. Sales increased by 300% within the first month!",
    name: 'Arun K.',
    title: 'Kerala Spices Owner',
    initials: 'AK',
  },
  {
    quote:
      "Professional, fast, and incredibly talented. Our restaurant's website now brings in twice as many online reservations.",
    name: 'Priya M.',
    title: 'Cafe Malabar Manager',
    initials: 'PM',
  },
  {
    quote:
      "The best investment we made for our business. The website looks premium and works flawlessly on all devices.",
    name: 'Ramesh T.',
    title: 'Athirissery Builders',
    initials: 'RT',
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.15,
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
      className="bg-[#111111] py-20 md:py-[120px]"
    >
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section Header */}
        <div ref={headlineRef} className="text-center mb-16">
          <div className="font-body text-[12px] font-light uppercase tracking-[0.15em] text-[#6B6B6B]">
            CLIENT STORIES
          </div>
          <h2 className="font-display text-[36px] md:text-[52px] font-medium text-[#F5F5F5] leading-[1.2] mt-4">
            Trusted by Businesses Across Kerala
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-[1100px] mx-auto">
          {testimonials.map((testimonial, i) => (
            <div
              key={testimonial.name}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="bg-[rgba(255,255,255,0.02)] border border-[rgba(212,165,116,0.08)] rounded-lg p-8 md:p-10"
            >
              <Quote
                size={32}
                className="text-[rgba(212,165,116,0.3)] mb-5"
                strokeWidth={1.5}
              />
              <p className="font-display text-[18px] text-[#E0E0E0] leading-[1.6] italic">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 mt-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4A574] to-[#C4956A] flex items-center justify-center flex-shrink-0">
                  <span className="font-body text-[16px] font-semibold text-[#0A0A0A]">
                    {testimonial.initials}
                  </span>
                </div>
                <div>
                  <div className="font-body text-[15px] font-medium text-[#F5F5F5]">
                    {testimonial.name}
                  </div>
                  <div className="font-body text-[13px] text-[#6B6B6B]">
                    {testimonial.title}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
