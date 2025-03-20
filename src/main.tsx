
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from './context/AuthContext.tsx'
import './index.css'
import { addSampleWorkers } from './utils/sampleWorkers.ts'
import { ensureStorageBuckets } from './services/storageService.ts'

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
    <App />
  </React.StrictMode>,
)
