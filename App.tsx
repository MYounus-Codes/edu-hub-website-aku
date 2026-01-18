
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { User, Grade, Blog } from './types';
import { supabaseService } from './services/supabaseService';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import GradeBrowser from './components/GradeBrowser';
import BlogDetail from './components/BlogDetail';
import Blogs from './components/Blogs';
import Home from './components/Home';
import AiChatbot from './components/AiChatbot';
import TodoApp from './components/TodoApp';
import McqGenerator from './components/McqGenerator';
import UserDashboard from './components/UserDashboard';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User as UserIcon, 
  CheckCircle2, 
  Users
} from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authRole, setAuthRole] = useState<'admin' | 'user'>('user');
  const [authError, setAuthError] = useState<string | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
      if (loggedUser.role === 'admin') navigate('/admin');
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const isAiChatbot = location.pathname === '/ai-assistant';
  const showFooter = !isAiChatbot;

  return (
    <div className="min-h-screen bg-white">
      {!isAiChatbot && (
        <Navbar user={user} onLoginClick={() => setShowAuthModal(true)} />
      )}

      <main className={isAiChatbot ? '' : 'pt-20'}>
        <Routes>
          <Route path="/" element={<Home blogs={blogs} />} />
          <Route path="/grade-9" element={<GradeBrowser grade="Grade 9" />} />
          <Route path="/grade-10" element={<GradeBrowser grade="Grade 10" />} />
          <Route path="/ai-assistant" element={<AiChatbot onBack={() => navigate('/')} />} />
          <Route path="/blogs" element={<Blogs blogs={blogs} />} />
          <Route path="/blogs/:id" element={<BlogDetail allBlogs={blogs} />} />
          <Route path="/todos" element={<TodoApp user={user} />} />
          <Route path="/dashboard" element={<UserDashboard user={user} />} />
          <Route path="/mcq-generator" element={<McqGenerator user={user} />} />
          <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <div className="p-20 text-center font-bold text-red-500">Access Restricted</div>} />
        </Routes>
      </main>

      {showFooter && (
        <footer className="bg-univet-blue text-white pt-20 pb-10 px-4 md:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/10 pb-16">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <img src="/logo.png" className="w-12 h-12 object-contain bg-white rounded-xl p-1" alt="Logo" />
                <h3 className="text-3xl font-serif font-black text-univet-gold">Prime Students</h3>
              </div>
              <p className="text-slate-400 font-semibold text-sm leading-relaxed max-w-sm">The definitive digital archive for Grade 9 & 10 success, built on verified data and faculty expertise.</p>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-univet-gold">Quick Access</h4>
              <ul className="space-y-3 text-sm font-bold text-slate-300">
                <li onClick={() => navigate('/')} className="hover:text-white cursor-pointer transition-colors">Home</li>
                <li onClick={() => navigate('/grade-9')} className="hover:text-white cursor-pointer transition-colors">Grade 9 Archive</li>
                <li onClick={() => navigate('/grade-10')} className="hover:text-white cursor-pointer transition-colors">Grade 10 Archive</li>
                <li onClick={() => navigate('/blogs')} className="hover:text-white cursor-pointer transition-colors">Scholarly Insights</li>
                <li onClick={() => navigate('/mcq-generator')} className="hover:text-white cursor-pointer transition-colors">MCQ Generator</li>
                <li onClick={() => navigate('/todos')} className="hover:text-white cursor-pointer transition-colors">Todo App</li>
                <li onClick={() => navigate('/dashboard')} className="hover:text-white cursor-pointer transition-colors">User Dashboard</li>
                <li onClick={() => navigate('/ai-assistant')} className="hover:text-white cursor-pointer transition-colors">AI Chatbot</li>
                {authRole === 'admin' && <li onClick={() => navigate('/admin')} className="hover:text-white cursor-pointer transition-colors">Admin Dashboard</li>}
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
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">&copy; 2025 Prime Students AKU-EB ARCHIVE • ACADEMIC INTEGRITY SECURED</p>
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
