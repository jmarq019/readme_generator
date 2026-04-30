const textFields = [
  { key: 'projectTitle',       label: 'Project Title',       type: 'input',    placeholder: 'My Awesome Project' },
  { key: 'projectDescription', label: 'Description',         type: 'textarea', placeholder: 'What does this project do?' },
  { key: 'projectURL',         label: 'Deployed Page URL',   type: 'input',    placeholder: 'https://example.com' },
  { key: 'projectImage',       label: 'Screenshot Path',     type: 'input',    placeholder: './images/screenshot.png' },
  { key: 'projectCreds',       label: 'Credits',             type: 'input',    placeholder: 'John Doe, Jane Smith' },
  { key: 'projectFeatures',    label: 'Features',            type: 'textarea', placeholder: 'List the key features...' },
  { key: 'projectContribute',  label: 'How to Contribute',   type: 'textarea', placeholder: 'Fork the repo and open a PR...' },
  { key: 'projectTests',       label: 'Tests',               type: 'textarea', placeholder: 'Describe how to run the tests...' },
]

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

export default function ReadmeForm({ formData, setFormData }) {
  const update = (key, value) => setFormData(prev => ({ ...prev, [key]: value }))

  return (
    <form className="p-6 space-y-5" onSubmit={e => e.preventDefault()}>
      <p className="text-xs text-gray-400 -mt-1">
        Fill in the fields — the preview updates automatically.
      </p>

      {textFields.map(({ key, label, type, placeholder }) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          {type === 'textarea' ? (
            <textarea
              rows={3}
              value={formData[key]}
              placeholder={placeholder}
              onChange={e => update(key, e.target.value)}
              className={`${inputClass} resize-y`}
            />
          ) : (
            <input
              type="text"
              value={formData[key]}
              placeholder={placeholder}
              onChange={e => update(key, e.target.value)}
              className={inputClass}
            />
          )}
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">License</label>
        <select
          value={formData.projectLicense}
          onChange={e => update('projectLicense', e.target.value)}
          className={inputClass}
        >
          <option value="MIT">MIT</option>
          <option value="ISC">ISC</option>
          <option value="none">None</option>
        </select>
      </div>
    </form>
  )
}
