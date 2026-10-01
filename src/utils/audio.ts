// Web Audio API based luxury synthesizer & Haptics

class AudioManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Subtle luxury click
  playClick() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);

      if ('vibrate' in navigator) {
        navigator.vibrate(8);
      }
    } catch {
      // AudioContext policy fallback
    }
  }

  // Mechanical sphere spin sound
  playSpin(duration = 2.0) {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Filtered noise for air blower
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.linearRampToValueAtTime(700, now + duration * 0.5);
      filter.frequency.exponentialRampToValueAtTime(250, now + duration);
      filter.Q.value = 3.0;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + duration);
    } catch {
      // ignore
    }
  }

  // Crisp golden ball drop chime
  playBallDrop(pitchMultiplier = 1) {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const baseFreq = 523.25 * pitchMultiplier; // C5 harmonic
      const freqs = [baseFreq, baseFreq * 1.5, baseFreq * 2.0];

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        const initialVol = idx === 0 ? 0.25 : 0.08;
        gain.gain.setValueAtTime(initialVol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.35);
      });

      if ('vibrate' in navigator) {
        navigator.vibrate([15, 20, 30]);
      }
    } catch {
      // ignore
    }
  }

  // Grand VIP jackpot fanfare
  playJackpot() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6

      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime + i * 0.09;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.6);
      });

      if ('vibrate' in navigator) {
        navigator.vibrate([40, 60, 40, 60, 100]);
      }
    } catch {
      // ignore
    }
  }
}

export const soundEngine = new AudioManager();
