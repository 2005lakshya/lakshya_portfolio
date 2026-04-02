import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Send, Mail, Phone, Github, Linkedin, MessageSquare, CheckCircle2, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { contactData } from "@/data/portfolio";

const Contact = () => {
  const [input, setInput] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [output, setOutput] = useState<string[]>([
    "Welcome to system.terminal [Version 2.0.42]",
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
        const wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        let winner = null;
        for (const [x, y, z] of wins) {
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
            for (const [x, y, z] of wins) {
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
    if (isSubmitting) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append("access_key", import.meta.env.WEB3FORMS_ACCESS_KEY || "");

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
        setOutput(prev => [...prev, ">> Transmitting packet...", ">> Response code: 200", ">> TRANSMISSION_SUCCESSFUL", ""]);
        setTimeout(() => setIsSent(false), 5000);
      } else {
        setOutput(prev => [...prev, ">> ERROR: Access key invalid.", ">> Server response code: 401", ""]);
      }
    } catch (error) {
      setOutput(prev => [...prev, ">> ERROR: Connection unstable.", ">> Failed to send message.", ""]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      {/* Dynamic Background decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[160px] rounded-full -z-10 animate-pulse" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-green-500/5 blur-[120px] rounded-full -z-10" />

      <div className="container px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Header Label */}
          <div className="flex flex-col items-center mb-10 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[9px] font-mono tracking-[0.15em] uppercase mb-3"
            >
              <motion.div
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.4, 1],
                  backgroundColor: ["rgba(34,197,94,0)", "rgba(34,197,94,0.2)", "rgba(34,197,94,0)"]
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="p-1 rounded-md"
              >
                <Terminal size={12} />
              </motion.div>
              <span className="font-bold tracking-widest">COMM_CENTER_V2</span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Get in <span className="text-primary italic font-serif">Touch</span></h2>
          </div>

          {/* Main Unified Window */}
          <div className="relative rounded-[1.5rem] bg-white/[0.02] backdrop-blur-2xl border border-white/5 shadow-2xl overflow-hidden group">
            {/* Window Header / Title Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#FF5F56] shadow-[0_0_10px_rgba(255,95,86,0.2)]" />
                  <div className="w-2 h-2 rounded-full bg-[#FFBD2E] shadow-[0_0_10px_rgba(255,189,46,0.2)]" />
                  <div className="w-2 h-2 rounded-full bg-[#27C93F] shadow-[0_0_10px_rgba(39,201,63,0.2)]" />
                </div>
                <div className="ml-4 flex items-center gap-3 text-[8px] font-mono text-muted-foreground/40 uppercase tracking-[0.2em]">
                  <span className="w-1 h-1 rounded-full bg-primary/20" />
                  <span>Terminal Hub — lakshya@dev</span>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
              {/* Left Side: Contact Form Node */}
              <div className="p-5 lg:p-6 space-y-6 bg-transparent">
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary/70">
                      <MessageSquare size={16} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold tracking-tight leading-none mb-1">Direct Node</h3>
                      <p className="text-[8px] text-primary/30 font-mono uppercase tracking-[0.1em]">Protocol 4.2</p>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {!isSent ? (
                      <motion.form
                        key="contact-form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        onSubmit={handleFormSubmit}
                        className="space-y-3.5"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          <div className="space-y-1.5">
                            <label className="text-[8px] font-mono uppercase tracking-[0.15em] text-primary/40 ml-1">Identity</label>
                            <div className="relative group/input">
                              <input
                                required
                                name="name"
                                placeholder="Source Name"
                                className="w-full bg-white/[0.01] border border-white/5 rounded-xl px-4 py-3 text-[10px] font-mono focus:border-primary/10 focus:bg-white/[0.02] focus:outline-none transition-all placeholder:text-white/5"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[8px] font-mono uppercase tracking-[0.15em] text-primary/40 ml-1">Return_Path</label>
                            <div className="relative group/input">
                              <input
                                required
                                type="email"
                                name="email"
                                placeholder="Source Email"
                                className="w-full bg-white/[0.01] border border-white/5 rounded-xl px-4 py-3 text-[10px] font-mono focus:border-primary/10 focus:bg-white/[0.02] focus:outline-none transition-all placeholder:text-white/5"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[8px] font-mono uppercase tracking-[0.15em] text-primary/40 ml-1">Payload_Data</label>
                          <div className="relative group/input">
                            <textarea
                              required
                              name="message"
                              placeholder="Initialize sequence..."
                              rows={4}
                              className="w-full bg-white/[0.01] border border-white/5 rounded-2xl px-4 py-4 text-[10px] font-mono focus:border-primary/10 focus:bg-white/[0.02] focus:outline-none transition-all resize-none placeholder:text-white/5"
                            />
                          </div>
                        </div>
                        <Button type="submit" className="w-full h-11 rounded-xl bg-primary/10 text-primary border border-primary/20 font-black font-mono text-[9px] tracking-[0.2em] uppercase hover:bg-primary/20 hover:text-primary transition-all shadow-lg shadow-primary/5 group/btn">
                          Transmit Sequence
                          <Send size={12} className="ml-2 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </Button>
                      </motion.form>
                    ) : (
                      <motion.div
                        key="success-message"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-8 text-center space-y-6 bg-primary/[0.02] border border-primary/10 rounded-2xl shadow-inner"
                      >
                        <div className="w-16 h-16 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                          <CheckCircle2 size={32} strokeWidth={1} />
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="text-base font-bold text-primary uppercase tracking-[0.2em]">Transmission ACK</h4>
                          <p className="text-[9px] text-muted-foreground/50 font-mono leading-tight">Data packet successfully<br />integrated into target node.</p>
                        </div>
                        <Button onClick={() => setIsSent(false)} variant="ghost" className="h-8 text-[8px] font-mono uppercase tracking-[0.3em] hover:bg-primary/5 text-primary/40 hover:text-primary transition-all">
                          New Connection
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer Info */}
                <div className="pt-5 border-t border-white/5 flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 group/item">
                      <div className="w-7 h-7 rounded-lg bg-white/[0.01] border border-white/5 flex items-center justify-center text-muted-foreground/30 group-hover/item:border-primary/20 group-hover/item:text-primary transition-all">
                        <Mail size={12} />
                      </div>
                      <p className="text-[10px] font-mono text-muted-foreground group-hover/item:text-foreground transition-colors">{contactData.email}</p>
                    </div>
                    <div className="flex items-center gap-2.5 group/item">
                      <div className="w-7 h-7 rounded-lg bg-white/[0.01] border border-white/5 flex items-center justify-center text-muted-foreground/30 group-hover/item:border-primary/20 group-hover/item:text-primary transition-all">
                        <Phone size={12} />
                      </div>
                      <p className="text-[10px] font-mono text-muted-foreground group-hover/item:text-foreground transition-colors">{contactData.phone}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <a
                      href={`https://github.com/${contactData.github}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-primary/40 hover:text-primary hover:bg-primary/5 hover:border-primary/20 transition-all shadow-sm"
                    >
                      <Github size={14} />
                    </a>
                    <a
                      href={`https://linkedin.com/in/${contactData.linkedin}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-white/[0.02] border border-white/5 text-primary/40 hover:text-primary hover:bg-primary/5 hover:border-primary/20 transition-all shadow-sm"
                    >
                      <Linkedin size={14} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Side: Terminal Command Center */}
              <div className="p-5 sm:p-6 lg:p-8 flex flex-col h-[350px] sm:h-[400px] lg:h-[480px] bg-white/[0.01] backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-white/5">
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto mb-6 pr-4 custom-scrollbar scroll-smooth space-y-3"
                >
                  <div className="flex flex-col gap-1 opacity-20 mb-4 font-mono">
                    <span className="text-[8px] tracking-tighter">SECURE CONNECTOR V4.x2</span>
                    <span className="text-[8px] tracking-tighter text-primary/80">ENCRYPTION: ACTIVE</span>
                  </div>

                  {output.map((line, index) => (
                    <div
                      key={index}
                      className="font-mono text-[12px] leading-relaxed"
                    >
                      {line.startsWith("$") ? (
                        <div className="flex items-start gap-3 mt-4 mb-2">
                          <div className="w-5 h-5 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-[9px] text-primary font-bold shadow-sm">λ</div>
                          <span className="text-foreground/80 font-black tracking-widest uppercase italic bg-white/[0.02] px-2 py-0.5 rounded transition-all">{line.substring(2)}</span>
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`${line.startsWith(">>") || line.includes(":") ? "text-primary/80" : "text-white/60"
                            } pl-8 relative`}
                        >
                          <div className="absolute left-3.5 top-1 bottom-1 w-[1px] bg-white/[0.03]" />
                          {line}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="relative group/terminal-input mt-auto">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {gameState.game ? <Gamepad2 size={14} className="animate-pulse text-primary" /> : <div className="w-1 h-2.5 bg-primary/60 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />}
                  </div>
                  <form onSubmit={handleCommand}>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="w-full bg-white/[0.01] border border-white/5 rounded-xl pl-10 pr-6 py-4 font-mono text-[10px] focus:outline-none focus:bg-white/[0.02] focus:border-primary/20 transition-all placeholder:text-white/[0.05] uppercase tracking-[0.2em]"
                      placeholder={gameState.game ? `IN:${gameState.game} >` : "INIT_CMD..."}
                      autoComplete="off"
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
