import React, { useState, useEffect } from 'react';
import { X, MapPin, Check, XCircle, Loader2 } from 'lucide-react';
import api from '../api/axios';

const LocationRequestModal = ({ onClose }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/location/requests');
      setRequests(res.data.requests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const respond = async (requestId, accept) => {
    try {
      await api.post(`/location/request/${requestId}/respond`, { accept });
      fetchRequests();
      alert(accept ? 'Location shared!' : 'Request rejected');
    } catch (err) {
      alert('Failed to respond');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]">
      <div className="glass-card p-6 rounded-2xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2 text-white">
            <MapPin size={20} /> Location Requests
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
            <X size={20} />
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" /></div>
        ) : requests.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No pending requests</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-auto">
            {requests.map(req => (
              <div key={req._id} className="p-3 glass rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-white">{req.from_user_name}</p>
                  <p className="text-xs text-gray-400">wants your exact location</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => respond(req._id, true)} className="p-2 bg-green-500 rounded-lg hover:bg-green-600 transition-colors">
                    <Check size={16} />
                  </button>
                  <button onClick={() => respond(req._id, false)} className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors">
                    <XCircle size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationRequestModal;