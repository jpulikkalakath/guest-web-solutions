import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subHeadlineRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Label
    tl.fromTo(
      labelRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      0.2
    );

    // Headline - split by words
    if (headlineRef.current) {
      const words = headlineRef.current.querySelectorAll('.word');
      tl.fromTo(
        words,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 },
        0.4
      );
    }

    // Sub-headline
    tl.fromTo(
      subHeadlineRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      0.9
    );

    // Description
    tl.fromTo(
      descRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.6 },
      1.1
    );

    // CTAs
    tl.fromTo(
      ctaRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5 },
      1.3
    );

    // Trust bar
    tl.fromTo(
      trustRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5 },
      1.5
    );

    // Image
    tl.fromTo(
      imageRef.current,
      { opacity: 0, scale: 1.05 },
      { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' },
      0.3
    );

    return () => {
      tl.kill();
    };
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const headlineWords = 'We Build Websites'.split(' ');

  return (
    <section
      ref={sectionRef}
      id="home"
      className="min-h-screen bg-[#0A0A0A] flex flex-col md:flex-row"
    >
      {/* Left Content */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-20 py-24 md:py-0 order-2 md:order-1">
        <div
          ref={labelRef}
          className="font-body text-[12px] font-light uppercase tracking-[0.15em] text-[#6B6B6B] mb-6 opacity-0"
        >
          PROFESSIONAL WEB SOLUTIONS
        </div>

        <h1
          ref={headlineRef}
          className="font-display text-[48px] md:text-[72px] font-bold text-[#F5F5F5] leading-[1.1] tracking-[-0.02em]"
        >
          {headlineWords.map((word, i) => (
            <span key={i} className="word inline-block mr-[0.3em]">
              {word}
            </span>
          ))}
        </h1>

        <h2
          ref={subHeadlineRef}
          className="font-display text-[28px] md:text-[42px] font-normal text-[#D4A574] mt-3 opacity-0"
        >
          That Convert Visitors Into Customers
        </h2>

        <p
          ref={descRef}
          className="font-body text-[16px] text-[#A0A0A0] leading-[1.7] max-w-[480px] mt-6 opacity-0"
        >
          Premium websites for businesses, portfolios, e-commerce, and more.
          Starting at just{' '}
          <span className="text-[#D4A574] font-medium">10,000 RS</span>. Your
          vision, our expertise — delivered fast.
        </p>

        <div ref={ctaRef} className="flex flex-wrap gap-4 mt-10 opacity-0">
          <button
            onClick={() => scrollToSection('#contact')}
            className="font-body text-[14px] font-medium uppercase tracking-[0.08em] px-8 py-3.5 rounded bg-gradient-to-br from-[#D4A574] to-[#C4956A] text-[#0A0A0A] hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(212,165,116,0.3)] transition-all duration-300"
          >
            Start Your Project
          </button>
          <button
            onClick={() => scrollToSection('#portfolio')}
            className="font-body text-[14px] font-medium uppercase tracking-[0.08em] px-8 py-3.5 rounded border border-[rgba(212,165,116,0.4)] text-[#D4A574] hover:bg-[rgba(212,165,116,0.1)] transition-all duration-300"
          >
            View Our Work
          </button>
        </div>

        <div
          ref={trustRef}
          className="flex flex-wrap gap-8 md:gap-10 mt-12 opacity-0"
        >
          {[
            { number: '500+', label: 'Projects Delivered' },
            { number: '100%', label: 'Client Satisfaction' },
            { number: '24/7', label: 'Support Available' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-[28px] font-bold text-[#D4A574]">
                {stat.number}
              </div>
              <div className="font-body text-[12px] text-[#6B6B6B]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Image */}
      <div
        ref={imageRef}
        className="flex-1 relative min-h-[50vh] md:min-h-screen order-1 md:order-2 opacity-0"
      >
        <img
          src="/assets/hero-dev.jpg"
          alt="Professional web developer workspace"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, #0A0A0A 0%, transparent 40%)',
          }}
        />
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              'linear-gradient(to top, #0A0A0A 0%, transparent 40%)',
          }}
        />
      </div>
    </section>
  );
}
