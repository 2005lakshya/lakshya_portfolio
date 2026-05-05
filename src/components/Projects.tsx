import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projectsData } from "@/data/portfolio";

const works = projectsData;

const slideEase = [0.16, 1, 0.3, 1] as const;

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const stickyTrackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [viewport, setViewport] = useState({ width: 1440, height: 800 });
  const [titleBounds, setTitleBounds] = useState({ width: 0, height: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress: sectionScrollProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const { scrollYProgress } = useScroll({
    target: stickyTrackRef,
    offset: ["start start", "end end"],
  });

  useLayoutEffect(() => {
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
      // reflect whether top navbar is present (Navbar toggles body.has-top-navbar)
      setHasTopNavbar(typeof document !== "undefined" && document.body.classList.contains("has-top-navbar"));
    };

    const updateTitleBounds = () => {
      const element = titleRef.current;
      if (!element) return;
      const bounds = element.getBoundingClientRect();
      setTitleBounds({ width: bounds.width, height: bounds.height });
    };

    updateViewport();
    updateTitleBounds();
    window.addEventListener("resize", updateViewport);
    window.addEventListener("resize", updateTitleBounds);

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("resize", updateTitleBounds);
    };
  }, []);

  // keep track of whether top navbar exists (Navbar adds `has-top-navbar` to body)
  const [hasTopNavbar, setHasTopNavbar] = useState(
    typeof document !== "undefined" ? document.body.classList.contains("has-top-navbar") : false
  );

  useMotionValueEvent(sectionScrollProgress, "change", (latest) => {
    setScrollProgress(latest);
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const nextIndex = Math.min(Math.floor(latest * works.length), works.length - 1);
    if (nextIndex < 0) return;

    setActiveIndex((previousIndex) => {
      if (nextIndex !== previousIndex) {
        setDirection(nextIndex > previousIndex ? 1 : -1);
      }
      return nextIndex;
    });
  });

  const activeWork = works[activeIndex];
  const progress = Math.min(scrollProgress / 0.24, 1);
  const ease = 1 - Math.pow(1 - progress, 3);

  const startX = Math.max(viewport.width * 0.5 - titleBounds.width / 2, 24);
  const startY = Math.max(viewport.height * 0.5 - titleBounds.height / 2, 24);
  const endX = 20;
  // For mobile, move the heading higher (smaller endY) so Projects appears earlier
  const endY = viewport.width < 768 ? 30 : 20;
  const headingX = startX + ease * (endX - startX);
  const headingY = startY + ease * (endY - startY);
  // Allow the heading to shrink more aggressively on small viewports so it fits in less space
  const scaleMultiplier = viewport.width < 768 ? 0.9 : 0.8;
  const headingScale = Math.max(1 - ease * scaleMultiplier, 0.2);

  // No negative margin needed now that mobile heading is outside sticky container
  const mobileOffsetClass = '';

  return (
    <section ref={sectionRef} id="projects" className={`relative text-white ${mobileOffsetClass}`} style={{ backgroundColor: '#000' }}>
      {/* Mobile: simple static heading outside sticky container */}
      {viewport.width < 1280 && (
        <h2
          aria-label="Projects"
          className="site-title select-none text-center w-full px-4 pt-20 pb-0"
          style={{ fontFamily: "Impact" }}
        >
          PROJECTS
        </h2>
      )}

      <div className="sticky top-0 z-40 h-0 xl:h-screen overflow-hidden pointer-events-none">
        {/* Desktop: animated sticky heading */}
        {viewport.width >= 1280 && (
          <motion.h2
            ref={titleRef}
            aria-label="Projects"
            className="absolute left-0 top-0 w-full select-none whitespace-nowrap font-black uppercase leading-none tracking-normal text-[#d5d5d5] flex justify-center"
            style={{
              transform: `translateY(${headingY}px) scale(${headingScale})`,
              transformOrigin: "top center",
              willChange: "transform",
              fontFamily: "Impact",
              /* flexible sizing: shrink to fit available space on small viewports */
              whiteSpace: 'normal',
              textAlign: 'center',
              maxWidth: '90%',
              overflowWrap: 'break-word',
              /* keep a responsive clamp so it reduces on narrow screens */
              fontSize: "clamp(16px, 9.5vw, 120px)",
            }}
          >
            Projects
          </motion.h2>
        )}
      </div>

      <div ref={stickyTrackRef} className="relative h-[600vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <div className="absolute inset-0 bg-black" />

          <div className="relative z-10 grid h-full grid-cols-1 px-5 pb-8 pt-4 xl:grid-cols-[1fr_40vw] xl:pt-4 xl:px-9">
            {/* Image on LEFT */}
            <div className="relative hidden items-start justify-start xl:flex pt-16 pl-4">
              <div className="group/image relative h-[68vh] w-full overflow-hidden rounded-2xl">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={activeWork.name}
                    onClick={() => {
                      const url = activeWork.href || activeWork.github;
                      if (url) {
                        window.open(url, "_blank");
                      }
                    }}
                    onMouseMove={(e) => {
                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                      setMousePosition({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                      });
                    }}
                    onMouseLeave={() => {
                      setMousePosition({ x: 0, y: 0 });
                    }}
                    initial={{
                      y: direction > 0 ? "16%" : "-16%",
                      opacity: 0,
                      scale: 1.08,
                      filter: "blur(18px)",
                      clipPath: direction > 0 ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)",
                    }}
                    animate={{
                      y: "0%",
                      opacity: 1,
                      scale: 1,
                      filter: "blur(0px)",
                      clipPath: "inset(0% 0 0% 0)",
                    }}
                    exit={{
                      y: direction > 0 ? "-16%" : "16%",
                      opacity: 0,
                      scale: 1.04,
                      filter: "blur(18px)",
                      clipPath: direction > 0 ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)",
                    }}
                    transition={{ duration: 1.05, ease: slideEase }}
                    className="absolute inset-0 block rounded-2xl group/project"
                    style={{ cursor: "grab" }}
                  >
                    <img src={activeWork.image} alt={activeWork.name} className="h-full w-full object-cover" />
                    <span
                      className="absolute z-[9999] flex items-center flex-nowrap gap-4 rounded-full px-6 py-4 text-[clamp(0.95rem,1.1vw,1.2rem)] font-black uppercase tracking-[-0.02em] text-white shadow-lg backdrop-blur-md pointer-events-none whitespace-nowrap bg-black/40 border border-white/10 hover:bg-black/30"
                      style={{
                        left: `${mousePosition.x}px`,
                        top: `${mousePosition.y}px`,
                        transform: "translate(-50%, -50%)",
                        opacity: mousePosition.x > 0 ? 1 : 0,
                        transition: "opacity 0.2s ease-out"
                      }}
                    >
                      <span>View project</span>
                      <ArrowUpRight size={24} />
                    </span>
                  </motion.div>
                </AnimatePresence>
                <div className="absolute bottom-6 right-6 z-30 flex gap-4 pointer-events-auto">
                  {activeWork.github && (
                    <a
                      href={activeWork.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-lg bg-black/40 hover:bg-black/30 transition-colors backdrop-blur"
                    >
                      <img src="/project/github.png" alt="GitHub" className="w-6 h-6" />
                    </a>
                  )}
                  {activeWork.href && (
                    <a
                      href={activeWork.href}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-lg bg-black/40 hover:bg-black/30 transition-colors backdrop-blur"
                    >
                      <img src="/project/deploy.png" alt="Deploy" className="w-6 h-6" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Content on RIGHT */}
            <aside className="relative z-20 flex min-h-0 flex-col justify-between pb-0 xl:pb-12">
              <div className="flex flex-col items-start w-full">
                <div className="mt-8 xl:mt-14 h-fit overflow-hidden w-full select-none">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeIndex}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="flex items-center justify-start pl-8 xl:pl-48"
                    >
                      <span
                        className="select-none text-[clamp(4rem,12vw,14rem)] leading-none tracking-wider text-neutral-800"
                        style={{ fontFamily: "'Bebas Neue'" }}
                      >
                        {String(activeIndex + 1).padStart(2, "0")}.
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div
                  className="absolute right-4 xl:right-8 top-[25%] xl:top-1/2 -translate-y-1/2 h-[120px] w-fit overflow-hidden z-50"
                  style={{
                    maskImage: "linear-gradient(to bottom, transparent, black 35%, black 65%, transparent)",
                    WebkitMaskImage: "linear-gradient(to bottom, transparent, black 35%, black 65%, transparent)",
                  }}
                >
                  <motion.nav
                    className="pt-[40px] flex flex-col items-end pr-4 xl:pr-8"
                    animate={{ y: -activeIndex * 40 }}
                    transition={{ type: "spring", stiffness: 150, damping: 25 }}
                  >
                    {works.map((work, index) => (
                      <button
                        key={work.name}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        className="group flex h-[40px] items-center justify-end gap-3 text-right transition-all duration-300"
                      >
                        <span className={`text-[clamp(0.6rem,0.75vw,0.85rem)] font-black uppercase tracking-widest transition-colors ${activeIndex === index ? "text-white" : "text-neutral-500 group-hover:text-neutral-400"}`}>
                          {work.name}
                        </span>
                        <span className={`h-px transition-all ${activeIndex === index ? "w-5 bg-white" : "w-3 bg-neutral-700 group-hover:bg-neutral-500"}`} />
                      </button>
                    ))}
                  </motion.nav>
                </div>
              </div>

              <div className="h-fit pointer-events-none mt-auto xl:mt-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeWork.name}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex flex-col justify-end ml-4 xl:ml-8 -mb-6 xl:mb-4 xl:-mt-16"
                  >
                    <h2 className="text-[clamp(2rem,4.2vw,5.2rem)] font-black leading-[1.1] tracking-tight text-[#d7d7d7] uppercase" style={{ fontFamily: "Oswald", letterSpacing: "-0.02em" }}>
                      {activeWork.name}
                    </h2>
                    <p className="mt-4 xl:mt-6 max-w-md text-[clamp(0.85rem,1.1vw,1.3rem)] font-black leading-[1.4] text-white/52">
                      {activeWork.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </aside>

            <div className="relative mt-12 xl:mt-8 h-[35vh] xl:h-[48vh] overflow-hidden rounded-2xl xl:hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={activeWork.name}
                  initial={{ y: direction > 0 ? "16%" : "-16%", opacity: 0, scale: 1.08, filter: "blur(14px)" }}
                  animate={{ y: "0%", opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ y: direction > 0 ? "-16%" : "16%", opacity: 0, scale: 1.04, filter: "blur(14px)" }}
                  transition={{ duration: 0.95, ease: slideEase }}
                  className="absolute inset-0 h-full w-full bg-neutral-900 flex overflow-hidden"
                  onClick={() => {
                    const url = activeWork.href || activeWork.github;
                    if (url) window.open(url, "_blank");
                  }}
                >
                  <img src={activeWork.image} alt={activeWork.name} className="h-full w-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Tap to view project</span>
                    <ArrowUpRight size={16} className="text-white/60" />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Projects;
