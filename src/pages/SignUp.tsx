
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, Mail, Phone, Briefcase, UserPlus, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user'); // Default to general user
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const { signUp, isAuthenticated } = useAuth();

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);

    try {
      const { error } = await signUp(email, password, name, phone, role);
      
      if (error) {
        toast.error(error.message || 'Registration failed. Please try again.');
      } else {
        toast.success('Account created successfully! Please check your email to confirm your account.');
        
        // Suggest next steps based on role
        if (role === 'worker') {
          toast.info('Complete your worker profile to start receiving job offers', {
            action: {
              label: 'Create Profile',
              onClick: () => window.location.href = '/join-as-worker'
            }
          });
        } else if (role === 'employer') {
          toast.info('Start hiring workers by posting a job', {
            action: {
              label: 'Post Job',
              onClick: () => window.location.href = '/post-job'
            }
          });
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFocus = (field: string) => {
    setActiveField(field);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  const calculatePasswordStrength = (password: string): { strength: number, text: string, color: string } => {
    if (!password) return { strength: 0, text: '', color: 'bg-gray-200' };
    
    let strength = 0;
    let checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };
    
    // Count passed checks
    Object.values(checks).forEach(passed => {
      if (passed) strength += 25;
    });
    
    // Determine text and color based on strength
    let text = '';
    let color = '';
    
    if (strength <= 25) {
      text = 'Weak';
      color = 'bg-red-500';
    } else if (strength <= 50) {
      text = 'Fair';
      color = 'bg-orange-500';
    } else if (strength <= 75) {
      text = 'Good';
      color = 'bg-yellow-500';
    } else {
      text = 'Strong';
      color = 'bg-green-500';
    }
    
    return { strength, text, color };
  };

  const { strength, text, color } = calculatePasswordStrength(password);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50/80 to-white">
      <Navbar />
      
      <main className="flex-grow bg-transparent pt-16 md:pt-20 flex items-center justify-center">
        <div className="container max-w-lg mx-auto px-4 py-6 md:py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-3d overflow-hidden transform transition-all hover:translate-y-[-5px]">
            <div className="p-6 md:p-8">
              <div className="text-center mb-6">
                <div className="inline-block p-3 rounded-full bg-app-blue/5 mb-4">
                  <UserPlus className="h-8 w-8 text-app-blue" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 gradient-text bg-gradient-to-r from-app-blue to-app-teal">Create Your Account</h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Join HireEase and connect with skilled professionals
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-app-blue" />
                    Full Name
                  </label>
                  <div className={`relative transition-all duration-300 ${activeField === 'name' ? 'scale-[1.01]' : ''}`}>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <User className={`h-5 w-5 transition-colors duration-300 ${activeField === 'name' ? 'text-app-blue' : 'text-gray-400'}`} />
                    </div>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      className={`pl-10 transition-all duration-300 ${activeField === 'name' ? 'border-app-blue ring-1 ring-app-blue/30' : ''}`}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => handleFocus('name')}
                      onBlur={handleBlur}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-app-blue" />
                    Email Address
                  </label>
                  <div className={`relative transition-all duration-300 ${activeField === 'email' ? 'scale-[1.01]' : ''}`}>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className={`h-5 w-5 transition-colors duration-300 ${activeField === 'email' ? 'text-app-blue' : 'text-gray-400'}`} />
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
                  <label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-app-blue" />
                    Phone Number
                  </label>
                  <div className={`relative transition-all duration-300 ${activeField === 'phone' ? 'scale-[1.01]' : ''}`}>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Phone className={`h-5 w-5 transition-colors duration-300 ${activeField === 'phone' ? 'text-app-blue' : 'text-gray-400'}`} />
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 9876543210"
                      className={`pl-10 transition-all duration-300 ${activeField === 'phone' ? 'border-app-blue ring-1 ring-app-blue/30' : ''}`}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onFocus={() => handleFocus('phone')}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5 text-app-blue" />
                    I want to join as
                  </label>
                  <RadioGroup value={role} onValueChange={setRole} className="flex flex-col space-y-2 mt-1">
                    <div className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all ${role === 'worker' ? 'border-app-blue bg-app-blue/5' : ''}`}>
                      <RadioGroupItem value="worker" id="worker" className={role === 'worker' ? 'text-app-blue' : ''} />
                      <Label htmlFor="worker" className="flex items-center cursor-pointer">
                        <Briefcase className={`h-5 w-5 mr-2 ${role === 'worker' ? 'text-app-blue' : 'text-blue-500'}`} />
                        <div>
                          <span className="font-medium">Worker</span>
                          <p className="text-xs text-gray-500">I want to find work opportunities</p>
                        </div>
                      </Label>
                    </div>
                    <div className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all ${role === 'employer' ? 'border-app-blue bg-app-blue/5' : ''}`}>
                      <RadioGroupItem value="employer" id="employer" className={role === 'employer' ? 'text-app-blue' : ''} />
                      <Label htmlFor="employer" className="flex items-center cursor-pointer">
                        <User className={`h-5 w-5 mr-2 ${role === 'employer' ? 'text-app-blue' : 'text-green-500'}`} />
                        <div>
                          <span className="font-medium">Employer</span>
                          <p className="text-xs text-gray-500">I want to hire skilled workers</p>
                        </div>
                      </Label>
                    </div>
                    <div className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all ${role === 'user' ? 'border-app-blue bg-app-blue/5' : ''}`}>
                      <RadioGroupItem value="user" id="user" className={role === 'user' ? 'text-app-blue' : ''} />
                      <Label htmlFor="user" className="flex items-center cursor-pointer">
                        <User className={`h-5 w-5 mr-2 ${role === 'user' ? 'text-app-blue' : 'text-gray-500'}`} />
                        <div>
                          <span className="font-medium">Just Browsing</span>
                          <p className="text-xs text-gray-500">I want to explore the platform</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Lock className="h-3.5 w-3.5 text-app-blue" />
                    Password
                  </label>
                  <div className={`relative transition-all duration-300 ${activeField === 'password' ? 'scale-[1.01]' : ''}`}>
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
                  {password && (
                    <div className="mt-2">
                      <Progress value={strength} className="h-1.5 mb-1" />
                      <div className="flex justify-between text-xs">
                        <p className="text-gray-500">Password strength: <span className={`font-medium ${
                          text === 'Weak' ? 'text-red-500' : 
                          text === 'Fair' ? 'text-orange-500' : 
                          text === 'Good' ? 'text-yellow-600' : 
                          'text-green-500'
                        }`}>{text}</span></p>
                        
                        <span className="text-gray-400">{strength}%</span>
                      </div>
                      <div className="mt-1 space-y-1">
                        <p className={`text-xs flex items-center ${checks.length ? 'text-green-500' : 'text-gray-400'}`}>
                          {checks.length ? <CheckCircle className="h-3 w-3 mr-1" /> : <span className="h-3 w-3 mr-1">•</span>}
                          At least 8 characters
                        </p>
                        <p className={`text-xs flex items-center ${checks.uppercase ? 'text-green-500' : 'text-gray-400'}`}>
                          {checks.uppercase ? <CheckCircle className="h-3 w-3 mr-1" /> : <span className="h-3 w-3 mr-1">•</span>}
                          At least one uppercase letter
                        </p>
                        <p className={`text-xs flex items-center ${checks.number ? 'text-green-500' : 'text-gray-400'}`}>
                          {checks.number ? <CheckCircle className="h-3 w-3 mr-1" /> : <span className="h-3 w-3 mr-1">•</span>}
                          At least one number
                        </p>
                        <p className={`text-xs flex items-center ${checks.special ? 'text-green-500' : 'text-gray-400'}`}>
                          {checks.special ? <CheckCircle className="h-3 w-3 mr-1" /> : <span className="h-3 w-3 mr-1">•</span>}
                          At least one special character
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                    <Lock className="h-3.5 w-3.5 text-app-blue" />
                    Confirm Password
                  </label>
                  <div className={`relative transition-all duration-300 ${activeField === 'confirmPassword' ? 'scale-[1.01]' : ''}`}>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Lock className={`h-5 w-5 transition-colors duration-300 ${activeField === 'confirmPassword' ? 'text-app-blue' : 'text-gray-400'}`} />
                    </div>
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`pl-10 pr-10 transition-all duration-300 ${activeField === 'confirmPassword' ? 'border-app-blue ring-1 ring-app-blue/30' : ''}`}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={() => handleFocus('confirmPassword')}
                      onBlur={handleBlur}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 hover:text-app-blue transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-app-blue transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-app-blue transition-colors" />
                      )}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                  )}
                  {confirmPassword && password === confirmPassword && (
                    <p className="text-xs text-green-500 mt-1 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Passwords match
                    </p>
                  )}
                </div>
                
                <div className="flex items-center mt-2">
                  <div className="relative flex items-start">
                    <div className="flex h-5 items-center">
                      <input
                        id="terms"
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-app-blue focus:ring-app-blue"
                        checked={termsAccepted}
                        onChange={() => setTermsAccepted(!termsAccepted)}
                        required
                      />
                    </div>
                    <div className="ml-2 text-sm">
                      <label htmlFor="terms" className="text-gray-700 dark:text-gray-300">
                        I agree to the <Link to="/terms" className="text-app-blue hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-app-blue hover:underline">Privacy Policy</Link>
                      </label>
                    </div>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  variant="blue"
                  className="w-full py-6 mt-2 group transition-all duration-300 shadow-md hover:shadow-lg"
                  disabled={isLoading || !termsAccepted}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin mr-2 h-5 w-5 border-2 border-b-transparent rounded-full"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="mr-1">Create Account</span>
                      <ArrowRight className="h-5 w-5 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-app-blue hover:text-app-blue/80 transition-colors hover:underline">
                    Sign In
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

export default SignUp;
