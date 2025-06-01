import Navigation from "./pages/Navigation";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";

/**
 * @returns {JSX.Element} Complete portfolio application
 */
function App() {
  // Base styling classes for theme support and smooth transitions
  const appClasses = [
    "App",
    "bg-white dark:bg-[#1a1a1a]",
    "text-gray-900 dark:text-white",
    "transition-colors duration-300",
  ].join(" ");

  return (
    <div className={appClasses}>
      {/* Fixed navigation component */}
      <Navigation />

      {/* Main content sections */}
      <main>
        <section id="home" aria-label="Home section">
          <Home />
        </section>

        <section id="about" aria-label="About section">
          <About />
        </section>

        <section id="projects" aria-label="Projects section">
          <Projects />
        </section>

        <section id="contact" aria-label="Contact section">
          <Contact />
        </section>
      </main>
    </div>
  );
}

export default App;
