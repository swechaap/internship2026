import React from 'react';
const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Story Board', href: '#storyboard' },
  { label: 'Formula', href: '#formula' },
  { label: 'Simulations', href: '#simulations' },
  { label: 'Applications', href: '#applications' },
  // Structure tab removed per request
];

export default function Navbar() {
  return (
    <nav className="navbar">
      <a className="brand" href="#home" aria-label="PressureVerse Home">
        <span className="brand-orb" />
        <span>PressureVerse</span>
      </a>
      <div className="nav-links">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>{item.label}</a>
        ))}
      </div>
      <a className="nav-cta" href="#simulations">Launch Lab</a>
    </nav>
  );
}

