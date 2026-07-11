import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../components/Icon';
import FloatCard from '../components/FloatCard';
import { Eyebrow } from '../components/SectionHeading';

export const Hero = ({ onNav }) => {
  return (
    <section className="relative pt-10 md:pt-14 pb-24 md:pb-32 overflow-hidden grain">
      <div
        aria-hidden
        className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full opacity-50"
        style={{ background: 'radial-gradient(circle, var(--teal-soft), transparent 70%)' }}
      />
      <div
        aria-hidden
        className="absolute top-20 -left-32 w-[420px] h-[420px] rounded-full opacity-60"
        style={{ background: 'radial-gradient(circle, var(--coral-soft), transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-5 md:px-8 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Eyebrow icon="compass">Your workplace, decoded</Eyebrow>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="font-display text-[2.6rem] md:text-6xl leading-[1.04] font-semibold"
              style={{ color: 'var(--ink)' }}
            >
              Know Your Rights.
              <br />
              <span style={{ color: 'var(--coral)' }}>Work</span> with Confidence.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.16 }}
              className="mt-6 text-base md:text-lg leading-relaxed max-w-md"
              style={{ color: 'var(--ink-soft)' }}
            >
              Understand workplace policies, labour laws, and employee rights through simple, visual, interactive experiences —
              built for the moment you actually need them.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <button
                onClick={() => onNav('finder')}
                className="focus-ring px-6 py-3.5 rounded-full font-semibold text-sm flex items-center gap-2"
                style={{ background: 'var(--ink)', color: 'var(--paper)' }}
              >
                Explore Rights <Icon name="arrowRight" size={15} />
              </button>
              <button
                onClick={() => onNav('finder')}
                className="focus-ring px-6 py-3.5 rounded-full font-semibold text-sm flex items-center gap-2 border-2"
                style={{ borderColor: 'var(--ink)', color: 'var(--ink)' }}
              >
                Find Solutions <Icon name="search" size={15} />
              </button>
            </motion.div>
          </div>

          <div className="relative h-[420px] hidden md:block">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="w-64 h-64 rounded-[2.5rem] flex items-center justify-center"
                style={{ background: 'var(--ink)' }}
              >
                <Icon name="shield" size={88} className="text-white/90" strokeWidth={1.2} />
              </motion.div>
            </div>
            <FloatCard
              icon="wallet"
              label="Salary Protected"
              sub="Payment of Wages Law"
              color="teal"
              delay={0.5}
              style={{ top: '4%', left: '-2%' }}
            />
            <FloatCard
              icon="shieldAlert"
              label="Harassment Reported"
              sub="Confidential · Day 1"
              color="coral"
              delay={0.8}
              style={{ top: '12%', right: '-4%' }}
            />
            <FloatCard
              icon="clock"
              label="Leave Approved"
              sub="2 days processing"
              color="teal"
              delay={1.1}
              style={{ bottom: '18%', left: '-8%' }}
            />
            <FloatCard
              icon="scale"
              label="Equal Pay Verified"
              sub="Equal Remuneration Law"
              color="coral"
              delay={1.4}
              style={{ bottom: '2%', right: '2%' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
