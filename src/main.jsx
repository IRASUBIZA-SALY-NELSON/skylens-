import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Gate all console output behind localStorage.DEBUG === 'true'
// - Set localStorage.DEBUG = 'true' and reload to enable logs
// - Any other value (or missing) will silence logs
if (typeof window !== 'undefined' && window.console) {
  const noop = () => { };
  const methods = ['log', 'warn', 'error', 'info', 'debug', 'trace'];
  const original = {};
  methods.forEach((m) => { original[m] = typeof window.console[m] === 'function' ? window.console[m].bind(window.console) : noop; });

  const isDebugOn = () => (window.localStorage?.getItem('DEBUG') || '').toLowerCase() === 'true';
  const applyLoggingGate = () => {
    const enable = isDebugOn();
    methods.forEach((m) => {
      try { window.console[m] = enable ? original[m] : noop; } catch (_) { /* ignore */ }
    });
  };

  applyLoggingGate();
  // Optional: expose a helper to toggle in devtools and then reload
  // window.__setDebugLogging = (v) => { try { localStorage.setItem('DEBUG', String(v)); } catch(_){}; applyLoggingGate(); };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
