import { useState, useRef } from 'react'
import Field from './Field'
import { click, bell } from '../sound'

const FIELDS = {
  title: { fields: [
    { key: 'projectTitle', label: 'project title', type: 'input',
      placeholder: 'my-awesome-project', helper: 'shown as the H1',
      example: 'Cosmic Coffee Tracker', maxLength: 80 },
  ]},
  badges: { fields: [
    { key: 'projectStack', label: 'tech stack', type: 'input',
      placeholder: 'React, Node, Postgres',
      helper: 'comma-separated; renders shield badges',
      example: 'React, TypeScript, Vite, Tailwind' },
  ]},
  description: { fields: [
    { key: 'projectDescription', label: 'description', type: 'textarea',
      placeholder: 'what does this project do, and why?',
      helper: '1–3 sentences. lead with the problem it solves.',
      example: 'A featherweight CLI that tracks how much coffee your codebase costs you. Logs each commit\'s caffeine debt and renders a chart you can paste into stand-ups.',
      maxLength: 280, rows: 4 },
  ]},
  installation: { fields: [
    { key: 'projectInstall', label: 'installation', type: 'textarea',
      placeholder: '```\nnpm install\n```',
      helper: 'use ``` fenced blocks for commands',
      example: 'Clone the repo, then:\n\n```\nnpm install\nnpm run setup\n```', rows: 4 },
  ]},
  usage: { fields: [
    { key: 'projectUsage', label: 'usage', type: 'textarea',
      placeholder: 'how to actually run / use the thing',
      helper: 'include code samples + screenshots',
      example: '```\nnpm run dev\n```\n\nThen open `localhost:5173`.', rows: 4 },
    { key: 'projectURL',   label: 'deployed url', type: 'input',
      placeholder: 'https://your-thing.vercel.app', helper: 'live demo link' },
    { key: 'projectImage', label: 'screenshot path', type: 'input',
      placeholder: './images/screenshot.png', helper: 'relative path or full URL' },
  ]},
  features: { fields: [
    { key: 'projectFeatures', label: 'features', type: 'textarea',
      placeholder: '- thing one\n- thing two\n- thing three',
      helper: 'bullet list works best',
      example: '- 🪐 Tracks coffee per-commit\n- 📊 Renders ASCII charts\n- 🤝 Pairs with any git hook', rows: 4 },
  ]},
  contributing: { fields: [
    { key: 'projectContribute', label: 'contributing', type: 'textarea',
      placeholder: 'fork → branch → PR',
      helper: 'or paste a CONTRIBUTING link',
      example: 'PRs welcome! Fork the repo, create a feature branch, and open a PR against `main`.', rows: 3 },
  ]},
  tests: { fields: [
    { key: 'projectTests', label: 'tests', type: 'textarea',
      placeholder: '```\nnpm test\n```',
      helper: 'how to run them',
      example: '```\nnpm test\n```\n\nUses Vitest. Coverage report lands in `coverage/`.', rows: 3 },
  ]},
  credits: { fields: [
    { key: 'projectCreds', label: 'credits', type: 'input',
      placeholder: 'people, libraries, tutorials...',
      example: 'Built on the shoulders of caffeine and the open-source community' },
  ]},
  license: { fields: [
    { key: 'projectLicense', label: 'license', type: 'select',
      options: [
        { value: 'MIT',       label: 'MIT' },
        { value: 'ISC',       label: 'ISC' },
        { value: 'Apache',    label: 'Apache 2.0' },
        { value: 'GPL',       label: 'GPLv3' },
        { value: 'BSD',       label: 'BSD 3-Clause' },
        { value: 'Unlicense', label: 'Unlicense (public domain)' },
        { value: 'none',      label: 'no license' },
      ] },
  ]},
  author: { fields: [
    { key: 'authorName',   label: 'author name',   type: 'input', placeholder: 'Ada Lovelace', maxLength: 60 },
    { key: 'authorGithub', label: 'github handle', type: 'input', placeholder: '@adalovelace', helper: 'with or without @' },
    { key: 'authorEmail',  label: 'contact email', type: 'input', placeholder: 'ada@example.com' },
  ]},
}

const SECTION_LABELS = {
  title: 'TITLE', badges: 'BADGES', description: 'DESCRIPTION',
  toc: 'TABLE OF CONTENTS', installation: 'INSTALLATION', usage: 'USAGE',
  features: 'FEATURES', contributing: 'CONTRIBUTING', tests: 'TESTS',
  credits: 'CREDITS', license: 'LICENSE', author: 'AUTHOR',
}

function SectionGroup({ id, label, sectionsEnabled, toggleSection, draggable,
  onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd,
  isDragging, isDragOver, children, customAction }) {
  const enabled = sectionsEnabled[id] !== false
  return (
    <section
      onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
      className={[isDragging ? 'dragging' : '', isDragOver ? 'drag-over' : ''].join(' ')}
      style={{ borderTop: '1px solid var(--line)', opacity: enabled ? 1 : 0.55 }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 14px', background: 'var(--ink-2)',
        position: 'sticky', top: 0, zIndex: 2,
      }}>
        <span
          draggable={draggable} onDragStart={onDragStart} onDragEnd={onDragEnd}
          title="drag to reorder section"
          style={{ cursor: draggable ? 'grab' : 'default', color: 'var(--dim)', userSelect: 'none', fontSize: 12, padding: '0 2px', letterSpacing: -1 }}
        >⠿</span>
        <span style={{ fontSize: 11, color: enabled ? 'var(--accent)' : 'var(--dim)', fontWeight: 700, letterSpacing: 0.1 }}>
          ## {label}
        </span>
        <span style={{ flex: 1 }} />
        {customAction}
        <button type="button" onClick={() => toggleSection(id)}
          title={enabled ? 'exclude from output' : 'include in output'}
          style={{ background: 'transparent', border: 0, color: enabled ? 'var(--accent)' : 'var(--dim)', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}
        >
          {enabled ? '[●] on' : '[ ] off'}
        </button>
      </div>
      {enabled && children}
    </section>
  )
}

export default function ReadmeForm({
  formData, setFormData, sectionsOrder, setSectionsOrder,
  sectionsEnabled, setSectionsEnabled, soundOn,
}) {
  const update = (key, value) => setFormData(prev => ({ ...prev, [key]: value }))
  const playClick = () => { if (soundOn) click(0.04) }

  const dragSection = useRef({ id: null })
  const [dragOverSection, setDragOverSection] = useState(null)

  const startDrag = id => e => {
    dragSection.current.id = id
    e.dataTransfer.effectAllowed = 'move'
    try { e.dataTransfer.setData('text/plain', id) } catch (_) {}
  }
  const overDrag = id => e => {
    e.preventDefault()
    if (dragSection.current.id && dragSection.current.id !== id) setDragOverSection(id)
  }
  const leaveDrag = id => () => { if (dragOverSection === id) setDragOverSection(null) }
  const dropDrag  = id => e => {
    e.preventDefault()
    const from = dragSection.current.id
    if (!from || from === id) return
    setSectionsOrder(prev => {
      const next = prev.filter(s => s !== from)
      const idx = next.indexOf(id)
      next.splice(idx, 0, from)
      return next
    })
    dragSection.current.id = null
    setDragOverSection(null)
  }
  const endDrag = () => { dragSection.current.id = null; setDragOverSection(null) }

  const toggleSection = id => {
    setSectionsEnabled(prev => ({ ...prev, [id]: prev[id] === false ? true : false }))
    if (soundOn) bell(700, 0.06, 0.05)
  }

  const addCustomSection = () => {
    const idx = (formData.customSections || []).length
    setFormData(prev => ({
      ...prev,
      customSections: [...(prev.customSections || []), { title: 'Custom Section', body: '' }],
    }))
    setSectionsOrder(prev => [...prev, `custom:${idx}`])
    setSectionsEnabled(prev => ({ ...prev, [`custom:${idx}`]: true }))
    if (soundOn) bell(900, 0.1, 0.07)
  }

  const removeCustomSection = idx => {
    setFormData(prev => ({
      ...prev,
      customSections: (prev.customSections || []).filter((_, i) => i !== idx),
    }))
    setSectionsOrder(prev => prev.filter(s => s !== `custom:${idx}`))
  }

  const updateCustom = (idx, key, value) => {
    setFormData(prev => {
      const cs = [...(prev.customSections || [])]
      cs[idx] = { ...cs[idx], [key]: value }
      return { ...prev, customSections: cs }
    })
  }

  return (
    <form style={{ paddingBottom: 60 }} onSubmit={e => e.preventDefault()}>
      <div style={{
        padding: '10px 14px', fontSize: 11, color: 'var(--dim)',
        background: 'var(--ink-2)', borderBottom: '1px solid var(--line)',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ color: 'var(--accent)' }}>$</span>
        <span>edit fields below — drag <span style={{ color: 'var(--fg)' }}>⠿</span> to reorder, click <span style={{ color: 'var(--fg)' }}>[●]</span> to toggle.</span>
      </div>

      {sectionsOrder.map(id => {
        if (id.startsWith('custom:')) {
          const idx = parseInt(id.slice(7), 10)
          const cs  = (formData.customSections || [])[idx]
          if (!cs) return null
          return (
            <SectionGroup key={id} id={id}
              label={cs.title ? cs.title.toUpperCase() : 'CUSTOM'}
              sectionsEnabled={sectionsEnabled} toggleSection={toggleSection} draggable
              onDragStart={startDrag(id)} onDragOver={overDrag(id)}
              onDragLeave={leaveDrag(id)} onDrop={dropDrag(id)} onDragEnd={endDrag}
              isDragging={dragSection.current.id === id} isDragOver={dragOverSection === id}
              customAction={
                <button type="button" onClick={() => removeCustomSection(idx)}
                  style={{ background: 'transparent', border: 0, color: 'var(--dim)', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--err)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--dim)'}
                >× rm</button>
              }
            >
              <div style={{ padding: '10px 14px 12px' }}>
                <label style={{ display: 'block', fontSize: 10, color: 'var(--accent)', marginBottom: 4, fontWeight: 600 }}>HEADING</label>
                <input className="term-input" value={cs.title}
                  onChange={e => { updateCustom(idx, 'title', e.target.value); playClick() }}
                  placeholder="Section heading" style={{ marginBottom: 12 }}
                />
                <label style={{ display: 'block', fontSize: 10, color: 'var(--accent)', marginBottom: 4, fontWeight: 600 }}>BODY</label>
                <textarea className="term-textarea" rows={3} value={cs.body}
                  onChange={e => { updateCustom(idx, 'body', e.target.value); playClick() }}
                  placeholder="Anything you want here. Markdown welcome."
                />
              </div>
            </SectionGroup>
          )
        }

        const def = FIELDS[id]
        if (!def) {
          return (
            <SectionGroup key={id} id={id} label={SECTION_LABELS[id] || id}
              sectionsEnabled={sectionsEnabled} toggleSection={toggleSection} draggable
              onDragStart={startDrag(id)} onDragOver={overDrag(id)}
              onDragLeave={leaveDrag(id)} onDrop={dropDrag(id)} onDragEnd={endDrag}
              isDragging={dragSection.current.id === id} isDragOver={dragOverSection === id}
            >
              <div style={{ padding: '10px 14px 14px', fontSize: 11, color: 'var(--dim)' }}>
                # auto-generated from your enabled sections.
              </div>
            </SectionGroup>
          )
        }

        return (
          <SectionGroup key={id} id={id} label={SECTION_LABELS[id] || id}
            sectionsEnabled={sectionsEnabled} toggleSection={toggleSection} draggable
            onDragStart={startDrag(id)} onDragOver={overDrag(id)}
            onDragLeave={leaveDrag(id)} onDrop={dropDrag(id)} onDragEnd={endDrag}
            isDragging={dragSection.current.id === id} isDragOver={dragOverSection === id}
          >
            {def.fields.map(f => (
              <Field key={f.key} fieldKey={f.key} label={f.label} type={f.type}
                placeholder={f.placeholder} helper={f.helper} example={f.example}
                maxLength={f.maxLength} rows={f.rows} options={f.options}
                value={formData[f.key]} onChange={v => update(f.key, v)}
                onSound={playClick} hideToggle enabled
              />
            ))}
          </SectionGroup>
        )
      })}

      <div style={{ padding: '16px 14px', borderTop: '1px solid var(--line)', background: 'var(--ink-2)' }}>
        <button type="button" onClick={addCustomSection}
          className="btn btn-ghost" style={{ width: '100%', padding: '8px 12px' }}
        >
          + add custom section
        </button>
      </div>
    </form>
  )
}
