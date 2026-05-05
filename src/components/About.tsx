import { motion, Variants } from "framer-motion";
import { profileData, aboutData } from "@/data/portfolio";
import styles from "./About.module.css";

const TypingText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const characters = text.split("");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.03, 
        delayChildren: delay 
      },
    },
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      y: 10,
    },
  };

  return (
    <motion.span
      style={{ overflow: "hidden", display: "inline-flex" }}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {characters.map((char, index) => (
        <motion.span variants={child} key={index}>
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

const About = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.4,
        delayChildren: 0.1,
      },
    },
  };

  const outputVariants: Variants = {
    hidden: { opacity: 0, y: 5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
  };

  const terminalOutputColor = "#a5b4fc";

  return (
    <div id="about" className={styles.createProfile}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${styles.aboutMe} site-title tracking-[0.15em] uppercase`}
      >
        ABOUT ME
      </motion.div>

      <div className={styles.container}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={styles.overlaybordershadowoverlayb}
        >
          <div className={styles.backgroundhorizontalborder}>
            <div className={styles.container2}>
              <div className={styles.background} />
              <div className={styles.background2} />
              <div className={styles.background3} />
            </div>
            <div className={styles.container3}>
              <div className={styles.text}>{aboutData.terminalName} —- zsh —- 80x24</div>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={styles.container4}
            style={{ gap: '2rem' }}
          >
            {/* Row 1: whoami */}
            <div className={styles.commandBlock}>
              <div className={styles.container5}>
                <div className={styles.stitchContainer}>
                  <span className={styles.stitch}>{aboutData.terminalName} ~ %</span>
                  <span className={styles.span}>{` `}</span>
                  <span className={styles.whoami}>
                    <TypingText text="whoami" delay={0.1} />
                  </span>
                </div>
              </div>
              <motion.div variants={outputVariants} className={styles.container6} style={{ marginTop: '4px' }}>
                <div className={styles.item}>
                  <div className={styles.fullStackEngineerWith} style={{ color: terminalOutputColor }}>
                    {aboutData.whoami}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Row 2: cat bio.js */}
            <div className={styles.commandBlock}>
              <div className={styles.container5}>
                <div className={styles.stitchContainer}>
                  <span className={styles.stitch}>{aboutData.terminalName} ~ %</span>
                  <span className={styles.span}>{` `}</span>
                  <span className={styles.whoami}>
                    <TypingText text="cat bio.js" delay={1.0} />
                  </span>
                </div>
              </div>
              <motion.div variants={outputVariants} className={styles.container6} style={{ marginTop: '4px' }}>
                <div className={styles.item}>
                  <pre className={styles.fullStackEngineerWith} style={{ fontFamily: 'inherit', color: terminalOutputColor, whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                    {aboutData.bio}
                  </pre>
                </div>
              </motion.div>
            </div>

            {/* Row 3: ls education */}
            <div className={styles.commandBlock}>
              <div className={styles.container5}>
                <div className={styles.stitchContainer}>
                  <span className={styles.stitch}>{aboutData.terminalName} ~ %</span>
                  <span className={styles.span}>{` `}</span>
                  <span className={styles.whoami}>
                    <TypingText text="ls education --details" delay={2.2} />
                  </span>
                </div>
              </div>
              <motion.div variants={outputVariants} className={styles.container6} style={{ marginTop: '4px', paddingLeft: '0' }}>
                <div className={styles.item}>
                  <div className={styles.fullStackEngineerWith} style={{ color: terminalOutputColor, fontWeight: 'bold' }}>
                    {aboutData.education.institution}
                  </div>
                  <div className={styles.fullStackEngineerWith} style={{ paddingLeft: '14px', fontSize: '13px', color: terminalOutputColor }}>
                    {aboutData.education.degree}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Active Prompt with Blinking Cursor */}
            <motion.div variants={outputVariants} className={styles.container11}>
              <div className={styles.container13}>
                <div className={styles.text2}>
                  <span className={styles.textTxt}>
                    <span className={styles.stitch}>{aboutData.terminalName} ~ %</span>
                    <span className={styles.span}>{` `}</span>
                  </span>
                </div>
                <motion.div
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className={styles.background4}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
