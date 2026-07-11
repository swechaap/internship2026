import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../components/Icon';
import Pill from '../components/Pill';
import { IconBadge, colorVar } from '../components/IconBadge';
import AutoHeight from '../components/AutoHeight';
import SectionHeading from '../components/SectionHeading';
import StatusBadge, { STAGES, STAGE_COLOR } from '../components/StatusBadge';
import ComplaintChat from '../components/ComplaintChat';

export const HR_STAFF = ['Priya Menon', 'Karthik Iyer', 'Fatima Sheikh', 'Rohan Desai'];

export const ComplaintTracker = ({
  complaints = [],
  onSubmit,
  highlight,
  clearHighlight,
  userId,
  userRole = 'employee',
}) => {
  const [mode, setMode] = useState('submit'); // submit | track
  const [form, setForm] = useState({ category: 'Harassment', desc: '' });
  const [expandedIds, setExpandedIds] = useState({});
  const cardRefs = useRef({});

  const toggleExpand = (id) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const submit = () => {
    if (!form.desc.trim()) return;
    const id = 'WR-' + Math.floor(10000 + Math.random() * 89999);
    const now = new Date();
    const c = {
      id,
      category: form.category,
      desc: form.desc,
      stage: 0,
      date: now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      hr: HR_STAFF[Math.floor(Math.random() * HR_STAFF.length)],
      resolutionDate: null,
      lastUpdated: now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    onSubmit(c);
    setForm({ category: 'Harassment', desc: '' });
    setMode('track');
    setExpandedIds((prev) => ({ ...prev, [id]: true })); // expand the newly submitted complaint
  };

  useEffect(() => {
    if (highlight && highlight.type === 'complaint') {
      setMode('track');
      setExpandedIds((prev) => ({ ...prev, [highlight.refId]: true }));
      const t = setTimeout(() => {
        const el = cardRefs.current[highlight.refId];
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 80);
      const clearT = setTimeout(() => clearHighlight && clearHighlight(), 2400);
      return () => {
        clearTimeout(t);
        clearTimeout(clearT);
      };
    }
  }, [highlight, clearHighlight]);

  return (
    <section className="py-10 md:py-14">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <SectionHeading
          eyebrow="When you need to act"
          eyebrowIcon="flag"
          title="Complaint Tracking"
          sub="File a grievance and follow it end to end — complaint ID, assigned HR, and live status, with no black box."
        />

        <div className="flex gap-2 mb-6 justify-center">
          <Pill active={mode === 'submit'} onClick={() => setMode('submit')} color="coral">
            Submit Complaint
          </Pill>
          <Pill active={mode === 'track'} onClick={() => setMode('track')} color="coral">
            Track Status {complaints.length > 0 && `(${complaints.length})`}
          </Pill>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'submit' ? (
            <motion.div
              key="submit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-xl mx-auto tab-card rounded-3xl border p-7"
              style={{ background: 'var(--card)', borderColor: 'var(--line)' }}
            >
              <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink)' }}>
                Category
              </label>
              <div className="flex gap-2 flex-wrap mt-2 mb-5">
                {['Harassment', 'Salary', 'Safety', 'Leave', 'Other'].map((c) => (
                  <Pill key={c} active={form.category === c} onClick={() => setForm({ ...form, category: c })}>
                    {c}
                  </Pill>
                ))}
              </div>
              <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink)' }}>
                What happened?
              </label>
              <textarea
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                rows={4}
                placeholder="Describe the issue with as much detail as you're comfortable sharing..."
                className="focus-ring w-full mt-2 p-4 rounded-xl text-sm border resize-none"
                style={{ background: 'var(--paper)', borderColor: 'var(--line)', color: 'var(--ink)' }}
              />
              <button
                onClick={submit}
                disabled={!form.desc.trim()}
                className="focus-ring mt-5 w-full py-3.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40"
                style={{ background: 'var(--coral)', color: '#fff' }}
              >
                Submit Complaint <Icon name="send" size={15} />
              </button>
              <p className="text-[11.5px] text-center mt-3" style={{ color: 'var(--stone)' }}>
                Submissions are confidential and routed to the appropriate internal channel.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="track"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              {complaints.length === 0 ? (
                <div className="text-center py-14">
                  <Icon name="folder" size={36} className="mx-auto mb-3" style={{ color: 'var(--stone)' }} />
                  <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
                    No complaints filed yet.
                  </p>
                  <button
                    onClick={() => setMode('submit')}
                    className="focus-ring mt-3 text-sm font-semibold underline"
                    style={{ color: 'var(--coral)' }}
                  >
                    File your first one
                  </button>
                </div>
              ) : (
                complaints.map((c) => {
                  const isHighlighted = highlight && highlight.type === 'complaint' && highlight.refId === c.id;
                  const expanded = !!expandedIds[c.id];
                  return (
                    <div
                      key={c.id}
                      ref={(el) => (cardRefs.current[c.id] = el)}
                      className="tab-card rounded-2xl border overflow-hidden"
                      style={{
                        background: 'var(--card)',
                        borderColor: isHighlighted ? 'var(--coral)' : 'var(--line)',
                        boxShadow: isHighlighted ? '0 0 0 3px var(--coral-soft)' : 'none',
                        transition: 'border-color 0.4s, box-shadow 0.4s',
                      }}
                    >
                      <div className="p-6">
                        {/* Clickable Card Header & Desc */}
                        <div onClick={() => toggleExpand(c.id)} className="cursor-pointer select-none">
                          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span
                                className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full"
                                style={{ background: 'var(--paper-deep)', color: 'var(--ink)' }}
                              >
                                {c.id}
                              </span>
                              <span className="text-xs" style={{ color: 'var(--stone)' }}>
                                {c.category} · filed {c.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <StatusBadge stage={c.stage} />
                              <span
                                style={{
                                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                  transition: 'transform 0.2s',
                                  display: 'inline-flex',
                                  color: 'var(--stone)',
                                }}
                              >
                                <Icon name="chevronDown" size={16} />
                              </span>
                            </div>
                          </div>
                          <p className="text-[13.5px] leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                            {c.desc}
                          </p>
                        </div>

                        <AutoHeight open={expanded}>
                          <div className="pt-5 border-t mt-4" style={{ borderColor: 'var(--line)' }}>
                            <div className="grid sm:grid-cols-3 gap-4 mb-7">
                              <div className="flex items-center gap-2.5">
                                <IconBadge icon="fileText" color="ink" size={36} />
                                <div>
                                  <div className="text-[10.5px] uppercase tracking-wide font-semibold" style={{ color: 'var(--stone)' }}>
                                    Complaint ID
                                  </div>
                                  <div className="text-[13px] font-medium font-mono" style={{ color: 'var(--ink)' }}>
                                    {c.id}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2.5">
                                <IconBadge icon="flag" color="coral" size={36} />
                                <div>
                                  <div className="text-[10.5px] uppercase tracking-wide font-semibold" style={{ color: 'var(--stone)' }}>
                                    Category
                                  </div>
                                  <div className="text-[13px] font-medium" style={{ color: 'var(--ink)' }}>
                                    {c.category}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2.5">
                                <IconBadge icon="userCheck" color="ink" size={36} />
                                <div>
                                  <div className="text-[10.5px] uppercase tracking-wide font-semibold" style={{ color: 'var(--stone)' }}>
                                    Assigned HR
                                  </div>
                                  <div className="text-[13px] font-medium" style={{ color: 'var(--ink)' }}>
                                    {c.hr}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2.5">
                                <IconBadge icon="calendar" color="blue" size={36} />
                                <div>
                                  <div className="text-[10.5px] uppercase tracking-wide font-semibold" style={{ color: 'var(--stone)' }}>
                                    Submission Date
                                  </div>
                                  <div className="text-[13px] font-medium" style={{ color: 'var(--ink)' }}>
                                    {c.date}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2.5">
                                <IconBadge icon="checkCircle" color={c.stage >= 3 ? 'teal' : 'coral'} size={36} />
                                <div>
                                  <div className="text-[10.5px] uppercase tracking-wide font-semibold" style={{ color: 'var(--stone)' }}>
                                    Resolution Date
                                  </div>
                                  <div className="text-[13px] font-medium" style={{ color: 'var(--ink)' }}>
                                    {c.stage >= 3 ? c.resolutionDate || 'Just now' : 'Pending'}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2.5">
                                <IconBadge icon="activity" color={STAGE_COLOR(c.stage)} size={36} />
                                <div>
                                  <div className="text-[10.5px] uppercase tracking-wide font-semibold" style={{ color: 'var(--stone)' }}>
                                    Last Updated
                                  </div>
                                  <div className="text-[13px] font-medium" style={{ color: 'var(--ink)' }}>
                                    {c.lastUpdated || c.resolutionDate || c.date}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="text-xs font-semibold uppercase tracking-wide mb-5" style={{ color: 'var(--ink)' }}>
                              Progress Timeline
                            </div>
                            <div className="relative flex justify-between mb-8">
                              <div className="absolute top-3 left-[12.5%] right-[12.5%] h-0.5" style={{ background: 'var(--line)' }} />
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(c.stage / (STAGES.length - 1)) * 75}%` }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute top-3 left-[12.5%] h-0.5"
                                style={{ background: 'var(--teal)' }}
                              />
                              {STAGES.map((s, i) => (
                                <div key={s} className="relative flex flex-col items-center" style={{ width: `${100 / STAGES.length}%` }}>
                                  <motion.div
                                    initial={{ scale: 0.6 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: i * 0.15 }}
                                    className="w-6 h-6 rounded-full flex items-center justify-center z-10"
                                    style={{
                                      background: i <= c.stage ? 'var(--teal)' : 'var(--card)',
                                      border: `2px solid ${i <= c.stage ? 'var(--teal)' : 'var(--line)'}`,
                                    }}
                                  >
                                    {i < c.stage || (i === c.stage && c.stage === STAGES.length - 1) ? (
                                      <Icon name="check" size={10} className="text-white" strokeWidth={3} />
                                    ) : i === c.stage ? (
                                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                    ) : null}
                                  </motion.div>
                                  <span
                                    className="text-[10.5px] mt-2 text-center font-medium"
                                    style={{ color: i <= c.stage ? 'var(--ink)' : 'var(--stone)' }}
                                  >
                                    {s}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Complaint Live Chat component integration */}
                            {userId && (
                              <div className="mt-6 border-t pt-6" style={{ borderColor: 'var(--line)' }}>
                                <ComplaintChat
                                  complaintId={c.id}
                                  userId={userId}
                                  userRole={userRole}
                                />
                              </div>
                            )}
                          </div>
                        </AutoHeight>
                      </div>
                    </div>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ComplaintTracker;
