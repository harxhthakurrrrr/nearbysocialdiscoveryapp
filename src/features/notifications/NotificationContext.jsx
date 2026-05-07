import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Info, CheckCircle, AlertCircle } from 'lucide-react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 4000);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      
      {/* Notification Toasts Container */}
      <div className="fixed top-20 right-6 z-[9999] flex flex-col gap-3 w-80 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className={`pointer-events-auto p-4 rounded-2xl border backdrop-blur-xl flex items-start gap-3 shadow-xl ${
                n.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                n.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                'bg-primary/10 border-primary/20 text-primary'
              }`}
            >
              <div className="mt-0.5">
                {n.type === 'success' ? <CheckCircle size={18} /> :
                 n.type === 'error' ? <AlertCircle size={18} /> :
                 <Bell size={18} />}
              </div>
              <p className="flex-1 text-sm font-bold leading-tight">{n.message}</p>
              <button 
                onClick={() => removeNotification(n.id)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
