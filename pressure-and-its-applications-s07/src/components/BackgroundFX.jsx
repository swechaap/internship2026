import React from 'react';
export default function BackgroundFX() {
  const particles = Array.from({ length: 42 }, (_, index) => ({
    id: index,
    left: `${(index * 23) % 100}%`,
    delay: `${(index % 9) * 0.45}s`,
    duration: `${9 + (index % 6)}s`,
    size: `${4 + (index % 5)}px`
  }));

  return (
    <div className="background-fx" aria-hidden="true">
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <div className="aurora aurora-three" />
      <div className="physics-grid" />
      <div className="particle-field">
        {particles.map((particle) => (
          <span
            key={particle.id}
            className="particle"
            style={{
              left: particle.left,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
              width: particle.size,
              height: particle.size
            }}
          />
        ))}
      </div>
      <div className="liquid-wave wave-a" />
      <div className="liquid-wave wave-b" />
    </div>
  );
}

