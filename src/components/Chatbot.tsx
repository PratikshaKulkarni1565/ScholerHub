"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm ScholarBot 🎓\n\nAsk me anything about scholarships — eligibility, deadlines, or which ones suit you best!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...messages, userMsg] }),
    });
    const data = await res.json();
    setMessages((prev) => [...prev, { role: "assistant", content: data.reply || "Sorry, I couldn't process that." }]);
    setLoading(false);
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
          open
            ? "bg-gray-700 hover:bg-gray-800 rotate-0"
            : "bg-gradient-to-br from-violet-600 to-indigo-600 hover:opacity-90 shadow-violet-300"
        }`}
        aria-label="Open ScholarBot"
      >
        {open ? <X size={22} className="text-white" /> : <MessageCircle size={22} className="text-white" />}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-violet-100 flex flex-col overflow-hidden"
          style={{ height: "500px" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-white text-sm">ScholarBot</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-xs text-violet-200">AI Scholarship Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-white/15 px-2 py-1 rounded-full">
              <Sparkles size={11} className="text-yellow-300" />
              <span className="text-xs text-white/80 font-medium">AI</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-gray-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                  m.role === "user"
                    ? "bg-gradient-to-br from-violet-500 to-indigo-500 text-white"
                    : "bg-white border border-violet-100 text-violet-600 shadow-sm"
                }`}>
                  {m.role === "user" ? <User size={13} /> : <Bot size={13} />}
                </div>
                <div className={`max-w-[78%] text-sm px-3.5 py-2.5 rounded-2xl leading-relaxed whitespace-pre-wrap shadow-sm ${
                  m.role === "user"
                    ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-tr-sm"
                    : "bg-white text-gray-800 rounded-tl-sm border border-gray-100"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-white border border-violet-100 flex items-center justify-center shadow-sm">
                  <Bot size={13} className="text-violet-600" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center border border-gray-100 shadow-sm">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 px-3 py-3 flex gap-2 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about scholarships..."
              className="flex-1 text-sm border border-violet-100 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent bg-violet-50/30 placeholder:text-gray-400"
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="bg-gradient-to-br from-violet-600 to-indigo-600 hover:opacity-90 text-white p-2.5 rounded-xl disabled:opacity-40 transition-all shadow-sm shadow-violet-200"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
