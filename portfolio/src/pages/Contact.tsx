import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaPaperPlane,
  FaTerminal,
  FaCode,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";

// ========================
// Type Definitions
// ========================
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

interface ContactInfo {
  icon: typeof FaEnvelope;
  label: string;
  value: string;
  displayValue: string;
  color: string;
  href: string;
}

interface CommandHistory {
  command: string;
  output: string;
  type: "input" | "output" | "error" | "success";
}

// ========================
// Constants
// ========================
const CONTACT_INFO: ContactInfo[] = [
  {
    icon: FaEnvelope,
    label: "Email",
    value: "gaganam220@gmail.com",
    displayValue: "gaganam220@gmail.com",
    color: "#EA4335",
    href: "mailto:gaganam220@gmail.com",
  },
  {
    icon: FaPhone,
    label: "Phone",
    value: "+94 76 182 3473",
    displayValue: "+94 76 182 3473",
    color: "#34A853",
    href: "tel:+94761823473",
  },
  {
    icon: FaMapMarkerAlt,
    label: "Location",
    value: "Colombo, Sri Lanka",
    displayValue: "Colombo, Sri Lanka",
    color: "#4285F4",
    href: "#",
  },
  {
    icon: FaGithub,
    label: "GitHub",
    value: "iamgaganam",
    displayValue: "@iamgaganam",
    color: "#333333",
    href: "https://github.com/iamgaganam",
  },
  {
    icon: FaLinkedin,
    label: "LinkedIn",
    value: "Gagana Methmal",
    displayValue: "Gagana Methmal",
    color: "#0A66C2",
    href: "https://www.linkedin.com/in/gagana-methmal",
  },
];

const INITIAL_FORM_DATA: FormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const INITIAL_TERMINAL_HISTORY: CommandHistory[] = [
  {
    command: "",
    output: "🚀 Contact Terminal v2.0.0",
    type: "success",
  },
  {
    command: "",
    output: 'Type "help" for available commands',
    type: "output",
  },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_MESSAGE_LENGTH = 10;
const SUCCESS_MESSAGE_DURATION = 5000;
const FORM_SUBMIT_DELAY = 2000;

// ========================
// Utility Functions
// ========================
const validateEmail = (email: string): boolean => EMAIL_REGEX.test(email);

const validateFormData = (data: FormData): FormErrors => {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = "Name is required";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(data.email)) {
    errors.email = "Please enter a valid email";
  }

  if (!data.message.trim()) {
    errors.message = "Message is required";
  } else if (data.message.trim().length < MIN_MESSAGE_LENGTH) {
    errors.message = `Message must be at least ${MIN_MESSAGE_LENGTH} characters`;
  }

  return errors;
};

// ========================
// Sub-components
// ========================

/**
 * Contact Information Card Component
 */
const ContactCard: React.FC<{ info: ContactInfo; delay: number }> = ({
  info,
  delay,
}) => {
  const isExternal = ["GitHub", "LinkedIn"].includes(info.label);

  return (
    <motion.a
      href={info.href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02, x: 10 }}
      className="group relative bg-black/20 backdrop-blur-xl rounded-xl p-4 border border-gray-800/30 hover:border-[#BEF264]/50 transition-all overflow-hidden block"
    >
      <div className="flex items-center gap-4 relative z-10">
        <motion.div
          className="p-3 rounded-xl transition-all group-hover:scale-110"
          style={{ backgroundColor: `${info.color}15` }}
          whileHover={{ rotate: 5 }}
        >
          <info.icon size={24} style={{ color: info.color }} />
        </motion.div>
        <div>
          <p className="text-sm text-gray-400 mb-1">{info.label}</p>
          <p className="text-white font-medium group-hover:text-[#BEF264] transition-colors">
            {info.displayValue}
          </p>
        </div>
      </div>
    </motion.a>
  );
};

/**
 * Form Input Component with floating label
 */
const FormInput: React.FC<{
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  label: string;
  required?: boolean;
}> = ({ name, value, onChange, error, type = "text", label, required }) => (
  <motion.div whileFocus={{ scale: 1.02 }} className="relative">
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full px-4 py-4 bg-black/30 border rounded-xl focus:outline-none transition-all peer ${
        error
          ? "border-red-500 focus:border-red-400"
          : "border-gray-700 focus:border-[#BEF264]"
      }`}
      placeholder=" "
    />
    <label
      className={`absolute left-4 transition-all pointer-events-none ${
        value || error ? "-top-3 text-sm bg-black/60 px-2" : "top-4 text-base"
      } ${
        error
          ? "text-red-400"
          : "text-gray-400 peer-focus:text-[#BEF264] peer-focus:-top-3 peer-focus:text-sm peer-focus:bg-black/60 peer-focus:px-2"
      }`}
    >
      {label} {required && "*"}
    </label>
    {error && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-1 mt-2 text-red-400 text-sm"
      >
        <FaExclamationTriangle size={12} />
        {error}
      </motion.div>
    )}
  </motion.div>
);

/**
 * Success Message Overlay
 */
const SuccessMessage: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-xl rounded-2xl z-10"
  >
    <div className="text-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
      >
        <FaCheckCircle className="text-[#BEF264] text-6xl mx-auto mb-4" />
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold mb-2"
      >
        Message Sent! 🚀
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-gray-400"
      >
        Thanks for reaching out! I'll get back to you soon.
      </motion.p>
    </div>
  </motion.div>
);

// ========================
// Main Component
// ========================
const Contact: React.FC = () => {
  // State management
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [terminalMode, setTerminalMode] = useState(false);
  const [commandHistory, setCommandHistory] = useState<CommandHistory[]>(
    INITIAL_TERMINAL_HISTORY
  );
  const [currentCommand, setCurrentCommand] = useState("");

  // Refs
  const sectionRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle intersection observer for scroll animations
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  /**
   * Handle form input changes
   */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateFormData(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, FORM_SUBMIT_DELAY));

    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), SUCCESS_MESSAGE_DURATION);

    // Reset form
    setFormData(INITIAL_FORM_DATA);
    setFormErrors({});
  };

  /**
   * Process terminal commands
   */
  const processCommand = (cmd: string) => {
    const command = cmd.toLowerCase().trim();
    let output = "";
    let type: CommandHistory["type"] = "output";

    // Command processing logic
    switch (command) {
      case "help":
        output = `📋 Available commands:
• name [your name]     - Set your name
• email [your email]   - Set your email  
• subject [subject]    - Set message subject
• message [text]       - Set your message
• send                 - Send the message
• status               - Check form status
• info                 - Show contact details
• clear                - Clear terminal
• exit                 - Exit terminal mode`;
        break;

      case "info":
        output = `📞 Contact Information:
📧 Email: ${CONTACT_INFO[0].value}
📱 Phone: ${CONTACT_INFO[1].value}
📍 Location: ${CONTACT_INFO[2].value}
💼 GitHub: ${CONTACT_INFO[3].displayValue}
🔗 LinkedIn: ${CONTACT_INFO[4].value}`;
        break;

      case "status":
        const errors = validateFormData(formData);
        if (Object.keys(errors).length === 0) {
          output = `✅ Form Status: Ready to send!
📝 Name: ${formData.name}
📧 Email: ${formData.email}
📋 Subject: ${formData.subject || "Not set"}
💬 Message: ${formData.message.substring(0, 50)}${
            formData.message.length > 50 ? "..." : ""
          }`;
          type = "success";
        } else {
          output = `⚠️ Form Status: Missing fields
❌ Missing: ${Object.keys(errors).join(", ")}`;
          type = "error";
        }
        break;

      case "clear":
        setCommandHistory([
          { command: "", output: "🧹 Terminal cleared", type: "success" },
        ]);
        return;

      case "exit":
        setTerminalMode(false);
        output = "👋 Exiting terminal mode...";
        type = "success";
        break;

      case "send":
        const sendErrors = validateFormData(formData);
        if (Object.keys(sendErrors).length === 0) {
          handleSubmit(new Event("submit") as any);
          output = "🚀 Message sent successfully!";
          type = "success";
        } else {
          output = `❌ Validation failed: ${Object.values(sendErrors).join(
            ", "
          )}`;
          type = "error";
        }
        break;

      default:
        // Handle parameter commands
        if (command.startsWith("name ")) {
          const name = cmd.substring(5).trim();
          if (name) {
            setFormData((prev) => ({ ...prev, name }));
            output = `✅ Name set to: ${name}`;
            type = "success";
          } else {
            output = "❌ Please provide a name";
            type = "error";
          }
        } else if (command.startsWith("email ")) {
          const email = cmd.substring(6).trim();
          if (email && validateEmail(email)) {
            setFormData((prev) => ({ ...prev, email }));
            output = `✅ Email set to: ${email}`;
            type = "success";
          } else {
            output = "❌ Please provide a valid email address";
            type = "error";
          }
        } else if (command.startsWith("subject ")) {
          const subject = cmd.substring(8).trim();
          setFormData((prev) => ({ ...prev, subject }));
          output = `✅ Subject set to: ${subject}`;
          type = "success";
        } else if (command.startsWith("message ")) {
          const message = cmd.substring(8).trim();
          if (message.length >= MIN_MESSAGE_LENGTH) {
            setFormData((prev) => ({ ...prev, message }));
            output = `✅ Message set: ${message.substring(0, 50)}${
              message.length > 50 ? "..." : ""
            }`;
            type = "success";
          } else {
            output = `❌ Message must be at least ${MIN_MESSAGE_LENGTH} characters long`;
            type = "error";
          }
        } else {
          output = `❌ Unknown command: "${command}"\n💡 Type "help" for available commands`;
          type = "error";
        }
    }

    // Update command history
    setCommandHistory((prev) => [
      ...prev,
      { command: cmd, output: "", type: "input" },
      { command: "", output, type },
    ]);
  };

  return (
    <section ref={sectionRef} className="text-white relative py-16">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#BEF264] mb-6">
            Let's Connect
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Ready to bring your ideas to life? Let's collaborate and build
            something extraordinary together!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Contact Form / Terminal */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            {/* Mode Toggle */}
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-white">Get In Touch</h3>
              <motion.button
                onClick={() => setTerminalMode(!terminalMode)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-[#BEF264] bg-black/30 rounded-lg border border-gray-700 hover:border-[#BEF264]/50 transition-all"
              >
                {terminalMode ? <FaCode /> : <FaTerminal />}
                {terminalMode ? "Switch to Form" : "Try Terminal Mode"}
                <HiLightningBolt className="text-yellow-400" />
              </motion.button>
            </div>

            {!terminalMode ? (
              /* Contact Form */
              <motion.form
                onSubmit={handleSubmit}
                layout
                className="space-y-6 bg-black/20 backdrop-blur-xl rounded-2xl p-8 border border-gray-800/30 shadow-2xl"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <FormInput
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    error={formErrors.name}
                    label="Your Name"
                    required
                  />
                  <FormInput
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={formErrors.email}
                    type="email"
                    label="Your Email"
                    required
                  />
                </div>

                <FormInput
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  label="Subject (Optional)"
                />

                <motion.div whileFocus={{ scale: 1.02 }} className="relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className={`w-full px-4 py-4 bg-black/30 border rounded-xl focus:outline-none transition-all resize-none peer ${
                      formErrors.message
                        ? "border-red-500 focus:border-red-400"
                        : "border-gray-700 focus:border-[#BEF264]"
                    }`}
                    placeholder=" "
                  />
                  <label
                    className={`absolute left-4 transition-all pointer-events-none ${
                      formData.message || formErrors.message
                        ? "-top-3 text-sm bg-black/60 px-2"
                        : "top-4 text-base"
                    } ${
                      formErrors.message
                        ? "text-red-400"
                        : "text-gray-400 peer-focus:text-[#BEF264] peer-focus:-top-3 peer-focus:text-sm peer-focus:bg-black/60 peer-focus:px-2"
                    }`}
                  >
                    Your Message *
                  </label>
                  {formErrors.message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-1 mt-2 text-red-400 text-sm"
                    >
                      <FaExclamationTriangle size={12} />
                      {formErrors.message}
                    </motion.div>
                  )}
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-[#BEF264] to-[#a3d856] text-black font-bold py-4 rounded-xl hover:from-[#a3d856] hover:to-[#BEF264] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <HiSparkles size={20} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Send Message
                    </>
                  )}
                </motion.button>
              </motion.form>
            ) : (
              /* Terminal Mode */
              <div className="bg-black/30 rounded-xl overflow-hidden border border-gray-800/30 font-mono shadow-2xl">
                <div className="bg-black/50 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-xs text-gray-400 flex items-center gap-2">
                    <FaTerminal size={12} />
                    contact@terminal:~
                  </span>
                </div>
                <div className="p-6 h-96 overflow-y-auto">
                  {commandHistory.map((item, index) => (
                    <div key={index} className="mb-3">
                      {item.command && (
                        <div className="flex items-start gap-3 mb-1">
                          <span className="text-[#BEF264] select-none font-bold">
                            ❯
                          </span>
                          <span className="text-white">{item.command}</span>
                        </div>
                      )}
                      {item.output && (
                        <div
                          className={`ml-6 whitespace-pre-wrap leading-relaxed text-sm ${
                            item.type === "error"
                              ? "text-red-400"
                              : item.type === "success"
                              ? "text-green-400"
                              : "text-gray-300"
                          }`}
                        >
                          {item.output}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="flex items-center gap-3 mt-4">
                    <span className="text-[#BEF264] select-none font-bold">
                      ❯
                    </span>
                    <input
                      ref={terminalInputRef}
                      type="text"
                      value={currentCommand}
                      onChange={(e) => setCurrentCommand(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && currentCommand.trim()) {
                          processCommand(currentCommand);
                          setCurrentCommand("");
                        }
                      }}
                      className="flex-1 bg-transparent outline-none text-white caret-[#BEF264] text-sm"
                      placeholder="Type a command..."
                      autoFocus
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            <AnimatePresence>
              {showSuccess && <SuccessMessage />}
            </AnimatePresence>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Contact Information
              </h3>
              <p className="text-gray-400 mb-6">
                Feel free to reach out through any of these channels. I'm always
                excited to discuss new opportunities!
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              {CONTACT_INFO.map((info, index) => (
                <ContactCard
                  key={info.label}
                  info={info}
                  delay={0.6 + index * 0.1}
                />
              ))}
            </div>

            {/* Quick Response Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="bg-gradient-to-br from-[#BEF264]/10 to-transparent rounded-xl p-6 border border-[#BEF264]/20 backdrop-blur-xl"
            >
              <div className="flex items-start gap-3">
                <HiSparkles className="text-[#BEF264] text-xl mt-1" />
                <div>
                  <h4 className="text-white font-semibold mb-2">
                    Quick Response Guarantee
                  </h4>
                  <p className="text-gray-400 text-sm">
                    I typically respond within 24 hours. For urgent matters,
                    reach out via phone or LinkedIn.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
