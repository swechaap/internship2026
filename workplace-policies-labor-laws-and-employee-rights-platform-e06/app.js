const { useState, useEffect, useRef, useMemo, useCallback } = React;

let supabaseClient = null;
if (window.ENV && window.ENV.SUPABASE_URL && window.ENV.SUPABASE_ANON_KEY) {
  try {
    supabaseClient = supabase.createClient(window.ENV.SUPABASE_URL, window.ENV.SUPABASE_ANON_KEY);
  } catch (err) {
    console.error("Supabase client initialization error:", err);
  }
}

/* ============ SUPABASE CONFIGURATION SETUP ============ */
const SupabaseSetup = ({ onConfigured }) => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    if (!url.trim() || !key.trim()) {
      setError('Please fill in both fields.');
      return;
    }
    try {
      const client = supabase.createClient(url.trim(), key.trim());
      if (client) {
        window.localStorage.setItem('SB_URL', url.trim());
        window.localStorage.setItem('SB_KEY', key.trim());
        window.ENV.SUPABASE_URL = url.trim();
        window.ENV.SUPABASE_ANON_KEY = key.trim();
        supabaseClient = client;
        onConfigured();
      }
    } catch (err) {
      setError('Invalid URL or Key format.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--paper)] grain">
      <div className="w-full max-w-md tab-card rounded-3xl border p-8 glass" style={{ background:'var(--card)', borderColor:'var(--line)' }}>
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background:'var(--ink)', color:'var(--paper)' }}>
            <Icon name="settings" size={24} className="text-white" strokeWidth={2}/>
          </div>
          <h2 className="font-display text-2xl font-bold text-center" style={{ color:'var(--ink)' }}>Supabase Configuration</h2>
          <p className="text-xs text-center mt-1 max-w-[280px]" style={{ color:'var(--ink-soft)' }}>
            To run Work Rights Hub full-stack, connect your Supabase database instance.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color:'var(--stone)' }}>Supabase URL</label>
            <input type="text" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://your-project.supabase.co" required
              className="focus-ring w-full px-4 py-3 rounded-xl text-sm border" style={{ background:'var(--paper)', borderColor:'var(--line)', color:'var(--ink)' }}/>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color:'var(--stone)' }}>Supabase Anon Key</label>
            <input type="text" value={key} onChange={e=>setKey(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." required
              className="focus-ring w-full px-4 py-3 rounded-xl text-sm border font-mono" style={{ background:'var(--paper)', borderColor:'var(--line)', color:'var(--ink)' }}/>
          </div>

          {error && <p className="text-xs font-semibold" style={{ color:'var(--coral)' }}>{error}</p>}

          <button type="submit" className="focus-ring w-full py-3.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 mt-2"
            style={{ background:'var(--ink)', color:'var(--paper)' }}>
            Connect Database <Icon name="arrowRight" size={15}/>
          </button>
        </form>

        <div className="mt-6 pt-5 text-center border-t text-[11px]" style={{ borderColor:'var(--line)', color:'var(--stone)' }}>
          Credentials are saved locally in your browser storage.
        </div>
      </div>
    </div>
  );
};

/* ============ AUTH SCREEN (SIGN IN / SIGN UP) ============ */
const AuthScreen = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Form validation errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const validateForm = () => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setNameError('');
    setError('');

    if (!email.trim()) {
      setEmailError('Email address is required.');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    }

    if (isSignUp) {
      if (!name.trim()) {
        setNameError('Full name is required.');
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (isSignUp) {
        const { data: signUpData, error: err } = await supabaseClient.auth.signUp({
          email: email.trim(), password: password.trim(),
          options: { data: { name: name.trim() } }
        });
        if (err) throw err;
        if (signUpData?.session) { onAuthSuccess(signUpData.session); return; }
        const { data: siData, error: siErr } = await supabaseClient.auth.signInWithPassword({ email: email.trim(), password: password.trim() });
        if (!siErr && siData?.session) { onAuthSuccess(siData.session); return; }
        setMsg('Account created! Check your inbox for a confirmation link, then sign in.'); setIsSignUp(false);
      } else {
        const { data, error: err } = await supabaseClient.auth.signInWithPassword({ email: email.trim(), password: password.trim() });
        if (err) {
          if (err.message.toLowerCase().includes('email not confirmed')) {
            setError('Email not confirmed. Please check your inbox.');
          } else { throw err; }
          return;
        }
        if (data.session) {
          onAuthSuccess(data.session);
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between p-6 md:p-12 overflow-hidden animate-fade-in" 
      style={{ background: 'radial-gradient(circle at center, #13172e 0%, #070814 100%)' }}>
      
      {/* Background Glowing Blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[120px] opacity-20 animate-pulse-slow" style={{ background: 'var(--coral)' }}/>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-[120px] opacity-20 animate-pulse-slow-reverse" style={{ background: 'var(--teal)' }}/>

      {/* Top Left Logo */}
      <div className="flex items-center gap-2.5 self-start mb-8 select-none relative z-10">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--coral)' }}>
          <Icon name="compass" size={17} className="text-white" strokeWidth={2.5}/>
        </div>
        <span className="font-display font-semibold text-[17px] text-white tracking-wide">
          WorkRights<span style={{ color: 'var(--coral)' }}>Hub</span>
        </span>
      </div>

      {/* Main Glass Card */}
      <div className="w-full max-w-[430px] mx-auto rounded-[28px] p-8 md:p-10 self-center relative z-10" 
        style={{ 
          background: 'rgba(21, 23, 40, 0.65)', 
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(16px)'
        }}>
        
        {/* Welcome Header */}
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white leading-tight">
            Welcome to WorkRights Hub
          </h2>
          <p className="text-[12px] mt-2 opacity-60 leading-relaxed text-white max-w-[340px] mx-auto">
            {isSignUp 
              ? 'Create your account to track grievances and discover labor rights.' 
              : 'Log in to access labor rights, company policies, or employee dashboard.'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isSignUp && (
            <>
              {/* Full Name */}
              <div>
                <label className="text-[9.5px] font-bold uppercase tracking-wider block mb-1.5 opacity-55 text-white">Full Name</label>
                <input type="text" value={name} onChange={e=>{setName(e.target.value); setNameError('');}} placeholder="e.g. Priya Sharma" required
                  className={`auth-input w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none`} 
                  style={{ 
                    borderColor: nameError ? 'var(--coral)' : 'rgba(255, 255, 255, 0.08)'
                  }}/>
                {nameError && <p className="text-[11px] font-semibold mt-1.5" style={{ color: 'var(--coral)' }}>{nameError}</p>}
              </div>
            </>
          )}

          {/* Email Address */}
          <div>
            <label className="text-[9.5px] font-bold uppercase tracking-wider block mb-1.5 opacity-55 text-white">Email Address</label>
            <input type="email" value={email} onChange={e=>{setEmail(e.target.value); setEmailError('');}} placeholder="e.g. ravi@example.com" required
              className={`auth-input w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none`} 
              style={{ 
                borderColor: emailError ? 'var(--coral)' : 'rgba(255, 255, 255, 0.08)'
              }}/>
            {emailError && <p className="text-[11px] font-semibold mt-1.5" style={{ color: 'var(--coral)' }}>{emailError}</p>}
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[9.5px] font-bold uppercase tracking-wider block opacity-55 text-white">Password</label>
              {!isSignUp && (
                <button type="button" onClick={() => alert("Password reset link will be sent if configured in Supabase Console.")}
                  className="text-[9px] font-bold tracking-wide uppercase hover:underline hover:opacity-100 transition-opacity" style={{ color: 'var(--coral)', opacity: 0.8 }}>
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={e=>{setPassword(e.target.value); setPasswordError('');}} placeholder="Enter password" required
                className={`auth-input w-full pl-4 pr-10 py-3 rounded-xl text-sm transition-all duration-200 outline-none`} 
                style={{ 
                  borderColor: passwordError ? 'var(--coral)' : 'rgba(255, 255, 255, 0.08)'
                }}/>
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white opacity-40 hover:opacity-85 transition-opacity focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}>
                <Icon name={showPassword ? "eyeOff" : "eye"} size={16}/>
              </button>
            </div>
            {passwordError && <p className="text-[11px] font-semibold mt-1.5" style={{ color: 'var(--coral)' }}>{passwordError}</p>}
          </div>

          {error && <p className="text-xs font-semibold text-center mt-3" style={{ color: 'var(--coral)' }}>{error}</p>}
          {msg && <p className="text-xs font-semibold text-center mt-3" style={{ color: 'var(--teal)' }}>{msg}</p>}

          <button type="submit" disabled={loading}
            className="primary-btn w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mt-5 disabled:opacity-50 outline-none"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
            ) : (
              <>
                {isSignUp ? 'Register' : 'Sign In'}
                <Icon name="arrowRight" size={15}/>
              </>
            )}
          </button>
        </form>

        {/* Auth Mode Toggle Link */}
        <div className="mt-6 text-center text-xs text-white opacity-60">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button onClick={() => { setIsSignUp(!isSignUp); setError(''); setMsg(''); }}
            className="register-link"
          >
            {isSignUp ? 'Sign In' : 'Register'}
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-[10px] mt-8 opacity-45 text-white flex flex-col md:flex-row items-center justify-center gap-2 relative z-10">
        <span>Database connected</span>
        <span className="hidden md:inline">·</span>
        <button onClick={() => { window.localStorage.removeItem('SB_URL'); window.localStorage.removeItem('SB_KEY'); window.location.reload(); }}
          className="underline font-semibold hover:opacity-100 transition-opacity" style={{ color: 'var(--coral)' }}>
          Disconnect Supabase
        </button>
      </div>
    </div>
  );
};


/* ============ LIGHTWEIGHT MOTION SHIM ============
   Implements the small subset of the framer-motion API used in this app
   (motion.div/button/span, AnimatePresence, initial/animate/exit/transition,
   whileHover, whileInView, layout height auto-animation) using plain CSS
   transitions — no external animation library dependency required. */
(function(){
  const numKeys = ['opacity','x','y','scale','rotate','width','height'];
  const toTransform = (v) => {
    const parts = [];
    if (v.x !== undefined) parts.push(`translateX(${typeof v.x==='number'?v.x+'px':v.x})`);
    if (v.y !== undefined) parts.push(`translateY(${typeof v.y==='number'?v.y+'px':v.y})`);
    if (v.scale !== undefined) parts.push(`scale(${v.scale})`);
    if (v.rotate !== undefined) parts.push(`rotate(${typeof v.rotate==='number'?v.rotate+'deg':v.rotate})`);
    return parts.length ? parts.join(' ') : undefined;
  };
  const styleFromState = (state, extra) => {
    if (!state) return extra || {};
    const s = { ...(extra||{}) };
    if (state.opacity !== undefined) s.opacity = state.opacity;
    if (state.width !== undefined) s.width = typeof state.width==='number' ? state.width+'px' : state.width;
    if (state.height !== undefined) s.height = typeof state.height==='number' ? state.height+'px' : state.height;
    const t = toTransform(state);
    if (t) s.transform = t;
    return s;
  };
  const cssDuration = (transition) => (transition && transition.duration ? transition.duration : 0.3);
  const cssEase = (transition) => {
    if (!transition || !transition.ease) return 'cubic-bezier(0.22,1,0.36,1)';
    if (Array.isArray(transition.ease)) return `cubic-bezier(${transition.ease.join(',')})`;
    if (transition.ease === 'easeInOut') return 'ease-in-out';
    return transition.ease;
  };

  function MotionComponent(tag) {
    return React.forwardRef(function MotionTag(props, ref) {
      const {
        initial, animate, exit, transition, whileHover, whileInView, viewport,
        layout, layoutId, onClick, style, className, children, ...rest
      } = props;
      const elRef = useRef(null);
      const [hovered, setHovered] = useState(false);
      const [inView, setInView] = useState(!whileInView); // if no whileInView, treat as already "in"
      const [mountedAnimateApplied, setMountedAnimateApplied] = useState(false);
      const repeatTimers = useRef([]);

      // IntersectionObserver for whileInView
      useEffect(() => {
        if (!whileInView || !elRef.current) return;
        const margin = (viewport && viewport.margin) || '0px';
        const once = viewport && viewport.once;
        const obs = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) obs.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }, { rootMargin: margin, threshold: 0.05 });
        obs.observe(elRef.current);
        return () => obs.disconnect();
      }, []);

      // trigger mount animation on next tick
      useEffect(() => {
        const id = requestAnimationFrame(() => setMountedAnimateApplied(true));
        return () => cancelAnimationFrame(id);
      }, []);

      // handle repeat:Infinity style ambient animations (simple y bob) via CSS keyframe injection
      useEffect(() => {
        if (transition && transition.repeat === Infinity && animate && (animate.y !== undefined)) {
          const el = elRef.current;
          if (!el) return;
          const dur = transition.duration || 3;
          const seq = Array.isArray(animate.y) ? animate.y : [0, animate.y, 0];
          const kfName = 'amb_' + Math.random().toString(36).slice(2,9);
          const pct = seq.length - 1;
          const kfBody = seq.map((v,i) => `${Math.round((i/pct)*100)}% { transform: translateY(${v}px); }`).join(' ');
          const styleTag = document.createElement('style');
          styleTag.innerHTML = `@keyframes ${kfName} { ${kfBody} }`;
          document.head.appendChild(styleTag);
          el.style.animation = `${kfName} ${dur}s ease-in-out infinite`;
          return () => { styleTag.remove(); };
        }
      }, []);

      let baseState = mountedAnimateApplied ? animate : (initial !== undefined ? initial : animate);
      if (hovered && whileHover) baseState = { ...baseState, ...whileHover };
      if (whileInView && !inView) baseState = initial;
      if (whileInView && inView) baseState = { ...animate, ...(hovered && whileHover ? whileHover : {}) };

      const isAmbient = transition && transition.repeat === Infinity;
      const computedStyle = styleFromState(baseState, style);
      if (!isAmbient) {
        computedStyle.transition = `all ${cssDuration(transition)}s ${cssEase(transition)} ${(transition&&transition.delay)?`${transition.delay}s`:'0s'}`;
      }

      const Tag = tag;
      return (
        <Tag
          ref={(node) => { elRef.current = node; if (typeof ref === 'function') ref(node); else if (ref) ref.current = node; }}
          className={className}
          style={computedStyle}
          onClick={onClick}
          onMouseEnter={() => whileHover && setHovered(true)}
          onMouseLeave={() => whileHover && setHovered(false)}
          {...rest}
        >
          {children}
        </Tag>
      );
    });
  }

  const motion = {
    div: MotionComponent('div'),
    button: MotionComponent('button'),
    span: MotionComponent('span'),
    h1: MotionComponent('h1'),
    p: MotionComponent('p'),
    ol: MotionComponent('ol'),
    ul: MotionComponent('ul'),
  };

  // AnimatePresence: renders children, and on removal, keeps them mounted briefly
  // while applying the `exit` state, then unmounts. Supports a single child or array.
  function AnimatePresence({ children }) {
    const childArray = React.Children.toArray(children).filter(Boolean);
    const [rendered, setRendered] = useState(childArray);
    const prevChildrenRef = useRef(childArray);

    useEffect(() => {
      const prevChildren = prevChildrenRef.current;
      const prevKeys = prevChildren.map(c => c.key);
      const currentKeys = childArray.map(c => c.key);
      const keysChanged = JSON.stringify(currentKeys) !== JSON.stringify(prevKeys);

      if (keysChanged) {
        const newKeys = new Set(currentKeys);
        setRendered(prev => {
          const removed = prev.filter(c => !newKeys.has(c.key));
          if (removed.length === 0) return childArray;
          return [...childArray, ...removed.map(c => React.cloneElement(c, { 'data-exiting': true }))];
        });
        const t = setTimeout(() => setRendered(childArray), 320);
        prevChildrenRef.current = childArray;
        return () => clearTimeout(t);
      } else {
        setRendered(childArray);
      }
      prevChildrenRef.current = childArray;
    }, [children]);

    return <>{rendered}</>;
  }

  window.MotionShim = { motion, AnimatePresence };
})();
const FM = window.MotionShim;
const { motion, AnimatePresence } = FM;

/* AutoHeight: animates a wrapper from 0 to its natural content height and back,
   used for accordion-style expand/collapse (true height:auto animation via
   scrollHeight measurement, which plain CSS transitions can't do natively). */
const AutoHeight = ({ open, children, duration=300 }) => {
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
      // Wait a tick to trigger transition from h to 0
      const t1 = setTimeout(() => {
        setHeight(0);
      }, 30);
      return () => clearTimeout(t1);
    }
  }, [open]);

  return (
    <div style={{ height, overflow:'hidden', transition:`height ${duration}ms cubic-bezier(0.22,1,0.36,1), opacity ${duration}ms`, opacity: open ? 1 : 0 }}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
};



/* ============ ICONS (inline, no external icon lib needed) ============ */
const Icon = ({ name, size=20, className="", strokeWidth=1.8, filled=false }) => {
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></>,
    wallet: <><path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3"/><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a1 1 0 0 0-1-1h-5a2 2 0 1 0 0 4h6"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
    shield: <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/>,
    shieldAlert: <><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/><path d="M12 8v4M12 16h.01"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></>,
    scale: <><path d="M12 3v18M5 7l-3 7a3 3 0 0 0 6 0l-3-7zM19 7l-3 7a3 3 0 0 0 6 0l-3-7zM5 7h14M9 3h6"/></>,
    heart: <path d="M12 21s-7.5-4.6-10-9.5C0.3 7.8 2 4 6 4c2.3 0 3.9 1.3 6 3.4C14.1 5.3 15.7 4 18 4c4 0 5.7 3.8 4 7.5C19.5 16.4 12 21 12 21z"/>,
    gift: <><rect x="3" y="9" width="18" height="11" rx="1"/><path d="M3 9V6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3M12 5v15M8 5a2.5 2.5 0 1 1 4 2H8a2.5 2.5 0 0 1 0-2zm8 0a2.5 2.5 0 1 0-4 2h4a2.5 2.5 0 0 0 0-2z"/></>,
    book: <><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/></>,
    fileText: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></>,
    chevronDown: <path d="M6 9l6 6 6-6"/>,
    chevronRight: <path d="M9 6l6 6-6 6"/>,
    arrowRight: <path d="M5 12h14M13 5l7 7-7 7"/>,
    x: <path d="M18 6L6 18M6 6l12 12"/>,
    check: <path d="M20 6L9 17l-5-5"/>,
    checkCircle: <><circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.3 2.3 4.7-5.3"/></>,
    alertTriangle: <><path d="M10.6 3.5a1.6 1.6 0 0 1 2.8 0l8.2 14.6a1.6 1.6 0 0 1-1.4 2.4H3.8a1.6 1.6 0 0 1-1.4-2.4z"/><path d="M12 9v4M12 17h.01"/></>,
    send: <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>,
    activity: <path d="M22 12h-4l-3 9-6-18-3 9H2"/>,
    bookmark: <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 6.5H4.5C4.5 13.5 6 12 6 8z"/><path d="M9.5 17.5a2.5 2.5 0 0 0 5 0"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></>,
    users: <><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16.5 5.2a3.2 3.2 0 0 1 0 6.3M21 19.5c0-2.7-1.9-4.8-4.5-5.6"/></>,
    mapPin: <><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></>,
    compass: <><circle cx="12" cy="12" r="9"/><path d="M14.5 9.5l-2 5-5 2 2-5z"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    minus: <path d="M5 12h14"/>,
    moon: <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4 7 7 0 0 0 20 14.5z"/>,
    home: <><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></>,
    list: <><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/></>,
    layers: <><path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5M3 8l9 5 9-5"/></>,
    target: <><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="0.7" fill="currentColor"/></>,
    trendingUp: <><path d="M3 17l6-6 4 4 8-8"/><path d="M15 6h6v6"/></>,
    filter: <path d="M4 5h16M7 12h10M10 19h4"/>,
    info: <><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v5h1"/></>,
    play: <path d="M7 4l13 8-13 8z"/>,
    folder: <path d="M3 7a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>,
    star: <path d="M12 2l3 6.5 7 1-5 5 1.3 7-6.3-3.5-6.3 3.5 1.3-7-5-5 7-1z"/>,
    sliders: <><path d="M5 21V14M5 10V3M12 21v-7M12 10V3M19 21v-5M19 12V3"/><circle cx="5" cy="12" r="2"/><circle cx="12" cy="13" r="2"/><circle cx="19" cy="14" r="2"/></>,
    download: <><path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/></>,
    flag: <><path d="M5 3v18"/><path d="M5 4h11l-2.5 4L16 12H5"/></>,
    eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></>,
    mail: <><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M3 6.5l9 6 9-6"/></>,
    phone: <path d="M5 4h3.5l1.5 5-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 5 1.5V19a2 2 0 0 1-2 2 16 16 0 0 1-15-15 2 2 0 0 1 2-2z"/>,
    briefcase: <><rect x="2.5" y="7" width="19" height="13" rx="2"/><path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7"/><path d="M2.5 12.5h19"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9.5h18M8 3v4M16 3v4"/></>,
    logOut: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></>,
    panelLeft: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/></>,
    userCheck: <><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16.5 11l1.7 1.7 3.3-3.7"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V20a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H4a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h0a1.7 1.7 0 0 0 1-1.6V4a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v0a1.7 1.7 0 0 0 1.6 1H20a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1z"/></>,
    camera: <><path d="M4 8a2 2 0 0 1 2-2h1.5l1-1.5h7l1 1.5H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.5"/></>,
    upload: <><path d="M12 16V4M7 9l5-5 5 5"/><path d="M5 21h14"/></>,
    trash: <><path d="M4 7h16"/><path d="M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7"/><path d="M6 7l1 13a2 2 0 0 0 2 1.8h6a2 2 0 0 0 2-1.8l1-13"/><path d="M10 11v6M14 11v6"/></>,
    edit: <><path d="M3 21l4-1 11-11a2 2 0 0 0 0-2.8l-.2-.2a2 2 0 0 0-2.8 0L4 17z"/><path d="M14 6l4 4"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {paths[name] || null}
    </svg>
  );
};

/* ============ DATA ============ */
const RIGHTS_CATEGORIES = [
  { id:'salary', title:'Salary & Wages', icon:'wallet', color:'teal',
    blurb:'Getting paid correctly, on time, every time.',
    explainer:'Your pay isn\'t a favor — it\'s a contract. There are rules for when wages must land, what counts as a valid deduction, and what happens if your employer falls behind.',
    rights:['Wages paid by a fixed date each cycle — no open-ended delays','Itemized payslip showing every deduction','Overtime paid at the agreed or legal multiplier','No surprise deductions outside what\'s legally allowed'],
    responsibilities:['Pay on the agreed schedule without exception','Provide written, itemized pay records','Get written consent before any non-statutory deduction','Settle full and final dues promptly on exit'],
    example:'Aisha\'s paycheck arrived eight days late for the second month running. She requested a written pay schedule and escalated to HR with dates logged — the delay stopped within a cycle.' },
  { id:'leave', title:'Leave Rights', icon:'clock', color:'coral',
    blurb:'Time off you\'re entitled to — and can\'t be punished for taking.',
    explainer:'Leave isn\'t a perk granted at a manager\'s mood. Earned leave, sick leave, and parental leave are typically built into your terms of employment and protected from arbitrary denial.',
    rights:['Accrued earned/annual leave that carries genuine value','Sick leave without requiring justification for short absences','Protected parental/maternity/paternity leave','No retaliation for requesting or taking eligible leave'],
    responsibilities:['Approve or respond to leave requests within a reasonable window','State clear, documented reasons for any denial','Maintain accurate leave balance records','Avoid pressuring employees to forfeit earned leave'],
    example:'Rohit\'s manager kept rejecting leave verbally with no reason. He began submitting requests in writing — creating a paper trail that resolved the pattern within weeks.' },
  { id:'safety', title:'Workplace Safety', icon:'shield', color:'teal',
    blurb:'A physically and mentally safe place to do your job.',
    explainer:'Safety obligations apply regardless of role or seniority — from physical hazards on a factory floor to ergonomic and mental-health conditions in an office.',
    rights:['A workplace free from unaddressed physical hazards','Access to safety equipment where the role requires it','The right to flag hazards without fear of punishment','Incident reporting and investigation when something goes wrong'],
    responsibilities:['Maintain safe equipment, exits, and working conditions','Provide required safety training and protective gear','Investigate reported hazards within a reasonable time','Never penalize someone for raising a safety concern'],
    example:'A warehouse worker flagged a broken guard rail twice with no response. After a written safety report to the safety officer, repairs were completed within days.' },
  { id:'harassment', title:'Anti-Harassment Protection', icon:'shieldAlert', color:'coral',
    blurb:'Protection from harassment, discrimination, and hostile conduct.',
    explainer:'Most workplaces are required to maintain a formal mechanism for harassment complaints, keep them confidential, and act on them — this isn\'t optional goodwill.',
    rights:['A confidential channel to report harassment','Protection from retaliation after reporting','A timely, impartial investigation process','The right to escalate externally if internal process fails'],
    responsibilities:['Maintain a functioning, known complaints mechanism','Investigate every complaint promptly and fairly','Shield the complainant from retaliation','Take real corrective action when findings support it'],
    example:'After repeated inappropriate comments from a senior colleague, an employee filed a written complaint to the internal committee — triggering a formal, confidential investigation.' },
  { id:'hours', title:'Working Hours', icon:'clock', color:'teal',
    blurb:'Limits on how much you can be asked to work.',
    explainer:'There are typically caps on daily and weekly hours, required rest breaks, and rules for when overtime kicks in and must be compensated.',
    rights:['A defined cap on daily/weekly working hours','Mandated rest breaks during long shifts','Overtime pay when hours exceed the standard threshold','A weekly day of rest'],
    responsibilities:['Track hours accurately, not informally','Schedule within legal hour limits','Pay overtime premiums as required','Avoid making overtime a disguised expectation'],
    example:'A retail associate was routinely scheduled past legal daily limits without overtime pay. A logged record of hours worked formed the basis of a successful wage claim.' },
  { id:'equal', title:'Equal Opportunity', icon:'scale', color:'coral',
    blurb:'Fair treatment regardless of who you are.',
    explainer:'Hiring, pay, and promotion decisions are expected to be based on merit and role-fit — not protected characteristics like gender, religion, age, or disability.',
    rights:['Equal pay for equal or substantially similar work','Promotion decisions free from protected-characteristic bias','Reasonable accommodation for disability where feasible','Protection from discriminatory hiring practices'],
    responsibilities:['Apply consistent, documented criteria for pay and promotion','Provide accommodations where reasonably possible','Train management on equal-opportunity obligations','Address pay-gap complaints with real data, not assurances'],
    example:'Two employees in the same role discovered a pay gap with no performance basis. A formal pay-equity request supported by role documentation led to a correction.' },
  { id:'benefits', title:'Employee Benefits', icon:'gift', color:'teal',
    blurb:'The provident fund, insurance, and statutory benefits owed to you.',
    explainer:'Many benefits aren\'t optional add-ons — they\'re statutory contributions employers are required to make on your behalf, visible on your payslip and accessible to you.',
    rights:['Statutory retirement/provident fund contributions, visibly tracked','Health insurance coverage where mandated or contractually promised','Gratuity or severance entitlements after qualifying tenure','Access to your own contribution and benefits statements'],
    responsibilities:['Deposit statutory contributions on time, every cycle','Provide accessible statements of contributions made','Honor gratuity/severance terms on separation','Disclose benefit terms clearly at the time of hire'],
    example:'An employee noticed provident fund deposits had stopped appearing on statements. A written request for contribution records prompted the employer to resolve a processing lapse.' },
];

const LAWS = [
  { id:'wages-act', title:'Payment of Wages', category:'Salary', importance:'High',
    summary:'Sets out when wages must be paid and what can legally be deducted from them.',
    protects:'Anyone earning wages below a defined threshold, across most industries.',
    benefits:['Fixed wage payment timelines','A capped, defined list of legal deductions','The right to claim unpaid or delayed wages formally'],
    example:'An employer delays salary citing "cash flow" for three months running — this is a direct violation, and a formal wage claim can compel payment plus penalty.' },
  { id:'min-wage', title:'Minimum Wage Law', category:'Salary', importance:'High',
    summary:'Establishes a floor below which no employer can pay, varying by region and skill category.',
    protects:'All employees, including contract and part-time workers in covered sectors.',
    benefits:['A guaranteed wage floor regardless of negotiation power','Periodic revision to track cost-of-living changes','Protection for piece-rate and contract workers too'],
    example:'A contract worker is paid below the declared regional minimum for their skill category — they can file a claim with back-pay owed for the shortfall period.' },
  { id:'maternity', title:'Maternity Benefit Law', category:'Leave', importance:'High',
    summary:'Guarantees paid leave around childbirth along with protection from dismissal during this period.',
    protects:'Pregnant employees and new mothers across eligible establishments.',
    benefits:['Paid leave spanning weeks before and after delivery','Protection from termination during the protected period','Nursing breaks on return to work'],
    example:'An employee is asked to resign upon announcing her pregnancy — this is unlawful, and the law provides direct recourse including reinstatement.' },
  { id:'safety-act', title:'Occupational Safety & Health Law', category:'Safety', importance:'High',
    summary:'Requires employers to maintain safe working conditions and provide protective measures.',
    protects:'Workers across factories, construction sites, and increasingly, general workplaces.',
    benefits:['Mandated safety equipment and training','Hazard reporting channels with employer obligation to act','Compensation pathways after workplace injury'],
    example:'A factory floor lacks fire exits required by code — a safety inspection request can be filed, triggering mandatory compliance.' },
  { id:'posh', title:'Prevention of Sexual Harassment Law', category:'Harassment', importance:'High',
    summary:'Mandates an internal complaints committee and a defined process for harassment complaints at work.',
    protects:'All employees regardless of gender, across organizations above a minimum size.',
    benefits:['A legally mandated, confidential internal committee','Time-bound investigation requirements','Protection from retaliation for the complainant'],
    example:'A company has no internal committee despite meeting the size threshold — this alone is a compliance violation that can be reported to local authorities.' },
  { id:'hours-act', title:'Hours of Work Regulations', category:'Hours', importance:'Medium',
    summary:'Caps daily and weekly working hours and mandates rest intervals.',
    protects:'Most categories of employees, with some role-based exceptions.',
    benefits:['A daily hour cap with mandated breaks','A defined overtime threshold and pay multiplier','A guaranteed weekly rest day'],
    example:'An employee is scheduled seven days a week for a month without a rest day — this breaches the regulation regardless of consent given informally.' },
  { id:'equal-pay', title:'Equal Remuneration Law', category:'Equal Opportunity', importance:'Medium',
    summary:'Prohibits pay discrimination between employees performing the same or similar work.',
    protects:'Employees facing pay disparity tied to gender or other protected traits.',
    benefits:['Right to equal pay for equal work, regardless of gender','Grounds to formally request pay-parity review','Protection from retaliation for raising the issue'],
    example:'Two colleagues in identical roles discover a 20% pay gap unrelated to performance — a formal complaint can compel a documented review.' },
  { id:'gratuity', title:'Gratuity & Severance Law', category:'Benefits', importance:'Medium',
    summary:'Mandates a lump-sum payment to employees who complete a minimum tenure, payable on exit.',
    protects:'Employees who have completed the qualifying period of continuous service.',
    benefits:['Guaranteed payout formula based on tenure and last wage','Protection even after resignation, not just termination','A defined timeline for settlement after exit'],
    example:'An employee resigns after six qualifying years and receives no gratuity at settlement — this can be claimed directly through a formal demand or labour authority.' },
];

const POLICIES = [
  { id:'leave-policy', title:'Leave Policy', icon:'clock', summary:'How earned, sick, and special leave is accrued, requested, and approved.',
    timeline:[{t:'Accrual',d:'Leave accrues monthly or annually based on company policy and tenure.'},{t:'Request',d:'Submit through the defined channel with reasonable advance notice.'},{t:'Approval',d:'Manager responds within the policy\'s stated window.'},{t:'Carry-forward',d:'Unused leave either carries forward, lapses, or is encashed per policy terms.'}] },
  { id:'wfh-policy', title:'Work From Home Policy', icon:'home', summary:'Eligibility, expectations, and tools for remote or hybrid work arrangements.',
    timeline:[{t:'Eligibility',d:'Defined by role type, tenure, or manager discretion.'},{t:'Setup',d:'Equipment and connectivity expectations are typically outlined upfront.'},{t:'Availability',d:'Core hours during which presence is expected remain consistent with office hours.'},{t:'Review',d:'Arrangements are periodically reviewed against performance and team needs.'}] },
  { id:'attendance-policy', title:'Attendance Policy', icon:'checkCircle', summary:'Expectations around punctuality, leave marking, and unexplained absence.',
    timeline:[{t:'Marking',d:'Daily attendance is logged through the company\'s defined system.'},{t:'Grace period',d:'A short buffer window is usually allowed before lateness is flagged.'},{t:'Escalation',d:'Repeated unexplained absence triggers a documented conversation, not immediate action.'},{t:'Resolution',d:'Patterns are addressed through dialogue before any formal consequence.'}] },
  { id:'conduct-policy', title:'Code of Conduct', icon:'fileText', summary:'Behavioral expectations, conflicts of interest, and disciplinary process.',
    timeline:[{t:'Standards',d:'Baseline expectations for professional conduct are defined for all employees.'},{t:'Reporting',d:'Violations can be reported through HR or an ethics channel.'},{t:'Investigation',d:'Reported issues go through a fact-finding process before any decision.'},{t:'Outcome',d:'Outcomes range from coaching to formal disciplinary action, proportionate to findings.'}] },
  { id:'safety-policy', title:'Workplace Safety Policy', icon:'shield', summary:'Hazard reporting, emergency procedures, and protective equipment standards.',
    timeline:[{t:'Standards',d:'Baseline safety equipment and procedures are defined per work area.'},{t:'Reporting',d:'Hazards can be flagged through a dedicated safety channel.'},{t:'Response',d:'Reported hazards are expected to be addressed within a stated timeframe.'},{t:'Drills',d:'Periodic emergency drills keep procedures current and practiced.'}] },
];

const SCENARIOS = [
  { id:'salary-delay', q:'My salary is delayed for two months.', tags:['salary delayed','unpaid wages','late salary'],
    rights:['Wages must be paid by a fixed date each cycle','You can request a written explanation for any delay','Delayed wages can accrue legal interest or penalty in some jurisdictions'],
    laws:['Payment of Wages Law','Minimum Wage Law'],
    actions:['Request a written pay schedule and delay explanation from HR','Keep dated records of each missed or late payment','If unresolved after a written request, file a wage claim with the local labour authority'] },
  { id:'unpaid-overtime', q:'My employer asks me to work overtime without payment.', tags:['overtime without pay','unpaid overtime','forced overtime'],
    rights:['Overtime is generally owed once hours exceed the standard daily/weekly threshold','Verbal agreement to skip overtime pay does not override statutory entitlement','You can decline overtime beyond legal caps in most cases'],
    laws:['Hours of Work Regulations', 'Payment of Wages Law'],
    actions:['Log all overtime hours with dates and durations','Request payment in writing, citing the applicable threshold','Escalate to the labour authority if the employer refuses after a documented request'] },
  { id:'harassment-scenario', q:'A colleague is harassing me at work.', tags:['workplace harassment','hostile environment','inappropriate behavior'],
    rights:['You have a right to a confidential, retaliation-free reporting channel','Your employer is generally required to investigate within a defined timeframe','You can escalate externally if the internal process fails or is absent'],
    laws:['Prevention of Sexual Harassment Law'],
    actions:['Document each incident with date, time, and details as soon as possible','File a written complaint with the internal complaints committee or HR','If no committee exists or the process stalls, escalate to the local labour or women\'s welfare authority'] },
  { id:'leave-rejected', q:'My leave request was rejected without a clear reason.', tags:['leave request rejected','leave denied'],
    rights:['Earned leave generally can\'t be denied without documented justification','Repeated, unexplained denial may itself be a policy violation','Retaliation for requesting eligible leave is generally prohibited'],
    laws:['Maternity Benefit Law (if applicable)', 'Company Leave Policy'],
    actions:['Resubmit the request in writing and ask for the reason in writing too','Reference your accrued leave balance from payslips or HR records','Escalate to HR or a grievance channel if denial continues without justification'] },
  { id:'unsafe-workplace', q:'My workplace doesn\'t feel safe.', tags:['unsafe workplace','safety hazard','no safety equipment'],
    rights:['You can report hazards without fear of retaliation','Your employer must investigate and act on safety reports within a reasonable time','You may have the right to refuse clearly dangerous tasks pending resolution'],
    laws:['Occupational Safety & Health Law'],
    actions:['Report the hazard in writing to your safety officer or HR','Keep photos or notes documenting the specific hazard and date observed','If unaddressed, escalate to the local labour/safety inspectorate'] },
  { id:'wrongful-deduction', q:'My employer deducted money from my salary without explanation.', tags:['salary deduction','wage deduction', 'pay cut'],
    rights:['Deductions are generally limited to a legally defined list','Any deduction should appear itemized on your payslip','You can demand a written justification for any deduction'],
    laws:['Payment of Wages Law'],
    actions:['Request an itemized payslip explanation in writing','Compare the deduction against the legally permitted categories','File a wage claim if the deduction isn\'t justified or disclosed'] },
];

const EMPLOYEE = {
  name: '',
  employeeId: '',
  company: '',
  department: '',
  designation: '',
  joiningDate: '',
  email: '',
  phone: '',
  location: '',
  initials: '',
  lastLogin: null,
};

const NOTIFICATIONS = [];

/* ============ SHARED UI ============ */
const colorVar = (c) => c === 'coral' ? 'var(--coral)' : c === 'teal' ? 'var(--teal)' : c === 'blue' ? 'var(--blue)' : c === 'purple' ? 'var(--purple)' : c === 'stone' ? 'var(--stone)' : 'var(--ink)';
const colorSoft = (c) => c === 'coral' ? 'var(--coral-soft)' : c === 'teal' ? 'var(--teal-soft)' : c === 'blue' ? 'var(--blue-soft)' : c === 'purple' ? 'var(--purple-soft)' : 'var(--paper-deep)';


const Eyebrow = ({ children, icon }) => (
  <div className="flex items-center gap-2 mb-3" style={{ color:'var(--coral)' }}>
    {icon && <Icon name={icon} size={15} strokeWidth={2.2} />}
    <span className="font-mono text-[11px] uppercase tracking-[0.18em] font-medium">{children}</span>
  </div>
);

const SectionHeading = ({ eyebrow, eyebrowIcon, title, sub, align='left' }) => (
  <div className={`max-w-2xl ${align==='center' ? 'mx-auto text-center' : ''} mb-10 md:mb-14`}>
    {eyebrow && <div className={align==='center' ? 'flex justify-center' : ''}><Eyebrow icon={eyebrowIcon}>{eyebrow}</Eyebrow></div>}
    <h2 className="font-display text-3xl md:text-[2.6rem] leading-[1.08] font-semibold" style={{ color:'var(--ink)' }}>{title}</h2>
    {sub && <p className="mt-4 text-[15px] md:text-base leading-relaxed" style={{ color:'var(--ink-soft)' }}>{sub}</p>}
  </div>
);

const Pill = ({ children, active, onClick, color }) => (
  <button onClick={onClick}
    className="focus-ring px-4 py-2 rounded-full text-sm font-medium border transition-all whitespace-nowrap"
    style={ active
      ? { background: colorVar(color||'coral'), color:'#fff', borderColor: colorVar(color||'coral') }
      : { background:'var(--card)', color:'var(--ink-soft)', borderColor:'var(--line)' } }>
    {children}
  </button>
);

const IconBadge = ({ icon, color='ink', size=44 }) => (
  <div className="rounded-2xl flex items-center justify-center shrink-0"
    style={{ width:size, height:size, background: colorSoft(color), color: colorVar(color) }}>
    <Icon name={icon} size={size*0.46} strokeWidth={1.8} />
  </div>
);

/* ============ APP SHELL: SIDEBAR, TOPBAR, NOTIFICATIONS ============ */
const NAV_ITEMS = [
  { id:'home', label:'Home', icon:'home' },
  { id:'profile', label:'Profile', icon:'user' },
  { id:'finder', label:'Rights Finder', icon:'search' },
  { id:'laws', label:'Labour Laws', icon:'scale' },
  { id:'policies', label:'Policies', icon:'fileText' },
  { id:'complaints', label:'Complaints', icon:'flag' },
  { id:'dashboard', label:'Dashboard', icon:'activity' },
];

const NotificationPanel = ({ open, onClose, notifications, onMarkAllRead, onNotificationClick }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          className="fixed inset-0 z-[70]" style={{ background:'rgba(0,0,0,0.35)' }} onClick={onClose}/>
        <motion.div initial={{opacity:0, y:-10, scale:0.97}} animate={{opacity:1, y:0, scale:1}} exit={{opacity:0, y:-10, scale:0.97}}
          transition={{ duration:0.2, ease:[0.22,1,0.36,1] }}
          className="fixed top-[64px] right-4 md:right-6 z-[70] w-[min(380px,calc(100vw-2rem))] max-h-[70vh] overflow-y-auto rounded-2xl shadow-xl border"
          style={{ background:'var(--card)', borderColor:'var(--line)' }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom:'1px solid var(--line)' }}>
            <h4 className="font-display font-semibold text-[15px]" style={{ color:'var(--ink)' }}>Notifications</h4>
            <button onClick={onMarkAllRead} className="focus-ring text-[11.5px] font-semibold" style={{ color:'var(--coral)' }}>Mark all read</button>
          </div>
          <div>
            {notifications.map(n => (
              <button key={n.id} onClick={() => onNotificationClick && onNotificationClick(n)}
                className="focus-ring w-full flex gap-3 px-5 py-4 text-left transition-colors hover:brightness-95"
                style={{ borderBottom:'1px solid var(--line)', background: n.unread ? 'var(--paper-deep)' : 'transparent' }}>
                <IconBadge icon={n.icon} color={n.color} size={36}/>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold leading-snug" style={{ color:'var(--ink)' }}>{n.title}</div>
                  <div className="text-[12.5px] mt-0.5 leading-snug" style={{ color:'var(--ink-soft)' }}>{n.body}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[11px] font-mono" style={{ color:'var(--stone)' }}>{n.time}</span>
                    {n.target && (
                      <span className="text-[10.5px] font-semibold flex items-center gap-0.5" style={{ color:'var(--coral)' }}>
                        View <Icon name="chevronRight" size={11}/>
                      </span>
                    )}
                  </div>
                </div>
                {n.unread && <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background:'var(--coral)' }}/>}
              </button>
            ))}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const SidebarContent = ({ active, onNav, collapsed }) => (
  <>
    <button onClick={() => onNav('home')} className="flex items-center gap-2.5 focus-ring rounded-lg px-1 mb-8">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background:'var(--ink)' }}>
        <Icon name="compass" size={18} className="text-white" strokeWidth={2}/>
      </div>
      {!collapsed && <span className="font-display font-semibold text-[16px] whitespace-nowrap" style={{ color:'var(--ink)' }}>WorkRights<span style={{color:'var(--coral)'}}>Hub</span></span>}
    </button>
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(item => {
        const isActive = active === item.id;
        return (
          <button key={item.id} onClick={() => onNav(item.id)}
            className="focus-ring w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors"
            style={{ background: isActive ? 'var(--coral-soft)' : 'transparent', color: isActive ? 'var(--coral)' : 'var(--ink-soft)' }}>
            <Icon name={item.icon} size={18} strokeWidth={isActive?2.1:1.8} className="shrink-0"/>
            {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
          </button>
        );
      })}
    </nav>
  </>
);

const Sidebar = ({ active, onNav, mobileOpen, setMobileOpen }) => (
  <>
    {/* Desktop fixed sidebar */}
    <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-[232px] px-4 py-6 z-40"
      style={{ background:'var(--card)', borderRight:'1px solid var(--line)' }}>
      <SidebarContent active={active} onNav={onNav} collapsed={false}/>
    </aside>

    {/* Mobile drawer */}
    <AnimatePresence>
      {mobileOpen && (
        <>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="lg:hidden fixed inset-0 z-[60]" style={{ background:'rgba(0,0,0,0.4)' }} onClick={() => setMobileOpen(false)}/>
          <motion.div initial={{x:-280}} animate={{x:0}} exit={{x:-280}} transition={{duration:0.25, ease:[0.22,1,0.36,1]}}
            className="lg:hidden fixed top-0 left-0 h-screen w-[240px] px-4 py-6 z-[65]"
            style={{ background:'var(--card)', borderRight:'1px solid var(--line)' }}>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[11px] uppercase tracking-wider" style={{ color:'var(--stone)' }}>Menu</span>
              <button onClick={() => setMobileOpen(false)} className="focus-ring p-1.5 rounded-full" style={{color:'var(--stone)'}}><Icon name="x" size={18}/></button>
            </div>
            <SidebarContent active={active} onNav={(id) => { onNav(id); setMobileOpen(false); }} collapsed={false}/>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  </>
);

const Topbar = ({ dark, setDark, active, setMobileOpen, notifications, notifOpen, setNotifOpen, onMarkAllRead, onNav, onNotificationClick, avatar, employee }) => {
  const unreadCount = notifications.filter(n => n.unread).length;
  const currentLabel = NAV_ITEMS.find(n => n.id === active)?.label || 'Home';
  return (
    <header className="fixed top-0 left-0 lg:left-[232px] right-0 z-50 glass shadow-sm" style={{ borderBottom:'1px solid var(--line)' }}>
      <div className="px-4 md:px-7 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button className="lg:hidden focus-ring w-9 h-9 rounded-full flex items-center justify-center border shrink-0" style={{ borderColor:'var(--line)' }} onClick={()=>setMobileOpen(true)}>
            <Icon name="panelLeft" size={17} style={{color:'var(--ink)'}}/>
          </button>
          <h1 className="font-display font-semibold text-[16px] md:text-[18px] truncate" style={{ color:'var(--ink)' }}>{currentLabel}</h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <button onClick={() => setNotifOpen(o => !o)} aria-label="Notifications"
              className="focus-ring relative w-9 h-9 rounded-full flex items-center justify-center border" style={{ borderColor:'var(--line)', color:'var(--ink)' }}>
              <Icon name="bell" size={16}/>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center"
                  style={{ background:'var(--coral)', color:'#fff' }}>{unreadCount}</span>
              )}
            </button>
            <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} notifications={notifications} onMarkAllRead={onMarkAllRead} onNotificationClick={onNotificationClick}/>
          </div>
          <button onClick={() => setDark(!dark)} aria-label="Toggle dark mode"
            className="focus-ring w-9 h-9 rounded-full flex items-center justify-center border" style={{ borderColor:'var(--line)', color:'var(--ink)' }}>
            <Icon name={dark ? 'sun' : 'moon'} size={16} />
          </button>
          <button onClick={() => onNav('profile')}
            className="focus-ring w-9 h-9 rounded-full flex items-center justify-center font-display font-semibold text-[12.5px] overflow-hidden"
            style={{ background:'var(--ink)', color:'var(--paper)' }} aria-label="Profile">
            {avatar ? <img src={avatar} alt="Profile" className="w-full h-full object-cover"/> : (employee ? employee.initials : EMPLOYEE.initials)}
          </button>
        </div>
      </div>
    </header>
  );
};

/* ============ HERO ============ */
const FloatCard = ({ icon, label, sub, color, style, delay }) => (
  <motion.div
    initial={{ opacity:0, y:30, scale:0.9 }}
    animate={{ opacity:1, y:0, scale:1 }}
    transition={{ delay, duration:0.7, ease:[0.22,1,0.36,1] }}
    whileHover={{ y:-6 }}
    className="tab-card glass rounded-2xl p-4 shadow-lg absolute"
    style={style}>
    <motion.div animate={{ y:[0,-7,0] }} transition={{ duration:4+delay, repeat:Infinity, ease:'easeInOut' }}>
      <div className="flex items-center gap-3">
        <IconBadge icon={icon} color={color} size={38}/>
        <div>
          <div className="text-[13px] font-semibold leading-tight" style={{ color:'var(--ink)' }}>{label}</div>
          <div className="text-[11px] font-mono" style={{ color:'var(--ink-soft)' }}>{sub}</div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const AnimatedCounter = ({ to, suffix='', duration=1.6 }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - start) / (duration*1000));
          setVal(Math.floor(p * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
};

const Hero = ({ onNav }) => {
  return (
    <section className="relative pt-10 md:pt-14 pb-24 md:pb-32 overflow-hidden grain">
      <div aria-hidden className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full opacity-50"
        style={{ background:'radial-gradient(circle, var(--teal-soft), transparent 70%)' }}/>
      <div aria-hidden className="absolute top-20 -left-32 w-[420px] h-[420px] rounded-full opacity-60"
        style={{ background:'radial-gradient(circle, var(--coral-soft), transparent 70%)' }}/>

      <div className="max-w-7xl mx-auto px-5 md:px-8 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
              <Eyebrow icon="compass">Your workplace, decoded</Eyebrow>
            </motion.div>
            <motion.h1 initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.08}}
              className="font-display text-[2.6rem] md:text-6xl leading-[1.04] font-semibold" style={{ color:'var(--ink)' }}>
              Know Your Rights.<br/>
              <span style={{ color:'var(--coral)' }}>Work</span> with Confidence.
            </motion.h1>
            <motion.p initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.16}}
              className="mt-6 text-base md:text-lg leading-relaxed max-w-md" style={{ color:'var(--ink-soft)' }}>
              Understand workplace policies, labour laws, and employee rights through simple, visual, interactive experiences — built for the moment you actually need them.
            </motion.p>
            <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.24}}
              className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => onNav('finder')} className="focus-ring px-6 py-3.5 rounded-full font-semibold text-sm flex items-center gap-2"
                style={{ background:'var(--ink)', color:'var(--paper)' }}>
                Explore Rights <Icon name="arrowRight" size={15}/>
              </button>
              <button onClick={() => onNav('finder')} className="focus-ring px-6 py-3.5 rounded-full font-semibold text-sm flex items-center gap-2 border-2"
                style={{ borderColor:'var(--ink)', color:'var(--ink)' }}>
                Find Solutions <Icon name="search" size={15}/>
              </button>
            </motion.div>

          </div>

          <div className="relative h-[420px] hidden md:block">
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.8 }}
                className="w-64 h-64 rounded-[2.5rem] flex items-center justify-center" style={{ background:'var(--ink)' }}>
                <Icon name="shield" size={88} className="text-white/90" strokeWidth={1.2}/>
              </motion.div>
            </div>
            <FloatCard icon="wallet" label="Salary Protected" sub="Payment of Wages Law" color="teal" delay={0.5} style={{ top:'4%', left:'-2%' }}/>
            <FloatCard icon="shieldAlert" label="Harassment Reported" sub="Confidential · Day 1" color="coral" delay={0.8} style={{ top:'12%', right:'-4%' }}/>
            <FloatCard icon="clock" label="Leave Approved" sub="2 days processing" color="teal" delay={1.1} style={{ bottom:'18%', left:'-8%' }}/>
            <FloatCard icon="scale" label="Equal Pay Verified" sub="Equal Remuneration Law" color="coral" delay={1.4} style={{ bottom:'2%', right:'2%' }}/>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============ RIGHTS FINDER (signature feature) ============ */
const RightsFinder = ({ onLog, onNav }) => {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(null);
  const examples = ['Salary delayed','Overtime without pay','Workplace harassment','Leave request rejected','Unsafe workplace'];

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return SCENARIOS.filter(s => s.q.toLowerCase().includes(q) || s.tags.some(t => t.includes(q) || q.includes(t.split(' ')[0])));
  }, [query]);

  const pick = (s) => {
    setActive(s);
    onLog && onLog(s.id);
  };

  return (
    <section className="py-10 md:py-14 relative">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <SectionHeading align="center" eyebrow="Describe it, don't search for it" eyebrowIcon="compass"
          title="Tell us what's happening at work" sub="No legal terms required. Describe your situation the way you'd tell a friend, and we'll surface the rights, laws, and exact next steps." />

        <div className="relative max-w-2xl mx-auto">
          <div className="relative">
            <Icon name="search" size={19} className="absolute left-5 top-1/2 -translate-y-1/2" style={{ color:'var(--stone)' }}/>
            <input value={query} onChange={e => { setQuery(e.target.value); setActive(null); }}
              placeholder="Describe your workplace issue..."
              className="focus-ring w-full pl-14 pr-5 py-4.5 rounded-2xl text-[15px] shadow-sm border"
              style={{ background:'var(--card)', borderColor:'var(--line)', color:'var(--ink)', paddingTop:'1.1rem', paddingBottom:'1.1rem' }}/>
          </div>
          <div className="flex gap-2 flex-wrap mt-4 justify-center">
            {examples.map(ex => (
              <Pill key={ex} active={query===ex} onClick={() => { setQuery(ex); setActive(null); }}>{ex}</Pill>
            ))}
          </div>
        </div>

        <div className="mt-8 max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {query && !active && (
              <motion.div key="results" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="space-y-3">
                {results.length === 0 ? (
                  <div className="text-center py-8 text-sm" style={{ color:'var(--ink-soft)' }}>
                    No exact match yet — try one of the examples above.
                  </div>
                ) : results.map(r => (
                  <button key={r.id} onClick={() => pick(r)}
                    className="focus-ring w-full text-left tab-card glass rounded-2xl p-5 flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <IconBadge icon="alertTriangle" color="coral" size={42}/>
                      <div>
                        <div className="font-semibold text-[15px]" style={{ color:'var(--ink)' }}>{r.q}</div>
                        <div className="text-xs mt-0.5 font-mono" style={{ color:'var(--ink-soft)' }}>{r.rights.length} rights · {r.laws.length} laws · {r.actions.length} actions</div>
                      </div>
                    </div>
                    <Icon name="chevronRight" size={18} style={{ color:'var(--stone)' }}/>
                  </button>
                ))}
              </motion.div>
            )}

            {active && (
              <motion.div key="active" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
                className="tab-card rounded-3xl p-6 md:p-8 shadow-lg border" style={{ background:'var(--card)', borderColor:'var(--line)' }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <IconBadge icon="alertTriangle" color="coral" size={46}/>
                    <h3 className="font-display text-xl font-semibold" style={{ color:'var(--ink)' }}>{active.q}</h3>
                  </div>
                  <button onClick={() => { setActive(null); }} className="focus-ring p-1.5 rounded-full" style={{color:'var(--stone)'}}>
                    <Icon name="x" size={18}/>
                  </button>
                </div>

                <div className="grid sm:grid-cols-3 gap-5 mt-6">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2.5" style={{ color:'var(--teal)' }}>
                      <Icon name="shield" size={15}/><span className="text-xs font-semibold uppercase tracking-wide">Your Rights</span>
                    </div>
                    <ul className="space-y-2 text-[13.5px] leading-snug" style={{ color:'var(--ink-soft)' }}>
                      {active.rights.map((r,i) => <li key={i} className="flex gap-2"><span style={{color:'var(--teal)'}}>•</span>{r}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-2.5" style={{ color:'var(--ink)' }}>
                      <Icon name="scale" size={15}/><span className="text-xs font-semibold uppercase tracking-wide">Relevant Laws</span>
                    </div>
                    <ul className="space-y-2 text-[13.5px] leading-snug" style={{ color:'var(--ink-soft)' }}>
                      {active.laws.map((l,i) => <li key={i} className="flex gap-2"><span style={{color:'var(--ink)'}}>•</span>{l}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-2.5" style={{ color:'var(--coral)' }}>
                      <Icon name="flag" size={15}/><span className="text-xs font-semibold uppercase tracking-wide">Suggested Actions</span>
                    </div>
                    <ol className="space-y-2 text-[13.5px] leading-snug" style={{ color:'var(--ink-soft)' }}>
                      {active.actions.map((a,i) => <li key={i} className="flex gap-2"><span className="font-mono font-medium" style={{color:'var(--coral)'}}>{i+1}.</span>{a}</li>)}
                    </ol>
                  </div>
                </div>
                <div className="mt-6 pt-5 flex flex-wrap gap-3" style={{ borderTop:'1px solid var(--line)' }}>
                  <button onClick={()=>onNav('complaints')}
                    className="focus-ring px-5 py-2.5 rounded-full text-sm font-semibold" style={{ background:'var(--coral)', color:'#fff' }}>
                    Start a Complaint
                  </button>
                  <button onClick={()=>onNav('laws')}
                    className="focus-ring px-5 py-2.5 rounded-full text-sm font-semibold border-2" style={{ borderColor:'var(--ink)', color:'var(--ink)' }}>
                    Read Full Laws
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};


const LawModal = ({ law, onClose }) => (
  <AnimatePresence>
    {law && (
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background:'rgba(0,0,0,0.5)' }} onClick={onClose}>
        <motion.div initial={{opacity:0, y:24, scale:0.96}} animate={{opacity:1, y:0, scale:1}} exit={{opacity:0, y:16, scale:0.97}}
          transition={{ duration:0.25, ease:[0.22,1,0.36,1] }}
          onClick={e=>e.stopPropagation()}
          className="w-full max-w-lg rounded-3xl p-7 max-h-[85vh] overflow-y-auto" style={{ background:'var(--card)', border:'1px solid var(--line)' }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider" style={{ color:'var(--coral)' }}>{law.category} · {law.importance} priority</span>
              <h3 className="font-display text-2xl font-semibold mt-1" style={{ color:'var(--ink)' }}>{law.title}</h3>
            </div>
            <button onClick={onClose} className="focus-ring p-1.5 rounded-full shrink-0" style={{color:'var(--stone)'}}><Icon name="x" size={20}/></button>
          </div>
          <p className="text-[14px] leading-relaxed mt-4" style={{ color:'var(--ink-soft)' }}>{law.summary}</p>

          <div className="mt-5 rounded-xl p-4" style={{ background:'var(--paper-deep)' }}>
            <div className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color:'var(--ink)' }}>Who this protects</div>
            <p className="text-[13.5px]" style={{ color:'var(--ink-soft)' }}>{law.protects}</p>
          </div>

          <div className="mt-5">
            <div className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color:'var(--teal)' }}>Employee benefits</div>
            <ul className="space-y-1.5 text-[13.5px]" style={{ color:'var(--ink-soft)' }}>
              {law.benefits.map((b,i) => <li key={i} className="flex gap-2"><Icon name="checkCircle" size={14} className="shrink-0 mt-0.5" style={{color:'var(--teal)'}}/>{b}</li>)}
            </ul>
          </div>

          <div className="mt-5 rounded-xl p-4" style={{ background:'var(--coral-soft)' }}>
            <div className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color:'var(--coral)' }}>Example situation</div>
            <p className="text-[13.5px] leading-relaxed" style={{ color:'var(--ink)' }}>{law.example}</p>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const LawExplorer = ({ onView, highlight, clearHighlight, laws = LAWS }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [openLaw, setOpenLaw] = useState(null);
  const cardRefs = useRef({});
  const cats = ['All', ...Array.from(new Set(laws.map(l=>l.category)))];

  const filtered = laws.filter(l =>
    (filter==='All' || l.category===filter) &&
    (l.title.toLowerCase().includes(search.toLowerCase()) || l.summary.toLowerCase().includes(search.toLowerCase())));

  useEffect(() => {
    if (highlight && highlight.type === 'law') {
      const law = laws.find(l => l.id === highlight.refId);
      if (law) {
        setSearch('');
        setFilter('All');
        onView && onView(law.id);
        const t = setTimeout(() => {
          const el = cardRefs.current[law.id];
          if (el) el.scrollIntoView({ behavior:'smooth', block:'center' });
        }, 80);
        const clearT = setTimeout(() => clearHighlight && clearHighlight(), 2400);
        return () => { clearTimeout(t); clearTimeout(clearT); };
      }
    }
  }, [highlight]);

  return (
    <section className="py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <SectionHeading eyebrow="Discover the law" eyebrowIcon="scale" title="Labour Law Explorer"
          sub="The legal backbone behind every right. Search, filter by category, and tap any card for the plain-language breakdown." />

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Icon name="search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{color:'var(--stone)'}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search laws..."
              className="focus-ring w-full pl-11 pr-4 py-3 rounded-xl text-sm border" style={{ background:'var(--card)', borderColor:'var(--line)', color:'var(--ink)' }}/>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {cats.map(c => <Pill key={c} active={filter===c} onClick={()=>setFilter(c)} color="teal">{c}</Pill>)}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((law,i) => {
            const isHighlighted = highlight && highlight.type === 'law' && highlight.refId === law.id;
            return (
            <motion.button key={law.id} ref={el => cardRefs.current[law.id] = el} layout onClick={() => { setOpenLaw(law); onView && onView(law.id); }}
              initial={{opacity:0, y:14}} whileInView={{opacity:1, y:0}} viewport={{once:true, margin:"-40px"}} transition={{duration:0.4, delay:(i%6)*0.04}}
              className="focus-ring text-left tab-card rounded-2xl p-5 border hover:-translate-y-1 hover:shadow-md transition-all"
              style={{ background:'var(--card)', borderColor: isHighlighted ? 'var(--coral)' : 'var(--line)', boxShadow: isHighlighted ? '0 0 0 3px var(--coral-soft)' : 'none' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] px-2 py-1 rounded-full uppercase tracking-wide"
                  style={{ background: law.importance==='High' ? 'var(--coral-soft)' : 'var(--teal-soft)', color: law.importance==='High' ? 'var(--coral)' : 'var(--teal)' }}>
                  {law.importance} priority
                </span>
                <Icon name="fileText" size={16} style={{color:'var(--stone)'}}/>
              </div>
              <h4 className="font-display font-semibold text-[15px] leading-snug" style={{ color:'var(--ink)' }}>{law.title}</h4>
              <p className="text-[13px] mt-2 leading-snug" style={{ color:'var(--ink-soft)' }}>{law.summary}</p>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium" style={{ color:'var(--coral)' }}>
                See details <Icon name="chevronRight" size={13}/>
              </div>
            </motion.button>
            );
          })}
        </div>
        {filtered.length===0 && <div className="text-center py-12 text-sm" style={{color:'var(--ink-soft)'}}>No laws match your search.</div>}
      </div>
      <LawModal law={openLaw} onClose={() => setOpenLaw(null)}/>
    </section>
  );
};

/* ============ WORKPLACE POLICIES CENTER ============ */
const PolicyCard = React.forwardRef(({ policy, expanded, onToggle, isHighlighted }, ref) => (
  <div ref={ref} className="tab-card rounded-2xl border p-5" style={{ background:'var(--card)', borderColor: isHighlighted ? 'var(--coral)' : 'var(--line)', boxShadow: isHighlighted ? '0 0 0 3px var(--coral-soft)' : 'none', transition:'border-color 0.4s, box-shadow 0.4s' }}>
    <div className="flex items-center gap-3.5">
      <IconBadge icon={policy.icon} color="ink" size={44}/>
      <div className="flex-1 min-w-0">
        <div className="font-display font-semibold text-[15px]" style={{ color:'var(--ink)' }}>{policy.title}</div>
        <div className="text-[12.5px] mt-0.5 leading-snug" style={{ color:'var(--ink-soft)' }}>{policy.summary}</div>
      </div>
    </div>
    <button onClick={onToggle} className="focus-ring mt-4 flex items-center gap-1.5 text-xs font-semibold" style={{ color:'var(--coral)' }}>
      {expanded ? 'Hide details' : 'Learn More'}
      <span style={{ display:'inline-flex', transform: expanded?'rotate(180deg)':'rotate(0deg)', transition:'transform 0.2s' }}><Icon name="chevronDown" size={13}/></span>
    </button>
    <AutoHeight open={expanded}>
      <div className="mt-4 pt-4 space-y-4" style={{ borderTop:'1px solid var(--line)' }}>
        {policy.timeline.map((step, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background:'var(--coral)' }}/>
              {i < policy.timeline.length-1 && <div className="w-px flex-1 mt-1" style={{ background:'var(--line)', minHeight:'20px' }}/>}
            </div>
            <div className="pb-1">
              <div className="text-[13px] font-semibold" style={{ color:'var(--ink)' }}>{step.t}</div>
              <div className="text-[12.5px] leading-snug mt-0.5" style={{ color:'var(--ink-soft)' }}>{step.d}</div>
            </div>
          </div>
        ))}
      </div>
    </AutoHeight>
  </div>
));

const PoliciesCenter = ({ highlight, clearHighlight, policies = POLICIES }) => {
  const [openId, setOpenId] = useState(null);
  const cardRefs = useRef({});

  useEffect(() => {
    if (highlight && highlight.type === 'policy') {
      const policy = policies.find(p => p.id === highlight.refId);
      if (policy) {
        setOpenId(policy.id);
        const t = setTimeout(() => {
          const el = cardRefs.current[policy.id];
          if (el) el.scrollIntoView({ behavior:'smooth', block:'center' });
        }, 80);
        const clearT = setTimeout(() => clearHighlight && clearHighlight(), 2400);
        return () => { clearTimeout(t); clearTimeout(clearT); };
      }
    }
  }, [highlight]);

  return (
    <section className="py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <SectionHeading eyebrow="From law to daily practice" eyebrowIcon="fileText" title="Workplace Policies Center"
          sub="The everyday rules your company runs on, broken into the steps that actually happen, in order." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ alignItems: 'flex-start' }}>
          {policies.map(p => (
            <PolicyCard key={p.id} ref={el => cardRefs.current[p.id] = el} policy={p} expanded={openId===p.id}
              onToggle={() => setOpenId(openId===p.id ? null : p.id)} isHighlighted={highlight && highlight.type==='policy' && highlight.refId===p.id}/>
          ))}
        </div>
      </div>
    </section>
  );
};



/* ============ COMPLAINT TRACKING ============ */
const STAGES = ['Submitted','Under Review','Investigation','Resolved'];
const HR_STAFF = ['Priya Menon','Karthik Iyer','Fatima Sheikh','Rohan Desai'];
const STAGE_COLOR = (stage) => stage>=3 ? 'teal' : stage===2 ? 'purple' : stage===1 ? 'coral' : 'blue';

const StatusBadge = ({ stage }) => {
  const color = STAGE_COLOR(stage);
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide"
      style={{ background: colorSoft(color), color: colorVar(color) }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: colorVar(color) }}/>
      {STAGES[stage]}
    </span>
  );
};

const ComplaintTracker = ({ complaints, onSubmit, highlight, clearHighlight }) => {
  const [mode, setMode] = useState('submit'); // submit | track
  const [form, setForm] = useState({ category:'Harassment', desc:'' });
  const [expandedIds, setExpandedIds] = useState({});
  const cardRefs = useRef({});

  const toggleExpand = (id) => {
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const submit = () => {
    if (!form.desc.trim()) return;
    const id = 'WR-' + Math.floor(10000 + Math.random()*89999);
    const now = new Date();
    const c = {
      id, category: form.category, desc: form.desc, stage: 0,
      date: now.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }),
      hr: HR_STAFF[Math.floor(Math.random()*HR_STAFF.length)],
      resolutionDate: null,
      lastUpdated: now.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }),
    };
    onSubmit(c);
    setForm({ category:'Harassment', desc:'' });
    setMode('track');
    setExpandedIds(prev => ({ ...prev, [id]: true })); // expand the newly submitted complaint
  };

  useEffect(() => {
    if (highlight && highlight.type === 'complaint') {
      setMode('track');
      setExpandedIds(prev => ({ ...prev, [highlight.refId]: true }));
      const t = setTimeout(() => {
        const el = cardRefs.current[highlight.refId];
        if (el) el.scrollIntoView({ behavior:'smooth', block:'center' });
      }, 80);
      const clearT = setTimeout(() => clearHighlight && clearHighlight(), 2400);
      return () => { clearTimeout(t); clearTimeout(clearT); };
    }
  }, [highlight]);

  return (
    <section className="py-10 md:py-14">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <SectionHeading eyebrow="When you need to act" eyebrowIcon="flag" title="Complaint Tracking"
          sub="File a grievance and follow it end to end — complaint ID, assigned HR, and live status, with no black box." />

        <div className="flex gap-2 mb-6 justify-center">
          <Pill active={mode==='submit'} onClick={()=>setMode('submit')} color="coral">Submit Complaint</Pill>
          <Pill active={mode==='track'} onClick={()=>setMode('track')} color="coral">Track Status {complaints.length>0 && `(${complaints.length})`}</Pill>
        </div>

        <AnimatePresence mode="wait">
        {mode === 'submit' ? (
          <motion.div key="submit" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            className="max-w-xl mx-auto tab-card rounded-3xl border p-7" style={{ background:'var(--card)', borderColor:'var(--line)' }}>
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ color:'var(--ink)' }}>Category</label>
            <div className="flex gap-2 flex-wrap mt-2 mb-5">
              {['Harassment','Salary','Safety','Leave','Other'].map(c => (
                <Pill key={c} active={form.category===c} onClick={()=>setForm({...form, category:c})}>{c}</Pill>
              ))}
            </div>
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ color:'var(--ink)' }}>What happened?</label>
            <textarea value={form.desc} onChange={e=>setForm({...form, desc:e.target.value})} rows={4}
              placeholder="Describe the issue with as much detail as you're comfortable sharing..."
              className="focus-ring w-full mt-2 p-4 rounded-xl text-sm border resize-none" style={{ background:'var(--paper)', borderColor:'var(--line)', color:'var(--ink)' }}/>
            <button onClick={submit} disabled={!form.desc.trim()}
              className="focus-ring mt-5 w-full py-3.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40"
              style={{ background:'var(--coral)', color:'#fff' }}>
              Submit Complaint <Icon name="send" size={15}/>
            </button>
            <p className="text-[11.5px] text-center mt-3" style={{ color:'var(--stone)' }}>Submissions are confidential and routed to the appropriate internal channel.</p>
          </motion.div>
        ) : (
          <motion.div key="track" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="space-y-5">
            {complaints.length === 0 ? (
              <div className="text-center py-14">
                <Icon name="folder" size={36} className="mx-auto mb-3" style={{ color:'var(--stone)' }}/>
                <p className="text-sm" style={{ color:'var(--ink-soft)' }}>No complaints filed yet.</p>
                <button onClick={()=>setMode('submit')} className="focus-ring mt-3 text-sm font-semibold underline" style={{ color:'var(--coral)' }}>File your first one</button>
              </div>
            ) : complaints.map(c => {
              const isHighlighted = highlight && highlight.type === 'complaint' && highlight.refId === c.id;
              const expanded = !!expandedIds[c.id];
              return (
              <div key={c.id} ref={el => cardRefs.current[c.id] = el}
                className="tab-card rounded-2xl border overflow-hidden" style={{ background:'var(--card)', borderColor: isHighlighted ? 'var(--coral)' : 'var(--line)', boxShadow: isHighlighted ? '0 0 0 3px var(--coral-soft)' : 'none', transition:'border-color 0.4s, box-shadow 0.4s' }}>
                <div className="p-6">
                  {/* Clickable Card Header & Desc */}
                  <div onClick={() => toggleExpand(c.id)} className="cursor-pointer select-none">
                    <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background:'var(--paper-deep)', color:'var(--ink)' }}>{c.id}</span>
                        <span className="text-xs" style={{ color:'var(--stone)' }}>{c.category} · filed {c.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge stage={c.stage}/>
                        <span style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-flex', color: 'var(--stone)' }}>
                          <Icon name="chevronDown" size={16}/>
                        </span>
                      </div>
                    </div>
                    <p className="text-[13.5px] leading-relaxed" style={{ color:'var(--ink-soft)' }}>{c.desc}</p>
                  </div>

                  <AutoHeight open={expanded}>
                    <div className="pt-5 border-t mt-4" style={{ borderColor:'var(--line)' }}>
                      <div className="grid sm:grid-cols-3 gap-4 mb-7">
                        <div className="flex items-center gap-2.5">
                          <IconBadge icon="fileText" color="ink" size={36}/>
                          <div>
                            <div className="text-[10.5px] uppercase tracking-wide font-semibold" style={{ color:'var(--stone)' }}>Complaint ID</div>
                            <div className="text-[13px] font-medium font-mono" style={{ color:'var(--ink)' }}>{c.id}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <IconBadge icon="flag" color="coral" size={36}/>
                          <div>
                            <div className="text-[10.5px] uppercase tracking-wide font-semibold" style={{ color:'var(--stone)' }}>Category</div>
                            <div className="text-[13px] font-medium" style={{ color:'var(--ink)' }}>{c.category}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <IconBadge icon="userCheck" color="ink" size={36}/>
                          <div>
                            <div className="text-[10.5px] uppercase tracking-wide font-semibold" style={{ color:'var(--stone)' }}>Assigned HR</div>
                            <div className="text-[13px] font-medium" style={{ color:'var(--ink)' }}>{c.hr}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <IconBadge icon="calendar" color="blue" size={36}/>
                          <div>
                            <div className="text-[10.5px] uppercase tracking-wide font-semibold" style={{ color:'var(--stone)' }}>Submission Date</div>
                            <div className="text-[13px] font-medium" style={{ color:'var(--ink)' }}>{c.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <IconBadge icon="checkCircle" color={c.stage>=3?'teal':'coral'} size={36}/>
                          <div>
                            <div className="text-[10.5px] uppercase tracking-wide font-semibold" style={{ color:'var(--stone)' }}>Resolution Date</div>
                            <div className="text-[13px] font-medium" style={{ color:'var(--ink)' }}>{c.stage>=3 ? (c.resolutionDate || 'Just now') : 'Pending'}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <IconBadge icon="activity" color={STAGE_COLOR(c.stage)} size={36}/>
                          <div>
                            <div className="text-[10.5px] uppercase tracking-wide font-semibold" style={{ color:'var(--stone)' }}>Last Updated</div>
                            <div className="text-[13px] font-medium" style={{ color:'var(--ink)' }}>{c.lastUpdated || c.resolutionDate || c.date}</div>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs font-semibold uppercase tracking-wide mb-5" style={{ color:'var(--ink)' }}>Progress Timeline</div>
                      <div className="relative flex justify-between mb-2">
                        <div className="absolute top-3 left-[12.5%] right-[12.5%] h-0.5" style={{ background:'var(--line)' }}/>
                        <motion.div initial={{width:0}} animate={{width: `${(c.stage/(STAGES.length-1))*75}%`}} transition={{duration:1, ease:[0.22,1,0.36,1]}}
                          className="absolute top-3 left-[12.5%] h-0.5" style={{ background:'var(--teal)' }}/>
                        {STAGES.map((s,i) => (
                          <div key={s} className="relative flex flex-col items-center" style={{ width: `${100/STAGES.length}%` }}>
                            <motion.div initial={{scale:0.6}} animate={{scale:1}} transition={{delay:i*0.15}}
                              className="w-6 h-6 rounded-full flex items-center justify-center z-10"
                              style={{ background: i<=c.stage ? 'var(--teal)' : 'var(--card)', border: `2px solid ${i<=c.stage ? 'var(--teal)' : 'var(--line)'}` }}>
                              { (i < c.stage || (i === c.stage && c.stage === STAGES.length - 1)) ? (
                                <Icon name="check" size={10} className="text-white" strokeWidth={3}/>
                              ) : i === c.stage ? (
                                <div className="w-1.5 h-1.5 rounded-full bg-white"/>
                              ) : null }
                            </motion.div>
                            <span className="text-[10.5px] mt-2 text-center font-medium" style={{ color: i<=c.stage ? 'var(--ink)' : 'var(--stone)' }}>{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AutoHeight>
                </div>
              </div>
              );
            })}
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </section>
  );
};

/* ============ EMPLOYEE DASHBOARD ============ */
const MiniBar = ({ value, max, color }) => (
  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background:'var(--paper-deep)' }}>
    <motion.div initial={{width:0}} whileInView={{width: `${Math.min(100,(value/max)*100)}%`}} viewport={{once:true}} transition={{duration:1, ease:[0.22,1,0.36,1]}}
      className="h-full rounded-full" style={{ background: colorVar(color) }}/>
  </div>
);

const Dashboard = ({ stats, complaints, onNav, employee, notifications, setHighlight, onNotificationClick }) => {
  const activeCount = complaints.filter(c => c.stage < 3).length;
  const underInvestigationCount = complaints.filter(c => c.stage === 2).length;
  const unreadNotifCount = notifications.filter(n => n.unread).length;
  const resolvedCount = complaints.filter(c => c.stage === 3).length;
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
  const categoryCounts = CATEGORY_META.map(cat => ({
    ...cat,
    count: complaints.filter(c => c.category === cat.key).length,
    pct: totalCount > 0 ? Math.round((complaints.filter(c => c.category === cat.key).length / totalCount) * 100) : 0
  })).filter(c => c.count > 0);

  const widgets = [
    { label: 'Total Complaints Filed', value: totalCount, icon: 'flag', color: 'ink' },
    { label: 'Active Complaints', value: activeCount, icon: 'activity', color: 'coral' },
    { label: 'Resolved Complaints', value: resolvedCount, icon: 'checkCircle', color: 'teal' },
    { label: 'Open Requiring Attention', value: attentionCount, icon: 'shieldAlert', color: 'blue' }
  ];

  const recentComplaints = complaints.slice(0, 3);

  const lawUpdates = [
    { t: 'Minimum Wage Law revised for FY26', d: '2 days ago', lawId: 'min-wage', cat: 'Salary', color: 'teal' },
    { t: 'New nursing-break guidance under Maternity Benefit Law', d: '1 week ago', lawId: 'maternity', cat: 'Leave', color: 'coral' },
    { t: 'Overtime threshold clarification issued', d: '3 weeks ago', lawId: 'hours-act', cat: 'Hours', color: 'teal' }
  ];


  return (
    <section className="py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <SectionHeading eyebrow="Your activity" eyebrowIcon="activity" title="Employee Dashboard"
          sub="A quick look at what you've explored, what you've filed, and what's changed recently." />

        {/* Welcome Section */}
        <div className="tab-card rounded-3xl border p-6 md:p-8 mb-8 relative overflow-hidden flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6"
          style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] font-medium" style={{ color: 'var(--coral)' }}>EMPLOYEE SELF-SERVICE</span>
            <h3 className="font-display text-2xl md:text-3xl font-semibold mt-1" style={{ color: 'var(--ink)' }}>Welcome Back, {employee.name}</h3>
            <p className="text-[13.5px] mt-1.5 max-w-lg leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
              Access your workplace rights, explore laws and policies, and monitor compliance status from your central employee portal.
            </p>
          </div>
          <div className="flex flex-row sm:flex-col gap-3 shrink-0 w-full sm:w-auto text-left">
            <div className="flex-1 px-4 py-2.5 rounded-xl border flex items-center gap-3" style={{ background: 'var(--paper-deep)', borderColor: 'var(--line)' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--coral)' }}/>
              <span className="text-[12.5px] font-medium" style={{ color: 'var(--ink)' }}>{activeCount} Active {activeCount === 1 ? 'Complaint' : 'Complaint'}</span>
            </div>
            <div className="flex-1 px-4 py-2.5 rounded-xl border flex items-center gap-3" style={{ background: 'var(--paper-deep)', borderColor: 'var(--line)' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--purple)' }}/>
              <span className="text-[12.5px] font-medium" style={{ color: 'var(--ink)' }}>{underInvestigationCount} Under Investigation</span>
            </div>
            <div className="flex-1 px-4 py-2.5 rounded-xl border flex items-center gap-3" style={{ background: 'var(--paper-deep)', borderColor: 'var(--line)' }}>
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--blue)' }}/>
              <span className="text-[12.5px] font-medium" style={{ color: 'var(--ink)' }}>{unreadNotifCount} Unread {unreadNotifCount === 1 ? 'Notification' : 'Notifications'}</span>
            </div>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {widgets.map(w => (
            <div key={w.label} className="tab-card rounded-2xl border p-5 transition-all hover:-translate-y-1 hover:shadow-md" style={{ background:'var(--card)', borderColor:'var(--line)' }}>
              <IconBadge icon={w.icon} color={w.color} size={38}/>
              <div className="font-display text-2xl font-semibold mt-3" style={{ color:'var(--ink)' }}>
                <AnimatedCounter to={w.value}/>
              </div>
              <div className="text-xs mt-0.5" style={{ color:'var(--ink-soft)' }}>{w.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Complaints Section */}
        <div className="tab-card rounded-2xl border p-6 mb-8" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h4 className="font-display font-semibold text-[15px]" style={{ color: 'var(--ink)' }}>Recent Complaints</h4>
            <button onClick={() => onNav('complaints')} className="focus-ring text-[12px] font-semibold flex items-center gap-1" style={{ color: 'var(--coral)' }}>
              View all tracking <Icon name="chevronRight" size={13}/>
            </button>
          </div>
          {recentComplaints.length === 0 ? (
            <p className="text-[13px]" style={{ color: 'var(--ink-soft)' }}>No complaints filed yet.</p>
          ) : (
            <div className="divide-y" style={{ borderColor: 'var(--line)' }}>
              {recentComplaints.map(c => (
                <button key={c.id} onClick={() => { onNav('complaints'); setHighlight({ type: 'complaint', refId: c.id, nonce: Date.now() }); }}
                  className="focus-ring w-full text-left py-3.5 flex items-center justify-between gap-4 transition-all hover:bg-var(--paper-deep) rounded-lg px-2 -mx-2 hover:brightness-95">
                  <div className="flex items-center gap-3">
                    <Icon name="flag" size={16} className="shrink-0" style={{ color: 'var(--coral)' }}/>
                    <span className="font-mono text-sm font-semibold" style={{ color: 'var(--ink)' }}>{c.id}</span>
                    <span className="text-[13.5px] font-medium" style={{ color: 'var(--ink-soft)' }}>{c.category}</span>
                  </div>
                  <span className="text-xs font-mono" style={{ color: 'var(--stone)' }}>Filed {c.date}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {/* Left Column */}
          <div className="flex flex-col gap-5">
            {/* Workplace Concerns by Category */}
            <div className="tab-card rounded-2xl border p-6 flex flex-col" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-display font-semibold text-[15px]" style={{ color: 'var(--ink)' }}>Workplace Concerns by Category</h4>
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
                  <Icon name="flag" size={32} className="mx-auto mb-3" style={{ color: 'var(--line)' }}/>
                  <p className="text-[13px] font-medium" style={{ color: 'var(--ink-soft)' }}>No complaints filed yet.</p>
                  <p className="text-[12px] mt-1" style={{ color: 'var(--stone)' }}>File a complaint to see your category breakdown here.</p>
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
                          const colors = ['var(--teal)','var(--coral)','var(--blue)','var(--purple)','var(--stone)','var(--ink)'];
                          return categoryCounts.map((cat, i) => {
                            const arc = (cat.pct / 100) * circ;
                            const el = <circle key={cat.key} cx="50" cy="50" r="40" fill="none" strokeWidth="8"
                              strokeDasharray={`${arc} ${circ}`} strokeDashoffset={-offset}
                              transform="rotate(-90 50 50)" style={{ stroke: colors[i % colors.length] }} />;
                            offset += arc;
                            return el;
                          });
                        })()}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="font-display text-lg font-bold leading-none" style={{ color: 'var(--ink)' }}>{totalCount}</span>
                        <span className="text-[9px] font-semibold tracking-wider uppercase mt-1" style={{ color: 'var(--stone)' }}>Total</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3.5">
                    {categoryCounts.map((cat, i) => (
                      <button key={i} onClick={() => cat.lawId && onNav && (onNav('laws'), setHighlight({ type: 'law', refId: cat.lawId, nonce: Date.now() }))}
                        className="focus-ring w-full text-left group flex items-center gap-3.5 transition-all p-2.5 rounded-2xl border"
                        style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
                        <div className="rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                          style={{ width: 36, height: 36, background: colorSoft(cat.color), color: colorVar(cat.color) }}>
                          <Icon name={cat.icon} size={16} strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[12.5px] font-semibold" style={{ color: 'var(--ink)' }}>{cat.name}</span>
                            <span className="text-[11px] font-mono font-medium" style={{ color: 'var(--stone)' }}>{cat.count} {cat.count === 1 ? 'case' : 'cases'} ({cat.pct}%)</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--paper-deep)' }}>
                            <motion.div initial={{ width: 0 }} whileInView={{ width: `${cat.pct}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.05 }}
                              className="h-full rounded-full" style={{ background: colorVar(cat.color) }} />
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
                <h4 className="font-display font-semibold text-[15px]" style={{ color: 'var(--ink)' }}>Resolution Performance</h4>
                <button className="focus-ring text-[16px] font-semibold hover:opacity-85" style={{ color: 'var(--stone)' }} aria-label="More options">
                  <span className="font-bold">•••</span>
                </button>
              </div>
<div className="grid grid-cols-2 gap-3.5">
                {/* Total Filed */}
                <div className="rounded-xl border p-3 flex flex-col justify-between" style={{ background: 'var(--paper-deep)', borderColor: 'var(--line)' }}>
                  <div className="flex items-center gap-2">
                    <IconBadge icon="flag" color="ink" size={32}/>
                    <span className="text-[11px] font-medium leading-tight" style={{ color: 'var(--ink-soft)' }}>Total Complaints</span>
                  </div>
                  <div className="mt-2.5">
                    <div className="font-display text-lg font-semibold" style={{ color: 'var(--ink)' }}>{totalCount}</div>
                    <div className="text-[10px] font-medium mt-1" style={{ color: 'var(--stone)' }}>Complaints filed by you</div>
                  </div>
                </div>

                {/* Resolution Rate */}
                <div className="rounded-xl border p-3 flex flex-col justify-between" style={{ background: 'var(--paper-deep)', borderColor: 'var(--line)' }}>
                  <div className="flex items-center gap-2">
                    <IconBadge icon="checkCircle" color="teal" size={32}/>
                    <span className="text-[11px] font-medium leading-tight" style={{ color: 'var(--ink-soft)' }}>Resolution Rate</span>
                  </div>
                  <div className="mt-2.5">
                    <div className="font-display text-lg font-semibold" style={{ color: 'var(--ink)' }}>{totalCount > 0 ? resolutionRate + '%' : '—'}</div>
                    <div className="text-[10px] font-medium mt-1" style={{ color: 'var(--stone)' }}>{resolvedCount} of {totalCount} resolved</div>
                  </div>
                </div>

                {/* Active Cases */}
                <div className="rounded-xl border p-3 flex flex-col justify-between" style={{ background: 'var(--paper-deep)', borderColor: 'var(--line)' }}>
                  <div className="flex items-center gap-2">
                    <IconBadge icon="activity" color="coral" size={32}/>
                    <span className="text-[11px] font-medium leading-tight" style={{ color: 'var(--ink-soft)' }}>Active Cases</span>
                  </div>
                  <div className="mt-2.5">
                    <div className="font-display text-lg font-semibold" style={{ color: 'var(--ink)' }}>{activeCount}</div>
                    <div className="text-[10px] font-medium mt-1" style={{ color: 'var(--stone)' }}>In progress</div>
                  </div>
                </div>

                {/* Unread Notifications */}
                <div className="rounded-xl border p-3 flex flex-col justify-between" style={{ background: 'var(--paper-deep)', borderColor: 'var(--line)' }}>
                  <div className="flex items-center gap-2">
                    <IconBadge icon="bell" color="blue" size={32}/>
                    <span className="text-[11px] font-medium leading-tight" style={{ color: 'var(--ink-soft)' }}>Unread Notifications</span>
                  </div>
                  <div className="mt-2.5">
                    <div className="font-display text-lg font-semibold" style={{ color: 'var(--ink)' }}>{unreadNotifCount}</div>
                    <div className="text-[10px] font-medium mt-1" style={{ color: 'var(--stone)' }}>Awaiting your review</div>
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
                <h4 className="font-display font-semibold text-[15px]" style={{ color: 'var(--ink)' }}>Latest Labour Law Updates</h4>
                <button onClick={() => onNav('laws')} className="focus-ring text-[12px] font-semibold flex items-center gap-1" style={{ color: 'var(--blue)' }}>
                  View all
                </button>
              </div>
              <div className="space-y-3.5">
                {lawUpdates.map((u, i) => (
                  <button key={i} onClick={() => { onNav('laws'); setHighlight({ type: 'law', refId: u.lawId, nonce: Date.now() }); }}
                    className="focus-ring w-full text-left flex items-center gap-3.5 transition-all hover:bg-var(--paper-deep) p-3 rounded-2xl border"
                    style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
                    <div className="rounded-xl flex items-center justify-center shrink-0"
                      style={{ width: 40, height: 40, background: 'var(--paper-deep)', color: 'var(--stone)' }}>
                      <Icon name="fileText" size={18} strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold leading-snug truncate" style={{ color: 'var(--ink)' }}>{u.t}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-semibold" style={{ color: 'var(--teal)' }}>Law Update</span>
                        <span className="text-[11px] font-mono" style={{ color: 'var(--stone)' }}>{u.d}</span>
                      </div>
                    </div>
                    <Icon name="chevronRight" size={14} style={{ color: 'var(--stone)' }} className="shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="tab-card rounded-2xl border p-6" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
              <h4 className="font-display font-semibold text-[15px] mb-3" style={{ color: 'var(--ink)' }}>Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'complaints', label: 'File Complaint', icon: 'plus', color: 'coral' },
                  { id: 'complaints', label: 'Track Status', icon: 'activity', color: 'teal' },
                  { id: 'laws', label: 'Labour Laws', icon: 'scale', color: 'blue' },
                  { id: 'policies', label: 'View Policies', icon: 'fileText', color: 'purple' },
                  { id: 'profile', label: 'Open Profile', icon: 'user', color: 'stone' }
                ].map((act, index) => (
                  <button key={index} onClick={() => onNav(act.id)}
                    className="focus-ring flex flex-col items-center justify-center p-3 rounded-xl border transition-all hover:-translate-y-0.5 hover:shadow-sm text-center"
                    style={{ background: 'var(--paper-deep)', borderColor: 'var(--line)' }}>
                    <IconBadge icon={act.icon} color={act.color} size={28}/>
                    <span className="text-[12px] font-semibold mt-2" style={{ color: 'var(--ink)' }}>{act.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Help & Support */}
            <div className="tab-card rounded-2xl border p-6" style={{ background: 'var(--card)', borderColor: 'var(--line)' }}>
              <h4 className="font-display font-semibold text-[15px] mb-2" style={{ color: 'var(--ink)' }}>Help & Support</h4>
              <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--ink-soft)' }}>Need workplace assistance or have direct concerns? Connect with resource teams.</p>
              <div className="space-y-2">
                <a href="mailto:hr@meridianlog.com" className="focus-ring flex items-center justify-between p-2.5 rounded-xl border text-[12.5px] font-semibold"
                  style={{ background: 'var(--paper-deep)', borderColor: 'var(--line)', color: 'var(--ink)' }}>
                  <span className="flex items-center gap-2"><Icon name="mail" size={14}/> Contact HR</span>
                  <Icon name="chevronRight" size={13}/>
                </a>
                <button onClick={() => onNav('complaints')} className="focus-ring w-full flex items-center justify-between p-2.5 rounded-xl border text-[12.5px] font-semibold"
                  style={{ background: 'var(--paper-deep)', borderColor: 'var(--line)', color: 'var(--ink)' }}>
                  <span className="flex items-center gap-2"><Icon name="flag" size={14}/> Raise Complaint</span>
                  <Icon name="chevronRight" size={13}/>
                </button>
                <button onClick={() => onNav('policies')} className="focus-ring w-full flex items-center justify-between p-2.5 rounded-xl border text-[12.5px] font-semibold"
                  style={{ background: 'var(--paper-deep)', borderColor: 'var(--line)', color: 'var(--ink)' }}>
                  <span className="flex items-center gap-2"><Icon name="info" size={14}/> Workplace Assistance</span>
                  <Icon name="chevronRight" size={13}/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


/* ============ EMPLOYEE PROFILE ============ */
/* ============ PROFILE PICTURE MENU ============ */
const ProfilePictureMenu = ({ open, onClose, avatar, onUpload, onRemove, initials }) => {
  const fileInputRef = useRef(null);

  const triggerUpload = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      onUpload(ev.target.result);
      onClose();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ background:'rgba(0,0,0,0.5)' }} onClick={onClose}>
            <motion.div initial={{opacity:0, y:20, scale:0.96}} animate={{opacity:1, y:0, scale:1}} exit={{opacity:0, y:14, scale:0.97}}
              transition={{ duration:0.22, ease:[0.22,1,0.36,1] }}
              onClick={e=>e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl p-6" style={{ background:'var(--card)', border:'1px solid var(--line)' }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display text-lg font-semibold" style={{ color:'var(--ink)' }}>Profile Picture</h3>
                <button onClick={onClose} className="focus-ring p-1.5 rounded-full" style={{color:'var(--stone)'}}><Icon name="x" size={18}/></button>
              </div>

              <div className="flex justify-center mb-6">
                <div className="w-28 h-28 rounded-3xl flex items-center justify-center overflow-hidden font-display font-semibold text-3xl shrink-0"
                  style={{ background:'var(--ink)', color:'var(--paper)' }}>
                  {avatar ? <img src={avatar} alt="Profile" className="w-full h-full object-cover"/> : initials}
                </div>
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange}/>

              <div className="flex flex-col gap-2">
                <button onClick={triggerUpload}
                  className="focus-ring w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                  style={{ background:'var(--coral)', color:'#fff' }}>
                  <Icon name="upload" size={15}/> {avatar ? 'Change Picture' : 'Upload New Picture'}
                </button>
                {avatar && (
                  <button onClick={() => { onRemove(); onClose(); }}
                    className="focus-ring w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border"
                    style={{ borderColor:'var(--line)', color:'var(--ink)', background:'var(--paper-deep)' }}>
                    <Icon name="trash" size={15}/> Remove Picture
                  </button>
                )}
                <button onClick={onClose}
                  className="focus-ring w-full py-3 rounded-xl text-sm font-semibold"
                  style={{ color:'var(--ink-soft)' }}>
                  Cancel
                </button>
              </div>
              <p className="text-[11px] text-center mt-4" style={{ color:'var(--stone)' }}>
                JPG or PNG, ideally square, up to 5MB. Stored only in this session.
              </p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* ============ EDIT PROFILE MODAL ============ */
const EditField = ({ label, icon, value, onChange, type='text' }) => (
  <div>
    <label className="text-[10.5px] uppercase tracking-wide font-semibold flex items-center gap-1.5 mb-1.5" style={{ color:'var(--stone)' }}>
      <Icon name={icon} size={12}/> {label}
    </label>
    <input type={type} value={value} onChange={e=>onChange(e.target.value)}
      className="focus-ring w-full px-3.5 py-2.5 rounded-xl text-[13.5px] border" style={{ background:'var(--paper)', borderColor:'var(--line)', color:'var(--ink)' }}/>
  </div>
);

const EditProfileModal = ({ open, onClose, draft, setDraft, onSave }) => (
  <AnimatePresence>
    {open && (
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
        className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ background:'rgba(0,0,0,0.5)' }} onClick={onClose}>
        <motion.div initial={{opacity:0, y:20, scale:0.96}} animate={{opacity:1, y:0, scale:1}} exit={{opacity:0, y:14, scale:0.97}}
          transition={{ duration:0.22, ease:[0.22,1,0.36,1] }}
          onClick={e=>e.stopPropagation()}
          className="w-full max-w-md rounded-3xl p-7 max-h-[85vh] overflow-y-auto" style={{ background:'var(--card)', border:'1px solid var(--line)' }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-lg font-semibold" style={{ color:'var(--ink)' }}>Edit Profile</h3>
            <button onClick={onClose} className="focus-ring p-1.5 rounded-full" style={{color:'var(--stone)'}}><Icon name="x" size={18}/></button>
          </div>

          {/* Personal Information */}
          <div className="mb-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color:'var(--coral)' }}>Personal Information</p>
            <div className="space-y-4">
              <EditField label="Full Name" icon="user" value={draft.name} onChange={v=>setDraft({...draft, name:v})}/>
              <EditField label="Email" icon="mail" type="email" value={draft.email} onChange={v=>setDraft({...draft, email:v})}/>
              <EditField label="Phone" icon="phone" value={draft.phone} onChange={v=>setDraft({...draft, phone:v})}/>
              <EditField label="Work Location" icon="mapPin" value={draft.location} onChange={v=>setDraft({...draft, location:v})}/>
            </div>
          </div>

          {/* Divider */}
          <div className="my-5 border-t" style={{ borderColor:'var(--line)' }}/>

          {/* Employment Information */}
          <div className="mb-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color:'var(--teal)' }}>Employment Information</p>
            <div className="space-y-4">
              <EditField label="Company" icon="briefcase" value={draft.company} onChange={v=>setDraft({...draft, company:v})}/>
              <EditField label="Department" icon="users" value={draft.department} onChange={v=>setDraft({...draft, department:v})}/>
              <EditField label="Designation" icon="userCheck" value={draft.designation} onChange={v=>setDraft({...draft, designation:v})}/>
              <EditField label="Joining Date" icon="calendar" value={draft.joiningDate} onChange={v=>setDraft({...draft, joiningDate:v})}/>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="focus-ring flex-1 py-3 rounded-xl text-sm font-semibold border" style={{ borderColor:'var(--line)', color:'var(--ink-soft)' }}>
              Cancel
            </button>
            <button onClick={onSave} className="focus-ring flex-1 py-3 rounded-xl text-sm font-semibold" style={{ background:'var(--coral)', color:'#fff' }}>
              Save Changes
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 py-2.5">
    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background:'var(--paper-deep)', color:'var(--ink)' }}>
      <Icon name={icon} size={16} strokeWidth={1.8}/>
    </div>
    <div className="min-w-0">
      <div className="text-[10.5px] uppercase tracking-wide font-semibold" style={{ color:'var(--stone)' }}>{label}</div>
      <div className="text-[13.5px] font-medium truncate" style={{ color:'var(--ink)' }}>{value}</div>
    </div>
  </div>
);

const Profile = ({ complaints, onNav, avatar, setAvatar, employee, setEmployee, onSignOut }) => {
  const total = complaints.length;
  const underReview = complaints.filter(c => c.stage===1 || c.stage===2).length;
  const resolved = complaints.filter(c => c.stage===3).length;
  const latest = complaints[0];

  const [picMenuOpen, setPicMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState(employee);

  const openEdit = () => { setDraft(employee); setEditOpen(true); };
  const saveEdit = () => { setEmployee(draft); setEditOpen(false); };

  const completionFields = [employee.name, employee.email, employee.phone, employee.location, avatar];
  const completionPct = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100);

  return (
    <section className="py-10 md:py-14">
      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <SectionHeading eyebrow="Your account" eyebrowIcon="user" title="Employee Profile"
          sub="Your details on record, at a glance — like a real employee self-service portal." />

        <div className="tab-card rounded-3xl border p-7 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-6" style={{ background:'var(--card)', borderColor:'var(--line)' }}>
          <button onClick={() => setPicMenuOpen(true)} aria-label="Change profile picture"
            className="focus-ring relative w-24 h-24 rounded-3xl flex items-center justify-center shrink-0 font-display font-semibold text-3xl overflow-hidden group"
            style={{ background:'var(--ink)', color:'var(--paper)' }}>
            {avatar ? <img src={avatar} alt="Profile" className="w-full h-full object-cover"/> : employee.initials}
            <span className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity" style={{ background:'rgba(0,0,0,0.45)' }}>
              <Icon name="camera" size={20} className="text-white"/>
            </span>
          </button>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-3 justify-center sm:justify-start flex-wrap">
              <h3 className="font-display text-2xl font-semibold" style={{ color:'var(--ink)' }}>{employee.name}</h3>
            </div>
            <p className="text-[13.5px] mt-1" style={{ color:'var(--ink-soft)' }}>{employee.designation} · {employee.department}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              <span className="font-mono text-[11.5px] px-2.5 py-1 rounded-full" style={{ background:'var(--paper-deep)', color:'var(--ink-soft)' }}>{employee.employeeId}</span>
              <span className="text-[11.5px] px-2.5 py-1 rounded-full flex items-center gap-1.5" style={{ background:'var(--teal-soft)', color:'var(--teal)' }}>
                <Icon name="mapPin" size={12}/>{employee.location}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
              <button onClick={openEdit} className="focus-ring px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5" style={{ background:'var(--ink)', color:'var(--paper)' }}>
                <Icon name="edit" size={13}/> Edit Profile
              </button>
              <button onClick={() => setPicMenuOpen(true)} className="focus-ring px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 border" style={{ borderColor:'var(--line)', color:'var(--ink)' }}>
                <Icon name="camera" size={13}/> Change Profile Picture
              </button>
              {onSignOut && (
                <button onClick={onSignOut} className="focus-ring px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 border" style={{ borderColor:'var(--coral)', color:'var(--coral)', background:'var(--paper-deep)' }}>
                  <Icon name="logOut" size={13}/> Sign Out
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div className="tab-card rounded-2xl border p-6" style={{ background:'var(--card)', borderColor:'var(--line)' }}>
            <h4 className="font-display font-semibold text-[15px] mb-1" style={{ color:'var(--ink)' }}>Profile Completion</h4>
            <p className="text-[12px] mb-4" style={{ color:'var(--ink-soft)' }}>Keep your details current so HR and grievance teams can reach you.</p>
            <div className="flex items-center gap-4">
              <div className="font-display text-2xl font-semibold shrink-0" style={{ color: completionPct===100 ? 'var(--teal)' : 'var(--coral)' }}>{completionPct}%</div>
              <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background:'var(--paper-deep)' }}>
                <motion.div initial={{width:0}} animate={{width:`${completionPct}%`}} transition={{duration:0.8, ease:[0.22,1,0.36,1]}}
                  className="h-full rounded-full" style={{ background: completionPct===100 ? 'var(--teal)' : 'var(--coral)' }}/>
              </div>
            </div>
            {completionPct < 100 && (
              <p className="text-[11.5px] mt-3" style={{ color:'var(--stone)' }}>
                {!avatar ? 'Add a profile picture to complete your profile.' : 'A few details are still missing.'}
              </p>
            )}
          </div>

          <div className="tab-card rounded-2xl border p-6" style={{ background:'var(--card)', borderColor:'var(--line)' }}>
            <h4 className="font-display font-semibold text-[15px] mb-1" style={{ color:'var(--ink)' }}>Last Login</h4>
            <div className="flex items-center gap-3 mt-3">
              <IconBadge icon="activity" color="teal" size={40}/>
              <div>
                <div className="text-[13.5px] font-medium" style={{ color:'var(--ink)' }}>{employee.lastLogin.date} · {employee.lastLogin.time}</div>
                <div className="text-[12px] mt-0.5" style={{ color:'var(--ink-soft)' }}>{employee.lastLogin.device}</div>
                <div className="text-[11px] font-mono mt-1" style={{ color:'var(--stone)' }}>IP {employee.lastLogin.ip}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <div className="tab-card rounded-2xl border p-6" style={{ background:'var(--card)', borderColor:'var(--line)' }}>
            <h4 className="font-display font-semibold text-[15px] mb-1" style={{ color:'var(--ink)' }}>Personal Information</h4>
            <div className="divide-y" style={{ borderColor:'var(--line)' }}>
              <InfoRow icon="user" label="Name" value={employee.name}/>
              <InfoRow icon="fileText" label="Employee ID" value={employee.employeeId}/>
              <InfoRow icon="mail" label="Email" value={employee.email}/>
              <InfoRow icon="phone" label="Phone" value={employee.phone}/>
            </div>
          </div>

          <div className="tab-card rounded-2xl border p-6" style={{ background:'var(--card)', borderColor:'var(--line)' }}>
            <h4 className="font-display font-semibold text-[15px] mb-1" style={{ color:'var(--ink)' }}>Employment Information</h4>
            <div className="divide-y" style={{ borderColor:'var(--line)' }}>
              <InfoRow icon="briefcase" label="Company" value={employee.company}/>
              <InfoRow icon="users" label="Department" value={employee.department}/>
              <InfoRow icon="userCheck" label="Designation" value={employee.designation}/>
              <InfoRow icon="calendar" label="Joining Date" value={employee.joiningDate}/>
              <InfoRow icon="mapPin" label="Work Location" value={employee.location}/>
            </div>
          </div>
        </div>

        <div className="tab-card rounded-2xl border p-6" style={{ background:'var(--card)', borderColor:'var(--line)' }}>
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <h4 className="font-display font-semibold text-[15px]" style={{ color:'var(--ink)' }}>Complaint Summary</h4>
            <button onClick={() => onNav('complaints')} className="focus-ring text-[12px] font-semibold flex items-center gap-1" style={{ color:'var(--coral)' }}>
              View all <Icon name="chevronRight" size={13}/>
            </button>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-5">
            <div className="rounded-xl p-4" style={{ background:'var(--paper-deep)' }}>
              <div className="font-display text-2xl font-semibold" style={{ color:'var(--ink)' }}>{total}</div>
              <div className="text-[11.5px] mt-0.5" style={{ color:'var(--ink-soft)' }}>Total Submitted</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: colorSoft('coral') }}>
              <div className="font-display text-2xl font-semibold" style={{ color:'var(--coral)' }}>{underReview}</div>
              <div className="text-[11.5px] mt-0.5" style={{ color:'var(--ink-soft)' }}>Under Review</div>
            </div>
            <div className="rounded-xl p-4" style={{ background: colorSoft('teal') }}>
              <div className="font-display text-2xl font-semibold" style={{ color:'var(--teal)' }}>{resolved}</div>
              <div className="text-[11.5px] mt-0.5" style={{ color:'var(--ink-soft)' }}>Resolved</div>
            </div>
          </div>
          {latest ? (
            <div className="flex items-center justify-between gap-3 rounded-xl p-4 flex-wrap" style={{ background:'var(--paper-deep)' }}>
              <div className="flex items-center gap-3">
                <IconBadge icon="flag" color={STAGE_COLOR(latest.stage)} size={36}/>
                <div>
                  <div className="text-[10.5px] uppercase tracking-wide font-semibold" style={{ color:'var(--stone)' }}>Latest Complaint Status</div>
                  <div className="text-[13px] font-medium" style={{ color:'var(--ink)' }}>{latest.id} · {latest.category}</div>
                </div>
              </div>
              <StatusBadge stage={latest.stage}/>
            </div>
          ) : (
            <p className="text-[13px]" style={{ color:'var(--ink-soft)' }}>No complaints filed yet.</p>
          )}
        </div>
      </div>

      <ProfilePictureMenu open={picMenuOpen} onClose={() => setPicMenuOpen(false)} avatar={avatar} initials={employee.initials}
        onUpload={(dataUrl) => setAvatar(dataUrl)} onRemove={() => setAvatar(null)}/>
      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} draft={draft} setDraft={setDraft} onSave={saveEdit}/>
    </section>
  );
};

const Footer = () => (
  <footer className="py-12" style={{ background:'var(--paper-deep)', borderTop:'1px solid var(--line)' }}>
    <div className="max-w-7xl mx-auto px-5 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:'var(--ink)' }}>
          <Icon name="compass" size={15} className="text-white" strokeWidth={2}/>
        </div>
        <span className="font-display font-semibold text-[15px]" style={{ color:'var(--ink)' }}>WorkRights Hub</span>
      </div>
      <p className="text-[12.5px] text-center md:text-right" style={{ color:'var(--stone)' }}>
        Built for clarity, not legal advice. For binding guidance, consult a labour-law professional or your local labour authority.
      </p>
    </div>
  </footer>
);

const SEED_COMPLAINTS = [];

/* ============ ROOT APP ============ */
const PAGES = {
  home: Hero,
  profile: Profile,
  finder: RightsFinder,
  laws: LawExplorer,
  policies: PoliciesCenter,
  complaints: ComplaintTracker,
  dashboard: Dashboard,
};

function App() {
  const [dark, setDark] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [complaints, setComplaints] = useState(SEED_COMPLAINTS);
  const [stats, setStats] = useState({ rightsViewed: new Set(), scenariosViewed: new Set() });
  const [highlight, setHighlight] = useState(null); // { type, refId, nonce }
  const [avatar, setAvatar] = useState(null);
  const [employee, setEmployee] = useState(EMPLOYEE);
  const [laws, setLaws] = useState(LAWS);
  const [policies, setPolicies] = useState(POLICIES);

  // Supabase states
  const [configured, setConfigured] = useState(!!(window.ENV.SUPABASE_URL && window.ENV.SUPABASE_ANON_KEY));
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  // Auth State Listener
  useEffect(() => {
    if (!configured) {
      setLoadingSession(false);
      return;
    }

    if (!supabaseClient && window.ENV.SUPABASE_URL && window.ENV.SUPABASE_ANON_KEY) {
      try {
        supabaseClient = supabase.createClient(window.ENV.SUPABASE_URL, window.ENV.SUPABASE_ANON_KEY);
      } catch (err) {
        console.error(err);
      }
    }

    if (!supabaseClient) {
      setLoadingSession(false);
      return;
    }

    // Check session
    supabaseClient.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setLoadingSession(false);
    });

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setLoadingSession(false);
    });

    return () => subscription.unsubscribe();
  }, [configured]);

  // Data Loader from DB
  useEffect(() => {
    if (!session || !supabaseClient) return;

    const loadData = async () => {
      setLoadingData(true);
      try {
        // Fetch profile
        const { data: profile, error: pErr } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (pErr && pErr.code !== 'PGRST116') throw pErr; // PGRST116 = row not found (new user)
        setEmployee({
          name: profile?.name || '',
          employeeId: profile?.employee_id || '',
          company: profile?.company || '',
          department: profile?.department || '',
          designation: profile?.designation || '',
          joiningDate: profile?.joining_date || '',
          email: profile?.email || session.user.email || '',
          phone: profile?.phone || '',
          location: profile?.location || '',
          initials: (profile?.name || '').split(' ').filter(Boolean).map(x=>x[0]).join('').toUpperCase().slice(0, 2) || (session.user.email || '??')[0].toUpperCase(),
          lastLogin: {
            date: new Date(session.user.last_sign_in_at || Date.now()).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }),
            time: new Date(session.user.last_sign_in_at || Date.now()).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }),
            device: 'Web Browser',
            ip: 'Active Session'
          }
        });
        setAvatar(profile?.avatar_url || null);

        // Fetch complaints — always replace with real data (even if empty)
        const { data: dbComplaints, error: cErr } = await supabaseClient
          .from('complaints')
          .select('*')
          .order('created_at', { ascending: false });

        if (cErr) throw cErr;
        setComplaints(dbComplaints || []);

        // Fetch notifications — always replace with real data
        const { data: dbNotifs, error: nErr } = await supabaseClient
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (nErr) throw nErr;
        setNotifications(dbNotifs || []);

        // Fetch laws
        const { data: dbLaws, error: lErr } = await supabaseClient
          .from('laws')
          .select('*');

        if (lErr) throw lErr;
        if (dbLaws && dbLaws.length > 0) setLaws(dbLaws);

        // Fetch policies
        const { data: dbPolicies, error: polErr } = await supabaseClient
          .from('policies')
          .select('*');

        if (polErr) throw polErr;
        if (dbPolicies && dbPolicies.length > 0) setPolicies(dbPolicies);

      } catch (err) {
        console.error('Error loading data from Supabase:', err);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [session]);

  const onNav = useCallback((id) => {
    setActivePage(id);
    setMobileOpen(false);
    setNotifOpen(false);
    window.scrollTo(0, 0);
  }, []);

  const onMarkAllRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread:false })));
    if (session && supabaseClient) {
      try {
        await supabaseClient
          .from('notifications')
          .update({ unread: false })
          .eq('user_id', session.user.id);
      } catch (err) {
        console.error(err);
      }
    }
  }, [session]);

  const onNotificationClick = useCallback(async (n) => {
    setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, unread:false } : x));
    setNotifOpen(false);
    setMobileOpen(false);
    if (n.target) {
      setActivePage(n.target.page);
      setHighlight({ type: n.target.type, refId: n.target.refId, nonce: Date.now() });
    }
    window.scrollTo(0, 0);

    if (session && supabaseClient) {
      try {
        await supabaseClient
          .from('notifications')
          .update({ unread: false })
          .eq('id', n.id);
      } catch (err) {
        console.error(err);
      }
    }
  }, [session]);

  const clearHighlight = useCallback(() => setHighlight(null), []);

  const logRightView = useCallback((id) => {
    setStats(s => ({ ...s, rightsViewed: new Set([...s.rightsViewed, id]) }));
  }, []);
  const logScenarioView = useCallback((id) => {
    setStats(s => ({ ...s, scenariosViewed: new Set([...s.scenariosViewed, id]) }));
  }, []);

  const addNotificationHelper = async ({ title, body, icon, color, page, type, refId }) => {
    const id = 'n-' + Math.floor(10000 + Math.random()*89999);
    const newNotif = {
      id,
      icon,
      color,
      title,
      body,
      time: 'Just now',
      unread: true,
      target: { page, type, refId }
    };

    setNotifications(prev => [newNotif, ...prev]);

    if (session && supabaseClient) {
      try {
        await supabaseClient
          .from('notifications')
          .insert({
            id,
            user_id: session.user.id,
            icon,
            color,
            title,
            body,
            time: 'Just now',
            unread: true,
            target: { page, type, refId }
          });
      } catch (err) {
        console.warn("Could not insert notification in DB", err);
      }
    }
  };

  const submitComplaint = useCallback(async (c) => {
    if (!session || !supabaseClient) {
      // optimistic mock fallback
      setComplaints(prev => [c, ...prev]);
      return;
    }

    setLoadingData(true);
    try {
      const { error: insErr } = await supabaseClient
        .from('complaints')
        .insert({
          id: c.id,
          user_id: session.user.id,
          category: c.category,
          desc: c.desc,
          stage: c.stage,
          date: c.date,
          hr: c.hr,
          resolution_date: c.resolutionDate,
          last_updated: c.lastUpdated
        });

      if (insErr) throw insErr;

      setComplaints(prev => [c, ...prev]);
      await addNotificationHelper({
        title: 'Complaint submitted',
        body: `${c.id} has been logged and assigned to ${c.hr}.`,
        icon: 'flag',
        color: 'ink',
        page: 'complaints',
        type: 'complaint',
        refId: c.id
      });

      // simulate stage updates — realistic delays: 2 min → Under Review, 5 min → Investigation, 10 min → Resolved
      const STAGE_DELAYS = { 1: 2 * 60 * 1000, 2: 5 * 60 * 1000, 3: 10 * 60 * 1000 };
      [1,2,3].forEach(stage => {
        setTimeout(async () => {
          const now = new Date().toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
          try {
            await supabaseClient
              .from('complaints')
              .update({
                stage,
                last_updated: now,
                resolution_date: stage === 3 ? now : null
              })
              .eq('id', c.id);

            setComplaints(prev => prev.map(x => x.id === c.id ? {
              ...x, stage, lastUpdated: now,
              resolutionDate: stage === 3 ? now : x.resolutionDate,
            } : x));

            await addNotificationHelper({
              title: 'Complaint status updated',
              body: `${c.id} moved to "${STAGES[stage]}".`,
              icon: 'flag',
              color: stage === 3 ? 'teal' : 'coral',
              page: 'complaints',
              type: 'complaint',
              refId: c.id
            });
          } catch (e) {
            console.warn(e);
          }
        }, STAGE_DELAYS[stage]);
      });

    } catch (err) {
      console.error(err);
      alert("Failed to submit complaint: " + err.message);
    } finally {
      setLoadingData(false);
    }
  }, [session]);

  const updateProfile = async (updatedData) => {
    if (!session || !supabaseClient) {
      setEmployee(prev => ({ ...prev, ...updatedData }));
      return;
    }
    setLoadingData(true);
    try {
      const { error } = await supabaseClient
        .from('profiles')
        .update({
          name: updatedData.name,
          email: updatedData.email,
          phone: updatedData.phone,
          location: updatedData.location,
          company: updatedData.company,
          department: updatedData.department,
          designation: updatedData.designation,
          joining_date: updatedData.joiningDate,
          updated_at: new Date()
        })
        .eq('id', session.user.id);

      if (error) throw error;
      setEmployee(prev => ({
        ...prev,
        ...updatedData,
        initials: (updatedData.name || '').split(' ').map(x=>x[0]).join('').toUpperCase().slice(0, 2)
      }));

      await addNotificationHelper({
        title: 'Profile Updated',
        body: 'Your profile changes have been successfully saved.',
        icon: 'userCheck',
        color: 'teal',
        page: 'profile',
        type: 'profile'
      });
    } catch (err) {
      console.error(err);
      alert("Failed to update profile: " + err.message);
    } finally {
      setLoadingData(false);
    }
  };

  const updateAvatar = async (base64Data) => {
    if (!session || !supabaseClient) {
      setAvatar(base64Data);
      return;
    }
    setLoadingData(true);
    try {
      const { error } = await supabaseClient
        .from('profiles')
        .update({
          avatar_url: base64Data,
          updated_at: new Date()
        })
        .eq('id', session.user.id);

      if (error) throw error;
      setAvatar(base64Data);
      await addNotificationHelper({
        title: 'Profile Picture Updated',
        body: 'Your profile picture has been successfully uploaded.',
        icon: 'camera',
        color: 'teal',
        page: 'profile',
        type: 'profile'
      });
    } catch (err) {
      console.error(err);
      alert("Failed to update profile picture: " + err.message);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSignOut = async () => {
    if (supabaseClient) {
      try {
        await supabaseClient.auth.signOut();
      } catch (err) {
        console.error(err);
      }
    }
    setSession(null);
    setActivePage('home');
  };

  if (!configured) {
    return <SupabaseSetup onConfigured={() => setConfigured(true)} />;
  }

  if (loadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--paper)]">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-[var(--coral)] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono mt-4" style={{ color:'var(--stone)' }}>Checking Session...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen onAuthSuccess={(s) => setSession(s)} />;
  }

  const PageComponent = PAGES[activePage] || Hero;
  const pageProps = {
    home: { onNav },
    profile: { complaints, onNav, avatar, setAvatar: updateAvatar, employee, setEmployee: updateProfile, onSignOut: handleSignOut },
    finder: { onLog: logScenarioView, onNav },
    laws: { onView: logRightView, highlight, clearHighlight, laws },
    policies: { highlight, clearHighlight, policies },
    complaints: { complaints, onSubmit: submitComplaint, highlight, clearHighlight },
    dashboard: { stats, complaints, onNav, employee, notifications, setHighlight, onNotificationClick },
  }[activePage] || {};

  return (
    <div className="relative">
      {loadingData && (
        <div className="fixed top-0 left-0 right-0 h-1 z-[100] overflow-hidden" style={{ background: 'var(--line)' }}>
          <div className="h-full bg-[var(--coral)] animate-pulse w-full"></div>
        </div>
      )}
      <Sidebar active={activePage} onNav={onNav} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}/>
      <Topbar dark={dark} setDark={setDark} active={activePage} setMobileOpen={setMobileOpen}
        notifications={notifications} notifOpen={notifOpen} setNotifOpen={setNotifOpen} onMarkAllRead={onMarkAllRead}
        onNav={onNav} onNotificationClick={onNotificationClick} avatar={avatar} employee={employee}/>

      <main className="lg:pl-[232px] pt-16 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div key={activePage} initial={{opacity:0, y:8}} animate={{opacity:1, y:0}} exit={{opacity:0}} transition={{duration:0.25}}>
            <PageComponent {...pageProps}/>
          </motion.div>
        </AnimatePresence>
        <Footer/>
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
