import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";

// Constants
const SCROLL_THRESHOLD = 20;
const SECTION_OFFSET = 100;
const MOBILE_MENU_WIDTH = "w-72";

// Types
interface NavItem {
  name: string;
  id: string;
}

interface AnimationConfig {
  duration: number;
  ease?: string;
  delay?: number;
}

// Configuration
const NAV_ITEMS: NavItem[] = [
  { name: "Home", id: "home" },
  { name: "About", id: "about" },
  { name: "Projects", id: "projects" },
  { name: "Contact", id: "contact" },
];

const ANIMATIONS: Record<string, AnimationConfig> = {
  navbar: { duration: 0.5, ease: "easeOut" },
  hover: { duration: 0.2 },
  spring: { duration: 0.3 },
};

// Styling classes
const STYLES = {
  navBase: "fixed w-full z-50 transition-all duration-500",
  navScrolled:
    "py-2 bg-gray-900/80 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-gray-700/50",
  navTransparent: "py-4 bg-transparent",
  logo: "text-3xl font-black tracking-tight text-[#BEF264] drop-shadow-md",
  logoGlow:
    "absolute -inset-2 bg-[#BEF264]/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300",
  button:
    "relative p-2.5 rounded-xl text-gray-400 hover:text-white bg-gray-800/80 hover:bg-[#BEF264]/10 backdrop-blur-sm transition-all duration-300",
  navLink:
    "relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group",
  mobilePanel:
    "fixed right-0 top-0 h-full bg-gray-900 shadow-2xl z-50 md:hidden",
  backdrop: "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden",
};

const Navigation = () => {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Initialize dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Scroll and section detection
  const updateActiveSection = (): void => {
    const scrollPosition = window.scrollY + SECTION_OFFSET;
    const sections = NAV_ITEMS.map((item) => item.id);

    for (const sectionId of sections) {
      const element = document.getElementById(sectionId);
      if (element) {
        const { offsetTop, offsetHeight } = element;
        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          setActiveSection(sectionId);
          break;
        }
      }
    }
  };

  const handleScroll = useCallback((): void => {
    setScrolled(window.scrollY > SCROLL_THRESHOLD);
    updateActiveSection();
  }, []);

  // Navigation
  const scrollToSection = (sectionId: string): void => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleNavClick = (sectionId: string): void => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    scrollToSection(sectionId);
  };

  // Effects
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Set initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Render helpers
  const renderLogo = () => (
    <motion.a
      href="#home"
      onClick={(e) => {
        e.preventDefault();
        scrollToSection("home");
      }}
      className="relative group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className={STYLES.logo}>GM</span>
      <motion.div className={STYLES.logoGlow} whileHover={{ scale: 1.2 }} />
    </motion.a>
  );

  const renderNavItem = (item: NavItem, index: number, isMobile = false) => {
    const isActive = activeSection === item.id;
    const baseClasses = isMobile
      ? `block px-4 py-3 text-lg font-medium rounded-xl transition-all duration-300`
      : STYLES.navLink;

    const activeClasses = isMobile
      ? "text-gray-900 bg-[#BEF264] shadow-lg shadow-[#BEF264]/30"
      : "text-[#BEF264] drop-shadow-md";

    const inactiveClasses = isMobile
      ? "text-gray-300 hover:text-[#BEF264] hover:bg-gray-800"
      : "text-gray-300 group-hover:text-[#BEF264]";

    return (
      <motion.a
        key={item.id}
        href={`#${item.id}`}
        onClick={(e) => {
          e.preventDefault();
          handleNavClick(item.id);
        }}
        onMouseEnter={() => !isMobile && setHoveredItem(item.id)}
        onMouseLeave={() => !isMobile && setHoveredItem(null)}
        className={`${baseClasses} ${
          isActive ? activeClasses : inactiveClasses
        }`}
        initial={{ opacity: 0, x: isMobile ? 20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <span
          className={
            isMobile ? "" : "relative z-10 transition-colors duration-300"
          }
        >
          {item.name}
        </span>

        {/* Desktop hover background */}
        {!isMobile && (
          <AnimatePresence>
            {hoveredItem === item.id && (
              <motion.div
                className="absolute inset-0 bg-[#BEF264]/20 rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={ANIMATIONS.hover}
              />
            )}
          </AnimatePresence>
        )}

        {/* Desktop active indicator */}
        {!isMobile && isActive && (
          <motion.div
            layoutId="navbar-active"
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#BEF264] rounded-full shadow-[0_0_8px_rgba(190,242,100,0.5)]"
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          />
        )}
      </motion.a>
    );
  };

  const renderMobileMenuButton = () => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`md:hidden ${STYLES.button}`}
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={mobileMenuOpen ? "close" : "menu"}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={ANIMATIONS.hover}
        >
          {mobileMenuOpen ? (
            <FiX className="w-5 h-5" />
          ) : (
            <FiMenu className="w-5 h-5" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );

  return (
    <>
      {/* Main Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={ANIMATIONS.navbar}
        className={`${STYLES.navBase} ${
          scrolled ? STYLES.navScrolled : STYLES.navTransparent
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {renderLogo()}

            <div className="flex items-center gap-6">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-2">
                {NAV_ITEMS.map((item, index) => renderNavItem(item, index))}
              </div>

              {/* Mobile Menu Button */}
              {renderMobileMenuButton()}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={ANIMATIONS.spring}
              className={STYLES.backdrop}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`${STYLES.mobilePanel} ${MOBILE_MENU_WIDTH}`}
            >
              <div className="p-6">
                {/* Close Button */}
                <div className="flex justify-end mb-8">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-gray-400 hover:text-white bg-gray-800 hover:bg-[#BEF264]/10 transition-colors"
                  >
                    <FiX className="w-6 h-6" />
                  </motion.button>
                </div>

                {/* Mobile Navigation Items */}
                <div className="space-y-2">
                  {NAV_ITEMS.map((item, index) =>
                    renderNavItem(item, index, true)
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
