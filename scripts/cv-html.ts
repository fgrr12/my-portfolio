import { cv } from '../src/data/cv'
import { getProjects } from '../src/data/projects'
import { terminalContent } from '../src/data/terminalContent'
import type { Language } from '../src/i18n'
import { escapeHtml, tableRows } from './seo-html'

/**
 * Builds the printable CV.
 *
 * Skills and projects are read from the same data the site renders, so the PDF
 * cannot drift from the portfolio — that is the whole point of generating it.
 * Only what has no other home (employment history, education, languages) comes
 * from `src/data/cv.ts`.
 *
 * The palette is deliberately *not* the site's: a CV gets printed and read in
 * light PDF viewers, where Tokyo Night turns into a solid black rectangle. Ink on
 * paper is the constraint, so this is dark text on white with one accent.
 */

const LABELS = {
	en: {
		summary: 'Profile',
		experience: 'Experience',
		projects: 'Selected projects',
		skills: 'Skills',
		education: 'Education',
		languages: 'Languages',
		present: 'Present',
	},
	es: {
		summary: 'Perfil',
		experience: 'Experiencia',
		projects: 'Proyectos destacados',
		skills: 'Habilidades',
		education: 'Educación',
		languages: 'Idiomas',
		present: 'Actualidad',
	},
} as const

const section = (title: string, body: string) =>
	body.trim() ? `<section><h2>${escapeHtml(title)}</h2>${body}</section>` : ''

const dateRange = (from: string, to: string, present: string) =>
	from ? `${escapeHtml(from)} — ${escapeHtml(to) || escapeHtml(present)}` : ''

export const buildCvHtml = (language: Language) => {
	const data = cv[language]
	const labels = LABELS[language]

	const experience = data.experience
		.filter((role) => role.role || role.highlights.length)
		.map(
			(role) => `<article class="entry">
<div class="entry-head">
<h3>${escapeHtml(role.role)}${role.role && role.company ? ' · ' : ''}${escapeHtml(role.company)}</h3>
<span class="meta">${dateRange(role.from, role.to, labels.present)}</span>
</div>
${role.highlights.length ? `<ul>${role.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>` : ''}
</article>`
		)
		.join('')

	const projects = getProjects(language)
		.map(
			(project) => `<article class="entry">
<div class="entry-head">
<h3>${escapeHtml(project.title)}</h3>
<span class="meta">${escapeHtml(project.year)}</span>
</div>
<p>${escapeHtml(project.description)}</p>
<p class="meta">${escapeHtml(project.company)} · ${escapeHtml(project.tech)}</p>
</article>`
		)
		.join('')

	const skills = tableRows(terminalContent[language].skills)
		.map(
			([type, list]) =>
				`<div class="skill"><span class="skill-label">${escapeHtml(type)}</span><span>${escapeHtml(list)}</span></div>`
		)
		.join('')

	const education = data.education
		.map(
			(study) => `<article class="entry">
<div class="entry-head">
<h3>${escapeHtml(study.degree)}${study.degree && study.institution ? ' · ' : ''}${escapeHtml(study.institution)}</h3>
<span class="meta">${dateRange(study.from, study.to, labels.present)}</span>
</div>
${study.note ? `<p class="meta">${escapeHtml(study.note)}</p>` : ''}
</article>`
		)
		.join('')

	const languages = data.languages.length
		? `<div class="skill"><span></span><span>${data.languages
				.map((item) => `${escapeHtml(item.name)} (${escapeHtml(item.level)})`)
				.join(' · ')}</span></div>`
		: ''

	const contactLine = [data.location, data.email, data.github, data.linkedin, data.site]
		.filter(Boolean)
		.map((item) => escapeHtml(item))
		.join('  ·  ')

	return `<!doctype html>
<html lang="${language}">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(data.name)} — ${escapeHtml(data.title)}</title>
<style>
	@page { size: A4; margin: 15mm 16mm; }

	:root {
		--ink: #17191f;
		--soft: #5b6170;
		--rule: #d7dae1;
		--accent: #4c3f95;
	}

	* { box-sizing: border-box; margin: 0; padding: 0; }

	body {
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
		color: var(--ink);
		font-size: 10.2pt;
		line-height: 1.5;
		background: #fff;
	}

	header { border-bottom: 2px solid var(--ink); padding-bottom: 10px; margin-bottom: 16px; }

	h1 { font-size: 21pt; letter-spacing: -0.4px; line-height: 1.1; }

	.role {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10pt;
		color: var(--accent);
		margin-top: 3px;
	}

	.contact {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 8.2pt;
		color: var(--soft);
		margin-top: 7px;
	}

	section { margin-bottom: 15px; }

	/* Never orphan a heading at the foot of a page. */
	h2 {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 8pt;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--soft);
		border-bottom: 1px solid var(--rule);
		padding-bottom: 4px;
		margin-bottom: 9px;
		break-after: avoid;
	}

	.entry { margin-bottom: 10px; break-inside: avoid; }

	.entry-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
	}

	h3 { font-size: 10.6pt; font-weight: 600; }

	.meta {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 8.2pt;
		color: var(--soft);
		white-space: nowrap;
	}

	.entry p { margin-top: 2px; }
	.entry p.meta { white-space: normal; }

	ul { margin: 4px 0 0 15px; }
	li { margin-bottom: 2px; }

	.skill { display: flex; gap: 12px; margin-bottom: 4px; break-inside: avoid; }

	.skill-label {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 8.2pt;
		color: var(--soft);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		min-width: 92px;
		flex-shrink: 0;
		padding-top: 2px;
	}
</style>
</head>
<body>
<header>
	<h1>${escapeHtml(data.name)}</h1>
	<div class="role">${escapeHtml(data.title)}</div>
	<div class="contact">${contactLine}</div>
</header>

${section(labels.summary, `<p>${escapeHtml(data.summary)}</p>`)}
${section(labels.experience, experience)}
${section(labels.projects, projects)}
${section(labels.skills, skills)}
${section(labels.education, education)}
${section(labels.languages, languages)}
</body>
</html>`
}
