
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, Briefcase, PlusCircle, History, Sun, Moon, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import UserProfile from './UserProfile';
import { NotificationBell } from '@/components/NotificationBell';
import { Toggle } from '@/components/ui/toggle';
import { useTheme } from '@/components/theme-provider';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass backdrop-blur-md border-b border-white/10 dark:border-gray-800/80 shadow-md' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 transition-all hover:opacity-90"
          >
            <span className="bg-gradient-to-r from-primary via-blue-500 to-indigo-600 bg-clip-text text-transparent font-bold text-xl md:text-2xl tracking-tight">
              HireEase
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/workers" className="relative px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/70 transition-all group">
              <span className="relative z-10">Find Workers</span>
              <span className="absolute inset-0 rounded-md bg-gray-100/0 dark:bg-gray-800/0 transition-colors duration-300 group-hover:bg-gray-100/50 dark:group-hover:bg-gray-800/50"></span>
            </Link>
            <Link to="/jobs" className="relative px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/70 transition-all group">
              <span className="relative z-10">Browse Jobs</span>
              <span className="absolute inset-0 rounded-md bg-gray-100/0 dark:bg-gray-800/0 transition-colors duration-300 group-hover:bg-gray-100/50 dark:group-hover:bg-gray-800/50"></span>
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/post-job" className="relative px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/70 transition-all group">
                  <span className="relative z-10 flex items-center gap-1">
                    <PlusCircle className="h-4 w-4" />
                    Post Job
                  </span>
                  <span className="absolute inset-0 rounded-md bg-gray-100/0 dark:bg-gray-800/0 transition-colors duration-300 group-hover:bg-gray-100/50 dark:group-hover:bg-gray-800/50"></span>
                </Link>
                <Link to="/worker-job-history" className="relative px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/70 transition-all group">
                  <span className="relative z-10 flex items-center gap-1">
                    <History className="h-4 w-4" />
                    Job History
                  </span>
                  <span className="absolute inset-0 rounded-md bg-gray-100/0 dark:bg-gray-800/0 transition-colors duration-300 group-hover:bg-gray-100/50 dark:group-hover:bg-gray-800/50"></span>
                </Link>
              </>
            )}
            <Link to="/about" className="relative px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/70 transition-all group">
              <span className="relative z-10">About</span>
              <span className="absolute inset-0 rounded-md bg-gray-100/0 dark:bg-gray-800/0 transition-colors duration-300 group-hover:bg-gray-100/50 dark:group-hover:bg-gray-800/50"></span>
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Toggle 
              variant="outline" 
              size="sm" 
              className="border-0 bg-gray-100/50 dark:bg-gray-800/70 rounded-full w-9 h-9 p-0 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 transition-colors"
              pressed={theme === 'dark'} 
              onPressedChange={toggleTheme}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Toggle>
            
            {isAuthenticated ? (
              <UserProfile />
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="hover:bg-gray-100/50 dark:hover:bg-gray-800/70">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button 
                    variant="default" 
                    size="sm"
                    className="bg-gradient-to-r from-primary to-blue-500 hover:opacity-90 transition-opacity shadow-sm"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <Toggle 
              variant="outline" 
              size="sm" 
              className="border-0 bg-gray-100/50 dark:bg-gray-800/70 rounded-full w-8 h-8 p-0"
              pressed={theme === 'dark'} 
              onPressedChange={toggleTheme}
            >
              {theme === 'dark' ? (
                <Sun className="h-3.5 w-3.5" />
              ) : (
                <Moon className="h-3.5 w-3.5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Toggle>
          
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/70 transition-all"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">{isMobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`
          md:hidden fixed inset-0 glass backdrop-blur-md z-40 transition-transform duration-300 ease-in-out transform
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{ top: '64px' }}
      >
        <div className="px-4 pt-4 pb-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Link to="/workers" className="flex flex-col items-center p-4 bg-white/10 dark:bg-gray-800/50 rounded-lg text-center transition-all hover:shadow-md">
              <Briefcase className="h-6 w-6 mb-2 text-primary" />
              <span className="text-sm font-medium">Find Workers</span>
            </Link>
            <Link to="/jobs" className="flex flex-col items-center p-4 bg-white/10 dark:bg-gray-800/50 rounded-lg text-center transition-all hover:shadow-md">
              <User className="h-6 w-6 mb-2 text-primary" />
              <span className="text-sm font-medium">Browse Jobs</span>
            </Link>
          </div>
          
          {isAuthenticated && (
            <>
              <Link to="/post-job" className="block w-full py-3 px-4 rounded-md text-center font-medium text-white bg-gradient-to-r from-green-600 to-green-500 hover:opacity-90 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="flex items-center justify-center gap-2">
                  <PlusCircle className="h-5 w-5" />
                  Post a New Job
                </span>
              </Link>
              <Link to="/worker-job-history" className="block w-full py-3 px-4 rounded-md text-center font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:opacity-90 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="flex items-center justify-center gap-2">
                  <History className="h-5 w-5" />
                  View Job History
                </span>
              </Link>
            </>
          )}
          
          <div className="space-y-2">
            {isAuthenticated ? (
              <div className="py-3 px-4 rounded-md text-center font-medium bg-white/5 dark:bg-gray-800/30 backdrop-blur-sm mb-4">
                <UserProfile />
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block w-full py-3 px-4 rounded-md text-center font-medium text-gray-700 dark:text-gray-200 bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm hover:bg-white/20 dark:hover:bg-gray-700/50 transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link 
                  to="/signup" 
                  className="block w-full py-3 px-4 rounded-md text-center font-medium text-white bg-gradient-to-r from-primary to-blue-500 hover:opacity-90 transition-opacity"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
            <Link 
              to="/join-as-worker" 
              className="block w-full py-3 px-4 rounded-md text-center font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:opacity-90 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Join as a Worker
            </Link>
          </div>

          <div className="pt-6 border-t border-white/10 dark:border-gray-700/30">
            <Link 
              to="/about" 
              className="block py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="block py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
