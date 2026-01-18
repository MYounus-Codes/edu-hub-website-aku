
import { createClient } from '@supabase/supabase-js';
import { Material, Blog, User, Grade, MaterialType, Todo, McqResult, Comment } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = SUPABASE_URL && !SUPABASE_URL.includes('YOUR_SUPABASE_URL') && SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_ANON_KEY');

const supabase = isConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const TABLES = {
  USERS: 'users',
  BLOGS: 'blogs',
  COMMENTS: 'comments',
  BLOG_LIKES: 'blog_likes',
  G9_NOTES: 'grade9_notes',
  G9_PAPERS: 'grade9_pastpapers',
  G10_NOTES: 'grade10_notes',
  G10_PAPERS: 'grade10_pastpapers',
  TODOS: 'todos',
  MCQ_RESULTS: 'mcq_results'
};

const SESSION_KEY = 'akueb_db_session';

const handleSupabaseError = (error: any, context: string) => {
  console.error(`Supabase Error [${context}]:`, error);
  if (error.message?.includes('column "year" does not exist')) {
    return new Error(`DATABASE ERROR: The 'year' column is missing in your pastpaper tables. Please add it via the Supabase SQL Editor: ALTER TABLE grade9_pastpapers ADD COLUMN year TEXT;`);
  }
  if (error.code === '42501') {
    return new Error("PERMISSION DENIED: Supabase RLS policies are blocking this action. Ensure UPDATE/DELETE policies exist for 'anon' role.");
  }
  return new Error(error.message || `An error occurred during ${context}.`);
};

const getTableName = (grade: Grade, type: MaterialType) => {
  if (grade === 'Grade 9') {
    return type === 'Note' ? TABLES.G9_NOTES : TABLES.G9_PAPERS;
  } else {
    return type === 'Note' ? TABLES.G10_NOTES : TABLES.G10_PAPERS;
  }
};

export const supabaseService = {
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },
  
  logout: () => {
    localStorage.removeItem(SESSION_KEY);
    window.location.reload();
  },

  login: async (email: string, password?: string, role: 'admin' | 'user' = 'user'): Promise<User> => {
    // Default Head Admin Backdoor
    if (role === 'admin' && email === 'myounushere@gmail.com' && password === 'MYMoe1122') {
      const adminUser: User = { 
        id: 'head-admin-master', 
        username: 'Head Faculty', 
        email, 
        role: 'admin' 
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(adminUser));
      return adminUser;
    }

    if (!supabase) throw new Error("Supabase is not configured.");

    let query = supabase.from(TABLES.USERS).select('*').eq('email', email).eq('role', role);
    if (password) {
      query = query.eq('password', password);
    }
    
    const { data, error } = await query.maybeSingle();
    if (error) throw handleSupabaseError(error, 'Login');
    if (!data) throw new Error(`Authorized account for "${email}" not found or invalid credentials.`);
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
    return data;
  },

  register: async (username: string, email: string, password?: string, role: 'admin' | 'user' = 'user', secretKey?: string): Promise<User> => {
    if (role === 'admin') {
      if (secretKey !== 'aku-edu-studednts-hub') {
        throw new Error("Invalid Faculty Secret Key. Access denied.");
      }
    }

    if (!supabase) throw new Error("Supabase is not configured.");
    
    const payload: any = { username, email, role };
    if (password) payload.password = password;

    const { data, error } = await supabase.from(TABLES.USERS).insert([payload]).select().maybeSingle();
    if (error) throw handleSupabaseError(error, 'Registration');
    if (!data) throw new Error("Registration failed.");
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
    return data;
  },

  getMaterials: async (grade: Grade, type: MaterialType): Promise<Material[]> => {
    if (!supabase) return [];
    const tableName = getTableName(grade, type);
    const { data, error } = await supabase.from(tableName).select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn(`Fetch failure for ${tableName}:`, error.message);
      return [];
    }
    return (data || []).map((item: any) => ({
      ...item,
      id: String(item.id),
      fileUrl: item.file_url || item.fileUrl,
      fileName: item.file_name || item.fileName,
      year: item.year ? String(item.year) : undefined,
      createdAt: item.created_at || item.createdAt,
      grade,
      type
    }));
  },
  
  addMaterial: async (material: Omit<Material, 'id' | 'createdAt'>): Promise<Material> => {
    if (!supabase) throw new Error("Supabase missing.");
    const tableName = getTableName(material.grade, material.type);
    const payload: any = {
      title: material.title,
      description: material.description,
      subject: material.subject,
      file_url: material.fileUrl,
      file_name: material.fileName || material.title
    };
    if (material.type === 'Past Paper' && material.year) {
      payload.year = material.year;
    }
    const { data, error } = await supabase.from(tableName).insert([payload]).select().maybeSingle();
    if (error) throw handleSupabaseError(error, `Insertion into ${tableName}`);
    return data;
  },

  updateMaterial: async (id: string, material: Omit<Material, 'id' | 'createdAt'>, originalGrade: Grade, originalType: MaterialType): Promise<void> => {
    if (!supabase) throw new Error("Supabase connection lost.");
    const originalTable = getTableName(originalGrade, originalType);
    const newTable = getTableName(material.grade, material.type);

    const payload: any = {
      title: material.title,
      description: material.description,
      subject: material.subject,
      file_url: material.fileUrl,
      file_name: material.fileName || material.title,
      year: material.type === 'Past Paper' ? material.year : null
    };

    if (originalTable === newTable) {
      const { error } = await supabase.from(originalTable).update(payload).eq('id', id);
      if (error) throw handleSupabaseError(error, 'Updating Record');
    } else {
      const { error: delError } = await supabase.from(originalTable).delete().eq('id', id);
      if (delError) throw handleSupabaseError(delError, 'Migration - Old Record Deletion');
      await supabaseService.addMaterial(material);
    }
  },

  deleteMaterial: async (id: string, grade: Grade, type: MaterialType): Promise<void> => {
    if (!supabase) throw new Error("Supabase connection lost.");
    const tableName = getTableName(grade, type);
    const { error } = await supabase.from(tableName).delete().eq('id', id);
    if (error) throw handleSupabaseError(error, `Deletion from ${tableName}`);
  },

  getBlogs: async (): Promise<Blog[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase.from(TABLES.BLOGS).select('*').order('date', { ascending: false });
    if (error) return [];
    return data || [];
  },

  getBlogById: async (id: string): Promise<Blog | null> => {
    if (!supabase) return null;
    const { data, error } = await supabase.from(TABLES.BLOGS).select('*').eq('id', id).maybeSingle();
    if (error) return null;
    return data;
  },

  addBlog: async (blog: Omit<Blog, 'id' | 'date'>): Promise<Blog> => {
    if (!supabase) throw new Error("Supabase missing.");
    const { data, error } = await supabase.from(TABLES.BLOGS).insert([{
      title: blog.title,
      content: blog.content,
      author: blog.author,
      image: blog.image,
      date: new Date().toISOString()
    }]).select().maybeSingle();
    if (error) throw handleSupabaseError(error, 'Blog Archival');
    return data;
  },

  updateBlog: async (id: string, blog: Omit<Blog, 'id' | 'date'>): Promise<void> => {
    if (!supabase) throw new Error("Supabase missing.");
    const { error } = await supabase.from(TABLES.BLOGS).update({
      title: blog.title,
      content: blog.content,
      author: blog.author,
      image: blog.image
    }).eq('id', id);
    if (error) throw handleSupabaseError(error, 'Blog Update');
  },

  deleteBlog: async (id: string): Promise<void> => {
    if (!supabase) throw new Error("Supabase missing.");
    const { error } = await supabase.from(TABLES.BLOGS).delete().eq('id', id);
    if (error) throw handleSupabaseError(error, 'Blog Deletion');
  },

  // Comment Methods
  getComments: async (blogId: string): Promise<Comment[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from(TABLES.COMMENTS)
      .select('*')
      .eq('blog_id', blogId)
      .order('created_at', { ascending: true }); // Oldest first
    if (error) {
      console.warn("Error fetching comments:", error.message);
      return [];
    }
    return data || [];
  },

  addComment: async (comment: { blog_id: string; user_name: string; content: string }): Promise<Comment> => {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase
      .from(TABLES.COMMENTS)
      .insert([comment])
      .select()
      .single();
    if (error) throw handleSupabaseError(error, 'Add Comment');
    return data;
  },

  // Like Methods
  hasUserLikedBlog: async (blogId: string, userId: string): Promise<boolean> => {
     if (!supabase) return false;
     const { data } = await supabase
       .from(TABLES.BLOG_LIKES)
       .select('id')
       .eq('blog_id', blogId)
       .eq('user_id', userId)
       .maybeSingle();
     return !!data;
  },

  toggleBlogLike: async (blogId: string, userId: string): Promise<{ liked: boolean, count: number }> => {
    if (!supabase) throw new Error("Supabase is not configured.");
    
    // Check if liked
    const hasLiked = await supabaseService.hasUserLikedBlog(blogId, userId);
    
    // Get current count
    const blog = await supabaseService.getBlogById(blogId);
    let currentCount = blog?.likes || 0;

    if (hasLiked) {
       // Unlike
       await supabase.from(TABLES.BLOG_LIKES).delete().eq('blog_id', blogId).eq('user_id', userId);
       currentCount = Math.max(0, currentCount - 1);
    } else {
       // Like
       await supabase.from(TABLES.BLOG_LIKES).insert([{ blog_id: blogId, user_id: userId }]);
       currentCount = currentCount + 1;
    }

    // Update blog count
    await supabase.from(TABLES.BLOGS).update({ likes: currentCount }).eq('id', blogId);
    
    return { liked: !hasLiked, count: currentCount };
  },

  updateBlogLikes: async (blogId: string, newLikesCount: number): Promise<void> => {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { error } = await supabase
      .from(TABLES.BLOGS)
      .update({ likes: newLikesCount })
      .eq('id', blogId);
    if (error) throw handleSupabaseError(error, 'Update Likes');
  },

  // Todo Methods
  getTodos: async (userId: string): Promise<Todo[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from(TABLES.TODOS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }); // Show newest first
    
    if (error) {
       console.error("Error fetching todos:", error);
       // Return empty array instead of throwing to prevent app crash if table is missing
       return []; 
    }
    return data || [];
  },

  addTodo: async (todo: Omit<Todo, 'id' | 'created_at'>): Promise<Todo> => {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase
      .from(TABLES.TODOS)
      .insert([todo])
      .select()
      .single();
    if (error) throw handleSupabaseError(error, 'Add Todo');
    return data;
  },

  toggleTodo: async (id: string, is_completed: boolean): Promise<void> => {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { error } = await supabase
      .from(TABLES.TODOS)
      .update({ is_completed })
      .eq('id', id);
    if (error) throw handleSupabaseError(error, 'Toggle Todo');
  },

  deleteTodo: async (id: string): Promise<void> => {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { error } = await supabase
      .from(TABLES.TODOS)
      .delete()
      .eq('id', id);
    if (error) throw handleSupabaseError(error, 'Delete Todo');
  },

  // MCQ Result Methods
  getMcqResults: async (userId: string): Promise<McqResult[]> => {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from(TABLES.MCQ_RESULTS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
       console.warn("Error fetching mcq results:", error.message);
       return [];
    }
    return data || [];
  },

  addMcqResult: async (result: Omit<McqResult, 'id' | 'created_at'>): Promise<McqResult> => {
    if (!supabase) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase
      .from(TABLES.MCQ_RESULTS)
      .insert([result])
      .select()
      .single();
    if (error) throw handleSupabaseError(error, 'Save Quiz Result');
    return data;
  }
};
