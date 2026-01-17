
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Blog } from '../types';
import { 
  GraduationCap, 
  BookOpen, 
  Clock, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  Brain, 
  Zap,
  MessageSquareCode
} from 'lucide-react';

interface HomeProps {
  blogs: Blog[];
}

const Home: React.FC<HomeProps> = ({ blogs }) => {
  const navigate = useNavigate();
  const blogFallback = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200";

  return (
    <div className="space-y-0">
      <section className="relative min-h-[85vh] md:h-[90vh] flex items-center overflow-hidden bg-slate-50 pt-16 md:pt-0">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover"
            alt="University"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 lg:via-white/90 to-transparent"></div>
          {/* Mobile Overlay */}
          <div className="absolute inset-0 lg:hidden bg-white/60 backdrop-blur-[1px]"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 py-16 md:py-0">
          <div className="max-w-4xl">
            <div className="inline-flex items-center bg-blue-600 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] mb-6 md:mb-10 animate-reveal shadow-lg">
              <ShieldCheck className="w-4 h-4 mr-2 text-univet-gold" />
              Official AKU-EB Archive v2.5
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-univet-blue leading-[1.1] mb-6 animate-reveal">
              Empowering <br className="hidden md:block"/>
              <span className="text-blue-600">The Next</span> <br className="hidden md:block"/>
              <span className="italic font-light text-slate-400">Generation.</span>
            </h1>
            
            <p className="text-sm md:text-base text-slate-600 font-semibold mb-8 max-w-lg animate-reveal leading-relaxed">
              Access a curated ecosystem of scholarly notes, validated past papers, and expert board insights designed specifically for AKU-EB excellence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 animate-reveal">
              <button 
                onClick={() => navigate('/grade-10')}
                className="bg-univet-blue text-white px-6 py-3 rounded-xl font-extrabold text-sm transition-all hover:bg-blue-600 hover:scale-105 shadow-xl flex items-center justify-center group"
              >
                Grade 10 Portal
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/grade-9')}
                className="bg-white text-univet-blue border-2 border-slate-200 px-6 py-3 rounded-xl font-extrabold text-sm transition-all hover:border-univet-gold hover:text-blue-600 shadow-sm flex items-center justify-center group"
              >
                Grade 9 Library
                <BookOpen className="ml-2 w-4 h-4 text-univet-gold opacity-0 md:group-hover:opacity-100 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 md:py-12 border-y border-slate-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { icon: BookOpen, label: 'Board Papers', val: '480+', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: Clock, label: 'Study Notes', val: '220+', color: 'text-amber-600', bg: 'bg-amber-50' },
              { icon: Users, label: 'Faculty Active', val: '12+', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: GraduationCap, label: 'A+ Success', val: '94%', color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center p-5 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4 shadow-sm`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-black text-univet-blue mb-1">{stat.val}</div>
                <div className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
            <div className="max-w-xl">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-black text-univet-blue mb-3 md:mb-4">Faculty Insights</h2>
              <p className="text-slate-500 font-bold text-sm md:text-base leading-relaxed">Strategic analysis and curriculum updates direct from our authorized scholarly board.</p>
            </div>
            <button onClick={() => navigate('/blogs')} className="flex items-center space-x-2 text-xs font-black text-blue-600 uppercase tracking-widest hover:text-univet-blue transition-colors">
              <span>View Archives</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.slice(0, 3).map((blog, i) => (
              <div key={i} className="bg-white rounded-[1.5rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500 flex flex-col group animate-reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="h-36 md:h-44 overflow-hidden bg-slate-100">
                  <img src={blog.image || blogFallback} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={blog.title} />
                </div>
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  <h3 className="text-lg md:text-xl font-black text-univet-blue mb-3 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">{blog.title}</h3>
                  <p className="text-slate-500 font-semibold mb-6 line-clamp-2 text-xs md:text-sm">{blog.content.replace(/[#*]/g, '').substring(0, 110)}...</p>
                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[9px] font-black text-univet-blue uppercase tracking-tighter">{blog.author}</span>
                    <button onClick={() => navigate(`/blogs/${blog.id}`)} className="text-blue-600 font-black flex items-center text-[10px] hover:text-univet-blue transition-colors">
                      Read More <ArrowRight className="ml-1.5 w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI CHATBOT SECTION */}
      <section className="bg-white py-10 md:py-16 px-4 md:px-6"> 
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden bg-slate-950 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 lg:p-14 group">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(30,58,138,0.4),transparent)]"></div>
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
              <Brain className="w-[200px] h-[200px] md:w-[300px] md:h-[300px] text-white" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="animate-reveal">
                <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full mb-4 md:mb-6">
                  <Sparkles className="w-4 h-4 text-univet-gold animate-bounce" />
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400">Next-Gen Academic AI</span>
                </div>
                
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-black text-white mb-4 md:mb-6 leading-[1.1]">
                  Education and AI: <br className="hidden md:block" />
                  Synthesize <br className="hidden md:block" />
                  Knowledge with <br className="hidden md:block" />
                  <span className="text-univet-gold italic">Precision.</span>
                </h2>
                
                <p className="text-slate-400 text-sm md:text-base font-medium mb-6 md:mb-8 max-w-lg leading-relaxed">
                  Our neural-powered assistant is trained on a decade of AKU-EB curriculum data to provide instant clarifications, concept summaries, and strategic study paths.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <button 
                    onClick={() => navigate('/ai-assistant')}
                    className="w-full sm:w-auto bg-univet-gold text-univet-blue px-6 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(251,191,36,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center group/btn"
                  >
                    Get Started
                    <Zap className="ml-2 w-4 h-4 group-hover/btn:fill-current" />
                  </button>
                  <div className="flex -space-x-3 items-center">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[9px] font-black text-slate-400">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                    <span className="ml-4 text-[9px] font-black uppercase tracking-widest text-slate-500">2.4k Students Active</span>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block relative animate-reveal" style={{ animationDelay: '0.2s' }}>
                <div className="relative z-20 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl ring-1 ring-white/20">
                  <div className="flex items-center space-x-4 mb-10 pb-6 border-b border-white/5">
                    <div className="w-12 h-12 bg-univet-gold rounded-2xl flex items-center justify-center">
                      <MessageSquareCode className="w-6 h-6 text-univet-blue" />
                    </div>
                    <div>
                      <p className="text-white font-black">UNIVET Neural v1.0</p>
                      <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">System Online</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/5 max-w-[85%]">
                      <p className="text-slate-300 text-sm font-semibold italic">"How can I solve the quadratic equation x² + 5x + 6 = 0 using the factorization method?"</p>
                    </div>
                    <div className="bg-blue-600/20 rounded-2xl p-5 border border-blue-600/30 max-w-[90%] ml-auto">
                      <p className="text-blue-100 text-sm font-bold">Find two numbers that multiply to 6 and add to 5. These are 2 and 3. The factors are (x + 2)(x + 3)...</p>
                    </div>
                  </div>

                  <div className="mt-10 pt-6 flex items-center justify-between">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <Cpu className="w-5 h-5 text-white/20" />
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-univet-gold/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
