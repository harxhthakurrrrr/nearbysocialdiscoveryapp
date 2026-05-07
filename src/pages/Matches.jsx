import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, MapPin, Search, Loader2, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await api.get('/social/friends');
      console.log('Matches data:', res.data);
      setMatches(res.data.friends || []);
    } catch (err) {
      console.error('Fetch matches error:', err);
      setError(err.response?.data?.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const startChat = (userId) => {
    navigate(`/chat?user=${userId}`);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-bg-dark">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-bg-dark">
        <div className="text-center text-gray-400">
          <p className="text-red-500 mb-2">{error}</p>
          <button 
            onClick={fetchMatches}
            className="px-4 py-2 bg-primary rounded-xl text-white text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-bg-dark p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Your Matches</h2>
            <p className="text-gray-400 text-sm">
              {matches.length} {matches.length === 1 ? 'person' : 'people'} who liked you back!
            </p>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
            <Heart size={24} fill="currentColor" />
          </div>
        </div>

        {/* Matches Grid */}
        {matches.length === 0 ? (
          <div className="glass-card p-10 rounded-2xl text-center text-gray-400">
            <UserPlus size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No matches yet</p>
            <p className="text-sm mt-2">Start swiping right to find people!</p>
            <button 
              onClick={() => navigate('/discover')}
              className="mt-4 px-6 py-2 bg-primary rounded-xl text-white text-sm hover:bg-primary/90 transition-all"
            >
              Discover People →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {matches.map((match, idx) => (
              <motion.div 
                key={match._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer glass-card border border-glass-border hover:border-primary/50 transition-all"
              >
                {/* Avatar */}
                <img 
                  src={match.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${match.username}`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt={match.full_name}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-bold text-white text-sm">{match.full_name}</h3>
                  <p className="text-[10px] text-gray-300">@{match.username}</p>
                  <button 
                    onClick={() => startChat(match._id)}
                    className="w-full mt-2 bg-primary py-1.5 rounded-lg text-white text-xs flex items-center justify-center gap-1 hover:bg-primary/80 transition-all"
                  >
                    <MessageCircle size={12} />
                    Chat Now
                  </button>
                </div>

                {/* Online Status */}
                <div className={`absolute top-2 right-2 w-2.5 h-2.5 rounded-full border-2 border-bg-dark ${
                  match.is_online ? 'bg-green-500' : 'bg-gray-500'
                }`}></div>

                {/* Match Badge */}
                <div className="absolute top-2 left-2 bg-primary/80 backdrop-blur-sm rounded-full px-2 py-0.5 text-[10px] text-white font-bold">
                  ❤️ Match!
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Tips Section */}
        {matches.length > 0 && (
          <div className="mt-10 glass-card p-6 rounded-2xl border border-glass-border text-center">
            <h3 className="text-lg font-bold text-white mb-2">✨ Pro Tips</h3>
            <p className="text-sm text-gray-400">
              💬 Send a message to start a conversation<br />
              📍 Share your location to meet up<br />
              🎁 More matches = more XP points!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;