import { useState, useEffect } from 'react'

function AsciiLogo() {
  return (
    <pre style={{
      margin: 0,
      fontSize: 9,
      lineHeight: 1.05,
      color: 'var(--accent)',
      textShadow: '0 0 6px var(--accent-glow)',
      letterSpacing: 0,
      fontFamily: 'JetBrains Mono, monospace',
      whiteSpace: 'pre',
      userSelect: 'none',
    }}>
{`  ___ ___   _   ___  __  __ ___
 | _ \\ __| /_\\ |   \\|  \\/  | __|
 |   / _| / _ \\| |) | |\\/| | _|
 |_|_\\___/_/ \\_\\___/|_|  |_|___|`}
    </pre>
  )
}

function StatusDots({ progress }) {
  const total = 8
  const filled = Math.round((progress || 0) * total)
  return (
    <span style={{ letterSpacing: 1 }}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} style={{
          color: i < filled ? 'var(--accent)' : 'var(--line-2)',
          textShadow: i < filled ? '0 0 4px var(--accent-glow)' : 'none',
        }}>
          {i < filled ? '█' : '░'}
        </span>
      ))}
    </span>
  )
}

export default function Header({ progress, savedAt, onReset, onTweaks }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const time = now.toTimeString().slice(0, 8)
  const pct  = Math.round((progress || 0) * 100)

  return (
    <header style={{ flexShrink: 0, borderBottom: '1px solid var(--line)', background: 'var(--ink-2)' }}>
      {/* fake terminal title bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 12px',
        borderBottom: '1px solid var(--line)',
        fontSize: 11,
        color: 'var(--dim)',
      }}>
        <span style={{ display: 'flex', gap: 5 }}>
          {['#3a3e48', '#3a3e48', '#3a3e48'].map((bg, i) => (
            <span key={i} style={{ width: 11, height: 11, borderRadius: '50%', background: bg, display: 'inline-block' }} />
          ))}
        </span>
        <span style={{ flex: 1, textAlign: 'center', letterSpacing: 0.5 }}>
          ~/readme_generator <span style={{ color: 'var(--line-2)' }}>—</span> bash
        </span>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{time}</span>
      </div>

      <div style={{ padding: '12px 18px 14px', display: 'flex', alignItems: 'center', gap: 18 }}>
        <AsciiLogo />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: 'var(--dim)', marginBottom: 4 }}>
            <span style={{ color: 'var(--accent)' }}>$</span>
            {' '}readme --interactive{' '}
            <span className="blink" />
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--dim)', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span>complete:</span>
            <StatusDots progress={progress} />
            <span style={{ color: 'var(--fg)', fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
            {savedAt && <span>· saved {savedAt}</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost" onClick={onTweaks} style={{ fontSize: 11 }}>⚙ tweaks</button>
          <button className="btn btn-ghost" onClick={onReset} title="clear all fields">↻ reset</button>
        </div>
      </div>
    </header>
  )
}
