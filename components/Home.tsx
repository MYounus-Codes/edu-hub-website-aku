
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
  MessageSquareCode,
  ListTodo,
  CheckCircle2,
  Calendar,
  Loader2
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
              Students Trusted Platform
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-univet-blue leading-[1.1] mb-6 animate-reveal">
              Empowering <br className="hidden md:block"/>
              <span className="text-blue-600">The Next</span> <br className="hidden md:block"/>
              <span className="italic font-light text-slate-400">Generation.</span>
            </h1>
            
            <p className="text-sm md:text-base text-slate-600 font-semibold mb-8 max-w-lg animate-reveal leading-relaxed">
              Access a curated ecosystem of scholarly notes, validated past papers, and daily blogs designed for AKU-EB excellence.
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
              {/* <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-black text-univet-blue mb-3 md:mb-4">Faculty Insights</h2> */}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-black text-univet-blue mb-3 md:mb-4">Blogs</h2>
              <p className="text-slate-500 font-bold text-sm md:text-base leading-relaxed">Read daily blogs from us and contributors. Stay updated with fresh perspectives and stories.</p>
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
                      <p className="text-white font-black">Prime Students Neural v1.0</p>
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
      {/* TODO FEATURE SECTION */}
      <section className="bg-slate-50 py-16 md:py-24 px-4 md:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Content (Text) */}
            <div className="order-2 lg:order-1 animate-reveal">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-univet-blue mb-6 leading-tight">
                Master Your <br/>
                <span className="text-emerald-600">Daily Objectives.</span>
              </h2>
              <p className="text-slate-600 text-lg font-medium mb-8 leading-relaxed max-w-lg">
                Stay organized with our integrated task management system. Prioritize assignments, track revision goals, and maintain your academic momentum with precision.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  "Smart deadline reminders for assignments",
                  "Categorize tasks by subject priority",
                  "Progress analytics for weekly goals"
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-slate-700 font-semibold">{item}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => navigate('/todos')}
                className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-1 transition-all flex items-center group shadow-emerald-200 shadow-xl"
              >
                Launch Planner
                <ListTodo className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Right Content (Animated Demo) */}
            <div className="order-1 lg:order-2 relative animate-reveal" style={{ animationDelay: '0.2s' }}>
              <div className="relative bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8 md:p-10 max-w-md mx-auto transform rotate-2 hover:rotate-0 transition-transform duration-500">
                
                {/* Header of Todo App */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800">My Tasks</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Today, Jan 18</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>

                {/* Animated List Items */}
                <div className="space-y-4">
                  {[
                    { text: "Complete Physics Past Paper 2023", tag: "Urgent", color: "text-rose-600 bg-rose-50" },
                    { text: "Revise Biology Chapter 4 Notes", tag: "Study", color: "text-blue-600 bg-blue-50" },
                    { text: "Submit Math Assignment", tag: "School", color: "text-amber-600 bg-amber-50" },
                  ].map((task, i) => (
                    <div key={i} className="flex items-center p-4 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                      <div className={`w-6 h-6 rounded-full border-2 border-slate-200 mr-4 flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-colors duration-300 relative overflow-hidden`}>
                         <div className="absolute inset-0 bg-emerald-500 transform scale-0 group-hover:scale-100 transition-transform duration-300 origin-center rounded-full"></div>
                         <CheckCircle2 className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 relative z-10 transition-opacity duration-300 delay-75" />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-700 font-bold text-sm group-hover:text-slate-400 group-hover:line-through transition-all duration-300">{task.text}</p>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${task.color} opacity-100 group-hover:opacity-50 transition-opacity`}>
                        {task.tag}
                      </span>
                    </div>
                  ))}
                  
                  {/* Floating Action Button simulation */}
                  <div className="mt-6 flex justify-center">
                    <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                      <span className="text-white text-2xl font-light mb-1">+</span>
                    </div>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -z-10 top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -z-10 bottom-0 left-0 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* MCQ FEATURE SECTION */}
      <section className="bg-white py-16 md:py-24 px-4 md:px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Right Content (Text) - Swapped Order */}
            <div className="order-2 lg:order-2 animate-reveal">
               <div className="inline-flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-full mb-4">
                  <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-700">New Feature</span>
               </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-univet-blue mb-6 leading-tight">
                Instant Quiz <br/>
                <span className="text-blue-600">Generation.</span>
              </h2>
              <p className="text-slate-600 text-lg font-medium mb-8 leading-relaxed max-w-lg">
                Create unlimited practice exams on any topic in seconds. Our AI generates standard board-aligned MCQs, tracks your scores, and provides detailed explanations for every answer.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  "Generate quizzes for any subject or topic",
                  "Instant grading with detailed explanations",
                  "PDF export for offline practice"
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-slate-700 font-semibold">{item}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => navigate('/mcq-generator')}
                className="bg-univet-blue text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-blue-800 hover:shadow-lg hover:-translate-y-1 transition-all flex items-center group shadow-blue-200 shadow-xl"
              >
                Start Generating
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Left Content (Video/Animation) - Swapped Order */}
            <div className="order-1 lg:order-1 relative animate-reveal" style={{ animationDelay: '0.2s' }}>
              <div className="relative bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-800/50 p-2 transform -rotate-1 hover:rotate-0 transition-transform duration-500 overflow-hidden group">
                
                {/* Video Container */}
                <div className="relative aspect-video bg-slate-950 rounded-[1.5rem] overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                      {/* You can replace this placeholder with a real video tag: <video src="..." autoPlay loop muted playsInline className="w-full h-full object-cover" /> */}
                      <video 
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        poster="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&q=80&w=1200"
                      >
                         <source src="https://cdn.dribbble.com/userupload/12479634/file/original-5dc638069818815157924c87cb71a398.mp4" type="video/mp4" />
                         {/* Fallback animation if video fails or is placeholder */}
                         <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center space-y-4 animate-pulse">
                              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                              <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Generating Quiz...</span>
                         </div>
                      </video>

                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none"></div>

                      {/* Video Controls / Badges */}
                      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                              <span className="text-white text-[10px] font-black uppercase tracking-widest">Live Demo</span>
                          </div>
                      </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -z-10 top-0 left-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
                <div className="absolute -z-10 bottom-0 right-0 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;

