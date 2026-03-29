import { motion } from "framer-motion";
import { Code2 } from "lucide-react";
import { skillsData } from "@/data/portfolio";

// Tech badge colors - light pastel colors with icons
const techColors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  "C": { bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-800", icon: "©️" },
  "C++": { bg: "bg-indigo-100", border: "border-indigo-300", text: "text-indigo-800", icon: "➕" },
  "C#": { bg: "bg-purple-100", border: "border-purple-300", text: "text-purple-800", icon: "#️⃣" },
  "CSS3": { bg: "bg-cyan-100", border: "border-cyan-300", text: "text-cyan-800", icon: "🎨" },
  "HTML5": { bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-800", icon: "🌐" },
  "JAVA": { bg: "bg-red-100", border: "border-red-300", text: "text-red-800", icon: "☕" },
  "JavaScript": { bg: "bg-yellow-100", border: "border-yellow-400", text: "text-yellow-800", icon: "🟨" },
  "Bootstrap": { bg: "bg-violet-100", border: "border-violet-300", text: "text-violet-800", icon: "🅱️" },
  "Node.js": { bg: "bg-green-100", border: "border-green-300", text: "text-green-800", icon: "🟢" },
  "MySQL": { bg: "bg-sky-100", border: "border-sky-300", text: "text-sky-800", icon: "🐬" },
  "Canvas": { bg: "bg-teal-100", border: "border-teal-300", text: "text-teal-800", icon: "🖼️" },
  "Figma": { bg: "bg-pink-100", border: "border-pink-300", text: "text-pink-800", icon: "🎨" },
  "Framer": { bg: "bg-slate-100", border: "border-slate-300", text: "text-slate-800", icon: "🔳" },
  "Git": { bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-800", icon: "🔀" },
  "Flutter": { bg: "bg-cyan-100", border: "border-cyan-300", text: "text-cyan-800", icon: "🐦" },
  "React": { bg: "bg-sky-100", border: "border-sky-300", text: "text-sky-800", icon: "⚛️" },
  "Python": { bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-800", icon: "🐍" },
  "Java": { bg: "bg-red-100", border: "border-red-300", text: "text-red-800", icon: "☕" },
  "TypeScript": { bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-800", icon: "🔷" },
  "Kotlin": { bg: "bg-purple-100", border: "border-purple-300", text: "text-purple-800", icon: "🇰" },
  "HTML": { bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-800", icon: "📄" },
  "CSS": { bg: "bg-blue-100", border: "border-blue-300", text: "text-blue-800", icon: "🎨" },
  "PostgreSQL": { bg: "bg-indigo-100", border: "border-indigo-300", text: "text-indigo-800", icon: "🐘" },
  "MongoDB": { bg: "bg-green-100", border: "border-green-300", text: "text-green-800", icon: "🍃" },
  "SQLite": { bg: "bg-cyan-100", border: "border-cyan-300", text: "text-cyan-800", icon: "🪶" },
  "Firebase": { bg: "bg-amber-100", border: "border-amber-300", text: "text-amber-800", icon: "🔥" },
  "DynamoDB": { bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-800", icon: "⚡" },
  "MATLAB": { bg: "bg-red-100", border: "border-red-300", text: "text-red-800", icon: "📊" },
  "Verilog": { bg: "bg-violet-100", border: "border-violet-300", text: "text-violet-800", icon: "🔌" },
  "TinkerCAD": { bg: "bg-teal-100", border: "border-teal-300", text: "text-teal-800", icon: "🔧" },
  "AWS": { bg: "bg-amber-100", border: "border-amber-300", text: "text-amber-800", icon: "☁️" },
  "GitHub": { bg: "bg-gray-100", border: "border-gray-300", text: "text-gray-800", icon: "🐱" },
  "Next.js": { bg: "bg-slate-100", border: "border-slate-300", text: "text-slate-800", icon: "▲" },
  "Express.js": { bg: "bg-gray-100", border: "border-gray-300", text: "text-gray-800", icon: "🚂" },
  "TailwindCSS": { bg: "bg-cyan-100", border: "border-cyan-300", text: "text-cyan-800", icon: "💨" },
  "FastAPI": { bg: "bg-teal-100", border: "border-teal-300", text: "text-teal-800", icon: "⚡" },
  "Streamlit": { bg: "bg-red-100", border: "border-red-300", text: "text-red-800", icon: "🎈" },
  "Pandas": { bg: "bg-indigo-100", border: "border-indigo-300", text: "text-indigo-800", icon: "🐼" },
  "NumPy": { bg: "bg-blue-100", border: "border-blue-400", text: "text-blue-900", icon: "🔢" },
  "Postman": { bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-800", icon: "🚀" },
  "SQL": { bg: "bg-sky-100", border: "border-sky-300", text: "text-sky-800", icon: "🗄️" },
};

const Skills = () => {
  const totalPercentage = skillsData.reduce((acc, skill) => acc + skill.percentage, 0);

  // Helper function to get badge colors
  const getBadgeColor = (name: string) => {
    return techColors[name] || { bg: "bg-gray-100", border: "border-gray-300", text: "text-gray-800", icon: "💻" };
  };

  // Custom rows based on user's request
  const dbRow = [
    "PostgreSQL", "MySQL", "SQLite", "MongoDB", "Firebase", "SQL"
  ];
  const dbRowLooped = [...dbRow, ...dbRow, ...dbRow, ...dbRow];
  const langRow = [
    "Python", "C", "C++", "C#", "Java", "Kotlin", "Flutter", "TypeScript", "JavaScript"
  ];
  const langRowLooped = [...langRow, ...langRow, ...langRow];
  const toolsRow = [
    "Postman", "MATLAB", "Verilog", "TinkerCAD", "Figma", "Git", "GitHub", "AWS"
  ];
  const toolsRowLooped = [...toolsRow, ...toolsRow, ...toolsRow];
  const frameworksRow = [
    "FastAPI", "Streamlit", "Pandas", "NumPy", "React", "Next.js", "Node.js", "Express.js", "TailwindCSS"
  ];
  const fwRowLooped = [...frameworksRow, ...frameworksRow, ...frameworksRow];

  // Premium badge component
  const SkillBadge = ({ name, idx, category }: { name: string; idx: number; category: string }) => {
    const colors = getBadgeColor(name);
    return (
      <motion.span
        key={`${name}-${category}-${idx}`}
        className={`
          relative px-5 py-3 rounded-xl font-semibold text-sm flex-shrink-0 whitespace-nowrap
          ${colors.bg} ${colors.border} ${colors.text}
          border
          shadow-sm
          flex items-center gap-2
          hover:shadow-md hover:scale-105
          transition-all duration-300 ease-out
          cursor-default
          group
        `}
        whileHover={{ y: -2 }}
        aria-label={name}
      >
        <span className="text-base group-hover:scale-110 transition-transform duration-300">{colors.icon}</span>
        <span className="tracking-wide">{name}</span>
      </motion.span>
    );
  };

  return (
    <section id="skills" className="py-20 relative overflow-x-hidden">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Section header */}
          <div className="flex items-center gap-3 mb-6">
            <Code2 className="text-primary" size={20} />
            <h2 className="text-2xl md:text-3xl font-bold font-mono">
              <span className="text-primary">Languages</span>
              <span className="text-muted-foreground"> & Skills</span>
            </h2>
          </div>
          <h3 className="text-lg font-mono text-muted-foreground mb-1 flex items-center gap-2">
            <span className="text-primary text-2xl">&gt;</span> Tech I Use
          </h3>
        </motion.div>
      </div>

      {/* Full-bleed marquee across viewport width */}
      <div className="relative w-screen -ml-[calc(50vw-50%)] overflow-hidden bg-gradient-to-b from-background/50 to-background/20 py-8 backdrop-blur-sm">
        <div className="space-y-8">
          {/* Databases */}
          <div className="relative">
            <div className="pl-6 md:pl-20 mb-3 text-sm font-mono text-primary/80 tracking-wider">
              <span className="text-primary text-xl font-bold">$</span> <span className="text-base md:text-lg font-semibold">databases</span>
            </div>
            <div className="overflow-hidden mx-6 md:mx-20">
              <motion.div
                className="flex w-max gap-4 whitespace-nowrap"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              >
                {[...dbRowLooped, ...dbRowLooped].map((name, idx) => (
                  <SkillBadge key={`${name}-db-${idx}`} name={name} idx={idx} category="db" />
                ))}
              </motion.div>
            </div>
          </div>

          {/* Languages */}
          <div className="relative">
            <div className="pl-6 md:pl-20 mb-3 text-sm font-mono text-primary/80 tracking-wider">
              <span className="text-primary text-xl font-bold">$</span> <span className="text-base md:text-lg font-semibold">languages</span>
            </div>
            <div className="overflow-hidden mx-6 md:mx-20">
              <motion.div
                className="flex w-max gap-4 whitespace-nowrap"
                animate={{ x: ["-50%", "0%"] }}
                transition={{ duration: 27, repeat: Infinity, ease: "linear" }}
              >
                {[...langRowLooped, ...langRowLooped].map((name, idx) => (
                  <SkillBadge key={`${name}-lang-${idx}`} name={name} idx={idx} category="lang" />
                ))}
              </motion.div>
            </div>
          </div>

          {/* Tools */}
          <div className="relative">
            <div className="pl-6 md:pl-20 mb-3 text-sm font-mono text-primary/80 tracking-wider">
              <span className="text-primary text-xl font-bold">$</span> <span className="text-base md:text-lg font-semibold">tools</span>
            </div>
            <div className="overflow-hidden mx-6 md:mx-20">
              <motion.div
                className="flex w-max gap-4 whitespace-nowrap"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 29, repeat: Infinity, ease: "linear" }}
              >
                {[...toolsRowLooped, ...toolsRowLooped].map((name, idx) => (
                  <SkillBadge key={`${name}-tools-${idx}`} name={name} idx={idx} category="tools" />
                ))}
              </motion.div>
            </div>
          </div>

          {/* Frameworks */}
          <div className="relative">
            <div className="pl-6 md:pl-20 mb-3 text-sm font-mono text-primary/80 tracking-wider">
              <span className="text-primary text-xl font-bold">$</span> <span className="text-base md:text-lg font-semibold">frameworks</span>
            </div>
            <div className="overflow-hidden mx-6 md:mx-20">
              <motion.div
                className="flex w-max gap-4 whitespace-nowrap"
                animate={{ x: ["-50%", "0%"] }}
                transition={{ duration: 31, repeat: Infinity, ease: "linear" }}
              >
                {[...fwRowLooped, ...fwRowLooped].map((name, idx) => (
                  <SkillBadge key={`${name}-fw-${idx}`} name={name} idx={idx} category="fw" />
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
