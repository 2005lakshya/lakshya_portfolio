import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { achievementsData } from "@/data/portfolio";
import styles from "./Achievements.module.css";

const topRowAchievements = achievementsData.slice(0, 2);
const bottomRowAchievements = achievementsData.slice(2, 5);

const sectionVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const rowVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
    },
  },
};

const Achievements = () => {
  return (
    <section id="achievements" className={styles.section}>
      <div className={styles.shell}>
        <motion.h2
          initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] as const }}
          viewport={{ amount: 0.45, once: false }}
          className={styles.title}
        >
          ACHIEVEMENTS
        </motion.h2>

        <motion.div
          className={styles.stack}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.25, once: false }}
        >
          <motion.div className={styles.topGrid} variants={rowVariants}>
            {topRowAchievements.map((item, index) => (
              <motion.article
                key={item.version}
                initial={{ opacity: 0, y: 42, x: index % 2 === 0 ? -28 : 28, scale: 0.96, rotateZ: index % 2 === 0 ? -1.5 : 1.5 }}
                whileInView={{ opacity: 1, y: 0, x: 0, scale: 1, rotateZ: 0 }}
                transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] as const, delay: index * 0.08 }}
                whileHover={{ y: -8, scale: 1.015, rotateZ: 0 }}
                whileTap={{ scale: 0.99 }}
                viewport={{ amount: 0.35, once: false }}
                className={styles.card}
              >
                <div className={styles.cardTopRow}>
                  {item.date ? (
                    <div className={styles.badge}>
                      <span className={styles.badgeDot} />
                      <span>{item.date}</span>
                    </div>
                  ) : (
                    <span />
                  )}
                  <div className={styles.cardIndex}>.{String(index + 1).padStart(2, "0")}</div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.content}>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.cardText}>{item.description}</p>
                  </div>
                </div>

                <div className={styles.cardFooter} />
              </motion.article>
            ))}
          </motion.div>

          <motion.div
            className={styles.divider}
            initial={{ scaleX: 0.35, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ amount: 0.5, once: false }}
            aria-hidden
          />

          <motion.div className={styles.bottomGrid} variants={rowVariants}>
            {bottomRowAchievements.map((item, index) => (
              <motion.article
                key={item.version}
                initial={{ opacity: 0, y: 42, x: index % 2 === 0 ? 28 : -28, scale: 0.96, rotateZ: index % 2 === 0 ? 1.5 : -1.5 }}
                whileInView={{ opacity: 1, y: 0, x: 0, scale: 1, rotateZ: 0 }}
                transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] as const, delay: index * 0.08 }}
                whileHover={{ y: -8, scale: 1.015, rotateZ: 0 }}
                whileTap={{ scale: 0.99 }}
                viewport={{ amount: 0.35, once: false }}
                className={`${styles.card} ${styles.bottomCard}`}
              >
                <div className={styles.cardTopRow}>
                  {item.date ? (
                    <div className={styles.badge}>
                      <span className={styles.badgeDot} />
                      <span>{item.date}</span>
                    </div>
                  ) : (
                    <span />
                  )}
                  <div className={styles.cardIndex}>.{String(index + 3).padStart(2, "0")}</div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.content}>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.cardText}>{item.description}</p>
                  </div>
                </div>

                <div className={styles.cardFooter} />
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Achievements;
