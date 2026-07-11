import React, { useState } from 'react';
import Icon from '../components/Icon';
import { supabaseClient, initializeSupabaseClient } from '../lib/supabaseClient';

export const SupabaseSetup = ({ onConfigured }) => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    if (!url.trim() || !key.trim()) {
      setError('Please fill in both fields.');
      return;
    }
    try {
      const client = initializeSupabaseClient(url.trim(), key.trim());
      if (client) {
        window.localStorage.setItem('SB_URL', url.trim());
        window.localStorage.setItem('SB_KEY', key.trim());
        onConfigured();
      } else {
        setError('Could not establish a Supabase client connection.');
      }
    } catch (err) {
      setError('Invalid URL or Key format.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--paper)] grain">
      <div
        className="w-full max-w-md tab-card rounded-3xl border p-8 glass"
        style={{ background: 'var(--card)', borderColor: 'var(--line)' }}
      >
        <div className="flex flex-col items-center mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
          >
            <Icon name="settings" size={24} className="text-white" strokeWidth={2} />
          </div>
          <h2 className="font-display text-2xl font-bold text-center" style={{ color: 'var(--ink)' }}>
            Supabase Configuration
          </h2>
          <p className="text-xs text-center mt-1 max-w-[280px]" style={{ color: 'var(--ink-soft)' }}>
            To run Work Rights Hub full-stack, connect your Supabase database instance.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--stone)' }}>
              Supabase URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-project.supabase.co"
              required
              className="focus-ring w-full px-4 py-3 rounded-xl text-sm border"
              style={{ background: 'var(--paper)', borderColor: 'var(--line)', color: 'var(--ink)' }}
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--stone)' }}>
              Supabase Anon Key
            </label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              required
              className="focus-ring w-full px-4 py-3 rounded-xl text-sm border font-mono"
              style={{ background: 'var(--paper)', borderColor: 'var(--line)', color: 'var(--ink)' }}
            />
          </div>

          {error && <p className="text-xs font-semibold" style={{ color: 'var(--coral)' }}>{error}</p>}

          <button
            type="submit"
            className="focus-ring w-full py-3.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 mt-2"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
          >
            Connect Database <Icon name="arrowRight" size={15} />
          </button>
        </form>

        <div className="mt-6 pt-5 text-center border-t text-[11px]" style={{ borderColor: 'var(--line)', color: 'var(--stone)' }}>
          Credentials are saved locally in your browser storage.
        </div>
      </div>
    </div>
  );
};

export default SupabaseSetup;
