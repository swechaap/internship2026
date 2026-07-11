import React, { useState, useEffect, useRef } from 'react';
import Icon from '../components/Icon';
import IconBadge from '../components/IconBadge';
import AutoHeight from '../components/AutoHeight';
import SectionHeading from '../components/SectionHeading';
import { POLICIES } from '../data/policies';

const PolicyCard = React.forwardRef(({ policy, expanded, onToggle, isHighlighted }, ref) => (
  <div
    ref={ref}
    className="tab-card rounded-2xl border p-5"
    style={{
      background: 'var(--card)',
      borderColor: isHighlighted ? 'var(--coral)' : 'var(--line)',
      boxShadow: isHighlighted ? '0 0 0 3px var(--coral-soft)' : 'none',
      transition: 'border-color 0.4s, box-shadow 0.4s',
    }}
  >
    <div className="flex items-center gap-3.5">
      <IconBadge icon={policy.icon} color="ink" size={44} />
      <div className="flex-1 min-w-0">
        <div className="font-display font-semibold text-[15px]" style={{ color: 'var(--ink)' }}>
          {policy.title}
        </div>
        <div className="text-[12.5px] mt-0.5 leading-snug" style={{ color: 'var(--ink-soft)' }}>
          {policy.summary}
        </div>
      </div>
    </div>
    <button
      onClick={onToggle}
      className="focus-ring mt-4 flex items-center gap-1.5 text-xs font-semibold"
      style={{ color: 'var(--coral)' }}
    >
      {expanded ? 'Hide details' : 'Learn More'}
      <span
        style={{
          display: 'inline-flex',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
        }}
      >
        <Icon name="chevronDown" size={13} />
      </span>
    </button>
    <AutoHeight open={expanded}>
      <div className="mt-4 pt-4 space-y-4" style={{ borderTop: '1px solid var(--line)' }}>
        {policy.timeline.map((step, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: 'var(--coral)' }} />
              {i < policy.timeline.length - 1 && (
                <div className="w-px flex-1 mt-1" style={{ background: 'var(--line)', minHeight: '20px' }} />
              )}
            </div>
            <div className="pb-1">
              <div className="text-[13px] font-semibold" style={{ color: 'var(--ink)' }}>
                {step.t}
              </div>
              <div className="text-[12.5px] leading-snug mt-0.5" style={{ color: 'var(--ink-soft)' }}>
                {step.d}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AutoHeight>
  </div>
));

PolicyCard.displayName = 'PolicyCard';

export const PoliciesCenter = ({ highlight, clearHighlight, policies = POLICIES }) => {
  const [openId, setOpenId] = useState(null);
  const cardRefs = useRef({});

  useEffect(() => {
    if (highlight && highlight.type === 'policy') {
      const policy = policies.find((p) => p.id === highlight.refId);
      if (policy) {
        setOpenId(policy.id);
        const t = setTimeout(() => {
          const el = cardRefs.current[policy.id];
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 80);
        const clearT = setTimeout(() => clearHighlight && clearHighlight(), 2400);
        return () => {
          clearTimeout(t);
          clearTimeout(clearT);
        };
      }
    }
  }, [highlight, policies, clearHighlight]);

  return (
    <section className="py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <SectionHeading
          eyebrow="From law to daily practice"
          eyebrowIcon="fileText"
          title="Workplace Policies Center"
          sub="The everyday rules your company runs on, broken into the steps that actually happen, in order."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ alignItems: 'flex-start' }}>
          {policies.map((p) => (
            <PolicyCard
              key={p.id}
              ref={(el) => (cardRefs.current[p.id] = el)}
              policy={p}
              expanded={openId === p.id}
              onToggle={() => setOpenId(openId === p.id ? null : p.id)}
              isHighlighted={highlight && highlight.type === 'policy' && highlight.refId === p.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PoliciesCenter;
