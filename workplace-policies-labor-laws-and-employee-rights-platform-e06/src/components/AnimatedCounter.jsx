import React, { useState, useEffect } from 'react';

export const AnimatedCounter = ({ to, suffix = '', duration = 1.6 }) => {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(to, 10);
    if (isNaN(end) || start === end) {
      setVal(isNaN(end) ? 0 : end);
      return;
    }
    const totalMs = duration * 1000;
    const stepMs = Math.max(10, Math.floor(totalMs / end));
    const timer = setInterval(() => {
      start += 1;
      setVal(start);
      if (start >= end) clearInterval(timer);
    }, stepMs);
    return () => clearInterval(timer);
  }, [to, duration]);

  return (
    <span>
      {val}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
