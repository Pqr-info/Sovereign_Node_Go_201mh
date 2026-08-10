// core/midi_valkey_bridge.ts
interface LPV5DEvent {
  agentId: string;
  midiBuffer: Uint8Array; // 3-byte binary payload
}

export class MidiValkeyBridge {
  private audioCtx: AudioContext | null = null;

  constructor() {
    // Optionally initialize WebAudio API if running inside a browser sandbox
    if (typeof window !== 'undefined') {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  /**
   * Listens to the incoming Valkey network brain-stream and routes to engine outputs
   */
  public handleValkeyStream(event: LPV5DEvent, onRenderUpdate: (x: number, y: number, z: number, colorHex: string, intensity: number) => void) {
    const [status, data1, data2] = event.midiBuffer;
    
    // 1. Route to WebGL Canvas Render Pipeline
    this.dispatchToCanvas(status, data1, data2, onRenderUpdate);

    // 2. Route to WebAudio Synthesizer for auditory tracking
    if (this.audioCtx) {
      this.sonifyStateMutation(status, data1, data2);
    }
  }

  private dispatchToCanvas(status: number, data1: number, data2: number, callback: Function) {
    const cmd = status & 0xF0;
    if (cmd === 0x90) { // Note ON Event
      // Decode coordinates matching the Go Engine formula
      const x = (data1 % 7) * 7;
      const y = Math.floor((data1 / 7) % 7) * 7;
      const z = Math.floor(data1 / 49) * 24;

      let colorHex = "#00FF66"; // Default Green (Superposition)
      let intensity = 0;

      if (data2 <= 42) {
        colorHex = "#3366FF"; // Blue (Repulsion)
        intensity = (42 - data2) / 42;
      } else if (data2 >= 85) {
        colorHex = "#FF3333"; // Red (Attraction)
        intensity = (data2 - 85) / 42;
      }

      callback(x, y, z, colorHex, intensity);
    }
  }

  private sonifyStateMutation(status: number, data1: number, data2: number) {
    if (!this.audioCtx) return;
    const cmd = status & 0xF0;

    if (cmd === 0x90 && data2 >= 85) { // Active Attraction Node
      const osc = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      // Convert the spatial pitch directly to an acoustic frequency Hertz value
      const freq = 440 * Math.pow(2, (data1 - 69) / 12);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      // Map velocity directly to sound envelope decay volume
      const initialVolume = (data2 - 85) / 42 * 0.1;
      gainNode.gain.setValueAtTime(initialVolume, this.audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.15);

      osc.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);
      
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.16);
    }
  }
}

export function updateShaderUniforms(
  gl: WebGL2RenderingContext, 
  program: WebGLProgram, 
  globalPhi: number, 
  time: number
) {
  const uTimeLoc = gl.getUniformLocation(program, "u_time");
  const uDriftLoc = gl.getUniformLocation(program, "u_global_drift_alpha");
  const uResLoc = gl.getUniformLocation(program, "u_resolution");

  gl.uniform1f(uTimeLoc, time);
  gl.uniform1f(uDriftLoc, Math.abs(globalPhi));
  gl.uniform2f(uResLoc, gl.canvas.width, gl.canvas.height);
}
