
import React, { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Index from '@/pages/Index';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import Jobs from '@/pages/Jobs';
import JobDetail from '@/pages/JobDetail';
import Workers from '@/pages/Workers';
import WorkerDetail from '@/pages/WorkerDetail';
import WorkersByCategory from '@/pages/WorkersByCategory';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import JoinAsWorker from '@/pages/JoinAsWorker';
import ApplyNow from '@/pages/ApplyNow';
import MessageWorker from '@/pages/MessageWorker';
import NotFound from '@/pages/NotFound';
import PostJob from '@/pages/PostJob';
import EditJob from '@/pages/EditJob';
import DeactivateWorker from '@/pages/DeactivateWorker';
import DeleteWorker from '@/pages/DeleteWorker';
import ContactEmployer from '@/pages/ContactEmployer';
import { AuthProvider } from '@/context/AuthContext';

// Create a client
const queryClient = new QueryClient();

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
    
    // Get the saved theme from localStorage
    const savedTheme = localStorage.getItem('vite-ui-theme');
    
    // Apply the theme to the document
    if (savedTheme) {
      document.documentElement.classList.remove('light', 'dark');
      
      if (savedTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        document.documentElement.classList.add(systemTheme);
      } else {
        document.documentElement.classList.add(savedTheme);
      }
    } else {
      // If no theme is saved, set a default
      document.documentElement.classList.add('light');
    }
    
    // Listen for system preference changes if theme is set to 'system'
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      const currentTheme = localStorage.getItem('vite-ui-theme');
      if (currentTheme === 'system') {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(
          mediaQuery.matches ? 'dark' : 'light'
        );
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="app">
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <Toaster position="top-right" />
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/workers" element={<Workers />} />
                <Route path="/workers/:id" element={<WorkerDetail />} />
                <Route path="/workers/category/:slug" element={<WorkersByCategory />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/join-as-worker" element={<JoinAsWorker />} />
                <Route path="/apply/:jobId" element={<ApplyNow />} />
                <Route path="/message/:workerId" element={<MessageWorker />} />
                <Route path="/contact-employer/:jobId" element={<ContactEmployer />} />
                <Route path="/post-job" element={<PostJob />} />
                <Route path="/edit-job/:id" element={<EditJob />} />
                <Route path="/deactivate-worker/:id" element={<DeactivateWorker />} />
                <Route path="/delete-worker/:id" element={<DeleteWorker />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </ThemeProvider>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
