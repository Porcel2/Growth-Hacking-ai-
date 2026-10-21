/**
 * Audio Service for Supermaan
 * Decodes and plays 24kHz studio WAV audio with Web Audio AnalyserNode support
 */

class AudioService {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private onEndCallbacks: Set<() => void> = new Set();

  public getAudioContext(): AudioContext {
    if (!this.ctx || this.ctx.state === "closed") {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx({ sampleRate: 24000 });
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public getAnalyser(): AnalyserNode {
    const ctx = this.getAudioContext();
    if (!this.analyser) {
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
      this.analyser.connect(ctx.destination);
    }
    return this.analyser;
  }

  public connectStream(stream: MediaStream): MediaStreamAudioSourceNode {
    const ctx = this.getAudioContext();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = this.getAnalyser();
    source.connect(analyser);
    return source;
  }

  public async playBase64Wav(base64Data: string, onEnded?: () => void): Promise<void> {
    this.stop();

    try {
      const ctx = this.getAudioContext();
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      // Convert base64 to ArrayBuffer
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Decode audio data
      const audioBuffer = await ctx.decodeAudioData(bytes.buffer.slice(0));
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;

      const analyser = this.getAnalyser();
      source.connect(analyser);

      this.currentSource = source;
      this.isPlaying = true;

      source.onended = () => {
        this.isPlaying = false;
        this.currentSource = null;
        if (onEnded) onEnded();
        this.onEndCallbacks.forEach((cb) => cb());
      };

      source.start(0);
    } catch (err) {
      console.warn("Web Audio decode failed, falling back to HTMLAudioElement:", err);
      // Fallback
      const audio = new Audio(`data:audio/wav;base64,${base64Data}`);
      this.audioElement = audio;
      this.isPlaying = true;

      audio.onended = () => {
        this.isPlaying = false;
        this.audioElement = null;
        if (onEnded) onEnded();
        this.onEndCallbacks.forEach((cb) => cb());
      };

      await audio.play();
    }
  }

  public stop(): void {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
        this.currentSource.disconnect();
      } catch {}
      this.currentSource = null;
    }
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch {}
      this.audioElement = null;
    }
    this.isPlaying = false;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getFrequencyData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(64);
    }
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }
}

export const audioService = new AudioService();
