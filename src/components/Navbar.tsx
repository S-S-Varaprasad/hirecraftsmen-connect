
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, Briefcase, PlusCircle, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import UserProfile from './UserProfile';
import { NotificationBell } from '@/components/NotificationBell';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 transition-all hover:opacity-80"
          >
            <span className="text-primary font-bold text-xl md:text-2xl tracking-tight">
              HireEase
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/workers" className="px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              Find Workers
            </Link>
            <Link to="/jobs" className="px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              Browse Jobs
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/post-job" className="px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                  <span className="flex items-center gap-1">
                    <PlusCircle className="h-4 w-4" />
                    Post Job
                  </span>
                </Link>
                <Link to="/worker-job-history" className="px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                  <span className="flex items-center gap-1">
                    <History className="h-4 w-4" />
                    Job History
                  </span>
                </Link>
              </>
            )}
            <Link to="/about" className="px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              About
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <UserProfile />
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
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

      {/* Mobile Menu */}
      <div 
        className={`
          md:hidden fixed inset-0 bg-white dark:bg-gray-900 z-40 transition-transform duration-300 ease-in-out transform
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{ top: '64px' }}
      >
        <div className="px-4 pt-4 pb-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Link to="/workers" className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center transition-all-gpu hover:shadow-md">
              <Briefcase className="h-6 w-6 mb-2 text-primary" />
              <span className="text-sm font-medium">Find Workers</span>
            </Link>
            <Link to="/jobs" className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center transition-all-gpu hover:shadow-md">
              <User className="h-6 w-6 mb-2 text-primary" />
              <span className="text-sm font-medium">Browse Jobs</span>
            </Link>
          </div>
          
          {isAuthenticated && (
            <>
              <Link to="/post-job" className="block w-full py-3 px-4 rounded-md text-center font-medium text-white bg-green-600 hover:bg-green-700 transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="flex items-center justify-center gap-2">
                  <PlusCircle className="h-5 w-5" />
                  Post a New Job
                </span>
              </Link>
              <Link to="/worker-job-history" className="block w-full py-3 px-4 rounded-md text-center font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="flex items-center justify-center gap-2">
                  <History className="h-5 w-5" />
                  View Job History
                </span>
              </Link>
            </>
          )}
          
          <div className="space-y-2">
            {isAuthenticated ? (
              <div className="py-3 px-4 rounded-md text-center font-medium bg-gray-50 dark:bg-gray-800 mb-4">
                <UserProfile />
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block w-full py-3 px-4 rounded-md text-center font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className="block w-full py-3 px-4 rounded-md text-center font-medium text-white bg-primary hover:bg-primary/90 transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
            <Link 
              to="/join-as-worker" 
              className="block w-full py-3 px-4 rounded-md text-center font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Join as a Worker
            </Link>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
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
