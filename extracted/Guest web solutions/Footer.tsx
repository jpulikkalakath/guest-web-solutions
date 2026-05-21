import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const serviceLinks = [
  'Business Websites',
  'E-Commerce',
  'Portfolio',
  'Landing Pages',
  'Blogs',
  'Custom Apps',
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 95%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      ref={footerRef}
      className="bg-[#0A0A0A] border-t border-[rgba(212,165,116,0.1)] opacity-0"
    >
      <div className="max-w-[1280px] mx-auto px-6 pt-16 pb-6">
        {/* Top Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1 - Logo */}
          <div>
            <button
              onClick={() => scrollToSection('#home')}
              className="flex items-center gap-3"
            >
              <img
                src="/assets/logo.png"
                alt="Guest Web Solutions Logo"
                className="h-10 w-auto"
              />
            </button>
            <p className="font-body text-[14px] text-[#6B6B6B] mt-3 max-w-[260px] leading-[1.6]">
              Premium websites that drive results. Your trusted web partner in
              Kerala.
            </p>
          </div>

          {/* Column 2 - Services */}
          <div>
            <h4 className="font-body text-[13px] font-medium uppercase tracking-[0.1em] text-[#A0A0A0] mb-5">
              Services
            </h4>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link}>
                  <button
                    onClick={() => scrollToSection('#services')}
                    className="font-body text-[14px] text-[#6B6B6B] hover:text-[#D4A574] transition-colors duration-300 leading-[2.2]"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Contact */}
          <div>
            <h4 className="font-body text-[13px] font-medium uppercase tracking-[0.1em] text-[#A0A0A0] mb-5">
              Contact
            </h4>
            <div className="font-body text-[14px] text-[#6B6B6B] leading-[1.6]">
              <p>+91 7902327681</p>
              <p className="mt-2">
                Near KT STORE MURIKKANANGAD, Murikkanangad, Athrisseri (P.O.),
                Ponmundam (VIA.), Malappuram (DT.), Kerala, PIN : 676106
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[rgba(212,165,116,0.08)] mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-body text-[12px] text-[#6B6B6B]">
            2024 Guest Web Solutions. All rights reserved.
          </p>
          <p className="font-body text-[12px] text-[#6B6B6B]">
            Designed with excellence in Kerala
          </p>
        </div>
      </div>
    </footer>
  );
}
