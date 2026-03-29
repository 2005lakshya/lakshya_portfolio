import { motion } from "framer-motion";
import { FileCode, User } from "lucide-react";
import { aboutData } from "@/data/portfolio";

const About = () => {
  return (
    <section id="about" className="py-20 relative">
      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Section header */}
          <div className="flex items-center gap-3 mb-8">
            <FileCode className="text-primary" size={24} />
            <h2 className="text-2xl md:text-3xl font-bold font-mono">
              <span className="text-primary">README</span>
              <span className="text-muted-foreground">.md</span>
            </h2>
          </div>

          {/* README style card */}
          <div className="github-card">
            {/* File header */}
            <div className="flex items-center gap-2 pb-4 mb-4 border-b border-border">
              <User className="text-muted-foreground" size={16} />
              <span className="text-sm text-muted-foreground font-mono">about-me.js</span>
            </div>

            {/* Code block */}
            <div className="code-block mb-6 overflow-x-auto">
              <pre className="text-sm leading-relaxed">
                <code>
                  <span className="text-muted-foreground">{"// Developer Profile"}</span>
                  {"\n\n"}
                  <span className="text-lang-javascript">const</span>{" "}
                  <span className="text-foreground">lakshya</span>{" "}
                  <span className="text-muted-foreground">=</span>{" "}
                  <span className="text-foreground">{"{"}</span>
                  {"\n"}
                  {"  "}
                  <span className="text-primary">role</span>
                  <span className="text-muted-foreground">:</span>{" "}
                  <span className="text-lang-javascript">"Developer / Data Science"</span>
                  <span className="text-muted-foreground">,</span>
                  {"\n"}
                  {"  "}
                  <span className="text-primary">interests</span>
                  <span className="text-muted-foreground">:</span>{" "}
                  <span className="text-foreground">[</span>
                  <span className="text-lang-javascript">"AppDev"</span>
                  <span className="text-muted-foreground">,</span>{" "}
                  <span className="text-lang-javascript">"AI"</span>
                  <span className="text-muted-foreground">,</span>{" "}
                  <span className="text-lang-javascript">"Web Dev"</span>
                  <span className="text-foreground">]</span>
                  <span className="text-muted-foreground">,</span>
                  {"\n"}
                  {"  "}
                  <span className="text-primary">lookingFor</span>
                  <span className="text-muted-foreground">:</span>{" "}
                  <span className="text-lang-javascript">"Summer Internship 2025"</span>
                  <span className="text-muted-foreground">,</span>
                  {"\n"}
                  {"  "}
                  <span className="text-primary">education</span>
                  <span className="text-muted-foreground">:</span>{" "}
                  <span className="text-lang-javascript">"B.Tech Computer Science (Data Science)"</span>
                  <span className="text-muted-foreground">,</span>
                  {"\n"}
                  {"  "}
                  <span className="text-primary">university</span>
                  <span className="text-muted-foreground">:</span>{" "}
                  <span className="text-lang-javascript">"VIT Vellore"</span>
                  <span className="text-muted-foreground">,</span>
                  {"\n"}
                  {"  "}
                  <span className="text-primary">location</span>
                  <span className="text-muted-foreground">:</span>{" "}
                  <span className="text-lang-javascript">"India"</span>
                  {"\n"}
                  <span className="text-foreground">{"}"}</span>
                  <span className="text-muted-foreground">;</span>
                </code>
              </pre>
            </div>

            {/* Tech Stack section removed as requested */}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
