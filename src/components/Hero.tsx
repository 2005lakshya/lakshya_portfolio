import { motion } from "framer-motion";
import { FileDown, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { profileData } from "@/data/portfolio";

const Hero = () => {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="min-h-screen pt-12 flex items-center justify-center relative overflow-hidden scroll-mt-20">
      {/* Grid background */}
      <div className="grid-background absolute inset-0" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />

      {/* Floating neon circles */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="container relative z-10 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Terminal prompt */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-secondary border border-border font-mono text-sm"
          >
            <span className="text-primary">$</span>
            <span className="text-muted-foreground">whoami</span>
            <span className="cursor-blink text-primary">_</span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4"
          >
            <span className="text-primary terminal-glow">{"{"}</span>
            <span className="text-white">{profileData.name}</span>
            <span className="text-primary terminal-glow">{"}"}</span>
          </motion.h1>

          {/* Tagline with typing effect */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 font-mono"
          >
            <span className="text-primary">&gt;</span> {profileData.role}
            <span className="cursor-blink text-primary ml-1">_</span>
          </motion.p>

          {/* Terminal Window Header - Command Center Style */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative rounded-[1.5rem] bg-white/[0.02] backdrop-blur-2xl border border-white/5 shadow-2xl overflow-hidden group max-w-2xl mx-auto mb-10"
          >
            {/* Window Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#FF5F56] shadow-[0_0_10px_rgba(255,95,86,0.2)]" />
                  <div className="w-2 h-2 rounded-full bg-[#FFBD2E] shadow-[0_0_10px_rgba(255,189,46,0.2)]" />
                  <div className="w-2 h-2 rounded-full bg-[#27C93F] shadow-[0_0_10px_rgba(39,201,63,0.2)] animate-pulse" />
                </div>
                <div className="ml-4 flex items-center gap-3 text-[8px] font-mono text-muted-foreground/40 uppercase tracking-[0.2em]">
                  <span className="w-1 h-1 rounded-full bg-primary/20" />
                  <span>lakshya@dev — session:whoami</span>
                </div>
              </div>
              <ArrowDown size={14} className="text-primary/30 animate-bounce" />
            </div>

            {/* Terminal content - Optimized for all screens */}
            <div className="p-5 sm:p-6 md:p-8 font-mono text-xs sm:text-sm space-y-6 text-left bg-transparent min-h-[240px] flex flex-col">
              <div className="flex items-center gap-3 text-primary/80">
                <span className="text-primary text-xs font-black">$</span>
                <span className="text-xs font-bold tracking-widest text-[#27C93F]">cat status.txt</span>
              </div>
              
              <div className="space-y-4 border-l-2 border-primary/20 pl-4 sm:pl-5 ml-1.5 flex-1">
                <div className="group/line flex items-center gap-3 transition-all">
                  <span className="text-primary/60 shrink-0">→</span> 
                  <p className="text-gray-300 md:text-[13px] leading-relaxed">
                    Status: <span className="text-white font-medium">Unemployed (but will make it sound cool)</span>
                  </p>
                </div>
                <div className="group/line flex items-center gap-3 transition-all">
                  <span className="text-primary/60 shrink-0">→</span> 
                  <p className="text-gray-300 md:text-[13px] leading-relaxed">
                    Currently accepting: <span className="text-white font-medium">Job offers, freelance gigs, or free pizza</span>
                  </p>
                </div>
                <div className="group/line flex items-center gap-3 transition-all">
                  <span className="text-primary/60 shrink-0">→</span> 
                  <p className="text-gray-300 md:text-[13px] leading-relaxed">
                    Skills: <span className="text-white font-medium">Turning coffee into code & bugs into features</span>
                  </p>
                </div>
                <div className="group/line flex items-center gap-3 transition-all">
                  <span className="text-yellow-400 shrink-0">⚠</span> 
                   <p className="text-gray-300 md:text-[13px] leading-relaxed italic opacity-80">
                    <span className="text-yellow-400/60 font-bold uppercase text-[10px] mr-2">Warning:</span>
                    Known to turn absolute chaos into a feature (mostly by accident)
                  </p>
                </div>
              </div>

              {/* Download Resume Action */}
              <div className="pt-4 mt-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                   <span className="text-primary text-xs font-black">$</span>
                   <span className="text-[12px] font-mono text-primary/80 tracking-widest">curl -O resume.pdf</span>
                </div>
                <a
                  href="/Lakshya_Gupta_Resume.pdf"
                  download
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-primary/20 bg-primary/10 text-primary font-bold text-[10px] tracking-widest uppercase hover:bg-primary/20 hover:scale-105 transition-all shadow-[0_0_15px_rgba(34,197,94,0.15)] group/btn"
                >
                  <FileDown size={14} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                  <span>Download Resume</span>
                </a>
              </div>
            </div>
          </motion.div>
          {/* External CTA removed; resume is inside terminal */}

          {/* Social links removed as requested */}
        </div>

        {/* Scroll indicator removed as requested */}
      </div>
    </section>
  );
};

const StatItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) => (
  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border">
    <span className="text-primary">{icon}</span>
    <span className="text-muted-foreground text-sm">{label}:</span>
    <span className="text-foreground font-mono font-semibold">{value}</span>
  </div>
);

export default Hero;
