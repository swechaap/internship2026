// Web Audio API Synthesizer for Game Sound Effects

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(err => console.log('Audio Context resume failed:', err));
    }
  }

  setMuted(state) {
    this.muted = state;
  }

  playClick() {
    if (this.muted) return;
    try {
      this.init();
      const ctx = this.ctx;
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
      console.warn('Audio failed:', e);
    }
  }

  playCorrect() {
    if (this.muted) return;
    try {
      this.init();
      const ctx = this.ctx;
      if (!ctx) return;
      const now = ctx.currentTime;

      const playTone = (freq, time, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.005, time + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + duration);
      };

      // Ascending C5 -> E5 -> G5 -> C6 arpeggio
      playTone(523.25, now, 0.12);
      playTone(659.25, now + 0.08, 0.12);
      playTone(783.99, now + 0.16, 0.12);
      playTone(1046.50, now + 0.24, 0.3);
    } catch (e) {
      console.warn('Audio failed:', e);
    }
  }

  playWrong() {
    if (this.muted) return;
    try {
      this.init();
      const ctx = this.ctx;
      if (!ctx) return;
      const now = ctx.currentTime;

      // Deep descending buzz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(70, now + 0.25);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn('Audio failed:', e);
    }
  }

  playUnlock() {
    if (this.muted) return;
    try {
      this.init();
      const ctx = this.ctx;
      if (!ctx) return;
      const now = ctx.currentTime;

      const playSparkle = (freq, time) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.08, time);
        gain.gain.exponentialRampToValueAtTime(0.005, time + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.18);
      };

      // Shimmer sweep arpeggio
      const notes = [659.25, 783.99, 987.77, 1046.50, 1318.51, 1567.98];
      notes.forEach((freq, idx) => {
        playSparkle(freq, now + idx * 0.04);
      });
    } catch (e) {
      console.warn('Audio failed:', e);
    }
  }

  playComplete() {
    if (this.muted) return;
    try {
      this.init();
      const ctx = this.ctx;
      if (!ctx) return;
      const now = ctx.currentTime;

      const playTone = (freq, time, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.005, time + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + duration);
      };

      // Cheerful victory melody
      playTone(523.25, now, 0.12);
      playTone(659.25, now + 0.12, 0.12);
      playTone(783.99, now + 0.24, 0.12);
      playTone(659.25, now + 0.36, 0.12);
      playTone(783.99, now + 0.48, 0.12);
      playTone(1046.50, now + 0.60, 0.4);
    } catch (e) {
      console.warn('Audio failed:', e);
    }
  }
}

export const audio = new SoundEngine();
export default audio;
