import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../components/Icon';
import { IconBadge, colorVar, colorSoft } from '../components/IconBadge';
import AnimatedCounter from '../components/AnimatedCounter';
import SectionHeading from '../components/SectionHeading';

export const Dashboard = ({
  stats,
  complaints = [],
  onNav,
  employee = {},
  notifications = [],
  setHighlight,
  onNotificationClick,
}) => {
  const activeCount = complaints.filter((c) => c.stage < 3).length;
  const underInvestigationCount = complaints.filter((c) => c.stage === 2).length;
  const unreadNotifCount = notifications.filter((n) => n.unread).length;
  const resolvedCount = complaints.filter((c) => c.stage === 3).length;
  const totalCount = complaints.length;
  const attentionCount = activeCount;
  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  // Compute real category breakdown from actual complaints
  const CATEGORY_META = [
    { name: 'Salary & Wages', key: 'Salary', icon: 'wallet', color: 'teal', lawId: 'wages-act' },
    { name: 'Leave Rights', key: 'Leave', icon: 'clock', color: 'coral', lawId: 'maternity' },
    { name: 'Workplace Safety', key: 'Safety', icon: 'shield', color: 'blue', lawId: 'safety-act' },
    { name: 'Anti-Harassment', key: 'Harassment', icon: 'shieldAlert', color: 'purple', lawId: 'posh' },
    { name: 'Working Hours', key: 'Hours', icon: 'clock', color: 'stone', lawId: 'hours-act' },
    { name: 'Other', key: 'Other', icon: 'folder', color: 'ink', lawId: null },
  ];

  const categoryCounts = CATEGORY_META.map((cat) => ({
    ...cat,
    count: complaints.filter((c) => c.category === cat.key).length,
    pct: totalCount > 0 ? Math.round((complaints.filter((c) => c.category === cat.key).length / totalCount) * 100) : 0,
  })).filter((c) => c.count > 0);

  const widgets = [
    { label: 'Total Complaints Filed', value: totalCount, icon: 'flag', color: 'ink' },
    { label: 'Active Complaints', value: activeCount, icon: 'activity', color: 'coral' },
    { label: 'Resolved Complaints', value: resolvedCount, icon: 'checkCircle', color: 'teal' },
    { label: 'Open Requiring Attention', value: attentionCount, icon: 'shieldAlert', color: 'blue' },
  ];

  const recentComplaints = complaints.slice(0, 3);

  const lawUpdates = [
    { t: 'Minimum Wage Law revised for FY26', d: '2 days ago', lawId: 'min-wage', cat: 'Salary', color: 'teal' },
    { t: 'New nursing-break guidance under Maternity Benefit Law', d: '1 week ago', lawId: 'maternity', cat: 'Leave', color: 'coral' },
    { t: 'Overtime threshold clarification issued', d: '3 weeks ago', lawId: 'hours-act', cat: 'Hours', color: 'teal' },
  ];

  return (
    <section className="py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <SectionHeading
          eyebrow="Your activity"
          eyebrowIcon="activity"
          title="Employee Dashboard"
          sub="A quick look at what you've explored, what you've filed, and what's changed recently."
        />

        {/* Welcome Section */}
        <div
          className="tab-card rounded-3xl border p-6 md:p-8 mb-8 relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6"
          style={{ background: 'var(--card)', borderColor: 'var(--line)' }}
        >
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] font-medium" style={{ color: 'var(--coral)' }}>
              EMPLOYEE SELF-SERVICE
            </span>
            <h3 className="font-display text-2xl md:text-3xl font-semibold mt-1" style={{ color: 'var(--ink)' }}>
              Welcome Back, {employee?.name || 'Employee'}
            </h3>
            <p className="text-[13.5px] mt-1.5 max-w-lg leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Access your workplace rights, explore laws and policies, and monitor compliance status from your central employee portal.
            </p>
          </div>
          <div className="flex flex-row sm:flex-col gap-3 shrink-0 w-full sm:w-auto text-left">
            <div
              className="flex-1 px-4 py-2.5 rounded-xl border flex items-center gap-3"
              style={{ background: 'var(--paper-deep)', borderColor: 'var(--line)' }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--coral)' }} />
              <span className="text-[12.5px] font-medium" style={{ color: 'var(--ink)' }}>
                {activeCount} Active {activeCount === 1 ? 'Complaint' : 'Complaints'}
              </span>
            </div>
            <div
              className="flex-1 px-4 py-2.5 rounded-xl border flex items-center gap-3"
              style={{ background: 'var(--paper-deep)', borderColor: 'var(--line)' }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--purple)' }} />
              <span className="text-[12.5px] font-medium" style={{ color: 'var(--ink)' }}>
                {underInvestigationCount} Under Investigation
              </span>
            </div>
            <div
              className="flex-1 px-4 py-2.5 rounded-xl border flex items-center gap-3"
              style={{ background: 'var(--paper-deep)', borderColor: 'var(--line)' }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--blue)' }} />
              <span className="text-[12.5px] font-medium" style={{ color: 'var(--ink)' }}>
                {unreadNotifCount} Unread {unreadNotifCount === 1 ? 'Notification' : 'Notifications'}
              </span>
            </div>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {widgets.map((w) => (
            <div
              key={w.label}
              className="tab-card rounded-2xl border p-5 transition-all hover:-translate-y-1 hover:shadow-md"
              style={{ background: 'var(--card)', borderColor: 'var(--line)' }}
            >
              <IconBadge icon={w.icon} color={w.color} size={38} />
              <div className="font-display text-2xl font-semibold mt-3" style={{ color: 'var(--ink)' }}>
                <AnimatedCounter to={w.value} />
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--ink-soft)' }}>
                {w.label}
              </div>
            </div>
          ))}
        </div>

        {/* Recent Complaints Section */}
        <div className="tab-card rounded-2xl border p-6 mb-8" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h4 className="font-display font-semibold text-[15px]" style={{ color: 'var(--ink)' }}>
              Recent Complaints
            </h4>
            <button
              onClick={() => onNav('complaints')}
              className="focus-ring text-[12px] font-semibold flex items-center gap-1"
              style={{ color: 'var(--coral)' }}
            >
              View all tracking <Icon name="chevronRight" size={13} />
            </button>
          </div>
          {recentComplaints.length === 0 ? (
            <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>
              No complaints filed yet.
            </p>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--line)' }}>
              {recentComplaints.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onNav('complaints');
                    setHighlight({ type: 'complaint', refId: c.id, nonce: Date.now() });
                  }}
                  className="focus-ring w-full text-left py-3.5 flex items-center justify-between gap-4 transition-all hover:bg-[var(--paper-deep)] rounded-lg px-2 -mx-2 hover:brightness-95"
                >
                  <div className="flex items-center gap-3">
                    <Icon name="flag" size={16} className="shrink-0" style={{ color: 'var(--coral)' }} />
                    <span className="font-mono text-sm font-semibold" style={{ color: 'var(--ink)' }}>
                      {c.id}
                    </span>
                    <span className="text-[13.5px] font-medium" style={{ color: 'var(--ink-soft)' }}>
                      {c.category}
                    </span>
                  </div>
                  <span className="text-xs font-mono" style={{ color: 'var(--stone)' }}>
                    Filed {c.date}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Left Column */}
          <div className="flex flex-col gap-5">
            {/* Workplace Concerns by Category */}
            <div
              className="tab-card rounded-2xl border p-6 flex flex-col"
              style={{ background: 'var(--card)', borderColor: 'var(--line)' }}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-display font-semibold text-[15px]" style={{ color: 'var(--ink)' }}>
                    Workplace Concerns by Category
                  </h4>
                  <button className="focus-ring text-[16px] font-bold hover:opacity-85" style={{ color: 'var(--stone)' }} aria-label="More options">
                    •••
                  </button>
                </div>
                <p className="text-[12px] mb-5 leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                  Distribution of logged employee grievances and inquiries across major rights categories.
                </p>
              </div>

              {/* Category breakdown — computed from real complaints */}
              {totalCount === 0 ? (
                <div className="py-10 text-center">
                  <Icon name="flag" size={32} className="mx-auto mb-3" style={{ color: 'var(--line)' }} />
                  <p className="text-[13px] font-medium" style={{ color: 'var(--ink-soft)' }}>
                    No complaints filed yet.
                  </p>
                  <p className="text-[12px] mt-1" style={{ color: 'var(--stone)' }}>
                    File a complaint to see your category breakdown here.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center py-4 mb-5" style={{ borderBottom: '1px solid var(--line)' }}>
                    <div className="relative w-[140px] h-[140px] shrink-0">
                      <svg width="100%" height="100%" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--line)" strokeWidth="6" style={{ opacity: 0.15 }} />
                        {(() => {
                          const circ = 2 * Math.PI * 40;
                          let offset = 0;
                          const colors = ['var(--teal)', 'var(--coral)', 'var(--blue)', 'var(--purple)', 'var(--stone)', 'var(--ink)'];
                          return categoryCounts.map((cat, i) => {
                            const arc = (cat.pct / 100) * circ;
                            const el = (
                              <circle
                                key={cat.key}
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                strokeWidth="8"
                                strokeDasharray={`${arc} ${circ}`}
                                strokeDashoffset={-offset}
                                transform="rotate(-90 50 50)"
                                style={{ stroke: colors[i % colors.length] }}
                              />
                            );
                            offset += arc;
                            return el;
                          });
                        })()}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="font-display text-lg font-bold leading-none" style={{ color: 'var(--ink)' }}>
                          {totalCount}
                        </span>
                        <span className="text-[9px] font-semibold tracking-wider uppercase mt-1" style={{ color: 'var(--stone)' }}>
                          Total
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3.5">
                    {categoryCounts.map((cat, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          cat.lawId &&
                          onNav &&
                          (onNav('laws'), setHighlight({ type: 'law', refId: cat.lawId, nonce: Date.now() }))
                        }
                        className="focus-ring w-full text-left group flex items-center gap-3.5 transition-all p-2.5 rounded-2xl border"
                        style={{ background: 'var(--card)', borderColor: 'var(--line)' }}
                      >
                        <div
                          className="rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                          style={{ width: 36, height: 36, background: colorSoft(cat.color), color: colorVar(cat.color) }}
                        >
                          <Icon name={cat.icon} size={16} strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[12.5px] font-semibold" style={{ color: 'var(--ink)' }}>
                              {cat.name}
                            </span>
                            <span className="text-[11px] font-mono font-medium" style={{ color: 'var(--stone)' }}>
                              {cat.count} {cat.count === 1 ? 'case' : 'cases'} ({cat.pct}%)
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--paper-deep)' }}>
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${cat.pct}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, delay: i * 0.05 }}
                              className="h-full rounded-full"
                              style={{ background: colorVar(cat.color) }}
                            />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Resolution Performance */}
            <div className="tab-card rounded-2xl border p-6" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-display font-semibold text-[15px]" style={{ color: 'var(--ink)' }}>
                  Resolution Performance
                </h4>
                <button className="focus-ring text-[16px] font-semibold hover:opacity-85" style={{ color: 'var(--stone)' }} aria-label="More options">
                  <span className="font-bold">•••</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                {/* Total Filed */}
                <div
                  className="rounded-xl border p-3 flex flex-col justify-between"
                  style={{ background: 'var(--paper-deep)', borderColor: 'var(--line)' }}
                >
                  <div className="flex items-center gap-2">
                    <IconBadge icon="flag" color="ink" size={32} />
                    <span className="text-[11px] font-medium leading-tight" style={{ color: 'var(--ink-soft)' }}>
                      Total Complaints
                    </span>
                  </div>
                  <div className="mt-2.5">
                    <div className="font-display text-lg font-semibold" style={{ color: 'var(--ink)' }}>
                      {totalCount}
                    </div>
                    <div className="text-[10px] font-medium mt-1" style={{ color: 'var(--stone)' }}>
                      Complaints filed by you
                    </div>
                  </div>
                </div>

                {/* Resolution Rate */}
                <div
                  className="rounded-xl border p-3 flex flex-col justify-between"
                  style={{ background: 'var(--paper-deep)', borderColor: 'var(--line)' }}
                >
                  <div className="flex items-center gap-2">
                    <IconBadge icon="checkCircle" color="teal" size={32} />
                    <span className="text-[11px] font-medium leading-tight" style={{ color: 'var(--ink-soft)' }}>
                      Resolution Rate
                    </span>
                  </div>
                  <div className="mt-2.5">
                    <div className="font-display text-lg font-semibold" style={{ color: 'var(--ink)' }}>
                      {totalCount > 0 ? resolutionRate + '%' : '—'}
                    </div>
                    <div className="text-[10px] font-medium mt-1" style={{ color: 'var(--stone)' }}>
                      {resolvedCount} of {totalCount} resolved
                    </div>
                  </div>
                </div>

                {/* Active Cases */}
                <div
                  className="rounded-xl border p-3 flex flex-col justify-between"
                  style={{ background: 'var(--paper-deep)', borderColor: 'var(--line)' }}
                >
                  <div className="flex items-center gap-2">
                    <IconBadge icon="activity" color="coral" size={32} />
                    <span className="text-[11px] font-medium leading-tight" style={{ color: 'var(--ink-soft)' }}>
                      Active Cases
                    </span>
                  </div>
                  <div className="mt-2.5">
                    <div className="font-display text-lg font-semibold" style={{ color: 'var(--ink)' }}>
                      {activeCount}
                    </div>
                    <div className="text-[10px] font-medium mt-1" style={{ color: 'var(--stone)' }}>
                      In progress
                    </div>
                  </div>
                </div>

                {/* Unread Notifications */}
                <div
                  className="rounded-xl border p-3 flex flex-col justify-between"
                  style={{ background: 'var(--paper-deep)', borderColor: 'var(--line)' }}
                >
                  <div className="flex items-center gap-2">
                    <IconBadge icon="bell" color="blue" size={32} />
                    <span className="text-[11px] font-medium leading-tight" style={{ color: 'var(--ink-soft)' }}>
                      Unread Notifications
                    </span>
                  </div>
                  <div className="mt-2.5">
                    <div className="font-display text-lg font-semibold" style={{ color: 'var(--ink)' }}>
                      {unreadNotifCount}
                    </div>
                    <div className="text-[10px] font-medium mt-1" style={{ color: 'var(--stone)' }}>
                      Awaiting your review
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-5">
            {/* Latest Labour Law Updates */}
            <div className="tab-card rounded-2xl border p-6" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-display font-semibold text-[15px]" style={{ color: 'var(--ink)' }}>
                  Latest Labour Law Updates
                </h4>
                <button
                  onClick={() => onNav('laws')}
                  className="focus-ring text-[12px] font-semibold flex items-center gap-1"
                  style={{ color: 'var(--blue)' }}
                >
                  View all
                </button>
              </div>
              <div className="space-y-3.5">
                {lawUpdates.map((u, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onNav('laws');
                      setHighlight({ type: 'law', refId: u.lawId, nonce: Date.now() });
                    }}
                    className="focus-ring w-full text-left flex items-center gap-3.5 transition-all hover:bg-[var(--paper-deep)] p-3 rounded-2xl border"
                    style={{ background: 'var(--card)', borderColor: 'var(--line)' }}
                  >
                    <div
                      className="rounded-xl flex items-center justify-center shrink-0"
                      style={{ width: 40, height: 40, background: 'var(--paper-deep)', color: 'var(--stone)' }}
                    >
                      <Icon name="fileText" size={18} strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold leading-snug truncate" style={{ color: 'var(--ink)' }}>
                        {u.t}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-semibold" style={{ color: 'var(--teal)' }}>
                          Law Update
                        </span>
                        <span className="text-[11px] font-mono" style={{ color: 'var(--stone)' }}>
                          {u.d}
                        </span>
                      </div>
                    </div>
                    <Icon name="chevronRight" size={14} style={{ color: 'var(--stone)' }} className="shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="tab-card rounded-2xl border p-6" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
              <h4 className="font-display font-semibold text-[15px] mb-3" style={{ color: 'var(--ink)' }}>
                Quick Actions
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'complaints', label: 'File Complaint', icon: 'plus', color: 'coral' },
                  { id: 'complaints', label: 'Track Status', icon: 'activity', color: 'teal' },
                  { id: 'laws', label: 'Labour Laws', icon: 'scale', color: 'blue' },
                  { id: 'policies', label: 'View Policies', icon: 'fileText', color: 'purple' },
                  { id: 'profile', label: 'Open Profile', icon: 'user', color: 'stone' },
                ].map((act, index) => (
                  <button
                    key={index}
                    onClick={() => onNav(act.id)}
                    className="focus-ring flex flex-col items-center justify-center p-3 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-sm text-center"
                    style={{ background: 'var(--paper-deep)', borderColor: 'var(--line)' }}
                  >
                    <IconBadge icon={act.icon} color={act.color} size={28} />
                    <span className="text-[12px] font-semibold mt-2" style={{ color: 'var(--ink)' }}>
                      {act.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Help & Support */}
            <div className="tab-card rounded-2xl border p-6" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
              <h4 className="font-display font-semibold text-[15px] mb-2" style={{ color: 'var(--ink)' }}>
                Help & Support
              </h4>
              <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
                Need workplace assistance or have direct concerns? Connect with resource teams.
              </p>
              <div className="space-y-2">
                <a
                  href="mailto:hr@meridianlog.com"
                  className="focus-ring flex items-center justify-between p-2.5 rounded-xl border text-[12.5px] font-semibold"
                  style={{ background: 'var(--paper-deep)', borderColor: 'var(--line)', color: 'var(--ink)' }}
                >
                  <span className="flex items-center gap-2">
                    <Icon name="mail" size={14} /> Contact HR
                  </span>
                  <Icon name="chevronRight" size={13} />
                </a>
                <button
                  onClick={() => onNav('complaints')}
                  className="focus-ring w-full flex items-center justify-between p-2.5 rounded-xl border text-[12.5px] font-semibold"
                  style={{ background: 'var(--paper-deep)', borderColor: 'var(--line)', color: 'var(--ink)' }}
                >
                  <span className="flex items-center gap-2">
                    <Icon name="flag" size={14} /> Raise Complaint
                  </span>
                  <Icon name="chevronRight" size={13} />
                </button>
                <button
                  onClick={() => onNav('policies')}
                  className="focus-ring w-full flex items-center justify-between p-2.5 rounded-xl border text-[12.5px] font-semibold"
                  style={{ background: 'var(--paper-deep)', borderColor: 'var(--line)', color: 'var(--ink)' }}
                >
                  <span className="flex items-center gap-2">
                    <Icon name="info" size={14} /> Workplace Assistance
                  </span>
                  <Icon name="chevronRight" size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
