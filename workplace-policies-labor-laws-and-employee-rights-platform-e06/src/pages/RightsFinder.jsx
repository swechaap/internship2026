import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../components/Icon';
import Pill from '../components/Pill';
import { IconBadge } from '../components/IconBadge';
import SectionHeading from '../components/SectionHeading';
import { SCENARIOS } from '../data/scenarios';

export const RightsFinder = ({ onLog, onNav }) => {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(null);
  const examples = ['Salary delayed', 'Overtime without pay', 'Workplace harassment', 'Leave request rejected', 'Unsafe workplace'];

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return SCENARIOS.filter(
      (s) =>
        s.q.toLowerCase().includes(q) ||
        s.tags.some((t) => t.includes(q) || q.includes(t.split(' ')[0]))
    );
  }, [query]);

  const pick = (s) => {
    setActive(s);
    if (onLog) onLog(s.id);
  };

  return (
    <section className="py-10 md:py-14 relative">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <SectionHeading
          align="center"
          eyebrow="Describe it, don't search for it"
          eyebrowIcon="compass"
          title="Tell us what's happening at work"
          sub="No legal terms required. Describe your situation the way you'd tell a friend, and we'll surface the rights, laws, and exact next steps."
        />

        <div className="relative max-w-2xl mx-auto">
          <div className="relative">
            <Icon
              name="search"
              size={19}
              className="absolute left-5 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--stone)' }}
            />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(null);
              }}
              placeholder="Describe your workplace issue..."
              className="focus-ring w-full pl-14 pr-5 py-4.5 rounded-2xl text-[15px] shadow-sm border"
              style={{
                background: 'var(--card)',
                borderColor: 'var(--line)',
                color: 'var(--ink)',
                paddingTop: '1.1rem',
                paddingBottom: '1.1rem',
              }}
            />
          </div>
          <div className="flex gap-2 flex-wrap mt-4 justify-center">
            {examples.map((ex) => (
              <Pill
                key={ex}
                active={query === ex}
                onClick={() => {
                  setQuery(ex);
                  setActive(null);
                }}
              >
                {ex}
              </Pill>
            ))}
          </div>
        </div>

        <div className="mt-8 max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {query && !active && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {results.length === 0 ? (
                  <div className="text-center py-8 text-sm" style={{ color: 'var(--ink-soft)' }}>
                    No exact match yet — try one of the examples above.
                  </div>
                ) : (
                  results.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => pick(r)}
                      className="focus-ring w-full text-left tab-card glass rounded-2xl p-5 flex items-center justify-between gap-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        <IconBadge icon="alertTriangle" color="coral" size={42} />
                        <div>
                          <div className="font-semibold text-[15px]" style={{ color: 'var(--ink)' }}>
                            {r.q}
                          </div>
                          <div className="text-xs mt-0.5 font-mono" style={{ color: 'var(--ink-soft)' }}>
                            {r.rights.length} rights · {r.laws.length} laws · {r.actions.length} actions
                          </div>
                        </div>
                      </div>
                      <Icon name="chevronRight" size={18} style={{ color: 'var(--stone)' }} />
                    </button>
                  ))
                )}
              </motion.div>
            )}

            {active && (
              <motion.div
                key="active"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="tab-card rounded-3xl p-6 md:p-8 shadow-lg border"
                style={{ background: 'var(--card)', borderColor: 'var(--line)' }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <IconBadge icon="alertTriangle" color="coral" size={46} />
                    <h3 className="font-display text-xl font-semibold" style={{ color: 'var(--ink)' }}>
                      {active.q}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setActive(null);
                    }}
                    className="focus-ring p-1.5 rounded-full"
                    style={{ color: 'var(--stone)' }}
                  >
                    <Icon name="x" size={18} />
                  </button>
                </div>

                <div className="grid sm:grid-cols-3 gap-5 mt-6">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2.5" style={{ color: 'var(--teal)' }}>
                      <Icon name="shield" size={15} />
                      <span className="text-xs font-semibold uppercase tracking-wide">Your Rights</span>
                    </div>
                    <ul className="space-y-2 text-[13.5px] leading-snug" style={{ color: 'var(--ink-soft)' }}>
                      {active.rights.map((r, i) => (
                        <li key={i} className="flex gap-2">
                          <span style={{ color: 'var(--teal)' }}>•</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-2.5" style={{ color: 'var(--ink)' }}>
                      <Icon name="scale" size={15} />
                      <span className="text-xs font-semibold uppercase tracking-wide">Relevant Laws</span>
                    </div>
                    <ul className="space-y-2 text-[13.5px] leading-snug" style={{ color: 'var(--ink-soft)' }}>
                      {active.laws.map((l, i) => (
                        <li key={i} className="flex gap-2">
                          <span style={{ color: 'var(--ink)' }}>•</span>
                          {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-2.5" style={{ color: 'var(--coral)' }}>
                      <Icon name="flag" size={15} />
                      <span className="text-xs font-semibold uppercase tracking-wide">Suggested Actions</span>
                    </div>
                    <ol className="space-y-2 text-[13.5px] leading-snug" style={{ color: 'var(--ink-soft)' }}>
                      {active.actions.map((a, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="font-mono font-medium" style={{ color: 'var(--coral)' }}>
                            {i + 1}.
                          </span>
                          {a}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                <div className="mt-6 pt-5 flex flex-wrap gap-3" style={{ borderTop: '1px solid var(--line)' }}>
                  <button
                    onClick={() => onNav('complaints')}
                    className="focus-ring px-5 py-2.5 rounded-full text-sm font-semibold"
                    style={{ background: 'var(--coral)', color: '#fff' }}
                  >
                    Start a Complaint
                  </button>
                  <button
                    onClick={() => onNav('laws')}
                    className="focus-ring px-5 py-2.5 rounded-full text-sm font-semibold border-2"
                    style={{ borderColor: 'var(--ink)', color: 'var(--ink)' }}
                  >
                    Read Full Laws
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default RightsFinder;
