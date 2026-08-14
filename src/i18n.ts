import { createContext, useContext } from 'react'

export type Language = 'en' | 'es'

const STORAGE_KEY = 'portfolio-lang'

/** The /es/ page and the root page are separate URLs so hreflang can point at them. */
export const languageHref = (language: Language) =>
	language === 'es' ? `${import.meta.env.BASE_URL}es/` : import.meta.env.BASE_URL

/**
 * The URL wins — it is what a crawler, a shared link or an hreflang hit asks for.
 * Then a saved choice, then the browser's preference, then English.
 */
export const getInitialLanguage = (): Language => {
	if (window.location.pathname.startsWith(languageHref('es'))) return 'es'

	const saved = localStorage.getItem(STORAGE_KEY)
	if (saved === 'en' || saved === 'es') return saved
	return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en'
}

/** The served <head> belongs to whichever document loaded, so an in-app language
 *  switch has to retitle the tab by hand. */
export const documentTitles: Record<Language, string> = {
	en: 'Fabricio Rojas — Full Stack Developer',
	es: 'Fabricio Rojas — Desarrollador Full Stack',
}

export const persistLanguage = (language: Language) => {
	localStorage.setItem(STORAGE_KEY, language)
}

/** Reads the shared-link project id, e.g. ?project=cattle-tracker */
export const getInitialProjectId = () => new URLSearchParams(window.location.search).get('project')

/**
 * Chrome copy only. Command names ('help', 'show projects') are deliberately not
 * translated — they are commands, the same way `ls` is `ls` in every locale.
 */
const uiStrings = {
	en: {
		tourTitle: 'Show me everything',
		inputPlaceholder: 'Type a command…',
		inputProcessing: 'Running...',
		panesNav: 'Terminal windows',
		filesNav: 'Portfolio files',
		paletteHint: 'Search commands',
		paletteLabel: 'Command palette',
		paletteCommands: 'Commands',
		paletteProjects: 'Projects',
		paletteEmpty: 'No matching command.',
		expand: 'Expand folder',
		collapse: 'Collapse folder',
		suggestions: 'Suggestions',
		statusProcessing: 'Processing command...',
		statusReady: 'System Ready',
		soundOn: 'Sound: ON (click to disable)',
		soundOff: 'Sound: OFF (click to enable)',
		languageToggle: (current: string) => `Language: ${current} (click to switch)`,
		projectDatabase: 'Project database',
		// Keyed by the raw Project['status'] value, which stays English because it also
		// drives the badge colour logic and the type union.
		statusLabels: { Production: 'Production', Beta: 'Beta', Development: 'Development' },
		backToProjects: 'Back to Projects',
		viewCode: 'View Code',
		liveDemo: 'Live Demo',
		appStore: 'App Store',
		keyFeatures: 'Key Features',
		technicalStack: 'Technical Stack',
		technologies: 'Technologies:',
		status: 'Status:',
		year: 'Year:',
		copy: 'Copy to clipboard',
		copied: 'Copied',
	},
	es: {
		tourTitle: 'Mostrame todo',
		inputPlaceholder: 'Escribí un comando…',
		inputProcessing: 'Ejecutando...',
		panesNav: 'Ventanas del terminal',
		filesNav: 'Archivos del portafolio',
		paletteHint: 'Buscar comandos',
		paletteLabel: 'Paleta de comandos',
		paletteCommands: 'Comandos',
		paletteProjects: 'Proyectos',
		paletteEmpty: 'Ningún comando coincide.',
		expand: 'Expandir carpeta',
		collapse: 'Contraer carpeta',
		suggestions: 'Sugerencias',
		statusProcessing: 'Procesando comando...',
		statusReady: 'Sistema Listo',
		soundOn: 'Sonido: ACTIVO (clic para desactivar)',
		soundOff: 'Sonido: INACTIVO (clic para activar)',
		languageToggle: (current: string) => `Idioma: ${current} (clic para cambiar)`,
		projectDatabase: 'Base de datos de proyectos',
		statusLabels: {
			Production: 'En Producción',
			Beta: 'Beta',
			Development: 'En Desarrollo',
		},
		backToProjects: 'Volver a Proyectos',
		viewCode: 'Ver Código',
		liveDemo: 'Demo en Vivo',
		appStore: 'App Store',
		keyFeatures: 'Características Principales',
		technicalStack: 'Stack Técnico',
		technologies: 'Tecnologías:',
		status: 'Estado:',
		year: 'Año:',
		copy: 'Copiar al portapapeles',
		copied: 'Copiado',
	},
} as const

const LanguageContext = createContext<Language>('en')

export const LanguageProvider = LanguageContext.Provider

export const useLanguage = () => useContext(LanguageContext)

export const useUi = () => uiStrings[useContext(LanguageContext)]
