import { motion } from "framer-motion";
import { FolderGit2, Terminal, ExternalLink, Github, GitBranch, Share2 } from "lucide-react";
import { projectsData } from "@/data/portfolio";

const Projects = () => {
  return (
    <section id="projects" className="py-20 md:py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 blur-[160px] rounded-full -z-10" />

      <div className="container px-4 sm:px-6">
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
           viewport={{ once: true }}
           className="max-w-5xl mx-auto"
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
                   y: [0, -6, 0],
                   scale: [1, 1.25, 1],
                   rotate: [0, 15, 0]
                 }}
                 transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
               >
                 <FolderGit2 size={12} />
               </motion.div>
               <span className="font-bold">REPOSITORY_DATABASE_V2</span>
            </motion.div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2 leading-tight">Pinned <span className="text-primary italic font-serif">Repositories</span></h2>
          </div>

          {/* Unified Window Frame */}
          <div className="relative rounded-[1.5rem] bg-white/[0.02] backdrop-blur-2xl border border-white/5 shadow-2xl overflow-hidden group">
            {/* Window Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-5 py-3.5 border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#FF5F56] shadow-[0_0_10px_rgba(255,95,86,0.2)]" />
                  <div className="w-2 h-2 rounded-full bg-[#FFBD2E] shadow-[0_0_10px_rgba(255,189,46,0.2)]" />
                  <div className="w-2 h-2 rounded-full bg-[#27C93F] shadow-[0_0_10px_rgba(39,201,63,0.2)]" />
                </div>
                <div className="hidden sm:flex ml-4 items-center gap-3 text-[8px] font-mono text-muted-foreground/40 uppercase tracking-[0.2em] min-w-0">
                  <span className="w-1 h-1 rounded-full bg-primary/20" />
                  <span className="truncate">lakshya@dev — git status --all</span>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end">
                <span className="sm:hidden text-[9px] font-mono uppercase tracking-[0.2em] text-muted-foreground/35">git status</span>
                <Share2 size={14} className="text-primary/30 hidden sm:block" />
              </div>
            </div>

            <div className="p-4 sm:p-6 md:p-8 bg-transparent">
               <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                 {projectsData.map((project, index) => (
                   <motion.div
                     key={project.name}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.5, delay: index * 0.1 }}
                     viewport={{ once: true }}
                    className="group/card relative rounded-2xl bg-white/[0.01] backdrop-blur-sm border border-white/5 p-4 sm:p-5 md:p-6 hover:border-primary/20 hover:bg-white/[0.03] transition-all shadow-2xl overflow-hidden"
                   >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <div className="flex items-start sm:items-center gap-3 min-w-0">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary/40 group-hover/card:text-primary transition-all group-hover/card:rotate-6">
                              <Terminal size={18} strokeWidth={1.5} />
                           </div>
                        <div className="space-y-0.5 min-w-0">
                              <p className="text-[7px] font-mono text-primary/30 uppercase tracking-widest">Repository Path</p>
                          <h3 className="text-base sm:text-lg font-bold tracking-tight text-white group-hover/card:text-primary transition-colors break-words">{project.name}</h3>
                           </div>
                        </div>
                      <div className="flex gap-2 self-start sm:self-auto">
                           {project.github && (
                             <a href={project.github} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl border border-primary/20 bg-primary/5 text-primary/60 hover:text-primary hover:bg-primary/10 transition-all hover:scale-110 shadow-[0_0_15px_rgba(34,197,94,0.05)]">
                               <Github size={18} />
                             </a>
                           )}
                           {project.demo && (
                             <a href={project.demo} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl border border-primary/20 bg-primary/5 text-primary/60 hover:text-primary hover:bg-primary/10 transition-all hover:scale-110 shadow-[0_0_15px_rgba(34,197,94,0.05)]">
                               <ExternalLink size={18} />
                             </a>
                           )}
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] sm:text-[11px] font-mono font-black text-muted-foreground/40 group-hover/card:text-muted-foreground/60 transition-colors bg-white/[0.01] px-3 py-1.5 rounded-lg border border-white/5 overflow-hidden">
                           <GitBranch size={10} className="text-primary/40" />
                          <span className="text-primary/50 shrink-0">$</span>
                          <span className="truncate">git clone {project.name}</span>
                        </div>
                        
                        <p className="text-[12px] font-mono text-gray-300/80 leading-relaxed italic border-l-2 border-primary/20 pl-4 pr-1 sm:pr-0">
                           <span className="text-primary/40 mr-2 font-black">//</span>
                           {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 pt-2">
                           {project.techStack.map((tech) => (
                              <span 
                                 key={tech} 
                              className="px-2 py-0.5 rounded bg-primary/5 border border-white/5 text-[9px] font-mono text-primary/60 hover:text-primary hover:border-primary/20 transition-all cursor-default"
                              >
                                 #{tech}
                              </span>
                           ))}
                        </div>
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

export default Projects;
