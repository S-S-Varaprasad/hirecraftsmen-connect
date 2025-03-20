
import React, { useEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { addSampleWorkers } from '@/utils/sampleWorkers';

import Index from '@/pages/Index';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Workers from '@/pages/Workers';
import WorkersByCategory from '@/pages/WorkersByCategory';
import WorkerDetail from '@/pages/WorkerDetail';
import ApplyNow from '@/pages/ApplyNow';
import JoinAsWorker from '@/pages/JoinAsWorker';
import Jobs from '@/pages/Jobs';
import JobDetail from '@/pages/JobDetail';
import PostJob from '@/pages/PostJob';
import NotFound from '@/pages/NotFound';
import MessageWorker from '@/pages/MessageWorker';
import DeactivateWorker from '@/pages/DeactivateWorker';
import DeleteWorker from '@/pages/DeleteWorker';

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
      },
    },
  });

  useEffect(() => {
    // Add sample workers when the app loads
    addSampleWorkers();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen flex flex-col">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/workers" element={<Workers />} />
              <Route path="/workers/category/:category" element={<WorkersByCategory />} />
              <Route path="/workers/:id" element={<WorkerDetail />} />
              <Route path="/workers/deactivate/:id" element={<DeactivateWorker />} />
              <Route path="/workers/delete/:id" element={<DeleteWorker />} />
              <Route path="/apply/:id" element={<ApplyNow />} />
              <Route path="/message/:id" element={<MessageWorker />} />
              <Route path="/join-as-worker" element={<JoinAsWorker />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/post-job" element={<PostJob />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          
          <Toaster richColors />
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
