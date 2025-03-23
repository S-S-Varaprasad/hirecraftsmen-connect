import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider, RequireAuth } from '@/context/AuthContext';
import CookieConsent from "react-cookie-consent";
import ScrollToTop from '@/components/ScrollToTop';

// Import pages individually instead of from a barrel file
import Index from '@/pages/Index';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Login from '@/pages/Login';
import SignUp from '@/pages/SignUp';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Workers from '@/pages/Workers';
import WorkerDetail from '@/pages/WorkerDetail';
import Jobs from '@/pages/Jobs';
import JobDetail from '@/pages/JobDetail';
import PostJob from '@/pages/PostJob';
import EditJob from '@/pages/EditJob';
import ApplyNow from '@/pages/ApplyNow';
import JoinAsWorker from '@/pages/JoinAsWorker';
import NotFound from '@/pages/NotFound';
import WorkersByCategory from '@/pages/WorkersByCategory';
import ContactEmployer from '@/pages/ContactEmployer';
import DeactivateWorker from '@/pages/DeactivateWorker';
import DeleteWorker from '@/pages/DeleteWorker';
import WorkerJobHistory from '@/pages/WorkerJobHistory';
import MessageWorker from '@/pages/MessageWorker';
import ContactWorker from '@/pages/ContactWorker';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
      },
    },
  });

  // Check if the cookie consent is already stored
  const [cookieConsentAccepted, setCookieConsentAccepted] = useState(() => {
    return localStorage.getItem("handyHelpers-cookie-consent") === "true";
  });

  const handleCookieAccept = () => {
    localStorage.setItem("handyHelpers-cookie-consent", "true");
    setCookieConsentAccepted(true);
  };

  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="light">
        <QueryClientProvider client={queryClient}>
          <Toaster position="top-right" richColors />
          <ScrollToTop />
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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </QueryClientProvider>
        
        {!cookieConsentAccepted && (
          <CookieConsent
            location="bottom"
            buttonText="Accept Cookies"
            cookieName="handyHelpers-cookie-consent"
            style={{ 
              background: "rgba(43, 55, 59, 0.95)",
              backdropFilter: "blur(8px)",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              maxWidth: "1200px",
              margin: "0 auto",
              left: "50%",
              transform: "translateX(-50%)",
              borderRadius: "8px 8px 0 0"
            }}
            buttonStyle={{ 
              backgroundColor: "#f97316", 
              color: "white", 
              fontSize: "14px", 
              borderRadius: "6px", 
              padding: "10px 16px",
              fontWeight: "500",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"
            }}
            contentStyle={{
              flex: "1",
              margin: "15px"
            }}
            expires={150}
            onAccept={handleCookieAccept}
            hideOnAccept={true}
            acceptOnScroll={false}
          >
            <span style={{ fontWeight: "500" }}>This website uses cookies</span> to enhance your browsing experience and provide personalized services. By continuing to use our site, you consent to our use of cookies.
          </CookieConsent>
        )}
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
