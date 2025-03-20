
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { addSampleWorkers, forceAddSampleWorkers } from './utils/sampleWorkers.ts'
import { ensureStorageBuckets } from './services/storageService.ts'

// Ensure storage buckets exist
ensureStorageBuckets().catch(error => {
  console.error('Error ensuring storage buckets:', error);
});

// Add sample workers if needed
addSampleWorkers().catch(error => {
  console.error('Error adding sample workers:', error);
  // If regular add fails, try to force add after a delay (only during development)
  if (import.meta.env.DEV) {
    console.log('Will attempt to force add sample workers in 5 seconds...');
    setTimeout(() => {
      forceAddSampleWorkers().catch(e => 
        console.error('Force add sample workers also failed:', e)
      );
    }, 5000);
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
