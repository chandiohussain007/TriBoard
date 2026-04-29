export const playSound = (type: "move" | "capture" | "win" | "lose") => {
  try {
    const ctx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    if (type === "move") {
      // Piece thud (Low frequency wood impact)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.1);
      
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.1);

      // Higher click (Wood on wood friction)
      const clickOsc = ctx.createOscillator();
      const clickGain = ctx.createGain();
      clickOsc.connect(clickGain);
      clickGain.connect(ctx.destination);
      clickOsc.type = "triangle";
      clickOsc.frequency.setValueAtTime(800, ctx.currentTime);
      clickGain.gain.setValueAtTime(0.1, ctx.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.02);
      clickOsc.start();
      clickOsc.stop(ctx.currentTime + 0.02);

    } else if (type === "capture") {
      // Heavier impact with rattle
      [120, 80].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "square";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.02);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.02 + 0.15);
        osc.start(ctx.currentTime + i * 0.02);
        osc.stop(ctx.currentTime + i * 0.02 + 0.15);
      });
    } else if (type === "win") {
      // Harmonic chime
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.05);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + i * 0.05 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.05 + 1.0);
        osc.start(ctx.currentTime + i * 0.05);
        osc.stop(ctx.currentTime + i * 0.05 + 1.0);
      });
    } else if (type === "lose") {
      // Dissonant drop
      [200, 150, 120].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.1);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + i * 0.1 + 0.4);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.4);
      });
    }
  } catch (e) {
    // Audio fail
  }
};

