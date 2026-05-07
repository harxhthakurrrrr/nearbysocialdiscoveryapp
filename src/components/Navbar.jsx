import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Map, Heart, MessageSquare, User, Compass, LogIn, UserPlus, LogOut, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: <Map size={24} />, path: '/', label: 'Map' },
    { icon: <Compass size={24} />, path: '/discover', label: 'Discover' },
    { icon: <MessageSquare size={24} />, path: '/chat', label: 'Chat' },
    { icon: <Heart size={24} />, path: '/matches', label: 'Matches' },
    { icon: <Trophy size={24} />, path: '/leaderboard', label: 'Leaderboard' },
    { icon: <User size={24} />, path: '/profile', label: 'Profile' },
  ];

  return (
    <>
      {/* Mobile Bottom Nav */}
      {token && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-glass-border px-4 py-2 flex justify-between items-center">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center transition-all duration-300 ${
                  isActive ? 'text-primary scale-110' : 'text-gray-400 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <div className="flex flex-col items-center">
                  {item.icon}
                  {isActive && (
                    <motion.div 
                      layoutId="mobileActiveNav"
                      className="w-1 h-1 bg-primary rounded-full mt-1"
                    />
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      )}

      {/* Desktop Sidebar */}
      <nav className="fixed left-0 top-0 bottom-0 w-20 z-50 hidden md:flex flex-col items-center py-8 glass border-r border-glass-border">
        <div className="mb-12">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center animate-pulse-glow">
            <Map className="text-white" size={28} />
          </div>
        </div>
        
        {token ? (
          <>
            <div className="flex-1 flex flex-col gap-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative group p-3 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.icon}
                      <span className="absolute left-20 bg-primary text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {item.label}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* ✅ NOTIFICATION BELL - ADD THIS */}
            <div className="mt-auto">
              <NotificationBell />
            </div>

            <div className="mb-4">
              <button 
                onClick={handleLogout}
                className="relative group p-3 rounded-xl transition-all duration-300 text-gray-400 hover:bg-red-500/20 hover:text-red-500 w-full flex justify-center"
              >
                <LogOut size={24} />
                <span className="absolute left-20 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Logout
                </span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col gap-8 justify-center">
            <button 
              onClick={() => navigate('/login')}
              className="relative group p-3 rounded-xl transition-all duration-300 text-gray-400 hover:bg-primary/20 hover:text-primary"
            >
              <LogIn size={24} />
              <span className="absolute left-20 bg-primary text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Login
              </span>
            </button>
            
            <button 
              onClick={() => navigate('/register')}
              className="relative group p-3 rounded-xl transition-all duration-300 text-gray-400 hover:bg-green-500/20 hover:text-green-500"
            >
              <UserPlus size={24} />
              <span className="absolute left-20 bg-green-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Sign Up
              </span>
            </button>
          </div>
        )}
      </nav>

      {/* Mobile Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 z-40 md:pl-20 glass border-b border-white/10 flex items-center justify-between px-4 shadow-none">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
          <img src="/icons.svg" alt="Logo" className="w-8 h-8" />
          <h1 className="text-xl font-black text-primary">NEARBY</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {!token ? (
            <div className="flex gap-2">
              <button onClick={() => navigate('/login')} className="px-3 py-1.5 bg-primary/20 text-primary rounded-lg text-xs font-bold">
                Login
              </button>
              <button onClick={() => navigate('/register')} className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold">
                Sign Up
              </button>
            </div>
          ) : (
            <>
              {/* ✅ NOTIFICATION BELL - ADD THIS IN MOBILE HEADER ALSO */}
              <NotificationBell />
              <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] text-gray-300">Online</span>
              </div>
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`} 
                alt="Profile" 
                className="w-7 h-7 rounded-full border border-primary/50 cursor-pointer"
                onClick={() => navigate('/profile')}
              />
            </>
          )}
        </div>
      </header>

      {/* Mobile Bottom Auth Bar */}
      {!token && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-glass-border px-4 py-2 flex justify-center gap-3">
          <button onClick={() => navigate('/login')} className="flex-1 py-2 bg-primary/20 text-primary rounded-lg text-sm font-bold">
            Login
          </button>
          <button onClick={() => navigate('/register')} className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-bold">
            Sign Up
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;