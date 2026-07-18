import { useEffect, useRef, useState } from "react";
import { Bot, X, Send, Loader2 } from "lucide-react";
import { createServerFn } from "@tanstack/react-start";
import { playTick } from "@/lib/sound";
import { motion, AnimatePresence } from "motion/react";

// Server function calling the Groq API securely
const askGroq = createServerFn({ method: "POST" }).handler(
  async ({ data: prompt }: { data: string }) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return "__NO_API_KEY__";
    }

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: `You are an AI assistant representing Ayush Agarwal on his portfolio website.
Ayush is a 17-year-old Systems & Agent Engineer based in Vellore, India. He builds high-performance e-commerce engines, AI agent pipelines, and developer tooling. He starts his CSE degree at VIT (Vellore Institute of Technology) in August 2026.

Availability:
- Open to remote software engineering roles, high-velocity contract work, and freelance consulting.
- Due to starting college in August 2026, he is actively seeking remote part-time positions, flexible freelance contracts, or summer internships.

Engineering Philosophy:
- Pragmatism over theoretical hype. He builds "systems that ship, agents that work, and products that scale."
- Prioritizes engineering integrity: implementing proper outlier baselines, multi-model consensus, fallback chains, and circuit breakers to prevent systemic failure.

Key Stats & Outcomes:
- Shipped 3 production AI/SaaS projects solo in 30 days total (June - July 2026).
- Portfolio infra cost: ₹0 (designed for maximum efficiency using free tiers).
- Lighthouse performance & SEO score: 100.

Key Projects:
1. Vurlo (Live at https://vurlo.store):
   - Tech: React 19, TanStack Start, Firebase Auth & Firestore Rules, Razorpay checkout, Gemini API, Tailwind CSS.
   - Built solo in 10 days. Features in-memory caching, atomic database transaction stock-locking to prevent overselling, and 100 Lighthouse SEO.
2. Veltrix (Autonomous Instagram Growth Pipeline):
   - Tech: Python, Gemini, Groq, Cerebras, OpenRouter, SiliconFlow, Hugging Face, Unsplash, NVIDIA, Logo.dev, Brandfetch, Supabase, Cloudinary, Discord, Instagram/Threads Graph APIs, GitHub Actions.
   - Scale: Orchestrates 18+ active API keys with a gated paid API model. Gemini Pro is invoked for creative copywriting ONLY after drafts clear the low-cost Llama validation audits.
   - Fallbacks:
     - Audit Chain: Groq (Llama 3.3 70B) ➡️ Cerebras (gpt-oss-120b) ➡️ OpenRouter (Gemma 31B free) ➡️ Raw Gemini fallback.
     - Image Gen: SiliconFlow (Flux/SD3) ➡️ Hugging Face ➡️ Gemini internal generator.
     - Logo Assets: Logo.dev ➡️ Brandfetch API ➡️ Brandfetch CDN ➡️ Google Favicon API ➡️ text placeholder.
     - Logs & DB: Supabase ➡️ local SQLite (veltrix.db) and JSON backup.
     - Cost per post is only ~$0.0002. Runs 2 posts / day automatically.
3. Vcentre (Competitor Intelligence Scraper):
   - Tech: Python, Apify, SQLite, Supabase, Groq, Cerebras, FastAPI, GitHub Actions.
   - Scrapes competitor Instagram accounts nightly. Cohort-scores Reels/Photos separately, filters outliers (>3x-median engagement), analyzes content via a 10-provider LLM fallback chain, and outputs creative briefs. Cost is $0/month.

Tech Stack:
- AI Agents & Pipelines: Python, Gemini API, Groq, Cerebras, LangGraph, GitHub Actions.
- E-Commerce & SaaS: React 19, TanStack Start, Firebase Auth & Firestore Rules, Razorpay Checkout.
- Data & Systems: SQLite, Supabase, FastAPI, Playwright, Jinja2, Cloudflare Pages.
- Interfaces: TypeScript, Tailwind CSS, Framer Motion, Figma.

Social Links:
- GitHub: https://github.com/theayushagarwal
- LinkedIn: https://linkedin.com/in/ayushagarwal17
- Email: theayush.codes@gmail.com
- Contact: Suggest filling out the contact form at the bottom of the page or emailing theayush.codes@gmail.com.

Navigational & Page Context Hints:
- You can direct users to scroll and explore sections of this page:
  - Timeline: "Check out the chronological timeline under the About section."
  - Stack: "Scroll down to see his full visual stack competencies."
  - Projects: "Click any project card in the Selected Work section to open the live workspace code panel."

Guardrails & Instructions:
- Do not make up facts or project details.
- If asked about topics outside Ayush's background, politely redirect them back to his portfolio work.
- Format responses beautifully using **bolding** and inline code \`like this\` where appropriate.
- When mentioning emails, keep them as theayush.codes@gmail.com.

Tone & Style:
- Engineering-focused, direct, and crisp.
- Keep simple answers short (3-4 sentences). For deep technical/architectural queries, feel free to give comprehensive, detailed answers up to 400-500 tokens.`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.5,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API returned status ${response.status}`);
      }

      const resData = await response.json();
      return resData.choices[0].message.content || "";
    } catch (err) {
      console.error("Groq API error:", err);
      return "__API_ERROR__";
    }
  },
);

interface Message {
  sender: "user" | "bot";
  text: string;
}

const QUICK_PROMPTS = [
  { label: "🧠 Veltrix Consensus", query: "How does Veltrix's consensus system work?" },
  { label: "🛒 Vurlo E-Commerce", query: "Tell me about Vurlo.store" },
  { label: "💼 Availability", query: "Are you open to freelance or full-time roles?" },
  { label: "⚙️ Stack", query: "What is your main technology stack?" },
];

function getLocalResponse(prompt: string): string {
  const lowercase = prompt.toLowerCase();

  if (
    lowercase.includes("veltrix") ||
    lowercase.includes("consensus") ||
    lowercase.includes("instagram")
  ) {
    return "Veltrix is an autonomous Instagram account that designs slides and publishes posts twice a day. It uses an adversarial consensus loop: Gemini drafts content, and Groq + Cerebras act as independent auditors. Headless Playwright renders carousels at full resolution.";
  }
  if (
    lowercase.includes("vurlo") ||
    lowercase.includes("e-commerce") ||
    lowercase.includes("saas")
  ) {
    return "Vurlo (vurlo.store) is a full-stack e-commerce SaaS platform built solo in 10 days. It handles Razorpay checkouts, granular Firebase security rules, and atomic database transaction stock-locking to prevent overselling.";
  }
  if (
    lowercase.includes("vcentre") ||
    lowercase.includes("scraper") ||
    lowercase.includes("competitor")
  ) {
    return "Vcentre scrapes competitor Instagram accounts nightly. It isolates Reel/Photo engagement baselines, filters outliers using a 3x-median floor, analyses content via a 10-provider LLM fallback chain, and runs a closed-loop performance feedback job.";
  }
  if (
    lowercase.includes("stack") ||
    lowercase.includes("tech") ||
    lowercase.includes("languages") ||
    lowercase.includes("framework")
  ) {
    return "Ayush's main stack is TypeScript, React 19, TanStack Start, Python, Supabase, SQLite, and Playwright. For AI/Agents, he uses Gemini, Groq, Cerebras, and LangGraph.";
  }
  if (
    lowercase.includes("hire") ||
    lowercase.includes("work") ||
    lowercase.includes("contact") ||
    lowercase.includes("freelance") ||
    lowercase.includes("email")
  ) {
    return "Ayush is available for hire and freelance work! You can contact him by filling out the form at the bottom of the page, or by emailing theayush.codes@gmail.com directly.";
  }
  if (
    lowercase.includes("age") ||
    lowercase.includes("years old") ||
    lowercase.includes("college") ||
    lowercase.includes("vit")
  ) {
    return "Ayush is 17 years old and starts his Computer Science Engineering (CSE) degree at VIT (Vellore Institute of Technology) this August (2026).";
  }
  return "I'm Ayush's virtual agent. I can tell you about Vurlo, Veltrix, Vcentre, his tech stack, or his availability! Try clicking one of the quick prompt chips or ask me a specific question.";
}

function formatMessageText(text: string) {
  // Parse email addresses
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g;

  return text.split("\n").map((line, lineIdx) => {
    // Split by bold (**bold**) and inline code (`code`)
    const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);

    return (
      <div key={lineIdx} className={lineIdx > 0 ? "mt-1.5" : ""}>
        {parts.map((part, partIdx) => {
          // Bold formatting
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={partIdx} className="font-semibold text-foreground">
                {part.slice(2, -2)}
              </strong>
            );
          }
          // Code formatting
          if (part.startsWith("`") && part.endsWith("`")) {
            return (
              <code
                key={partIdx}
                className="font-mono text-[11px] bg-black/40 px-1 py-0.5 rounded border border-white/5 text-primary"
              >
                {part.slice(1, -1)}
              </code>
            );
          }

          // Email formatting within regular text
          const subParts = part.split(emailRegex);
          return subParts.map((subPart, subPartIdx) => {
            if (emailRegex.test(subPart)) {
              return (
                <a
                  key={subPartIdx}
                  href={`mailto:${subPart}`}
                  className="underline text-primary hover:text-secondary transition-colors"
                >
                  {subPart}
                </a>
              );
            }
            return subPart;
          });
        })}
      </div>
    );
  });
}

export function Chatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hey! I'm Ayush's virtual agent. Ask me anything about his projects, tech stack, or availability!",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    playTick(0.2); // Play sound on send
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInputValue("");
    setIsLoading(true);

    // Normalize keys: lowercase, strip punctuation/emojis, collapse whitespace
    const cacheKey = text
      .trim()
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "")
      .replace(/\s+/g, " ");

    // Bounded eviction setter to stay within storage limits safely
    const safeSetItem = (key: string, value: string) => {
      try {
        if (typeof window !== "undefined") {
          const keysStr = sessionStorage.getItem("vagent_cache_keys");
          let keys: string[] = keysStr ? JSON.parse(keysStr) : [];

          keys = keys.filter((k) => k !== key);
          keys.push(key);

          // Enforce 50-item cache size ceiling (FIFO eviction)
          if (keys.length > 50) {
            const oldest = keys.shift();
            if (oldest) {
              sessionStorage.removeItem(`vagent_cache_${oldest}`);
            }
          }

          sessionStorage.setItem(`vagent_cache_${key}`, value);
          sessionStorage.setItem("vagent_cache_keys", JSON.stringify(keys));
        }
      } catch (e) {
        console.warn("sessionStorage cache write bypassed:", e);
      }
    };

    try {
      // Check client-side sessionStorage cache first
      if (typeof window !== "undefined") {
        const cachedResponse = sessionStorage.getItem(`vagent_cache_${cacheKey}`);
        if (cachedResponse) {
          // Play instant responsive audio feedback + minor typing indicator delay
          await new Promise((resolve) => setTimeout(resolve, 300));
          playTick(-0.2);
          setMessages((prev) => [...prev, { sender: "bot", text: cachedResponse }]);
          setIsLoading(false);
          return;
        }
      }

      // Call the server function which queries Groq
      const response = await askGroq({ data: text });

      if (response === "__NO_API_KEY__" || response === "__API_ERROR__") {
        // Fallback to local heuristic responder with simulated thinking delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        const localResponse = getLocalResponse(text);
        safeSetItem(cacheKey, localResponse);
        playTick(-0.2); // Play sound on receive
        setMessages((prev) => [...prev, { sender: "bot", text: localResponse }]);
      } else {
        safeSetItem(cacheKey, response);
        playTick(-0.2); // Play sound on receive
        setMessages((prev) => [...prev, { sender: "bot", text: response }]);
      }
    } catch (e) {
      console.error(e);
      await new Promise((resolve) => setTimeout(resolve, 800));
      const localResponse = getLocalResponse(text);
      safeSetItem(cacheKey, localResponse);
      playTick(-0.2);
      setMessages((prev) => [...prev, { sender: "bot", text: localResponse }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      {/* Hover Tooltip */}
      <div
        className={`absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-surface/95 px-3 py-1.5 text-[9px] uppercase tracking-widest text-foreground shadow-lg backdrop-blur-md font-mono select-none transition-all duration-200 pointer-events-none ${
          showTooltip && !isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
        }`}
      >
        Ask my virtual agent
      </div>

      {/* Toggle button */}
      <button
        onClick={() => {
          playTick(0);
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer relative z-50 animate-bounce-slow"
        aria-label="Open Chatbot"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, y: 15, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="absolute bottom-16 right-0 w-[calc(100vw-3rem)] sm:w-96 h-[400px] sm:h-[460px] surface-card backdrop-blur-xl border border-white/10 flex flex-col rounded-2xl overflow-hidden shadow-2xl z-40 select-text origin-bottom-right"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-4 py-3 select-none">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-foreground font-semibold flex items-center gap-1">
                  <Bot className="h-3.5 w-3.5 text-primary animate-pulse" /> v-agent.sys initialized
                </span>
              </div>
              <button
                onClick={() => {
                  playTick(0);
                  setIsOpen(false);
                }}
                className="text-subtle transition-colors hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex w-full ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      m.sender === "user"
                        ? "bg-primary text-white rounded-tr-none shadow-[0_2px_8px_rgba(139,92,246,0.2)]"
                        : "bg-surface border border-white/10 text-muted-foreground rounded-tl-none"
                    }`}
                  >
                    {formatMessageText(m.text)}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex w-full justify-start">
                  <div className="bg-surface border border-white/10 text-subtle rounded-2xl rounded-tl-none px-4 py-2.5 text-[11px] flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin text-primary" />
                    <span>Agent is searching logs...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick prompt chips */}
            {messages.length === 1 && (
              <div className="px-4 py-3 border-t border-white/5 bg-black/10 select-none">
                <p className="text-[9px] uppercase tracking-widest text-subtle mb-2 font-mono">
                  Suggested Prompts
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((qp, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(qp.query)}
                      className="text-[10px] text-muted-foreground bg-surface border border-white/5 hover:border-primary/40 hover:text-foreground rounded-full px-2.5 py-1 transition-all cursor-pointer font-medium"
                    >
                      {qp.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input field */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputValue);
              }}
              className="border-t border-white/10 bg-black/30 p-3 flex gap-2 select-none"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask v-agent..."
                className="flex-1 bg-surface border border-white/10 focus:border-primary/60 outline-none rounded-xl px-3 py-1.5 text-xs text-foreground placeholder:text-subtle font-mono"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
