import { getProjects } from '../src/data/projects'
import { terminalContent } from '../src/data/terminalContent'
import type { Language } from '../src/i18n'

/**
 * Builds the static content block injected into each index.html at build time.
 *
 * The terminal renders nothing until a visitor types a command, so a crawler — and
 * a screen reader — would otherwise find an empty page. This block is generated
 * from the same data the app uses, so it can never drift out of sync.
 *
 * It is visually hidden with the clip pattern, not `display:none`: the content
 * stays in the accessibility tree, which is the point. It sits outside #root, so
 * React never touches it.
 */

export const escapeHtml = (text: string) =>
	text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Drops the fake "Loading..." preamble lines and blank spacers. */
export const prose = (lines: readonly string[]) =>
	lines.filter((line) => line.trim() !== '' && !line.trim().endsWith('...'))

/** Pulls `Label|Value` rows out of the TABLE:/HEADERS:/END_TABLE marker syntax. */
export const tableRows = (lines: readonly string[]) =>
	lines
		.filter((line) => line.includes('|') && !line.startsWith('HEADERS'))
		.map((line) => line.split('|').map((cell) => cell.trim()))
		.filter((cells) => cells.length === 2)

const copy = {
	en: { about: 'About', skills: 'Skills', projects: 'Projects', contact: 'Contact' },
	es: { about: 'Sobre mí', skills: 'Habilidades', projects: 'Proyectos', contact: 'Contacto' },
} as const

const roles = {
	en: 'Full Stack Developer',
	es: 'Desarrollador Full Stack',
} as const

// Mirrors ui.statusLabels in src/i18n.ts. Kept local because importing that module
// would pull React into the Vite config bundle for three words.
const statusLabels = {
	en: { Production: 'Production', Beta: 'Beta', Development: 'Development' },
	es: { Production: 'En Producción', Beta: 'Beta', Development: 'En Desarrollo' },
} as const

export const buildSeoHtml = (language: Language) => {
	const content = terminalContent[language]
	const labels = copy[language]

	const bio = prose(content.aboutMe)
		.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
		.join('')

	const skills = tableRows(content.skills)
		.map(([type, data]) => `<li><strong>${escapeHtml(type)}:</strong> ${escapeHtml(data)}</li>`)
		.join('')

	const contact = tableRows(content.contact)
		.map(([name, value]) => {
			const isEmail = value.includes('@')
			const href = isEmail ? `mailto:${value}` : `https://${value}`
			const link = value.includes('.')
				? `<a href="${escapeHtml(href)}">${escapeHtml(value)}</a>`
				: escapeHtml(value)
			return `<li>${escapeHtml(name)}: ${link}</li>`
		})
		.join('')

	const projects = getProjects(language)
		.map(
			(project) => `<article>
<h3>${escapeHtml(project.title)}</h3>
<p>${escapeHtml(project.description)}</p>
<p>${escapeHtml(project.fullDescription)}</p>
<p>${escapeHtml(project.tech)} — ${escapeHtml(project.company)} — ${escapeHtml(project.year)} — ${escapeHtml(statusLabels[language][project.status])}</p>
<ul>${project.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join('')}</ul>
</article>`
		)
		.join('')

	return `<div id="seo-content">
<h1>Fabricio Rojas</h1>
<p>${escapeHtml(roles[language])}</p>
<h2>${labels.about}</h2>
${bio}
<h2>${labels.skills}</h2>
<ul>${skills}</ul>
<h2>${labels.projects}</h2>
${projects}
<h2>${labels.contact}</h2>
<ul>${contact}</ul>
</div>
<style>
#seo-content {
	position: absolute;
	/* Pinned to the origin on purpose: without top/left it keeps its static
	   position, which is after a full-height #root, and that pushed the document
	   a pixel past the viewport and put a scrollbar on a page that never scrolls. */
	top: 0;
	left: 0;
	width: 1px;
	height: 1px;
	overflow: hidden;
	clip: rect(0 0 0 0);
	clip-path: inset(50%);
	white-space: nowrap;
}
</style>`
}
