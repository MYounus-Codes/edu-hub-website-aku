
import React, { useEffect, useState } from 'react';
import { Blog, Comment } from '../types';
import { marked } from 'marked';
import { ArrowLeft, Share2, Bookmark, Heart, MessageCircle, PlayCircle, MoreHorizontal, User, PauseCircle, Send, X } from 'lucide-react';
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
  
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Fetch Logic
  useEffect(() => {
    const fetchBlogAndComments = async () => {
      // 1. Reset states when ID changes
      setNotFound(false);
      setImgError(false);
      setIsLiked(false); // Reset like state for new blog

      let activeBlog = initialBlog;

      // 2. Resolve the blog object
      if (!activeBlog && allBlogs.length > 0 && id) {
        activeBlog = allBlogs.find(b => b.id === id);
      }

      if (!activeBlog && id) {
        setLoading(true);
        const fetched = await supabaseService.getBlogById(id);
        if (fetched) {
            activeBlog = fetched;
        } else {
            setNotFound(true);
            activeBlog = undefined;
        }
        setLoading(false);
      }

      setBlog(activeBlog);
      
      if (activeBlog) {
        setLikesCount(activeBlog.likes || 0);
        
        // Check if current user liked
        const u = supabaseService.getCurrentUser();
        if (u) {
            const liked = await supabaseService.hasUserLikedBlog(activeBlog.id, u.id);
            setIsLiked(liked);
        }

        // Fetch comments
        const fetchedComments = await supabaseService.getComments(activeBlog.id);
        setComments(fetchedComments);
      }
    };

    fetchBlogAndComments();
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

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const handleLike = async () => {
    if (!blog) return;
    
    const u = supabaseService.getCurrentUser();
    if (!u) {
        alert("Please login to like this article.");
        return;
    }

    // Optimistic UI update
    const previousLiked = isLiked;
    const previousCount = likesCount;
    
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(newLikedState ? likesCount + 1 : Math.max(0, likesCount - 1));
    
    try {
        const result = await supabaseService.toggleBlogLike(blog.id, u.id);
        // Sync with server source of truth
        setIsLiked(result.liked);
        setLikesCount(result.count);
    } catch(e) {
        console.error("Failed to toggle like", e);
        // Revert on error
        setIsLiked(previousLiked);
        setLikesCount(previousCount);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog || !commentText.trim()) return;

    setSubmittingComment(true);
    try {
        const user = supabaseService.getCurrentUser();
        const userName = user?.username || "Guest Scholar";
        
        const newHelper = await supabaseService.addComment({
            blog_id: blog.id,
            user_name: userName,
            content: commentText.trim()
        });

        setComments([...comments, newHelper]);
        setCommentText('');
    } catch (e) {
        alert("Failed to post comment. Please try again.");
    } finally {
        setSubmittingComment(false);
    }
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
    .filter(b => b.id !== blog!.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const readTime = blog ? calculateReadTime(blog.content) : 5;

  return (
    <article className="min-h-screen bg-white animate-fade-in pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 md:px-0">
        {/* Title Section */}
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 leading-tight mb-6 md:mb-8">
          {blog!.title}
        </h1>

        {/* Author & Meta Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-slate-100 ring-2 ring-white shadow-sm">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(blog!.author)}&background=random`} alt={blog!.author} className="w-full h-full object-cover" />
             </div>
             <div>
               <div className="flex items-center space-x-2">
                 <span className="font-semibold text-slate-900 text-sm md:text-base">{blog!.author}</span>
               </div>
               <div className="flex items-center text-slate-500 text-xs md:text-sm space-x-1">
                  <span>{readTime} min read</span>
                  <span>•</span>
                  <span>{new Date(blog!.date).toLocaleDateString()}</span>
               </div>
             </div>
          </div>
        </div>

        {/* Engagement Bar */}
        <div className="border-y border-slate-100 py-3 mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-6">
               <button 
                 onClick={handleLike}
                 className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 transition-colors group"
               >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'group-hover:text-black'}`} />
                  <span className="text-sm font-medium">{likesCount}</span>
               </button>
               <button 
                  onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                  className="flex items-center space-x-2 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">{comments.length}</span>
               </button>
            </div>
            
            <div className="flex items-center space-x-4 md:space-x-6">
               <button 
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className="text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-slate-900 text-slate-900' : ''}`} />
               </button>
               <button className="text-slate-500 hover:text-slate-900 transition-colors">
                  <PlayCircle className="w-5 h-5" />
               </button>
               <button className="text-slate-500 hover:text-slate-900 transition-colors">
                  <Share2 className="w-5 h-5" />
               </button>
               <button className="text-slate-500 hover:text-slate-900 transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
               </button>
            </div>
        </div>

        {/* Feature Image - Displayed inline */}
        <div className="mb-10 rounded-none md:rounded-lg overflow-hidden relative aspect-video bg-slate-50 w-full">
            <img 
               src={imgError ? fallbackImage : (blog!.image || fallbackImage)} 
               alt={blog!.title} 
               onError={() => setImgError(true)}
               className="w-full h-full object-cover"
            />
        </div>

        {/* Article Content */}
        <div 
          className="prose prose-lg md:prose-xl max-w-none text-slate-800 font-serif
          prose-headings:font-sans prose-headings:font-bold prose-headings:text-slate-900 prose-headings:mb-4
          prose-p:font-serif prose-p:text-lg prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-6
          prose-a:text-green-700 prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-4 prose-blockquote:border-black prose-blockquote:pl-4 prose-blockquote:italic
          prose-strong:font-bold prose-strong:text-slate-900
          prose-img:rounded-md prose-img:shadow-sm prose-img:my-8 prose-img:w-full
          selection:bg-green-100 selection:text-green-900"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

      {/* Comments Sidebar Overlay */}
      {isCommentsOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 z-[60] backdrop-blur-sm transition-opacity"
          onClick={() => setIsCommentsOpen(false)}
        />
      )}

      {/* Comments Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out ${isCommentsOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-bold font-sans text-slate-900">Responses ({comments.length})</h3>
             <button 
               onClick={() => setIsCommentsOpen(false)}
               className="p-2 hover:bg-slate-100 rounded-full transition-colors"
             >
               <X className="w-5 h-5 text-slate-500" />
             </button>
          </div>
          
          {/* User Profile / Input Area */}
          <div className="mb-8 p-4 bg-slate-50 rounded-xl">
             <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">
                   You
                </div>
                <span className="text-sm font-medium text-slate-900">Guest Scholar</span>
             </div>
             
             <form onSubmit={handleCommentSubmit}>
                <textarea 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="What are your thoughts?"
                    className="w-full bg-transparent border-none focus:ring-0 outline-none resize-none placeholder:text-slate-400 font-serif text-slate-700 min-h-[100px]"
                />
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200/50">
                    <div className="flex space-x-2">
                       <button type="button" className="p-1 hover:text-slate-900 text-slate-400 text-xs font-serif italic">B</button>
                       <button type="button" className="p-1 hover:text-slate-900 text-slate-400 text-xs font-serif italic">i</button>
                    </div>
                    <div className="flex space-x-3 items-center">
                        <button 
                            type="button"
                            onClick={() => setCommentText('')} 
                            className="text-sm text-slate-500 hover:text-slate-900"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={!commentText.trim() || submittingComment}
                            className="bg-green-600 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Respond
                        </button>
                    </div>
                </div>
             </form>
          </div>

          <div className="space-y-6">
               <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">Most Relevant</span>
               </div>

                {comments.length === 0 ? (
                    <div className="text-center py-10">
                        <MessageCircle className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-500 italic font-serif">No responses yet.</p>
                    </div>
                ) : (
                    comments.map((comment, idx) => (
                        <div key={comment.id || idx} className="border-b border-slate-100 last:border-0 pb-6 last:pb-0">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                                    <User className="w-4 h-4 text-slate-500" />
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2">
                                       <span className="font-semibold text-slate-900 text-sm">{comment.user_name}</span>
                                    </div>
                                    <span className="text-xs text-slate-400">{new Date(comment.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <p className="text-slate-700 font-serif leading-relaxed text-sm pl-11 mb-3">{comment.content}</p>
                            
                            <div className="pl-11 flex items-center space-x-4">
                               <button className="flex items-center space-x-1 text-slate-400 hover:text-slate-900 text-xs">
                                  <Heart className="w-3.5 h-3.5" />
                                  <span>0</span>
                               </button>
                               <button className="text-slate-400 hover:text-slate-900 text-xs hover:underline">
                                  Reply
                               </button>
                            </div>
                        </div>
                    ))
                )}
          </div>
        </div>
      </div>

        {/* Article Footer Tags / Engagement again? */}
        <div className="mt-12 pt-8 border-t border-slate-100 bg-slate-50 -mx-4 px-4 md:-mx-0 md:bg-transparent md:px-0 rounded-xl">
           <h4 className="font-bold text-slate-900 mb-4 uppercase tracking-widest text-xs">Recommended Analysis</h4>
           <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {recommendedBlogs.map((b) => (
                 <div key={b.id} className="group cursor-pointer flex gap-4 items-start" onClick={() => {
                    openBlog ? openBlog(b) : navigate(`/blogs/${b.id}`);
                    window.scrollTo(0, 0);
                 }}>
                     <div className="w-24 h-16 rounded md:rounded-lg overflow-hidden shrink-0">
                         <img src={b.image || fallbackImage} alt={b.title} className="w-full h-full object-cover" />
                     </div>
                     <div>
                        <h5 className="font-bold text-sm md:text-base text-slate-900 group-hover:underline line-clamp-2">{b.title}</h5>
                        <p className="text-xs text-slate-500 mt-1">{b.author} • {new Date(b.date).toLocaleDateString()}</p>
                     </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </article>
  );
};

export default BlogDetail;
