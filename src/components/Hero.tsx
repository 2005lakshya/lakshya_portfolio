import { motion } from "framer-motion";
import { FileDown, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { profileData } from "@/data/portfolio";

const Hero = () => {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden scroll-mt-20">
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
            className="text-5xl md:text-7xl font-bold mb-4"
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
            className="text-xl md:text-2xl text-muted-foreground mb-8 font-mono"
          >
            <span className="text-primary">&gt;</span> {profileData.role}
            <span className="cursor-blink text-primary ml-1">_</span>
          </motion.p>

          {/* Terminal Info Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl mx-auto mb-10"
          >
            <div className="bg-black/60 backdrop-blur-md border-2 border-green-500/30 rounded-lg overflow-hidden">
              {/* Terminal header */}
              <div className="bg-green-500/10 border-b border-green-500/30 px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-green-400 text-xs font-mono ml-2">lakshya@dev:~$</span>
              </div>

              {/* Terminal content */}
              <div className="p-6 font-mono text-sm space-y-3">
                <div className="text-green-400">
                  <span className="text-green-500">$</span> cat status.txt
                </div>
                <div className="text-gray-300 pl-4 space-y-1">
                  <p><span className="text-green-400">→</span> Status: Unemployed (but will make it sound cool)</p>
                  <p><span className="text-green-400">→</span> Currently accepting: Job offers, freelance gigs, or free pizza</p>
                  <p><span className="text-green-400">→</span> Skills: Turning coffee into code & bugs into features</p>
                  <p><span className="text-yellow-400">⚠</span> Warning: Known to turn absolute chaos into a feature (mostly by accident)</p>
                </div>
                {/* Inline Download Resume action inside terminal */}
                <div className="pt-3">
                  <span className="text-green-400"><span className="text-green-500">$</span> curl -O resume.pdf</span>
                  <div className="mt-2">
                    <a
                      href="/Lakshya_Gupta_Resume.pdf"
                      download
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-green-500/40 text-green-400 hover:bg-green-500/10 transition-colors"
                    >
                      <FileDown size={16} />
                      <span>Download Resume</span>
                    </a>
                  </div>
                </div>
                <div className="text-green-400 pt-2">
                  <span className="text-green-500">$</span> <span className="cursor-blink">_</span>
                </div>
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
