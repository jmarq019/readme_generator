import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { chord, bell } from '../sound'

function fireConfetti(originEl, soundOn) {
  const rect = originEl
    ? originEl.getBoundingClientRect()
    : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 }
  const cx = rect.left + rect.width / 2
  const cy = rect.top  + rect.height / 2
  const chars  = ['+', '*', '·', '▮', '▯', '◆', '◇', '█', '░', '▓', '/', '\\', '$', '#', '0', '1']
  const colors = ['#7CFFA1', '#ffb86b', '#ff6b6b', '#c9cdd6', '#7CFFA1', '#7CFFA1']
  const layer  = document.createElement('div')
  layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998;'
  document.body.appendChild(layer)
  for (let i = 0; i < 60; i++) {
    const sp  = document.createElement('span')
    const dx  = (Math.random() - 0.5) * window.innerWidth * 0.9
    const r   = (Math.random() - 0.5) * 720
    const dur = 1400 + Math.random() * 1400
    sp.textContent = chars[Math.floor(Math.random() * chars.length)]
    sp.style.cssText = `
      position:absolute; left:${cx}px; top:${cy}px;
      color:${colors[Math.floor(Math.random() * colors.length)]};
      font-family:"JetBrains Mono",monospace;
      font-size:${10 + Math.random() * 12}px; font-weight:700;
      --x0:0px; --x1:${dx}px; --r:${r}deg;
      animation:confetti-fall ${dur}ms cubic-bezier(.2,.6,.4,1) forwards;
    `
    layer.appendChild(sp)
  }
  setTimeout(() => layer.remove(), 3200)
  if (soundOn) chord()
}

export default function MarkdownPreview({ markdown, title, soundOn }) {
  const [copied,     setCopied]  = useState(false)
  const [mode,       setMode]    = useState('rendered')
  const [downloaded, setDl]      = useState(false)

  const empty     = !markdown || !markdown.trim()
  const lineCount = (markdown || '').split('\n').length
  const charCount = (markdown || '').length

  const download = e => {
    if (empty) return
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = `${(title || 'README').replace(/\s+/g, '_')}.md`
    a.click()
    URL.revokeObjectURL(url)
    setDl(true)
    setTimeout(() => setDl(false), 1800)
    fireConfetti(e.currentTarget, soundOn)
  }

  const copy = () => {
    if (empty) return
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
      if (soundOn) bell(1200, 0.08, 0.06)
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--ink)' }}>
      {/* toolbar */}
      <div style={{ flexShrink: 0, borderBottom: '1px solid var(--line)', background: 'var(--ink-2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px' }}>
          <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600, letterSpacing: 0.05 }}>
            ▸ PREVIEW.MD
          </span>
          <span style={{ flex: 1 }} />
          <span style={{ fontSize: 10, color: 'var(--dim)', fontVariantNumeric: 'tabular-nums' }}>
            {lineCount} L · {charCount} ch
          </span>

          {/* render / raw toggle */}
          <div style={{ display: 'flex', border: '1px solid var(--line-2)' }}>
            {['rendered', 'raw'].map(m => (
              <button key={m} className="btn"
                style={{
                  borderRadius: 0, border: 0,
                  borderRight: m === 'rendered' ? '1px solid var(--line-2)' : 0,
                  background: mode === m ? 'var(--accent)' : 'transparent',
                  color: mode === m ? 'var(--ink)' : 'var(--fg)',
                  fontWeight: mode === m ? 600 : 400,
                  fontSize: 11, padding: '4px 10px',
                }}
                onClick={() => setMode(m)}
              >{m}</button>
            ))}
          </div>

          <button className="btn" onClick={copy} disabled={empty}>
            {copied ? '✓ copied' : '⎘ copy'}
          </button>
          <button className="btn btn-primary" onClick={download} disabled={empty}
            style={{ animation: !empty ? 'pulse-accent 2.4s ease-in-out infinite' : 'none' }}
          >
            {downloaded ? '✓ saved' : '↓ download .md'}
          </button>
        </div>
      </div>

      {/* content */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: mode === 'rendered' ? '32px' : '20px',
        background: mode === 'rendered' ? 'var(--paper)' : 'var(--ink)',
        backgroundImage: mode === 'rendered'
          ? 'repeating-linear-gradient(0deg, transparent 0, transparent 23px, rgba(180,170,130,0.18) 23px, rgba(180,170,130,0.18) 24px)'
          : 'none',
      }}>
        {empty ? (
          mode === 'rendered' ? (
            <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 0', textAlign: 'center', color: 'var(--paper-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
              <pre style={{ fontSize: 12, lineHeight: 1.2, color: 'var(--paper-dim)', margin: 0 }}>
{`           ┌─────────────────────────┐
           │                         │
           │   ░░░░░░░░░░░░░░░░░░░   │
           │   ░░░░░░░░░░░░░░░░░░░   │
           │   ░░░░░░░░░░░░░░░░░░░   │
           │                         │
           │   ░░░░░░░░░░░           │
           │   ░░░░░░░░░░░░░░░░░     │
           │                         │
           └─────────────────────────┘`}
              </pre>
              <p style={{ marginTop: 24, fontSize: 13 }}>
                start typing on the left — your README will appear here.
              </p>
            </div>
          ) : (
            <pre style={{ color: 'var(--dim)', fontStyle: 'italic', margin: 0 }}>// awaiting input...</pre>
          )
        ) : mode === 'rendered' ? (
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <div className="paper-md">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <pre style={{
            margin: 0, color: 'var(--fg-2)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 12.5, lineHeight: 1.65,
            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          }}>
            <code>{markdown}</code>
          </pre>
        )}
      </div>
    </div>
  )
}
