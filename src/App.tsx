
import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';

import Index from './pages/Index';
import Workers from './pages/Workers';
import WorkerDetail from './pages/WorkerDetail';
import WorkersByCategory from './pages/WorkersByCategory';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import PostJob from './pages/PostJob';
import ApplyNow from './pages/ApplyNow';
import Contact from './pages/Contact';
import About from './pages/About';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import JoinAsWorker from './pages/JoinAsWorker';
import EditJob from './pages/EditJob';
import WorkerJobHistory from './pages/WorkerJobHistory';
import ContactWorker from './pages/ContactWorker';
import ContactEmployer from './pages/ContactEmployer';
import DeleteWorker from './pages/DeleteWorker';
import DeactivateWorker from './pages/DeactivateWorker';
import MessageWorker from './pages/MessageWorker';
import NotificationSettings from './pages/NotificationSettings';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Messages from './pages/Messages';
import MessageDetail from './pages/MessageDetail';

function App() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        retryDelay: attempt => Math.min(attempt > 1 ? 2000 : 1000, 10000),
        staleTime: 60 * 1000, // 1 minute
      },
    },
  }));

  return (
    <ThemeProvider defaultTheme="light" storageKey="hire-ease-ui-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/workers" element={<Workers />} />
            <Route path="/workers/:workerId" element={<WorkerDetail />} />
            <Route path="/workers/category/:category" element={<WorkersByCategory />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:jobId" element={<JobDetail />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/apply-now/:jobId" element={<ApplyNow />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/join-as-worker" element={<JoinAsWorker />} />
            <Route path="/edit-job/:jobId" element={<EditJob />} />
            <Route path="/worker-job-history" element={<WorkerJobHistory />} />
            <Route path="/contact-worker/:workerId" element={<ContactWorker />} />
            <Route path="/contact-employer/:jobId" element={<ContactEmployer />} />
            <Route path="/delete-worker/:workerId" element={<DeleteWorker />} />
            <Route path="/deactivate-worker/:workerId" element={<DeactivateWorker />} />
            <Route path="/message-worker/:workerId" element={<MessageWorker />} />
            <Route path="/notification-settings" element={<NotificationSettings />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:messageId" element={<MessageDetail />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
        <Toaster position="top-right" richColors closeButton />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
