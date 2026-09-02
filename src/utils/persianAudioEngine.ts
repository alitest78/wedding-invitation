/**
 * Web Audio API Persian Festive Music Synthesizer
 * Provides 100% reliable, zero-dependency, offline-capable playback of Persian wedding melodies
 * (including Jingo Jing Shirazi, Mobarak Baad, and Persian Classical Tar/Santur harmonies).
 */

class PersianAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private timerId: number | null = null;
  private currentStep: number = 0;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private trackType: 'shirazi' | 'mobarakbad' | 'santur' | 'golesangam' | 'waltz' = 'shirazi';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      const safeVol = this.isMuted ? 0 : Math.max(0, Math.min(1, vol)) * 0.35;
      this.masterGain.gain.setTargetAtTime(safeVol, this.ctx.currentTime, 0.05);
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    this.setVolume(muted ? 0 : 0.85);
  }

  public setTrackType(type: 'shirazi' | 'mobarakbad' | 'santur' | 'golesangam' | 'waltz') {
    this.trackType = type;
  }

  // Play a synthesized pluck sound (Santur / Tar like timbre)
  private playPluck(freq: number, time: number, duration: number = 0.4, velocity: number = 0.5) {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    try {
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Plucked string harmonic spectrum
      osc.type = 'triangle';
      osc2.type = 'sine';

      osc.frequency.setValueAtTime(freq, time);
      // Slight chorus detune for traditional Santur double-string effect
      osc2.frequency.setValueAtTime(freq * 1.002, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 4, time);
      filter.frequency.exponentialRampToValueAtTime(freq * 0.8, time + duration);

      // Exponential decay envelope for string pluck
      gain.gain.setValueAtTime(velocity * 0.6, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc2.start(time);
      osc.stop(time + duration);
      osc2.stop(time + duration);
    } catch {
      // Ignore transient audio context errors
    }
  }

  // Play percussion (Daf / Tonbak bass or rim slap)
  private playPercussion(isBass: boolean, time: number) {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (isBass) {
        // Warm Tonbak "Tom" sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(130, time);
        osc.frequency.exponentialRampToValueAtTime(45, time + 0.22);
        gain.gain.setValueAtTime(0.5, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);
      } else {
        // Daf / Tonbak "Bak" slap
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, time);
        osc.frequency.exponentialRampToValueAtTime(80, time + 0.08);
        gain.gain.setValueAtTime(0.25, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
      }

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + (isBass ? 0.25 : 0.1));
    } catch {
      // Ignore
    }
  }

  public start(trackName?: string) {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.currentStep = 0;

    const lower = (trackName || '').toLowerCase();
    if (lower.includes('mobarak') || lower.includes('مبارک')) {
      this.trackType = 'mobarakbad';
    } else if (lower.includes('golesangam') || lower.includes('گل سنگم') || lower.includes('سنگم')) {
      this.trackType = 'golesangam';
    } else if (lower.includes('waltz') || lower.includes('والس') || lower.includes('پیانو') || lower.includes('کلاسیک')) {
      this.trackType = 'waltz';
    } else if (lower.includes('سه‌تار') || lower.includes('تار') || lower.includes('santur') || lower.includes('سنتور')) {
      this.trackType = 'santur';
    } else {
      this.trackType = 'shirazi';
    }

    // Frequencies for Persian traditional scales (Mahur & Shur)
    // C4=261.63, D4=293.66, E4=329.63, F4=349.23, G4=392.00, A4=440.00, B4=493.88, C5=523.25, D5=587.33, E5=659.25
    const NOTES: Record<string, number> = {
      C4: 261.63,
      D4: 293.66,
      Ds4: 311.13,
      E4: 329.63,
      F4: 349.23,
      Fs4: 370.0,
      G4: 392.00,
      Gs4: 415.30,
      A4: 440.00,
      As4: 466.16,
      B4: 493.88,
      C5: 523.25,
      D5: 587.33,
      Ds5: 622.25,
      E5: 659.25,
      F5: 698.46,
      G5: 783.99,
      REST: 0,
    };

    // Melody 1: Jingo Jing Shirazi festive 6/8 rhythm pattern
    const shiraziMelody: Array<{ note: string; dur: number; bass?: boolean; slap?: boolean }> = [
      { note: 'D5', dur: 0.22, bass: true },
      { note: 'D5', dur: 0.18 },
      { note: 'B4', dur: 0.18, slap: true },
      { note: 'C5', dur: 0.22 },
      { note: 'D5', dur: 0.35, bass: true },
      { note: 'REST', dur: 0.15 },
      { note: 'D5', dur: 0.2, bass: true },
      { note: 'E5', dur: 0.2, slap: true },
      { note: 'D5', dur: 0.2 },
      { note: 'C5', dur: 0.2, bass: true },
      { note: 'B4', dur: 0.2 },
      { note: 'A4', dur: 0.35, slap: true },
      { note: 'G4', dur: 0.45, bass: true },
      { note: 'G4', dur: 0.2, bass: true },
      { note: 'B4', dur: 0.2, slap: true },
      { note: 'D5', dur: 0.25 },
      { note: 'C5', dur: 0.2, bass: true },
      { note: 'B4', dur: 0.2, slap: true },
      { note: 'A4', dur: 0.35 },
      { note: 'G4', dur: 0.5, bass: true },
    ];

    // Melody 2: Mobarak Baad traditional wedding anthem (کوچه تنگه بله، عروس قشنگه بله)
    const mobarakMelody: Array<{ note: string; dur: number; bass?: boolean; slap?: boolean }> = [
      { note: 'G4', dur: 0.25, bass: true },
      { note: 'C5', dur: 0.25, slap: true },
      { note: 'C5', dur: 0.25 },
      { note: 'C5', dur: 0.25, bass: true },
      { note: 'B4', dur: 0.25, slap: true },
      { note: 'C5', dur: 0.25 },
      { note: 'D5', dur: 0.45, bass: true },
      { note: 'C5', dur: 0.25, slap: true },
      { note: 'B4', dur: 0.25 },
      { note: 'A4', dur: 0.45, bass: true },
      { note: 'G4', dur: 0.45, slap: true },
      { note: 'A4', dur: 0.25, bass: true },
      { note: 'B4', dur: 0.25 },
      { note: 'C5', dur: 0.45, slap: true },
      { note: 'G4', dur: 0.5, bass: true },
    ];

    // Melody 3: Santur / Tar melodic flow
    const santurMelody: Array<{ note: string; dur: number; bass?: boolean; slap?: boolean }> = [
      { note: 'D4', dur: 0.3, bass: true },
      { note: 'G4', dur: 0.3 },
      { note: 'A4', dur: 0.3, slap: true },
      { note: 'B4', dur: 0.3 },
      { note: 'D5', dur: 0.4, bass: true },
      { note: 'C5', dur: 0.3 },
      { note: 'B4', dur: 0.3, slap: true },
      { note: 'A4', dur: 0.4 },
      { note: 'B4', dur: 0.3, bass: true },
      { note: 'G4', dur: 0.5 },
    ];

    // Melody 4: Gole Sangam (گل سنگم عاشقانه و آرامش‌بخش)
    const golesangamMelody: Array<{ note: string; dur: number; bass?: boolean; slap?: boolean }> = [
      { note: 'C5', dur: 0.4, bass: true },
      { note: 'D5', dur: 0.3 },
      { note: 'Ds5', dur: 0.5, slap: true },
      { note: 'D5', dur: 0.3 },
      { note: 'C5', dur: 0.3, bass: true },
      { note: 'As4', dur: 0.4 },
      { note: 'Gs4', dur: 0.4, slap: true },
      { note: 'G4', dur: 0.6, bass: true },
      { note: 'G4', dur: 0.3 },
      { note: 'Gs4', dur: 0.3, slap: true },
      { note: 'As4', dur: 0.4 },
      { note: 'C5', dur: 0.5, bass: true },
    ];

    // Melody 5: Romantic Wedding Waltz (والس عاشقانه پیانو و ارکستر)
    const waltzMelody: Array<{ note: string; dur: number; bass?: boolean; slap?: boolean }> = [
      { note: 'E4', dur: 0.3, bass: true },
      { note: 'G4', dur: 0.25 },
      { note: 'C5', dur: 0.3, slap: true },
      { note: 'B4', dur: 0.25 },
      { note: 'A4', dur: 0.3, bass: true },
      { note: 'G4', dur: 0.25 },
      { note: 'E5', dur: 0.45, slap: true },
      { note: 'D5', dur: 0.3, bass: true },
      { note: 'C5', dur: 0.3 },
      { note: 'B4', dur: 0.3, slap: true },
      { note: 'C5', dur: 0.5, bass: true },
    ];

    const stepInterval = this.trackType === 'golesangam' ? 260 : this.trackType === 'waltz' ? 240 : 210;

    const runLoop = () => {
      if (!this.isPlaying || !this.ctx) return;

      const melody =
        this.trackType === 'mobarakbad'
          ? mobarakMelody
          : this.trackType === 'golesangam'
          ? golesangamMelody
          : this.trackType === 'waltz'
          ? waltzMelody
          : this.trackType === 'santur'
          ? santurMelody
          : shiraziMelody;

      const item = melody[this.currentStep % melody.length];
      const now = this.ctx.currentTime;

      if (item.note && item.note !== 'REST' && NOTES[item.note]) {
        this.playPluck(NOTES[item.note], now, item.dur * 1.5, 0.45);
      }

      if (item.bass) {
        this.playPercussion(true, now);
      }
      if (item.slap) {
        this.playPercussion(false, now + 0.08);
      }

      this.currentStep++;
      this.timerId = window.setTimeout(runLoop, stepInterval);
    };

    runLoop();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const persianAudioEngine = new PersianAudioEngine();
