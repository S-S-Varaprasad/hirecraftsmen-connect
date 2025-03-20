
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, Briefcase, PlusCircle, History, Tool, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import UserProfile from './UserProfile';
import { NotificationBell } from '@/components/NotificationBell';
import { useTheme } from '@/components/theme-provider';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from '@/lib/utils';

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
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm' 
          : 'bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 transition-all hover:opacity-80"
          >
            <div className="bg-gradient-to-r from-primary to-blue-500 rounded-full p-1.5 mr-1.5">
              <Tool className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent font-bold text-xl md:text-2xl tracking-tight">
              HireEase
            </span>
          </Link>

          {/* Desktop Navigation using Navigation Menu */}
          <div className="hidden md:flex items-center">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/workers" className={navigationMenuTriggerStyle()}>
                    Find Workers
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/jobs" className={navigationMenuTriggerStyle()}>
                    Browse Jobs
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {[
                        { title: "Carpenter", description: "Skilled woodworking professionals", icon: "🪚", href: "/workers/by-category/carpenter" },
                        { title: "Plumber", description: "Expert plumbing solutions", icon: "🔧", href: "/workers/by-category/plumber" },
                        { title: "Electrician", description: "Certified electrical specialists", icon: "⚡", href: "/workers/by-category/electrician" },
                        { title: "Painter", description: "Professional painting services", icon: "🖌️", href: "/workers/by-category/painter" },
                        { title: "Cleaner", description: "Home and office cleaning", icon: "✨", href: "/workers/by-category/cleaner" },
                        { title: "All Services", description: "Browse all available services", icon: "📋", href: "/workers" },
                      ].map((service) => (
                        <li key={service.title}>
                          <NavigationMenuLink asChild>
                            <Link 
                              to={service.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{service.icon}</span>
                                <div>
                                  <div className="text-sm font-medium leading-none">{service.title}</div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                    {service.description}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                {isAuthenticated && (
                  <>
                    <NavigationMenuItem>
                      <Link to="/post-job" className={navigationMenuTriggerStyle()}>
                        <span className="flex items-center gap-1">
                          <PlusCircle className="h-4 w-4" />
                          Post Job
                        </span>
                      </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <Link to="/worker-job-history" className={navigationMenuTriggerStyle()}>
                        <span className="flex items-center gap-1">
                          <History className="h-4 w-4" />
                          Job History
                        </span>
                      </Link>
                    </NavigationMenuItem>
                  </>
                )}
                <NavigationMenuItem>
                  <Link to="/about" className={navigationMenuTriggerStyle()}>
                    About
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <NotificationBell />
                <UserProfile />
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="blue" size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="rounded-full"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
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
          md:hidden fixed inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md z-40 transition-transform duration-300 ease-in-out transform
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{ top: '64px' }}
      >
        <div className="px-4 pt-4 pb-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Link to="/workers" className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center transition-all hover:shadow-md">
              <Briefcase className="h-6 w-6 mb-2 text-primary" />
              <span className="text-sm font-medium">Find Workers</span>
            </Link>
            <Link to="/jobs" className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center transition-all hover:shadow-md">
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
