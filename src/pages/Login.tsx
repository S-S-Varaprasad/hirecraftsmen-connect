
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeField, setActiveField] = useState<'email' | 'password' | null>(null);
  const { signIn, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error(error.message || 'Login failed. Please check your credentials.');
      } else {
        toast.success('Successfully logged in!');
      }
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFocus = (field: 'email' | 'password') => {
    setActiveField(field);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50/80 to-white">
      <Navbar />
      
      <main className="flex-grow pt-16 md:pt-24 flex items-center justify-center">
        <div className="container max-w-md mx-auto px-4 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-3d overflow-hidden transform transition-all hover:translate-y-[-5px]">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-block p-3 rounded-full bg-app-blue/5 mb-4">
                  <Mail className="h-8 w-8 text-app-blue" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 gradient-text bg-gradient-to-r from-app-blue to-app-teal">Welcome Back</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Sign in to continue to HireEase
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-app-blue" />
                    Email Address
                  </label>
                  <div className={`relative transition-all duration-300 ${activeField === 'email' ? 'scale-[1.02]' : ''}`}>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className={`h-5 w-5 transition-colors duration-300 ${activeField === 'email' ? 'text-app-blue' : 'text-gray-400'}`} />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className={`pl-10 transition-all duration-300 ${activeField === 'email' ? 'border-app-blue ring-1 ring-app-blue/30' : ''}`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => handleFocus('email')}
                      onBlur={handleBlur}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <Lock className="h-3.5 w-3.5 text-app-blue" />
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-sm font-medium text-app-blue hover:text-app-blue/80 hover:underline transition-colors">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className={`relative transition-all duration-300 ${activeField === 'password' ? 'scale-[1.02]' : ''}`}>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className={`h-5 w-5 transition-colors duration-300 ${activeField === 'password' ? 'text-app-blue' : 'text-gray-400'}`} />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`pl-10 pr-10 transition-all duration-300 ${activeField === 'password' ? 'border-app-blue ring-1 ring-app-blue/30' : ''}`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => handleFocus('password')}
                      onBlur={handleBlur}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 hover:text-app-blue transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-app-blue transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-app-blue transition-colors" />
                      )}
                    </button>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  variant="blue"
                  className="w-full mt-2 py-6 group transition-all duration-300 shadow-md hover:shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin mr-2 h-5 w-5 border-2 border-b-transparent rounded-full"></div>
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="mr-1">Sign In</span>
                      <ArrowRight className="h-5 w-5 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  )}
                </Button>
              </form>
              
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-medium text-app-blue hover:text-app-blue/80 transition-colors hover:underline">
                    Sign Up
                  </Link>
                </p>
              </div>
              
              <div className="relative mt-8 pt-8 text-center">
                <div className="absolute top-0 left-0 right-0 flex items-center justify-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                  <div className="px-4 bg-white dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">or</div>
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                
                <div className="mt-4 flex flex-col space-y-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full flex items-center justify-center py-5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continue with Google
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
