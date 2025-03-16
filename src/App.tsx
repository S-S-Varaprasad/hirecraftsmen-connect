
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Workers from "./pages/Workers";
import WorkersByCategory from "./pages/WorkersByCategory";
import Jobs from "./pages/Jobs";
import About from "./pages/About";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import JoinAsWorker from "./pages/JoinAsWorker";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import WorkerDetail from "./pages/WorkerDetail";
import MessageWorker from "./pages/MessageWorker";
import ApplyNow from "./pages/ApplyNow";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/workers" element={<Workers />} />
            <Route path="/workers/category/:slug" element={<WorkersByCategory />} />
            <Route path="/workers/:id" element={<WorkerDetail />} />
            <Route path="/message/:id" element={<MessageWorker />} />
            <Route path="/apply/:id" element={<ApplyNow />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/join-as-worker" element={<JoinAsWorker />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
