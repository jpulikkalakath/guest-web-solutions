import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, MapPin, Clock, Star } from 'lucide-react';
import { useFirestore } from '@/hooks/useFirestore';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const firestore = useFirestore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: leftRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        rightRef.current,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: rightRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await firestore.submitContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        service: formData.service || undefined,
        message: formData.message || undefined,
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: unknown) {
      const e = err as { message?: string; code?: string };
      console.error("Contact form error:", err);
      const friendlyMsg = e.code === "permission-denied"
        ? "Permission denied. Please ask the developer to update Firestore security rules."
        : e.message || "Failed to send message. Please try again.";
      setError(friendlyMsg);
    }
    setSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section ref={sectionRef} id="contact" className="bg-[#0A0A0A] py-20 md:py-[120px]">
      <div className="max-w-[1280px] mx-auto px-6 flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Left - Contact Info */}
        <div ref={leftRef} className="w-full lg:w-1/2 opacity-0">
          <div className="font-body text-[12px] font-light uppercase tracking-[0.15em] text-[#6B6B6B] mb-4">
            LET&apos;S TALK
          </div>
          <h2 className="font-display text-[36px] md:text-[48px] font-medium text-[#F5F5F5] leading-[1.2]">
            Ready to Go Digital?
          </h2>
          <p className="font-body text-[16px] text-[#A0A0A0] leading-[1.7] max-w-[400px] mt-4">
            Get in touch today and let&apos;s discuss how we can bring your vision
            to life. Fast turnaround, premium quality, guaranteed satisfaction.
          </p>

          {/* Contact Details */}
          <div className="mt-12 flex flex-col gap-7">
            <div className="flex items-start gap-4">
              <Phone size={20} className="text-[#D4A574] mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-body text-[18px] font-medium text-[#F5F5F5]">
                  +91 7902327681
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin size={20} className="text-[#D4A574] mt-0.5 flex-shrink-0" />
              <div className="font-body text-[15px] text-[#A0A0A0] leading-[1.5]">
                Near KT STORE MURIKKANANGAD, Murikkanangad, Athrisseri (P.O.),
                Ponmundam (VIA.), Malappuram (DT.), Kerala, PIN : 676106
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock size={20} className="text-[#D4A574] mt-0.5 flex-shrink-0" />
              <div className="font-body text-[15px] text-[#A0A0A0]">
                Available 24/7 for urgent projects
              </div>
            </div>
          </div>

          {/* Social Proof Badge */}
          <div className="mt-10 inline-flex items-center gap-2 bg-[rgba(212,165,116,0.08)] border border-[rgba(212,165,116,0.15)] rounded-md px-5 py-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className="text-[#D4A574]" fill="#D4A574" />
            ))}
            <span className="font-body text-[13px] text-[#A0A0A0] ml-1">
              4.9/5 from 200+ reviews
            </span>
          </div>

          {/* Quick Contact Buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://wa.me/917902327681?text=Hi!%20I%20am%20interested%20in%20getting%20a%20website%20built."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-[13px] font-medium px-5 py-2.5 rounded bg-[rgba(37,211,102,0.1)] border border-[rgba(37,211,102,0.2)] text-[#25D366] hover:bg-[rgba(37,211,102,0.2)] transition-all duration-300"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Us
            </a>
            <a
              href="mailto:jpulikkalakath@gmail.com?subject=Website%20Development%20Enquiry"
              className="inline-flex items-center gap-2 font-body text-[13px] font-medium px-5 py-2.5 rounded bg-[rgba(234,67,53,0.1)] border border-[rgba(234,67,53,0.2)] text-[#EA4335] hover:bg-[rgba(234,67,53,0.2)] transition-all duration-300"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              Email Us
            </a>
          </div>
        </div>

        {/* Right - Form */}
        <div ref={rightRef} className="w-full lg:w-1/2 opacity-0">
          <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(212,165,116,0.1)] rounded-lg p-8 md:p-12">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[rgba(212,165,116,0.1)] flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D4A574" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div className="font-display text-[24px] text-[#D4A574] mb-3">
                  Thank You!
                </div>
                <p className="font-body text-[16px] text-[#A0A0A0]">
                  We&apos;ve received your message and will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-[rgba(212,165,116,0.2)] text-[#F5F5F5] font-body text-[15px] py-4 px-0 placeholder:text-[#6B6B6B] focus:border-[#D4A574] focus:outline-none transition-colors duration-300"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-b border-[rgba(212,165,116,0.2)] text-[#F5F5F5] font-body text-[15px] py-4 px-0 placeholder:text-[#6B6B6B] focus:border-[#D4A574] focus:outline-none transition-colors duration-300"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-[rgba(212,165,116,0.2)] text-[#F5F5F5] font-body text-[15px] py-4 px-0 placeholder:text-[#6B6B6B] focus:border-[#D4A574] focus:outline-none transition-colors duration-300"
                />
                <div className="relative">
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-b border-[rgba(212,165,116,0.2)] text-[#F5F5F5] font-body text-[15px] py-4 px-0 focus:border-[#D4A574] focus:outline-none transition-colors duration-300 appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23D4A574' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0 center',
                    }}
                  >
                    <option value="" disabled className="bg-[#111111]">Select Service Type</option>
                    <option value="Business Website" className="bg-[#111111]">Business Website</option>
                    <option value="E-Commerce" className="bg-[#111111]">E-Commerce</option>
                    <option value="Portfolio" className="bg-[#111111]">Portfolio</option>
                    <option value="Landing Page" className="bg-[#111111]">Landing Page</option>
                    <option value="Blog" className="bg-[#111111]">Blog</option>
                    <option value="Custom Web App" className="bg-[#111111]">Custom Web App</option>
                    <option value="Other" className="bg-[#111111]">Other</option>
                  </select>
                </div>
                <textarea
                  name="message"
                  placeholder="Tell us about your project..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-transparent border-b border-[rgba(212,165,116,0.2)] text-[#F5F5F5] font-body text-[15px] py-4 px-0 placeholder:text-[#6B6B6B] focus:border-[#D4A574] focus:outline-none transition-colors duration-300 resize-none"
                />
                {error && (
                  <div className="font-body text-[13px] text-[#EA4335] bg-[rgba(234,67,53,0.08)] rounded px-3 py-2">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 font-body text-[14px] font-medium uppercase tracking-[0.08em] py-4 rounded bg-gradient-to-br from-[#D4A574] to-[#C4956A] text-[#0A0A0A] hover:-translate-y-0.5 hover:shadow-[0_4px_24px_rgba(212,165,116,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
