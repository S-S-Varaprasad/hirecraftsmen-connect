import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hashExists, setHashExists] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have the access token in the URL which indicates a valid reset password request
    const hash = window.location.hash;
    console.log('URL hash:', hash);
    
    // Try to parse the hash to see if it contains a valid access token
    // The hash format is typically #access_token=xxx&refresh_token=xxx&...
    const params = new URLSearchParams(hash.replace('#', ''));
    const accessToken = params.get('access_token');
    
    if (!accessToken) {
      console.error('No access token found in URL hash');
      toast.error('Invalid or expired password reset link');
      // Don't redirect immediately, allow user to see the toast
      setTimeout(() => navigate('/forgot-password'), 3000);
    } else {
      // If we have an access token in the URL, we need to set the session
      // This is crucial for the password update to work
      try {
        // Set the session with the access token from the URL
        const { data, error } = supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: params.get('refresh_token') || '',
        });
        
        if (error) {
          console.error('Error setting session:', error);
          toast.error('Invalid or expired reset token');
          setTimeout(() => navigate('/forgot-password'), 3000);
        } else {
          console.log('Session set successfully');
          setHashExists(true);
        }
      } catch (err) {
        console.error('Exception when setting session:', err);
        toast.error('An error occurred while processing your reset link');
        setTimeout(() => navigate('/forgot-password'), 3000);
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        throw error;
      }
      
      toast.success('Password has been reset successfully');
      // Wait a bit before redirecting to ensure the user sees the success message
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (!hashExists) {
    return (
      <div className="min-h-screen flex flex-col app-page-background">
        <Navbar />
        <main className="flex-grow pt-24 flex items-center justify-center">
          <div className="container max-w-md mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-2">Invalid Reset Link</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  This password reset link is invalid or has expired.
                </p>
                <Button onClick={() => navigate('/forgot-password')} className="mt-4">
                  Request New Reset Link
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col app-page-background">
      <Navbar />
      
      <main className="flex-grow pt-24 flex items-center justify-center">
        <div className="container max-w-md mx-auto px-4 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Set New Password</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Create a new password for your account
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                      Updating Password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResetPassword;
