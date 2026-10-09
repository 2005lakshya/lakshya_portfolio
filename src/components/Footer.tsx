import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Heart } from "lucide-react";
import { contactData } from "@/data/portfolio";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-white/10 bg-black">
      <div className="container px-6">
        <div className="max-w-5xl mx-auto">
          {/* Main footer content */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            {/* Logo/Name */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-lg font-bold tracking-tighter text-white"
            >
              LAKSHYA.
            </motion.div>

            {/* Navigation links */}
            <motion.nav
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-6"
            >
              {["Home", "About", "Projects", "Experience", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  {item}
                </a>
              ))}
            </motion.nav>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 text-white/50"
            >
              <a
                href={`https://github.com/${contactData.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <Github size={20} />
              </a>
              <a
                href={`https://linkedin.com/in/${contactData.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href={`https://twitter.com/${contactData.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a>
            </motion.div>
          </div>

          {/* Bottom section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center border-t border-white/5 pt-8"
          >
            <p className="text-sm text-white/40 flex items-center justify-center gap-2 flex-wrap">
              <span>© {currentYear} Lakshya Gupta.</span>
              <span className="flex items-center gap-1">Built with <Heart className="text-white/40" fill="currentColor" size={14} /> using React</span>
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
