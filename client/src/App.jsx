import { useState, useEffect } from 'react'
import ReadmeForm from './components/ReadmeForm'
import MarkdownPreview from './components/MarkdownPreview'

const defaultFormData = {
  projectTitle: '',
  projectDescription: '',
  projectURL: '',
  projectImage: '',
  projectCreds: '',
  projectLicense: 'MIT',
  projectFeatures: '',
  projectContribute: '',
  projectTests: '',
}

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export default function App() {
  const [formData, setFormData] = useState(defaultFormData)
  const [markdown, setMarkdown] = useState('')
  const [loading, setLoading] = useState(false)

  const debouncedData = useDebounce(formData, 450)

  useEffect(() => {
    if (!debouncedData.projectTitle && !debouncedData.projectDescription) return

    setLoading(true)
    fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(debouncedData),
    })
      .then(r => r.json())
      .then(d => setMarkdown(d.markdown))
      .finally(() => setLoading(false))
  }, [debouncedData])

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }} className="bg-gray-50">
      <header className="bg-gray-900 text-white px-6 py-3 shrink-0 flex items-center">
        <h1 className="text-lg font-semibold tracking-tight">README Generator</h1>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-1/2 overflow-y-auto border-r border-gray-200 bg-white">
          <ReadmeForm formData={formData} setFormData={setFormData} />
        </aside>
        <main className="w-1/2 overflow-y-auto bg-white flex flex-col">
          <MarkdownPreview markdown={markdown} loading={loading} title={formData.projectTitle} />
        </main>
      </div>
    </div>
  )
}
