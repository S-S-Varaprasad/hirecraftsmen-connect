import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/components/theme-provider"
import {
  Index,
  About,
  Contact,
  Login,
  SignUp,
  Terms,
  Privacy,
  Profile,
  Settings,
  Workers,
  WorkerDetail,
  Jobs,
  JobDetail,
  PostJob,
  EditJob,
  ApplyNow,
  JoinAsWorker,
  NotFound,
  WorkersByCategory,
  ContactEmployer,
  DeactivateWorker,
  DeleteWorker,
  WorkerJobHistory
} from '@/pages';
import { AuthProvider, RequireAuth } from '@/context/AuthContext';
import CookieConsent from "react-cookie-consent";
import MessageWorker from '@/pages/MessageWorker';
import ContactWorker from '@/pages/ContactWorker';

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
      },
    },
  });

  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light">
        <QueryClientProvider client={queryClient}>
          <Toaster position="top-right" richColors />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
            <Route path="/contact-employer/:employerId" element={<RequireAuth><ContactEmployer /></RequireAuth>} />
            <Route path="/contact/:workerId" element={<RequireAuth><ContactWorker /></RequireAuth>} />
            <Route path="/message/:workerId" element={<RequireAuth><MessageWorker /></RequireAuth>} />
            <Route path="/workers" element={<Workers />} />
            <Route path="/workers/by-category/:category" element={<WorkersByCategory />} />
            <Route path="/workers/:id" element={<WorkerDetail />} />
            <Route path="/workers/deactivate/:id" element={<RequireAuth><DeactivateWorker /></RequireAuth>} />
            <Route path="/workers/delete/:id" element={<RequireAuth><DeleteWorker /></RequireAuth>} />
            <Route path="/worker-job-history" element={<RequireAuth><WorkerJobHistory /></RequireAuth>} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/post-job" element={<RequireAuth><PostJob /></RequireAuth>} />
            <Route path="/edit-job/:id" element={<RequireAuth><EditJob /></RequireAuth>} />
            <Route path="/apply-now/:jobId" element={<RequireAuth><ApplyNow /></RequireAuth>} />
            <Route path="/join-as-worker" element={<JoinAsWorker />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </QueryClientProvider>
        <CookieConsent
          location="bottom"
          buttonText="I Accept"
          cookieName="handyHelpers-cookie-consent"
          style={{ background: "#2B373B" }}
          buttonStyle={{ 
            backgroundColor: "#f97316", 
            color: "white", 
            fontSize: "14px", 
            borderRadius: "4px", 
            padding: "8px 16px"
          }}
          expires={150}
        >
          This website uses cookies to enhance the user experience.
        </CookieConsent>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
