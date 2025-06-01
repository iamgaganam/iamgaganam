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
  SiTwilio,
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

// Custom hook for intersection observer
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

// Custom hook for particle animation
const useParticleAnimation = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      pulsePhase: number;
    }> = [];

    // Create particles with better distribution
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.016;

      particles.forEach((particle, index) => {
        // Pulsing effect
        const pulse = Math.sin(time * 2 + particle.pulsePhase) * 0.5 + 0.5;
        const currentOpacity = particle.opacity * (0.5 + pulse * 0.5);
        const currentSize = particle.size * (0.8 + pulse * 0.4);

        // Draw particle with glow effect
        ctx.save();
        ctx.globalAlpha = currentOpacity;

        // Outer glow
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

        // Inner particle
        ctx.globalAlpha = currentOpacity * 1.5;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = "#BEF264";
        ctx.fill();
        ctx.restore();

        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x > canvas.width + 10) particle.x = -10;
        if (particle.x < -10) particle.x = canvas.width + 10;
        if (particle.y > canvas.height + 10) particle.y = -10;
        if (particle.y < -10) particle.y = canvas.height + 10;

        // Connect nearby particles
        particles.slice(index + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.save();
            ctx.globalAlpha = (1 - distance / 150) * 0.2;
            ctx.strokeStyle = "#BEF264";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      setCanvasSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, [canvasRef]);
};

// Enhanced Image Component with loading states
const ProjectImage = ({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#BEF264] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {hasError ? (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="text-gray-500 text-center">
            <HiOutlineTemplate size={48} />
            <p className="mt-2 text-sm">Image not available</p>
          </div>
        </div>
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

// Image Modal Component
const ImageModal = ({
  src,
  alt,
  isOpen,
  onClose,
}: {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
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
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
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
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Projects = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { ref: sectionRef, isVisible } = useIntersectionObserver(0.1);
  const [currentProject, setCurrentProject] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  useParticleAnimation(canvasRef);

  // Reordered projects array according to user specification
  const projects: Project[] = useMemo(
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
          { name: "React", icon: SiReact, color: "#61DAFB" },
          { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
          { name: "Vite", icon: SiVite, color: "#646CFF" },
          { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
          { name: "Flowbite", icon: SiBootstrap, color: "#7952B3" },
          { name: "Python", icon: SiPython, color: "#3776AB" },
          { name: "FastAPI", icon: SiFastapi, color: "#009688" },
          { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
          { name: "Express.js", icon: SiExpress, color: "#000000" },
          { name: "NLP/ML", icon: SiTensorflow, color: "#FF6F00" },
          { name: "GitHub Actions", icon: SiGithubactions, color: "#2088FF" },
          { name: "Docker", icon: SiDocker, color: "#2496ED" },
        ],
        images: ["/api/placeholder/600/400", "/api/placeholder/600/400"],
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
          { name: "C#", icon: SiSharp, color: "#239120" },
          { name: "Unity", icon: SiUnity, color: "#000000" },
          { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
          { name: "ARCore", icon: HiOutlineCube, color: "#4285F4" },
          { name: "Blender", icon: SiBlender, color: "#F5792A" },
          { name: "Fish-Net API", icon: HiOutlineTemplate, color: "#00BCD4" },
          { name: "Audio Tools", icon: HiOutlineMusicNote, color: "#FF9800" },
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
          { name: "Python", icon: SiPython, color: "#3776AB" },
          { name: "Raspberry Pi", icon: SiRaspberrypi, color: "#A22846" },
          { name: "SQLite", icon: HiOutlineTemplate, color: "#003B57" },
          { name: "OpenCV", icon: SiOpencv, color: "#5C3EE8" },
          { name: "YOLOv8", icon: SiTensorflow, color: "#FF6F00" },
          { name: "EasyOCR", icon: SiTensorflow, color: "#FF6F00" },
          { name: "PyQt", icon: SiPython, color: "#3776AB" },
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
          { name: "React.js", icon: SiReact, color: "#61DAFB" },
          { name: "Vite", icon: SiVite, color: "#646CFF" },
          { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
          { name: "Flowbite", icon: SiBootstrap, color: "#7952B3" },
          { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
          { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
          { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
          { name: "Redis", icon: SiRedis, color: "#DC382D" },
          { name: "Jest", icon: SiJest, color: "#C21325" },
          { name: "GitHub Actions", icon: SiGithubactions, color: "#2088FF" },
          { name: "Docker", icon: SiDocker, color: "#2496ED" },
          { name: "PayPal API", icon: SiPaypal, color: "#00457C" },
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
        period: "May 2023 - Jun 2023",
        description:
          "Introducing Project PACMANz, our extraordinary software development project, the enhanced version of the legendary 1980 Pacman game! Developed as part of our 1st year, 2nd semester module Object-Oriented Programming with C# final assessment, this project showcases our proficiency in OOP concepts. With stunning graphics and a range of special abilities, we have created an immersive gaming experience. Our implementation of the cutting-edge A* algorithm ensures dynamic ghost pathfinding functionality. We have also crafted unique assets and captivating sounds.",
        role: "Backend Developer",
        technologies: [
          { name: "C#", icon: SiSharp, color: "#239120" },
          { name: "Unity", icon: SiUnity, color: "#000000" },
          { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
          { name: "Blender", icon: SiBlender, color: "#F5792A" },
          { name: "A* Algorithm", icon: HiOutlineCube, color: "#4CAF50" },
          { name: "Audio Tools", icon: HiOutlineMusicNote, color: "#FF9800" },
        ],
        images: [
          "https://media.licdn.com/dms/image/v2/D5622AQGagdZvpBEvqQ/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1689884768445?e=1751500800&v=beta&t=iprGSaAeCR1hZ68eF8N4DLM4zfNylghTzZ3AIJXKRqk",
          "https://media.licdn.com/dms/image/v2/D5622AQHpQCKIRyvTMA/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1689884771396?e=1751500800&v=beta&t=k0-i5LEu34-TVffhFqz7cINEbYfuFvsOvzd3XhzrNA4",
        ],
        github: "https://github.com/theRealUnd3rdog/PACMANz.git",
      },
      // 6. IKAE (ikae)
      {
        id: 6,
        title: "IKAE - Furniture Design and Visualization",
        subtitle: "3D Furniture Visualization Web Application",
        period: "Apr 2025 - May 2025",
        description:
          "3rd Year 2nd Semester coursework project for HCI, Computer Graphics, and Visualization module. Developed a web-based 3D furniture visualization tool that enables customers to preview furniture arrangements in their rooms before purchasing. The application allows users to configure room dimensions, shapes, and color schemes, then place and customize furniture items in both 2D floor plan and interactive 3D views. Features include real-time rendering, material customization, lighting adjustments, and design saving functionality. Implemented role-based access for designers and administrators to manage the furniture catalog and customer interactions.",
        role: "Frontend Developer",
        technologies: [
          { name: "React", icon: SiReact, color: "#61DAFB" },
          { name: "Vite", icon: SiVite, color: "#646CFF" },
          { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
          { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
          { name: "Flowbite", icon: SiBootstrap, color: "#7952B3" },
          { name: "Zustand", icon: HiOutlineCube, color: "#FF6B6B" },
          { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
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
          { name: "MATLAB", icon: HiOutlineTemplate, color: "#0076A8" },
          { name: "Neural Networks", icon: SiTensorflow, color: "#FF6F00" },
          { name: "Machine Learning", icon: SiPython, color: "#3776AB" },
          {
            name: "Statistical Analysis",
            icon: HiOutlineCube,
            color: "#FF6B6B",
          },
          { name: "Feature Engineering", icon: SiTensorflow, color: "#FF6F00" },
        ],
        images: ["/api/placeholder/600/400", "/api/placeholder/600/400"],
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
          { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
          { name: "CSS3", icon: SiCss3, color: "#1572B6" },
          { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
          { name: "Java", icon: DiJava, color: "#007396" },
          { name: "MySQL", icon: SiMysql, color: "#4479A1" },
          { name: "Jakarta EE", icon: DiJava, color: "#007396" },
          { name: "PayPal API", icon: SiPaypal, color: "#00457C" },
          { name: "Google Maps", icon: SiGooglemaps, color: "#4285F4" },
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
          { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
          { name: "CSS3", icon: SiCss3, color: "#1572B6" },
          { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
          { name: "C#", icon: SiSharp, color: "#239120" },
          { name: "SQL", icon: HiOutlineTemplate, color: "#4479A1" },
          { name: "ASP.NET", icon: SiDotnet, color: "#512BD4" },
          { name: "Google Maps", icon: SiGooglemaps, color: "#4285F4" },
          { name: "Jenkins", icon: SiJenkins, color: "#D24939" },
          { name: "GitHub Actions", icon: SiGithubactions, color: "#2088FF" },
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
          { name: "Dart", icon: SiDart, color: "#0175C2" },
          { name: "Flutter", icon: SiFlutter, color: "#02569B" },
          { name: "Firebase", icon: SiFirebase, color: "#FFCA28" },
          { name: "Google Maps", icon: SiGooglemaps, color: "#4285F4" },
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
          { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
          { name: "CSS3", icon: SiCss3, color: "#1572B6" },
          { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
          { name: "PHP", icon: SiPhp, color: "#777BB4" },
          { name: "MySQL", icon: SiMysql, color: "#4479A1" },
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

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentProject((prev) => {
        const nextProject = prev === projects.length - 1 ? 0 : prev + 1;

        // Actually scroll the container to the next project
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const scrollAmount = container.clientWidth * nextProject;
          container.scrollTo({
            left: scrollAmount,
            behavior: "smooth",
          });
        }

        return nextProject;
      });
    }, 4000); // Reduced to 4 seconds for better UX

    return () => clearInterval(interval);
  }, [isAutoPlay, projects.length]);

  // Enhanced scroll function with smooth animation
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

  // Jump to specific project
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

  return (
    <section
      ref={sectionRef}
      className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#1e1e1e] to-[#151515] text-white relative overflow-hidden py-20"
    >
      {/* Enhanced Particle background */}
      <motion.canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      />

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/50 via-transparent to-[#1a1a1a]/30 z-1" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(26,26,26,0.3)_70%)] z-1" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#BEF264] to-[#4ade80] bg-clip-text text-transparent mb-4">
            My Portfolio
          </h2>
          <div className="w-32 h-1 bg-[#BEF264] rounded-full"></div>
        </div>

        {/* Enhanced Projects Carousel */}
        <div className="relative">
          {/* Navigation and Controls */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              {/* Auto-play toggle */}
              <motion.button
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 backdrop-blur-sm rounded-full text-white hover:bg-gray-700 transition-all"
              >
                {isAutoPlay ? <FaPause size={14} /> : <FaPlay size={14} />}
                <span className="text-sm">
                  {isAutoPlay ? "Pause" : "Auto Play"}
                </span>
              </motion.button>

              {/* Project counter */}
              <div className="text-sm text-gray-400">
                {currentProject + 1} / {projects.length}
              </div>
            </div>
          </div>

          {/* Projects Container with External Navigation */}
          <div className="flex items-center gap-6">
            {/* Left Navigation Arrow - Outside Content */}
            <motion.button
              onClick={() => scrollToProject("prev")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={currentProject === 0}
              className={`flex-shrink-0 p-4 bg-gray-900/90 backdrop-blur-sm rounded-full text-white hover:bg-gray-800 transition-all shadow-2xl ${
                currentProject === 0
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:shadow-lg hover:shadow-[#BEF264]/20 opacity-80 hover:opacity-100"
              }`}
            >
              <FaChevronLeft size={24} />
            </motion.button>

            {/* Projects Content Area */}
            <div className="flex-1 relative">
              {/* Projects Slider */}
              <div
                ref={scrollContainerRef}
                className="flex gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="min-w-full snap-center"
                  >
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                      {/* Enhanced Project Info */}
                      <motion.div
                        className="space-y-8"
                        initial={{ x: -50, opacity: 0 }}
                        animate={isVisible ? { x: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      >
                        {/* Header */}
                        <div className="space-y-4">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={isVisible ? { width: "100%" } : {}}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-1 bg-gradient-to-r from-[#BEF264] to-transparent rounded-full"
                          />

                          <div>
                            <motion.h3
                              className="text-4xl lg:text-5xl font-bold text-[#BEF264] mb-3 leading-tight"
                              initial={{ y: 20, opacity: 0 }}
                              animate={isVisible ? { y: 0, opacity: 1 } : {}}
                              transition={{ duration: 0.6, delay: 0.3 }}
                            >
                              {project.title}
                            </motion.h3>
                            <motion.p
                              className="text-gray-300 text-xl mb-2"
                              initial={{ y: 20, opacity: 0 }}
                              animate={isVisible ? { y: 0, opacity: 1 } : {}}
                              transition={{ duration: 0.6, delay: 0.4 }}
                            >
                              {project.subtitle}
                            </motion.p>
                            <motion.div
                              className="flex items-center gap-3 text-gray-500"
                              initial={{ y: 20, opacity: 0 }}
                              animate={isVisible ? { y: 0, opacity: 1 } : {}}
                              transition={{ duration: 0.6, delay: 0.5 }}
                            >
                              <div className="w-2 h-2 bg-[#BEF264] rounded-full"></div>
                              <span className="text-sm font-medium">
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
                          <p className="text-gray-300 leading-relaxed text-lg">
                            {project.description}
                          </p>
                        </motion.div>

                        {/* Role */}
                        <motion.div
                          initial={{ y: 20, opacity: 0 }}
                          animate={isVisible ? { y: 0, opacity: 1 } : {}}
                          transition={{ duration: 0.6, delay: 0.7 }}
                          className="flex items-center gap-3 p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50"
                        >
                          <div className="w-3 h-3 bg-[#BEF264] rounded-full animate-pulse"></div>
                          <span className="text-gray-400 font-medium">
                            Role:
                          </span>
                          <span className="text-white font-semibold">
                            {project.role}
                          </span>
                        </motion.div>

                        {/* Enhanced Technologies */}
                        <motion.div
                          initial={{ y: 30, opacity: 0 }}
                          animate={isVisible ? { y: 0, opacity: 1 } : {}}
                          transition={{ duration: 0.8, delay: 0.8 }}
                          className="space-y-4"
                        >
                          <h4 className="text-lg font-semibold text-gray-300">
                            Technologies Used
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {project.technologies.map((tech, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={
                                  isVisible
                                    ? { opacity: 1, scale: 1, y: 0 }
                                    : {}
                                }
                                transition={{
                                  duration: 0.4,
                                  delay: 0.9 + i * 0.1,
                                }}
                                whileHover={{ scale: 1.1, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative"
                              >
                                <div className="bg-gradient-to-r from-[#BEF264] to-[#a3e635] text-black px-5 py-3 rounded-full text-sm font-bold flex items-center gap-3 shadow-lg hover:shadow-[#BEF264]/25 transition-all duration-300">
                                  <tech.icon
                                    size={18}
                                    className="group-hover:scale-110 transition-transform"
                                  />
                                  <span>{tech.name}</span>
                                </div>
                                {/* Tooltip effect */}
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#BEF264] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>

                        {/* Enhanced Links */}
                        <motion.div
                          initial={{ y: 30, opacity: 0 }}
                          animate={isVisible ? { y: 0, opacity: 1 } : {}}
                          transition={{ duration: 0.8, delay: 1.1 }}
                          className="flex flex-wrap gap-4 pt-4"
                        >
                          {project.github && (
                            <motion.a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              className="group flex items-center gap-3 bg-gray-800 hover:bg-gray-700 px-8 py-4 rounded-xl transition-all duration-300 border border-gray-700 hover:border-gray-600 shadow-lg hover:shadow-xl"
                            >
                              <FaGithub
                                size={22}
                                className="group-hover:scale-110 transition-transform"
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
                              className="group flex items-center gap-3 bg-gradient-to-r from-[#BEF264] to-[#a3e635] text-black hover:from-[#a3e635] hover:to-[#84cc16] px-8 py-4 rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-[#BEF264]/25"
                            >
                              <FaExternalLinkAlt
                                size={18}
                                className="group-hover:scale-110 transition-transform"
                              />
                              <span>Live Demo</span>
                            </motion.a>
                          )}
                        </motion.div>
                      </motion.div>

                      {/* Ultra Enhanced Project Images */}
                      <motion.div
                        className="relative h-[700px] group"
                        initial={{ x: 50, opacity: 0 }}
                        animate={isVisible ? { x: 0, opacity: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                      >
                        {/* Background Effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#BEF264]/5 via-transparent to-[#BEF264]/10 rounded-3xl blur-xl" />
                        <div className="absolute -top-8 -right-8 w-40 h-40 bg-[#BEF264]/10 rounded-full blur-3xl group-hover:bg-[#BEF264]/20 transition-all duration-1000" />
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#BEF264]/5 rounded-full blur-2xl group-hover:bg-[#BEF264]/15 transition-all duration-1000" />

                        {/* Main Image */}
                        <motion.div
                          initial={{ scale: 0.9, rotateY: -10 }}
                          animate={isVisible ? { scale: 1, rotateY: 0 } : {}}
                          transition={{ duration: 1, delay: 0.6 }}
                          className="absolute top-0 right-0 w-[75%] h-[60%] group-hover:scale-105 group-hover:-rotate-1 transition-all duration-700 perspective-1000"
                        >
                          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-gray-700/30 group-hover:border-[#BEF264]/40 transition-all duration-700">
                            <ProjectImage
                              src={project.images[0]}
                              alt={`${project.title} main view`}
                              className="rounded-2xl"
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
                              className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70"
                            >
                              <FaExpand size={16} />
                            </motion.button>

                            {/* Shimmer effect */}
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                          </div>
                        </motion.div>

                        {/* Secondary Image */}
                        <motion.div
                          initial={{ scale: 0.9, rotateY: 10 }}
                          animate={isVisible ? { scale: 1, rotateY: 0 } : {}}
                          transition={{ duration: 1, delay: 0.8 }}
                          className="absolute bottom-0 left-0 w-[70%] h-[55%] group-hover:scale-105 group-hover:rotate-1 group-hover:-translate-y-4 transition-all duration-700 perspective-1000"
                        >
                          <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-gray-700/30 group-hover:border-[#BEF264]/40 transition-all duration-700">
                            <ProjectImage
                              src={project.images[1] || project.images[0]}
                              alt={`${project.title} secondary view`}
                              className="rounded-2xl"
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
                              className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70"
                            >
                              <FaExpand size={16} />
                            </motion.button>

                            {/* Shimmer effect */}
                            <div className="absolute inset-0 translate-x-full group-hover:-translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12" />
                          </div>
                        </motion.div>

                        {/* Floating Elements */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                          transition={{ duration: 0.8, delay: 1.2 }}
                          className="absolute top-1/3 left-1/5 w-4 h-4 bg-[#BEF264] rounded-full group-hover:scale-150 group-hover:bg-[#BEF264]/80 transition-all duration-700 animate-pulse"
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                          transition={{ duration: 0.8, delay: 1.4 }}
                          className="absolute bottom-1/3 right-1/5 w-3 h-3 bg-[#BEF264]/70 rounded-full group-hover:scale-200 group-hover:bg-[#BEF264] transition-all duration-700 animate-pulse"
                          style={{ animationDelay: "0.5s" }}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                          transition={{ duration: 0.8, delay: 1.6 }}
                          className="absolute top-3/4 right-1/4 w-2 h-2 bg-[#BEF264]/50 rounded-full group-hover:scale-300 group-hover:bg-[#BEF264]/90 transition-all duration-700 animate-pulse"
                          style={{ animationDelay: "1s" }}
                        />

                        {/* Orbital Animation */}
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                          }}
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
                ))}
              </div>
            </div>

            {/* Right Navigation Arrow - Outside Content */}
            <motion.button
              onClick={() => scrollToProject("next")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={currentProject === projects.length - 1}
              className={`flex-shrink-0 p-4 bg-gray-900/90 backdrop-blur-sm rounded-full text-white hover:bg-gray-800 transition-all shadow-2xl ${
                currentProject === projects.length - 1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:shadow-lg hover:shadow-[#BEF264]/20 opacity-80 hover:opacity-100"
              }`}
            >
              <FaChevronLeft size={24} className="transform rotate-180" />
            </motion.button>
          </div>

          {/* Enhanced Progress Indicator */}
          <motion.div
            className="flex justify-center gap-3 mt-12"
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
                    ? "w-12 h-3 bg-gradient-to-r from-[#BEF264] to-[#a3e635] rounded-full shadow-lg shadow-[#BEF264]/50"
                    : "w-3 h-3 bg-gray-600 hover:bg-gray-500 rounded-full"
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

      {/* Image Modal */}
      <ImageModal
        src={selectedImage?.src || ""}
        alt={selectedImage?.alt || ""}
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </section>
  );
};

export default Projects;
