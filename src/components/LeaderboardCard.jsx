import React from 'react';
import { Trophy, Award, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LeaderboardCard = ({ user, rank }) => {
  const navigate = useNavigate();

  const getRankIcon = () => {
    if (rank === 1) return <Trophy className="text-yellow-500" size={20} />;
    if (rank === 2) return <Award className="text-gray-400" size={20} />;
    if (rank === 3) return <Star className="text-orange-500" size={20} />;
    return <span className="text-gray-500 text-sm">#{rank}</span>;
  };

  return (
    <div 
      onClick={() => navigate(`/profile/${user._id}`)}
      className="flex items-center gap-3 p-3 glass-card rounded-xl cursor-pointer hover:bg-white/5 transition-all"
    >
      {/* Rank */}
      <div className="w-8 text-center">
        {getRankIcon()}
      </div>

      {/* Avatar */}
      <img 
        src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
        className="w-10 h-10 rounded-full object-cover"
        alt=""
      />

      {/* Name & XP */}
      <div className="flex-1">
        <p className="font-bold text-white text-sm">{user.full_name}</p>
        <p className="text-xs text-gray-400">{user.xp_points} XP</p>
      </div>

      {/* Level */}
      <div className="text-right">
        <p className="text-xs text-primary font-bold">Lvl {user.level}</p>
      </div>
    </div>
  );
};

export default LeaderboardCard;