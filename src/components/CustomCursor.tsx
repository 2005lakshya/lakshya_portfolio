import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 250 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const checkIsDesktop = () => {
      const isFinePointer = window.matchMedia("(pointer: fine)").matches;
      setIsVisible(isFinePointer);
    };

    checkIsDesktop();
    const pointerMedia = window.matchMedia("(pointer: fine)");
    pointerMedia.addEventListener("change", checkIsDesktop);
    window.addEventListener("resize", checkIsDesktop);

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      pointerMedia.removeEventListener("change", checkIsDesktop);
      window.removeEventListener('resize', checkIsDesktop);
      window.removeEventListener("mousemove", moveCursor);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <motion.div
        style={{
          left: cursorXSpring,
          top: cursorYSpring,
          x: "-50%",
          y: "-50%",
          backgroundColor: "#ffffff",
          mixBlendMode: "difference",
        }}
        className="absolute h-3.5 w-3.5 rounded-full"
      />
    </div>
  );
};

export default CustomCursor;
