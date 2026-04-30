import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function MarkdownPreview({ markdown, loading, title }) {
  const [copied, setCopied] = useState(false)

  const download = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title || 'README'}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copy = () => {
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 sticky top-0 bg-white z-10 shrink-0">
        <span className="text-sm font-medium text-gray-600">
          Preview{loading && <span className="text-blue-500 ml-1">— updating…</span>}
        </span>
        <div className="flex gap-2">
          <button
            onClick={copy}
            disabled={!markdown}
            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={download}
            disabled={!markdown}
            className="px-3 py-1.5 text-sm rounded-md bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Download .md
          </button>
        </div>
      </div>

      <div className="flex-1 px-6 py-5 overflow-y-auto">
        {markdown ? (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic mt-4">
            Fill out the form to see a live preview here.
          </p>
        )}
      </div>
    </div>
  )
}
