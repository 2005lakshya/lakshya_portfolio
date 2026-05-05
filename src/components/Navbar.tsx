import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Home, User, Code2, FolderDot, Briefcase, Mail, Award, Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", href: "#home", icon: Home },
  { label: "About", href: "#about", icon: User },
  { label: "Skills", href: "#skills", icon: Code2 },
  { label: "Projects", href: "#projects", icon: FolderDot },
  { label: "Experience", href: "#experience", icon: Briefcase },
  { label: "Achievements", href: "#achievements", icon: Award },
  { label: "Contact", href: "#contact", icon: Mail },
];

function DockItem({ item, mouseX }: { item: typeof navItems[0]; mouseX: any }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [36, 68, 36]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });
  const Icon = item.icon;

  return (
    <div className="relative flex flex-col items-center group">
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -45, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="absolute px-3 py-1.5 rounded-md bg-white text-black text-xs font-semibold whitespace-nowrap shadow-xl pointer-events-none z-50"
          >
            {item.label}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.a
        ref={ref}
        href={item.href}
        style={{ width, height: width }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 transition-colors shadow-lg"
      >
        <Icon className="w-1/2 h-1/2 text-white/80 group-hover:text-white transition-colors" />
      </motion.a>
    </div>
  );
}

const Navbar = () => {
  const mouseX = useMotionValue(Infinity);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => {
      if (mq.matches) document.body.classList.add("has-top-navbar");
      else document.body.classList.remove("has-top-navbar");
    };

    update();
    if (mq.addEventListener) mq.addEventListener("change", update);
    else mq.addListener(update);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", update);
      else mq.removeListener(update);
      document.body.classList.remove("has-top-navbar");
    };
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-4 left-0 right-0 z-[70] hidden md:flex justify-center pointer-events-none px-4"
      >
        <div
          className="pointer-events-auto flex items-end gap-2.5 px-3.5 pb-2.5 pt-3 rounded-3xl bg-black/35 border border-white/10 backdrop-blur-xl shadow-2xl"
          onMouseMove={(event) => mouseX.set(event.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
        >
          {navItems.map((item) => (
            <DockItem key={item.label} item={item} mouseX={mouseX} />
          ))}
        </div>
      </motion.header>

      <header className="fixed top-4 left-0 right-0 z-50 md:hidden px-4 flex justify-end items-center pointer-events-none">
        <div className="pointer-events-auto backdrop-blur-xl bg-black/60 border border-white/10 rounded-full p-2 shadow-xl">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-white/80 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute top-16 left-4 right-4 pointer-events-auto bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl flex flex-col"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-all"
                  >
                    <Icon size={20} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </a>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Navbar;
