import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../components/Icon';
import Pill from '../components/Pill';
import SectionHeading from '../components/SectionHeading';
import { LAWS } from '../data/laws';

const LawModal = ({ law, onClose }) => (
  <AnimatePresence>
    {law && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg rounded-3xl p-7 max-h-[85vh] overflow-y-auto"
          style={{ background: 'var(--card)', border: '1px solid var(--line)' }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider" style={{ color: 'var(--coral)' }}>
                {law.category} · {law.importance} priority
              </span>
              <h3 className="font-display text-2xl font-semibold mt-1" style={{ color: 'var(--ink)' }}>
                {law.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="focus-ring p-1.5 rounded-full shrink-0"
              style={{ color: 'var(--stone)' }}
            >
              <Icon name="x" size={20} />
            </button>
          </div>
          <p className="text-[14px] leading-relaxed mt-4" style={{ color: 'var(--ink-soft)' }}>
            {law.summary}
          </p>

          <div className="mt-5 rounded-xl p-4" style={{ background: 'var(--paper-deep)' }}>
            <div className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--ink)' }}>
              Who this protects
            </div>
            <p className="text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
              {law.protects}
            </p>
          </div>

          <div className="mt-5">
            <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--teal)' }}>
              Employee benefits
            </div>
            <ul className="space-y-1.5 text-[13.5px]" style={{ color: 'var(--ink-soft)' }}>
              {law.benefits.map((b, i) => (
                <li key={i} className="flex gap-2">
                  <Icon
                    name="checkCircle"
                    size={14}
                    className="shrink-0 mt-0.5"
                    style={{ color: 'var(--teal)' }}
                  />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 rounded-xl p-4" style={{ background: 'var(--coral-soft)' }}>
            <div className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--coral)' }}>
              Example situation
            </div>
            <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--ink)' }}>
              {law.example}
            </p>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export const LawExplorer = ({ onView, highlight, clearHighlight, laws = LAWS }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [openLaw, setOpenLaw] = useState(null);
  const cardRefs = useRef({});
  const cats = ['All', ...Array.from(new Set(laws.map((l) => l.category)))];

  const filtered = laws.filter(
    (l) =>
      (filter === 'All' || l.category === filter) &&
      (l.title.toLowerCase().includes(search.toLowerCase()) ||
        l.summary.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    if (highlight && highlight.type === 'law') {
      const law = laws.find((l) => l.id === highlight.refId);
      if (law) {
        setSearch('');
        setFilter('All');
        if (onView) onView(law.id);
        const t = setTimeout(() => {
          const el = cardRefs.current[law.id];
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 80);
        const clearT = setTimeout(() => clearHighlight && clearHighlight(), 2400);
        return () => {
          clearTimeout(t);
          clearTimeout(clearT);
        };
      }
    }
  }, [highlight, laws, onView, clearHighlight]);

  return (
    <section className="py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <SectionHeading
          eyebrow="Discover the law"
          eyebrowIcon="scale"
          title="Labour Law Explorer"
          sub="The legal backbone behind every right. Search, filter by category, and tap any card for the plain-language breakdown."
        />

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Icon
              name="search"
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--stone)' }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search laws..."
              className="focus-ring w-full pl-11 pr-4 py-3 rounded-xl text-sm border"
              style={{ background: 'var(--card)', borderColor: 'var(--line)', color: 'var(--ink)' }}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {cats.map((c) => (
              <Pill key={c} active={filter === c} onClick={() => setFilter(c)} color="teal">
                {c}
              </Pill>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((law, i) => {
            const isHighlighted = highlight && highlight.type === 'law' && highlight.refId === law.id;
            return (
              <motion.button
                key={law.id}
                ref={(el) => (cardRefs.current[law.id] = el)}
                layout
                onClick={() => {
                  setOpenLaw(law);
                  if (onView) onView(law.id);
                }}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: (i % 6) * 0.04 }}
                className="focus-ring text-left tab-card rounded-2xl p-5 border hover:-translate-y-1 hover:shadow-md transition-all"
                style={{
                  background: 'var(--card)',
                  borderColor: isHighlighted ? 'var(--coral)' : 'var(--line)',
                  boxShadow: isHighlighted ? '0 0 0 3px var(--coral-soft)' : 'none',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="font-mono text-[10px] px-2 py-1 rounded-full uppercase tracking-wide"
                    style={{
                      background: law.importance === 'High' ? 'var(--coral-soft)' : 'var(--teal-soft)',
                      color: law.importance === 'High' ? 'var(--coral)' : 'var(--teal)',
                    }}
                  >
                    {law.importance} priority
                  </span>
                  <Icon name="fileText" size={16} style={{ color: 'var(--stone)' }} />
                </div>
                <h4 className="font-display font-semibold text-[15px] leading-snug" style={{ color: 'var(--ink)' }}>
                  {law.title}
                </h4>
                <p className="text-[13px] mt-2 leading-snug" style={{ color: 'var(--ink-soft)' }}>
                  {law.summary}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium" style={{ color: 'var(--coral)' }}>
                  See details <Icon name="chevronRight" size={13} />
                </div>
              </motion.button>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm" style={{ color: 'var(--ink-soft)' }}>
            No laws match your search.
          </div>
        )}
      </div>
      <LawModal law={openLaw} onClose={() => setOpenLaw(null)} />
    </section>
  );
};

export default LawExplorer;
