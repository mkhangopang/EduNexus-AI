import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, Loader2, Sparkles, Paperclip } from 'lucide-react';
import { generateAIResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      content: "Hello! I'm EduNexus AI. I've analyzed your uploaded curriculum. Would you like me to generate a lesson plan or draft an assessment based on it?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate context from an "active document"
      const contextPrompt = `Context: User is asking about 9th Grade History curriculum. \n\nUser Query: ${input}`;
      const responseText = await generateAIResponse(contextPrompt);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
        console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary-600" />
            Pedagogical Assistant
          </h2>
          <p className="text-xs text-slate-500">Powered by Gemini 2.5 Flash • Context: World History Unit 3.pdf</p>
        </div>
        <div className="flex gap-2">
            <button className="text-xs px-3 py-1 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-600 transition-colors">Clear Chat</button>
            <button className="text-xs px-3 py-1 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-600 transition-colors">Export</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50" ref={scrollRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-primary-600' : 'bg-emerald-500'
            }`}>
              {msg.role === 'user' ? <UserIcon className="w-5 h-5 text-white" /> : <Sparkles className="w-5 h-5 text-white" />}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-primary-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
            }`}>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                 {/* Basic line break handling for demo. In prod use ReactMarkdown */}
                 {msg.content.split('\n').map((line, i) => (
                     <p key={i} className="mb-1 last:mb-0">{line}</p>
                 ))}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
               <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
              <p className="text-sm text-slate-500 animate-pulse">Thinking...</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-end gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-primary-100 focus-within:border-primary-400 transition-all">
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your lesson plan..."
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 py-2 text-sm"
            rows={1}
            style={{ minHeight: '40px' }}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-2 rounded-lg transition-all ${
                input.trim() && !isLoading 
                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-2 text-center">
            <p className="text-[10px] text-slate-400">AI can make mistakes. Please check important info.</p>
        </div>
      </div>
    </div>
  );
};
