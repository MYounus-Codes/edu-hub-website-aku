
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { supabaseService } from '../services/supabaseService';
import { LogOut, Menu, X, BookOpen, User as UserIcon, Sparkles, ChevronDown, LayoutDashboard, CheckCircle2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavbarProps {
  user: User | null;
  onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLoginClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    supabaseService.logout();
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Grade 9', path: '/grade-9' },
    { label: 'Grade 10', path: '/grade-10' },
    { label: 'Insights', path: '/blogs' },
    { 
      label: 'Services', 
      path: '#',
      dropdown: [
        { label: 'MCQs Generator', path: '/mcq-generator' },
        { label: 'My Todos', path: '/todos' },
        { label: 'Coming Soon', path: '#' }
      ]
    },
    { label: 'AI Assistant', path: '/ai-assistant', icon: true },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ label: 'Console', path: '/admin' });
  }

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
    setActiveDropdown(null);
    window.scrollTo(0, 0);
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    if (path === '#' || !path) return false;
    return location.pathname.startsWith(path);
  };

  const isDropdownActive = (dropdownItems: { path: string }[] | undefined) => {
    if (!dropdownItems) return false;
    return dropdownItems.some(item => item.path !== '#' && location.pathname.startsWith(item.path));
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'py-2 glass shadow-sm' : 'py-3 bg-white border-b border-slate-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer group"
            onClick={() => handleNavigation('/')}
          >
            <div className="bg-univet-blue p-2 rounded-lg shadow-lg shadow-blue-900/10 group-hover:bg-univet-gold transition-colors">
              <BookOpen className="w-5 h-5 text-white group-hover:text-univet-blue" />
            </div>
            <div className="hidden sm:block">
              <span className="block text-lg font-serif font-black tracking-tight text-univet-blue">Prime Students</span>
              <span className="block text-[8px] uppercase font-bold tracking-[0.2em] text-univet-gold leading-none">Scholarly Portal</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group">
                <button
                  onClick={() => !link.dropdown && handleNavigation(link.path)}
                  className={`text-sm font-bold transition-colors relative flex items-center ${link.icon ? 'text-blue-600' : isActive(link.path) || isDropdownActive(link.dropdown) || (link.dropdown && activeDropdown === link.label) ? 'text-univet-blue' : 'text-slate-600 hover:text-univet-blue'}`}
                  onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
                  onMouseLeave={() => link.dropdown && setActiveDropdown(null)}
                >
                  {link.icon && <Sparkles className="w-3 h-3 mr-1.5 text-univet-gold" />}
                  {link.label}
                  {link.dropdown && <ChevronDown className="w-4 h-4 ml-1" />}
                  <span className={`absolute -bottom-1 left-0 h-0.5 transition-all group-hover:w-full ${isActive(link.path) || isDropdownActive(link.dropdown) ? 'w-full' : 'w-0'} ${link.icon ? 'bg-blue-600' : 'bg-univet-gold'}`}></span>
                </button>

                {/* Dropdown Menu */}
                {link.dropdown && (
                  <div 
                    className={`absolute top-full left-0 w-48 pt-2 transition-all duration-200 ${activeDropdown === link.label ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-1">
                      {link.dropdown.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => handleNavigation(item.path)}
                          className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-univet-blue hover:bg-slate-50 transition-colors flex items-center"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {user ? (
              <div className="relative border-l border-slate-200 pl-6 ml-6">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${isUserMenuOpen ? 'bg-univet-blue border-univet-blue text-white shadow-lg ring-2 ring-blue-100' : 'bg-white border-slate-200 text-slate-600 hover:border-univet-blue hover:text-univet-blue'}`}
                >
                  <UserIcon className="w-5 h-5" />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsUserMenuOpen(false)}></div>
                    <div className="absolute top-full right-0 mt-4 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 overflow-hidden animate-reveal z-50">
                      <div className="px-4 py-3 border-b border-slate-50 mb-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                        <p className="text-sm font-black text-univet-blue truncate">{user.username}</p>
                      </div>
                      
                      <button 
                        onClick={() => { navigate('/dashboard'); setIsUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-3 text-sm font-bold text-slate-600 hover:text-univet-blue hover:bg-slate-50 rounded-xl transition-colors flex items-center"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-3" />
                        My Learning
                      </button>

                      <button 
                        onClick={() => { navigate('/todos'); setIsUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-3 text-sm font-bold text-slate-600 hover:text-univet-blue hover:bg-slate-50 rounded-xl transition-colors flex items-center"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-3" />
                        Task List
                      </button>

                      <button 
                        onClick={() => { handleLogout(); setIsUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-colors flex items-center mt-1"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="bg-univet-blue text-white px-8 py-3 rounded-xl font-bold text-sm transition-all hover:bg-univet-gold hover:text-univet-blue shadow-lg shadow-blue-900/10 active:scale-95"
              >
                Member Access
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass border-t border-slate-100 p-6 space-y-4 animate-reveal">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavigation(link.path)}
              className={`block w-full text-left py-3 text-lg font-bold flex items-center ${link.icon ? 'text-blue-600' : 'text-slate-700 hover:text-univet-blue'} ${isActive(link.path) && !link.icon ? 'text-univet-blue bg-slate-50 pl-4 rounded-lg' : ''}`}
            >
              {link.icon && <Sparkles className="w-4 h-4 mr-2" />}
              {link.label}
            </button>
          ))}
          {!user && (
            <button
              onClick={() => {
                onLoginClick();
                setIsMenuOpen(false);
              }}
              className="w-full bg-univet-blue text-white py-4 rounded-xl font-bold mt-4"
            >
              Sign In
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
