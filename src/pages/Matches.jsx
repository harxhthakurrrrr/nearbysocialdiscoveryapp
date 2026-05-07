import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, MapPin, Search, Loader2 } from 'lucide-react';
import api from '../api/axios';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await api.get('/social/friends');
      setMatches(res.data.friends);
    } catch (err) {
      console.error('Fetch matches error:', err);
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
    <div className="min-h-[calc(100vh-4rem)] bg-bg-dark p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Your Matches</h2>
            <p className="text-gray-400 text-sm">People who liked you back!</p>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
            <Heart size={24} fill="currentColor" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {matches.map((match, idx) => (
            <motion.div 
              key={match._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="relative aspect-[3/4] rounded-3xl overflow-hidden group cursor-pointer"
            >
              <img src={match.avatar_url || 'https://via.placeholder.com/300x400'} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-bold text-white text-lg">{match.full_name}</h3>
                <div className="flex gap-2 mt-2">
                  <button className="flex-1 bg-primary py-2 rounded-xl text-white flex items-center justify-center gap-1 text-sm">
                    <MessageCircle size={14} /> Chat
                  </button>
                </div>
              </div>
              {match.is_online && <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 border-2 border-bg-dark rounded-full"></div>}
            </motion.div>
          ))}
        </div>

        {matches.length === 0 && (
          <div className="glass-card p-8 rounded-[2.5rem] border border-glass-border text-center mt-8">
            <p className="text-gray-400">No matches yet. Start swiping to find people!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;