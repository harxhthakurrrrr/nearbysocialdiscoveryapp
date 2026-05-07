import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications?limit=20');
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

  return (
    <div className="relative">
      <button onClick={() => setShow(!show)} className="relative p-2 text-gray-400 hover:text-white">
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {show && (
        <div className="absolute right-0 top-10 w-80 glass-card rounded-2xl z-50 border border-glass-border">
          <div className="flex justify-between items-center p-3 border-b border-glass-border">
            <h3 className="font-bold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-primary">Mark all read</button>
            )}
          </div>
          <div className="max-h-96 overflow-auto">
            {loading ? (
              <div className="p-4 text-center"><Loader2 className="animate-spin text-primary" /></div>
            ) : notifications.length === 0 ? (
              <p className="p-4 text-center text-gray-400">No notifications</p>
            ) : (
              notifications.map(n => (
                <div key={n._id} onClick={() => markAsRead(n._id)} className={`p-3 border-b border-glass-border cursor-pointer ${!n.is_read ? 'bg-primary/10' : ''}`}>
                  <p className="text-sm font-bold text-white">{n.title}</p>
                  <p className="text-xs text-gray-400">{n.message}</p>
                </div>
              ))
            )}
          </div>
          <button 
            onClick={() => { setShow(false); navigate('/notifications'); }}
            className="w-full text-center text-primary text-sm py-2 border-t border-glass-border hover:bg-white/5"
          >
            View all →
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;