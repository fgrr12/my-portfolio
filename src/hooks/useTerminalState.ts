import { useState } from 'react'

export const useTerminalState = (): TerminalState & {
	setCurrentInput: (input: string) => void
	setCommandHistory: (history: Command[] | ((prev: Command[]) => Command[])) => void
	setInputHistory: (history: string[] | ((prev: string[]) => string[])) => void
	setHistoryIndex: (index: number) => void
	setShowProjects: (show: boolean) => void
	setSelectedProject: (project: Project | null) => void
	setIsProcessing: (processing: boolean) => void
	setSuggestions: (suggestions: string[]) => void
	setSoundEnabled: (enabled: boolean) => void
	setLanguage: (language: 'en' | 'es') => void
} => {
	const [currentInput, setCurrentInput] = useState('')
	const [commandHistory, setCommandHistory] = useState<Command[]>([])
	const [inputHistory, setInputHistory] = useState<string[]>([])
	const [historyIndex, setHistoryIndex] = useState(-1)
	const [showProjects, setShowProjects] = useState(false)
	const [selectedProject, setSelectedProject] = useState<Project | null>(null)
	const [isProcessing, setIsProcessing] = useState(false)
	const [suggestions, setSuggestions] = useState<string[]>([])
	const [soundEnabled, setSoundEnabled] = useState(true)
	const [language, setLanguage] = useState<'en' | 'es'>('en')

	return {
		// State
		currentInput,
		commandHistory,
		inputHistory,
		historyIndex,
		showProjects,
		selectedProject,
		isProcessing,
		suggestions,
		soundEnabled,
		language,

		// Setters
		setCurrentInput,
		setCommandHistory,
		setInputHistory,
		setHistoryIndex,
		setShowProjects,
		setSelectedProject,
		setIsProcessing,
		setSuggestions,
		setSoundEnabled,
		setLanguage,
	}
}
