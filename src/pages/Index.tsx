import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";
import { useScroll, useTransform, motion } from "framer-motion";
import { useEffect, useState } from "react";

const Index = () => {
  const { scrollY } = useScroll();
  const [vh, setVh] = useState(typeof window !== "undefined" ? window.innerHeight : 800);
  const [heroH, setHeroH] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", onResize);

    // Use ResizeObserver to track the hero element's height accurately across devices
    const heroEl = document.getElementById("hero-section");
    let ro: ResizeObserver | null = null;
    if (heroEl && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver((entries) => {
        const rect = entries[0]?.contentRect;
        if (rect) setHeroH(rect.height);
      });
      ro.observe(heroEl);
    } else {
      // fallback: single measurement
      const el = document.getElementById("hero-section");
      if (el) setHeroH(el.getBoundingClientRect().height);
      else setHeroH(window.innerHeight);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      if (ro && heroEl) ro.unobserve(heroEl);
    };
  }, []);

  // The Perfect Flow Reveal:
  // We use clip-path to "eat away" the fixed Hero section as you scroll down.
  // The rest of the page (About, Skills, etc.) scrolls up naturally behind it.
  const base = heroH ?? vh;
  const clipPath = useTransform(scrollY, [0, base * 0.6], ["inset(0% 0% 0% 0%)", "inset(0% 0% 100% 0%)"]);

  // Move About up smoothly as hero clips away (scroll-driven animation)
  // This creates the smooth transition where About slides up behind the hero
  const aboutY = useTransform(scrollY, [0, base * 0.6], [base * 0.3, 0]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      <Navbar />
      <main id="home" className="relative">

        {/* Layer 1: The Fixed Hero Curtain */}
        <motion.div
          style={{
            clipPath,
            zIndex: 20,
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: "100vh",
            pointerEvents: scrollY.get() > vh ? "none" : "auto"
          }}
        >
          <Hero />
        </motion.div>

        {/* Layer 2: The Rest of the Page (Normal Flow) */}
        <div className="relative z-10">
          {/* Spacer that provides the scroll room for the Hero lift --- use measured hero height for consistency */}
            <div style={{ height: `${base * 0.6}px` }} aria-hidden />

          {/* About section with scroll-driven slide-up animation */}
          <motion.div style={{ y: aboutY, willChange: "transform" }}>
            <About />
          </motion.div>
          
          <Skills />
          <Projects />
          <Experience />
          <Achievements />
          <Contact />
        </div>
      </main>
    </div>
  );
};

export default Index;
