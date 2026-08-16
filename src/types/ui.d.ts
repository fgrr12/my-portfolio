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

/** Every state the terminal pet can be in. Drives both eyes and mouth. */
export type CompanionMood =
	| 'idle'
	| 'happy'
	| 'thinking'
	| 'error'
	| 'wow'
	| 'love'
	| 'dizzy'
	| 'sleep'
	| 'held'
	/** Someone is typing at the prompt and it is reading over their shoulder. */
	| 'watching'
	/** Sound was just turned off, so it has its hands over its ears. */
	| 'muted'
	| 'yawn'

export interface CompanionFaceProps {
	mood: CompanionMood
	blink: boolean
	/** Pointer direction, -1…1 on each axis. The eyes lean this way. */
	look: { x: number; y: number }
	/** Shown instead of the face while a project is open. */
	glyph: string | null
	faceColor: string
	ledColor: string
}

export interface CompanionProps {
	visible: boolean
	isProcessing: boolean
	/** What is in the prompt right now — it leans over to read along. */
	currentInput: string
	commandHistory: Command[]
	selectedProject: Project | null
	digitalRainMode: boolean
	isSnowing: boolean
	isGlitching: boolean
	soundEnabled: boolean
	onRun: (command: string) => void
}
