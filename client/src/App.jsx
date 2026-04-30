import { useState, useEffect, useMemo } from 'react'
import { generateMarkdown } from './markdown'
import Header from './components/Header'
import ReadmeForm from './components/ReadmeForm'
import MarkdownPreview from './components/MarkdownPreview'
import TweaksPanel from './components/TweaksPanel'

const DEFAULT_SECTIONS_ORDER = [
  'title', 'badges', 'description', 'toc',
  'installation', 'usage', 'features',
  'contributing', 'tests', 'credits', 'license', 'author',
]

const DEFAULT_FORM = {
  projectTitle: '', projectStack: '', projectDescription: '',
  projectURL: '', projectImage: '', projectInstall: '', projectUsage: '',
  projectCreds: '', projectLicense: 'MIT', projectFeatures: '',
  projectContribute: '', projectTests: '',
  authorName: '', authorGithub: '', authorEmail: '',
  customSections: [],
}

const DEFAULT_TWEAKS = { accent: '#7CFFA1', scanlines: true, soundOn: true }
const STORAGE_KEY = 'readme_term_v1'

function hexToRGBA(hex, a) {
  const m = hex.replace('#', '').match(/^([0-9a-f]{6}|[0-9a-f]{3})$/i)
  if (!m) return `rgba(124,255,161,${a})`
  let h = m[1]
  if (h.length === 3) h = h.split('').map(c => c + c).join('')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${a})`
}

function loadSaved(key, fallback) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const v = JSON.parse(raw)[key]
      if (v !== undefined) return v
    }
  } catch (_) {}
  return fallback
}

export default function App() {
  const [formData, setFormData] = useState(() => {
    const saved = loadSaved('formData', null)
    return saved ? { ...DEFAULT_FORM, ...saved } : DEFAULT_FORM
  })

  const [sectionsOrder, setSectionsOrder] = useState(() => {
    const saved = loadSaved('sectionsOrder', null)
    return Array.isArray(saved) && saved.length ? saved : DEFAULT_SECTIONS_ORDER
  })

  const [sectionsEnabled, setSectionsEnabled] = useState(() => {
    const saved = loadSaved('sectionsEnabled', null)
    if (saved && typeof saved === 'object') return saved
    const e = {}
    DEFAULT_SECTIONS_ORDER.forEach(id => { e[id] = true })
    return e
  })

  const [tweaks, setTweaks] = useState(DEFAULT_TWEAKS)
  const [savedAt, setSavedAt] = useState(null)
  const [tweaksOpen, setTweaksOpen] = useState(false)

  const setTweak = (key, value) => setTweaks(prev => ({ ...prev, [key]: value }))

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', tweaks.accent)
    document.documentElement.style.setProperty('--accent-glow', hexToRGBA(tweaks.accent, 0.35))
  }, [tweaks.accent])

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, sectionsOrder, sectionsEnabled }))
        setSavedAt(new Date().toTimeString().slice(0, 5))
      } catch (_) {}
    }, 400)
    return () => clearTimeout(t)
  }, [formData, sectionsOrder, sectionsEnabled])

  const markdown = useMemo(
    () => generateMarkdown(formData, sectionsOrder, sectionsEnabled),
    [formData, sectionsOrder, sectionsEnabled]
  )

  const progress = useMemo(() => {
    const core = ['projectTitle', 'projectDescription', 'projectInstall', 'projectUsage', 'projectFeatures', 'projectContribute', 'projectTests', 'authorName']
    return core.filter(k => (formData[k] || '').trim().length > 0).length / core.length
  }, [formData])

  const reset = () => {
    if (!confirm('Clear all fields and reset section order?')) return
    setFormData(DEFAULT_FORM)
    setSectionsOrder(DEFAULT_SECTIONS_ORDER)
    const e = {}
    DEFAULT_SECTIONS_ORDER.forEach(id => { e[id] = true })
    setSectionsEnabled(e)
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className={`crt-overlay${tweaks.scanlines ? '' : ' off'}`} />

      <Header
        progress={progress}
        savedAt={savedAt}
        onReset={reset}
        onTweaks={() => setTweaksOpen(o => !o)}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        <aside style={{ width: '46%', minWidth: 380, overflowY: 'auto', borderRight: '1px solid var(--line)', background: 'var(--ink)' }}>
          <ReadmeForm
            formData={formData}
            setFormData={setFormData}
            sectionsOrder={sectionsOrder}
            setSectionsOrder={setSectionsOrder}
            sectionsEnabled={sectionsEnabled}
            setSectionsEnabled={setSectionsEnabled}
            soundOn={tweaks.soundOn}
          />
        </aside>
        <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <MarkdownPreview
            markdown={markdown}
            title={formData.projectTitle}
            soundOn={tweaks.soundOn}
          />
        </main>
      </div>

      <TweaksPanel
        open={tweaksOpen}
        onClose={() => setTweaksOpen(false)}
        tweaks={tweaks}
        setTweak={setTweak}
      />
    </div>
  )
}
