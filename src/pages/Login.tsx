
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
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
