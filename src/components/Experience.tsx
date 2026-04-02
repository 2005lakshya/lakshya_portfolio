import { motion } from "framer-motion";
import { Briefcase, Calendar, ChevronRight, Activity, Cpu } from "lucide-react";
import { experienceData } from "@/data/portfolio";

const Experience = () => {
  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-primary/5 blur-[140px] rounded-full -z-10" />

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
                  scale: [1, 1.4, 1],
                  rotate: [0, 15, -30, 15, 0],
                  filter: ["brightness(1)", "brightness(2)", "brightness(1)"]
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Activity size={12} />
              </motion.div>
              <span className="font-bold tracking-widest">HISTORY_LOG_SCAN</span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Experience <span className="text-primary italic font-serif">.log</span></h2>
          </div>

          {/* Unified Window Frame */}
          <div className="relative rounded-[1.5rem] bg-white/[0.02] backdrop-blur-2xl border border-white/5 shadow-2xl overflow-hidden group">
            {/* Window Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#FF5F56] shadow-[0_0_10px_rgba(255,95,86,0.2)]" />
                  <div className="w-2 h-2 rounded-full bg-[#FFBD2E] shadow-[0_0_10px_rgba(255,189,46,0.2)]" />
                  <div className="w-2 h-2 rounded-full bg-[#27C93F] shadow-[0_0_10px_rgba(39,201,63,0.2)]" />
                </div>
                <div className="ml-4 flex items-center gap-3 text-[8px] font-mono text-muted-foreground/40 uppercase tracking-[0.2em]">
                  <span className="w-1 h-1 rounded-full bg-primary/20" />
                  <span>Timeline — experience@dev</span>
                </div>
              </div>
              <Cpu size={14} className="text-primary/30" />
            </div>

            <div className="p-6 md:p-10 bg-transparent">
              <div className="relative space-y-12">
                {/* Vertical line connector */}
                <div className="absolute left-[11px] md:left-[15px] top-2 bottom-2 w-[1px] bg-gradient-to-b from-primary/30 via-primary/5 to-transparent shadow-[0_0_8px_rgba(34,197,94,0.1)]" />

                {experienceData.map((item, index) => {
                  const [role, company] = item.title.split(" @ ");
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="group/item relative flex items-start pl-8 md:pl-12"
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-1.5 w-[23px] h-[23px] md:w-[31px] md:h-[31px] rounded-full bg-black/60 border border-white/20 flex items-center justify-center p-1 group-hover/item:border-primary/50 group-hover/item:shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all z-10">
                        <div className="pulse-ring" />
                        <div className="w-full h-full rounded-full bg-primary/5 group-hover/item:bg-primary/20 transition-all flex items-center justify-center text-primary/40 group-hover/item:text-primary">
                          <ChevronRight size={12} />
                        </div>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                          <div className="space-y-1">
                            <h3 className="text-lg md:text-xl font-bold tracking-tight text-white group-hover/item:text-primary transition-colors">{role}</h3>
                            <p className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/5 text-[9px] font-mono font-black text-primary/60 uppercase tracking-widest">
                              <Briefcase size={10} />
                              {company || "Freelance / Projects"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10 text-[10px] font-mono font-bold text-primary tracking-tight">
                            <Calendar size={13} className="text-primary/60" />
                            {item.date}
                          </div>
                        </div>

                        <div className="bg-white/[0.02] border border-white/5 rounded-[1.25rem] p-5 group-hover/item:bg-white/[0.04] group-hover/item:border-primary/10 transition-all shadow-inner">
                          <div className="flex items-center gap-2 mb-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
                             <span className="text-[8px] font-mono text-primary/30 uppercase tracking-[0.2em]">Node_{item.hash || "8e2a1b4"}</span>
                          </div>
                          <p className="text-[12px] font-mono text-gray-300 leading-relaxed max-w-2xl italic">
                            <span className="text-primary/30 mr-2 opacity-50 font-black">λ</span>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
