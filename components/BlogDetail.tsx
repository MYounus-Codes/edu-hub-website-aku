
import React, { useEffect, useState } from 'react';
import { Blog } from '../types';
import { marked } from 'marked';
import { ArrowLeft, Calendar, Share2, Bookmark, ChevronRight } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabaseService } from '../services/supabaseService';

interface BlogDetailProps {
  blog?: Blog;
  allBlogs?: Blog[];
  openBlog?: (blog: Blog) => void;
  onBack?: () => void;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ blog: initialBlog, allBlogs = [], openBlog, onBack }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | undefined>(initialBlog);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  // Fetch Logic
  useEffect(() => {
    const fetchBlog = async () => {
      // 1. Reset states when ID changes
      setNotFound(false);
      setImgError(false);

      // 2. If blog passed via props (and matches ID if present), use it
      if (initialBlog && (!id || initialBlog.id === id)) {
        setBlog(initialBlog);
        return;
      }
      
      // 3. Try finding in the allBlogs list
      if (allBlogs.length > 0 && id) {
        const found = allBlogs.find(b => b.id === id);
        if (found) {
          setBlog(found);
          return;
        }
      }

      // 4. Fetch from API if we have ID but no data
      if (id) {
        setLoading(true);
        const fetched = await supabaseService.getBlogById(id);
        if (fetched) {
            setBlog(fetched);
        } else {
            setNotFound(true);
            setBlog(undefined);
        }
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, initialBlog, allBlogs]);

  const fallbackImage = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200";

  // Content Parsing
  useEffect(() => {
    const parseContent = async () => {
      if (blog?.content) {
        const html = await marked.parse(blog.content);
        setHtmlContent(html);
      }
    };
    if (blog) {
        parseContent();
        window.scrollTo(0, 0);
    }
  }, [blog]);

  const handleBack = () => {
    if (onBack) onBack();
    else navigate('/blogs');
  };

  if (loading) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-spin w-12 h-12 border-4 border-slate-200 border-t-blue-900 rounded-full"></div>
        </div>
     );
  }

  if (notFound || (!blog && !loading)) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-white">
            <h2 className="text-4xl font-serif font-black text-slate-800 mb-4">Article Not Found</h2>
            <p className="text-slate-500 mb-8 font-medium">The scholarly article you are looking for does not exist or has been removed.</p>
            <button onClick={handleBack} className="bg-univet-blue text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-univet-gold hover:text-univet-blue transition-all">
                Return to Archives
            </button>
        </div>
    );
  }

  // Get latest 3 blogs excluding current one
  const recommendedBlogs = allBlogs
    .filter(b => b.id !== blog.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

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
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-16">
          <div className="max-w-4xl mx-auto">
            <button 
              onClick={handleBack}
              className="flex items-center text-univet-gold font-black uppercase tracking-[0.3em] text-xs mb-6 md:mb-8 hover:translate-x-[-10px] transition-transform"
            >
              <ArrowLeft className="w-5 h-5 mr-3" />
              Return to Archives
            </button>
            
            <div className="flex items-center space-x-6 mb-6 md:mb-8">
              <span className="bg-univet-gold text-univet-blue px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
                Faculty Insight
              </span>
              <div className="flex items-center text-white/70 text-xs md:text-sm font-bold">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(blog.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-black text-white leading-tight mb-8 md:mb-10 drop-shadow-2xl">
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
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <div 
          className="prose prose-lg md:prose-xl max-w-none font-serif text-slate-800 
          prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900 
          prose-p:leading-relaxed prose-p:font-normal prose-p:text-slate-700
          prose-a:text-univet-blue prose-a:no-underline prose-a:border-b prose-a:border-univet-gold hover:prose-a:bg-univet-gold/20 hover:prose-a:border-transparent transition-all
          prose-strong:font-bold prose-strong:text-slate-900
          prose-img:rounded-xl prose-img:shadow-lg
          selection:bg-yellow-100 selection:text-slate-900"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
        
        {/* RECOMMENDED BLOGS SECTION */}
        <div className="mt-20 md:mt-32 pt-12 md:pt-16 border-t border-gray-100">
           <h4 className="text-3xl md:text-4xl font-serif font-black text-univet-blue mb-8 md:mb-12 text-center md:text-left">Recommended Analysis</h4>
            
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-16">
              {recommendedBlogs.map((b) => (
                 <div key={b.id} className="group cursor-pointer" onClick={() => {
                    if(openBlog) {
                        openBlog(b);
                    } else {
                        navigate(`/blogs/${b.id}`);
                    }
                    window.scrollTo(0, 0);
                 }}>
                    <div className="h-52 overflow-hidden rounded-[2rem] mb-6 shadow-sm">
                        <img 
                          src={b.image || fallbackImage} 
                          alt={b.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                    </div>
                    <div className="flex items-center space-x-3 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>{new Date(b.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="text-univet-gold">{b.author}</span>
                    </div>
                    <h5 className="text-xl font-black text-univet-blue group-hover:text-univet-gold transition-colors leading-tight mb-3 line-clamp-2">
                        {b.title}
                    </h5>
                 </div>
              ))}
           </div>
           
           <div className="text-center md:text-left">
              <button 
                onClick={handleBack} 
                className="bg-univet-blue text-white px-10 py-6 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-univet-gold hover:text-univet-blue transition-all shadow-xl whitespace-nowrap"
              >
                Return to Archives
              </button>
           </div>
        </div>
      </div>
    </article>
  );
};

export default BlogDetail;
