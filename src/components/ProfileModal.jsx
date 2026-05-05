import React from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Shield, MessageCircle, Heart, Award, Zap } from 'lucide-react';
import { gsap } from 'gsap';

const ProfileModal = ({ user, onClose }) => {
  const handleRequestAccess = () => {
    // Logic for requesting exact location
    alert(`Request sent to ${user.name}!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-card w-full max-w-md overflow-hidden rounded-3xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white z-10 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Profile Header */}
        <div className="relative h-48">
          <img 
            src={`https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=500&q=80`} 
            className="w-full h-full object-cover"
            alt="Cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-transparent to-transparent"></div>
          <div className="absolute -bottom-12 left-6 flex items-end gap-4">
            <div className="relative">
              <img 
                src={user.img} 
                className="w-24 h-24 rounded-3xl border-4 border-bg-dark object-cover"
                alt={user.name}
              />
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-bg-dark rounded-full"></div>
            </div>
            <div className="mb-2">
              <h2 className="text-2xl font-bold text-white">{user.name}, 24</h2>
              <p className="text-primary text-sm flex items-center gap-1">
                <Zap size={14} fill="currentColor" /> {user.xp} XP • Explorer
              </p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-16 px-6 pb-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 glass rounded-2xl p-3 text-center border border-white/5">
              <p className="text-xs text-gray-400 mb-1">Distance</p>
              <p className="font-bold">{user.distance}</p>
            </div>
            <div className="flex-1 glass rounded-2xl p-3 text-center border border-white/5">
              <p className="text-xs text-gray-400 mb-1">Status</p>
              <p className="font-bold text-green-400">Online</p>
            </div>
            <div className="flex-1 glass rounded-2xl p-3 text-center border border-white/5">
              <p className="text-xs text-gray-400 mb-1">Matches</p>
              <p className="font-bold text-secondary">12</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">About</h3>
            <p className="text-gray-200 text-sm leading-relaxed">
              Hey! I love exploring new places in Delhi. Always down for coffee or a quick walk in the park. ☕️🌳
            </p>
            
            <div className="flex flex-wrap gap-2">
              {['Coffee', 'Hiking', 'Tech', 'Music'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Privacy Notice */}
          {user.blur && (
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
              <Shield className="text-primary mt-1" size={20} />
              <div>
                <p className="text-xs font-bold text-primary uppercase mb-1">Privacy Enabled</p>
                <p className="text-xs text-gray-300">Exact location is hidden. Request access to see where {user.name} is right now.</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {user.blur && (
              <button 
                onClick={handleRequestAccess}
                className="flex-[2] bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20"
              >
                <MapPin size={18} />
                Request Access
              </button>
            )}
            <button className="flex-1 glass hover:bg-white/10 text-white font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 border border-white/10">
              <MessageCircle size={18} />
            </button>
            <button className="p-4 glass hover:bg-secondary/10 hover:text-secondary text-white rounded-2xl transition-all active:scale-95 border border-white/10">
              <Heart size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfileModal;
