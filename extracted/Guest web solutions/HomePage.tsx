import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "../sections/Navigation";
import Hero from "../sections/Hero";
import Services from "../sections/Services";
import FeatureSpotlight from "../sections/FeatureSpotlight";
import Pricing from "../sections/Pricing";
import Portfolio from "../sections/Portfolio";
import Testimonials from "../sections/Testimonials";
import Contact from "../sections/Contact";
import Footer from "../sections/Footer";
import FloatingActions from "../components/FloatingActions";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return () => { lenis.destroy(); };
  }, []);

  return (
    <div className="bg-[#0A0A0A] min-h-screen">
      <Navigation />
      <Hero />
      <Services />
      <FeatureSpotlight />
      <Pricing />
      <Portfolio />
      <Testimonials />
      <Contact />
      <Footer />
      <FloatingActions />
    </div>
  );
}
