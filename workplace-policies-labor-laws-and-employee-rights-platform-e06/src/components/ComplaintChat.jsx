import React, { useState, useEffect, useRef } from 'react';
import { supabaseClient } from '../lib/supabaseClient';
import Icon from './Icon';

export const ComplaintChat = ({ complaintId, userId, userRole = 'employee', employeeName }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  // Fetch initial messages
  const fetchMessages = async (silent = false) => {
    if (!supabaseClient) return;
    try {
      const { data, error } = await supabaseClient
        .from('complaint_messages')
        .select('*')
        .eq('complaint_id', complaintId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching chat messages:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Scroll to bottom helper
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchMessages();

    if (!supabaseClient) return;

    // Real-time subscription
    const channel = supabaseClient
      .channel(`chat-complaint-${complaintId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'complaint_messages',
          filter: `complaint_id=eq.${complaintId}`,
        },
        (payload) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        }
      )
      .subscribe();

    // Polling fallback (runs every 5 seconds to comply with requirements)
    const pollInterval = setInterval(() => {
      fetchMessages(true);
    }, 5000);

    return () => {
      supabaseClient.removeChannel(channel);
      clearInterval(pollInterval);
    };
  }, [complaintId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || sending || !supabaseClient) return;
    setSending(true);
    try {
      const tempId = `temp-${Date.now()}`;
      const newMessage = {
        id: tempId,
        complaint_id: complaintId,
        sender_id: userId,
        sender_role: userRole,
        body: text.trim(),
        created_at: new Date().toISOString(),
      };

      // Optimistic update
      setMessages((prev) => [...prev, newMessage]);
      const messageText = text.trim();
      setText('');

      const { error } = await supabaseClient.from('complaint_messages').insert({
        complaint_id: complaintId,
        sender_id: userId,
        sender_role: userRole,
        body: messageText,
      });

      if (error) {
        // Rollback optimistic update on error
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        throw error;
      }
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message: ' + err.message);
    } finally {
      setSending(false);
      fetchMessages(true);
    }
  };

  const formatTime = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  return (
    <div
      className="mt-6 rounded-2xl border flex flex-col overflow-hidden"
      style={{
        background: 'rgba(21, 23, 40, 0.2)',
        borderColor: 'var(--line)',
        height: '360px',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between border-b"
        style={{ borderColor: 'var(--line)', background: 'var(--paper-deep)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--teal)] animate-pulse" />
          <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--ink)' }}>
            Resolution Live Chat
          </span>
        </div>
        <span className="text-[11px] font-mono" style={{ color: 'var(--stone)' }}>
          {userRole === 'hr' ? 'HR Console' : `Employee ID: ${userId.slice(0, 8)}...`}
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-custom">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <span className="w-5 h-5 border-2 border-[var(--coral)] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-65 p-6">
            <Icon name="mail" size={24} style={{ color: 'var(--stone)' }} className="mb-2" />
            <p className="text-[12.5px] font-semibold" style={{ color: 'var(--ink-soft)' }}>
              No messages yet
            </p>
            <p className="text-[10.5px] max-w-[220px] mt-1" style={{ color: 'var(--stone)' }}>
              Send a query to the resolving coordinators regarding this complaint.
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const isSelf = m.sender_id === userId;
            return (
              <div key={m.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm transition-all`}
                  style={{
                    background: isSelf ? 'var(--coral)' : 'var(--card)',
                    color: isSelf ? '#fff' : 'var(--ink)',
                    border: isSelf ? 'none' : '1px solid var(--line)',
                    borderBottomRightRadius: isSelf ? '4px' : '16px',
                    borderBottomLeftRadius: isSelf ? '16px' : '4px',
                  }}
                >
                  <div className="text-[10px] font-bold opacity-60 mb-0.5 uppercase tracking-wider">
                    {isSelf ? 'You' : m.sender_role === 'hr' ? 'HR Coordinator' : 'Employee'}
                  </div>
                  <p className="text-[13px] leading-relaxed break-words">{m.body}</p>
                  <div className="text-[9px] text-right mt-1 opacity-50 font-mono">
                    {formatTime(m.created_at)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t flex gap-2"
        style={{ borderColor: 'var(--line)', background: 'var(--paper-deep)' }}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message to your coordinator..."
          disabled={loading}
          className="focus-ring flex-1 px-4 py-2.5 rounded-full text-xs border outline-none transition-all duration-200"
          style={{
            background: 'var(--card)',
            borderColor: 'var(--line)',
            color: 'var(--ink)',
          }}
        />
        <button
          type="submit"
          disabled={!text.trim() || sending || loading}
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
          style={{ background: 'var(--coral)', color: '#fff' }}
          aria-label="Send message"
        >
          {sending ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Icon name="send" size={14} className="text-white" />
          )}
        </button>
      </form>
    </div>
  );
};

export default ComplaintChat;
