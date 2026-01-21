import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Todo, McqResult } from '../types';
import { supabaseService } from '../services/supabaseService';
import { 
  LayoutDashboard, 
  Brain, 
  CheckCircle2, 
  Target, 
  TrendingUp, 
  Clock,
  Calendar,
  ArrowRight,
  ListTodo,
  Sparkles,
  BarChart3,
  Activity,
  Layers,
  PieChart,
  Radar,
  Hexagon
} from 'lucide-react';

// Helper for smooth curve interpolation (Catmull-Rom spline)
const getCatmullRomPath = (data: { x: number; y: number }[], close: boolean = false) => {
  if (data.length < 2) return "";
  
  const alpha = 0.5;
  let path = `M ${data[0].x} ${data[0].y}`;
  
  for (let i = 0; i < data.length - 1; i++) {
    const p0 = i === 0 ? data[0] : data[i - 1];
    const p1 = data[i];
    const p2 = data[i + 1];
    const p3 = i === data.length - 2 ? data[i + 1] : data[i + 2];

    const d1 = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2));
    const d2 = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    const d3 = Math.sqrt(Math.pow(p3.x - p2.x, 2) + Math.pow(p3.y - p2.y, 2));

    const cp1x = p1.x + (p2.x - p0.x) / 6; // Simple cubic control point estimate for demo
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    // Using simple cubic bezier approximation here for robustness/conciseness without heavy math module
    // For a student dashboard, a slightly simpler smooth connector is often enough:
    const midX = (p1.x + p2.x) / 2;
    // path += ` Q ${midX} ${p1.y} ${midX} ${(p1.y + p2.y) / 2} T ${p2.x} ${p2.y}`; 
    // Let's use standard cubic bezier
    path += ` C ${p1.x + (p2.x - p1.x) / 2} ${p1.y}, ${p1.x + (p2.x - p1.x) / 2} ${p2.y}, ${p2.x} ${p2.y}`;
  }
  
  if (close) {
      path += ` L ${data[data.length - 1].x} 100 L ${data[0].x} 100 Z`;
  }
  
  return path;
}


interface UserDashboardProps {
  user: User | null;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [mcqResults, setMcqResults] = useState<McqResult[]>([]);
  const [graphType, setGraphType] = useState<'bar' | 'line' | 'area' | 'radar'>('area');

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
        setLoading(false);
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [fetchedTodos, fetchedResults] = await Promise.all([
        supabaseService.getTodos(user.id),
        supabaseService.getMcqResults(user.id)
      ]);
      setTodos(fetchedTodos);
      setMcqResults(fetchedResults);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <h2 className="text-2xl font-serif font-black text-slate-800 mb-2">Access Restricted</h2>
                <p className="font-medium text-slate-500">Please sign in to view your dashboard.</p>
            </div>
        </div>
     );
  }

  // Calculate Stats
  const completedTodos = todos.filter(t => t.is_completed).length;
  const pendingTodos = todos.length - completedTodos;
  const todoProgress = todos.length > 0 ? Math.round((completedTodos / todos.length) * 100) : 0;
  
  const totalQuizzes = mcqResults.length;
  const avgScore = totalQuizzes > 0 
    ? Math.round(mcqResults.reduce((acc, curr) => acc + curr.percentage, 0) / totalQuizzes) 
    : 0;

  // Simple Bar Chart Data (Last 5 Quizzes)
  const recentQuizzes = mcqResults.slice(0, 7).reverse();

  // Calculate Subject Mastery
  const subjectStats = React.useMemo(() => {
    const stats: Record<string, { total: number; score: number; count: number }> = {};
    mcqResults.forEach(r => {
        // Normalize subject if needed, assuming 'General' or specific subjects
        const subject = r.subject || 'General';
        if (!stats[subject]) stats[subject] = { total: 0, score: 0, count: 0 };
        stats[subject].count += 1;
        stats[subject].score += r.percentage;
    });
    
    // Sort by count or just map top subjects
    return Object.keys(stats).map(subject => ({
        subject,
        avg: Math.round(stats[subject].score / stats[subject].count)
    })).slice(0, 6); // Take top 6 for radar chart hexagon
  }, [mcqResults]);


  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Top Banner Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center space-x-2 mb-3">
                        <span className="px-3 py-1 bg-blue-50 text-univet-blue rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 flex items-center">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Student Portal
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-black text-slate-900 mb-3">
                        Dashboard
                    </h1>
                    <p className="text-slate-500 font-medium text-lg max-w-2xl">
                        Welcome back, <span className="text-slate-900 font-bold">{user.username}</span>. 
                        You have <span className="text-univet-blue font-bold">{pendingTodos} tasks</span> pending 
                        and have completed <span className="text-emerald-600 font-bold">{totalQuizzes} quizzes</span>.
                    </p>
                </div>
                <div className="hidden md:block">
                    <p className="text-right text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Current Session</p>
                    <p className="text-right text-xl font-bold text-slate-700">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Avg Score */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all">
                <div>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Avg. Score</p>
                    <h3 className="text-4xl font-black text-slate-800">{avgScore}<span className="text-xl text-slate-400 ml-1">%</span></h3>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Target className="w-7 h-7 text-emerald-500" />
                </div>
            </div>

            {/* Quizzes Taken */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all">
                <div>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Quizzes Taken</p>
                    <h3 className="text-4xl font-black text-slate-800">{totalQuizzes}</h3>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Brain className="w-7 h-7 text-univet-blue" />
                </div>
            </div>

            {/* Pending Tasks */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all">
                <div>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Tasks Pending</p>
                    <h3 className="text-4xl font-black text-slate-800">{pendingTodos}</h3>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ListTodo className="w-7 h-7 text-amber-500" />
                </div>
            </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (Main Stats) */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Performance Chart */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2 text-univet-blue" />
                                Analytics Hub
                            </h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                                {graphType === 'radar' ? 'Subject Mastery Analysis' : 'Quiz Performance History'}
                            </p>
                        </div>
                        <div className="flex bg-slate-50 p-1.5 rounded-xl self-start sm:self-auto items-center">
                            <button 
                                onClick={() => setGraphType('area')}
                                className={`p-2 rounded-lg transition-all ${graphType === 'area' ? 'bg-white text-univet-blue shadow-sm ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                                title="Area Trend"
                            >
                                <Layers className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => setGraphType('bar')}
                                className={`p-2 rounded-lg transition-all ${graphType === 'bar' ? 'bg-white text-univet-blue shadow-sm ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                                title="Column Chart"
                            >
                                <BarChart3 className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => setGraphType('radar')}
                                className={`p-2 rounded-lg transition-all ${graphType === 'radar' ? 'bg-white text-univet-blue shadow-sm ring-1 ring-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                                title="Skills Radar"
                            >
                                <Hexagon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="h-72 w-full transition-all duration-500">
                        {/* Empty State */}
                        {mcqResults.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                                <Brain className="w-10 h-10 mb-3 opacity-20" />
                                <p className="font-bold">No data available</p>
                                <p className="text-xs font-medium mt-1">Take a quiz to see your analytics</p>
                            </div>
                        ) : graphType === 'radar' ? (
                             // RADAR CHART
                            <div className="h-full w-full relative flex items-center justify-center">
                                {subjectStats.length < 3 ? (
                                    <div className="text-center text-slate-400">
                                        <PieChart className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                        <p className="font-bold text-sm">Need more Data</p>
                                        <p className="text-xs">Take quizzes in at least 3 distinct subjects to unlock Radar View.</p>
                                    </div>
                                ) : (
                                    <svg viewBox="0 0 100 100" className="w-full h-full max-w-[250px] overflow-visible">
                                        
                                        {/* Background Polygons (Grid) */}
                                        {[20, 40, 60, 80, 100].map((r, i) => (
                                            <polygon 
                                                key={i}
                                                points={subjectStats.map((_, idx) => {
                                                    const angle = (Math.PI * 2 * idx) / subjectStats.length - Math.PI / 2;
                                                    const x = 50 + (r/2) * Math.cos(angle);
                                                    const y = 50 + (r/2) * Math.sin(angle);
                                                    return `${x},${y}`;
                                                }).join(' ')}
                                                fill="none" 
                                                stroke="#e2e8f0" 
                                                strokeWidth="0.5" 
                                            />
                                        ))}

                                        {/* Axis Lines */}
                                        {subjectStats.map((stat, idx) => {
                                             const angle = (Math.PI * 2 * idx) / subjectStats.length - Math.PI / 2;
                                             const x = 50 + 50 * Math.cos(angle);
                                             const y = 50 + 50 * Math.sin(angle);
                                             const labelX = 50 + 65 * Math.cos(angle);
                                             const labelY = 50 + 65 * Math.sin(angle);
                                             return (
                                                 <g key={idx}>
                                                     <line x1="50" y1="50" x2={x} y2={y} stroke="#e2e8f0" strokeWidth="0.5" />
                                                     <text 
                                                        x={labelX} 
                                                        y={labelY} 
                                                        textAnchor="middle" 
                                                        dominantBaseline="middle" 
                                                        className="text-[3px] font-bold fill-slate-500 uppercase tracking-wide"
                                                     >
                                                         {stat.subject.substring(0, 10)}
                                                     </text>
                                                     <text 
                                                        x={labelX} 
                                                        y={labelY + 4} 
                                                        textAnchor="middle" 
                                                        dominantBaseline="middle" 
                                                        className="text-[2.5px] font-bold fill-slate-400"
                                                     >
                                                         {stat.avg}%
                                                     </text>
                                                 </g>
                                             );
                                        })}

                                        {/* Data Polygon */}
                                        <polygon 
                                            points={subjectStats.map((stat, idx) => {
                                                const angle = (Math.PI * 2 * idx) / subjectStats.length - Math.PI / 2;
                                                const r = stat.avg / 2; // Radius 0-50 based on 0-100%
                                                const x = 50 + r * Math.cos(angle);
                                                const y = 50 + r * Math.sin(angle);
                                                return `${x},${y}`;
                                            }).join(' ')}
                                            fill="rgba(30, 58, 138, 0.2)" 
                                            stroke="#1e3a8a" 
                                            strokeWidth="2" 
                                            className="transition-all duration-1000 ease-out"
                                        />
                                        
                                        {/* Dots */}
                                        {subjectStats.map((stat, idx) => {
                                            const angle = (Math.PI * 2 * idx) / subjectStats.length - Math.PI / 2;
                                            const r = stat.avg / 2;
                                            const x = 50 + r * Math.cos(angle);
                                            const y = 50 + r * Math.sin(angle);
                                            return (
                                                <circle 
                                                    key={idx} 
                                                    cx={x} 
                                                    cy={y} 
                                                    r="2" 
                                                    className="fill-white stroke-univet-blue stroke-[1.5px]" 
                                                />
                                            );
                                        })}
                                    </svg>
                                )}
                            </div>
                        ) : graphType === 'bar' ? (
                             // BAR CHART
                            <div className="h-full w-full flex items-end justify-between space-x-2 px-2 pt-4">
                                {recentQuizzes.map((quiz, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center h-full group">
                                        
                                        <div className="flex-1 w-full flex items-end justify-center relative">
                                            {/* Bar Track */}
                                            <div className="w-full max-w-[40px] bg-slate-100 rounded-t-lg h-full absolute z-0"></div>
                                            
                                            {/* Fill */}
                                            <div 
                                                className={`w-full max-w-[40px] rounded-t-lg relative z-10 transition-all duration-700 ease-out ${
                                                    quiz.percentage >= 80 ? 'bg-gradient-to-t from-emerald-600 to-emerald-400' :
                                                    quiz.percentage >= 50 ? 'bg-gradient-to-t from-blue-600 to-blue-400' :
                                                    'bg-gradient-to-t from-rose-600 to-rose-400'
                                                }`}
                                                style={{ height: `${quiz.percentage}%` }}
                                            >
                                                {/* Tooltip */}
                                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold py-1.5 px-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-xl whitespace-nowrap z-20 pointer-events-none transform translate-y-2 group-hover:translate-y-0">
                                                    {quiz.percentage}%
                                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center h-4">
                                            {new Date(quiz.created_at || Date.now()).toLocaleDateString(undefined, {month: 'numeric', day: 'numeric'})}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             // AREA CHART - Updated to match requested style
                            <div className="h-full w-full relative pt-4 pb-2">
                                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                                    <defs>
                                        {/* Main Blue Gradient */}
                                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
                                            <stop offset="90%" stopColor="#4f46e5" stopOpacity="0.05" />
                                            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                                        </linearGradient>
                                        
                                        {/* Secondary Light Overlay Gradient for "Layered" look */}
                                        <linearGradient id="layerGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
                                            <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>

                                    {/* Horizontal Grid Lines */}
                                    {[20, 40, 60, 80].map(y => (
                                        <line 
                                            key={y} x1="0" y1={y} x2="100" y2={y} 
                                            stroke="#f1f5f9" 
                                            strokeWidth="1" 
                                            vectorEffect="non-scaling-stroke" 
                                        />
                                    ))}

                                    {/* "Fake" Secondary Layer to create depth like the image */}
                                    <path 
                                        d={(() => {
                                            // Create slightly offset/smoothed data for the background wave
                                            const points = recentQuizzes.map((q, i) => ({
                                                x: (i / (recentQuizzes.length - 1 || 1)) * 100,
                                                y: 100 - (Math.min(q.percentage, 100) * 0.85) // Slightly lower/different
                                            }));
                                            let path = getCatmullRomPath(points, false);
                                            path += ` L 100 100 L 0 100 Z`;
                                            return path;
                                        })()}
                                        fill="url(#layerGradient)"
                                        className="transition-all duration-1000 ease-in-out"
                                        style={{ transform: 'translateY(5px)' }}
                                    />

                                    {/* Main Area Fill */}
                                    <path 
                                        d={(() => {
                                            const points = recentQuizzes.map((q, i) => ({
                                                x: (i / (recentQuizzes.length - 1 || 1)) * 100,
                                                y: 100 - Math.min(q.percentage, 100)
                                            }));
                                            let path = getCatmullRomPath(points, false);
                                            path += ` L 100 100 L 0 100 Z`;
                                            return path;
                                        })()}
                                        fill="url(#areaGradient)"
                                        className="transition-all duration-700 ease-in-out"
                                    />
                                    
                                    {/* Main Stroke Line - Thicker and Indigo */}
                                    <path 
                                        d={getCatmullRomPath(recentQuizzes.map((q, i) => ({
                                            x: (i / (recentQuizzes.length - 1 || 1)) * 100,
                                            y: 100 - Math.min(q.percentage, 100)
                                        })), false)}
                                        fill="none"
                                        stroke="#4f46e5" 
                                        strokeWidth="3"
                                        vectorEffect="non-scaling-stroke"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="transition-all duration-700 ease-in-out drop-shadow-sm"
                                    />

                                    {/* Interactive Points (Hidden by default, shown on group hover) */}
                                    {recentQuizzes.map((quiz, i) => {
                                        const x = (i / (recentQuizzes.length - 1 || 1)) * 100;
                                        const y = 100 - Math.min(quiz.percentage, 100);
                                        return (
                                            <g key={i} className="group/point">
                                                {/* Large invisible hit target */}
                                                <rect x={x - 2} y="0" width="4" height="100" fill="transparent" className="cursor-pointer" />
                                                
                                                {/* Vertical Guide Line (shown on hover) */}
                                                <line 
                                                    x1={x} y1={y} x2={x} y2={100} 
                                                    stroke="#cbd5e1" 
                                                    strokeWidth="1" 
                                                    vectorEffect="non-scaling-stroke"
                                                    strokeDasharray="4 4"
                                                    className="opacity-0 group-hover/point:opacity-100 transition-opacity"
                                                />

                                                {/* The Dot */}
                                                <circle 
                                                    cx={x} cy={y} 
                                                    r="3" 
                                                    vectorEffect="non-scaling-stroke"
                                                    className="fill-white stroke-indigo-600 stroke-[2px] opacity-0 group-hover/point:opacity-100 transition-all duration-200" 
                                                />
                                                
                                                {/* Tooltip */}
                                                <foreignObject x={x - 15} y={y - 15} width="30" height="20" className="overflow-visible pointer-events-none">
                                                    <div className="flex flex-col items-center opacity-0 group-hover/point:opacity-100 transition-all duration-200 transform translate-y-2 group-hover/point:translate-y-0">
                                                        <div className="bg-slate-800 text-white text-[12px] px-2 py-1 rounded-md font-bold shadow-xl whitespace-nowrap">
                                                            {quiz.percentage}%
                                                        </div>
                                                        <div className="w-0 h-0 border-l-[3px] border-l-transparent border-t-[4px] border-t-slate-800 border-r-[3px] border-r-transparent"></div>
                                                    </div>
                                                </foreignObject>

                                                 {/* X-Axis Labels */}
                                                <text 
                                                    x={x} 
                                                    y={105} 
                                                    textAnchor="middle" 
                                                    fontSize="3" 
                                                    fill="#64748b" 
                                                    fontWeight="medium" 
                                                    className="font-sans select-none"
                                                    style={{ textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}
                                                >
                                                    {new Date(quiz.created_at || Date.now()).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity Table */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                     <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-univet-blue" />
                                Recent Activity
                            </h3>
                        </div>
                        <button 
                            onClick={() => navigate('/mcq-generator')} 
                            className="text-sm font-bold text-univet-blue hover:text-univet-gold transition-colors flex items-center"
                        >
                            New Quiz <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {recentQuizzes.length === 0 ? (
                             <div className="text-center py-8 text-slate-400 text-sm font-medium">No recent activity found.</div>
                        ) : (
                            recentQuizzes.map((result, idx) => (
                                <div key={idx} className="flex items-center p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100 group">
                                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-univet-blue mr-4 font-bold text-sm">
                                        #{idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0 mr-4">
                                        <h4 className="font-bold text-slate-700 text-sm truncate">{result.topic}</h4>
                                        <div className="flex items-center text-xs text-slate-400 mt-1 space-x-2">
                                            <span>{result.subject}</span>
                                            <span>•</span>
                                            <span>{new Date(result.created_at || Date.now()).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl text-sm font-black ${
                                        result.percentage >= 80 ? 'bg-emerald-100 text-emerald-700' : 
                                        result.percentage >= 50 ? 'bg-blue-100 text-blue-700' : 
                                        'bg-rose-100 text-rose-700'
                                    }`}>
                                        {result.percentage}%
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
                
                {/* Todo Progress Card */}
                <div className="bg-univet-blue text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-univet-gold/10 rounded-full blur-3xl -ml-10 -mb-10"></div>
                    
                    <div className="relative z-10">
                        <h3 className="text-2xl font-serif font-black mb-1">Your Objectives</h3>
                        <p className="text-blue-200 text-sm font-medium mb-8">Task completion status</p>
                        
                        <div className="flex items-center justify-center mb-8">
                            <div className="relative w-40 h-40">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="80" cy="80" r="70" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                                    <circle 
                                        cx="80" cy="80" r="70" 
                                        fill="transparent" 
                                        stroke="#CCA000" 
                                        strokeWidth="12" 
                                        strokeDasharray={440}
                                        strokeDashoffset={440 - (440 * todoProgress) / 100}
                                        strokeLinecap="round"
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className="text-4xl font-black">{todoProgress}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="font-bold mb-4">{Math.round(completedTodos)} / {todos.length} Tasks Completed</p>
                            <button 
                                onClick={() => navigate('/todos')}
                                className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl font-bold uppercase tracking-widest text-xs transition-colors border border-white/20"
                            >
                                Manage Tasks
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <button 
                            onClick={() => navigate('/mcq-generator')}
                            className="flex items-center p-4 bg-slate-50 hover:bg-blue-50 rounded-2xl transition-all group text-left border border-transparent hover:border-blue-200"
                        >
                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-univet-blue mr-4 group-hover:scale-110 transition-transform">
                                <Brain className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="block font-bold text-slate-700">Practice Quiz</span>
                                <span className="text-xs text-slate-400 font-medium">Test your knowledge</span>
                            </div>
                        </button>

                        <button 
                            onClick={() => navigate('/blogs')}
                            className="flex items-center p-4 bg-slate-50 hover:bg-blue-50 rounded-2xl transition-all group text-left border border-transparent hover:border-blue-200"
                        >
                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-univet-blue mr-4 group-hover:scale-110 transition-transform">
                                <LayoutDashboard className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="block font-bold text-slate-700">Read Blogs</span>
                                <span className="text-xs text-slate-400 font-medium">Latest blogs & news</span>
                            </div>
                        </button>
                    </div>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashboard;
