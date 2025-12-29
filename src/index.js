import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Spline 관련 에러 억제 (iframe 내부 에러)
window.addEventListener('error', (event) => {
  if (event.message && (
    event.message.includes('position') ||
    event.message.includes('Spline') ||
    event.message.includes('runtime.js')
  )) {
    event.preventDefault();
    return false;
  }
}, true);

// Unhandled promise rejection도 처리
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && (
    event.reason.message && event.reason.message.includes('position') ||
    event.reason.message && event.reason.message.includes('Spline')
  )) {
    event.preventDefault();
    return false;
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
