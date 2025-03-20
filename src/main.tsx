
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { addSampleWorkers } from './utils/sampleWorkers.ts'
import { ensureStorageBuckets } from './services/storageService.ts'

// Ensure storage buckets exist
ensureStorageBuckets().catch(error => {
  console.error('Error ensuring storage buckets:', error);
});

// Add sample workers if needed
addSampleWorkers().catch(error => {
  console.error('Error adding sample workers:', error);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
