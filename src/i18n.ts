import { createContext, useContext } from 'react'

export type Language = 'en' | 'es'

const STORAGE_KEY = 'portfolio-lang'

/** The /es/ page and the root page are separate URLs so hreflang can point at them. */
const languageHref = (language: Language) =>
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

const documentTitles: Record<Language, string> = {
	en: 'Fabricio Rojas — Full Stack Developer',
	es: 'Fabricio Rojas — Desarrollador Full Stack',
}

export const persistLanguage = (language: Language) => {
	localStorage.setItem(STORAGE_KEY, language)
	// Keep the address bar honest without a reload, so a copied link opens in the
	// language the visitor is actually looking at. The served <head> belongs to the
	// document that loaded, so the tab title has to be updated by hand.
	window.history.replaceState(null, '', languageHref(language))
	document.title = documentTitles[language]
}

/**
 * Chrome copy only. Command names ('help', 'show projects') are deliberately not
 * translated — they are commands, the same way `ls` is `ls` in every locale.
 */
const uiStrings = {
	en: {
		welcomeTitle: '◆ FABRICIO ROJAS PORTFOLIO SYSTEM v2.1.0 ◆',
		welcomeHint: "Type 'help' for available commands",
		lastLogin: 'Last login:',
		tourTitle: 'Show me everything',
		tourHint: 'No typing required — runs the full tour',
		inputPlaceholder: 'Type a command...',
		inputProcessing: 'Processing...',
		quickCommands: '◆ Quick commands:',
		suggestions: '◆ Suggestions:',
		statusProcessing: 'Processing command...',
		statusReady: 'System Ready',
		soundOn: 'Sound: ON (click to disable)',
		soundOff: 'Sound: OFF (click to enable)',
		languageToggle: (current: string) => `Language: ${current} (click to switch)`,
		closeTerminal: 'Close terminal',
		projectDatabase: '◆ PROJECT DATABASE ◆',
		projectsLoaded: (count: number) =>
			`◆ ${count} projects loaded • Click on a project or use 'show project <name>'`,
		techStack: 'Tech Stack:',
		// Keyed by the raw Project['status'] value, which stays English because it also
		// drives the badge colour logic and the type union.
		statusLabels: { Production: 'Production', Beta: 'Beta', Development: 'Development' },
		backToProjects: 'Back to Projects',
		projectDetail: 'PROJECT_DETAIL',
		viewCode: 'View Code',
		liveDemo: 'Live Demo',
		appStore: 'App Store',
		keyFeatures: 'Key Features',
		technicalStack: 'Technical Stack',
		technologies: 'Technologies:',
		status: 'Status:',
		year: 'Year:',
		backHint: "◆ Use 'back' command or click the back button to return to projects",
	},
	es: {
		welcomeTitle: '◆ SISTEMA DE PORTAFOLIO DE FABRICIO ROJAS v2.1.0 ◆',
		welcomeHint: "Escribí 'help' para ver los comandos disponibles",
		lastLogin: 'Último acceso:',
		tourTitle: 'Mostrame todo',
		tourHint: 'Sin escribir nada — corre el recorrido completo',
		inputPlaceholder: 'Escribí un comando...',
		inputProcessing: 'Procesando...',
		quickCommands: '◆ Comandos rápidos:',
		suggestions: '◆ Sugerencias:',
		statusProcessing: 'Procesando comando...',
		statusReady: 'Sistema Listo',
		soundOn: 'Sonido: ACTIVO (clic para desactivar)',
		soundOff: 'Sonido: INACTIVO (clic para activar)',
		languageToggle: (current: string) => `Idioma: ${current} (clic para cambiar)`,
		closeTerminal: 'Cerrar terminal',
		projectDatabase: '◆ BASE DE DATOS DE PROYECTOS ◆',
		projectsLoaded: (count: number) =>
			`◆ ${count} proyectos cargados • Hacé clic en un proyecto o usá 'show project <nombre>'`,
		techStack: 'Stack:',
		statusLabels: {
			Production: 'En Producción',
			Beta: 'Beta',
			Development: 'En Desarrollo',
		},
		backToProjects: 'Volver a Proyectos',
		projectDetail: 'DETALLE',
		viewCode: 'Ver Código',
		liveDemo: 'Demo en Vivo',
		appStore: 'App Store',
		keyFeatures: 'Características Principales',
		technicalStack: 'Stack Técnico',
		technologies: 'Tecnologías:',
		status: 'Estado:',
		year: 'Año:',
		backHint: "◆ Usá el comando 'back' o el botón para volver a los proyectos",
	},
} as const

const LanguageContext = createContext<Language>('en')

export const LanguageProvider = LanguageContext.Provider

export const useLanguage = () => useContext(LanguageContext)

export const useUi = () => uiStrings[useContext(LanguageContext)]
