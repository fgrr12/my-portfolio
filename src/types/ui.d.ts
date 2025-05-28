import type React from 'react'

export interface ControlPanelProps {
	soundEnabled: boolean
	language: 'en' | 'es'
	onToggleSound: () => void
	onToggleLanguage: () => void
}

export interface SuggestionsProps {
	suggestions: string[]
	onSelect: (suggestion: string) => void
	inputRef?: React.RefObject<HTMLInputElement>
}

export interface CommandInputProps {
	value: string
	onChange: (value: string) => void
	onKeyDown: (e: React.KeyboardEvent) => void
	disabled: boolean
	placeholder: string
}

export interface TerminalHeaderProps {
	title: string
	subtitle: string
	onClose?: () => void
	showCloseButton?: boolean
}

export interface MainTerminalProps {
	commandHistory: Command[]
	currentInput: string
	suggestions: string[]
	isProcessing: boolean
	availableCommands: string[]
	onInputChange: (value: string) => void
	onKeyDown: (e: React.KeyboardEvent) => void
	onSuggestionSelect: (suggestion: string) => void
	onQuickCommand: (command: string) => void
	showProjects: boolean
}

export interface ProjectsTerminalProps {
	projects: Project[]
	selectedProject: Project | null
	onClose: () => void
	onSelectProject: (project: Project) => void
	onBackToProjects: () => void
}
