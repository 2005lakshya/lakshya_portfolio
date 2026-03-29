import { useState, useEffect } from "react";
import BootScreen from "@/components/BootScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";
import CyberBorders from "@/components/CyberBorders";

const BOOT_SCREEN_KEY = "portfolio-boot-shown";

const Index = () => {
  const [showBootScreen, setShowBootScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if boot screen has been shown this session
    const hasSeenBoot = sessionStorage.getItem(BOOT_SCREEN_KEY);
    
    if (!hasSeenBoot) {
      setShowBootScreen(true);
    }
    
    setIsLoading(false);
  }, []);

  const handleBootComplete = () => {
    sessionStorage.setItem(BOOT_SCREEN_KEY, "true");
    setShowBootScreen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-mono">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {showBootScreen && <BootScreen onComplete={handleBootComplete} />}
      
      {!showBootScreen && (
        <>
          <CyberBorders />
          <Navbar />
          <main className="pt-24 md:pt-28">
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Achievements />
            <Contact />
          </main>
        </>
      )}
    </div>
  );
};

export default Index;
