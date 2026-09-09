import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Search, Trash2, CheckCircle2, Reply, Clock, User, MessageSquare, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { messagesService } from '../../services/messagesService';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const { t, isRTL } = useLanguage();
  const { isLight } = useTheme();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await messagesService.getAll();
      setMessages(res.data || []);
      if (res.data && res.data.length > 0 && !selectedMessage) {
        setSelectedMessage(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await messagesService.markRead(id);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: 1 } : m));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(prev => ({ ...prev, is_read: 1 }));
      }
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(isRTL ? 'هل أنت متأكد من حذف هذه الرسالة؟' : 'Are you sure you want to delete this message?')) return;
    try {
      await messagesService.delete(id);
      const updated = messages.filter(m => m.id !== id);
      setMessages(updated);
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(updated[0] || null);
      }
    } catch (err) {
      console.error('Failed to delete message', err);
    }
  };

  const filteredMessages = messages.filter(m => {
    const q = search.toLowerCase();
    return (
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.subject?.toLowerCase().includes(q) ||
      m.message?.toLowerCase().includes(q)
    );
  });

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-display font-bold flex items-center gap-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <Mail className={isLight ? 'text-sky-600' : 'text-cyan-400'} />
            <span>{isRTL ? 'رسائل التواصل' : 'Contact Messages'}</span>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500 text-white">
                {unreadCount} {isRTL ? 'جديدة' : 'New'}
              </span>
            )}
          </h1>
          <p className={`text-sm mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            {isRTL ? 'جميع الرسائل الواردة من نموذج "تواصل معي" في الموقع' : 'All incoming messages from the contact form'}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={18} className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
          <input
            type="text"
            placeholder={isRTL ? 'بحث بالاسم، البريد، الموضوع...' : 'Search messages...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full py-2.5 rounded-xl outline-none transition-all ${
              isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'
            } ${
              isLight
                ? 'bg-white border-slate-200 text-slate-900 focus:border-sky-500'
                : 'bg-slate-900/80 border-slate-700/60 text-white focus:border-cyan-500'
            } border text-sm`}
          />
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className={`p-12 rounded-3xl border text-center ${
          isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-slate-900/50 border-slate-800 text-slate-400'
        }`}>
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-semibold">{isRTL ? 'لا توجد رسائل واردة حتى الآن' : 'No messages received yet'}</p>
          <p className="text-sm mt-1 opacity-70">
            {isRTL ? 'عندما يرسل أي زائر رسالة من نموذج التواصل ستظهر هنا فوراً' : 'When visitors submit the contact form, messages will appear here'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Messages List Column */}
          <div className="lg:col-span-5 space-y-3">
            {filteredMessages.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id;
              return (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (!msg.is_read) handleMarkRead(msg.id);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? isLight
                        ? 'bg-sky-50 border-sky-300 shadow-sm'
                        : 'bg-cyan-950/40 border-cyan-500/50 shadow-lg'
                      : isLight
                      ? 'bg-white border-slate-200 hover:border-slate-300'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {!msg.is_read && (
                        <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
                      )}
                      <span className={`text-sm font-bold truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {msg.name}
                      </span>
                    </div>
                    <span className={`text-[11px] font-mono ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                      {new Date(msg.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className={`text-xs font-semibold truncate mb-1 ${isLight ? 'text-sky-700' : 'text-cyan-400'}`}>
                    {msg.subject}
                  </p>

                  <p className={`text-xs line-clamp-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {msg.message}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Selected Message Detail Column */}
          <div className="lg:col-span-7">
            {selectedMessage ? (
              <div className={`p-6 sm:p-8 rounded-3xl border ${
                isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800'
              }`}>
                {/* Actions bar */}
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
                        isLight
                          ? 'bg-sky-600 text-white hover:bg-sky-700'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500'
                      }`}
                    >
                      <Reply size={14} />
                      <span>{isRTL ? 'رد عبر البريد' : 'Reply via Email'}</span>
                    </a>

                    {!selectedMessage.is_read && (
                      <button
                        onClick={() => handleMarkRead(selectedMessage.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition ${
                          isLight ? 'border-slate-200 text-slate-700 hover:bg-slate-100' : 'border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span>{isRTL ? 'تحديد كمقروء' : 'Mark Read'}</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className={`p-2 rounded-xl border transition ${
                      isLight ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-red-900/40 text-red-400 hover:bg-red-950/30'
                    }`}
                    title={isRTL ? 'حذف الرسالة' : 'Delete message'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Sender Info */}
                <div className="space-y-4 mb-6">
                  <div>
                    <span className={`text-[11px] font-mono uppercase tracking-wider ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                      {isRTL ? 'الموضوع' : 'Subject'}
                    </span>
                    <h2 className={`text-xl font-bold font-display mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {selectedMessage.subject}
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-xs">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-cyan-400" />
                      <span className={`font-semibold ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
                        {selectedMessage.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-cyan-400" />
                      <a href={`mailto:${selectedMessage.email}`} className="text-cyan-500 hover:underline">
                        {selectedMessage.email}
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-slate-400" />
                      <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>
                        {new Date(selectedMessage.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message Body */}
                <div className={`p-6 rounded-2xl border leading-relaxed text-sm sm:text-base font-sans whitespace-pre-wrap ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950/60 border-slate-800/80 text-slate-200'
                }`}>
                  {selectedMessage.message}
                </div>
              </div>
            ) : (
              <div className={`p-12 rounded-3xl border text-center ${
                isLight ? 'bg-white border-slate-200 text-slate-400' : 'bg-slate-900/50 border-slate-800 text-slate-500'
              }`}>
                <p>{isRTL ? 'اختر رسالة من القائمة لعرض تفاصيلها' : 'Select a message to view details'}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
