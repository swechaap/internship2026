import React, { useState, useEffect, useRef } from 'react';

export const AutoHeight = ({ open, children, duration = 300 }) => {
  const innerRef = useRef(null);
  const [height, setHeight] = useState(open ? 'auto' : 0);

  useEffect(() => {
    if (open) {
      const h = innerRef.current ? innerRef.current.scrollHeight : 0;
      setHeight(h);
      const t = setTimeout(() => setHeight('auto'), duration);
      return () => clearTimeout(t);
    } else {
      const h = innerRef.current ? innerRef.current.scrollHeight : 0;
      setHeight(h);
      const t1 = setTimeout(() => {
        setHeight(0);
      }, 30);
      return () => clearTimeout(t1);
    }
  }, [open, duration]);

  return (
    <div
      style={{
        height,
        overflow: 'hidden',
        transition: `height ${duration}ms cubic-bezier(0.22,1,0.36,1), opacity ${duration}ms`,
        opacity: open ? 1 : 0,
      }}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  );
};

export default AutoHeight;
