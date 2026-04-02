import { motion } from "framer-motion";
import { Award, Tag, CheckCircle2, ChevronRight, Star } from "lucide-react";
import { achievementsData } from "@/data/portfolio";

const Achievements = () => {
  return (
    <section id="achievements" className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-0 left-1/4 w-[450px] h-[450px] bg-primary/5 blur-[120px] rounded-full -z-10" />

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
                   rotateY: [0, 180, 360],
                   filter: ["drop-shadow(0 0 0px rgba(34,197,94,0))", "drop-shadow(0 0 10px rgba(34,197,94,0.5))", "drop-shadow(0 0 0px rgba(34,197,94,0))"] 
                 }}
                 transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
               >
                 <Award size={12} />
               </motion.div>
               <span className="font-bold">HONORS_DISTINCTION_V2</span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Extra-curricular <span className="text-primary italic font-serif">& Achievements</span></h2>
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
                  <span>Rewards — achievements.log</span>
                </div>
              </div>
              <Star size={14} className="text-primary/30" />
            </div>

            <div className="p-6 md:p-8 bg-transparent">
              <div className="space-y-4">
                {achievementsData.map((item, index) => (
                  <motion.div
                    key={item.version}
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group/item relative flex items-center p-4 md:p-6 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-primary/20 hover:bg-white/[0.04] transition-all shadow-sm"
                  >
                     <div className="flex-shrink-0 mr-6 hidden sm:block">
                        <div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary/40 group-hover/item:text-primary transition-all group-hover/item:rotate-12">
                           <CheckCircle2 size={24} strokeWidth={1.5} />
                        </div>
                     </div>

                     <div className="flex-1 space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                           <div className="flex items-center gap-3">
                              <Tag size={12} className="text-primary/30" />
                              <span className="px-2 py-0.5 rounded bg-primary/10 text-[9px] font-mono font-bold text-primary tracking-widest uppercase">{item.version}</span>
                              <h3 className="text-base font-bold text-white/90 group-hover/item:text-primary transition-colors">{item.title}</h3>
                           </div>
                           <span className="text-[10px] font-mono text-muted-foreground/30 uppercase tracking-widest">{item.date}</span>
                        </div>
                        <p className="text-[12px] font-mono text-muted-foreground/60 leading-relaxed pl-7 border-l border-white/5 italic">
                           {item.description}
                        </p>
                     </div>

                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Achievements;
