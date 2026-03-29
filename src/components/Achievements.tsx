import { motion } from "framer-motion";
import { Tag, Award } from "lucide-react";
import { achievementsData } from "@/data/portfolio";

const Achievements = () => {
  return (
    <section id="achievements" className="py-20 relative">
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
            <Award className="text-primary" size={24} />
            <h2 className="text-2xl md:text-3xl font-bold font-mono">
              <span className="text-primary">Extra-curricular</span>
              <span className="text-muted-foreground"> & Achievements</span>
            </h2>
          </div>

          {/* Achievements list */}
          <div className="space-y-4">
            {achievementsData.map((achievement, index) => (
              <motion.div
                key={achievement.version}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="github-card"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Version tag */}
                  <div className="flex items-center gap-2">
                    <Tag className="text-primary" size={16} />
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary font-mono text-sm font-semibold">
                      {achievement.version}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-foreground font-semibold mb-1">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground font-mono">
                      {achievement.date}
                    </span>
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

export default Achievements;
