import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Smile, Coffee, Music, Zap, Heart } from 'lucide-react';
import api from '../../api/axios';
import { useNotifications } from '../notifications/NotificationContext';

const PulseModal = ({ isOpen, onClose }) => {
  const { addNotification } = useNotifications();
  const [pulseText, setPulseText] = useState('');
  const [selectedMood, setSelectedMood] = useState('Chill');
  const [loading, setLoading] = useState(false);

  const moods = [
    { name: 'Chill', icon: <Coffee size={18} />, color: 'bg-blue-500' },
    { name: 'Active', icon: <Zap size={18} />, color: 'bg-yellow-500' },
    { name: 'Music', icon: <Music size={18} />, color: 'bg-purple-500' },
    { name: 'Social', icon: <Smile size={18} />, color: 'bg-green-500' },
    { name: 'Date', icon: <Heart size={18} />, color: 'bg-pink-500' },
  ];

  const handleSendPulse = async () => {
    if (!pulseText.trim()) return;
    
    setLoading(true);
    try {
      await api.put('/auth/profile', {
        mood_status: `${selectedMood}: ${pulseText}`
      });
      addNotification(`Pulse broadcasted: ${selectedMood}!`, "success");
      onClose();
    } catch (err) {
      console.error('Pulse error:', err);
      addNotification("Failed to send pulse", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-end justify-center sm:items-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="relative w-full max-w-md bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-gray-900">Send a Pulse</h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              {/* Description - Darker text */}
              <p className="text-gray-700 text-sm mb-6 font-medium">
                Your pulse will be visible to everyone nearby on the map for 24 hours.
              </p>

              {/* Mood Selection - Better contrast */}
              <div className="flex gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar">
                {moods.map((mood) => (
                  <button
                    key={mood.name}
                    onClick={() => setSelectedMood(mood.name)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all min-w-[80px] ${
                      selectedMood === mood.name 
                        ? `border-primary bg-primary/10 text-primary` 
                        : 'border-gray-200 bg-gray-100 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className={`${selectedMood === mood.name ? 'text-primary' : 'text-gray-500'}`}>
                      {mood.icon}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${selectedMood === mood.name ? 'text-primary' : 'text-gray-500'}`}>
                      {mood.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Input Area - Better placeholder color */}
              <div className="relative mb-8">
                <textarea
                  value={pulseText}
                  onChange={(e) => setPulseText(e.target.value)}
                  placeholder="What's happening? (e.g. At the mall, looking for coffee!)"
                  className="w-full bg-gray-100 border border-gray-200 rounded-3xl p-5 text-gray-800 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none h-32 placeholder-gray-400"
                  maxLength={100}
                />
                {/* Character count - Darker and visible */}
                <div className="absolute bottom-4 right-4 text-[10px] font-bold text-gray-500">
                  {pulseText.length}/100
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSendPulse}
                disabled={loading || !pulseText.trim()}
                className="w-full py-4 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send size={18} />
                    Broadcast Pulse
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PulseModal;