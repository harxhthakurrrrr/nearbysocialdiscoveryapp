import React, { useState, useEffect } from 'react';
import { Trophy, Loader2, Medal } from 'lucide-react';
import api from '../api/axios';
import LeaderboardCard from '../components/LeaderboardCard';  // ✅ IMPORT ADD KARO

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/social/leaderboard?limit=50');
      console.log('Leaderboard data:', res.data);
      setLeaderboard(res.data.leaderboard || []);
    } catch (err) {
      console.error('Leaderboard error:', err);
      setError(err.response?.data?.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-bg-dark">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-bg-dark">
        <div className="text-center text-gray-400">
          <p className="text-red-500 mb-2">{error}</p>
          <button 
            onClick={fetchLeaderboard}
            className="px-4 py-2 bg-primary rounded-xl text-white text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary/20 rounded-2xl">
            <Trophy className="text-yellow-500" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
            <p className="text-gray-400 text-sm">Top users by XP points</p>
          </div>
        </div>

        {/* List - Using LeaderboardCard Component */}
        <div className="space-y-3">
          {leaderboard.length === 0 ? (
            <div className="glass-card p-10 rounded-2xl text-center text-gray-400">
              <Medal size={48} className="mx-auto mb-3 opacity-30" />
              <p>No users found on leaderboard yet.</p>
              <p className="text-xs mt-2">Start swiping and earn XP!</p>
            </div>
          ) : (
            leaderboard.map((user, index) => (
              <LeaderboardCard 
                key={user._id} 
                user={user} 
                rank={index + 1} 
              />
            ))
          )}
        </div>

        {/* Footer Note */}
        {leaderboard.length > 0 && (
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>🏆 Top 3 get special badges</p>
            <p className="mt-1">✨ Click on any user to view profile</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;