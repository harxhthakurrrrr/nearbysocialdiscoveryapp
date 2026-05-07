import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Edit3, Shield, Award, Zap, History, MapPin, Share2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Profile = () => {
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch (err) {
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-bg-dark pb-12">
      <div className="relative h-64">
        <img src="https://images.unsplash.com/photo-1557683316-973673baf926?w=1000&q=80" className="w-full h-full object-cover" alt="Cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-dark to-transparent"></div>
      </div>

      <div className="max-w-2xl mx-auto px-6 -mt-20 relative z-10">
        <div className="flex flex-col items-center">
          <img src={user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user?.username} className="w-32 h-32 rounded-3xl border-4 border-bg-dark shadow-2xl bg-white" alt="Profile" />
          
          <h2 className="text-3xl font-bold mt-4">{user?.full_name}, {user?.age || 21}</h2>
          <p className="text-gray-400 flex items-center gap-1 text-sm mt-1"><MapPin size={14} /> Online</p>
          
          <div className="flex gap-4 mt-8 w-full">
            <div className="flex-1 glass-card p-4 rounded-2xl border border-glass-border flex flex-col items-center gap-2">
              <Zap size={20} className="text-yellow-400" />
              <span className="text-xl font-bold">{user?.xp_points || 0}</span>
              <span className="text-[10px] text-gray-500 uppercase">Points</span>
            </div>
            <div className="flex-1 glass-card p-4 rounded-2xl border border-glass-border flex flex-col items-center gap-2">
              <Award size={20} className="text-primary" />
              <span className="text-xl font-bold">{user?.level || 1}</span>
              <span className="text-[10px] text-gray-500 uppercase">Level</span>
            </div>
            <div className="flex-1 glass-card p-4 rounded-2xl border border-glass-border flex flex-col items-center gap-2">
              <History size={20} className="text-secondary" />
              <span className="text-xl font-bold">{user?.streak_days || 0}</span>
              <span className="text-[10px] text-gray-500 uppercase">Streak</span>
            </div>
          </div>
        </div>

        <div className="mt-10 glass-card p-6 rounded-3xl border border-glass-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Zap size={20} className="text-primary" /> Level {user?.level || 1} Explorer
            </h3>
            <span className="text-xs text-gray-400">{user?.xp_points || 0} / {((user?.level || 1) * 1000)} XP</span>
          </div>
          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${((user?.xp_points || 0) % 1000) / 10}%` }}
              className="h-full bg-gradient-to-r from-primary to-secondary"
            />
          </div>
        </div>

        <div className="mt-10">
          <h3 className="font-bold text-lg mb-4">{user?.bio || "No bio yet"}</h3>
          {user?.interests && user.interests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {user.interests.map(interest => (
                <span key={interest} className="px-3 py-1 bg-white/5 rounded-full text-xs">{interest}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;