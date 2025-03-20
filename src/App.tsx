
import React, { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import InteractiveFeedback from '@/components/InteractiveFeedback';

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
import WorkerJobHistory from '@/pages/WorkerJobHistory';
import { AuthProvider } from '@/context/AuthContext';

// Create a client with better cache configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
  },
});

function App() {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
    
    // Track current page for feedback component
    const handleRouteChange = () => {
      setCurrentPage(window.location.pathname);
    };
    
    window.addEventListener('popstate', handleRouteChange);
    handleRouteChange();
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
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
                <Route path="/job-history" element={<WorkerJobHistory />} />
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
              
              {/* Interactive feedback component on all pages */}
              <InteractiveFeedback 
                pageId={currentPage} 
                position="bottom-right" 
                compact={true}
              />
            </AuthProvider>
          </ThemeProvider>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
