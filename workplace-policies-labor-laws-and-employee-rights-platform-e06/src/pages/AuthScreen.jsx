import React, { useState } from 'react';
import { supabaseClient } from '../lib/supabaseClient';
import Icon from '../components/Icon';

export const AuthScreen = ({ onAuthSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
    if (!validateForm() || !supabaseClient) return;
    setLoading(true);
    try {
      if (isSignUp) {
        const { data: signUpData, error: err } = await supabaseClient.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: { data: { name: name.trim() } },
        });
        if (err) throw err;
        if (signUpData?.session) {
          onAuthSuccess(signUpData.session);
          return;
        }
        const { data: siData, error: siErr } = await supabaseClient.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });
        if (!siErr && siData?.session) {
          onAuthSuccess(siData.session);
          return;
        }
        setMsg('Account created! Check your inbox for a confirmation link, then sign in.');
        setIsSignUp(false);
      } else {
        const { data, error: err } = await supabaseClient.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });
        if (err) {
          if (err.message.toLowerCase().includes('email not confirmed')) {
            setError('Email not confirmed. Please check your inbox.');
          } else {
            throw err;
          }
          return;
        }
        if (data.session) {
          onAuthSuccess(data.session);
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative flex flex-col justify-between p-6 md:p-12 overflow-hidden animate-fade-in"
      style={{ background: 'radial-gradient(circle at center, #13172e 0%, #070814 100%)' }}
    >
      {/* Background Glowing Blobs */}
      <div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[120px] opacity-20 animate-pulse-slow"
        style={{ background: 'var(--coral)' }}
      />
      <div
        className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-[120px] opacity-20 animate-pulse-slow-reverse"
        style={{ background: 'var(--teal)' }}
      />

      {/* Top Left Logo */}
      <div className="flex items-center gap-2.5 self-start mb-8 select-none relative z-10">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--coral)' }}>
          <Icon name="compass" size={17} className="text-white" strokeWidth={2.5} />
        </div>
        <span className="font-display font-semibold text-[17px] text-white tracking-wide">
          WorkRights<span style={{ color: 'var(--coral)' }}>Hub</span>
        </span>
      </div>

      {/* Main Glass Card */}
      <div
        className="w-full max-w-[430px] mx-auto rounded-[28px] p-8 md:p-10 self-center relative z-10"
        style={{
          background: 'rgba(21, 23, 40, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(16px)',
        }}
      >
        {/* Welcome Header */}
        <div className="text-center mb-6">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white leading-tight">
            Welcome to WorkRights Hub
          </h2>
          <p className="text-[12px] mt-2 opacity-60 leading-relaxed text-white max-w-[340px] mx-auto">
            {isSignUp
              ? 'Create your account to track grievances and discover labor rights.'
              : 'Log in to access labor rights, company policies, or employee dashboard.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="text-[9.5px] font-bold uppercase tracking-wider block mb-1.5 opacity-55 text-white">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setNameError('');
                }}
                placeholder="e.g. Priya Sharma"
                required
                className="auth-input w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none"
                style={{
                  borderColor: nameError ? 'var(--coral)' : 'rgba(255, 255, 255, 0.08)',
                }}
              />
              {nameError && (
                <p className="text-[11px] font-semibold mt-1.5" style={{ color: 'var(--coral)' }}>
                  {nameError}
                </p>
              )}
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="text-[9.5px] font-bold uppercase tracking-wider block mb-1.5 opacity-55 text-white">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
              }}
              placeholder="e.g. ravi@example.com"
              required
              className="auth-input w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none"
              style={{
                borderColor: emailError ? 'var(--coral)' : 'rgba(255, 255, 255, 0.08)',
              }}
            />
            {emailError && (
              <p className="text-[11px] font-semibold mt-1.5" style={{ color: 'var(--coral)' }}>
                {emailError}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[9.5px] font-bold uppercase tracking-wider block opacity-55 text-white">
                Password
              </label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => alert('Password reset link will be sent if configured in Supabase Console.')}
                  className="text-[9px] font-bold tracking-wide uppercase hover:underline hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--coral)', opacity: 0.8 }}
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                placeholder="Enter password"
                required
                className="auth-input w-full pl-4 pr-10 py-3 rounded-xl text-sm transition-all duration-200 outline-none"
                style={{
                  borderColor: passwordError ? 'var(--coral)' : 'rgba(255, 255, 255, 0.08)',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white opacity-40 hover:opacity-85 transition-opacity focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <Icon name={showPassword ? 'eyeOff' : 'eye'} size={16} />
              </button>
            </div>
            {passwordError && (
              <p className="text-[11px] font-semibold mt-1.5" style={{ color: 'var(--coral)' }}>
                {passwordError}
              </p>
            )}
          </div>

          {error && <p className="text-xs font-semibold text-center mt-3" style={{ color: 'var(--coral)' }}>{error}</p>}
          {msg && <p className="text-xs font-semibold text-center mt-3" style={{ color: 'var(--teal)' }}>{msg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="primary-btn w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mt-5 disabled:opacity-50 outline-none"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isSignUp ? 'Register' : 'Sign In'}
                <Icon name="arrowRight" size={15} />
              </>
            )}
          </button>
        </form>

        {/* Auth Mode Toggle Link */}
        <div className="mt-6 text-center text-xs text-white opacity-60">
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setMsg('');
            }}
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
        <button
          onClick={() => {
            window.localStorage.removeItem('SB_URL');
            window.localStorage.removeItem('SB_KEY');
            window.location.reload();
          }}
          className="underline font-semibold hover:opacity-100 transition-opacity"
          style={{ color: 'var(--coral)' }}
        >
          Disconnect Supabase
        </button>
      </div>
    </div>
  );
};

export default AuthScreen;
