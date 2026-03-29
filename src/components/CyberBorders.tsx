import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CyberBorders = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      animationFrameId = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Format to 4 digits to keep it steady
  const formatCoord = (num: number) => {
    return num.toString().padStart(4, "0").split("");
  };

  const xChars = formatCoord(mousePos.x);
  const yChars = formatCoord(mousePos.y);

  return (
    <>
      {/* Left Border Framework */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="fixed left-2 xl:left-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center justify-center z-40 pointer-events-none font-mono text-[11px] font-medium text-muted-foreground/50 tracking-widest leading-none select-none"
      >
        <div className="flex flex-col gap-1.5 items-center">
          <span className="text-primary/80 font-bold mb-1">X</span>
          {xChars.map((char, i) => (
            <span key={`x-${i}`}>{char}</span>
          ))}
          
          <span className="my-3 text-primary/30">/</span>
          <span className="mb-3 text-primary/30">/</span>
          
          <span className="text-primary/80 font-bold mb-1">Y</span>
          {yChars.map((char, i) => (
            <span key={`y-${i}`}>{char}</span>
          ))}
        </div>
      </motion.div>

      {/* Right Border Framework */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="fixed right-2 xl:right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center justify-center z-40 pointer-events-none font-mono text-[11px] font-medium text-muted-foreground/50 tracking-widest leading-none select-none"
      >
        <div className="flex flex-col gap-1.5 items-center">
          <span className="text-primary/80 font-bold mb-2">S</span>
          <span>Y</span>
          <span>S</span>
          <span>T</span>
          <span>E</span>
          <span>M</span>
          
          <span className="my-4 text-primary/30">|</span>
          
          <span className="text-primary/80 font-bold mb-2">O</span>
          <span>N</span>
          <span>L</span>
          <span>I</span>
          <span>N</span>
          <span>E</span>
        </div>
      </motion.div>
    </>
  );
};

export default CyberBorders;
