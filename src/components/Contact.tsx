import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Send, Mail, Phone, MapPin, Github, Linkedin, ExternalLink, MessageSquare, CheckCircle2, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contactData } from "@/data/portfolio";

const Contact = () => {
  const [input, setInput] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [output, setOutput] = useState<string[]>([
    "Welcome to system.terminal [Version 1.0.42]",
    "System online...",
    "Type 'help' for options.",
    "",
  ]);

  // Game States
  const [gameState, setGameState] = useState<{
    game: string | null;
    target?: number;
    attempts?: number;
    board?: (string | null)[];
  }>({ game: null });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [output]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.toLowerCase().trim();
    let response = "";

    if (cmd === "clear") {
      setOutput(["Terminal cleared.", ""]);
      setInput("");
      setGameState({ game: null });
      return;
    }

    if (cmd === "stop") {
      if (gameState.game) {
        setOutput([...output, `$ ${input}`, ">> Game terminated.", ""]);
        setGameState({ game: null });
      } else {
        setOutput([...output, `$ ${input}`, ">> No active game to stop.", ""]);
      }
      setInput("");
      return;
    }

    // GAME: GUESS THE NUMBER
    if (gameState.game === "guess") {
      const g = parseInt(cmd);
      const target = gameState.target!;
      const attempts = (gameState.attempts || 0) + 1;

      if (isNaN(g)) {
        response = ">> INVALID INPUT. Enter a number (1-20).";
      } else if (g === target) {
        response = `>> BOOM! Correct. Number was ${target}.\n>> Total attempts: ${attempts}\n>> Game OVER.`;
        setGameState({ game: null });
      } else if (attempts >= 5) {
        response = `>> FAILED. Out of tries. Number was ${target}.\n>> Game OVER.`;
        setGameState({ game: null });
      } else {
        response = `>> ${g > target ? "TOO HIGH" : "TOO LOW"}. Tries left: ${5 - attempts}`;
        setGameState({ ...gameState, attempts });
      }
      setOutput([...output, `$ ${input}`, ...response.split("\n"), ""]);
      setInput("");
      return;
    }

    // GAME: TIC-TAC-TOE
    if (gameState.game === "ttt") {
      const pos = parseInt(cmd) - 1;
      const board = [...(gameState.board || Array(9).fill(null))];

      if (isNaN(pos) || pos < 0 || pos > 8 || board[pos]) {
        response = ">> INVALID MOVE. Enter a position (1-9).";
      } else {
        board[pos] = "X";
        
        // Check Player Win
        const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        let winner = null;
        for (const [x,y,z] of wins) {
          if (board[x] && board[x] === board[y] && board[x] === board[z]) {
             winner = board[x];
             break;
          }
        }

        if (!winner) {
          // Simple AI logic
          const free = board.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
          if (free.length > 0) {
            const aiPos = free[Math.floor(Math.random() * free.length)];
            board[aiPos] = "O";
            
            // Check AI Win
            for (const [x,y,z] of wins) {
              if (board[x] && board[x] === board[y] && board[x] === board[z]) {
                 winner = board[x];
                 break;
              }
            }
          } else {
            winner = "DRAW";
          }
        }

        setGameState({ ...gameState, board });
        
        const b = board.map(v => v || ".");
        response = `>> Board State:\n  ${b[0]} ${b[1]} ${b[2]}\n  ${b[3]} ${b[4]} ${b[5]}\n  ${b[6]} ${b[7]} ${b[8]}`;
        
        if (winner) {
          response += `\n>> ${winner === "DRAW" ? "IT'S A DRAW!" : winner + " WINS!"}\n>> Game OVER.`;
          setGameState({ game: null });
        } else {
          response += "\n>> Your turn (1-9):";
        }
      }
      setOutput([...output, `$ ${input}`, ...response.split("\n"), ""]);
      setInput("");
      return;
    }

    switch (cmd) {
      case "help":
        response = `Commands: email, phone, location, github, linkedin, games, clear, all`;
        break;
      case "games":
        response = `Available Games:\n  guess - Number guessing (1-20)\n  ttt   - Tic-Tac-Toe (v/s CPU)`;
        break;
      case "guess":
        response = ">> STARTING GUESS_ENGINE...\n>> Target locked between 1-20.\n>> You have 5 tries. (Type 'stop' to exit)\n>> Enter number:";
        setGameState({ game: "guess", target: Math.floor(Math.random() * 20) + 1, attempts: 0 });
        break;
      case "ttt":
        response = ">> LOADING TIC-TAC-TOE...\n>> Input grid position (1-9) or type 'stop'.\n  . . .\n  . . .\n  . . .";
        setGameState({ game: "ttt", board: Array(9).fill(null) });
        break;
      case "email":
        response = `📧 ${contactData.email}`;
        break;
      case "phone":
        response = `📱 ${contactData.phone}`;
        break;
      case "location":
        response = `📍 ${contactData.location}`;
        break;
      case "github":
        response = `🐙 github.com/${contactData.github}`;
        break;
      case "linkedin":
        response = `💼 linkedin.com/in/${contactData.linkedin}`;
        break;
      case "all":
        response = `Contact Information:
  📧 Email: ${contactData.email}
  📱 Phone: ${contactData.phone}
  📍 Location: ${contactData.location}
  🐙 GitHub: github.com/${contactData.github}
  💼 LinkedIn: linkedin.com/in/${contactData.linkedin}`;
        break;
      default:
        response = `Command "${cmd}" not found.`;
    }

    const lines = response.split("\n");
    setOutput([...output, `$ ${input}`, ...lines, ""]);
    setInput("");
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("access_key", import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: json
      });
      const result = await response.json();
      if (result.success) {
        setIsSent(true);
        setOutput([...output, ">> Payload received.", ">> Status: SUCCESS", ">> Message SENT successfully.", ""]);
        setTimeout(() => setIsSent(false), 5000);
      }
    } catch (error) {
      setOutput([...output, ">> ERROR: Connection unstable.", ">> Failed to send message.", ""]);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background glow Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10" />

      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          {/* Main Unified Window */}
          <div className="relative rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_-12px_rgba(34,197,94,0.15)] overflow-hidden">
            {/* Window Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-primary/60" />
                <div className="ml-4 flex items-center gap-2 text-xs font-mono text-muted-foreground opacity-60">
                  <Terminal size={12} />
                  <span>CONTACT_CENTER : v1.0.42</span>
                </div>
              </div>
              <div className="hidden sm:flex gap-4">
                 <a href={`https://github.com/${contactData.github}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                    <Github size={16} />
                 </a>
                 <a href={`https://linkedin.com/in/${contactData.linkedin}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                    <Linkedin size={16} />
                 </a>
              </div>
            </div>

            <div className="grid lg:grid-cols-[40%_1fr] divide-y lg:divide-y-0 lg:divide-x divide-white/5">
              {/* Left Side: Contact Form Node */}
              <div className="p-8 space-y-6 bg-black/20">
                {/* Quick Info */}
                <div className="pb-6 border-b border-white/5 grid grid-cols-1 gap-4">
                   <div className="flex items-center gap-3 group">
                      <a href={`mailto:${contactData.email}`} className="p-2 rounded-lg bg-white/5 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Mail size={16} />
                      </a>
                      <p className="text-xs font-mono truncate">{contactData.email}</p>
                   </div>
                   <div className="flex items-center gap-3 group">
                      <a href={`tel:${contactData.phone}`} className="p-2 rounded-lg bg-white/5 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <Phone size={16} />
                      </a>
                      <p className="text-xs font-mono truncate">{contactData.phone}</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                        <MessageSquare size={18} />
                      </div>
                      <h3 className="text-xl font-bold tracking-tight">Direct Messaging</h3>
                   </div>
                   
                   <AnimatePresence mode="wait">
                     {!isSent ? (
                       <motion.form
                         key="contact-form"
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -10 }}
                         onSubmit={handleFormSubmit}
                         className="space-y-4"
                       >
                         <div className="space-y-1.5">
                           <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Source Identity</label>
                           <input 
                              required 
                              name="name"
                              placeholder="your name" 
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm font-mono focus:border-primary/40 focus:ring-1 focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(34,197,94,0.15)] focus:outline-none transition-all"
                           />
                         </div>
                         <div className="space-y-1.5">
                           <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Return Node (Email)</label>
                           <input 
                              required 
                              type="email" 
                              name="email"
                              placeholder="your@email.com" 
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm font-mono focus:border-primary/40 focus:ring-1 focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(34,197,94,0.15)] focus:outline-none transition-all"
                           />
                         </div>
                         <div className="space-y-1.5">
                           <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Payload (Message)</label>
                           <textarea 
                              required 
                              name="message"
                              placeholder="type your message here..." 
                              rows={3}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm font-mono focus:border-primary/40 focus:ring-1 focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(34,197,94,0.15)] focus:outline-none transition-all resize-none"
                           />
                         </div>
                         <Button type="submit" className="w-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all font-mono text-xs tracking-widest uppercase py-6 shadow-sm hover:shadow-primary/10">
                            Transmit Message
                         </Button>
                       </motion.form>
                     ) : (
                       <motion.div
                         key="success-message"
                         initial={{ opacity: 0, scale: 0.9 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="flex flex-col items-center justify-center py-12 text-center space-y-4"
                       >
                         <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                           <CheckCircle2 size={32} />
                         </div>
                         <div className="space-y-1">
                            <h4 className="text-lg font-bold text-primary">Message Sent Successfully</h4>
                            <p className="text-sm text-muted-foreground lowercase tracking-tight">Sent to {contactData.email}</p>
                         </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
                </div>
              </div>

              {/* Right Side: Terminal Command Center */}
              <div className="p-8 flex flex-col h-[520px]">
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto mb-6 pr-2 custom-scrollbar scroll-smooth"
                >
                  {output.map((line, index) => (
                    <div
                      key={index}
                      className={`${
                        line.startsWith("$") ? "text-primary/90 font-bold" : "text-foreground/80"
                      } font-mono text-sm mb-1.5 leading-relaxed`}
                    >
                      {line.startsWith("$") ? (
                        <span className="flex items-center gap-2">
                          <span className="text-primary/40">λ</span>
                          {line.substring(2)}
                        </span>
                      ) : (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.1 }}
                        >
                          {line}
                        </motion.span>
                      )}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleCommand} className="relative mt-auto">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 font-mono font-bold flex items-center gap-2">
                     {gameState.game ? <Gamepad2 size={14} className="animate-pulse" /> : <span>λ</span>}
                   </div>
                   <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-12 py-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all placeholder:text-white/10"
                    placeholder={gameState.game ? `playing ${gameState.game}...` : "type 'help' or 'games'"}
                    autoComplete="off"
                   />
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
