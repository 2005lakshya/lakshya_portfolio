import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal } from "lucide-react";

const navItems = [
  { label: "home", href: "#home", prefix: "~/" },
  { label: "about", href: "#about", prefix: "cat" },
  { label: "skills", href: "#skills", prefix: "ls" },
  { label: "projects", href: "#projects", prefix: "git" },
  { label: "experience", href: "#experience", prefix: "cd" },
  { label: "contact", href: "#contact", prefix: "ping" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-40 px-4 md:px-6 pt-4"
    >
      <nav
        className={`transition-all duration-300 rounded-xl ${isScrolled
          ? "bg-black/90 backdrop-blur-xl border-2 border-green-500/40 shadow-lg shadow-green-500/20"
          : "bg-black/75 backdrop-blur-md border-2 border-green-500/30 shadow-md shadow-green-500/15"
          }`}
      >
        <div className="container px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#home" className="font-mono text-lg flex items-center gap-2 group">
              <Terminal className="w-5 h-5 text-green-500" />
              <span className="text-green-500">$</span>
              <span className="text-foreground group-hover:text-green-400 transition-colors">lakshya</span>
              <span className="text-green-500/50">@dev</span>
            </a>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item, index) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-3 py-2 text-sm text-muted-foreground hover:text-green-400 hover:bg-green-500/10 transition-all font-mono relative group rounded-md"
                >
                  <span className="text-green-500/70 text-xs mr-1">{item.prefix}</span>
                  <span>{item.label}</span>
                  {index < navItems.length - 1 && (
                    <span className="absolute -right-0 top-1/2 -translate-y-1/2 text-green-500/30">|</span>
                  )}
                </a>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-all rounded-md flex-shrink-0 cursor-pointer"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, display: "none" }}
              animate={{ opacity: 1, y: 0, display: "block" }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
              className="md:hidden border-t border-green-500/20 rounded-b-xl overflow-hidden bg-black/40"
            >
              <div className="container px-6 py-4 space-y-2">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-foreground hover:text-green-400 hover:bg-green-500/10 transition-all font-mono px-3 py-2.5 rounded-md"
                  >
                    <span className="text-green-500">$</span>{" "}
                    <span className="text-green-500/70 text-sm">{item.prefix}</span>{" "}
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Navbar;
