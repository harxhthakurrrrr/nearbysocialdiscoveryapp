import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { gsap } from 'gsap';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Discover from './pages/Discover';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Matches from './pages/Matches';
import './App.css';

function App() {
  useEffect(() => {
    // Initial entrance animation
    gsap.from('.app-container', {
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
  }, []);

  return (
    <Router>
      <div className="app-container min-h-screen bg-bg-dark text-white selection:bg-primary selection:text-white">
        <Navbar />
        <main className="pt-16 pb-20 md:pb-0 md:pl-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
