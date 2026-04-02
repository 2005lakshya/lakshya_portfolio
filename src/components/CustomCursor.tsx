import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 250 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Only enable if device isn't touch-capable and has a viewport width for desktop
    const checkIsDesktop = () => {
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isLargeScreen = window.innerWidth >= 1024;
      setIsVisible(!isTouch && isLargeScreen);
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.style.cursor === "pointer"
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener('resize', checkIsDesktop);
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Main Outer Circle */}
      <motion.div
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: "-50%",
          y: "-50%",
        }}
        className="absolute w-8 h-8 rounded-full border border-primary/50 mix-blend-difference flex items-center justify-center"
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 1.8 : 1,
          backgroundColor: isHovering ? "rgba(34, 197, 94, 0.15)" : "rgba(34, 197, 94, 0)",
          borderWidth: isHovering ? "1.5px" : "1px",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Technical HUD bits inside circle on hover */}
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-[1px] border-dashed border-primary/30 rounded-full"
          />
        )}
      </motion.div>

      {/* Precise Center Dot */}
      <motion.div
        style={{
          left: cursorX,
          top: cursorY,
          x: "-50%",
          y: "-50%",
        }}
        className="absolute w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"
        animate={{
          scale: isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1,
        }}
      />

      {/* Crosshair Brackets (Minimalist) */}
      <motion.div
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: "-50%",
          y: "-50%",
        }}
        className="absolute w-12 h-12"
      >
        {[0, 90, 180, 270].map((rotation) => (
          <motion.div
            key={rotation}
            style={{ rotate: rotation }}
            className="absolute inset-0 flex items-start justify-start p-1"
            animate={{
              opacity: isHovering ? 1 : 0,
              scale: isHovering ? 1 : 0.8,
            }}
          >
            <div className="w-2 h-2 border-l border-t border-primary/60" />
          </motion.div>
        ))}
      </motion.div>

      {/* Click Ping Effect */}
      {isClicking && (
        <motion.div
          initial={{ 
            left: cursorX.get(), 
            top: cursorY.get(), 
            x: "-50%", 
            y: "-50%", 
            scale: 0.5, 
            opacity: 0.8 
          }}
          animate={{ scale: 3, opacity: 0 }}
          className="absolute w-8 h-8 bg-primary/40 rounded-full"
        />
      )}
    </div>
  );
};

export default CustomCursor;
