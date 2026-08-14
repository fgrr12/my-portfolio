import type { Language } from '@/i18n'

/**
 * The parts of the CV that are not already somewhere else.
 *
 * Skills come from `terminalContent[lang].skills` and the project list from
 * `getProjects(lang)` — the generator reads those directly, so the PDF can never
 * disagree with the site. Only what has no home yet lives here.
 *
 * ────────────────────────────────────────────────────────────────────────────
 *  STILL MISSING — a CV is not credible without these. Fill them in and re-run
 *  `pnpm cv`; the generator omits any section that is still empty, so a partial
 *  file produces a shorter PDF rather than a wrong one.
 *
 *    · location          where you are, and whether you want remote / relocation
 *    · experience[]      role and dates for Qubo Systems and CoBuild Lab
 *    · education[]
 *    · languages[]       with level
 * ────────────────────────────────────────────────────────────────────────────
 */

export interface CvRole {
	company: string
	role: string
	/** Free text so "2022" or "Mar 2022" both work. */
	from: string
	/** Empty string reads as "present". */
	to: string
	highlights: string[]
}

export interface CvStudy {
	institution: string
	degree: string
	from: string
	to: string
}

export interface CvLanguage {
	name: string
	level: string
}

interface CvData {
	name: string
	title: string
	summary: string
	location: string
	email: string
	github: string
	linkedin: string
	site: string
	experience: CvRole[]
	education: CvStudy[]
	languages: CvLanguage[]
}

const contact = {
	email: 'fgrr12@gmail.com',
	github: 'github.com/fgrr12',
	linkedin: 'linkedin.com/in/fabricio-rojas',
	site: 'fgrr12.github.io/my-portfolio',
}

export const cv: Record<Language, CvData> = {
	en: {
		...contact,
		name: 'Fabricio Rojas',
		title: 'Full Stack Developer',
		summary:
			'Full Stack Developer with 5+ years building web and mobile products end to end, from database design to UI. Comfortable leading projects and talking to clients directly. Lately building with LLMs and agents in personal projects.',
		location: '',
		experience: [
			{ company: 'Qubo Systems', role: '', from: '', to: '', highlights: [] },
			{ company: 'CoBuild Lab', role: '', from: '', to: '', highlights: [] },
		],
		education: [],
		languages: [],
	},

	es: {
		...contact,
		name: 'Fabricio Rojas',
		title: 'Desarrollador Full Stack',
		summary:
			'Desarrollador Full Stack con más de 5 años construyendo productos web y móviles de punta a punta, del diseño de base de datos a la interfaz. Cómodo liderando proyectos y hablando directo con clientes. Últimamente construyendo con LLMs y agentes en proyectos propios.',
		location: '',
		experience: [
			{ company: 'Qubo Systems', role: '', from: '', to: '', highlights: [] },
			{ company: 'CoBuild Lab', role: '', from: '', to: '', highlights: [] },
		],
		education: [],
		languages: [],
	},
}
