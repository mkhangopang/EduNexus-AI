
import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Send, Bot, User as UserIcon, Loader2, Sparkles, Paperclip, FileText, WifiOff, Clock, BookOpen, X } from 'lucide-react';
import { generateAIResponse } from '../services/geminiService';
import { ChatMessage, Document } from '../types';
import { offlineService } from '../services/offlineService';

interface ChatInterfaceProps {
    activeDocument: Document | null;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ activeDocument }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  // Initialize chat based on context
  useEffect(() => {
    if (!hasInitialized.current) {
        const initialMsg = activeDocument 
            ? `Hello! I've analyzed **${activeDocument.name}**. I see this is a **${activeDocument.subject || 'General'}** curriculum for **${activeDocument.gradeLevel || 'mixed levels'}**. I can help you generate lesson plans, assessments, or differentiate this content.`
            : "Hello! I'm EduNexus AI. Upload a curriculum document to get personalized, evidence-based teaching resources, or just ask me general pedagogical questions.";
        
        setMessages([{
            id: 'init',
            role: 'model',
            content: initialMsg,
            timestamp: Date.now()
        }]);
        hasInitialized.current = true;
    } else if (activeDocument) {
         setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'model',
            content: `Switched context to **${activeDocument.name}**. How can I help with this document?`,
            timestamp: Date.now()
        }]);
    }
  }, [activeDocument?.id]);

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

    if (!navigator.onLine) {
        try {
            await offlineService.queueAction('AI_GENERATION', {
                prompt: input,
                context: activeDocument?.content
            });

            setTimeout(() => {
                const queuedMsg: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    role: 'model',
                    content: "You are currently offline. I've queued this request and will process it automatically once your connection is restored.",
                    timestamp: Date.now(),
                    isQueued: true
                };
                setMessages(prev => [...prev, queuedMsg]);
                setIsLoading(false);
            }, 600);
            return;
        } catch (e) {
            console.error("Failed to queue offline action", e);
        }
    }

    try {
      const responseText = await generateAIResponse(
          input, 
          activeDocument?.content
      );

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
        console.error(error);
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'model',
            content: "I'm having trouble connecting to the neural core. Please check your connection.",
            timestamp: Date.now()
        }]);
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
    <div className="flex flex-col h-full bg-white md:rounded-xl shadow-sm md:border border-slate-200 overflow-hidden relative">
      <div className="p-3 md:p-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0 z-10">
          <div className="flex items-center gap-3">
             <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                 <Bot size={20} />
             </div>
             <div>
                 <h3 className="font-bold text-slate-800">EduNexus Assistant</h3>
                 <p className="text-xs text-slate-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Online • Gemini 2.5 Flash
                 </p>
             </div>
          </div>
          <div className="flex gap-2">
             <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50">
                 <Clock size={20} />
             </button>
             <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50">
                 <Sparkles size={20} />
             </button>
          </div>
      </div>

      {activeDocument && (
        <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-2 flex items-center justify-between animate-slideIn">
            <div className="flex items-center gap-2 text-indigo-700 overflow-hidden">
                <BookOpen size={16} className="shrink-0" />
                <span className="text-xs font-semibold whitespace-nowrap">Context Active:</span>
                <span className="text-xs truncate font-medium" title={activeDocument.name}>{activeDocument.name}</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-indigo-500 bg-white px-1.5 py-0.5 rounded border border-indigo-100">
                {activeDocument.type}
            </span>
        </div>
      )}
      
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
              }`}
            >
              <div className="flex items-center gap-2 mb-1 opacity-70">
                  {msg.role === 'user' ? <UserIcon size={12} /> : <Bot size={12} />}
                  <span className="text-[10px] font-medium uppercase tracking-wider">{msg.role === 'user' ? 'You' : 'EduNexus AI'}</span>
              </div>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                 <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</p>
              </div>
              {msg.isQueued && (
                  <div className="mt-2 pt-2 border-t border-indigo-500/30 flex items-center gap-1.5 text-xs text-indigo-200">
                      <WifiOff size={12} />
                      <span>Queued for sync</span>
                  </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center gap-3">
                 <Loader2 className="animate-spin text-indigo-600" size={18} />
                 <span className="text-sm text-slate-500 font-medium animate-pulse">Analyzing curriculum nodes...</span>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
        <div className="flex gap-2 items-end bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:border-indigo-300 focus-within:ring-1 focus-within:ring-indigo-200 transition-all">
          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors">
              <Paperclip size={20} />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={activeDocument ? `Ask about ${activeDocument.name}...` : "Ask a pedagogical question..."}
            className="flex-1 bg-transparent border-none outline-none resize-none py-2 text-sm max-h-32 text-slate-800 placeholder:text-slate-400"
            rows={1}
            style={{ minHeight: '40px' }}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-2 rounded-lg transition-all ${
                input.trim() && !isLoading
                ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send size={20} />
          </button>
        </div>
        <div className="text-center mt-2">
            <p className="text-[10px] text-slate-400">
                AI can make mistakes. Please review all pedagogical outputs before classroom implementation.
            </p>
        </div>
      </div>
    </div>
  );
};
