import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Send, Image as ImageIcon, Smile, MoreVertical, ChevronLeft, MapPin } from 'lucide-react';

const Chat = () => {
  const [activeChat, setActiveChat] = useState(1);
  const [message, setMessage] = useState('');

  const contacts = [
    { id: 1, name: 'Rahul', lastMsg: 'See you at the park!', time: '12:45 PM', online: true, img: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'Anjali', lastMsg: 'Sent a location request', time: 'Yesterday', online: false, img: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, name: 'Siddharth', lastMsg: 'Hey, are you around?', time: '2 days ago', online: true, img: 'https://i.pravatar.cc/150?u=3' },
  ];

  const messages = [
    { id: 1, text: 'Hey! Are you near Connaught Place?', sender: 'them', time: '10:00 AM' },
    { id: 2, text: 'Yes, just reached! Where are you?', sender: 'me', time: '10:05 AM' },
    { id: 3, text: 'I\'m near the metro station. Sending you my location access request.', sender: 'them', time: '10:06 AM' },
    { id: 4, type: 'location-request', sender: 'them', time: '10:06 AM' },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-bg-dark">
      {/* Contacts List */}
      <div className={`w-full md:w-80 border-r border-glass-border flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-glass-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full bg-white/5 border border-glass-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setActiveChat(contact.id)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-colors ${activeChat === contact.id ? 'bg-primary/10 border-r-2 border-primary' : ''}`}
            >
              <div className="relative">
                <img src={contact.img} className="w-12 h-12 rounded-2xl object-cover" alt="" />
                {contact.online && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-bg-dark rounded-full"></div>}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-white truncate">{contact.name}</h3>
                  <span className="text-[10px] text-gray-500">{contact.time}</span>
                </div>
                <p className="text-xs text-gray-400 truncate">{contact.lastMsg}</p>
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
                <img src={contacts.find(c => c.id === activeChat)?.img} className="w-10 h-10 rounded-xl" alt="" />
                <div>
                  <h3 className="font-bold text-white leading-none mb-1">{contacts.find(c => c.id === activeChat)?.name}</h3>
                  <p className="text-[10px] text-green-500">Active now</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-white transition-colors"><MoreVertical size={20} /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  {msg.type === 'location-request' ? (
                    <div className="glass-card border-primary/30 p-4 rounded-2xl max-w-xs">
                      <div className="flex items-center gap-3 mb-3 text-primary">
                        <MapPin size={24} />
                        <p className="font-bold text-sm text-white">Location Access Request</p>
                      </div>
                      <p className="text-xs text-gray-300 mb-4">Rahul wants to see your exact location to find you easily.</p>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-primary text-white text-xs font-bold py-2 rounded-lg hover:bg-primary/90 transition-colors">Accept</button>
                        <button className="flex-1 glass text-white text-xs font-bold py-2 rounded-lg hover:bg-white/10 transition-colors">Decline</button>
                      </div>
                    </div>
                  ) : (
                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                      msg.sender === 'me' 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'glass border-glass-border text-gray-200 rounded-tl-none'
                    }`}>
                      {msg.text}
                      <p className={`text-[10px] mt-1 opacity-50 ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>{msg.time}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 glass border-t border-glass-border">
              <form className="flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
                <button type="button" className="p-2 text-gray-400 hover:text-primary transition-colors"><Smile size={20} /></button>
                <button type="button" className="p-2 text-gray-400 hover:text-primary transition-colors"><ImageIcon size={20} /></button>
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-1 bg-white/5 border border-glass-border rounded-xl py-2 px-4 text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <button 
                  className={`p-2 rounded-xl transition-all ${message.trim() ? 'bg-primary text-white scale-110' : 'text-gray-500'}`}
                  disabled={!message.trim()}
                >
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
            <p className="max-w-xs text-sm">Start a conversation with people around you. Make sure to be respectful!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
