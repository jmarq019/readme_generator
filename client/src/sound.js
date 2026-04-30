let audioCtx = null

function getCtx() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)() }
    catch (e) { return null }
  }
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

export function click(volume = 0.05) {
  const ctx = getCtx()
  if (!ctx) return
  const now = ctx.currentTime
  const buf = ctx.createBuffer(1, 220, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 30)
  }
  const src = ctx.createBufferSource()
  src.buffer = buf
  const filt = ctx.createBiquadFilter()
  filt.type = 'bandpass'
  filt.frequency.value = 1800 + Math.random() * 800
  filt.Q.value = 4
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(volume, now)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04)
  src.connect(filt).connect(gain).connect(ctx.destination)
  src.start(now)
  src.stop(now + 0.05)
}

export function bell(freq = 880, dur = 0.18, volume = 0.12) {
  const ctx = getCtx()
  if (!ctx) return
  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, now)
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(volume, now + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur)
  osc.connect(gain).connect(ctx.destination)
  osc.start(now)
  osc.stop(now + dur)
}

export function chord() {
  bell(523.25, 0.20, 0.10)
  setTimeout(() => bell(659.25, 0.20, 0.10), 60)
  setTimeout(() => bell(783.99, 0.30, 0.10), 130)
}
