import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Todo } from '../types';
import { supabaseService } from '../services/supabaseService';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Calendar, 
  ListTodo,
  AlertCircle,
  Clock,
  Layout
} from 'lucide-react';

interface TodoAppProps {
  user: User | null;
}

const TodoApp: React.FC<TodoAppProps> = ({ user }) => {
  const navigate = useNavigate();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskTag, setNewTaskTag] = useState<Todo['tag']>('Study');
  const [error, setError] = useState<string | null>(null);

  // Expose reload method via props or simple ref if needed, but for now simple refresh is fine
  // Or better, move state up. For this request, I'll keep it self contained but hide header if embedding 
  
  useEffect(() => {
    if (user) {
      loadTodos();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadTodos = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await supabaseService.getTodos(user.id);
      setTodos(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load your tasks.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim() || !user) return;

    const newTodo: Omit<Todo, 'id' | 'created_at'> = {
      user_id: user.id,
      text: newTaskText,
      is_completed: false,
      tag: newTaskTag
    };

    try {
      // Optimistic update
      const tempId = Math.random().toString();
      const optimisticTodo = { ...newTodo, id: tempId, created_at: new Date().toISOString() };
      setTodos([optimisticTodo, ...todos]);
      setNewTaskText('');

      const created = await supabaseService.addTodo(newTodo);
      // Replace optimistic
      setTodos(prev => prev.map(t => t.id === tempId ? created : t));
    } catch (err: any) {
      setError(err.message);
      // Revert on error
      loadTodos();
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      setTodos(todos.map(t => t.id === id ? { ...t, is_completed: !currentStatus } : t));
      await supabaseService.toggleTodo(id, !currentStatus);
    } catch (err) {
      loadTodos(); // Revert
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setTodos(todos.filter(t => t.id !== id));
      await supabaseService.deleteTodo(id);
    } catch (err) {
      loadTodos(); // Revert
    }
  };

  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl text-center max-w-lg w-full border border-slate-100">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ListTodo className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-serif font-black text-slate-800 mb-4">Login Required</h2>
          <p className="text-slate-500 font-medium mb-8">
            Features like Task Management require a personal account to save your progress securely.
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => navigate('/')} 
              className="text-slate-500 font-bold hover:text-slate-800 transition-colors"
            >
              Go Home
            </button>
            <button 
              data-login-trigger // We'll need a way to trigger login modal from here, or just tell them to use navbar
              className="bg-univet-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
              onClick={() => {
                // Since we don't have the login trigger prop passed down easily without refactoring App.tsx 
                // extensively, we'll guide them to navbar or use a global event if we had one.
                // For now, simpler:
                alert("Please click the 'Login' button in the top right corner.");
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const completedCount = todos.filter(t => t.is_completed).length;
  const progress = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  const getTagColor = (tag: Todo['tag']) => {
    switch(tag) {
      case 'Urgent': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'Study': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'School': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Personal': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <CheckCircle2 className="w-4 h-4" />
              <span>Productivity Hub</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-black text-slate-800">
              My Objectives
            </h1>
            <p className="text-slate-500 font-medium mt-2">
              Stay focused and track your academic milestones.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6 min-w-[250px]">
            <div className="flex-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Progress</div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-600">
              {progress}%
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-8 mb-8 border border-white">
          <form onSubmit={handleAddTodo} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-emerald-500 focus:outline-none focus:bg-white transition-all text-slate-700 font-bold placeholder:text-slate-400"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={newTaskTag}
                onChange={(e) => setNewTaskTag(e.target.value as Todo['tag'])}
                className="h-14 px-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-emerald-500 focus:outline-none text-slate-600 font-bold cursor-pointer"
              >
                <option value="Study">Study</option>
                <option value="School">School</option>
                <option value="Urgent">Urgent</option>
                <option value="Personal">Personal</option>
              </select>
              <button 
                type="submit"
                disabled={!newTaskText.trim()}
                className="h-14 w-14 md:w-auto md:px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl flex items-center justify-center font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-200"
              >
                <Plus className="w-6 h-6 md:mr-2" />
                <span className="hidden md:inline">Add Task</span>
              </button>
            </div>
          </form>
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}
        </div>

        {/* List Section */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-400 font-bold">Loading your tasks...</p>
            </div>
          ) : todos.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Layout className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">No tasks yet</h3>
              <p className="text-slate-400 font-medium max-w-xs mx-auto">
                Add a task above to start planning your day effectively.
              </p>
            </div>
          ) : (
            todos.map((todo) => (
              <div 
                key={todo.id}
                onClick={() => handleToggle(todo.id, todo.is_completed)}
                className={`group flex items-center p-5 bg-white rounded-2xl border transition-all duration-300 cursor-pointer ${
                  todo.is_completed 
                    ? 'border-slate-100 bg-slate-50/50' 
                    : 'border-slate-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-0.5'
                }`}
              >
                <div className={`
                  flex-shrink-0 w-8 h-8 rounded-full border-2 mr-5 flex items-center justify-center transition-all duration-300
                  ${todo.is_completed 
                    ? 'bg-emerald-500 border-emerald-500 scale-100' 
                    : 'border-slate-300 bg-white group-hover:border-emerald-400'}
                `}>
                  <CheckCircle2 className={`w-5 h-5 text-white transition-all duration-300 ${todo.is_completed ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
                </div>

                <div className="flex-1 min-w-0 mr-4">
                  <p className={`text-lg font-bold transition-all duration-300 truncate ${
                    todo.is_completed ? 'text-slate-400 line-through' : 'text-slate-700'
                  }`}>
                    {todo.text}
                  </p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md border ${getTagColor(todo.tag)}`}>
                      {todo.tag}
                    </span>
                    <span className="flex items-center text-[11px] font-semibold text-slate-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(todo.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={(e) => handleDelete(todo.id, e)}
                  className="flex-shrink-0 p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  title="Delete task"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default TodoApp;
