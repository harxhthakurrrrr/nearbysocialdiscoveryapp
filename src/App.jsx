import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Discover from './pages/Discover';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Matches from './pages/Matches';
import Notifications from './pages/Notifications';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Rotation animation for the loader logo
    const tl = gsap.timeline();
    tl.to('.loader-logo', {
      rotate: 360,
      duration: 2,
      repeat: -1,
      ease: 'linear'
    });

    // Fade out loader and show app after 2.5 seconds
    const timer = setTimeout(() => {
      gsap.to('.preloader', {
        opacity: 0,
        duration: 0.8,
        onComplete: () => setLoading(false)
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="preloader fixed inset-0 z-[9999] bg-bg-dark flex flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse"></div>
          <img 
            src="/icons.svg" 
            className="loader-logo w-24 h-24 relative z-10" 
            alt="Loading..." 
          />
        </div>
        <h2 className="mt-8 text-2xl font-black tracking-widest text-primary italic animate-pulse">
          NEARBY.SOCIAL
        </h2>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <div className="app-container min-h-screen bg-bg-dark text-white selection:bg-primary selection:text-white">
          <Navbar />
          <main className="pt-16 pb-20 md:pb-0 md:pl-20">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Private Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/notifications" element={<Notifications />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;