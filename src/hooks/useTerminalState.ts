import { useState } from 'react'
import type { Project } from '../data/projects'

export interface Command {
	input: string
	output: string[]
	timestamp: Date
	isLoading?: boolean
}

export function useTerminalState() {
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
		setCurrentInput,
		commandHistory,
		setCommandHistory,
		inputHistory,
		setInputHistory,
		historyIndex,
		setHistoryIndex,
		showProjects,
		setShowProjects,
		selectedProject,
		setSelectedProject,
		isProcessing,
		setIsProcessing,
		suggestions,
		setSuggestions,
		soundEnabled,
		setSoundEnabled,
		language,
		setLanguage,
	}
}
