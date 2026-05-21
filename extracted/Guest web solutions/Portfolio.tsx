import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const portfolioItems = [
  { image: '/assets/portfolio-1.jpg', name: 'Luxury Boutique' },
  { image: '/assets/portfolio-2.jpg', name: 'Tech Startup' },
  { image: '/assets/portfolio-3.jpg', name: 'Restaurant Chain' },
  { image: '/assets/portfolio-4.jpg', name: 'Photography Studio' },
  { image: '/assets/portfolio-5.jpg', name: 'Real Estate Firm' },
  { image: '/assets/portfolio-6.jpg', name: 'Fitness Center' },
];

export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

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

      itemsRef.current.forEach((item, i) => {
        if (!item) return;
        gsap.fromTo(
          item,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: i * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Subtle parallax on scroll
        gsap.to(item.querySelector('img'), {
          y: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="bg-[#0A0A0A] py-20 md:py-[120px]"
    >
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section Header */}
        <div ref={headlineRef} className="text-center mb-16">
          <div className="font-body text-[12px] font-light uppercase tracking-[0.15em] text-[#6B6B6B]">
            RECENT WORK
          </div>
          <h2 className="font-display text-[36px] md:text-[52px] font-medium text-[#F5F5F5] leading-[1.2] mt-4">
            Websites That Impress
          </h2>
          <p className="font-body text-[16px] text-[#A0A0A0] max-w-[520px] mx-auto mt-4 leading-[1.7]">
            A glimpse into the digital experiences we've crafted for clients
            across industries.
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolioItems.map((item, i) => (
            <div
              key={item.name}
              ref={(el) => { itemsRef.current[i] = el; }}
              className="group relative rounded-lg overflow-hidden cursor-pointer"
              style={{ aspectRatio: '16/10' }}
            >
              <img
                src={item.image}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform ease-out group-hover:scale-105"
              style={{ transitionDuration: '600ms' }}
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[rgba(10,10,10,0.6)] opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
                <span className="font-display text-[20px] font-medium text-[#F5F5F5]">
                  {item.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
