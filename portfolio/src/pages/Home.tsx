import { useState, useEffect, useRef, useCallback, memo } from "react";
import { HiDownload, HiArrowDown } from "react-icons/hi";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";
import Typed from "typed.js";

// ============= TYPE DEFINITIONS =============
interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: ParticleColor;
  pulse: number;
}

interface Star {
  x: number;
  y: number;
  z: number;
  prevX: number;
  prevY: number;
}

interface SocialLink {
  icon: React.ComponentType<{ size: number }>;
  href: string;
  label: string;
  colorClass: string;
}

type ParticleColor = "primary" | "secondary" | "accent";

// ============= CONFIGURATION =============
const PARTICLE_CONFIG = {
  COUNT: 80,
  CONNECTION_DISTANCE: 80,
  MOUSE_RADIUS: 200,
  SPEED_DAMPING: 0.995,
  MOUSE_FORCE: 0.015,
  PULSE_SPEED: 0.03,
  BOUNDARY_BUFFER: 100,
} as const;

const STAR_CONFIG = {
  COUNT: 150,
  SPEED: 0.3,
  SPREAD: 2000,
  DEPTH: 1000,
} as const;

const ANIMATION_CONFIG = {
  CANVAS_ALPHA: 0.08,
  DELAYS: {
    GREETING: 0,
    NAME: 0.2,
    ROLE: 0.4,
    DESCRIPTION: 0.6,
    BUTTONS: 0.8,
    SOCIAL: 1.2,
    SCROLL: 2.5,
  },
} as const;

const CONTENT = {
  RESUME_URL: "/Gagana_Resume.pdf",
  TYPED_STRINGS: [
    "Software Developer",
    "DevOps Enthusiast",
    "Microservices Developer",
    "Problem Solver",
    "Full Stack Developer",
    "Cloud Enthusiast",
  ],
  SOCIAL_LINKS: [
    {
      icon: FaGithub,
      href: "https://github.com/iamgaganam",
      label: "GitHub",
      colorClass: "hover:text-gray-900 dark:hover:text-white",
    },
    {
      icon: FaLinkedin,
      href: "http://www.linkedin.com/in/gagana-methmal",
      label: "LinkedIn",
      colorClass: "hover:text-blue-600 dark:hover:text-blue-400",
    },
    {
      icon: FaEnvelope,
      href: "mailto:gaganam220@gmail.com",
      label: "Email",
      colorClass: "hover:text-red-500 dark:hover:text-red-400",
    },
  ] as SocialLink[],
} as const;

// ============= UTILITY HOOKS =============
const useAnimationFrame = (callback: () => void) => {
  const requestRef = useRef<number>();
  const animate = useCallback(() => {
    callback();
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);
};

const useMouse = () => {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return mouse;
};

// ============= UTILITY FUNCTIONS =============
const getParticleColor = (
  color: ParticleColor,
  isDark: boolean,
  opacity: number
): string => {
  const colors = {
    primary: isDark ? [190, 242, 100] : [101, 163, 13],
    secondary: isDark ? [99, 102, 241] : [79, 70, 229],
    accent: isDark ? [236, 72, 153] : [219, 39, 119],
  };
  const [r, g, b] = colors[color];
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const getShadowColor = (color: ParticleColor, isDark: boolean): string => {
  const shadows = {
    primary: isDark ? "#BEF264" : "#65A30D",
    secondary: isDark ? "#6366F1" : "#4F46E5",
    accent: isDark ? "#EC4899" : "#DB2777",
  };
  return shadows[color];
};

// ============= SUB-COMPONENTS =============
const SocialLinks = memo(() => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: ANIMATION_CONFIG.DELAYS.SOCIAL, duration: 0.8 }}
    className="fixed right-6 top-0 h-screen flex flex-col items-center justify-center z-40 gap-6"
  >
    <div className="flex flex-col gap-4">
      {CONTENT.SOCIAL_LINKS.map(
        ({ icon: Icon, href, label, colorClass }, index) => (
          <motion.a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: ANIMATION_CONFIG.DELAYS.SOCIAL + 0.2 + index * 0.1,
            }}
            whileHover={{
              scale: 1.3,
              rotate: [0, -10, 10, 0],
              transition: { duration: 0.3 },
            }}
            whileTap={{ scale: 0.9 }}
            className={`text-gray-500 dark:text-gray-400 ${colorClass} transition-all duration-300 hover:drop-shadow-[0_0_12px_currentColor] relative group`}
            aria-label={label}
          >
            <Icon size={26} />
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              whileHover={{ opacity: 1, x: -60 }}
              className="absolute top-1/2 -translate-y-1/2 right-full mr-3 bg-gray-900 dark:bg-white text-white dark:text-black px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap pointer-events-none"
            >
              {label}
            </motion.span>
          </motion.a>
        )
      )}
    </div>
  </motion.div>
));

SocialLinks.displayName = "SocialLinks";

const ScrollIndicator = memo(({ onClick }: { onClick: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: ANIMATION_CONFIG.DELAYS.SCROLL }}
    className="absolute bottom-8 left-1/2 -translate-x-1/2"
  >
    <motion.div
      animate={{ y: [0, 15, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400 cursor-pointer"
      onClick={onClick}
    >
      <span className="text-sm font-medium">Scroll to explore</span>
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <HiArrowDown className="text-2xl" />
      </motion.div>
    </motion.div>
  </motion.div>
));

ScrollIndicator.displayName = "ScrollIndicator";

// ============= CANVAS RENDERER =============
class CanvasRenderer {
  private particles: Particle[] = [];
  private stars: Star[] = [];

  constructor(private canvas: HTMLCanvasElement) {
    this.initializeParticles();
    this.initializeStars();
  }

  private initializeParticles() {
    const colors: ParticleColor[] = ["primary", "secondary", "accent"];

    for (let i = 0; i < PARTICLE_CONFIG.COUNT; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.3 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }

  private initializeStars() {
    for (let i = 0; i < STAR_CONFIG.COUNT; i++) {
      const x = (Math.random() - 0.5) * STAR_CONFIG.SPREAD;
      const y = (Math.random() - 0.5) * STAR_CONFIG.SPREAD;
      const z = Math.random() * STAR_CONFIG.DEPTH;

      this.stars.push({ x, y, z, prevX: x, prevY: y });
    }
  }

  render(ctx: CanvasRenderingContext2D, mouse: { x: number; y: number }) {
    const isDark = document.documentElement.classList.contains("dark");

    // Clear canvas with trail effect
    ctx.fillStyle = isDark
      ? `rgba(26, 26, 26, ${ANIMATION_CONFIG.CANVAS_ALPHA})`
      : `rgba(255, 255, 255, ${ANIMATION_CONFIG.CANVAS_ALPHA})`;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.renderStars(ctx, isDark);
    this.renderParticles(ctx, mouse, isDark);
  }

  private renderStars(ctx: CanvasRenderingContext2D, isDark: boolean) {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    this.stars.forEach((star) => {
      star.prevX = star.x / (star.z * 0.001);
      star.prevY = star.y / (star.z * 0.001);
      star.z -= STAR_CONFIG.SPEED;

      if (star.z <= 0) {
        star.x = (Math.random() - 0.5) * STAR_CONFIG.SPREAD;
        star.y = (Math.random() - 0.5) * STAR_CONFIG.SPREAD;
        star.z = STAR_CONFIG.DEPTH;
        star.prevX = star.x / (star.z * 0.001);
        star.prevY = star.y / (star.z * 0.001);
      }

      const x = star.x / (star.z * 0.001);
      const y = star.y / (star.z * 0.001);

      ctx.beginPath();
      ctx.moveTo(centerX + star.prevX, centerY + star.prevY);
      ctx.lineTo(centerX + x, centerY + y);

      const opacity = (1 - star.z / STAR_CONFIG.DEPTH) * (isDark ? 0.2 : 0.15);
      ctx.strokeStyle = isDark
        ? `rgba(190, 242, 100, ${opacity})`
        : `rgba(101, 163, 13, ${opacity})`;
      ctx.lineWidth = (2 - star.z / STAR_CONFIG.DEPTH) * 0.5;
      ctx.stroke();
    });
  }

  private renderParticles(
    ctx: CanvasRenderingContext2D,
    mouse: { x: number; y: number },
    isDark: boolean
  ) {
    this.particles.forEach((particle, i) => {
      // Update pulse animation
      particle.pulse += PARTICLE_CONFIG.PULSE_SPEED;
      const pulseFactor = 1 + Math.sin(particle.pulse) * 0.3;

      // Mouse interaction
      const dx = mouse.x - particle.x;
      const dy = mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < PARTICLE_CONFIG.MOUSE_RADIUS) {
        const force =
          (PARTICLE_CONFIG.MOUSE_RADIUS - distance) /
          PARTICLE_CONFIG.MOUSE_RADIUS;
        particle.speedX -=
          (dx / distance) * force * PARTICLE_CONFIG.MOUSE_FORCE;
        particle.speedY -=
          (dy / distance) * force * PARTICLE_CONFIG.MOUSE_FORCE;
      }

      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.speedX *= PARTICLE_CONFIG.SPEED_DAMPING;
      particle.speedY *= PARTICLE_CONFIG.SPEED_DAMPING;

      // Wrap around edges
      const buffer = PARTICLE_CONFIG.BOUNDARY_BUFFER;
      if (particle.x > this.canvas.width + buffer) particle.x = -buffer;
      if (particle.x < -buffer) particle.x = this.canvas.width + buffer;
      if (particle.y > this.canvas.height + buffer) particle.y = -buffer;
      if (particle.y < -buffer) particle.y = this.canvas.height + buffer;

      // Draw particle
      ctx.shadowBlur = 8;
      ctx.shadowColor = getShadowColor(particle.color, isDark);
      ctx.beginPath();
      ctx.arc(
        particle.x,
        particle.y,
        particle.size * pulseFactor,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = getParticleColor(
        particle.color,
        isDark,
        particle.opacity
      );
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw connections
      this.particles.forEach((other, j) => {
        if (i >= j) return; // Avoid duplicate connections

        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < PARTICLE_CONFIG.CONNECTION_DISTANCE) {
          const opacity =
            (1 - distance / PARTICLE_CONFIG.CONNECTION_DISTANCE) * 0.1;

          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = isDark
            ? `rgba(190, 242, 100, ${opacity})`
            : `rgba(101, 163, 13, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
}

// ============= MAIN COMPONENT =============
const Home = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const typedRef = useRef<HTMLSpanElement>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const mouse = useMouse();

  const [isLoaded, setIsLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Navigation handlers
  const scrollToSection = useCallback((sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const handleDownloadResume = useCallback(async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      const response = await fetch(CONTENT.RESUME_URL);
      if (!response.ok) throw new Error("Resume not found");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "Gagana_Methmal_Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(CONTENT.RESUME_URL, "_blank");
    } finally {
      setIsDownloading(false);
    }
  }, [isDownloading]);

  // Initialize Typed.js
  useEffect(() => {
    if (!typedRef.current) return;

    const typed = new Typed(typedRef.current, {
      strings: CONTENT.TYPED_STRINGS,
      typeSpeed: 80,
      backSpeed: 50,
      backDelay: 1500,
      loop: true,
      showCursor: true,
      cursorChar: "|",
    });

    return () => typed.destroy();
  }, []);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    rendererRef.current = new CanvasRenderer(canvas);

    const handleResize = () => rendererRef.current?.resize();
    window.addEventListener("resize", handleResize);

    setIsLoaded(true);

    return () => {
      window.removeEventListener("resize", handleResize);
      rendererRef.current = null;
    };
  }, []);

  // Animation loop
  useAnimationFrame(() => {
    const canvas = canvasRef.current;
    const renderer = rendererRef.current;
    if (!canvas || !renderer) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    renderer.render(ctx, mouse.current);
  });

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-[#0a0a0a] dark:via-[#1a1a1a] dark:to-[#2a2a2a] text-gray-900 dark:text-white relative overflow-hidden">
      {/* Background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/90 dark:from-[#0a0a0a]/90 via-white/70 dark:via-[#1a1a1a]/70 to-white/90 dark:to-[#0a0a0a]/90 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a0a0a] via-transparent to-transparent z-10" />

      {/* Ambient orbs */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-lime-500/10 to-blue-500/10 dark:from-lime-400/10 dark:to-blue-400/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-gradient-to-br from-purple-500/5 to-pink-500/5 dark:from-purple-400/5 dark:to-pink-400/5 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-br from-green-500/5 to-lime-500/5 dark:from-green-400/5 dark:to-lime-400/5 rounded-full blur-3xl animate-pulse delay-2000" />

      <SocialLinks />

      {/* Hero content */}
      <section className="min-h-screen flex items-center justify-center relative z-20">
        <div className="text-center px-4 max-w-4xl mx-auto">
          <motion.div
            {...fadeInUp}
            transition={{
              duration: 0.8,
              delay: ANIMATION_CONFIG.DELAYS.GREETING,
            }}
            className="mb-6"
          >
            <span className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-light">
              👋 Hello there! I'm
            </span>
          </motion.div>

          <motion.h1
            {...fadeInUp}
            transition={{ duration: 0.8, delay: ANIMATION_CONFIG.DELAYS.NAME }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 relative"
          >
            <span className="text-gray-900 dark:text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_4px_8px_rgba(255,255,255,0.1)]">
              Gagana Methmal
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-lime-500/20 dark:via-lime-400/20 to-transparent blur-sm"
              animate={{
                x: [-300, 300],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              }}
            />
          </motion.h1>

          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.8, delay: ANIMATION_CONFIG.DELAYS.ROLE }}
            className="text-xl md:text-3xl text-gray-600 dark:text-gray-300 mb-8 h-12 flex items-center justify-center"
          >
            <span className="mr-3">I'm a</span>
            <span
              ref={typedRef}
              className="text-lime-600 dark:text-lime-400 font-semibold"
            />
          </motion.div>

          <motion.p
            {...fadeInUp}
            transition={{
              duration: 0.8,
              delay: ANIMATION_CONFIG.DELAYS.DESCRIPTION,
            }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Passionate about creating innovative solutions and building scalable
            applications that make a difference in the digital world.
          </motion.p>

          <motion.div
            {...fadeInUp}
            transition={{
              duration: 0.8,
              delay: ANIMATION_CONFIG.DELAYS.BUTTONS,
            }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              onClick={handleDownloadResume}
              disabled={isDownloading}
              whileHover={
                isDownloading
                  ? {}
                  : {
                      scale: 1.05,
                      boxShadow: "0 20px 40px rgba(132, 204, 22, 0.3)",
                    }
              }
              whileTap={isDownloading ? {} : { scale: 0.95 }}
              className={`bg-gradient-to-r from-lime-500 to-green-600 dark:from-lime-400 dark:to-green-400 text-white dark:text-black px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 group flex items-center gap-3 min-w-[200px] justify-center ${
                isDownloading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              aria-label="Download Resume"
            >
              <span>
                {isDownloading ? "Downloading..." : "Download Resume"}
              </span>
              <HiDownload
                className={`text-xl ${
                  isDownloading
                    ? "animate-bounce"
                    : "group-hover:animate-bounce"
                }`}
              />
            </motion.button>

            <motion.button
              onClick={() => scrollToSection("projects")}
              whileHover={{
                scale: 1.05,
                borderColor: "rgb(132, 204, 22)",
              }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 min-w-[200px]"
              aria-label="View Portfolio"
            >
              View My Work
            </motion.button>
          </motion.div>

          <ScrollIndicator onClick={() => scrollToSection("about")} />
        </div>
      </section>
    </div>
  );
};

export default memo(Home);
