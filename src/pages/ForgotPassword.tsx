
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        toast.error(error.message || 'Failed to send reset password email.');
      } else {
        setIsEmailSent(true);
        toast.success('Reset password email sent. Please check your inbox.');
      }
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 gradient-text bg-gradient-to-r from-app-blue to-app-teal">Reset Your Password</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  {isEmailSent 
                    ? 'We have sent a password reset link to your email address.' 
                    : 'Enter your email address to receive a password reset link.'}
                </p>
              </div>
              
              {!isEmailSent ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-app-blue" />
                      Email Address
                    </label>
                    <div className="relative transition-all duration-300">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    variant="blue"
                    className="w-full py-6 group transition-all duration-300 shadow-md hover:shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin mr-2 h-5 w-5 border-2 border-b-transparent rounded-full"></div>
                        <span>Sending Reset Link...</span>
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center mt-6">
                  <div className="bg-green-50 rounded-lg p-4 mb-6 border border-green-100">
                    <p className="text-green-800 dark:text-green-400 mb-2">
                      <span className="font-semibold">Reset link sent!</span> Please check your email for a link to reset your password.
                    </p>
                    <p className="text-sm text-gray-600">
                      If it doesn't appear within a few minutes, check your spam folder or try another email address.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-2"
                    onClick={() => setIsEmailSent(false)}
                  >
                    Try Another Email
                  </Button>
                </div>
              )}
              
              <div className="mt-8 text-center">
                <Link to="/login" className="inline-flex items-center text-sm font-medium text-app-blue hover:text-app-blue/80 transition-colors hover:underline">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ForgotPassword;
