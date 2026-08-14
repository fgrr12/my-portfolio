import type React from 'react'

export type { Language } from '@/i18n'

/** The terminal "windows" the app can show, in tmux's sense. */
export type PaneId = 'main' | 'projects'

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

export interface MainTerminalProps {
	commandHistory: Command[]
	currentInput: string
	suggestions: string[]
	isProcessing: boolean
	onInputChange: (value: string) => void
	onKeyDown: (e: React.KeyboardEvent) => void
	onSuggestionSelect: (suggestion: string) => void
}

export interface ProjectsTerminalProps {
	projects: Project[]
	selectedProject: Project | null
	onSelectProject: (project: Project) => void
	onBackToProjects: () => void
}

export interface TableRendererProps {
	data: TableData
	className?: string
}
