export const LICENSES = {
  none:      { label: 'None',         badge: null,                                link: null },
  MIT:       { label: 'MIT',          badge: 'License-MIT-yellow.svg',            link: 'https://choosealicense.com/licenses/mit/' },
  ISC:       { label: 'ISC',          badge: 'License-ISC-blue.svg',              link: 'https://choosealicense.com/licenses/isc/' },
  Apache:    { label: 'Apache 2.0',   badge: 'License-Apache_2.0-blue.svg',       link: 'https://choosealicense.com/licenses/apache-2.0/' },
  GPL:       { label: 'GPLv3',        badge: 'License-GPLv3-blue.svg',            link: 'https://choosealicense.com/licenses/gpl-3.0/' },
  BSD:       { label: 'BSD 3-Clause', badge: 'License-BSD_3--Clause-blue.svg',    link: 'https://choosealicense.com/licenses/bsd-3-clause/' },
  Unlicense: { label: 'Unlicense',    badge: 'License-Unlicense-blue.svg',        link: 'https://unlicense.org/' },
}

function renderLicenseBadge(license) {
  const l = LICENSES[license]
  if (!l || !l.badge) return ''
  return `![License: ${l.label}](https://img.shields.io/badge/${l.badge})`
}

function renderLicenseSection(license) {
  const l = LICENSES[license]
  if (!l || !l.badge) return ''
  return `## License\n\n${l.label} License — ${renderLicenseBadge(license)}\n\n[Read the full license terms here](${l.link}).\n`
}

function buildBadges(stack, license) {
  const out = []
  if (license && LICENSES[license]?.badge) out.push(renderLicenseBadge(license))
  if (stack) {
    stack.split(',').map(s => s.trim()).filter(Boolean).slice(0, 8).forEach(tech => {
      out.push(`![${tech}](https://img.shields.io/badge/-${encodeURIComponent(tech)}-2a2d34?style=flat-square)`)
    })
  }
  return out.join(' ')
}

export function generateMarkdown(data, sectionsOrder, sectionsEnabled) {
  const d = data
  const userFieldKeys = [
    'projectTitle', 'projectStack', 'projectDescription',
    'projectURL', 'projectImage', 'projectInstall', 'projectUsage',
    'projectFeatures', 'projectContribute', 'projectTests', 'projectCreds',
    'authorName', 'authorGithub', 'authorEmail',
  ]
  const hasAnyInput =
    userFieldKeys.some(k => (d[k] || '').toString().trim().length > 0) ||
    (d.customSections || []).some(cs => (cs.title || '').trim() || (cs.body || '').trim())
  if (!hasAnyInput) return ''

  const en = sectionsEnabled || {}

  const builders = {
    title:        () => d.projectTitle ? `# ${d.projectTitle}\n` : '',
    badges:       () => { const b = buildBadges(d.projectStack, d.projectLicense); return b ? `${b}\n` : '' },
    description:  () => d.projectDescription ? `## Description\n\n${d.projectDescription}\n` : '',
    toc: () => {
      const items = []
      if (en.installation !== false) items.push('- [Installation](#installation)')
      if (en.usage !== false)        items.push('- [Usage](#usage)')
      if (en.features !== false)     items.push('- [Features](#features)')
      if (en.contributing !== false) items.push('- [Contributing](#contributing)')
      if (en.tests !== false)        items.push('- [Tests](#tests)')
      if (en.credits !== false)      items.push('- [Credits](#credits)')
      if (en.license !== false && d.projectLicense !== 'none') items.push('- [License](#license)')
      if (en.author !== false)       items.push('- [Author](#author)')
      ;(d.customSections || []).forEach(cs => {
        if (cs.title) items.push(`- [${cs.title}](#${cs.title.toLowerCase().replace(/\s+/g, '-')})`)
      })
      if (!items.length) return ''
      return `## Table of Contents\n\n${items.join('\n')}\n`
    },
    installation: () => d.projectInstall  ? `## Installation\n\n${d.projectInstall}\n`   : '',
    usage: () => {
      let out = ''
      if (d.projectUsage) out += `## Usage\n\n${d.projectUsage}\n`
      if (d.projectImage) { if (!out) out += '## Usage\n\n'; out += `\n![screenshot](${d.projectImage})\n` }
      if (d.projectURL)   { if (!out) out += '## Usage\n\n'; out += `\n🔗 **Live demo:** [${d.projectURL}](${d.projectURL})\n` }
      return out
    },
    features:     () => d.projectFeatures   ? `## Features\n\n${d.projectFeatures}\n`     : '',
    contributing: () => d.projectContribute ? `## Contributing\n\n${d.projectContribute}\n` : '',
    tests:        () => d.projectTests      ? `## Tests\n\n${d.projectTests}\n`            : '',
    credits:      () => d.projectCreds      ? `## Credits\n\n${d.projectCreds}\n`          : '',
    license:      () => renderLicenseSection(d.projectLicense),
    author: () => {
      const lines = []
      if (d.authorName)   lines.push(`**${d.authorName}**`)
      if (d.authorGithub) lines.push(`GitHub: [@${d.authorGithub.replace(/^@/, '')}](https://github.com/${d.authorGithub.replace(/^@/, '')})`)
      if (d.authorEmail)  lines.push(`Email: <${d.authorEmail}>`)
      if (!lines.length) return ''
      return `## Author\n\n${lines.join('  \n')}\n`
    },
  }

  const order = sectionsOrder || [
    'title', 'badges', 'description', 'toc',
    'installation', 'usage', 'features', 'contributing',
    'tests', 'credits', 'license', 'author',
  ]

  const parts = []
  for (const id of order) {
    if (id.startsWith('custom:')) {
      const idx = parseInt(id.slice(7), 10)
      const cs = (d.customSections || [])[idx]
      if (cs && cs.title) parts.push(`## ${cs.title}\n\n${cs.body || ''}\n`)
      continue
    }
    if (en[id] === false) continue
    if (builders[id]) {
      const out = builders[id]()
      if (out) parts.push(out)
    }
  }
  return parts.join('\n')
}
