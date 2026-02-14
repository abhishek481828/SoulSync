
import React, { useState, useRef, useEffect } from 'react';
import { Mood, ChatMessage } from '../types';
import { chatWithAI } from '../services/geminiService';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';

interface SupportChatProps {
  currentMood: Mood;
}

const SupportChat: React.FC<SupportChatProps> = ({ currentMood }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', text: input.trim(), timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const aiResponse = await chatWithAI(userMsg.text, history, currentMood);
    
    setMessages(prev => [...prev, {
      role: 'model',
      text: aiResponse || "I'm here for you.",
      timestamp: Date.now()
    }]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="bg-indigo-600 p-4 flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-xl">
          <Sparkles className="text-white w-5 h-5" />
        </div>
        <div>
          <h3 className="text-white font-display font-bold">SoulAI Companion</h3>
          <p className="text-indigo-100 text-[10px] uppercase tracking-widest font-bold">Empathetic Support</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        {messages.length === 0 && (
          <div className="text-center py-10 px-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="text-indigo-600 w-8 h-8" />
            </div>
            <h4 className="text-slate-800 font-bold mb-2">Hey there! I'm SoulAI.</h4>
            <p className="text-slate-500 text-sm">
              I noticed you're feeling <span className="text-indigo-600 font-bold">{currentMood.toLowerCase()}</span> today. 
              Want to talk about it? I'm here to listen.
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-900 text-white'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-100 rounded-tl-none flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span className="text-xs text-slate-400 font-medium">SoulAI is listening...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupportChat;
