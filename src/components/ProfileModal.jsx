import React from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Shield, MessageCircle, Heart, Award, Zap, Ban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ProfileModal = ({ user, onClose }) => {
  const navigate = useNavigate();
  const userName = user.full_name || user.name || 'User';

  const handleRequestAccess = () => {
    alert(`Location request sent to ${userName}!`);
  };

  const handleBlockUser = async () => {
    if (window.confirm(`Are you sure you want to block ${userName}? You will no longer see them.`)) {
      try {
        await api.post(`/social/block/${user._id}`);
        alert(`${userName} has been blocked`);
        onClose();
      } catch (err) {
        console.error('Block user error:', err);
        alert('Failed to block user');
      }
    }
  };

  const handleStartChat = () => {
    onClose();
    navigate(`/chat?user=${user._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-md overflow-hidden rounded-[2.5rem] relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 text-white z-10 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Profile Header */}
        <div className="relative h-48">
          <img 
            src={user.cover_img || `https://images.unsplash.com/photo-1557683316-973673baf926?w=500&q=80`} 
            className="w-full h-full object-cover"
            alt="Cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
          <div className="absolute -bottom-12 left-8 flex items-end gap-4">
            <div className="relative">
              <img 
                src={user.avatar_url || user.img || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username || user.name}`} 
                className="w-24 h-24 rounded-3xl border-4 border-white shadow-xl object-cover bg-white"
                alt={userName}
              />
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
            </div>
            <div className="mb-2">
              <h2 className="text-2xl font-black text-gray-900">{userName}, {user.age || 21}</h2>
              <p className="text-primary text-sm font-bold flex items-center gap-1">
                <Zap size={14} fill="currentColor" /> {user.xp_points || 1200} XP • Lvl {user.level || 1}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-16 px-8 pb-8">
          <div className="flex gap-3 mb-8">
            <div className="flex-1 bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Distance</p>
              <p className="font-black text-gray-900">{user.distance_km || 'Nearby'}</p>
            </div>
            <div className="flex-1 bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Status</p>
              <p className="font-black text-green-500">Active</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">About</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {user.bio || "Hey! I'm using Nearby Social to meet new people. Let's connect! ☕️"}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {(user.interests || ['Social', 'Coffee', 'Travel']).map(tag => (
                <span key={tag} className="px-3 py-1 bg-primary/5 border border-primary/10 rounded-full text-[10px] font-bold text-primary uppercase">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button 
              onClick={handleStartChat}
              className="flex-[2] bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-primary/20"
            >
              <MessageCircle size={20} />
              Message
            </button>
            <button 
              onClick={handleBlockUser}
              className="p-4 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-2xl transition-all active:scale-95 border border-gray-100"
            >
              <Ban size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};


export default ProfileModal;