import React, { useMemo } from 'react';

export default function BackgroundParticles() {
  const particles = useMemo(() => {
    const list = [];
    const particleTypes = ['atom', 'flask', 'molecule', 'sparkle'];
    const speedClasses = ['animate-float-slow', 'animate-float-medium', 'animate-float-fast'];
    
    // Generate 25 floating particles with random traits
    for (let i = 0; i < 25; i++) {
      const type = particleTypes[i % particleTypes.length];
      const speed = speedClasses[i % speedClasses.length];
      const size = Math.floor(Math.random() * 30) + 20; // 20px to 50px
      const left = Math.random() * 100; // 0% to 100%
      const top = Math.random() * 100; // 0% to 100%
      const delay = Math.random() * 6; // 0s to 6s delay
      const opacity = Math.random() * 0.12 + 0.04; // low opacity for background
      
      list.push({ id: i, type, speed, size, left, top, delay, opacity });
    }
    return list;
  }, []);

  const renderShape = (type) => {
    switch (type) {
      case 'atom':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="2.5" fill="currentColor"/>
            <ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(30 12 12)"/>
            <ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(150 12 12)"/>
          </svg>
        );
      case 'flask':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 3h12M8 3v4.5L4.5 16A2 2 0 006.1 19h11.8a2 2 0 001.6-3L16 7.5V3"/>
            <line x1="6" y1="14" x2="18" y2="14" strokeDasharray="1 1"/>
            <circle cx="9" cy="16.5" r="0.7" fill="currentColor"/>
            <circle cx="13" cy="15.5" r="0.7" fill="currentColor"/>
            <circle cx="11" cy="11" r="0.5" fill="currentColor"/>
          </svg>
        );
      case 'molecule':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="5" r="2.5" fill="currentColor"/>
            <circle cx="5" cy="17" r="2.5" fill="currentColor"/>
            <circle cx="19" cy="17" r="2.5" fill="currentColor"/>
            <line x1="12" y1="7.5" x2="6.2" y2="14.5"/>
            <line x1="12" y1="7.5" x2="17.8" y2="14.5"/>
            <line x1="7.5" y1="17" x2="16.5" y2="17"/>
          </svg>
        );
      case 'sparkle':
      default:
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.3-6.3l-2.1 2.1M8.8 15.2l-2.1 2.1m12.7 0l-2.1-2.1M8.8 8.8L6.7 6.7"/>
          </svg>
        );
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-tr from-dark-bg-start via-dark-bg-mid to-dark-bg-end opacity-95"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-theme opacity-10 blur-[150px] animate-pulse-glow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-theme opacity-10 blur-[150px] animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
      
      {/* Floating Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute ${p.speed} text-indigo-400/80`}
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
            transform: 'translate3d(0, 0, 0)'
          }}
        >
          {renderShape(p.type)}
        </div>
      ))}
    </div>
  );
}
