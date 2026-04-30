import { useState } from 'react'

function ValidationIcon({ status }) {
  if (status === 'ok')   return <span style={{ color: 'var(--accent)' }} title="ok">✓</span>
  if (status === 'warn') return <span style={{ color: 'var(--warn)'   }} title="check syntax">!</span>
  if (status === 'err')  return <span style={{ color: 'var(--err)'    }} title="invalid">✗</span>
  return null
}

function validateField(key, value) {
  if (!value) return null
  if (key === 'projectURL' || key === 'projectImage') {
    try {
      if (key === 'projectImage' && /^\.?\.?\//.test(value)) return 'ok'
      const u = new URL(value)
      return /^https?:$/.test(u.protocol) ? 'ok' : 'warn'
    } catch { return 'err' }
  }
  if (key === 'authorEmail')  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'ok' : 'err'
  if (key === 'authorGithub') return /^@?[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,38})$/.test(value) ? 'ok' : 'err'
  return null
}

export default function Field({
  fieldKey, label, type = 'input', placeholder, helper, example,
  value, onChange, enabled = true, onToggle, draggable = false,
  onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd,
  isDragging, isDragOver, rows = 3, maxLength, options, onSound, hideToggle,
}) {
  const [focused, setFocused] = useState(false)
  const status   = validateField(fieldKey, value)
  const count    = (value || '').length
  const overLimit = maxLength && count > maxLength

  const handleChange = e => { onChange(e.target.value); if (onSound) onSound() }

  return (
    <div
      className={[isDragging ? 'dragging' : '', isDragOver ? 'drag-over' : ''].join(' ')}
      onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
      style={{
        padding: '10px 14px 12px',
        borderTop: '1px solid var(--line)',
        opacity: enabled ? 1 : 0.45,
        transition: 'opacity 200ms, background 200ms',
        background: focused ? 'rgba(124,255,161,0.025)' : 'transparent',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        {draggable && (
          <span
            draggable onDragStart={onDragStart} onDragEnd={onDragEnd}
            title="drag to reorder"
            style={{ cursor: 'grab', color: 'var(--dim)', userSelect: 'none', fontSize: 11, padding: '0 2px', letterSpacing: -1 }}
          >::</span>
        )}
        <label htmlFor={fieldKey} style={{
          fontSize: 11, color: enabled ? 'var(--accent)' : 'var(--dim)',
          fontWeight: 600, letterSpacing: 0.06, textTransform: 'uppercase', flex: '0 0 auto',
        }}>
          {'>'} {label}
        </label>
        <span style={{ flex: 1 }} />
        {status && <ValidationIcon status={status} />}
        {maxLength && enabled && (
          <span style={{
            fontSize: 10, fontVariantNumeric: 'tabular-nums',
            color: overLimit ? 'var(--err)' : count / maxLength > 0.8 ? 'var(--warn)' : 'var(--dim)',
          }}>{count}/{maxLength}</span>
        )}
        {!hideToggle && onToggle && (
          <button type="button" onClick={onToggle}
            title={enabled ? 'hide section' : 'show section'}
            style={{ background: 'transparent', border: 0, color: enabled ? 'var(--accent)' : 'var(--dim)', cursor: 'pointer', fontSize: 11, padding: '0 4px', fontFamily: 'inherit' }}
          >
            {enabled ? '[●]' : '[ ]'}
          </button>
        )}
      </div>

      {enabled && (
        <>
          {type === 'textarea' ? (
            <textarea id={fieldKey} className="term-textarea" rows={rows}
              value={value || ''} placeholder={placeholder}
              onChange={handleChange}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            />
          ) : type === 'select' ? (
            <select id={fieldKey} className="term-select"
              value={value || ''} onChange={handleChange}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            >
              {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ) : (
            <input id={fieldKey} className="term-input" type="text"
              value={value || ''} placeholder={placeholder}
              onChange={handleChange}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            />
          )}

          {(helper || example) && (
            <div style={{ marginTop: 4, fontSize: 10.5, color: 'var(--dim)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              {helper && <span># {helper}</span>}
              {example && (
                <button type="button" onClick={() => onChange(example)}
                  style={{ background: 'transparent', border: '1px dashed var(--line-2)', color: 'var(--dim)', fontFamily: 'inherit', fontSize: 10, padding: '1px 6px', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--dim)'}
                >use example</button>
              )}
            </div>
          )}

          {fieldKey === 'projectImage' && value && status === 'ok' && (
            <div style={{ marginTop: 8, padding: 8, border: '1px dashed var(--line-2)', maxWidth: 200 }}>
              <div style={{ fontSize: 10, color: 'var(--dim)', marginBottom: 4 }}>preview:</div>
              <img src={value} alt="preview"
                onError={e => { e.currentTarget.style.display = 'none' }}
                style={{ maxWidth: '100%', maxHeight: 80, display: 'block' }}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
