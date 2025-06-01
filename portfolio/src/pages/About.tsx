import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  SiReact,
  SiNextdotjs,
  SiHtml5,
  SiCss3,
  SiTailwindcss,
  SiBootstrap,
  SiAngular,
  SiFlutter,
  SiNodedotjs,
  SiExpress,
  SiFastapi,
  SiDjango,
  SiSpringboot,
  SiDotnet,
  SiLaravel,
  SiGraphql,
  SiMongodb,
  SiPostgresql,
  SiSqlite,
  SiTypescript,
  SiJavascript,
  SiPython,
  SiSharp,
  SiCplusplus,
  SiPhp,
  SiGit,
  SiFigma,
  SiLinux,
  SiCanva,
  SiDocker,
  SiKubernetes,
  SiJenkins,
  SiRedis,
  SiNginx,
  SiApache,
  SiTensorflow,
  SiPytorch,
  SiGithub,
  SiGitlab,
  SiPandas,
  SiOpencv,
  SiScikitlearn,
} from "react-icons/si";
import { DiJava, DiMsqlServer } from "react-icons/di";
import { FaGraduationCap, FaQuoteLeft } from "react-icons/fa";

// Type definitions for better type safety
interface Skill {
  name: string;
  icon: React.ElementType;
  color: string;
}

interface SkillCategory {
  title: string;
  skills: Skill[];
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

interface EducationItem {
  id: string;
  institution: string;
  logo: string;
  period: string;
  year: string;
  degree: string;
  description: string;
  achievement?: string;
}

// Constants for better maintainability
const PARTICLE_COUNT = 80;
const PARTICLE_CONNECTION_DISTANCE = 100;
const ANIMATION_THRESHOLD = 0.1;

// Static data moved outside component to prevent re-creation on renders
const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Programming Languages",
    skills: [
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "Java", icon: DiJava, color: "#007396" },
      { name: "C#", icon: SiSharp, color: "#239120" },
      { name: "C++", icon: SiCplusplus, color: "#00599C" },
      { name: "PHP", icon: SiPhp, color: "#777BB4" },
    ],
  },
  {
    title: "Frontend Development",
    skills: [
      { name: "React.js", icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", icon: SiNextdotjs, color: "#000000" },
      { name: "Angular", icon: SiAngular, color: "#DD0031" },
      { name: "Flutter", icon: SiFlutter, color: "#02569B" },
      { name: "Tailwind CSS", icon: SiTailwindcss, color: "#06B6D4" },
      { name: "HTML5", icon: SiHtml5, color: "#E34F26" },
      { name: "CSS3", icon: SiCss3, color: "#1572B6" },
      { name: "Bootstrap", icon: SiBootstrap, color: "#7952B3" },
    ],
  },
  {
    title: "Backend Development",
    skills: [
      { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
      { name: "Express.js", icon: SiExpress, color: "#000000" },
      { name: "FastAPI", icon: SiFastapi, color: "#000000" },
      { name: "Django", icon: SiDjango, color: "#092E20" },
      { name: "Spring Boot", icon: SiSpringboot, color: "#6DB33F" },
      { name: ".NET", icon: SiDotnet, color: "#512BD4" },
      { name: "Laravel", icon: SiLaravel, color: "#FF2D20" },
      { name: "GraphQL", icon: SiGraphql, color: "#E10098" },
    ],
  },
  {
    title: "DevOps & Cloud",
    skills: [
      { name: "Docker", icon: SiDocker, color: "#2496ED" },
      { name: "Kubernetes", icon: SiKubernetes, color: "#326CE5" },
      { name: "Jenkins", icon: SiJenkins, color: "#D24939" },
      { name: "Redis", icon: SiRedis, color: "#DC382D" },
      { name: "NGINX", icon: SiNginx, color: "#009639" },
      { name: "Apache", icon: SiApache, color: "#D22128" },
    ],
  },
  {
    title: "Databases",
    skills: [
      { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
      { name: "SQLite", icon: SiSqlite, color: "#003B57" },
      { name: "MS SQL", icon: DiMsqlServer, color: "#CC2927" },
    ],
  },
  {
    title: "AI/ML & Data Science",
    skills: [
      { name: "TensorFlow", icon: SiTensorflow, color: "#FF6F00" },
      { name: "Pandas", icon: SiPandas, color: "#F46800" },
      { name: "PyTorch", icon: SiPytorch, color: "#F46800" },
      { name: "OpenCV", icon: SiOpencv, color: "#E97627" },
      { name: "Scikit Learn", icon: SiScikitlearn, color: "#76B900" },
    ],
  },
  {
    title: "Tools & Others",
    skills: [
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "GitHub", icon: SiGithub, color: "#181717" },
      { name: "GitLab", icon: SiGitlab, color: "#FC6D26" },
      { name: "Linux", icon: SiLinux, color: "#FCC624" },
      { name: "Figma", icon: SiFigma, color: "#F24E1E" },
      { name: "Canva", icon: SiCanva, color: "#00C4CC" },
    ],
  },
];

const EDUCATION_DATA: EducationItem[] = [
  {
    id: "university",
    institution: "University of Plymouth",
    logo: "https://i2-prod.plymouthherald.co.uk/incoming/article1526310.ece/ALTERNATES/s615b/31739801_1803549163024446_8142646875204354048_n.png",
    period: "2021 - 2025",
    year: "2021",
    degree: "BSc. (Hons) Software Engineering",
    description:
      "Successfully completed a comprehensive Software Engineering degree with specialized focus on modern development practices and DevOps methodologies. Gained extensive hands-on experience with CI/CD pipelines, containerization technologies, and automation frameworks.",
    achievement: "Aggregate: 72.24 (3.7 CGPA)",
  },
  {
    id: "school",
    institution: "Leeds International School",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQAaqL3SA82vEIpeC3mcQSfQ4uBN5HsCtRWQ&s",
    period: "2006 - 2020",
    year: "2006",
    degree: "Pearson Edexcel IGCSE & IAL's",
    description:
      "Completed comprehensive secondary education with Pearson Edexcel International GCSE in Science Stream and International Advanced Levels in Mathematics Stream. Built strong foundational knowledge in analytical thinking and problem-solving.",
    achievement: "Successfully Completed",
  },
];

// Animation variants for consistent motion design
const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  },
};

/**
 * Custom hook for intersection observer to handle component visibility
 */
const useIntersectionObserver = (threshold: number = ANIMATION_THRESHOLD) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold]);

  return { isVisible, elementRef };
};

/**
 * Custom hook for particle animation canvas
 */
const useParticleAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    // Initialize particles
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.3 + 0.1,
        color: Math.random() > 0.5 ? "190, 242, 100" : "74, 222, 128",
      });
    }

    let animationFrame: number;

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particle.color}, ${particle.opacity})`;
        ctx.fill();

        // Update particle position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Draw connections between nearby particles
        particles.slice(index + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < PARTICLE_CONNECTION_DISTANCE) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(190, 242, 100, ${
              0.1 * (1 - distance / PARTICLE_CONNECTION_DISTANCE)
            })`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });

        // Wrap particles around screen edges
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return canvasRef;
};

/**
 * ProfileSection Component - Displays profile image and personal quote
 */
const ProfileSection: React.FC<{ isVisible: boolean }> = ({ isVisible }) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={isVisible ? { opacity: 1, x: 0 } : {}}
    transition={{ duration: 0.8, delay: 0.2 }}
    className="flex flex-col items-center lg:items-start"
  >
    {/* Profile Image with enhanced styling */}
    <div className="relative mb-8 group">
      <div className="w-72 h-72 rounded-3xl bg-gradient-to-br from-[#BEF264] via-[#4ade80] to-[#22c55e] p-1 shadow-2xl shadow-[#BEF264]/20">
        <div className="w-full h-full rounded-3xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-3">
          <img
            src="https://media.licdn.com/dms/image/v2/D5603AQFK7gsvv-nUqw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1704085279435?e=1753920000&v=beta&t=08FWlAtqPFcTWRHvbcYXdyKskS9yJ-oZ_NR4w6epuRY"
            alt="Gagana Methmal Profile"
            className="w-full h-full rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Enhanced floating orbs */}
      <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-[#BEF264]/30 to-[#4ade80]/30 rounded-full blur-xl animate-pulse" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-[#4ade80]/20 to-[#22c55e]/20 rounded-full blur-xl animate-pulse animation-delay-2000" />
      <div className="absolute top-1/2 -right-8 w-16 h-16 bg-[#BEF264]/10 rounded-full blur-lg animate-bounce animation-delay-1000" />
    </div>

    {/* Enhanced Quote Section */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-8 shadow-2xl relative"
    >
      <FaQuoteLeft className="absolute top-4 left-4 text-[#BEF264]/30 text-2xl" />
      <p className="text-gray-300 text-lg leading-relaxed pl-8">
        I am a passionate and driven software engineering graduate with a strong
        focus on DevOps and full-stack software development. My journey in
        software engineering has been driven by curiosity and a desire to create
        meaningful, scalable solutions. I thrive in collaborative environments
        where innovation meets practical implementation, constantly exploring
        cutting-edge technologies and methodologies.
      </p>
      <div className="mt-6 flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-[#BEF264] to-[#4ade80] rounded-full flex items-center justify-center">
          <span className="text-black font-bold text-lg">GM</span>
        </div>
        <div>
          <p className="font-semibold text-white">Gagana Methmal</p>
          <p className="text-sm text-gray-400">
            Software Developer & DevOps Enthusiast
          </p>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

/**
 * SkillsSection Component - Displays categorized technical skills
 */
const SkillsSection: React.FC<{ isVisible: boolean }> = ({ isVisible }) => (
  <motion.div
    variants={ANIMATION_VARIANTS.container}
    initial="hidden"
    animate={isVisible ? "visible" : "hidden"}
    className="space-y-6"
  >
    <div className="flex items-center gap-4 mb-8">
      <h3 className="text-3xl font-bold bg-gradient-to-r from-[#BEF264] to-[#4ade80] bg-clip-text text-transparent">
        Technical Skills
      </h3>
      <div className="flex-1 h-0.5 bg-gradient-to-r from-[#BEF264]/50 to-transparent" />
    </div>

    {SKILL_CATEGORIES.map((category, categoryIndex) => (
      <motion.div
        key={category.title}
        variants={ANIMATION_VARIANTS.item}
        className="space-y-3"
      >
        <h4 className="text-xl font-semibold text-white border-l-4 border-[#BEF264] pl-4 bg-gradient-to-r from-gray-800/30 to-transparent py-2">
          {category.title}
        </h4>

        <div className="flex flex-wrap gap-3">
          {category.skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.3,
                delay: categoryIndex * 0.1 + index * 0.05,
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg px-3 py-2 hover:border-[#BEF264]/50 transition-all"
            >
              <skill.icon
                size={20}
                style={{ color: skill.color }}
                className="drop-shadow-[0_0_8px_currentColor]"
              />
              <span className="text-sm text-gray-300">{skill.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    ))}
  </motion.div>
);

/**
 * EducationSection Component - Displays educational timeline
 */
const EducationSection: React.FC<{ isVisible: boolean }> = ({ isVisible }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={isVisible ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.8, delay: 0.6 }}
    className="mt-16"
  >
    <div className="flex items-center gap-4 mb-12">
      <h3 className="text-3xl font-bold bg-gradient-to-r from-[#BEF264] to-[#4ade80] bg-clip-text text-transparent">
        Educational Journey
      </h3>
      <div className="flex-1 h-0.5 bg-gradient-to-r from-[#BEF264]/50 to-transparent" />
    </div>

    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-[#BEF264] via-[#4ade80] to-[#22c55e] rounded-full" />

      <div className="space-y-16">
        {EDUCATION_DATA.map((education, index) => (
          <motion.div
            key={education.id}
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
            className="relative flex items-start gap-8"
          >
            {/* Timeline node */}
            <div className="relative z-10 flex-shrink-0">
              <motion.div
                className={`w-20 h-20 ${
                  education.id === "university"
                    ? "bg-gradient-to-br from-[#BEF264] to-[#4ade80]"
                    : "bg-gradient-to-br from-gray-700 to-gray-800"
                } rounded-full flex items-center justify-center border-4 border-[#1a1a1a] shadow-2xl ${
                  education.id === "university" ? "shadow-[#BEF264]/30" : ""
                }`}
                whileHover={{
                  scale: 1.1,
                  rotate: education.id === "university" ? 5 : -5,
                }}
              >
                <FaGraduationCap
                  size={28}
                  className={
                    education.id === "university"
                      ? "text-black"
                      : "text-[#BEF264]"
                  }
                />
              </motion.div>
              <div className="absolute -left-12 top-24 text-gray-400 font-bold text-3xl">
                {education.year}
              </div>
            </div>

            {/* Education content card */}
            <motion.div
              className={`${
                education.id === "university"
                  ? "bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50 shadow-2xl"
                  : "bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700/30 shadow-xl"
              } backdrop-blur-lg border rounded-2xl p-8 flex-1`}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-6 mb-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-[#BEF264]/30">
                  <img
                    src={education.logo}
                    alt={`${education.institution} Logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white mb-1">
                    {education.institution}
                  </h4>
                  <p
                    className={`font-medium ${
                      education.id === "university"
                        ? "text-[#BEF264]"
                        : "text-gray-400"
                    }`}
                  >
                    {education.period}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p
                  className={`text-xl font-semibold ${
                    education.id === "university"
                      ? "text-[#BEF264]"
                      : "text-gray-300"
                  }`}
                >
                  {education.degree}
                </p>
                <p className="text-gray-300 leading-relaxed">
                  {education.description}
                </p>
                {education.achievement && (
                  <div
                    className={`${
                      education.id === "university"
                        ? "bg-gradient-to-r from-[#BEF264] to-[#4ade80] text-black"
                        : "bg-gray-700/50 text-gray-300"
                    } px-4 py-2 rounded-lg font-bold inline-block mt-2`}
                  >
                    {education.achievement}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

/**
 * Main About Component
 */
const About: React.FC = () => {
  const { isVisible, elementRef } = useIntersectionObserver();
  const canvasRef = useParticleAnimation();

  return (
    <section
      ref={elementRef}
      className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] text-white relative overflow-hidden py-20"
    >
      {/* Particle background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-50" />

      {/* Background gradient blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#BEF264]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#4ade80]/5 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#BEF264] to-[#4ade80] bg-clip-text text-transparent mb-4"
            initial={{ scale: 0.9 }}
            animate={isVisible ? { scale: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            About Me
          </motion.h2>
          <motion.div
            className="w-24 h-1 bg-gradient-to-r from-[#BEF264] to-[#4ade80] rounded-full"
            initial={{ width: 0 }}
            animate={isVisible ? { width: 96 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-16">
          <ProfileSection isVisible={isVisible} />
          <SkillsSection isVisible={isVisible} />
        </div>

        {/* Education section */}
        <EducationSection isVisible={isVisible} />
      </div>
    </section>
  );
};

export default About;
