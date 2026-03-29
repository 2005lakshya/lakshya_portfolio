import { motion } from "framer-motion";
import { GitCommit, Calendar, Building2 } from "lucide-react";
import { experienceData } from "@/data/portfolio";

const typeColors: Record<string, string> = {
  feat: "bg-primary/20 text-primary border-primary/30",
  fix: "bg-lang-javascript/20 text-lang-javascript border-lang-javascript/30",
  docs: "bg-lang-typescript/20 text-lang-typescript border-lang-typescript/30",
  refactor: "bg-lang-kotlin/20 text-lang-kotlin border-lang-kotlin/30",
};

const Experience = () => {
  return (
    <section id="experience" className="py-20 relative">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Section header */}
          <div className="flex items-center gap-3 mb-12">
            <GitCommit className="text-primary" size={24} />
            <h2 className="text-2xl md:text-3xl font-bold font-mono">
              <span className="text-primary">git</span>
              <span className="text-muted-foreground"> log --oneline</span>
            </h2>
          </div>

          {/* Commit timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

            <div className="space-y-8">
              {experienceData.map((experience, index) => (
                <motion.div
                  key={experience.hash}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative pl-14"
                >
                  {/* Commit dot */}
                  <motion.div 
                    className="absolute left-[12px] top-6 w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-lg shadow-primary/20"
                    whileHover={{ scale: 1.2 }}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                  </motion.div>

                  {/* Commit card */}
                  <motion.div 
                    className="github-card hover:border-primary/50 transition-all duration-300 group"
                    whileHover={{ x: 5 }}
                  >
                    {/* Type badge and hash */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold border ${typeColors[experience.type]}`}>
                        {experience.type}
                      </span>
                      <code className="text-xs text-muted-foreground font-mono bg-secondary/50 px-2 py-1 rounded">
                        {experience.hash}
                      </code>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {experience.title}
                    </h3>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Calendar size={14} className="text-primary" />
                      <span className="font-mono">{experience.date}</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed pl-3 border-l-2 border-primary/30">
                      {experience.description}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
