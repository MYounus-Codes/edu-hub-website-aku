
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Blog } from '../types';
import { ArrowRight } from 'lucide-react';

interface BlogsProps {
  blogs: Blog[];
}

const Blogs: React.FC<BlogsProps> = ({ blogs }) => {
  const navigate = useNavigate();
  const blogFallback = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200";

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-black mb-6 md:mb-8 text-univet-blue text-center">The Scholarly Feed</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {blogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-xl transition-all animate-reveal">
            <div className="h-32 md:h-40 w-full overflow-hidden bg-slate-100">
                <img src={blog.image || blogFallback} className="h-full w-full object-cover" alt="" />
            </div>
            <div className="p-4 md:p-6 flex-1 flex flex-col">
                <h3 className="text-base md:text-lg font-black mb-2 md:mb-3 text-univet-blue line-clamp-2">{blog.title}</h3>
                <p className="text-slate-500 font-semibold mb-4 line-clamp-3 text-xs leading-relaxed">{blog.content.replace(/[#*]/g, '').substring(0, 160)}...</p>
                <button onClick={() => navigate(`/blogs/${blog.id}`)} className="mt-auto bg-univet-blue text-white py-2 md:py-3 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-univet-gold hover:text-univet-blue transition-all">
                Read Analysis
                </button>
            </div>
            </div>
        ))}
        </div>
    </div>
  );
};
export default Blogs;
