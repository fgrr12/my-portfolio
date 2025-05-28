interface Command {
	input: string
	output: string[]
	timestamp: Date
	isLoading?: boolean
}

interface Project {
	id: string
	title: string
	description: string
	tech: string
	status: 'Production' | 'Beta' | 'Development'
	fullDescription: string
	features: string[]
	github?: string
	demo?: string
	store?: string
	images?: string[]
	year: string
}

interface TerminalState {
	currentInput: string
	commandHistory: Command[]
	inputHistory: string[]
	historyIndex: number
	showProjects: boolean
	selectedProject: Project | null
	isProcessing: boolean
	suggestions: string[]
	soundEnabled: boolean
	language: 'en' | 'es'
}

interface SoundEffects {
	playTypingSound: () => void
	playButtonSound: () => void
	playCommandSound: () => void
	playSuccessSound: () => void
	playErrorSound: () => void
	playStartupSound: () => void
	playDiscoverySound: () => void
}

interface EasterEggState {
	digitalRainMode: boolean
	isSnowing: boolean
	isGlitching: boolean
}

type CommandFunction = (...args: any[]) => string[]
type CommandMap = Record<string, CommandFunction>

interface TerminalConfig {
	availableCommands: string[]
	allCommands: string[]
	processingTimeRange: {
		min: number
		max: number
	}
}
