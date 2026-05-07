import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Send, Image as ImageIcon, Smile, MoreVertical, ChevronLeft, MapPin, Loader2, MessageSquare } from 'lucide-react';
import api from '../api/axios';

const Chat = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch conversations
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await api.get('/chat/conversations');
      setConversations(res.data.conversations);
    } catch (err) {
      console.error('Fetch conversations error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const res = await api.get(`/chat/conversation/${userId}?limit=50`);
      setMessages(res.data.messages);
    } catch (err) {
      console.error('Fetch messages error:', err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;

    try {
      await api.post('/chat/send', {
        to_user_id: activeChat,
        message: message,
        message_type: 'text'
      });
      
      setMessage('');
      fetchMessages(activeChat);
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  const handleChatSelect = (userId) => {
    setActiveChat(userId);
    fetchMessages(userId);
  };

  const handleLocationRequest = async (toUserId) => {
    try {
      await api.post('/location/request', {
        to_user_id: toUserId,
        one_time: false,
        temp_duration: null
      });
      alert('Location request sent!');
    } catch (err) {
      console.error('Location request error:', err);
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-bg-dark">
      {/* Contacts List */}
      <div className={`w-full md:w-80 border-r border-glass-border flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-glass-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input type="text" placeholder="Search chats..." className="w-full bg-white/5 border border-glass-border rounded-xl py-2 pl-10 pr-4 text-sm" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.user_id}
              onClick={() => handleChatSelect(conv.user_id)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors ${activeChat === conv.user_id ? 'bg-primary/10 border-r-2 border-primary' : ''}`}
            >
              <div className="relative">
                <img src={conv.avatar_url || 'https://i.pravatar.cc/150'} className="w-12 h-12 rounded-2xl object-cover" alt="" />
                {conv.is_online && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-bg-dark rounded-full"></div>}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-white truncate">{conv.full_name}</h3>
                  <span className="text-[10px] text-gray-500">{new Date(conv.last_message_time).toLocaleTimeString()}</span>
                </div>
                <p className="text-xs text-gray-400 truncate">{conv.last_message}</p>
                {conv.unread_count > 0 && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {conv.unread_count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-glass-border flex items-center justify-between glass">
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveChat(null)} className="md:hidden p-2 text-gray-400">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={() => handleLocationRequest(activeChat)} className="p-2 bg-primary/20 rounded-xl text-primary">
                  <MapPin size={20} />
                </button>
                <div>
                  <h3 className="font-bold text-white leading-none mb-1">
                    {conversations.find(c => c.user_id === activeChat)?.full_name}
                  </h3>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-white transition-colors"><MoreVertical size={20} /></button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg._id} className={`flex ${msg.from_user_id === activeChat ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                    msg.from_user_id === activeChat 
                      ? 'glass border-glass-border text-gray-200 rounded-tl-none' 
                      : 'bg-primary text-white rounded-tr-none'
                  }`}>
                    {msg.message}
                    <p className={`text-[10px] mt-1 opacity-50 ${msg.from_user_id === activeChat ? 'text-left' : 'text-right'}`}>
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 glass border-t border-glass-border">
              <form className="flex items-center gap-2" onSubmit={sendMessage}>
                <button type="button" className="p-2 text-gray-400 hover:text-primary transition-colors"><Smile size={20} /></button>
                <button type="button" className="p-2 text-gray-400 hover:text-primary transition-colors"><ImageIcon size={20} /></button>
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-1 bg-white/5 border border-glass-border rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <button className={`p-2 rounded-xl transition-all ${message.trim() ? 'bg-primary text-white scale-110' : 'text-gray-500'}`}>
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <MessageSquare size={40} className="opacity-20" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Select a chat</h2>
            <p className="max-w-xs text-sm">Start a conversation with people around you!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;