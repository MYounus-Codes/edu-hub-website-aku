
import React, { useState, useEffect } from 'react';
import { User, Grade, Blog } from './types';
import { supabaseService } from './services/supabaseService';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import GradeBrowser from './components/GradeBrowser';
import BlogDetail from './components/BlogDetail';
import AiChatbot from './components/AiChatbot';
import { 
  GraduationCap, 
  BookOpen, 
  Clock, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  Mail, 
  Lock, 
  User as UserIcon, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  Brain, 
  Zap,
  MessageSquareCode
} from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('home');
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authRole, setAuthRole] = useState<'admin' | 'user'>('user');
  const [authError, setAuthError] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);

  useEffect(() => {
    const activeUser = supabaseService.getCurrentUser();
    setUser(activeUser);
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoadingBlogs(true);
    const data = await supabaseService.getBlogs();
    setBlogs(data);
    setLoadingBlogs(false);
  };

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError(null);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    
    try {
      let loggedUser;
      const password = formData.get('password') as string;

      if (authMode === 'login') {
        loggedUser = await supabaseService.login(email, password, authRole);
      } else {
        const username = formData.get('username') as string;
        const secretKey = formData.get('secretKey') as string | undefined;
        loggedUser = await supabaseService.register(username, email, password, authRole, secretKey);
      }
      setUser(loggedUser);
      setShowAuthModal(false);
      if (loggedUser.role === 'admin') setCurrentView('admin');
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const openBlog = (blog: Blog) => {
    setSelectedBlog(blog);
    setCurrentView('blog-detail');
    window.scrollTo(0, 0);
  };

  const navigateToView = (view: string) => {
    setCurrentView(view);
    setSelectedBlog(null);
    window.scrollTo(0, 0);
  };

  const blogFallback = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200";

  const renderHome = () => (
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
            
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif font-black text-univet-blue leading-[1.1] mb-6 md:mb-8 animate-reveal">
              Empowering <br className="hidden md:block"/>
              <span className="text-blue-600">The Next</span> <br className="hidden md:block"/>
              <span className="italic font-light text-slate-400">Generation.</span>
            </h1>
            
            <p className="text-base md:text-xl text-slate-600 font-semibold mb-10 md:mb-12 max-w-xl animate-reveal leading-relaxed">
              Access a curated ecosystem of scholarly notes, validated past papers, and expert board insights designed specifically for AKU-EB excellence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 animate-reveal">
              <button 
                onClick={() => navigateToView('grade-10')}
                className="bg-univet-blue text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-extrabold text-sm md:text-base transition-all hover:bg-blue-600 hover:scale-105 shadow-xl flex items-center justify-center group"
              >
                Grade 10 Portal
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </button>
              <button 
                onClick={() => navigateToView('grade-9')}
                className="bg-white text-univet-blue border-2 border-slate-200 px-8 md:px-10 py-4 md:py-5 rounded-2xl font-extrabold text-sm md:text-base transition-all hover:border-univet-gold hover:text-blue-600 shadow-sm flex items-center justify-center group"
              >
                Grade 9 Library
                <BookOpen className="ml-3 w-5 h-5 text-univet-gold opacity-0 md:group-hover:opacity-100 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16 border-y border-slate-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {[
              { icon: BookOpen, label: 'Board Papers', val: '480+', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: Clock, label: 'Study Notes', val: '220+', color: 'text-amber-600', bg: 'bg-amber-50' },
              { icon: Users, label: 'Faculty Active', val: '12+', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: GraduationCap, label: 'A+ Success', val: '94%', color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center p-6 rounded-3xl hover:bg-slate-50 transition-colors">
                <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center mb-5 shadow-sm`}>
                  <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>
                <div className="text-3xl font-black text-univet-blue mb-1">{stat.val}</div>
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-5xl font-serif font-black text-univet-blue mb-4 md:mb-5">Faculty Insights</h2>
              <p className="text-slate-500 font-bold text-base md:text-lg leading-relaxed">Strategic analysis and curriculum updates direct from our authorized scholarly board.</p>
            </div>
            <button onClick={() => navigateToView('blog')} className="flex items-center space-x-3 text-sm font-black text-blue-600 uppercase tracking-widest hover:text-univet-blue transition-colors">
              <span>View Archives</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.slice(0, 3).map((blog, i) => (
              <div key={i} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500 flex flex-col group animate-reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="h-48 md:h-56 overflow-hidden bg-slate-100">
                  <img src={blog.image || blogFallback} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={blog.title} />
                </div>
                <div className="p-8 md:p-10 flex-1 flex flex-col">
                  <h3 className="text-xl md:text-2xl font-black text-univet-blue mb-4 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">{blog.title}</h3>
                  <p className="text-slate-500 font-semibold mb-8 line-clamp-2 text-sm">{blog.content.replace(/[#*]/g, '').substring(0, 110)}...</p>
                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-black text-univet-blue uppercase tracking-tighter">{blog.author}</span>
                    <button onClick={() => openBlog(blog)} className="text-blue-600 font-black flex items-center text-xs hover:text-univet-blue transition-colors">
                      Read More <ArrowRight className="ml-2 w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI CHATBOT SECTION */}
      <section className="bg-white py-16 md:py-28 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden bg-slate-950 rounded-[3rem] md:rounded-[5rem] p-8 md:p-24 group">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(30,58,138,0.4),transparent)]"></div>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
              <Brain className="w-[500px] h-[500px] text-white" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="animate-reveal">
                <div className="inline-flex items-center space-x-3 bg-blue-500/10 border border-blue-500/20 px-5 py-2.5 rounded-full mb-8">
                  <Sparkles className="w-5 h-5 text-univet-gold animate-bounce" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Next-Gen Academic AI</span>
                </div>
                
                <h2 className="text-4xl md:text-7xl font-serif font-black text-white mb-8 leading-[1.1]">
                  Education and AI: <br className="hidden md:block" />
                  Synthesize <br className="hidden md:block" />
                  Knowledge with <br className="hidden md:block" />
                  <span className="text-univet-gold italic">Precision.</span>
                </h2>
                
                <p className="text-slate-400 text-lg md:text-xl font-medium mb-12 max-w-lg leading-relaxed">
                  Our neural-powered assistant is trained on a decade of AKU-EB curriculum data to provide instant clarifications, concept summaries, and strategic study paths.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <button 
                    onClick={() => navigateToView('ai-assistant')}
                    className="w-full sm:w-auto bg-univet-gold text-univet-blue px-10 py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(251,191,36,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center group/btn"
                  >
                    Get Started
                    <Zap className="ml-3 w-5 h-5 group-hover/btn:fill-current" />
                  </button>
                  <div className="flex -space-x-3 items-center">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                    <span className="ml-6 text-[10px] font-black uppercase tracking-widest text-slate-500">2.4k Students Active</span>
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

  return (
    <div className="min-h-screen bg-white">
      {currentView !== 'ai-assistant' && (
        <Navbar user={user} onViewChange={navigateToView} onLoginClick={() => setShowAuthModal(true)} />
      )}

      <main className={currentView === 'ai-assistant' ? '' : 'pt-20'}>
        {currentView === 'home' && renderHome()}
        {currentView === 'grade-9' && <GradeBrowser grade="Grade 9" />}
        {currentView === 'grade-10' && <GradeBrowser grade="Grade 10" />}
        {currentView === 'ai-assistant' && <AiChatbot onBack={() => navigateToView('home')} />}
        {currentView === 'blog' && (
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
             <h2 className="text-4xl md:text-7xl font-serif font-black mb-12 md:mb-16 text-univet-blue text-center">The Scholarly Feed</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
               {blogs.map((blog) => (
                 <div key={blog.id} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-2xl transition-all animate-reveal">
                    <div className="h-56 md:h-60 w-full overflow-hidden bg-slate-100">
                      <img src={blog.image || blogFallback} className="h-full w-full object-cover" alt="" />
                    </div>
                    <div className="p-8 md:p-10 flex-1 flex flex-col">
                      <h3 className="text-xl md:text-2xl font-black mb-4 md:mb-5 text-univet-blue line-clamp-2">{blog.title}</h3>
                      <p className="text-slate-500 font-semibold mb-8 line-clamp-3 text-sm">{blog.content.replace(/[#*]/g, '').substring(0, 160)}...</p>
                      <button onClick={() => openBlog(blog)} className="mt-auto bg-univet-blue text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-univet-gold hover:text-univet-blue transition-all">
                        Read Analysis
                      </button>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}
        {currentView === 'blog-detail' && selectedBlog && (
          <BlogDetail blog={selectedBlog} onBack={() => navigateToView('blog')} />
        )}
        {currentView === 'admin' && user?.role === 'admin' && <AdminDashboard />}
      </main>

      {currentView !== 'ai-assistant' && (
        <footer className="bg-univet-blue text-white pt-20 pb-10 px-4 md:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/10 pb-16">
            <div className="space-y-6">
              <h3 className="text-3xl font-serif font-black text-univet-gold">UNIVET</h3>
              <p className="text-slate-400 font-semibold text-sm leading-relaxed max-w-sm">The definitive digital archive for Grade 9 & 10 success, built on verified data and faculty expertise.</p>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-univet-gold">Quick Access</h4>
              <ul className="space-y-3 text-sm font-bold text-slate-300">
                <li onClick={() => navigateToView('grade-9')} className="hover:text-white cursor-pointer transition-colors">Grade 9 Archive</li>
                <li onClick={() => navigateToView('grade-10')} className="hover:text-white cursor-pointer transition-colors">Grade 10 Archive</li>
                <li onClick={() => navigateToView('blog')} className="hover:text-white cursor-pointer transition-colors">Scholarly Insights</li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-univet-gold">Official Status</h4>
              <div className="flex flex-wrap gap-4">
                <span className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400"><CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> Secure</span>
                <span className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400"><CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> Verified</span>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-10 text-center">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">&copy; 2025 UNIVET AKU-EB ARCHIVE • ACADEMIC INTEGRITY SECURED</p>
          </div>
        </footer>
      )}

      {showAuthModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setShowAuthModal(false)}></div>
          <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl w-full max-w-xl relative z-10 overflow-hidden animate-reveal border border-slate-100">
            <div className="flex bg-slate-50 p-2">
              <button 
                onClick={() => setAuthRole('user')}
                className={`flex-1 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2rem] font-black text-[9px] md:text-[10px] uppercase tracking-[0.4em] flex items-center justify-center space-x-2 md:space-x-3 transition-all ${authRole === 'user' ? 'bg-white text-univet-blue shadow-lg' : 'text-slate-400'}`}
              >
                <Users className="w-4 h-4" />
                <span>Student</span>
              </button>
              <button 
                onClick={() => setAuthRole('admin')}
                className={`flex-1 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2rem] font-black text-[9px] md:text-[10px] uppercase tracking-[0.4em] flex items-center justify-center space-x-2 md:space-x-3 transition-all ${authRole === 'admin' ? 'bg-white text-univet-blue shadow-lg' : 'text-slate-400'}`}
              >
                <ShieldCheck className="w-4 h-4 text-univet-gold" />
                <span>Faculty</span>
              </button>
            </div>

            <div className="p-8 md:p-16">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-3xl md:text-5xl font-serif font-black text-univet-blue mb-4">Authorized Access</h2>
                <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Portal credentials required</p>
              </div>

              {authError && <div className="mb-8 p-4 bg-rose-50 text-rose-800 rounded-xl font-bold text-xs border border-rose-100 text-center">{authError}</div>}

              <form onSubmit={handleAuth} className="space-y-4 md:space-y-5">
                {authMode === 'register' && (
                  <>
                    <div className="relative">
                      <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input name="username" type="text" required className="w-full pl-12 pr-8 py-4 md:py-5 rounded-xl md:rounded-2xl bg-slate-50 border-2 border-transparent focus:border-univet-gold outline-none font-bold text-base md:text-lg transition-all" placeholder="Legal Name" />
                    </div>
                    {authRole === 'admin' && (
                      <div className="relative">
                        <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input name="secretKey" type="password" required className="w-full pl-12 pr-8 py-4 md:py-5 rounded-xl md:rounded-2xl bg-slate-50 border-2 border-transparent focus:border-univet-gold outline-none font-bold text-base md:text-lg transition-all" placeholder="Faculty Secret Key" />
                      </div>
                    )}
                  </>
                )}
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input name="email" type="email" required className="w-full pl-12 pr-8 py-4 md:py-5 rounded-xl md:rounded-2xl bg-slate-50 border-2 border-transparent focus:border-univet-gold outline-none font-bold text-base md:text-lg transition-all" placeholder="University Email" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input name="password" type="password" required className="w-full pl-12 pr-8 py-4 md:py-5 rounded-xl md:rounded-2xl bg-slate-50 border-2 border-transparent focus:border-univet-gold outline-none font-bold text-base md:text-lg transition-all" placeholder="Access Key" />
                </div>
                <button type="submit" className="w-full bg-univet-blue text-white py-4 md:py-6 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.4em] shadow-xl hover:bg-univet-gold hover:text-univet-blue transition-all">
                  Confirm Access
                </button>
              </form>
              
              <div className="mt-8 text-center">
                <button 
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-univet-blue transition-colors"
                >
                  {authMode === 'login' ? "New candidate? Create record" : "Existing account? Sign in"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
