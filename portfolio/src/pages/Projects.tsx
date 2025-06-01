import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaChevronLeft,
  FaPlay,
  FaPause,
  FaExpand,
} from "react-icons/fa";
import {
  SiReact,
  SiJavascript,
  SiTailwindcss,
  SiFirebase,
  SiTypescript,
  SiPython,
  SiNodedotjs,
  SiExpress,
  SiDocker,
  SiMongodb,
  SiRedis,
  SiGithubactions,
  SiPaypal,
  SiTensorflow,
  SiBootstrap,
  SiVite,
  SiFastapi,
  SiJest,
  SiHtml5,
  SiCss3,
  SiSharp,
  SiMysql,
  SiDotnet,
  SiGooglemaps,
  SiJenkins,
  SiFlutter,
  SiDart,
  SiUnity,
  SiBlender,
  SiRaspberrypi,
  SiOpencv,
  SiPhp,
} from "react-icons/si";
import { DiJava } from "react-icons/di";
import {
  HiOutlineTemplate,
  HiOutlineCube,
  HiOutlineMusicNote,
} from "react-icons/hi";

// Assets
import moodSyncImage1 from "../assets/1.png";
import moodSyncImage2 from "../assets/2.png";

// Constants
const ANIMATION_CONSTANTS = {
  AUTOPLAY_INTERVAL: 6000,
  TOUCH_THRESHOLD: 50,
  PARTICLE_COUNT: { mobile: 20, desktop: 50 },
  CONNECTION_DISTANCE: 150,
} as const;

const BREAKPOINTS = {
  mobile: 768,
  small: 640,
} as const;

// Types
interface Technology {
  name: string;
  icon: React.ElementType;
  color: string;
}

interface Project {
  id: number;
  title: string;
  subtitle: string;
  period: string;
  description: string;
  role: string;
  technologies: Technology[];
  images: string[];
  github?: string;
  live?: string;
  featured?: boolean;
}

interface ParticleAnimationProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

interface ProjectImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

interface ImageModalProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

// Project Images Mapping
const projectImages = {
  moodSync: {
    main: moodSyncImage1,
    secondary: moodSyncImage2,
  },
} as const;

// Technologies Configuration
const createTech = (
  name: string,
  icon: React.ElementType,
  color: string
): Technology => ({
  name,
  icon,
  color,
});

const TECHNOLOGIES = {
  // Frontend
  react: createTech("React", SiReact, "#61DAFB"),
  typescript: createTech("TypeScript", SiTypescript, "#3178C6"),
  javascript: createTech("JavaScript", SiJavascript, "#F7DF1E"),
  html5: createTech("HTML5", SiHtml5, "#E34F26"),
  css3: createTech("CSS3", SiCss3, "#1572B6"),
  tailwind: createTech("Tailwind CSS", SiTailwindcss, "#06B6D4"),
  vite: createTech("Vite", SiVite, "#646CFF"),
  bootstrap: createTech("Flowbite", SiBootstrap, "#7952B3"),

  // Backend
  python: createTech("Python", SiPython, "#3776AB"),
  nodejs: createTech("Node.js", SiNodedotjs, "#339933"),
  express: createTech("Express.js", SiExpress, "#000000"),
  fastapi: createTech("FastAPI", SiFastapi, "#009688"),
  csharp: createTech("C#", SiSharp, "#239120"),
  java: createTech("Java", DiJava, "#007396"),
  php: createTech("PHP", SiPhp, "#777BB4"),
  aspnet: createTech("ASP.NET", SiDotnet, "#512BD4"),

  // Databases
  mongodb: createTech("MongoDB", SiMongodb, "#47A248"),
  mysql: createTech("MySQL", SiMysql, "#4479A1"),
  redis: createTech("Redis", SiRedis, "#DC382D"),
  firebase: createTech("Firebase", SiFirebase, "#FFCA28"),
  sqlite: createTech("SQLite", HiOutlineTemplate, "#003B57"),

  // Mobile & Game Development
  flutter: createTech("Flutter", SiFlutter, "#02569B"),
  dart: createTech("Dart", SiDart, "#0175C2"),
  unity: createTech("Unity", SiUnity, "#000000"),

  // AI/ML & Tools
  tensorflow: createTech("NLP/ML", SiTensorflow, "#FF6F00"),
  opencv: createTech("OpenCV", SiOpencv, "#5C3EE8"),
  yolo: createTech("YOLOv8", SiTensorflow, "#FF6F00"),
  easyocr: createTech("EasyOCR", SiTensorflow, "#FF6F00"),

  // DevOps & Infrastructure
  docker: createTech("Docker", SiDocker, "#2496ED"),
  githubActions: createTech("GitHub Actions", SiGithubactions, "#2088FF"),
  jenkins: createTech("Jenkins", SiJenkins, "#D24939"),

  // Hardware & IoT
  raspberrypi: createTech("Raspberry Pi", SiRaspberrypi, "#A22846"),

  // Testing & Quality
  jest: createTech("Jest", SiJest, "#C21325"),

  // Design & 3D
  blender: createTech("Blender", SiBlender, "#F5792A"),

  // APIs & Services
  paypal: createTech("PayPal API", SiPaypal, "#00457C"),
  googlemaps: createTech("Google Maps", SiGooglemaps, "#4285F4"),

  // Other Tools
  arcore: createTech("ARCore", HiOutlineCube, "#4285F4"),
  fishnet: createTech("Fish-Net API", HiOutlineTemplate, "#00BCD4"),
  audio: createTech("Audio Tools", HiOutlineMusicNote, "#FF9800"),
  pyqt: createTech("PyQt", SiPython, "#3776AB"),
  zustand: createTech("Zustand", HiOutlineCube, "#FF6B6B"),
  matlab: createTech("MATLAB", HiOutlineTemplate, "#0076A8"),
  neural: createTech("Neural Networks", SiTensorflow, "#FF6F00"),
  statistical: createTech("Statistical Analysis", HiOutlineCube, "#FF6B6B"),
  featureEng: createTech("Feature Engineering", SiTensorflow, "#FF6F00"),
  jakartaEE: createTech("Jakarta EE", DiJava, "#007396"),
} as const;

// Custom Hooks
const useIntersectionObserver = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};

const useParticleAnimation = ({ canvasRef }: ParticleAnimationProps) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < BREAKPOINTS.mobile;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();

    // Initialize particles
    const particles = Array.from(
      {
        length: isMobile
          ? ANIMATION_CONSTANTS.PARTICLE_COUNT.mobile
          : ANIMATION_CONSTANTS.PARTICLE_COUNT.desktop,
      },
      () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (isMobile ? 2 : 3) + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1,
        pulsePhase: Math.random() * Math.PI * 2,
      })
    );

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.016;

      particles.forEach((particle, index) => {
        const pulse = Math.sin(time * 2 + particle.pulsePhase) * 0.5 + 0.5;
        const currentOpacity = particle.opacity * (0.5 + pulse * 0.5);
        const currentSize = particle.size * (0.8 + pulse * 0.4);

        // Render particle glow (desktop only)
        if (!isMobile) {
          ctx.save();
          ctx.globalAlpha = currentOpacity;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, currentSize * 3, 0, Math.PI * 2);

          const gradient = ctx.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            currentSize * 3
          );
          gradient.addColorStop(0, "rgba(190, 242, 100, 0.3)");
          gradient.addColorStop(1, "rgba(190, 242, 100, 0)");
          ctx.fillStyle = gradient;
          ctx.fill();
          ctx.restore();
        }

        // Render particle core
        ctx.save();
        ctx.globalAlpha = currentOpacity * 1.5;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = "#BEF264";
        ctx.fill();
        ctx.restore();

        // Update particle position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around screen edges
        if (particle.x > canvas.width + 10) particle.x = -10;
        if (particle.x < -10) particle.x = canvas.width + 10;
        if (particle.y > canvas.height + 10) particle.y = -10;
        if (particle.y < -10) particle.y = canvas.height + 10;

        // Draw connections between nearby particles (desktop only)
        if (!isMobile) {
          particles.slice(index + 1).forEach((otherParticle) => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < ANIMATION_CONSTANTS.CONNECTION_DISTANCE) {
              ctx.save();
              ctx.globalAlpha =
                (1 - distance / ANIMATION_CONSTANTS.CONNECTION_DISTANCE) * 0.2;
              ctx.strokeStyle = "#BEF264";
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
              ctx.restore();
            }
          });
        }
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => setCanvasSize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, [canvasRef]);
};

// Components
const ProjectImage = ({
  src,
  alt,
  className = "",
  priority = false,
}: ProjectImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const LoadingSpinner = () => (
    <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
      <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-[#BEF264] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const ErrorState = () => (
    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
      <div className="text-gray-500 text-center">
        <HiOutlineTemplate
          size={window.innerWidth < BREAKPOINTS.mobile ? 32 : 48}
        />
        <p className="mt-2 text-xs md:text-sm">Image not available</p>
      </div>
    </div>
  );

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !hasError && <LoadingSpinner />}
      {hasError ? (
        <ErrorState />
      ) : (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          loading={priority ? "eager" : "lazy"}
        />
      )}
    </div>
  );
};

const ImageModal = ({ src, alt, isOpen, onClose }: ImageModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-2 md:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative max-w-4xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-contain rounded-lg"
            />
            <button
              onClick={onClose}
              className="absolute top-2 right-2 md:top-4 md:right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors text-sm md:text-base"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const TechnologyBadge = ({
  tech,
  index,
  isVisible,
}: {
  tech: Technology;
  index: number;
  isVisible: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : {}}
    transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
    whileHover={{ scale: 1.1, y: -5 }}
    whileTap={{ scale: 0.95 }}
    className="group relative"
  >
    <div className="bg-gradient-to-r from-[#BEF264] to-[#a3e635] text-black px-3 md:px-5 py-2 md:py-3 rounded-full text-xs md:text-sm font-bold flex items-center gap-2 md:gap-3 shadow-lg hover:shadow-[#BEF264]/25 transition-all duration-300">
      <tech.icon
        size={14}
        className="md:w-[18px] md:h-[18px] group-hover:scale-110 transition-transform"
      />
      <span className="hidden sm:inline">{tech.name}</span>
    </div>
    <div className="absolute -top-1 md:-top-2 left-1/2 transform -translate-x-1/2 w-1 md:w-2 h-1 md:h-2 bg-[#BEF264] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </motion.div>
);

const NavigationButton = ({
  direction,
  onClick,
  disabled,
  className = "",
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
  className?: string;
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    disabled={disabled}
    className={`flex-shrink-0 p-2 md:p-4 bg-gray-900/90 backdrop-blur-sm rounded-full text-white hover:bg-gray-800 transition-all shadow-2xl ${
      disabled
        ? "opacity-30 cursor-not-allowed"
        : "hover:shadow-lg hover:shadow-[#BEF264]/20 opacity-80 hover:opacity-100"
    } ${className}`}
  >
    <FaChevronLeft
      size={16}
      className={`md:w-6 md:h-6 ${
        direction === "next" ? "transform rotate-180" : ""
      }`}
    />
  </motion.button>
);

const ProjectCard = ({
  project,
  index,
  isVisible,
}: {
  project: Project;
  index: number;
  isVisible: boolean;
}) => {
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const isMobile = window.innerWidth < BREAKPOINTS.small;
  const maxTechToShow = isMobile ? 6 : project.technologies.length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="min-w-full snap-center"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
          {/* Project Information */}
          <motion.div
            className="space-y-4 md:space-y-6 lg:space-y-8 order-2 lg:order-1"
            initial={{ x: -50, opacity: 0 }}
            animate={isVisible ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Header */}
            <div className="space-y-2 md:space-y-4">
              <motion.div
                initial={{ width: 0 }}
                animate={isVisible ? { width: "100%" } : {}}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-0.5 md:h-1 bg-gradient-to-r from-[#BEF264] to-transparent rounded-full"
              />

              <div>
                <motion.h3
                  className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#BEF264] mb-2 md:mb-3 leading-tight"
                  initial={{ y: 20, opacity: 0 }}
                  animate={isVisible ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {project.title}
                </motion.h3>

                <motion.p
                  className="text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl mb-1 md:mb-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={isVisible ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {project.subtitle}
                </motion.p>

                <motion.div
                  className="flex items-center gap-2 md:gap-3 text-gray-500"
                  initial={{ y: 20, opacity: 0 }}
                  animate={isVisible ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-[#BEF264] rounded-full" />
                  <span className="text-xs md:text-sm font-medium">
                    {project.period}
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Description */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={isVisible ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="prose prose-invert max-w-none"
            >
              <p className="text-gray-300 leading-relaxed text-sm md:text-base lg:text-lg line-clamp-4 md:line-clamp-none">
                {project.description}
              </p>
            </motion.div>

            {/* Role */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={isVisible ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex items-center gap-2 md:gap-3 p-3 md:p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg md:rounded-xl border border-gray-700/50"
            >
              <div className="w-2 md:w-3 h-2 md:h-3 bg-[#BEF264] rounded-full animate-pulse" />
              <span className="text-gray-400 text-sm md:text-base font-medium">
                Role:
              </span>
              <span className="text-white text-sm md:text-base font-semibold">
                {project.role}
              </span>
            </motion.div>

            {/* Technologies */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={isVisible ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="space-y-3 md:space-y-4"
            >
              <h4 className="text-base md:text-lg font-semibold text-gray-300">
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {project.technologies.slice(0, maxTechToShow).map((tech, i) => (
                  <TechnologyBadge
                    key={i}
                    tech={tech}
                    index={i}
                    isVisible={isVisible}
                  />
                ))}
                {isMobile && project.technologies.length > maxTechToShow && (
                  <div className="text-xs text-gray-400 flex items-center">
                    +{project.technologies.length - maxTechToShow} more
                  </div>
                )}
              </div>
            </motion.div>

            {/* Action Links */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={isVisible ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex flex-wrap gap-3 md:gap-4 pt-2 md:pt-4"
            >
              {project.github && (
                <motion.a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center gap-2 md:gap-3 bg-gray-800 hover:bg-gray-700 px-4 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl transition-all duration-300 border border-gray-700 hover:border-gray-600 shadow-lg hover:shadow-xl text-sm md:text-base"
                >
                  <FaGithub
                    size={18}
                    className="md:w-[22px] md:h-[22px] group-hover:scale-110 transition-transform"
                  />
                  <span className="font-medium">View Source</span>
                </motion.a>
              )}
              {project.live && (
                <motion.a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center gap-2 md:gap-3 bg-gradient-to-r from-[#BEF264] to-[#a3e635] text-black hover:from-[#a3e635] hover:to-[#84cc16] px-4 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-[#BEF264]/25 text-sm md:text-base"
                >
                  <FaExternalLinkAlt
                    size={14}
                    className="md:w-[18px] md:h-[18px] group-hover:scale-110 transition-transform"
                  />
                  <span>Live Demo</span>
                </motion.a>
              )}
            </motion.div>
          </motion.div>

          {/* Project Images */}
          <motion.div
            className="relative h-[400px] md:h-[500px] lg:h-[700px] group order-1 lg:order-2"
            initial={{ x: 50, opacity: 0 }}
            animate={isVisible ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Background Effects */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-[#BEF264]/5 via-transparent to-[#BEF264]/10 rounded-3xl blur-xl" />
            <div className="hidden lg:block absolute -top-8 -right-8 w-40 h-40 bg-[#BEF264]/10 rounded-full blur-3xl group-hover:bg-[#BEF264]/20 transition-all duration-1000" />
            <div className="hidden lg:block absolute -bottom-8 -left-8 w-32 h-32 bg-[#BEF264]/5 rounded-full blur-2xl group-hover:bg-[#BEF264]/15 transition-all duration-1000" />

            {/* Main Image */}
            <motion.div
              initial={{ scale: 0.9, rotateY: -10 }}
              animate={isVisible ? { scale: 1, rotateY: 0 } : {}}
              transition={{ duration: 1, delay: 0.6 }}
              className="absolute top-0 right-0 w-[85%] md:w-[75%] h-[55%] md:h-[60%] group-hover:scale-105 group-hover:-rotate-1 transition-all duration-700"
            >
              <div className="relative w-full h-full rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl border border-gray-700/30 group-hover:border-[#BEF264]/40 transition-all duration-700">
                <ProjectImage
                  src={project.images[0]}
                  alt={`${project.title} main view`}
                  className="rounded-xl md:rounded-2xl"
                  priority={index === 0}
                />

                {/* Holographic overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#BEF264]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Expand button */}
                <motion.button
                  onClick={() =>
                    setSelectedImage({
                      src: project.images[0],
                      alt: `${project.title} main view`,
                    })
                  }
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-2 right-2 md:top-4 md:right-4 p-2 md:p-3 bg-black/50 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70"
                >
                  <FaExpand size={12} className="md:w-4 md:h-4" />
                </motion.button>

                {/* Shimmer effect */}
                <div className="hidden md:block absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
              </div>
            </motion.div>

            {/* Secondary Image */}
            <motion.div
              initial={{ scale: 0.9, rotateY: 10 }}
              animate={isVisible ? { scale: 1, rotateY: 0 } : {}}
              transition={{ duration: 1, delay: 0.8 }}
              className="absolute bottom-0 left-0 w-[80%] md:w-[70%] h-[50%] md:h-[55%] group-hover:scale-105 group-hover:rotate-1 group-hover:-translate-y-4 transition-all duration-700"
            >
              <div className="relative w-full h-full rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl border border-gray-700/30 group-hover:border-[#BEF264]/40 transition-all duration-700">
                <ProjectImage
                  src={project.images[1] || project.images[0]}
                  alt={`${project.title} secondary view`}
                  className="rounded-xl md:rounded-2xl"
                />

                {/* Holographic overlay */}
                <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-[#BEF264]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Expand button */}
                <motion.button
                  onClick={() =>
                    setSelectedImage({
                      src: project.images[1] || project.images[0],
                      alt: `${project.title} secondary view`,
                    })
                  }
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-2 right-2 md:top-4 md:right-4 p-2 md:p-3 bg-black/50 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70"
                >
                  <FaExpand size={12} className="md:w-4 md:h-4" />
                </motion.button>

                {/* Shimmer effect */}
                <div className="hidden md:block absolute inset-0 translate-x-full group-hover:-translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12" />
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="hidden md:block absolute top-1/3 left-1/5 w-3 md:w-4 h-3 md:h-4 bg-[#BEF264] rounded-full group-hover:scale-150 group-hover:bg-[#BEF264]/80 transition-all duration-700 animate-pulse"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="hidden lg:block absolute bottom-1/3 right-1/5 w-3 h-3 bg-[#BEF264]/70 rounded-full group-hover:scale-200 group-hover:bg-[#BEF264] transition-all duration-700 animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 1.6 }}
              className="hidden lg:block absolute top-3/4 right-1/4 w-2 h-2 bg-[#BEF264]/50 rounded-full group-hover:scale-300 group-hover:bg-[#BEF264]/90 transition-all duration-700 animate-pulse"
              style={{ animationDelay: "1s" }}
            />

            {/* Orbital Animation */}
            <motion.div
              className="hidden lg:block absolute inset-0 pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="relative w-full h-full">
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#BEF264]/30 rounded-full animate-ping" />
                <div
                  className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-[#BEF264]/30 rounded-full animate-ping"
                  style={{ animationDelay: "1s" }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Image Modal */}
      <ImageModal
        src={selectedImage?.src || ""}
        alt={selectedImage?.alt || ""}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </>
  );
};

// Projects Data
const useProjectsData = (): Project[] => {
  return useMemo(
    () => [
      // 1. MoodSync
      {
        id: 1,
        title: "MoodSync - Mental Health Monitoring System",
        subtitle: "AI-Powered Mental Health Platform",
        period: "Oct 2024 - May 2025",
        description:
          "Developed a comprehensive AI-powered mental health monitoring platform as my final year Software Engineering project, addressing the critical need for early mental health intervention and suicide prevention. The system analyzes user-generated content including journal entries, mood logs, and social media posts using NLP and sentiment analysis to detect concerning patterns and predict potential mental health crises. Key features include real-time emergency alerts, anonymous chat functionality with healthcare professionals, and personalized recommendations. Designed with a focus on the Sri Lankan community while maintaining global accessibility.",
        role: "Software Developer",
        technologies: [
          TECHNOLOGIES.react,
          TECHNOLOGIES.typescript,
          TECHNOLOGIES.vite,
          TECHNOLOGIES.tailwind,
          TECHNOLOGIES.bootstrap,
          TECHNOLOGIES.python,
          TECHNOLOGIES.fastapi,
          TECHNOLOGIES.nodejs,
          TECHNOLOGIES.express,
          TECHNOLOGIES.tensorflow,
          TECHNOLOGIES.githubActions,
          TECHNOLOGIES.docker,
        ],
        images: [projectImages.moodSync.main, projectImages.moodSync.secondary],
        featured: true,
      },

      // 2. AR Chess
      {
        id: 2,
        title: "Augmented Reality Chess",
        subtitle: "Educational Software Development",
        period: "Sep 2023 - Mar 2024",
        description:
          "Our team embarked on a year-long project during our 2nd-year module in Computing Group Project with the ambitious goal of revolutionizing the world of chess gaming. Our innovative approach involved merging augmented reality (AR) and real-time multiplayer dynamics to create an immersive experience for players worldwide. Leveraging tools like Unity, C#, and ARCore, we crafted a platform that transcends traditional gaming boundaries. Our platform not only provides an online competitive environment but also serves as educational software, offering guidance on chess moves for beginners and incorporating accessibility features for visually impaired users.",
        role: "AR, Backend Developer",
        technologies: [
          TECHNOLOGIES.csharp,
          TECHNOLOGIES.unity,
          TECHNOLOGIES.firebase,
          TECHNOLOGIES.arcore,
          TECHNOLOGIES.blender,
          TECHNOLOGIES.fishnet,
          TECHNOLOGIES.audio,
        ],
        images: [
          "https://media.licdn.com/dms/image/v2/D5622AQF8iUIv2mr0-A/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1720102802772?e=1751500800&v=beta&t=tehSab_XmKf5Zy0M1KbTlVFVyjqz5G2I1uypOKYPPhQ",
          "https://media.licdn.com/dms/image/v2/D5622AQFN15s9XhSvTw/feedshare-shrink_800/feedshare-shrink_800/0/1720102800997?e=1751500800&v=beta&t=2JkmfaOVsLm5M_Ya_JU1nTNGwuj6BMODIqbmkimaI7Y",
        ],
        github: "https://github.com/theRealUnd3rdog/AR-Chess.git",
      },

      // 3. Highway
      {
        id: 3,
        title: "Highway Entrance Automation",
        subtitle: "IoT Solution",
        period: "Sep 2023 - Mar 2024",
        description:
          "Our cutting-edge highway entrance automation system revolutionizes transportation infrastructure, developed through our 2nd whole year module, Introduction to IoT. Unlike the existing Electronic Toll Collection (ETC) system in Sri Lanka, which often relies on costly RFID technology and manual registration, our solution eliminates these barriers. We've meticulously trained our machine learning models to ensure accuracy, conducting thorough test runs to validate performance. Notably, our system has been optimized to recognize Sri Lankan Sinhala license plates, ensuring inclusivity and accuracy for all drivers.",
        role: "IoT, Model Developer",
        technologies: [
          TECHNOLOGIES.python,
          TECHNOLOGIES.raspberrypi,
          TECHNOLOGIES.sqlite,
          TECHNOLOGIES.opencv,
          TECHNOLOGIES.yolo,
          TECHNOLOGIES.easyocr,
          TECHNOLOGIES.pyqt,
        ],
        images: [
          "https://media.licdn.com/dms/image/v2/D5622AQHi8eq3T4W95Q/feedshare-shrink_1280/feedshare-shrink_1280/0/1717496885555?e=1751500800&v=beta&t=ThOQLgKoimc3trK0AuCAHWxeYMkZS8rApg7_FDBGD9o",
          "https://media.licdn.com/dms/image/v2/D5622AQGXn1t2bg9-bA/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1717496886210?e=1751500800&v=beta&t=z1yK4x_IxPPRjvdfeupI-qZeeyIGavBo03t_rfFJZxM",
        ],
        github: "https://github.com/CDevmina/IOT.git",
      },

      // 4. Scoop
      {
        id: 4,
        title: "Scoop Cinema - Cinema Booking System",
        subtitle: "Full Stack Cinema Management Platform",
        period: "Dec 2024 - Jan 2025",
        description:
          "Developed a comprehensive cinema booking system as part of module full stack development in 3rd year, 1st semester, featuring real-time seat selection, secure payment processing, and an intuitive user interface. The application serves both customers and administrators, offering seamless movie browsing, ticket booking, and theater management capabilities. Implemented real-time seat availability updates using WebSocket technology, integrated PayPal for secure transactions, and built a robust admin panel for complete CRUD operations on movies, schedules, and bookings.",
        role: "Full Stack Developer",
        technologies: [
          TECHNOLOGIES.react,
          TECHNOLOGIES.vite,
          TECHNOLOGIES.tailwind,
          TECHNOLOGIES.bootstrap,
          TECHNOLOGIES.javascript,
          TECHNOLOGIES.nodejs,
          TECHNOLOGIES.mongodb,
          TECHNOLOGIES.redis,
          TECHNOLOGIES.jest,
          TECHNOLOGIES.githubActions,
          TECHNOLOGIES.docker,
          TECHNOLOGIES.paypal,
        ],
        images: [
          "https://media.licdn.com/dms/image/v2/D5622AQHXOx66ltS8vw/feedshare-shrink_2048_1536/B56ZcGN_SMGsAo-/0/1748156023479?e=1751500800&v=beta&t=pUjU2KRJyMXdC3G7OhoVX2mRBluKDadUZxVbulffbJs",
          "https://media.licdn.com/dms/image/v2/D5622AQEq0Gw7fcJOSA/feedshare-shrink_2048_1536/B56ZcGN_R9G4Ao-/0/1748156020642?e=1751500800&v=beta&t=Xo3lEM6SpgZDxI__Fn3vsU0ATE4P5ApKtn3eeinNkcU",
        ],
        github: "https://github.com/CDevmina/full-stack-app.git",
      },

      // 5. PACMANz
      {
        id: 5,
        title: "PACMANz",
        subtitle: "Enhanced Pacman Game",
        period: "May 2023 - Jun 2023",
        description:
          "Introducing Project PACMANz, our extraordinary software development project, the enhanced version of the legendary 1980 Pacman game! Developed as part of our 1st year, 2nd semester module Object-Oriented Programming with C# final assessment, this project showcases our proficiency in OOP concepts. With stunning graphics and a range of special abilities, we have created an immersive gaming experience. Our implementation of the cutting-edge A* algorithm ensures dynamic ghost pathfinding functionality. We have also crafted unique assets and captivating sounds.",
        role: "Backend Developer",
        technologies: [
          TECHNOLOGIES.csharp,
          TECHNOLOGIES.unity,
          TECHNOLOGIES.firebase,
          TECHNOLOGIES.blender,
          createTech("A* Algorithm", HiOutlineCube, "#4CAF50"),
          TECHNOLOGIES.audio,
        ],
        images: [
          "https://media.licdn.com/dms/image/v2/D5622AQGagdZvpBEvqQ/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1689884768445?e=1751500800&v=beta&t=iprGSaAeCR1hZ68eF8N4DLM4zfNylghTzZ3AIJXKRqk",
          "https://media.licdn.com/dms/image/v2/D5622AQHpQCKIRyvTMA/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1689884771396?e=1751500800&v=beta&t=k0-i5LEu34-TVffhFqz7cINEbYfuFvsOvzd3XhzrNA4",
        ],
        github: "https://github.com/theRealUnd3rdog/PACMANz.git",
      },

      // 6. IKAE
      {
        id: 6,
        title: "IKAE - Furniture Design and Visualization",
        subtitle: "3D Furniture Visualization Web Application",
        period: "Apr 2025 - May 2025",
        description:
          "3rd Year 2nd Semester coursework project for HCI, Computer Graphics, and Visualization module. Developed a web-based 3D furniture visualization tool that enables customers to preview furniture arrangements in their rooms before purchasing. The application allows users to configure room dimensions, shapes, and color schemes, then place and customize furniture items in both 2D floor plan and interactive 3D views. Features include real-time rendering, material customization, lighting adjustments, and design saving functionality. Implemented role-based access for designers and administrators to manage the furniture catalog and customer interactions.",
        role: "Frontend Developer",
        technologies: [
          TECHNOLOGIES.react,
          TECHNOLOGIES.vite,
          TECHNOLOGIES.javascript,
          TECHNOLOGIES.tailwind,
          TECHNOLOGIES.bootstrap,
          TECHNOLOGIES.zustand,
          TECHNOLOGIES.firebase,
        ],
        images: [
          "https://media.licdn.com/dms/image/v2/D4E22AQEe-rU2C5BIoA/feedshare-shrink_2048_1536/B4EZcSK2E8HcAw-/0/1748356526202?e=1751500800&v=beta&t=YhYD2IidIWG1eZqBPOiQAkIx0haH09BM9UPOG-GRrTw",
          "https://media.licdn.com/dms/image/v2/D4E22AQF9u5Jqk6VFdA/feedshare-shrink_2048_1536/B4EZcSK2FAHQA4-/0/1748356524224?e=1751500800&v=beta&t=VHxCCHLzSrPqY1OCbbrh5ThnpZ0zE72evmoNgXsckUc",
        ],
        github: "https://github.com/CDevmina/HCI-Group-Project.git",
        featured: true,
      },

      // 7. Acceleration
      {
        id: 7,
        title: "Acceleration-Based User Authentication System",
        subtitle: "Neural Network Authentication Research",
        period: "Nov 2024 - Dec 2024",
        description:
          "3rd Year 1st Semester coursework for AI and Machine Learning module. Developed a continuous user authentication system that uses acceleration data from smartphones and smartwatches to verify user identity based on their unique movement patterns. The system analyzes both time-domain and frequency-domain features extracted from accelerometer data to distinguish between authorized users and imposters. Implemented a Feedforward Multi-Layer Perceptron (FFMLP) neural network that achieved 99% accuracy after optimization through manual feature selection and hyperparameter tuning.",
        role: "AI/ML Developer",
        technologies: [
          TECHNOLOGIES.matlab,
          TECHNOLOGIES.neural,
          createTech("Machine Learning", SiPython, "#3776AB"),
          TECHNOLOGIES.statistical,
          TECHNOLOGIES.featureEng,
        ],
        images: [],
        github: "https://github.com/theRealUnd3rdog/UserAuth_CW.git",
      },

      // 8. Green Supermarket
      {
        id: 8,
        title: "Green Supermarket",
        subtitle: "Enterprise Web Application Development",
        period: "Nov 2023 - Dec 2023",
        description:
          "Introducing Project Green Supermarket build for 2nd year, 1st semester module Software Engineering 02 final coursework project. I contributed to creating a dynamic web application that features online shopping, avoided shopping collision, secure payment handling, customer feedback visualization and email verification/notification upon purchases and cancellations. To enhance user experience, we prioritized a user-friendly interface with a focus on the elderly demographic, incorporating custom UI/UX designs. The backend dynamically loaded products based on type, seamlessly integrating with client side to render responsive cards.",
        role: "Full Stack Developer",
        technologies: [
          TECHNOLOGIES.html5,
          TECHNOLOGIES.css3,
          TECHNOLOGIES.javascript,
          TECHNOLOGIES.java,
          TECHNOLOGIES.mysql,
          TECHNOLOGIES.jakartaEE,
          TECHNOLOGIES.paypal,
          TECHNOLOGIES.googlemaps,
        ],
        images: [
          "https://media.licdn.com/dms/image/v2/D5622AQE_WiPDfFgp8g/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1704089854519?e=1751500800&v=beta&t=TZ2Zub3qevmzkLkk9i5Doirh01M8RQ4rzyPlxdkIT5Y",
          "https://media.licdn.com/dms/image/v2/D5622AQGD47jUBWCcxQ/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1704089854328?e=1751500800&v=beta&t=4n-imRvgHGxawfx55dFqPOsXYeoQheM_ClGzcnnY8xg",
        ],
        github: "https://github.com/theRealUnd3rdog/UserAuth_CW.git",
      },

      // 9. Accommodation Locator
      {
        id: 9,
        title: "Accommodation Locator",
        subtitle: "Enterprise Web Application Development",
        period: "Mar 2024 - Apr 2024",
        description:
          "As part of our 2nd year 2nd semester module on Software Development Tools and Practices, my team and I developed a dynamic web application for our university's accommodation booking system. We created a user-friendly platform enabling landlords to showcase properties, the warden to validate listings, and students to reserve accommodations seamlessly. Implementing robust security measures and integrating database functionality ensured efficient data management and user authentication. Additionally, we integrated Maps to provide an intuitive interface for users to visualize property locations.",
        role: "Full Stack Developer",
        technologies: [
          TECHNOLOGIES.html5,
          TECHNOLOGIES.css3,
          TECHNOLOGIES.javascript,
          TECHNOLOGIES.csharp,
          createTech("SQL", HiOutlineTemplate, "#4479A1"),
          TECHNOLOGIES.aspnet,
          TECHNOLOGIES.googlemaps,
          TECHNOLOGIES.jenkins,
          TECHNOLOGIES.githubActions,
        ],
        images: [
          "https://media.licdn.com/dms/image/v2/D5622AQFXYL0SFwHEuQ/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1719155669741?e=1751500800&v=beta&t=QejrEg3LtnTJLCvO5PY6S7Mb6tzuO-81Xf3KQIRNGbY",
          "https://media.licdn.com/dms/image/v2/D5622AQEzym3dobgkrA/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1719155667542?e=1751500800&v=beta&t=4uB53qcR_VsRfZGV6rZstx1IWeJ9tpMUl-oZzDbp0vQ",
        ],
        github:
          "https://github.com/iamgaganam/Accommodation_Locator-ASP.NET_Web_Application.git",
      },

      // 10. Local Community Social Media
      {
        id: 10,
        title: "Local Community Social Media",
        subtitle: "Mobile Application Development",
        period: "Mar 2024 - Apr 2024",
        description:
          "Our team has developed a cutting-edge local community app developed for our 2nd year, 2nd semester module Mobile Application Development with the latest technologies and Maps integration. This user-friendly platform revolutionizes the way users connect with local and global events, placing community engagement at the forefront. Beyond traditional social media, our app allows users to effortlessly post, discover, and organize events, ensuring they never miss out on what's happening in their community locally and globally. With real-time updates and notifications, we're empowering users to stay informed and engaged like never before.",
        role: "Developer",
        technologies: [
          TECHNOLOGIES.dart,
          TECHNOLOGIES.flutter,
          TECHNOLOGIES.firebase,
          TECHNOLOGIES.googlemaps,
        ],
        images: [
          "https://media.licdn.com/dms/image/v2/D562DAQEyBV56UxUHAQ/profile-treasury-image-shrink_1920_1920/profile-treasury-image-shrink_1920_1920/0/1722147731714?e=1749304800&v=beta&t=WCfGcB25p6NArJCqjuRfZCzfrPa5GydZ-yGAsFMdMDU",
          "https://media.licdn.com/dms/image/v2/D562DAQHxGG6Dljf8hQ/profile-treasury-image-shrink_1920_1920/profile-treasury-image-shrink_1920_1920/0/1722147768376?e=1749304800&v=beta&t=S96efbDIKatVGeVbJwYdO4YuLPgbJiSby2M47FbWTU4",
        ],
        github: "https://github.com/Lakkitha/local_community.git",
      },

      // 11. NOSHOT
      {
        id: 11,
        title: "NOSHOT",
        subtitle: "Web Application Development",
        period: "Nov 2022 - Dec 2022",
        description:
          "In collaboration with a diverse team, I contributed to the development of a web application designed to showcase an engaging game created by our teammate, Kusal Videshan (Underdog), during our 1st-year, 2nd-semester module in Web Application Development final assessment. This project encompassed the creation of seven essential pages. We prioritized an intuitive UI/UX design, ensured full hosting and mobile responsiveness, and tested the application to guarantee its robustness and security.",
        role: "Web Developer",
        technologies: [
          TECHNOLOGIES.html5,
          TECHNOLOGIES.css3,
          TECHNOLOGIES.javascript,
          TECHNOLOGIES.php,
          TECHNOLOGIES.mysql,
        ],
        images: [
          "https://media.licdn.com/dms/image/v2/D562DAQHhagf0J0LePQ/profile-treasury-image-shrink_800_800/profile-treasury-image-shrink_800_800/0/1698427796346?e=1749308400&v=beta&t=xL0o2Lkt3NV5u_H7SuLpSROCSCd7q2UtQB61RJOak18",
          "https://media.licdn.com/dms/image/v2/D562DAQHx5Cl2_Yncxg/profile-treasury-image-shrink_800_800/profile-treasury-image-shrink_800_800/0/1698427837034?e=1749308400&v=beta&t=ap40CwNuyDD049gFaZO3xRtJsgIP4bO_VwW7npCwNl8",
        ],
        github: "https://github.com/Lakkitha/Website_project.git",
      },
    ],
    []
  );
};

// Main Component
const Projects = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { ref: sectionRef, isVisible } = useIntersectionObserver(0.1);
  const [currentProject, setCurrentProject] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const { scrollYProgress } = useScroll({ target: sectionRef });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const projects = useProjectsData();

  useParticleAnimation({ canvasRef });

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentProject((prev) => {
        const nextProject = prev === projects.length - 1 ? 0 : prev + 1;

        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const scrollAmount = container.clientWidth * nextProject;
          container.scrollTo({ left: scrollAmount, behavior: "smooth" });
        }

        return nextProject;
      });
    }, ANIMATION_CONSTANTS.AUTOPLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [isAutoPlay, projects.length]);

  // Navigation functions
  const scrollToProject = useCallback(
    (direction: "prev" | "next") => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth;

      if (direction === "next" && currentProject < projects.length - 1) {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
        setCurrentProject(currentProject + 1);
      } else if (direction === "prev" && currentProject > 0) {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        setCurrentProject(currentProject - 1);
      }
    },
    [currentProject, projects.length]
  );

  const jumpToProject = useCallback((index: number) => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = scrollContainerRef.current.clientWidth * index;
    scrollContainerRef.current.scrollTo({
      left: scrollAmount,
      behavior: "smooth",
    });
    setCurrentProject(index);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollToProject("prev");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollToProject("next");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scrollToProject]);

  // Touch gesture handling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let touchStartX = 0;
    let touchEndX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > ANIMATION_CONSTANTS.TOUCH_THRESHOLD) {
        if (diff > 0) {
          scrollToProject("next");
        } else {
          scrollToProject("prev");
        }
      }
    };

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [scrollToProject]);

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#1e1e1e] to-[#151515] text-white relative overflow-hidden py-10 md:py-20"
    >
      {/* Particle Background */}
      <motion.canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/50 via-transparent to-[#1a1a1a]/30 z-1" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(26,26,26,0.3)_70%)] z-1" />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#BEF264] to-[#4ade80] bg-clip-text text-transparent mb-2 md:mb-4">
            My Portfolio
          </h2>
          <div className="w-20 md:w-32 h-1 bg-[#BEF264] rounded-full" />
        </div>

        {/* Projects Carousel */}
        <div className="relative">
          {/* Controls */}
          <div className="flex justify-between items-center mb-4 md:mb-8">
            <div className="flex items-center gap-2 md:gap-4">
              {/* Auto-play Toggle */}
              <motion.button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-gray-800/80 backdrop-blur-sm rounded-full text-white hover:bg-gray-700 transition-all text-xs md:text-sm"
              >
                {isAutoPlay ? (
                  <FaPause size={12} className="md:w-4 md:h-4" />
                ) : (
                  <FaPlay size={12} className="md:w-4 md:h-4" />
                )}
                <span className="hidden sm:inline">
                  {isAutoPlay ? "Pause" : "Auto Play"}
                </span>
              </motion.button>

              {/* Project Counter */}
              <div className="text-xs md:text-sm text-gray-400">
                {currentProject + 1} / {projects.length}
              </div>
            </div>
          </div>

          {/* Projects Container */}
          <div className="flex items-center gap-2 md:gap-6">
            {/* Previous Button */}
            <NavigationButton
              direction="prev"
              onClick={() => scrollToProject("prev")}
              disabled={currentProject === 0}
            />

            {/* Projects Slider */}
            <div className="flex-1 relative">
              <div
                ref={scrollContainerRef}
                className="flex gap-4 md:gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {projects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    isVisible={isVisible}
                  />
                ))}
              </div>
            </div>

            {/* Next Button */}
            <NavigationButton
              direction="next"
              onClick={() => scrollToProject("next")}
              disabled={currentProject === projects.length - 1}
            />
          </div>

          {/* Progress Indicator */}
          <motion.div
            className="flex justify-center gap-2 md:gap-3 mt-6 md:mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {projects.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => jumpToProject(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`relative transition-all duration-500 ${
                  currentProject === index
                    ? "w-8 md:w-12 h-2 md:h-3 bg-gradient-to-r from-[#BEF264] to-[#a3e635] rounded-full shadow-lg shadow-[#BEF264]/50"
                    : "w-2 md:w-3 h-2 md:h-3 bg-gray-600 hover:bg-gray-500 rounded-full"
                }`}
              >
                {currentProject === index && (
                  <motion.div
                    className="absolute inset-0 bg-white/20 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
