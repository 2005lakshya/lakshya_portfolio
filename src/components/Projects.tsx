import { motion } from "framer-motion";
import { ExternalLink, Github, FolderGit2, Terminal, GitBranch } from "lucide-react";
import { projectsData } from "@/data/portfolio";

const Projects = () => {
  return (
    <section id="projects" className="py-20 relative">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          {/* Section header */}
          <div className="flex items-center gap-3 mb-8">
            <FolderGit2 className="text-primary" size={24} />
            <h2 className="text-2xl md:text-3xl font-bold font-mono">
              <span className="text-primary">Pinned</span>
              <span className="text-muted-foreground"> Repositories</span>
            </h2>
          </div>

          {/* Projects grid */}
          <div className="grid md:grid-cols-2 gap-5">
            {projectsData.map((project, index) => (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer"
              >
                {/* Terminal-style card */}
                <div className="h-full flex flex-col rounded-lg border border-border bg-card/80 backdrop-blur-sm overflow-hidden hover:border-primary/50 transition-all duration-300">
                  {/* Terminal header */}
                  <div className="flex items-center justify-between px-4 py-2 bg-secondary/50 border-b border-border">
                    <div className="flex items-center gap-2">
                       <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                        <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                        <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                      </div>
                      <span className="text-xs text-muted-foreground font-mono ml-2">~/projects/{project.name.toLowerCase().replace(/\s+/g, '-')}</span>
                    </div>
                    <Terminal size={14} className="text-muted-foreground" />
                  </div>

                  {/* Card content */}
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Git clone style header */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-primary font-mono text-sm">$</span>
                      <span className="text-muted-foreground font-mono text-sm">git clone</span>
                      <GitBranch size={14} className="text-primary" />
                      <h3 className="font-mono text-foreground font-bold group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                    </div>

                    {/* Description as comment */}
                    <div className="mb-4 pl-4 border-l-2 border-border flex-1">
                      <p className="text-sm text-muted-foreground font-mono">
                        <span className="text-muted-foreground/60">// </span>
                        {project.description}
                      </p>
                    </div>

                    {/* Tech stack as tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-3 py-1 rounded border border-border bg-secondary/50 text-muted-foreground font-mono hover:text-foreground transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Footer with links */}
                    <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/50">
                      <span className="text-xs text-muted-foreground font-mono">
                        <span className="text-primary">●</span> ready
                      </span>
                      <div className="flex items-center gap-1">
                        {project.github && project.github !== "#" && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Github size={18} />
                          </a>
                        )}
                        {project.demo && project.demo !== "#" && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={18} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
