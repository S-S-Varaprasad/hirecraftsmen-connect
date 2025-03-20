
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ensureStorageBuckets } from './services/storageService.ts'
import { addSampleWorkers } from './utils/sampleWorkers.ts'

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
