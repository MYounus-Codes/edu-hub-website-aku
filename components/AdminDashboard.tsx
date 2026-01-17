
import React, { useState, useEffect, useMemo } from 'react';
import { supabaseService } from '../services/supabaseService';
import { SUBJECTS, YEARS, Grade, MaterialType, Material, Blog } from '../types';
import { Upload, CheckCircle, Newspaper, Database, AlertCircle, ImageIcon, Type, User, Link as LinkIcon, Settings, Trash2, Edit3, Loader2, Calendar, X, RefreshCw, Search, Eye, PenTool, Filter, BookOpen, Layers } from 'lucide-react';
import { marked } from 'marked';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'material' | 'blog' | 'manage'>('manage');
  const [blogContentMode, setBlogContentMode] = useState<'write' | 'preview'>('write');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  const [materials, setMaterials] = useState<Material[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Past Paper' | 'Note' | 'Blog'>('All');
  const [filterGrade, setFilterGrade] = useState<'All' | Grade>('All');
  const [filterSubject, setFilterSubject] = useState<string | 'All'>('All');

  const [materialForm, setMaterialForm] = useState({
    title: '',
    description: '',
    grade: 'Grade 9' as Grade,
    subject: SUBJECTS[0],
    type: 'Past Paper' as MaterialType,
    fileUrl: '',
    fileName: '',
    year: YEARS[0]
  });

  const [blogForm, setBlogForm] = useState({
    title: '',
    content: '',
    author: '',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200'
  });

  const fetchAllContent = async () => {
    setIsLoadingList(true);
    setError(null);
    try {
      const [g9p, g9n, g10p, g10n, b] = await Promise.all([
        supabaseService.getMaterials('Grade 9', 'Past Paper'),
        supabaseService.getMaterials('Grade 9', 'Note'),
        supabaseService.getMaterials('Grade 10', 'Past Paper'),
        supabaseService.getMaterials('Grade 10', 'Note'),
        supabaseService.getBlogs()
      ]);
      setMaterials([...g9p, ...g9n, ...g10p, ...g10n]);
      setBlogs(b);
    } catch (err: any) {
      setError("Failed to sync with cloud repository.");
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchAllContent();
  }, []);

  const highlightMatch = (text: string, query: string) => {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() 
            ? <mark key={i} className="bg-univet-gold text-univet-blue font-black px-0.5 rounded-sm">{part}</mark> 
            : part
        )}
      </span>
    );
  };

  const handleMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    setIsSubmitting(true);
    try {
      if (editingMaterial) {
        await supabaseService.updateMaterial(editingMaterial.id, materialForm, editingMaterial.grade, editingMaterial.type);
        setSuccess(`Modified: ${materialForm.title}`);
      } else {
        await supabaseService.addMaterial(materialForm);
        setSuccess(`Archived: ${materialForm.title}`);
      }
      setMaterialForm({ ...materialForm, title: '', description: '', fileName: '', fileUrl: '' });
      setEditingMaterial(null);
      setTimeout(() => setSuccess(null), 4000);
      fetchAllContent();
      setActiveTab('manage');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    setIsSubmitting(true);
    try {
      if (editingBlog) {
        await supabaseService.updateBlog(editingBlog.id, blogForm);
        setSuccess(`Insight Updated: ${blogForm.title}`);
      } else {
        await supabaseService.addBlog(blogForm);
        setSuccess(`Insight Archived: ${blogForm.title}`);
      }
      setBlogForm({ title: '', content: '', author: '', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1200' });
      setEditingBlog(null);
      setBlogContentMode('write');
      setTimeout(() => setSuccess(null), 4000);
      fetchAllContent();
      setActiveTab('manage');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMaterial = async (m: Material) => {
    if (!confirm(`Permanently purge "${m.title}"?`)) return;
    try {
      await supabaseService.deleteMaterial(m.id, m.grade, m.type);
      setSuccess('Resource purged from database.');
      setEditingMaterial(null);
      fetchAllContent();
      setTimeout(() => setSuccess(null), 3000);
      setActiveTab('manage');
    } catch (err: any) { setError(err.message); }
  };

  const handleDeleteBlog = async (blog: Blog) => {
    if (!confirm(`Permanently purge insight "${blog.title}"?`)) return;
    try {
      await supabaseService.deleteBlog(blog.id);
      setSuccess('Insight purged from database.');
      setEditingBlog(null);
      fetchAllContent();
      setTimeout(() => setSuccess(null), 3000);
      setActiveTab('manage');
    } catch (err: any) { setError(err.message); }
  };

  const startEditMaterial = (m: Material) => {
    setEditingMaterial(m);
    setMaterialForm({
      title: m.title,
      description: m.description,
      grade: m.grade,
      subject: m.subject,
      type: m.type,
      fileUrl: m.fileUrl,
      fileName: m.fileName,
      year: m.year || YEARS[0]
    });
    setActiveTab('material');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startEditBlog = (b: Blog) => {
    setEditingBlog(b);
    setBlogForm({
      title: b.title,
      content: b.content,
      author: b.author,
      image: b.image
    });
    setBlogContentMode('write');
    setActiveTab('blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilterType('All');
    setFilterGrade('All');
    setFilterSubject('All');
    fetchAllContent();
  };

  const combinedRepository = useMemo(() => {
    let combined: any[] = [
      ...materials.map(m => ({ ...m, category: 'Material' })),
      ...blogs.map(b => ({ ...b, category: 'Blog', grade: 'All', type: 'Insight' as any, subject: 'Scholarly' }))
    ];

    return combined.filter(item => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !searchQuery || 
                         item.title.toLowerCase().includes(q) || 
                         (item.author && item.author.toLowerCase().includes(q)) ||
                         (item.year && item.year.includes(q)) ||
                         (item.subject && item.subject.toLowerCase().includes(q));
      
      let matchType = false;
      if (filterType === 'All') {
        matchType = true;
      } else if (filterType === 'Blog') {
        matchType = item.category === 'Blog';
      } else {
        matchType = item.type === filterType;
      }

      const matchGrade = filterGrade === 'All' || item.grade === filterGrade;
      const matchSubject = filterSubject === 'All' || item.subject === filterSubject;

      return matchSearch && matchType && matchGrade && matchSubject;
    });
  }, [materials, blogs, searchQuery, filterType, filterGrade, filterSubject]);

  const inputClass = "w-full px-6 md:px-8 py-4 md:py-5 rounded-2xl md:rounded-[2rem] border-2 border-slate-200 focus:border-univet-blue outline-none font-bold text-lg md:text-xl text-slate-900 bg-white placeholder-slate-400 transition-all shadow-inner";
  const labelClass = "block text-[10px] md:text-[12px] font-black text-univet-blue uppercase tracking-[0.3em] md:tracking-[0.4em] mb-3 md:mb-4 ml-4 md:ml-6";
  const selectFilterClass = "w-full pl-10 md:pl-12 pr-6 py-3 md:py-4 rounded-xl border border-slate-200 outline-none focus:border-univet-blue font-bold text-slate-700 bg-white appearance-none cursor-pointer text-xs md:text-sm shadow-sm transition-all";

  const renderBlogPreview = () => {
    const html = marked.parse(blogForm.content || '*No content provided*');
    return (
      <div 
        className="prose max-w-none bg-slate-50 p-6 md:p-10 rounded-2xl md:rounded-[2rem] border-2 border-slate-100 min-h-[300px] overflow-y-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-12 md:py-20 px-4 md:px-6 animate-reveal">
      <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100">
        <div className="bg-univet-blue p-10 md:p-24 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 md:p-12 opacity-10">
             <Database className="w-32 h-32 md:w-64 md:h-64 rotate-12" />
          </div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-8xl font-serif font-black mb-4 md:mb-6 tracking-tight text-white">System Console</h1>
            <p className="text-univet-gold text-sm md:text-2xl font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Authorized Archive Management</p>
          </div>
        </div>

        <div className="flex bg-slate-50 border-b border-slate-200 overflow-x-auto no-scrollbar">
          {[
            { id: 'manage', icon: Settings, label: 'Repository' },
            { id: 'material', icon: Upload, label: 'Materials' },
            { id: 'blog', icon: Newspaper, label: 'Insights' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); if(tab.id !== 'material') setEditingMaterial(null); if(tab.id !== 'blog') setEditingBlog(null); }}
              className={`flex-1 py-6 md:py-10 font-black text-[9px] md:text-[11px] uppercase tracking-[0.3em] md:tracking-[0.4em] flex items-center justify-center space-x-2 md:space-x-4 transition-all min-w-[130px] md:min-w-[200px] ${activeTab === tab.id ? 'bg-white text-univet-blue border-b-4 md:border-b-8 border-univet-gold shadow-lg' : 'text-slate-400 hover:text-univet-blue'}`}
            >
              <tab.icon className="w-4 h-4 md:w-6 h-6" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 md:p-20">
          {success && (
            <div className="mb-8 md:mb-12 flex items-center bg-emerald-50 text-emerald-900 p-6 md:p-8 rounded-2xl md:rounded-[2rem] border-l-8 md:border-l-[12px] border-emerald-500 shadow-sm animate-reveal">
              <CheckCircle className="w-6 h-6 md:w-8 h-8 mr-4 md:mr-6 text-emerald-500" />
              <span className="font-bold text-sm md:text-lg">{success}</span>
            </div>
          )}

          {error && (
            <div className="mb-8 md:mb-12 flex items-start bg-rose-50 text-rose-900 p-6 md:p-8 rounded-2xl md:rounded-[2rem] border-l-8 md:border-l-[12px] border-rose-500 shadow-sm animate-reveal">
              <AlertCircle className="w-6 h-6 md:w-8 h-8 mr-4 md:mr-6 text-rose-500 mt-1 shrink-0" />
              <div className="flex-1">
                <span className="font-bold text-sm md:text-lg block">{error}</span>
              </div>
            </div>
          )}

          {activeTab === 'manage' && (
            <div className="space-y-8 md:space-y-12 animate-reveal">
              <div className="bg-slate-50 p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-slate-100 space-y-6 md:space-y-8">
                <div className="relative">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Global Search</label>
                  <div className="relative">
                    <Search className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 md:w-6 h-6" />
                    <input 
                      type="text" 
                      placeholder="Title, Scholar, Session or Keyword..." 
                      className="w-full pl-12 md:pl-16 pr-6 py-4 md:py-6 rounded-xl md:rounded-2xl border-2 border-transparent outline-none focus:border-univet-blue font-bold text-base md:text-xl text-slate-700 bg-white shadow-inner transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-end">
                   <div className="relative">
                      <label className="block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 md:mb-3 ml-2">Resource Type</label>
                      <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                        <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)} className={selectFilterClass}>
                          <option value="All">All Assets</option>
                          <option value="Past Paper">Past Papers</option>
                          <option value="Note">Notes</option>
                          <option value="Blog">Insights</option>
                        </select>
                      </div>
                   </div>
                   <div className="relative">
                      <label className="block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 md:mb-3 ml-2">Academic Grade</label>
                      <div className="relative">
                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                        <select value={filterGrade} onChange={(e) => setFilterGrade(e.target.value as any)} className={selectFilterClass}>
                          <option value="All">All Grades</option>
                          <option value="Grade 9">Grade 9</option>
                          <option value="Grade 10">Grade 10</option>
                        </select>
                      </div>
                   </div>
                   <div className="relative">
                      <label className="block text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 md:mb-3 ml-2">Discipline</label>
                      <div className="relative">
                        <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                        <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className={selectFilterClass}>
                          <option value="All">All Subjects</option>
                          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                   </div>
                   <button onClick={resetFilters} className="py-3.5 md:py-4 bg-white text-univet-blue border border-slate-200 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center space-x-2">
                     <RefreshCw className={`w-3.5 h-3.5 md:w-4 h-4 ${isLoadingList ? 'animate-spin' : ''}`} />
                     <span>Refresh</span>
                   </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm no-scrollbar">
                <table className="w-full text-left border-collapse bg-white min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 md:px-8 py-4 md:py-6 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Document Title</th>
                      <th className="px-6 md:px-8 py-4 md:py-6 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Classification</th>
                      <th className="px-6 md:px-8 py-4 md:py-6 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Scholar / Origin</th>
                      <th className="px-6 md:px-8 py-4 md:py-6 text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Session</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {combinedRepository.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => item.category === 'Blog' ? startEditBlog(item) : startEditMaterial(item)}>
                        <td className="px-6 md:px-8 py-6 md:py-8">
                          <p className="font-bold text-univet-blue text-base md:text-lg line-clamp-1">{highlightMatch(item.title, searchQuery)}</p>
                          <div className="flex items-center space-x-2 mt-1">
                             <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-tighter">{item.category} • {new Date(item.date || item.createdAt).toLocaleDateString()}</p>
                          </div>
                        </td>
                        <td className="px-6 md:px-8 py-6 md:py-8">
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] md:text-[10px] font-black text-univet-blue/50 uppercase">{item.grade}</span>
                            <span className={`text-[8px] md:text-[9px] font-black px-2 py-0.5 rounded-md self-start ${item.type === 'Past Paper' ? 'bg-amber-100 text-amber-700' : item.type === 'Note' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {item.type || 'Insight'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 md:px-8 py-6 md:py-8">
                          <span className="font-bold text-slate-600 text-xs md:text-sm">{highlightMatch(item.author || item.subject, searchQuery)}</span>
                        </td>
                        <td className="px-6 md:px-8 py-6 md:py-8 text-center">
                          {item.year ? (
                            <span className="bg-univet-gold/10 text-univet-gold px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-black shadow-sm">
                              {highlightMatch(item.year, searchQuery)}
                            </span>
                          ) : <span className="text-slate-200">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'material' && (
            <form onSubmit={handleMaterialSubmit} className="space-y-8 md:space-y-12 animate-reveal">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-2xl md:text-3xl font-serif font-black text-univet-blue">
                  {editingMaterial ? 'Modify Repository Record' : 'Ingest New Learning Asset'}
                </h3>
                {editingMaterial && (
                  <button type="button" onClick={() => { setEditingMaterial(null); setActiveTab('manage'); }} className="text-slate-400 font-black text-[10px] uppercase tracking-widest flex items-center bg-slate-50 px-4 py-2 rounded-full">
                    <X className="w-4 h-4 mr-2" /> Discard
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <div>
                  <label className={labelClass}>Document Headline</label>
                  <input type="text" required value={materialForm.title} onChange={(e) => setMaterialForm({...materialForm, title: e.target.value})} className={inputClass} placeholder="e.g. 2024 Biology Board Paper" />
                </div>
                <div>
                  <label className={labelClass}>Direct Asset URL</label>
                  <input type="url" required value={materialForm.fileUrl} onChange={(e) => setMaterialForm({...materialForm, fileUrl: e.target.value})} className={inputClass} placeholder="https://drive.google.com/..." />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-10">
                <div>
                  <label className={labelClass}>Target Grade</label>
                  <select value={materialForm.grade} onChange={(e) => setMaterialForm({...materialForm, grade: e.target.value as Grade})} className={inputClass}>
                    <option>Grade 9</option>
                    <option>Grade 10</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Discipline Area</label>
                  <select value={materialForm.subject} onChange={(e) => setMaterialForm({...materialForm, subject: e.target.value})} className={inputClass}>
                    {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Classification</label>
                  <select value={materialForm.type} onChange={(e) => setMaterialForm({...materialForm, type: e.target.value as MaterialType})} className={inputClass}>
                    <option>Past Paper</option>
                    <option>Note</option>
                  </select>
                </div>
              </div>

              {materialForm.type === 'Past Paper' && (
                <div>
                  <label className={labelClass}>Board Examination Session (Year)</label>
                  <select value={materialForm.year} onChange={(e) => setMaterialForm({...materialForm, year: e.target.value})} className={inputClass}>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label className={labelClass}>Scholarly Metadata / Summary</label>
                <textarea required rows={4} value={materialForm.description} onChange={(e) => setMaterialForm({...materialForm, description: e.target.value})} className={`${inputClass} font-normal text-base md:text-lg`} placeholder="Key topics and analysis..."></textarea>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button disabled={isSubmitting} className="flex-1 bg-univet-blue text-white font-black py-5 md:py-8 rounded-2xl md:rounded-[2rem] hover:bg-univet-gold hover:text-univet-blue transition-all shadow-xl uppercase tracking-[0.3em] text-xs md:text-sm">
                  {isSubmitting ? 'Synchronizing...' : (editingMaterial ? 'Commit Modification' : 'Archive Asset')}
                </button>
                {editingMaterial && (
                   <button type="button" onClick={() => handleDeleteMaterial(editingMaterial)} className="bg-rose-50 text-rose-600 px-8 py-5 md:py-8 rounded-2xl md:rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-widest hover:bg-rose-100">
                    Purge
                   </button>
                )}
              </div>
            </form>
          )}

          {activeTab === 'blog' && (
            <form onSubmit={handleBlogSubmit} className="space-y-8 md:space-y-12 animate-reveal">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-2xl md:text-3xl font-serif font-black text-univet-blue">
                  {editingBlog ? 'Edit Scholarly Insight' : 'Publish New Academic Insight'}
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                <input type="text" required value={blogForm.title} onChange={(e) => setBlogForm({...blogForm, title: e.target.value})} className={inputClass} placeholder="Insight Headline" />
                <input type="text" required value={blogForm.author} onChange={(e) => setBlogForm({...blogForm, author: e.target.value})} className={inputClass} placeholder="Contributing Scholar" />
              </div>
              <input type="text" value={blogForm.image} onChange={(e) => setBlogForm({...blogForm, image: e.target.value})} className={inputClass} placeholder="Cover Imagery URL" />
              
              <div className="space-y-4">
                <div className="flex bg-slate-100 p-1.5 rounded-2xl w-fit">
                   <button type="button" onClick={() => setBlogContentMode('write')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${blogContentMode === 'write' ? 'bg-white text-univet-blue shadow-sm' : 'text-slate-400'}`}>Write</button>
                   <button type="button" onClick={() => setBlogContentMode('preview')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${blogContentMode === 'preview' ? 'bg-white text-univet-blue shadow-sm' : 'text-slate-400'}`}>Preview</button>
                </div>
                {blogContentMode === 'write' ? (
                  <textarea required rows={10} value={blogForm.content} onChange={(e) => setBlogForm({...blogForm, content: e.target.value})} className={`${inputClass} font-normal text-base md:text-lg h-[300px] md:h-[400px]`} placeholder="Markdown supported narrative..."></textarea>
                ) : (
                  <div className="h-[300px] md:h-[400px] overflow-y-auto">
                    {renderBlogPreview()}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button disabled={isSubmitting} className="flex-1 bg-univet-gold text-univet-blue font-black py-5 md:py-8 rounded-2xl md:rounded-[2rem] hover:bg-univet-blue hover:text-white transition-all shadow-xl uppercase tracking-[0.3em] text-xs md:text-sm">
                  {isSubmitting ? 'Publishing...' : (editingBlog ? 'Update Feed' : 'Publish Archive')}
                </button>
                {editingBlog && (
                  <button type="button" onClick={() => handleDeleteBlog(editingBlog)} className="bg-rose-50 text-rose-600 px-8 py-5 md:py-8 rounded-2xl md:rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-widest hover:bg-rose-100">
                    Purge
                   </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
