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
  const [activeSection, setActiveSection] = useState("home");
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const options = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    navItems.forEach((item) => {
      const el = document.querySelector(item.href);
      if (el) observer.observe(el);
    });

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4"
    >
      <div className="pointer-events-auto relative flex w-full justify-center">
        <nav
          className={`transition-all duration-700 ease-in-out px-2 py-1.5 rounded-full border border-green-500/10 backdrop-blur-md shadow-2xl flex items-center justify-between gap-4 sm:gap-8 ${isScrolled
              ? "bg-black/20 border-green-500/20 shadow-green-500/5 scale-95"
              : "bg-white/5 border-green-500/5 shadow-transparent scale-100"
            }`}
        >
          {/* Logo - Compact for Floating Nav */}
          <a 
            href="#home" 
            className="flex items-center gap-2 group px-2 py-1 rounded-full hover:bg-green-500/5 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="w-8 h-8 rounded-full bg-green-400/10 flex items-center justify-center group-hover:bg-green-500/20 transition-all border border-green-500/20 group-hover:border-green-500/40">
              <Terminal className="w-4 h-4 text-green-400 group-hover:text-green-300" />
            </div>
            <span className="hidden sm:inline font-mono text-[13px] font-bold tracking-tight">
              <span className="text-green-400/80">$</span>
              <span className="text-foreground/90 ml-1 group-hover:text-foreground transition-colors">lakshya</span>
            </span>
          </a>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-0.5 bg-green-500/5 p-0.5 rounded-full border border-green-500/10">
            {navItems.map((item) => {
              const isHovered = hoveredSection === item.label;
              const isActive = activeSection === item.label;
              const showPill = isHovered || (isActive && !hoveredSection);

              return (
                <a
                  key={item.label}
                  href={item.href}
                  onMouseEnter={() => setHoveredSection(item.label)}
                  onMouseLeave={() => setHoveredSection(null)}
                  className={`px-4 py-2 text-[12px] transition-all font-mono rounded-full relative group whitespace-nowrap uppercase tracking-wider ${
                    isActive || isHovered ? "text-green-300" : "text-muted-foreground/80"
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {showPill && (
                    <motion.div
                      className="absolute inset-0 bg-green-400/10 rounded-full"
                      layoutId="nav-pill"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center text-green-400/70 hover:text-green-300 hover:bg-green-500/10 transition-all rounded-full cursor-pointer border border-green-500/10 active:scale-90"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 12 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="absolute top-full mt-3 left-1/2 w-[min(90vw,24rem)] -translate-x-1/2 bg-black/60 backdrop-blur-3xl border border-green-500/10 rounded-2xl p-3 shadow-2xl md:hidden z-10"
              >
                <div className="flex flex-col gap-0.5">
                  {navItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-foreground/80 hover:text-green-300 hover:bg-green-500/10 transition-all font-mono px-4 py-3 rounded-xl group"
                    >
                      <span className="text-green-400 text-sm group-hover:scale-110 transition-transform">$</span>
                      <span className="text-[10px] text-green-500/40 uppercase tracking-widest">{item.prefix}</span>
                      <span className="text-sm font-medium tracking-wide uppercase italic">{item.label}</span>
                    </a>
                  ))}
                </div>
              </motion.div>

            </>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Navbar;

