import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Palette, Code, Rocket } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  color: [number, number, number];
  size: number;
  angle: number;
  radius: number;
}

const PARTICLE_COUNT = 2000;
const MORPH_DURATION = 12000;

function generateDiamond(w: number, h: number): Particle[] {
  const particles: Particle[] = [];
  const scale = 200;
  const cx = w / 2;
  const cy = h / 2 - 50;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const t = i / PARTICLE_COUNT;
    let x: number, y: number;

    if (t < 0.25) {
      const s = t / 0.25;
      x = s * (-1);
      y = (1 - s) * 1;
    } else if (t < 0.5) {
      const s = (t - 0.25) / 0.25;
      x = -1 + s * 0;
      y = s * (-1);
    } else if (t < 0.75) {
      const s = (t - 0.5) / 0.25;
      x = s * 1;
      y = -1 + s * 0;
    } else {
      const s = (t - 0.75) / 0.25;
      x = 1 - s * 0;
      y = s * 1;
    }

    const r = 212 + (Math.random() - 0.5) * 40;
    const g = 165 + (Math.random() - 0.5) * 40;
    const b = 116 + (Math.random() - 0.5) * 40;

    particles.push({
      x: cx + x * scale,
      y: cy + y * scale,
      originX: cx + x * scale,
      originY: cy + y * scale,
      color: [Math.max(0, Math.min(255, r)), Math.max(0, Math.min(255, g)), Math.max(0, Math.min(255, b))],
      size: 0.8 + Math.random() * 0.6,
      angle: Math.random() * Math.PI * 2,
      radius: Math.random() * 3,
    });
  }
  return particles;
}

function generateCircle(w: number, h: number): Particle[] {
  const particles: Particle[] = [];
  const radius = 180;
  const cx = w / 2;
  const cy = h / 2 - 50;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    const r = 212 + (Math.random() - 0.5) * 40;
    const g = 165 + (Math.random() - 0.5) * 40;
    const b = 116 + (Math.random() - 0.5) * 40;

    particles.push({
      x: cx + x,
      y: cy + y,
      originX: cx + x,
      originY: cy + y,
      color: [Math.max(0, Math.min(255, r)), Math.max(0, Math.min(255, g)), Math.max(0, Math.min(255, b))],
      size: 0.8 + Math.random() * 0.6,
      angle: Math.random() * Math.PI * 2,
      radius: Math.random() * 3,
    });
  }
  return particles;
}

function generateStar(w: number, h: number): Particle[] {
  const particles: Particle[] = [];
  const outerR = 220;
  const innerR = 100;
  const cx = w / 2;
  const cy = h / 2 - 50;
  const points = 5;
  const totalSegments = points * 2;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const t = i / PARTICLE_COUNT;
    const seg = Math.floor(t * totalSegments);
    const segT = (t * totalSegments) - seg;
    const isOuter = seg % 2 === 0;
    const angle1 = (Math.floor(seg / 2) * 2 * Math.PI) / points - Math.PI / 2;
    const angle2 = (Math.floor(seg / 2) * 2 * Math.PI) / points + (2 * Math.PI) / points - Math.PI / 2;
    const r1 = isOuter ? outerR : innerR;
    const r2 = isOuter ? innerR : outerR;
    const x1 = Math.cos(angle1) * r1;
    const y1 = Math.sin(angle1) * r1;
    const x2 = Math.cos(angle2) * r2;
    const y2 = Math.sin(angle2) * r2;
    const x = x1 + (x2 - x1) * segT;
    const y = y1 + (y2 - y1) * segT;

    const r = 212 + (Math.random() - 0.5) * 40;
    const g = 165 + (Math.random() - 0.5) * 40;
    const b = 116 + (Math.random() - 0.5) * 40;

    particles.push({
      x: cx + x,
      y: cy + y,
      originX: cx + x,
      originY: cy + y,
      color: [Math.max(0, Math.min(255, r)), Math.max(0, Math.min(255, g)), Math.max(0, Math.min(255, b))],
      size: 0.8 + Math.random() * 0.6,
      angle: Math.random() * Math.PI * 2,
      radius: Math.random() * 3,
    });
  }
  return particles;
}

function generateHeart(w: number, h: number): Particle[] {
  const particles: Particle[] = [];
  const scale = 15;
  const cx = w / 2;
  const cy = h / 2 - 50;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const t = (i / PARTICLE_COUNT) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

    const r = 218 + (Math.random() - 0.5) * 40;
    const g = 160 + (Math.random() - 0.5) * 40;
    const b = 110 + (Math.random() - 0.5) * 40;

    particles.push({
      x: cx + x * scale * 0.6,
      y: cy + y * scale * 0.6,
      originX: cx + x * scale * 0.6,
      originY: cy + y * scale * 0.6,
      color: [Math.max(0, Math.min(255, r)), Math.max(0, Math.min(255, g)), Math.max(0, Math.min(255, b))],
      size: 0.8 + Math.random() * 0.6,
      angle: Math.random() * Math.PI * 2,
      radius: Math.random() * 3,
    });
  }
  return particles;
}

function cubicInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const features = [
  { icon: Search, text: 'Discovery & Strategy' },
  { icon: Palette, text: 'Design & Prototyping' },
  { icon: Code, text: 'Development & Testing' },
  { icon: Rocket, text: 'Launch & Support' },
];

export default function FeatureSpotlight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let currentParticles: Particle[] = [];
    let fromShape: Particle[] = [];
    let toShape: Particle[] = [];
    let morphTime = 1;
    let shapeIndex = 0;
    const shapeGenerators = [generateDiamond, generateCircle, generateStar, generateHeart];
    let mouseX = -1000;
    let mouseY = -1000;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(dpr, dpr);
      const w = rect.width;
      const h = rect.height;
      currentParticles = shapeGenerators[shapeIndex](w, h);
      fromShape = currentParticles.map((p) => ({ ...p }));
      toShape = shapeGenerators[(shapeIndex + 1) % 4](w, h);
    };

    resize();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left);
      mouseY = (e.clientY - rect.top);
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', resize);

    // Morph cycle
    const morphInterval = setInterval(() => {
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      fromShape = currentParticles.map((p) => ({ ...p, originX: p.x, originY: p.y }));
      shapeIndex = (shapeIndex + 1) % 4;
      toShape = shapeGenerators[shapeIndex](w, h);
      morphTime = 0;
    }, MORPH_DURATION);

    const animate = () => {
      if (!isVisibleRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      if (morphTime < 1) {
        morphTime = Math.min(1, morphTime + 0.016);
      }

      const ease = cubicInOut(morphTime);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = currentParticles[i];
        const t = toShape[i];

        // Interpolate position
        const tx = fromShape[i].x + (t.originX - fromShape[i].x) * ease;
        const ty = fromShape[i].y + (t.originY - fromShape[i].y) * ease;

        p.x = p.x + (tx - p.x) * 0.1;
        p.y = p.y + (ty - p.y) * 0.1;

        // Orbital rotation
        p.angle += 0.01;
        const ox = Math.cos(p.angle) * p.radius * 0.01;
        const oy = Math.sin(p.angle) * p.radius * 0.01;

        // Mouse repulsion
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 120;

        if (dist < repelRadius && dist > 0) {
          const force = (1 - dist / repelRadius) * 3;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        // Ease back toward origin
        p.x += ox + (p.originX - p.x) * 0.02;
        p.y += oy + (p.originY - p.y) * 0.02;
        p.originX = tx;
        p.originY = ty;

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, 0.6)`;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // IntersectionObserver to pause when not visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      clearInterval(morphInterval);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-[#0A0A0A] py-20 md:py-[120px]">
      <div className="max-w-[1280px] mx-auto px-6 flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
        {/* Canvas */}
        <div
          ref={containerRef}
          className="w-full lg:w-[55%] h-[350px] md:h-[500px] relative"
          aria-hidden="true"
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className="w-full lg:w-[45%] opacity-0"
        >
          <div className="font-body text-[12px] font-light uppercase tracking-[0.15em] text-[#6B6B6B] mb-4">
            OUR PROCESS
          </div>
          <h2 className="font-display text-[36px] md:text-[52px] font-medium text-[#F5F5F5] leading-[1.2]">
            Creativity in Motion
          </h2>
          <p className="font-body text-[16px] text-[#A0A0A0] leading-[1.7] max-w-[440px] mt-4">
            Like our visual cosmos, we transform your ideas through every shape
            and form. From concept to diamond-sharp execution, we ensure your
            website evolves beautifully through each stage of development.
          </p>

          <div className="mt-8 flex flex-col gap-5">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.text} className="flex items-center gap-4">
                  <Icon size={20} className="text-[#D4A574] flex-shrink-0" strokeWidth={1.5} />
                  <span className="font-body text-[15px] text-[#F5F5F5]">
                    {feature.text}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="mt-10 font-body text-[14px] font-medium uppercase tracking-[0.08em] px-8 py-3.5 rounded border border-[rgba(212,165,116,0.4)] text-[#D4A574] hover:bg-[rgba(212,165,116,0.1)] transition-all duration-300"
          >
            Learn More About Us
          </button>
        </div>
      </div>
    </section>
  );
}
