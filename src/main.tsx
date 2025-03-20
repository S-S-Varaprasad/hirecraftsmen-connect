
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { addSampleWorkers } from './utils/sampleWorkers.ts'

// Add sample workers if needed (this is separate from storage bucket initialization)
addSampleWorkers().catch(error => {
  console.error('Error adding sample workers:', error);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
