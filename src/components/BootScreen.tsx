import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BootScreenProps {
  onComplete: () => void;
}

const bootMessages = [
  { text: "> Initializing Portfolio.OS v1.0.0...", delay: 0 },
  { text: "> Loading system modules...", delay: 800 },
  { text: "> Mounting developer profile...", delay: 1800 },
  { text: "> Authenticating GitHub repos...", delay: 2800 },
  { text: "> Compiling skills database...", delay: 3800 },
  { text: "> Rendering UI components...", delay: 4800 },
  { text: "> System ready.", delay: 5800 },
];

const BootScreen = ({ onComplete }: BootScreenProps) => {
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const messageTimers = bootMessages.map((_, index) =>
      setTimeout(() => {
        setVisibleMessages(index + 1);
        setProgress(((index + 1) / bootMessages.length) * 100);
      }, bootMessages[index].delay)
    );

    const completeTimer = setTimeout(() => {
      setIsComplete(true);
      setTimeout(onComplete, 1200);
    }, 6800);

    return () => {
      messageTimers.forEach(clearTimeout);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
        >
          {/* Scanline overlay */}
          <div className="scanline absolute inset-0 pointer-events-none" />
          
          {/* Terminal window */}
          <div className="w-full max-w-2xl px-6">
            {/* Terminal header */}
            <div className="flex items-center gap-2 bg-secondary rounded-t-lg px-4 py-2 border border-border border-b-0">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <div className="w-3 h-3 rounded-full bg-lang-javascript" />
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="ml-4 text-sm font-mono text-muted-foreground">
                portfolio.terminal
              </span>
            </div>
            
            {/* Terminal body */}
            <div className="bg-card border border-border rounded-b-lg p-6 font-mono text-sm terminal-box-glow">
              {/* Boot messages */}
              <div className="space-y-2 mb-6 min-h-[200px]">
                {bootMessages.slice(0, visibleMessages).map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`${
                      message.text.includes("ready") 
                        ? "text-primary terminal-glow" 
                        : "text-foreground"
                    }`}
                  >
                    {message.text}
                    {index === visibleMessages - 1 && visibleMessages < bootMessages.length && (
                      <span className="cursor-blink text-primary ml-1">_</span>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Loading...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden border border-border">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                    style={{
                      boxShadow: "0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary) / 0.5)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ASCII art signature */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="mt-6 text-center font-mono text-xs text-muted-foreground"
            >
              <pre className="inline-block text-primary/50">
{`
 _         _        _                   
| |   __ _| | _____| |_ _   _ __ _ 
| |  / _\` | |/ / __| '_ \\ | | / _\` |
| |_| (_| |   <\\__ \\ | | | |_| (_| |
|____\\__,_|_|\\_\\___/_| |_|\\__, |\\__,_|
                          |___/        
`}
              </pre>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BootScreen;
