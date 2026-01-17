
import React, { useEffect, useState } from 'react';
import { Blog } from '../types';
import { marked } from 'marked';
import { ArrowLeft, Calendar, Share2, Bookmark, ChevronRight } from 'lucide-react';

interface BlogDetailProps {
  blog: Blog;
  onBack: () => void;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ blog, onBack }) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [imgError, setImgError] = useState(false);

  const fallbackImage = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200";

  useEffect(() => {
    const parseContent = async () => {
      const html = await marked.parse(blog.content);
      setHtmlContent(html);
    };
    parseContent();
    window.scrollTo(0, 0);
  }, [blog.content]);

  return (
    <article className="min-h-screen bg-white animate-fade-in">
      {/* Header / Hero Area */}
      <div className="relative h-[60vh] md:h-[75vh] overflow-hidden">
        <img 
          src={imgError ? fallbackImage : (blog.image || fallbackImage)} 
          alt={blog.title} 
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2a4e] via-[#1a2a4e]/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
          <div className="max-w-4xl mx-auto">
            <button 
              onClick={onBack}
              className="flex items-center text-univet-gold font-black uppercase tracking-[0.3em] text-xs mb-8 hover:translate-x-[-10px] transition-transform"
            >
              <ArrowLeft className="w-5 h-5 mr-3" />
              Return to Archives
            </button>
            
            <div className="flex items-center space-x-6 mb-8">
              <span className="bg-univet-gold text-univet-blue px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                Faculty Insight
              </span>
              <div className="flex items-center text-white/70 text-sm font-bold">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(blog.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
              </div>
            </div>

            <h1 className="text-4xl md:text-7xl font-serif font-black text-white leading-tight mb-10 drop-shadow-2xl">
              {blog.title}
            </h1>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-univet-gold flex items-center justify-center text-univet-blue font-black text-xl shadow-xl">
                  {blog.author.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-black text-lg leading-tight">{blog.author}</p>
                  <p className="text-univet-gold text-[10px] font-black uppercase tracking-widest">Authorized Scholar</p>
                </div>
              </div>
              
              <div className="hidden md:flex items-center space-x-4">
                 <button className="p-4 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all">
                    <Share2 className="w-5 h-5" />
                 </button>
                 <button className="p-4 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all">
                    <Bookmark className="w-5 h-5" />
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div 
          className="prose max-w-none text-univet-blue selection:bg-univet-gold selection:text-univet-blue"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
        
        {/* REFINED ABOUT AUTHOR SECTION */}
        <div className="mt-32 pt-16 border-t border-gray-100">
           <div className="bg-[#f8f9fb] rounded-[3.5rem] p-12 md:p-16 flex flex-col md:flex-row items-center gap-12 shadow-sm border border-gray-100">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-univet-blue flex items-center justify-center text-univet-gold text-5xl font-serif font-black shadow-[0_20px_40px_rgba(26,42,78,0.2)] border-4 border-white">
                  {blog.author.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-univet-gold w-10 h-10 rounded-full border-4 border-white flex items-center justify-center">
                  <ChevronRight className="w-4 h-4 text-univet-blue" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h4 className="text-4xl font-serif font-black text-univet-blue mb-4">About {blog.author}</h4>
                <p className="text-lg font-bold text-univet-blue/60 leading-relaxed max-w-lg">
                  A certified academic lead at UNIVET, specializing in AKU-EB curriculum development and scholarly research.
                </p>
              </div>

              <button 
                onClick={onBack} 
                className="bg-univet-blue text-white px-10 py-6 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-univet-gold hover:text-univet-blue transition-all shadow-xl whitespace-nowrap"
              >
                View More Posts
              </button>
           </div>
        </div>
      </div>
    </article>
  );
};

export default BlogDetail;
