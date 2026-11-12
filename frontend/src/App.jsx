import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import QueryPage from './pages/QueryPage';
import HistoryPage from './pages/HistoryPage';
import { toast } from 'sonner';
import { authAPI } from './services/api';
import { getToken, removeToken, setToken } from './services/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getToken());
  // True while a ?demo=KEY link is being exchanged for a login
  const [booting, setBooting] = useState(() => new URLSearchParams(window.location.search).has('demo'));

  useEffect(() => {
    const key = new URLSearchParams(window.location.search).get('demo');
    if (!key) return;
    authAPI
      .demoLogin(key)
      .then(({ data }) => {
        setToken(data.access, data.refresh);
        setIsAuthenticated(true);
        toast.success('Signed in as a demo guest');
      })
      .catch(() => toast.error('This demo link is invalid or has been turned off.'))
      .finally(() => {
        window.history.replaceState({}, '', window.location.pathname); // hide the key
        setBooting(false);
      });
  }, []);

  // Smooth scrolling (skipped for people who prefer reduced motion)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ lerp: 0.1 });
    let id;
    const raf = (t) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
  };

  if (booting) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-ink-soft" aria-live="polite">
        Opening the demo…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      {isAuthenticated && <Navbar onLogout={handleLogout} />}
      <main className={isAuthenticated ? 'pt-14' : ''}>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <LoginPage onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <RegisterPage onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <QueryPage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/history"
            element={
              isAuthenticated ? (
                <HistoryPage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
