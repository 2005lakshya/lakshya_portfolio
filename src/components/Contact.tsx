import { useState } from "react";
import type { FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Shield, Send, CheckCircle2 } from "lucide-react";
import { contactData } from "@/data/portfolio";

const terminalItems = [
  { label: "[EMAIL]", value: contactData.email, href: `mailto:${contactData.email}` },
  { label: "[PHONE]", value: contactData.phone, href: `tel:${contactData.phone}` },
  { label: "[LINKEDIN]", value: `linkedin.com/in/${contactData.linkedin}`, href: `https://linkedin.com/in/${contactData.linkedin}` },
  { label: "[GITHUB]", value: `github.com/${contactData.github}`, href: `https://github.com/${contactData.github}` },
];

const Contact = () => {
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const packetStatus = isSent ? "PACKET_STATUS: TRANSMITTED" : isSubmitting ? "PACKET_STATUS: SENDING" : "PACKET_STATUS: READY";
  const terminalStatusLines = isSent
    ? [
        "[STATUS]: MESSAGE_TRANSMITTED...",
        "[STATUS]: ENCRYPTED_ACK_RECEIVED",
        "[STATUS]: UPLOAD_COMPLETE",
      ]
    : isSubmitting
      ? [
          "[STATUS]: INITIALIZING_ENCRYPTED_UPLINK...",
          "[STATUS]: HANDSHAKE_IN_PROGRESS...",
          "[STATUS]: TRANSMISSION_BUFFERING...",
        ]
      : [
          "[STATUS]: INITIALIZING_ENCRYPTED_UPLINK...",
          "[STATUS]: HANDSHAKE_SUCCESSFUL",
          "[STATUS]: WAITING_FOR_USER_INPUT_IN_UPLINK_MODULE...",
        ];

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setErrorMsg(null);
    setIsSubmitting(true);
    const accessKey = import.meta.env.WEB3FORMS_ACCESS_KEY || "";
    if (!accessKey) {
      const msg = "Missing WEB3FORMS_ACCESS_KEY in environment. Add it to .env and restart the dev server.";
      console.warn(msg);
      setErrorMsg(msg);
      setIsSubmitting(false);
      return;
    }
    const formData = new FormData(event.currentTarget);
    formData.append("access_key", import.meta.env.WEB3FORMS_ACCESS_KEY || "");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      });

      const result = await response.json();
      if (result.success) {
        setIsSent(true);
        setTimeout(() => setIsSent(false), 5000);
      } else {
        const msg = result.message || "Failed to send message. Please try again later.";
        console.warn("web3forms error:", result);
        setErrorMsg(msg);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Network error while sending message. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-black px-4 py-16 text-white md:px-6 md:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[#A5B4FC]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1180px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, amount: 0.2 }}
          className="rounded-[2px] bg-black/95 p-2.5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_0_40px_rgba(165,180,252,0.08)] md:p-3"
        >
          <div className="px-2 pb-10 pt-3 text-center md:pb-12 md:pt-2">
            <motion.h2
              initial={{ opacity: 0, y: -14 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.6 }}
              className="site-title max-w-none tracking-[0.15em] uppercase"
              style={{ fontSize: "clamp(56px, 8vw, 120px)" }}
            >
              CONTACT ME
            </motion.h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.95fr_1.35fr]">
            <div className="overflow-hidden border border-white/10 bg-[#090909] shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
              <div className="flex items-center justify-between border-b border-white/10 bg-[#1a1a1a] px-4 py-2 text-[9px] tracking-[0.28em] text-white/45 md:px-5">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
                  <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
                  <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
                </div>
                <span>TERMINAL_SESSION v4.0.1</span>
                <span className="w-9" aria-hidden />
              </div>

              <div className="grid grid-cols-1 gap-y-2 border-b border-white/10 bg-white/5 px-3 py-2 text-[8px] tracking-[0.22em] text-white/55 md:grid-cols-[1fr_auto] md:items-center md:px-4 md:text-[9px]">
                <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#22c55e]" />
                  <img src="/sheild.svg" alt="Shield" className="h-3.5 w-3.5 shrink-0 object-contain" />
                  <span className="truncate">ENCRYPTION_ACTIVE</span>
                </div>
                <span className="whitespace-nowrap md:justify-self-end">{packetStatus}</span>
              </div>

              <div className="px-4 py-4 font-mono text-[12px] leading-6 text-white/85 md:px-5 md:py-5 md:text-[13px]">
                <div className="mb-4 space-y-1 text-white/45">
                  <p>Last login: Wed Oct 25 04:12:09 on ttys001</p>
                  <p>System architecture: ARM64_CORE</p>
                </div>

                <div className="mb-4 flex items-center gap-2 text-[#40f59c]">
                  <span>lakshya@gupta:~$</span>
                  <span className="text-white/80">{isSent ? "message_protocol --delivered" : isSubmitting ? "message_protocol --sending" : "cat contact_info.json"}</span>
                </div>

                <div className="rounded-sm border border-white/10 bg-black/50 px-3 py-3 md:px-4">
                  <div className="grid gap-2 text-[11px] md:text-[12px]">
                    {terminalItems.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                        className="flex items-start gap-3 transition-colors hover:text-cyan-300"
                      >
                        <span className="min-w-[82px] text-[#99a7ff]">{item.label}</span>
                        <span className="break-all text-white/72">{item.value}</span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="mt-4 space-y-1 text-[#A5B4FC]">
                  <p>visitor@ARCHITECT_OS ~ $ {isSent ? "message_protocol --transmit" : isSubmitting ? "message_protocol --sending" : "run message_protocol"}</p>
                  {terminalStatusLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
              <div className="flex items-start justify-between border-b border-white/10 px-4 py-4 md:px-5">
                <div>
                  <p className="font-mono text-[18px] font-semibold tracking-[0.14em] text-white/85 md:text-[20px]">MESSAGE_UPLINK</p>
                </div>

                <div className="flex items-center gap-3 text-[10px] tracking-[0.22em] text-[#A5B4FC]">
                  <span className="hidden sm:inline">SECURE CHANNEL ID: 889-AXQ-442</span>
                  <img src="/sheild.svg" alt="Shield" className="h-6 w-6 object-contain" />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {!isSent ? (
                  <motion.form
                    key="contact-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleFormSubmit}
                    className="space-y-6 px-4 py-5 md:px-5 md:py-6"
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="block space-y-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">SENDER_NAME</span>
                        <input
                          required
                          name="name"
                          placeholder="ENTER_NAME..."
                          className="h-12 w-full border border-white/20 bg-[#111] px-4 font-mono text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-[#A5B4FC] focus:shadow-[0_0_0_1px_rgba(165,180,252,0.25)]"
                        />
                      </label>

                      <label className="block space-y-2">
                        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">COMM_CHANNEL_EMAIL</span>
                        <input
                          required
                          type="email"
                          name="email"
                          placeholder="ADDRESS@HOST.COM"
                          className="h-12 w-full border border-white/20 bg-[#111] px-4 font-mono text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-[#A5B4FC] focus:shadow-[0_0_0_1px_rgba(165,180,252,0.25)]"
                        />
                      </label>
                    </div>

                    <label className="block space-y-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">DATA_PAYLOAD_MESSAGE</span>
                      <textarea
                        required
                        name="message"
                        rows={7}
                        placeholder="BEGIN_TRANSMISSION..."
                        className="min-h-[146px] w-full resize-none border border-white/20 bg-[#111] px-4 py-3 font-mono text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-[#A5B4FC] focus:shadow-[0_0_0_1px_rgba(165,180,252,0.25)]"
                      />
                    </label>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center border border-white/20 bg-white/5 text-white/75">
                          <img src="/fingerprint.svg" alt="Fingerprint" className="h-5 w-5 object-contain" />
                        </div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                          <p className="text-white/70">BIOMETRIC_VERIFICATION</p>
                          <p>REQUIRED_BEFORE_SEND</p>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex h-11 items-center justify-center gap-2 border border-[#A5B4FC]/60 bg-black px-6 font-mono text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:border-[#A5B4FC] hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-[176px]"
                      >
                        EXECUTE_TRANSMIT
                        <img src="/arrow.svg" alt="Arrow" className="h-3.5 w-3.5 object-contain" />
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success-message"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex min-h-[320px] flex-col items-center justify-center gap-4 px-6 py-8 text-center"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white text-black">
                      <CheckCircle2 className="h-8 w-8" strokeWidth={1.4} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-mono text-xl font-semibold tracking-[0.06em] text-white">Message sent — thank you!</h3>
                      <p className="max-w-sm text-sm leading-6 text-white/60">
                        I received your message. I’ll get back to you as soon as I can. If you prefer, you can also reach me directly at <a href={`mailto:${contactData.email}`} className="underline text-white/80">{contactData.email}</a>.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setIsSent(false)}
                        className="border border-white/20 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-white transition-colors hover:bg-white/5"
                      >
                        Send another
                      </button>

                      <a
                        href={`mailto:${contactData.email}`}
                        className="inline-flex items-center gap-2 border border-transparent bg-[#A5B4FC] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-black transition-colors hover:opacity-90"
                      >
                        Contact by email
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
