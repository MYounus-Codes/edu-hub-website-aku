
import React, { useState, useEffect, useMemo } from 'react';
import { Grade, SUBJECTS, MaterialType, Material } from '../types';
import { supabaseService } from '../services/supabaseService';
import { FileText, ExternalLink, Search, Layers, RefreshCcw, BookOpen, Calendar } from 'lucide-react';

interface GradeBrowserProps {
  grade: Grade;
}

const GradeBrowser: React.FC<GradeBrowserProps> = ({ grade }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string | 'All'>('All');
  const [selectedType, setSelectedType] = useState<MaterialType>('Past Paper');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const data = await supabaseService.getMaterials(grade, selectedType);
      setMaterials(data);
    } catch (err) {
      console.error(err);
      setMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [grade, selectedType]);

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

  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      const matchSubject = selectedSubject === 'All' || m.subject === selectedSubject;
      const matchSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (m.year && m.year.includes(searchQuery)) ||
                          (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (m.subject.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSubject && matchSearch;
    });
  }, [materials, selectedSubject, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20 animate-reveal min-h-screen">
      <div className="text-center mb-12 md:mb-24">
        <h1 className="text-4xl md:text-8xl font-serif font-black text-univet-blue mb-6 tracking-tight">{grade} Library</h1>
        <p className="text-slate-500 font-bold max-w-xl mx-auto text-base md:text-lg leading-relaxed px-4">
          Authorized retrieval from the AKU-EB examination archive. Only verified board materials are listed here.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Sidebar / Top bar on mobile - Width increased to col-span-4 */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] shadow-sm border border-slate-100 lg:sticky lg:top-32">
            <h3 className="text-lg md:text-2xl font-black text-univet-blue mb-8 md:mb-10 flex items-center border-b pb-5">
              <Layers className="w-6 h-6 mr-4 text-univet-gold" />
              Repository
            </h3>
            
            <div className="flex flex-col gap-10 md:gap-12">
              <div>
                <label className="block text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Category</label>
                <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 mobile-filter-scroll">
                  {(['Past Paper', 'Note'] as MaterialType[]).map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`text-left px-5 py-3 md:px-8 md:py-4 rounded-2xl text-xs md:text-base font-bold transition-all whitespace-nowrap ${selectedType === type ? 'bg-univet-blue text-white shadow-xl scale-105' : 'hover:bg-slate-50 text-slate-500 border border-transparent hover:border-slate-100'}`}
                    >
                      {type}s
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Subject Filter</label>
                {/* max-height adjusted for better proportions given the wider sidebar */}
                <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[550px] pr-0 lg:pr-3 lg:custom-scrollbar pb-4 lg:pb-0 mobile-filter-scroll">
                  <button
                    onClick={() => setSelectedSubject('All')}
                    className={`text-left px-5 py-2.5 md:px-8 md:py-4 rounded-xl text-xs md:text-base font-bold transition-all whitespace-nowrap ${selectedSubject === 'All' ? 'bg-univet-gold text-univet-blue' : 'hover:bg-slate-50 text-slate-400'}`}
                  >
                    All Disciplines
                  </button>
                  {SUBJECTS.map(subject => (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className={`text-left px-5 py-2.5 md:px-8 md:py-4 rounded-xl text-xs md:text-base font-bold transition-all whitespace-nowrap ${selectedSubject === subject ? 'bg-univet-gold text-univet-blue' : 'hover:bg-slate-50 text-slate-400'}`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area - Adjusted to col-span-8 */}
        <div className="lg:col-span-8 space-y-8 md:space-y-10">
          <div className="relative group">
            <Search className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-univet-gold w-5 h-5 md:w-6 h-6 transition-colors" />
            <input 
              type="text" 
              placeholder={`Search verified ${selectedType.toLowerCase()}s...`}
              className="w-full pl-14 md:pl-20 pr-6 md:pr-10 py-5 md:py-8 bg-slate-50 rounded-[1.5rem] md:rounded-[2.5rem] border-2 border-transparent outline-none focus:border-univet-blue focus:bg-white text-univet-blue font-bold text-base md:text-xl transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 md:py-40">
              <RefreshCcw className="w-12 h-12 md:w-16 h-16 text-univet-gold animate-spin mb-8" />
              <p className="text-[10px] md:text-sm font-black text-slate-400 uppercase tracking-[0.5em]">Syncing Archives...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {filteredMaterials.map((m, i) => (
                <div key={m.id} className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group animate-reveal" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="p-8 md:p-10 flex-1">
                    <div className="flex items-center justify-between mb-6 md:mb-8 flex-wrap gap-4">
                      <span className="px-4 py-1.5 rounded-full bg-slate-50 text-univet-blue text-[9px] md:text-[10px] font-black uppercase tracking-widest border border-slate-100 shadow-sm">
                        {highlightMatch(m.subject, searchQuery)}
                      </span>
                      {m.year && (
                        <div className="flex items-center text-[10px] md:text-[12px] font-black text-univet-gold uppercase tracking-widest bg-univet-blue px-4 py-2 rounded-full shadow-lg">
                          <Calendar className="w-4 h-4 mr-2" />
                          Session {highlightMatch(m.year, searchQuery)}
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-univet-blue mb-4 leading-tight group-hover:text-univet-gold transition-colors">
                      {highlightMatch(m.title, searchQuery)}
                    </h3>
                    <p className="text-slate-500 font-semibold text-sm md:text-base leading-relaxed mb-6 line-clamp-3 opacity-80">
                      {highlightMatch(m.description, searchQuery)}
                    </p>
                  </div>
                  <div className="p-8 md:p-10 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center rounded-b-[2rem] md:rounded-b-[2.5rem] gap-4">
                    <div className="flex items-center text-[10px] md:text-[12px] font-black text-univet-blue uppercase tracking-[0.1em] border-l-4 border-univet-gold pl-4 self-start">
                      <FileText className="w-4 h-4 md:w-5 h-5 mr-3 text-univet-gold" />
                      Official PDF Asset
                    </div>
                    <a 
                      href={m.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto bg-univet-blue text-white px-8 py-4 md:px-10 md:py-5 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center hover:bg-univet-gold hover:text-univet-blue transition-all shadow-xl"
                    >
                      Access Now
                      <ExternalLink className="w-4 h-4 ml-2.5" />
                    </a>
                  </div>
                </div>
              ))}
              {filteredMaterials.length === 0 && (
                <div className="col-span-full py-20 md:py-40 text-center bg-slate-50 rounded-[2rem] md:rounded-[4rem] border-4 border-dashed border-white">
                  <BookOpen className="w-16 h-16 md:w-20 h-20 text-slate-200 mx-auto mb-8 md:mb-10" />
                  <h3 className="text-2xl md:text-3xl font-serif font-black text-slate-300">Archive Records Null</h3>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradeBrowser;
