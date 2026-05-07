import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Map, Heart, MessageSquare, User, Bell, Compass, LogIn, UserPlus, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Nav items for logged in users
  const navItems = [
    { icon: <Map size={24} />, path: '/', label: 'Map' },
    { icon: <Compass size={24} />, path: '/discover', label: 'Discover' },
    { icon: <MessageSquare size={24} />, path: '/chat', label: 'Chat' },
    { icon: <Heart size={24} />, path: '/matches', label: 'Matches' },
    { icon: <User size={24} />, path: '/profile', label: 'Profile' },
  ];

  return (
    <>
      {/* Mobile Bottom Nav - Only for logged in users */}
      {token && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-glass-border px-6 py-3 flex justify-between items-center">
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

      {/* Desktop Sidebar Nav */}
      <nav className="fixed left-0 top-0 bottom-0 w-20 z-50 hidden md:flex flex-col items-center py-8 glass border-r border-glass-border">
        <div className="mb-12">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center animate-pulse-glow">
            <Map className="text-white" size={28} />
          </div>
        </div>
        
        {token ? (
          <>
            {/* Logged In - Show Navigation Icons */}
            <div className="flex-1 flex flex-col gap-8">
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

            {/* Logout Button */}
            <div className="mt-auto mb-4">
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
          <>
            {/* Not Logged In - Show Login/Signup Buttons */}
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
          </>
        )}

        {/* Notification Bell - Only for logged in */}
        {token && (
          <div className="mt-auto">
            <button className="relative p-3 text-gray-400 hover:text-white transition-colors group">
              <Bell size={24} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-bg-dark"></span>
            </button>
          </div>
        )}
      </nav>

      {/* Mobile Top Header - With Auth Buttons */}
      <header className="fixed top-0 left-0 right-0 h-16 z-40 md:pl-20 glass border-b border-white/10 flex items-center justify-between px-6 shadow-none">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full group-hover:bg-primary/30 transition-all"></div>
            <img 
              src="/icons.svg" 
              alt="Logo" 
              className="w-10 h-10 relative z-10 animate-pulse-glow"
            />
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-primary italic shadow-none group-hover:scale-105 transition-transform origin-left">
            NEARBY.SOCIAL
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {!token ? (
            // Show Login/Signup buttons on mobile header
            <div className="flex gap-2">
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-primary/20 text-primary rounded-xl text-sm font-bold hover:bg-primary/30 transition-all"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-all"
              >
                Sign Up
              </button>
            </div>
          ) : (
            // Show user info when logged in
            <>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-glass-border">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-gray-300">Online</span>
              </div>
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border border-primary/50 cursor-pointer"
                onClick={() => navigate('/profile')}
              />
              <button 
                onClick={handleLogout}
                className="md:hidden p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <LogOut size={20} />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Mobile Bottom Auth Bar (when not logged in) */}
      {!token && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-glass-border px-6 py-3 flex justify-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="flex-1 py-3 bg-primary/20 text-primary rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <LogIn size={18} />
            Login
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="flex-1 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <UserPlus size={18} />
            Sign Up
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;