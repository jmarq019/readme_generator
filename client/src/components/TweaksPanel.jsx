const ACCENT_OPTIONS = [
  { label: 'phosphor', value: '#7CFFA1' },
  { label: 'amber',    value: '#FFB86B' },
  { label: 'magenta',  value: '#FF6BD6' },
  { label: 'cyan',     value: '#7CD8FF' },
  { label: 'ivory',    value: '#EDE7D6' },
]

function ToggleRow({ label, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0' }}>
      <span style={{ fontSize: 11, color: 'var(--fg)' }}>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!value)}
        style={{
          width: 32, height: 18, borderRadius: 999,
          background: value ? 'var(--accent)' : 'var(--line-2)',
          border: 0, cursor: 'pointer', transition: 'background 150ms',
          padding: 0, position: 'relative', flexShrink: 0,
        }}
      >
        <span style={{
          position: 'absolute', top: 2,
          left: value ? 14 : 2,
          width: 14, height: 14, borderRadius: '50%',
          background: value ? 'var(--ink)' : 'var(--dim)',
          transition: 'left 150ms', display: 'block',
        }} />
      </button>
    </div>
  )
}

export default function TweaksPanel({ open, onClose, tweaks, setTweak }) {
  if (!open) return null

  return (
    <div style={{
      position: 'fixed', right: 16, bottom: 16, zIndex: 9997,
      width: 264,
      background: 'rgba(21, 22, 26, 0.97)',
      border: '1px solid var(--line-2)',
      padding: '14px 16px',
      animation: 'slide-in 120ms ease',
      backdropFilter: 'blur(12px)',
      fontFamily: '"JetBrains Mono", monospace',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', letterSpacing: 0.1 }}>
          // tweaks
        </span>
        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 0, color: 'var(--dim)', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, padding: '0 2px' }}
        >✕</button>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: 'var(--dim)', letterSpacing: 0.08, marginBottom: 8 }}>## ACCENT</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {ACCENT_OPTIONS.map(o => (
            <button
              key={o.value}
              onClick={() => setTweak('accent', o.value)}
              style={{
                border: tweaks.accent === o.value ? `2px solid ${o.value}` : '1px solid #444',
                background: o.value, color: '#0c0c0e',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10, fontWeight: 600,
                padding: '4px 8px', cursor: 'pointer', borderRadius: 0,
              }}
            >{o.label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--dim)', flex: 1 }}>custom</span>
          <input
            type="color"
            value={tweaks.accent}
            onChange={e => setTweak('accent', e.target.value)}
            style={{ width: 56, height: 22, border: '1px solid var(--line-2)', background: 'transparent', cursor: 'pointer', padding: 0 }}
          />
        </div>
      </div>

      <div>
        <div style={{ fontSize: 10, color: 'var(--dim)', letterSpacing: 0.08, marginBottom: 6 }}>## VIBE</div>
        <ToggleRow label="CRT scanlines"     value={tweaks.scanlines} onChange={v => setTweak('scanlines', v)} />
        <ToggleRow label="Typewriter sounds" value={tweaks.soundOn}   onChange={v => setTweak('soundOn', v)} />
      </div>
    </div>
  )
}
