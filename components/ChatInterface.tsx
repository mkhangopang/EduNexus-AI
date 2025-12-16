
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, Loader2, Sparkles, Paperclip, FileText, WifiOff, Clock } from 'lucide-react';
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
        // If document changes while chat is open
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

    // Offline Handling
    if (!navigator.onLine) {
        try {
            await offlineService.queueAction('AI_GENERATION', {
                prompt: input,
                context: activeDocument?.content
            });

            // Simulate a "Queued" response from the AI
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
        <div className="min-w-0">
          <h2 className="text-base md:text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Bot className="w-4 h-4 md:w-5 md:h-5 text-primary-600 shrink-0" />
            <span className="truncate">Pedagogical Assistant</span>
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 truncate max-w-[200px] md:max-w-none">
            <span>Powered by Gemini 2.5 Flash</span>
            {activeDocument && (
                <>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1 text-indigo-600 font-medium">
                        <FileText size={10} />
                        {activeDocument.name}
                    </span>
                </>
            )}
          </div>
        </div>
        <div className="flex gap-2 shrink-0 ml-2">
            <button 
                onClick={() => setMessages([])} 
                className="text-xs px-2 py-1 md:px-3 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-600 transition-colors"
            >
                Clear
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 md:space-y-6 bg-slate-50 scroll-smooth" ref={scrollRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 md:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-primary-600' : 'bg-emerald-500'
            }`}>
              {msg.role === 'user' ? <UserIcon className="w-4 h-4 md:w-5 md:h-5 text-white" /> : <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />}
            </div>
            
            <div className={`max-w-[85%] md:max-w-[80%] rounded-2xl p-3 md:p-4 shadow-sm ${
              msg.role === 'user' 
                ? 'bg-primary-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
            }`}>
              <div className="prose prose-sm max-w-none dark:prose-invert leading-relaxed text-sm md:text-base">
                 {msg.content.split('\n').map((line, i) => (
                     <p key={i} className="mb-1 last:mb-0">{line}</p>
                 ))}
              </div>
              {msg.isQueued && (
                  <div className="mt-2 pt-2 border-t border-slate-200/50 flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                      <WifiOff size={10} />
                      <Clock size={10} />
                      <span>Request queued for sync</span>
                  </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3 md:gap-4">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
               <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-white animate-spin" />
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
              <p className="text-sm text-slate-500 animate-pulse">
                {navigator.onLine ? "Analyzing curriculum context..." : "Queueing request..."}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="p-2 md:p-4 bg-white border-t border-slate-100 shrink-0 z-10">
        <div className="relative flex items-end gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-primary-100 focus-within:border-primary-400 transition-all">
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors shrink-0">
            <Paperclip className="w-5 h-5" />
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={activeDocument ? `Ask about ${activeDocument.name}...` : "Ask a pedagogical question..."}
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-24 md:max-h-32 py-2 text-sm"
            rows={1}
            style={{ minHeight: '40px' }}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-2 rounded-lg transition-all shrink-0 ${
                input.trim() && !isLoading 
                ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-md' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
