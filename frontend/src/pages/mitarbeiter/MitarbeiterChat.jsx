import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, Send, ArrowLeft, Shield } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MitarbeiterChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  const token = localStorage.getItem('employee_token');
  const headers = { Authorization: `Bearer ${token}` };
  const employeeData = JSON.parse(localStorage.getItem('employee_data') || '{}');

  // Find the admin to chat with
  const findAdmin = useCallback(async () => {
    try {
      // Check existing conversations first
      const convoRes = await axios.get(`${BACKEND_URL}/api/chat/conversations`, { headers });
      const convos = convoRes.data.conversations || [];
      if (convos.length > 0) {
        // Extract admin id from conversation_id
        const convoId = convos[0].conversation_id;
        const parts = convoId.split('_');
        const myId = employeeData.id;
        const partnerId = parts[0] === myId ? parts[1] : parts[0];
        setAdminId(partnerId);
        return partnerId;
      }
      // Default admin id
      setAdminId('admin-001');
      return 'admin-001';
    } catch (e) {
      setAdminId('admin-001');
      return 'admin-001';
    }
  }, []);

  const fetchMessages = useCallback(async (aId) => {
    if (!aId) return;
    try {
      const res = await axios.get(`${BACKEND_URL}/api/chat/messages/${aId}`, { headers });
      setMessages(res.data.messages || []);
    } catch (e) {
      console.error('Error fetching messages:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const aId = await findAdmin();
      fetchMessages(aId);
      pollRef.current = setInterval(() => fetchMessages(aId), 5000);
    };
    init();
    return () => clearInterval(pollRef.current);
  }, [findAdmin, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !adminId) return;
    setSending(true);
    try {
      await axios.post(`${BACKEND_URL}/api/chat/send`, {
        recipient_id: adminId,
        message: newMessage.trim()
      }, { headers });
      setNewMessage('');
      fetchMessages(adminId);
    } catch (e) {
      console.error('Error sending:', e);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden" data-testid="employee-chat-page">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100">
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
          <Shield size={18} className="text-emerald-600" />
        </div>
        <div>
          <p className="font-semibold text-gray-900">Precision Labs Support</p>
          <p className="text-xs text-gray-500">Nachrichten an den Administrator</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageCircle size={40} className="mb-2 text-gray-300" />
            <p className="text-sm">Noch keine Nachrichten</p>
            <p className="text-xs">Schreiben Sie dem Administrator</p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.sender_role !== 'admin';
            return (
              <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                  isMe
                    ? 'bg-emerald-500 text-white rounded-br-md'
                    : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                }`}>
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                  <p className={`text-xs mt-1 ${isMe ? 'text-emerald-100' : 'text-gray-400'}`}>
                    {formatTime(msg.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Nachricht schreiben..."
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-900 focus:outline-none focus:border-emerald-500"
            data-testid="chat-message-input"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            className="p-2.5 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            data-testid="chat-send-btn"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MitarbeiterChat;
