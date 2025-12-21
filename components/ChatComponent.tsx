import React, { useState, useEffect, useRef } from 'react';
import { Api } from '../services/mockApi';
import { ChatMessage, User } from '../types';

interface ChatComponentProps {
  requestId: string;
  currentUser: User;
  onClose: () => void;
}

export const ChatComponent: React.FC<ChatComponentProps> = ({ requestId, currentUser, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const msgs = await Api.getMessages(requestId);
      setMessages(msgs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll for new messages
    return () => clearInterval(interval);
  }, [requestId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const tempMsg = newMessage;
    setNewMessage(''); // Optimistic clear

    try {
      await Api.sendMessage(requestId, currentUser.id, currentUser.name, tempMsg);
      await fetchMessages();
    } catch (e) {
      console.error('Failed to send message');
      setNewMessage(tempMsg); // Restore on failure
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col h-[500px]">
      <div className="p-4 bg-indigo-600 text-white rounded-t-lg flex justify-between items-center">
        <div className="flex items-center">
            <span className="material-icons mr-2">forum</span>
            <h3 className="font-medium">Community Chat</h3>
        </div>
        <button onClick={onClose} className="hover:bg-indigo-700 p-1 rounded">
            <span className="material-icons text-sm">close</span>
        </button>
      </div>

      <div className="flex-grow p-4 overflow-y-auto bg-gray-50" ref={scrollRef}>
        {loading ? (
          <div className="text-center text-gray-400 mt-4">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
              <p>No messages yet.</p>
              <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-lg px-4 py-2 shadow-sm ${
                    isMe ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800 border border-gray-200'
                  }`}>
                    {!isMe && <p className="text-xs text-gray-500 mb-1 font-bold">{msg.senderName}</p>}
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-3 border-t bg-white rounded-b-lg">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};