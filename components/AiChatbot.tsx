
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, Sparkles, RefreshCcw, ArrowLeft, Brain, Cpu, BookOpen, GraduationCap, PenTool, Database, Paperclip, X, FileText, Image as ImageIcon, Loader2, ShieldCheck, ChevronDown } from 'lucide-react';
import { marked } from 'marked';
import { supabaseService } from '../services/supabaseService';
import { Material, Blog } from '../types';
import katex from 'katex';

interface Message {
  role: 'user' | 'model';
  parts: { text?: string; inlineData?: { mimeType: string; data: string } }[];
}

interface AiChatbotProps {
  onBack: () => void;
}

// Configure marked
marked.setOptions({
  gfm: true,
  breaks: true,
});

const AiChatbot: React.FC<AiChatbotProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; type: string; data: string } | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    scrollRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Handle scroll visibility for "Scroll to Bottom" button
  useEffect(() => {
    const handleScroll = () => {
      if (!mainRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = mainRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 300;
      setShowScrollButton(!isNearBottom);
    };

    const mainEl = mainRef.current;
    if (mainEl) {
      mainEl.addEventListener('scroll', handleScroll);
    }
    return () => mainEl?.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper to render math using KaTeX
  const renderContent = (text: string) => {
    if (!text) return "";
    
    // Replace block math $$...$$
    let processedText = text.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
      try {
        return katex.renderToString(formula, { displayMode: true, throwOnError: false });
      } catch (e) {
        return match;
      }
    });

    // Replace inline math $...$
    processedText = processedText.replace(/\$([^\$]+?)\$/g, (match, formula) => {
      try {
        return katex.renderToString(formula, { displayMode: false, throwOnError: false });
      } catch (e) {
        return match;
      }
    });

    return marked.parse(processedText);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      alert("Prime Students Support: Please upload PDF or Image files for analysis.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = (event.target?.result as string).split(',')[1];
      setAttachedFile({
        name: file.name,
        type: file.type,
        data: base64Data
      });
    };
    reader.readAsDataURL(file);
  };

  const getRelevantContext = async (query: string) => {
    setIsRetrieving(true);
    try {
      const [g9p, g9n, g10p, g10n, b] = await Promise.all([
        supabaseService.getMaterials('Grade 9', 'Past Paper'),
        supabaseService.getMaterials('Grade 9', 'Note'),
        supabaseService.getMaterials('Grade 10', 'Past Paper'),
        supabaseService.getMaterials('Grade 10', 'Note'),
        supabaseService.getBlogs()
      ]);

      const allMaterials = [...g9p, ...g9n, ...g10p, ...g10n, ...b];
      const keywords = query.toLowerCase().split(' ').filter(word => word.length > 3);

      const scoredItems = allMaterials.map(item => {
        let score = 0;
        const textToSearch = `${item.title} ${'description' in item ? item.description : ''} ${'content' in item ? item.content : ''}`.toLowerCase();
        keywords.forEach(kw => {
          if (textToSearch.includes(kw)) score++;
        });
        return { item, score };
      });

      return scoredItems
        .filter(si => si.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(si => {
          const m = si.item as any;
          return `[RESOURCE: ${m.title}] Type: ${m.type || 'Insight'}, Subject: ${m.subject || 'Academic'}. Details: ${m.description || m.content?.substring(0, 150)}...`;
        })
        .join('\n\n');
    } catch (err) {
      return "";
    } finally {
      setIsRetrieving(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !attachedFile) return;

    const userParts: any[] = [];
    if (input.trim()) userParts.push({ text: input });
    if (attachedFile) {
      userParts.push({
        inlineData: { mimeType: attachedFile.type, data: attachedFile.data }
      });
    }

    const newMessage: Message = { role: 'user', parts: userParts };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');
    setAttachedFile(null);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const context = await getRelevantContext(input);

      const systemInstruction = `You are the Prime Students Neural Assistant, a professional AKU-EB academic advisor.
      
      ARCHIVE KNOWLEDGE:
      ${context}

      RULES:
      1. FORMATTING: Use LaTeX for ALL mathematical formulas. Inline math must be in $...$, block math in $$...$$. 
      2. LINKS: When providing links, use standard Markdown [Title](URL).
      3. TONE: Scholarly, encouraging, and precise.
      4. DOCUMENT ANALYSIS: If an image or PDF is attached, extract its data and prioritize it in your answer.
      5. MEMORY: You are in a continuous session; refer back to previous points if needed.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: updatedMessages.map(m => ({
          role: m.role,
          parts: m.parts
        })),
        config: { systemInstruction, temperature: 0.7 }
      });

      const responseText = response.text || "I processed the request but found no conclusive data.";
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: responseText }] }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: "The neural link encountered a timeout. Please try a shorter query or a smaller file." }] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-slate-50 text-univet-blue flex flex-col overflow-hidden animate-reveal relative">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03] z-0">
        <div className="absolute top-20 left-10"><BookOpen className="w-48 h-48 md:w-[400px] md:h-[400px]" /></div>
        <div className="absolute bottom-20 right-10"><GraduationCap className="w-48 h-48 md:w-[400px] md:h-[400px]" /></div>
      </div>

      {/* Fixed Header */}
      <header className="glass z-50 border-b border-slate-200/60 py-3 md:py-5 px-4 md:px-12 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3 md:space-x-5">
          <button onClick={onBack} className="p-2 md:p-3 hover:bg-slate-100 rounded-xl md:rounded-2xl transition-all border border-transparent hover:border-slate-200">
            <ArrowLeft className="w-5 h-5 text-univet-blue" />
          </button>
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/10 overflow-hidden p-1">
              <img src="/logo.png" className="w-full h-full object-contain" alt="Prime Students Neural Logo" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-serif font-black tracking-tight leading-none text-univet-blue">Prime Students Neural</h1>
              <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-univet-gold mt-0.5 md:mt-1">Research AI</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className={`px-2.5 md:px-4 py-1.5 md:py-2 rounded-full border flex items-center space-x-1.5 md:space-x-2 transition-all ${loading || isRetrieving ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-100'}`}>
            <div className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full ${loading || isRetrieving ? 'bg-amber-500 animate-spin' : 'bg-emerald-500 animate-pulse'}`}></div>
            <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${loading || isRetrieving ? 'text-amber-600' : 'text-emerald-600'}`}>
              {loading ? 'Processing' : isRetrieving ? 'Retrieving' : 'Online'}
            </span>
          </div>
        </div>
      </header>

      {/* Scrollable Chat Area */}
      <main ref={mainRef} className="flex-1 overflow-y-auto relative z-10 custom-scrollbar scroll-smooth">
        <div className="max-w-4xl mx-auto w-full px-4 md:px-0 py-6 md:py-10">
          {messages.length === 0 ? (
            <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4 animate-reveal">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl flex items-center justify-center mb-5 md:mb-6 border border-slate-100 shadow-xl">
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-univet-gold" />
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-black mb-3 md:mb-4 text-univet-blue leading-tight">Upload Papers & Notes. <br className="hidden md:block"/>Chat with Knowledge.</h2>
              <p className="text-slate-500 font-bold mb-6 md:mb-8 max-w-md text-xs md:text-sm">Upload your files to receive instant board-aligned analysis, summaries, and solve past papers together.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {[
                  { icon: PenTool, label: "Physics Equations", text: "Explain the equations for Work and Power with examples." },
                  { icon: FileText, label: "Pattern Analysis", text: "Common patterns in Grade 10 Math Papers (2020-2024)?" }
                ].map((action, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setInput(action.text)}
                    className="bg-white border border-slate-100 p-3 md:p-4 rounded-xl md:rounded-2xl text-left hover:shadow-xl hover:border-univet-gold transition-all group flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-univet-gold transition-colors shrink-0">
                      <action.icon className="w-4 h-4 md:w-5 h-5 text-univet-blue" />
                    </div>
                    <div>
                      <p className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-slate-400 group-hover:text-univet-blue mb-0.5">Quick Prompt</p>
                      <p className="text-xs md:text-sm font-black text-univet-blue leading-tight">{action.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 md:space-y-8">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-reveal`}>
                  <div className={`flex items-start max-w-[98%] sm:max-w-[90%] md:max-w-[85%] gap-2 md:gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg ${msg.role === 'user' ? 'bg-univet-blue' : 'bg-white border border-slate-100'}`}>
                      {msg.role === 'user' ? <User className="w-4 h-4 md:w-5 md:h-5 text-white" /> : <Bot className="w-4 h-4 md:w-5 md:h-5 text-univet-gold" />}
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      <div className={`p-3 md:p-5 rounded-xl md:rounded-2xl shadow-sm border ${msg.role === 'user' ? 'bg-univet-blue text-white rounded-tr-none border-blue-900' : 'bg-white border-slate-100 text-univet-blue rounded-tl-none border-l-4 border-l-univet-gold'}`}>
                        {msg.parts.map((part, pIdx) => (
                          <div key={pIdx}>
                            {part.text && (
                              <div 
                                className={`prose prose-sm max-w-none break-words ${msg.role === 'user' ? 'text-white' : 'text-univet-blue'}`} 
                                dangerouslySetInnerHTML={{ __html: renderContent(part.text) }}
                              />
                            )}
                            {part.inlineData && (
                              <div className="mt-3 md:mt-4 rounded-xl md:rounded-2xl overflow-hidden border border-slate-200">
                                 <img src={`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`} className="max-w-full sm:max-w-xs h-auto" alt="Input attachment" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-400 ${msg.role === 'user' ? 'text-right' : 'text-left'} px-2`}>
                        {msg.role === 'user' ? 'Sent' : 'Verified Response'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {(loading || isRetrieving) && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 md:space-x-3 animate-pulse">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                      <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-univet-gold animate-spin" />
                    </div>
                    <div className="p-3 md:p-5 bg-white border border-slate-100 rounded-xl md:rounded-2xl rounded-tl-none flex items-center space-x-2 md:space-x-3">
                      <Database className="w-3 h-3 md:w-4 md:h-4 text-univet-gold animate-bounce" />
                      <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest text-slate-400">
                        {isRetrieving ? 'Searching Archives' : 'Thinking'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} className="h-4 w-full" />
            </div>
          )}
        </div>
      </main>

      {/* Fixed Input Footer */}
      <footer className="bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-4 md:pt-6 pb-6 md:pb-8 px-4 md:px-0 shrink-0 relative z-20">
        <div className="max-w-4xl mx-auto relative">
          
          {/* Scroll Down Action Button */}
          {showScrollButton && (
            <button 
              onClick={() => scrollToBottom()}
              className="absolute -top-12 md:-top-16 left-1/2 -translate-x-1/2 bg-white text-univet-blue border-2 border-univet-gold p-2 md:p-3 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all animate-bounce z-30"
              title="Scroll to latest"
            >
              <ChevronDown className="w-5 h-5 md:w-6 h-6" />
            </button>
          )}

          <div className="space-y-3 md:space-y-4">
            {attachedFile && (
              <div className="flex items-center space-x-3 bg-white border-2 border-univet-gold p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl animate-reveal w-fit mx-auto lg:mx-0">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-univet-gold/10 flex items-center justify-center">
                  {attachedFile.type.includes('pdf') ? <FileText className="w-4 h-4 md:w-5 md:h-5 text-univet-gold" /> : <ImageIcon className="w-4 h-4 md:w-5 md:h-5 text-univet-gold" />}
                </div>
                <div className="flex-1 min-w-[100px] md:min-w-[120px]">
                  <p className="text-[8px] md:text-[10px] font-black text-univet-gold uppercase tracking-widest">Asset Ready</p>
                  <p className="text-[10px] md:text-xs font-bold text-univet-blue truncate max-w-[120px] md:max-w-[150px]">{attachedFile.name}</p>
                </div>
                <button onClick={() => setAttachedFile(null)} className="p-1.5 md:p-2 hover:bg-slate-50 rounded-full transition-colors">
                  <X className="w-3 h-3 md:w-4 md:h-4 text-rose-500" />
                </button>
              </div>
            )}

            <div className="relative group">
              <input 
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,image/*"
                onChange={handleFileChange}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl flex items-center justify-center text-slate-400 hover:text-univet-blue hover:bg-white transition-all z-10"
                title="Attach asset"
              >
                <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend(); }}
                placeholder="Query equations or archives..."
                className="w-full bg-white border-2 border-slate-100 rounded-2xl md:rounded-[2rem] pl-14 md:pl-20 pr-14 md:pr-24 py-3 md:py-5 outline-none focus:border-univet-gold focus:ring-4 focus:ring-univet-gold/5 transition-all text-univet-blue font-bold text-sm md:text-lg shadow-2xl placeholder-slate-300"
              />

              <button 
                onClick={handleSend}
                disabled={loading || (!input.trim() && !attachedFile)}
                className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-univet-blue rounded-xl md:rounded-2xl flex items-center justify-center text-univet-gold hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-30 disabled:scale-100"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            <div className="flex items-center justify-center space-x-4 md:space-x-6">
               <div className="flex items-center space-x-1.5">
                  <Database className="w-2.5 h-2.5 md:w-3 md:h-3 text-slate-400" />
                  <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-400">RAG Integrated</span>
               </div>
               <div className="w-1 h-1 rounded-full bg-slate-200"></div>
               <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-2.5 h-2.5 md:w-3 md:h-3 text-emerald-500" />
                  <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-400">Secure Link</span>
               </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AiChatbot;
