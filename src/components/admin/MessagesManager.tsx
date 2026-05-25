'use client';

import React, { useState, useEffect } from 'react';
import { Message } from '@/lib/types';
import { getMessages, markMessageRead, deleteMessage } from '@/lib/db';
import { Mail, MailOpen, Trash2, Calendar, RefreshCw } from 'lucide-react';

export default function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchMessagesList = async () => {
    setLoading(true);
    const data = await getMessages();
    setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessagesList();
  }, []);

  const handleToggleRead = async (id: string, currentReadStatus: boolean) => {
    setMessage(null);
    const success = await markMessageRead(id, !currentReadStatus);
    if (success) {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, is_read: !currentReadStatus } : msg))
      );
    } else {
      setMessage({ type: 'error', text: 'Failed to update message status.' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    setMessage(null);
    const success = await deleteMessage(id);
    if (success) {
      setMessage({ type: 'success', text: 'Message deleted successfully.' });
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } else {
      setMessage({ type: 'error', text: 'Failed to delete message.' });
    }
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Mail size={20} className="text-indigo-600" />
            Contact Messages
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-0.5 ml-2 bg-pink-100 border border-pink-200 text-pink-600 text-[10px] font-bold rounded-full">
                {unreadCount} Unread
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 font-light mt-1">
            Read and manage inquiries submitted by public recruiters and visitors.
          </p>
        </div>
        <button
          onClick={fetchMessagesList}
          className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg border border-slate-200 transition-all"
          title="Reload Inbox"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {message && (
        <p
          className={`text-xs font-semibold ${
            message.type === 'success' ? 'text-emerald-600' : 'text-pink-600'
          }`}
        >
          {message.text}
        </p>
      )}

      {/* Inbox List */}
      <div>
        {loading ? (
          <div className="text-slate-400 text-xs py-4 flex items-center gap-2">
            <RefreshCw size={14} className="animate-spin text-slate-400" />
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-slate-400 text-xs py-10 text-center italic border border-dashed border-slate-200 rounded-2xl">
            Your inbox is empty. No messages received yet.
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-5 border rounded-2xl transition-all ${
                  msg.is_read
                    ? 'border-slate-150 bg-white/30'
                    : 'border-indigo-100 bg-indigo-50/5 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Sender details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-bold ${msg.is_read ? 'text-slate-700' : 'text-slate-900'}`}>
                        {msg.name}
                      </span>
                      <span className="text-xs text-slate-400 font-light">({msg.email})</span>
                    </div>
                    {msg.subject && (
                      <p className={`text-xs font-semibold ${msg.is_read ? 'text-slate-655' : 'text-indigo-600'}`}>
                        Subject: {msg.subject}
                      </p>
                    )}
                  </div>

                  {/* Timestamps / Read Control buttons */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {msg.created_at ? new Date(msg.created_at).toLocaleDateString() : ''}
                    </span>

                    <button
                      onClick={() => handleToggleRead(msg.id, msg.is_read)}
                      className={`p-1.5 border rounded-lg transition-all ${
                        msg.is_read
                          ? 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700'
                          : 'bg-indigo-50 border-indigo-100 text-indigo-650 hover:bg-indigo-100'
                      }`}
                      title={msg.is_read ? 'Mark as Unread' : 'Mark as Read'}
                    >
                      {msg.is_read ? <MailOpen size={14} /> : <Mail size={14} />}
                    </button>

                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="p-1.5 bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-650 rounded-lg transition-all"
                      title="Delete message"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Message Body Content */}
                <p className="mt-3.5 text-xs text-slate-600 font-light leading-relaxed whitespace-pre-wrap bg-white/50 p-3 rounded-xl border border-slate-100">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
