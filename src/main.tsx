import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="px-4 m-0 bg-gray-50 h-fit w-full py-4 sm:py-10">
      <App />
    </div>
  </StrictMode>,
);
