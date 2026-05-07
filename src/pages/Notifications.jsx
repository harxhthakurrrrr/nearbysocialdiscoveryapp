import React, { useState, useEffect } from 'react';
import { Bell, Loader2, CheckCheck } from 'lucide-react';
import api from '../api/axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications?limit=50');
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    await api.post(`/notifications/${id}/read`);
    fetchNotifications();
  };

  const markAllRead = async () => {
    await api.post('/notifications/read-all');
    fetchNotifications();
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-bg-dark">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-sm text-primary flex items-center gap-1">
              <CheckCheck size={16} /> Mark all read
            </button>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <div className="glass-card p-10 text-center text-gray-400">
            <Bell size={48} className="mx-auto mb-3 opacity-30" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(n => (
              <div key={n._id} onClick={() => markAsRead(n._id)} className={`glass-card p-4 rounded-2xl cursor-pointer transition-all ${!n.is_read ? 'border-primary/50 bg-primary/5' : ''}`}>
                <p className="font-bold text-white">{n.title}</p>
                <p className="text-sm text-gray-400 mt-1">{n.message}</p>
                <p className="text-xs text-gray-500 mt-2">{new Date(n.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;