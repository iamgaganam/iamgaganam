import { useState, useEffect, useRef, useCallback } from "react";
import { HiDownload, HiArrowDown } from "react-icons/hi";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";
import Typed from "typed.js";

// Type definitions for better type safety
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
  color: string;
}

type ParticleColor = "primary" | "secondary" | "accent";

// Constants for configuration
const CONFIG = {
  PARTICLE_COUNT: 80,
  STAR_COUNT: 150,
  CANVAS_ALPHA: 0.08,
  STAR_SPEED: 0.3,
  MOUSE_INTERACTION_RADIUS: 200,
  PARTICLE_CONNECTION_DISTANCE: 80,
  ANIMATION_DELAYS: {
    TYPED_STRINGS: [
      "Software Developer",
      "DevOps Enthusiast",
      "Microservices Developer",
      "Problem Solver",
      "Full Stack Developer",
      "Cloud Enthusaist",
    ],
    GREETING: 0,
    NAME: 0.2,
    ROLE: 0.4,
    DESCRIPTION: 0.6,
    BUTTONS: 0.8,
    SOCIAL: 1.2,
    SCROLL: 2.5,
  },
} as const;

const Home = () => {
  // Refs for DOM elements and animation state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const typedRef = useRef<HTMLSpanElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();

  // Component state
  const [isLoaded, setIsLoaded] = useState(false);

  // Social media links configuration
  const socialLinks: SocialLink[] = [
    {
      icon: FaGithub,
      href: "https://github.com/iamgaganam",
      label: "GitHub",
      color: "hover:text-gray-900 dark:hover:text-white",
    },
    {
      icon: FaLinkedin,
      href: "http://www.linkedin.com/in/gagana-methmal",
      label: "LinkedIn",
      color: "hover:text-blue-600 dark:hover:text-blue-400",
    },
    {
      icon: FaEnvelope,
      href: "mailto:gaganam220@gmail.com",
      label: "Email",
      color: "hover:text-red-500 dark:hover:text-red-400",
    },
  ];

  // Initialize Typed.js for animated role text
  useEffect(() => {
    if (!typedRef.current) return;

    const typed = new Typed(typedRef.current, {
      strings: [...CONFIG.ANIMATION_DELAYS.TYPED_STRINGS],
      typeSpeed: 80,
      backSpeed: 50,
      backDelay: 1500,
      loop: true,
      showCursor: true,
      cursorChar: "|",
    });

    return () => typed.destroy();
  }, []);

  // Utility functions for particle system
  const getParticleColor = useCallback(
    (color: ParticleColor, isDarkMode: boolean, opacity: number): string => {
      const colorMap = {
        primary: isDarkMode
          ? `rgba(190, 242, 100, ${opacity})`
          : `rgba(101, 163, 13, ${opacity})`,
        secondary: isDarkMode
          ? `rgba(99, 102, 241, ${opacity})`
          : `rgba(79, 70, 229, ${opacity})`,
        accent: isDarkMode
          ? `rgba(236, 72, 153, ${opacity})`
          : `rgba(219, 39, 119, ${opacity})`,
      };
      return colorMap[color];
    },
    []
  );

  const getShadowColor = useCallback(
    (color: ParticleColor, isDarkMode: boolean): string => {
      const shadowMap = {
        primary: isDarkMode ? "#BEF264" : "#65A30D",
        secondary: isDarkMode ? "#6366F1" : "#4F46E5",
        accent: isDarkMode ? "#EC4899" : "#DB2777",
      };
      return shadowMap[color];
    },
    []
  );

  // Initialize particles array
  const initializeParticles = useCallback(
    (canvas: HTMLCanvasElement): Particle[] => {
      const particles: Particle[] = [];

      for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
        const colors: ParticleColor[] = ["primary", "secondary", "accent"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          opacity: Math.random() * 0.3 + 0.1,
          color: randomColor,
          pulse: Math.random() * Math.PI * 2,
        });
      }

      return particles;
    },
    []
  );

  // Initialize stars array
  const initializeStars = useCallback((): Star[] => {
    const stars: Star[] = [];

    for (let i = 0; i < CONFIG.STAR_COUNT; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = Math.random() * 1000;

      stars.push({
        x,
        y,
        z,
        prevX: x,
        prevY: y,
      });
    }

    return stars;
  }, []);

  // Canvas animation system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    // Initialize animation elements
    const particles = initializeParticles(canvas);
    const stars = initializeStars();

    // Mouse interaction handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    // Animation loop
    const animate = () => {
      const isDarkMode = document.documentElement.classList.contains("dark");

      // Clear canvas with subtle trail effect
      ctx.fillStyle = isDarkMode
        ? `rgba(26, 26, 26, ${CONFIG.CANVAS_ALPHA})`
        : `rgba(255, 255, 255, ${CONFIG.CANVAS_ALPHA})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Animate and render stars
      renderStars(ctx, stars, canvas, isDarkMode);

      // Animate and render particles
      renderParticles(ctx, particles, canvas, isDarkMode);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Star rendering function
    const renderStars = (
      ctx: CanvasRenderingContext2D,
      stars: Star[],
      canvas: HTMLCanvasElement,
      isDarkMode: boolean
    ) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      stars.forEach((star) => {
        star.prevX = star.x / (star.z * 0.001);
        star.prevY = star.y / (star.z * 0.001);

        star.z -= CONFIG.STAR_SPEED;

        // Reset star when it reaches the front
        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * 2000;
          star.y = (Math.random() - 0.5) * 2000;
          star.z = 1000;
          star.prevX = star.x / (star.z * 0.001);
          star.prevY = star.y / (star.z * 0.001);
        }

        const x = star.x / (star.z * 0.001);
        const y = star.y / (star.z * 0.001);

        // Draw star trail
        ctx.beginPath();
        ctx.moveTo(centerX + star.prevX, centerY + star.prevY);
        ctx.lineTo(centerX + x, centerY + y);
        ctx.strokeStyle = isDarkMode
          ? `rgba(190, 242, 100, ${(1 - star.z / 1000) * 0.2})`
          : `rgba(101, 163, 13, ${(1 - star.z / 1000) * 0.15})`;
        ctx.lineWidth = (2 - star.z / 1000) * 0.5;
        ctx.stroke();
      });
    };

    // Particle rendering function
    const renderParticles = (
      ctx: CanvasRenderingContext2D,
      particles: Particle[],
      canvas: HTMLCanvasElement,
      isDarkMode: boolean
    ) => {
      particles.forEach((particle, i) => {
        // Update particle pulse animation
        particle.pulse += 0.03;
        const pulseFactor = 1 + Math.sin(particle.pulse) * 0.3;

        // Mouse interaction physics
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < CONFIG.MOUSE_INTERACTION_RADIUS) {
          const force =
            (CONFIG.MOUSE_INTERACTION_RADIUS - distance) /
            CONFIG.MOUSE_INTERACTION_RADIUS;
          particle.speedX -= (dx / distance) * force * 0.015;
          particle.speedY -= (dy / distance) * force * 0.015;
        }

        // Update particle position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Apply physics damping
        particle.speedX *= 0.995;
        particle.speedY *= 0.995;

        // Wrap particles around screen edges
        const buffer = 100;
        if (particle.x > canvas.width + buffer) particle.x = -buffer;
        if (particle.x < -buffer) particle.x = canvas.width + buffer;
        if (particle.y > canvas.height + buffer) particle.y = -buffer;
        if (particle.y < -buffer) particle.y = canvas.height + buffer;

        // Render particle with glow effect
        const particleColor = getParticleColor(
          particle.color,
          isDarkMode,
          particle.opacity
        );
        const shadowColor = getShadowColor(particle.color, isDarkMode);

        ctx.shadowBlur = 8;
        ctx.shadowColor = shadowColor;
        ctx.beginPath();
        ctx.arc(
          particle.x,
          particle.y,
          particle.size * pulseFactor,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = particleColor;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connections between nearby particles
        particles.forEach((particle2, j) => {
          if (i !== j) {
            const dx = particle.x - particle2.x;
            const dy = particle.y - particle2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < CONFIG.PARTICLE_CONNECTION_DISTANCE) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(particle2.x, particle2.y);

              const opacity =
                (1 - distance / CONFIG.PARTICLE_CONNECTION_DISTANCE) * 0.1;
              ctx.strokeStyle = isDarkMode
                ? `rgba(190, 242, 100, ${opacity})`
                : `rgba(101, 163, 13, ${opacity})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        });
      });
    };

    // Start animation and add event listeners
    animate();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);

    // Trigger loaded state
    const loadTimer = setTimeout(() => setIsLoaded(true), 100);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearTimeout(loadTimer);
    };
  }, [initializeParticles, initializeStars, getParticleColor, getShadowColor]);

  // Animation variants for consistent motion
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-[#0a0a0a] dark:via-[#1a1a1a] dark:to-[#2a2a2a] text-gray-900 dark:text-white relative overflow-hidden">
      {/* Animated background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/90 dark:from-[#0a0a0a]/90 via-white/70 dark:via-[#1a1a1a]/70 to-white/90 dark:to-[#0a0a0a]/90 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0a0a0a] via-transparent to-transparent z-10" />

      {/* Floating ambient elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-primary-light/10 to-blue-500/10 dark:from-[#BEF264]/10 dark:to-blue-400/10 rounded-full blur-xl animate-pulse" />
      <div
        className="absolute top-1/3 right-1/4 w-48 h-48 bg-gradient-to-br from-purple-500/5 to-pink-500/5 dark:from-purple-400/5 dark:to-pink-400/5 rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-br from-green-500/5 to-primary-light/5 dark:from-green-400/5 dark:to-[#BEF264]/5 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      {/* Social media links sidebar */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: CONFIG.ANIMATION_DELAYS.SOCIAL, duration: 0.8 }}
        className="fixed right-6 top-0 h-screen flex flex-col items-center justify-center z-40 gap-6"
      >
        <div className="flex flex-col gap-4">
          {socialLinks.map(({ icon: Icon, href, label, color }, index) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: CONFIG.ANIMATION_DELAYS.SOCIAL + 0.2 + index * 0.1,
              }}
              whileHover={{
                scale: 1.3,
                rotate: [0, -10, 10, 0],
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.9 }}
              className={`text-gray-500 dark:text-gray-400 ${color} transition-all duration-300 hover:drop-shadow-[0_0_12px_currentColor] relative group`}
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
          ))}
        </div>
      </motion.div>

      {/* Main hero content */}
      <section className="min-h-screen flex items-center justify-center relative z-20">
        <div className="text-center px-4 max-w-4xl mx-auto">
          {/* Greeting */}
          <motion.div
            {...fadeInUp}
            transition={{
              duration: 0.8,
              delay: CONFIG.ANIMATION_DELAYS.GREETING,
            }}
            className="mb-6"
          >
            <span className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-light">
              👋 Hello there! I'm
            </span>
          </motion.div>

          {/* Name with shimmer effect */}
          <motion.h1
            {...fadeInUp}
            transition={{ duration: 0.8, delay: CONFIG.ANIMATION_DELAYS.NAME }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 relative"
          >
            <span className="text-gray-900 dark:text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_4px_8px_rgba(255,255,255,0.1)]">
              Gagana Methmal
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-light/20 dark:via-[#BEF264]/20 to-transparent blur-sm"
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

          {/* Animated role text */}
          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.8, delay: CONFIG.ANIMATION_DELAYS.ROLE }}
            className="text-xl md:text-3xl text-gray-600 dark:text-gray-300 mb-8 h-12 flex items-center justify-center"
          >
            <span className="mr-3">I'm a</span>
            <span
              ref={typedRef}
              className="text-primary-light dark:text-[#BEF264] font-semibold"
            />
          </motion.div>

          {/* Description */}
          <motion.p
            {...fadeInUp}
            transition={{
              duration: 0.8,
              delay: CONFIG.ANIMATION_DELAYS.DESCRIPTION,
            }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Passionate about creating innovative solutions and building scalable
            applications that make a difference in the digital world.
          </motion.p>

          {/* Call-to-action buttons */}
          <motion.div
            {...fadeInUp}
            transition={{
              duration: 0.8,
              delay: CONFIG.ANIMATION_DELAYS.BUTTONS,
            }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(190, 242, 100, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-primary-light to-green-600 dark:from-[#BEF264] dark:to-green-400 text-white dark:text-black px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 group flex items-center gap-3 min-w-[200px] justify-center"
              aria-label="Download Resume"
            >
              <span>Download Resume</span>
              <HiDownload className="group-hover:animate-bounce text-xl" />
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.05,
                borderColor: "rgb(190, 242, 100)",
              }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 min-w-[200px]"
              aria-label="View Portfolio"
            >
              View My Work
            </motion.button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ delay: CONFIG.ANIMATION_DELAYS.SCROLL }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400"
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
        </div>
      </section>
    </div>
  );
};

export default Home;
