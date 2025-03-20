
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from './context/AuthContext.tsx'
import './index.css'
import { addSampleWorkers } from './utils/sampleWorkers.ts'
import { ensureStorageBuckets } from './services/storageService.ts'

// Create a client
const queryClient = new QueryClient()

// Initialize app resources
const initializeApp = async () => {
  try {
    // Ensure storage buckets exist
    await ensureStorageBuckets();
    
    // Add sample workers if needed
    await addSampleWorkers();
  } catch (error) {
    console.error('Error initializing app:', error);
  }
};

// Initialize app resources
initializeApp();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <App />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
