import { useState } from 'react';
import api from '../lib/api';

export function ChatPage() {
  const [message, setMessage] = useState('What are total expenses this month?');
  const [answer, setAnswer] = useState('Ask the assistant anything about your finance data.');
  const [loading, setLoading] = useState(false);

  const ask = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/api/chat', { message });
      setAnswer(response.data.answer ?? 'No answer returned');
    } catch {
      setAnswer('The assistant is unavailable right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="glass-card rounded-[2rem] p-6">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Financial AI assistant</p>
        <h2 className="mt-2 text-2xl font-semibold">Ask about expenses, budgets, and approvals</h2>
        <form className="mt-6 space-y-4" onSubmit={ask}>
          <textarea className="input-field min-h-40" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Thinking...' : 'Ask FinanceFlow AI'}
          </button>
        </form>
        <div className="mt-6 rounded-3xl border border-line bg-slate-500/5 p-4 text-sm text-muted">
          The backend must never expose database credentials or sensitive infrastructure data. It only returns derived finance insights.
        </div>
      </section>
      <section className="glass-card rounded-[2rem] p-6">
        <p className="text-sm uppercase tracking-[0.24em] text-muted">Response</p>
        <div className="mt-4 rounded-3xl border border-line bg-panel p-5 text-sm leading-7">{answer}</div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {['What are total expenses this month?', 'Which department spent the most?', 'Show pending approvals.', 'Generate financial summary.'].map((prompt) => (
            <button key={prompt} className="soft-button justify-start text-left" type="button" onClick={() => setMessage(prompt)}>
              {prompt}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
