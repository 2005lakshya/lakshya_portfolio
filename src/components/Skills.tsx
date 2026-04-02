import { motion } from "framer-motion";
import { Code2, Hash, Terminal } from "lucide-react";
import { skillsData } from "@/data/portfolio";

// Tech badge colors - light pastel colors with icons
const techColors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  "C": { bg: "bg-blue-100/5", border: "border-blue-300/20", text: "text-blue-200/60", icon: "©️" },
  "C++": { bg: "bg-indigo-100/5", border: "border-indigo-300/20", text: "text-indigo-200/60", icon: "➕" },
  "C#": { bg: "bg-purple-100/5", border: "border-purple-300/20", text: "text-purple-200/60", icon: "#️⃣" },
  "CSS3": { bg: "bg-cyan-100/5", border: "border-cyan-300/20", text: "text-cyan-200/60", icon: "🎨" },
  "HTML5": { bg: "bg-orange-100/5", border: "border-orange-300/20", text: "text-orange-200/60", icon: "🌐" },
  "JAVA": { bg: "bg-red-100/5", border: "border-red-300/20", text: "text-red-200/60", icon: "☕" },
  "JavaScript": { bg: "bg-yellow-100/5", border: "border-yellow-400/20", text: "text-yellow-200/60", icon: "🟨" },
  "Bootstrap": { bg: "bg-violet-100/5", border: "border-violet-300/20", text: "text-violet-200/60", icon: "🅱️" },
  "Node.js": { bg: "bg-green-100/5", border: "border-green-300/20", text: "text-green-200/60", icon: "🟢" },
  "MySQL": { bg: "bg-sky-100/5", border: "border-sky-300/20", text: "text-sky-200/60", icon: "🐬" },
  "Canvas": { bg: "bg-teal-100/5", border: "border-teal-300/20", text: "text-teal-200/60", icon: "🖼️" },
  "Figma": { bg: "bg-pink-100/5", border: "border-pink-300/20", text: "text-pink-200/60", icon: "🎨" },
  "Framer": { bg: "bg-slate-100/5", border: "border-slate-300/20", text: "text-slate-200/60", icon: "🔳" },
  "Git": { bg: "bg-orange-100/5", border: "border-orange-300/20", text: "text-orange-200/60", icon: "🔀" },
  "Flutter": { bg: "bg-cyan-100/5", border: "border-cyan-300/20", text: "text-cyan-200/60", icon: "🐦" },
  "React": { bg: "bg-sky-100/5", border: "border-sky-300/20", text: "text-sky-200/60", icon: "⚛️" },
  "Python": { bg: "bg-blue-100/5", border: "border-blue-300/20", text: "text-blue-200/60", icon: "🐍" },
  "Java": { bg: "bg-red-100/5", border: "border-red-300/20", text: "text-red-200/60", icon: "☕" },
  "TypeScript": { bg: "bg-blue-100/5", border: "border-blue-300/20", text: "text-blue-200/60", icon: "🔷" },
  "Kotlin": { bg: "bg-purple-100/5", border: "border-purple-300/20", text: "text-purple-200/60", icon: "🇰" },
  "HTML": { bg: "bg-orange-100/5", border: "border-orange-300/20", text: "text-orange-200/60", icon: "📄" },
  "CSS": { bg: "bg-blue-100/5", border: "border-blue-300/20", text: "text-blue-200/60", icon: "🎨" },
  "PostgreSQL": { bg: "bg-indigo-100/5", border: "border-indigo-300/20", text: "text-indigo-200/60", icon: "🐘" },
  "MongoDB": { bg: "bg-green-100/5", border: "border-green-300/20", text: "text-green-200/60", icon: "🍃" },
  "SQLite": { bg: "bg-cyan-100/5", border: "border-cyan-300/20", text: "text-cyan-200/60", icon: "🪶" },
  "Firebase": { bg: "bg-amber-100/5", border: "border-amber-300/20", text: "text-amber-200/60", icon: "🔥" },
  "DynamoDB": { bg: "bg-orange-100/5", border: "border-orange-300/20", text: "text-orange-200/60", icon: "⚡" },
  "MATLAB": { bg: "bg-red-100/5", border: "border-red-300/20", text: "text-red-200/60", icon: "📊" },
  "Verilog": { bg: "bg-violet-100/5", border: "border-violet-300/20", text: "text-violet-200/60", icon: "🔌" },
  "TinkerCAD": { bg: "bg-teal-100/5", border: "border-teal-300/20", text: "text-teal-200/60", icon: "🔧" },
  "AWS": { bg: "bg-amber-100/5", border: "border-amber-300/20", text: "text-amber-200/60", icon: "☁️" },
  "GitHub": { bg: "bg-gray-100/5", border: "border-gray-300/20", text: "text-gray-200/60", icon: "🐱" },
  "Next.js": { bg: "bg-slate-100/5", border: "border-slate-300/20", text: "text-slate-200/60", icon: "▲" },
  "Express.js": { bg: "bg-gray-100/5", border: "border-gray-300/20", text: "text-gray-200/60", icon: "🚂" },
  "TailwindCSS": { bg: "bg-cyan-100/5", border: "border-cyan-300/20", text: "text-cyan-200/60", icon: "💨" },
  "FastAPI": { bg: "bg-teal-100/5", border: "border-teal-300/20", text: "text-teal-200/60", icon: "⚡" },
  "Streamlit": { bg: "bg-red-100/5", border: "border-red-300/20", text: "text-red-200/60", icon: "🎈" },
  "Pandas": { bg: "bg-indigo-100/5", border: "border-indigo-300/20", text: "text-indigo-200/60", icon: "🐼" },
  "NumPy": { bg: "bg-blue-100/5", border: "border-blue-400/20", text: "text-blue-900/60", icon: "🔢" },
  "Postman": { bg: "bg-orange-100/5", border: "border-orange-300/20", text: "text-orange-200/60", icon: "🚀" },
  "SQL": { bg: "bg-sky-100/5", border: "border-sky-300/20", text: "text-sky-200/60", icon: "🗄️" },
};

const Skills = () => {
  // Helper function to get badge colors
  const getBadgeColor = (name: string) => {
    return techColors[name] || { bg: "bg-gray-100/5", border: "border-gray-300/20", text: "text-gray-200/60", icon: "💻" };
  };

  // Custom rows based on user's request
  const dbRow = ["PostgreSQL", "MySQL", "SQLite", "MongoDB", "Firebase", "SQL"];
  const dbRowLooped = [...dbRow, ...dbRow, ...dbRow, ...dbRow];
  const langRow = ["Python", "C", "C++", "C#", "Java", "Kotlin", "Flutter", "TypeScript", "JavaScript"];
  const langRowLooped = [...langRow, ...langRow, ...langRow];
  const toolsRow = ["Postman", "MATLAB", "Verilog", "TinkerCAD", "Figma", "Git", "GitHub", "AWS"];
  const toolsRowLooped = [...toolsRow, ...toolsRow, ...toolsRow];
  const frameworksRow = ["FastAPI", "Streamlit", "Pandas", "NumPy", "React", "Next.js", "Node.js", "Express.js", "TailwindCSS"];
  const fwRowLooped = [...frameworksRow, ...frameworksRow, ...frameworksRow];

  // Premium badge component
  const SkillBadge = ({ name, idx, category }: { name: string; idx: number; category: string }) => {
    const colors = getBadgeColor(name);
    return (
      <motion.span
        key={`${name}-${category}-${idx}`}
        className={`px-3 py-1.5 rounded-xl font-mono font-black text-[9px] flex-shrink-0 whitespace-nowrap ${colors.bg} ${colors.border} ${colors.text} border shadow-sm flex items-center gap-2 hover:border-primary/40 hover:text-primary transition-all duration-300 cursor-default group uppercase tracking-widest`}
      >
        <span className="text-xs group-hover:scale-110 transition-transform duration-300 opacity-60 group-hover:opacity-100">{colors.icon}</span>
        <span>{name}</span>
      </motion.span>
    );
  };

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/2 w-[600px] h-[600px] bg-primary/5 blur-[160px] rounded-full -z-10 -translate-x-1/2" />

      <div className="container px-6">
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
                   scale: [1, 1.3, 1], 
                   opacity: [0.5, 1, 0.5],
                   rotate: [0, 15, -15, 0] 
                 }}
                 transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
               >
                 <Code2 size={12} />
               </motion.div>
               <span className="font-bold">STACK_MANIFEST_V2</span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Languages <span className="text-primary italic font-serif">& Skills</span></h2>
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
                  <span>Terminal Hub — tech --list</span>
                </div>
              </div>
              <Hash size={14} className="text-primary/30" />
            </div>

            <div className="p-6 md:p-10 space-y-8 bg-transparent">
               {/* Databases */}
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[10px] font-mono text-primary/30 uppercase tracking-widest pl-2">
                     <span className="text-primary">$</span> <span className="text-muted-foreground/50">databases_registry</span>
                  </div>
                  <div className="overflow-hidden border-y border-white/5 py-4">
                    <motion.div className="flex w-max gap-4" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
                      {[...dbRowLooped, ...dbRowLooped].map((name, idx) => (<SkillBadge key={idx} name={name} idx={idx} category="db" />))}
                    </motion.div>
                  </div>
               </div>

               {/* Languages */}
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[10px] font-mono text-primary/30 uppercase tracking-widest pl-2">
                     <span className="text-primary">$</span> <span className="text-muted-foreground/50">language_engines</span>
                  </div>
                  <div className="overflow-hidden border-y border-white/5 py-4">
                    <motion.div className="flex w-max gap-4" animate={{ x: ["-50%", "0%"] }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }}>
                      {[...langRowLooped, ...langRowLooped].map((name, idx) => (<SkillBadge key={idx} name={name} idx={idx} category="lang" />))}
                    </motion.div>
                  </div>
               </div>

               {/* Frameworks */}
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[10px] font-mono text-primary/30 uppercase tracking-widest pl-2">
                     <span className="text-primary">$</span> <span className="text-muted-foreground/50">system_frameworks</span>
                  </div>
                  <div className="overflow-hidden border-y border-white/5 py-4">
                    <motion.div className="flex w-max gap-4" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
                      {[...fwRowLooped, ...fwRowLooped].map((name, idx) => (<SkillBadge key={idx} name={name} idx={idx} category="fw" />))}
                    </motion.div>
                  </div>
               </div>

               {/* Tools */}
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[10px] font-mono text-primary/30 uppercase tracking-widest pl-2">
                     <span className="text-primary">$</span> <span className="text-muted-foreground/50">developer_tools</span>
                  </div>
                  <div className="overflow-hidden border-y border-white/5 py-4">
                    <motion.div className="flex w-max gap-4" animate={{ x: ["-50%", "0%"] }} transition={{ duration: 45, repeat: Infinity, ease: "linear" }}>
                      {[...toolsRowLooped, ...toolsRowLooped].map((name, idx) => (<SkillBadge key={idx} name={name} idx={idx} category="tools" />))}
                    </motion.div>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
