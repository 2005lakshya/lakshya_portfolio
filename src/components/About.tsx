import { motion } from "framer-motion";
import { User, FileCode, Coffee, Globe, GraduationCap, MapPin, Activity, ShieldCheck, Terminal as TerminalIcon } from "lucide-react";
import { profileData } from "@/data/portfolio";

const About = () => {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -z-10" />

      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Section Header */}
          <div className="flex flex-col items-center mb-10 text-center">
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               whileInView={{ scale: 1, opacity: 1 }}
               className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[9px] font-mono tracking-[0.15em] uppercase mb-3"
            >
               <motion.div
                 animate={{ 
                   rotateY: [0, 180, 360], 
                   scale: [1, 1.25, 1],
                   filter: ["drop-shadow(0 0 0px rgba(34,197,94,0))", "drop-shadow(0 0 8px rgba(34,197,94,0.4))", "drop-shadow(0 0 0px rgba(34,197,94,0))"] 
                 }}
                 transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
               >
                 <FileCode size={12} />
               </motion.div>
               <span className="font-bold">SYSTEM_MANIFEST_V1</span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              <span className="text-white">README</span>
              <span className="text-primary italic font-serif">.md</span>
            </h2>
          </div>

          {/* Unified Window Frame */}
          <div className="relative rounded-[1.5rem] bg-white/[0.02] backdrop-blur-2xl border border-white/5 shadow-2xl overflow-hidden group">
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
                  <span>lakshya@dev — profile.json</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[8px] font-mono text-primary/40 uppercase tracking-widest hidden sm:flex">
                 <span>UTF-8</span>
                 <span className="w-1 h-1 rounded-full bg-white/10" />
                 <span>Line 42, Col 8</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1.2fr_1.8fr] divide-y lg:divide-y-0 lg:divide-x divide-white/5">
              {/* Left Pane: Technical Node */}
              <div className="p-5 sm:p-6 lg:p-8 bg-black/20 flex flex-col justify-between">
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-primary/60 uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
                           <Coffee size={12} />
                           <span className="font-bold">Core Instance</span>
                        </div>
                        <ShieldCheck size={14} className="text-primary/20" />
                    </div>
                    
                    <div className="bg-black/40 rounded-xl p-5 border border-white/5 font-mono text-[11px] leading-relaxed relative overflow-hidden group/code">
                       <div className="absolute top-0 right-0 p-2 opacity-5 group-hover/code:opacity-20 transition-opacity">
                          <TerminalIcon size={40} />
                       </div>
                       <pre className="text-primary/70 overflow-x-auto custom-scrollbar">
{`const admin = {
  identity: "${profileData.name}",
  role: "SWE / Data Science",
  specs: [
    "AI Engine Dev",
    "ML Orchestration",
    "Full-Stack Ops"
  ],
  status: "ACTIVE_SEEKING"
};`}
                       </pre>
                    </div>

                    <div className="space-y-4">
                       {[
                         { icon: GraduationCap, label: "Education", val: "B.Tech CS (Data Science)" },
                         { icon: MapPin, label: "Coordinates", val: "India — Remote OK" }
                       ].map((item, i) => (
                         <div key={i} className="flex items-center gap-3 group/info">
                            <div className="w-8 h-8 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary/40 group-hover/info:text-primary transition-colors">
                               <item.icon size={14} />
                            </div>
                            <div>
                               <p className="text-[7px] font-mono text-primary/20 uppercase tracking-widest">{item.label}</p>
                               <p className="text-[10px] font-mono text-muted-foreground">{item.val}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="pt-8 mt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
                       <span className="text-[8px] font-mono text-primary/30 uppercase tracking-widest">Sys_Status: OPTIMAL</span>
                    </div>
                    <Activity size={14} className="text-primary/10" />
                 </div>
              </div>

              {/* Right Pane: Identity Narrative */}
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center space-y-8 bg-transparent relative">
                  {/* Subtle BG Branding */}
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                     <Globe size={240} className="text-primary" />
                  </div>

                  <div className="space-y-6 relative z-10">
                    <div className="space-y-2">
                      <div className="w-8 h-1 bg-primary/30 rounded-full" />
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white/90">System Identity <span className="text-primary italic font-serif">Analysis</span></h3>
                    </div>

                    <div className="space-y-5">
                       <div className="flex items-center gap-3 text-[12px] font-mono text-primary/40">
                          <span className="italic">Initializing scan...</span>
                          <span className="text-primary font-bold uppercase tracking-widest">Complete</span>
                          <span className="w-1.5 h-3 bg-primary/40 animate-pulse" />
                       </div>

                       <div className="prose prose-invert prose-sm max-w-none">
                          <p className="text-gray-300/80 leading-relaxed text-[13px] md:text-[14px]">
                            <span className="text-white/90 font-bold text-lg md:text-xl block mb-3 border-l-2 border-primary/40 pl-4 py-1 bg-primary/[0.02]">Lakshya Gupta — Developer profile detected.</span>
                            Builds apps, experiments with AI, and lives somewhere between clean logic and controlled chaos. Known to run on caffeine and minimal sleep, constantly breaking things just to rebuild them better. Focused on creating smooth user experiences backed by solid logic, while occasionally debugging code at 3 AM for no reason.
                          </p>
                       </div>

                       <div className="pt-4">
                          <div className="flex items-center gap-2 text-[10px] font-mono text-primary/60 border border-primary/20 bg-primary/5 px-4 py-2 rounded-lg uppercase tracking-widest w-fit animate-pulse">
                             <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                             Status: Sleep not found. System still running.
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/5 flex items-center gap-4 relative z-10">
                     <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                           <div key={i} className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-[10px] font-mono text-primary/60 hover:text-primary transition-colors cursor-crosshair">λ</div>
                        ))}
                     </div>
                     <div className="space-y-0.5">
                        <p className="text-[8px] font-mono text-primary/40 uppercase tracking-widest leading-none">Collaborative Nodes</p>
                        <p className="text-[10px] font-mono text-muted-foreground">Scanning external networks...</p>
                     </div>
                  </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
