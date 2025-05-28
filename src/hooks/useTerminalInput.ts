import { useCallback } from 'react'
import type React from 'react'
import { projects } from '../data/projects'
import { terminalText } from '@/data/terminalText'

interface UseTerminalInputProps {
	currentInput: string
	setCurrentInput: (input: string) => void
	inputHistory: string[]
	setInputHistory: (history: string[] | ((prev: string[]) => string[])) => void
	historyIndex: number
	setHistoryIndex: (index: number) => void
	suggestions: string[]
	setSuggestions: (suggestions: string[]) => void
	soundEnabled: boolean
	playTypingSound: () => void
	playButtonSound: () => void
	checkKonamiCode: (key: string) => boolean
	easterEggCommands: any
	setCommandHistory: (history: any) => void
	executeCommand: (input: string) => void
	isProcessing: boolean
}

export function useTerminalInput({
	currentInput,
	setCurrentInput,
	inputHistory,
	historyIndex,
	setHistoryIndex,
	setSuggestions,
	soundEnabled,
	playTypingSound,
	playButtonSound,
	checkKonamiCode,
	easterEggCommands,
	setCommandHistory,
	executeCommand,
	isProcessing,
}: UseTerminalInputProps) {
	const getCommandSuggestions = useCallback((input: string) => {
		if (!input.trim()) return []

		const trimmedInput = input.trim().toLowerCase()

		if (trimmedInput.startsWith('show project')) {
			const projectName = trimmedInput.slice(13)
			if (projectName) {
				const matchingProjects = projects.filter(
					(project) =>
						project.title.toLowerCase().includes(projectName) ||
						project.id.toLowerCase().includes(projectName)
				)
				return matchingProjects.map((project) => `show project ${project.id}`)
			} else {
				return projects.map((project) => `show project ${project.id}`)
			}
		}

		const allCommands = terminalText.commands.all
		const matchingCommands = allCommands.filter((cmd) => cmd.toLowerCase().includes(trimmedInput))
		const wordStartMatches = allCommands.filter((cmd) => {
			const words = cmd.toLowerCase().split(' ')
			return words.some((word) => word.startsWith(trimmedInput))
		})

		const allMatches = [...new Set([...matchingCommands, ...wordStartMatches])]
		return allMatches
	}, [])

	const handleTabCompletion = useCallback(() => {
		const matches = getCommandSuggestions(currentInput)

		if (matches.length === 1) {
			setCurrentInput(matches[0])
			setSuggestions([])
			if (soundEnabled) playButtonSound()
		} else if (matches.length > 1) {
			setSuggestions(matches)

			const commonPrefix = matches.reduce((prefix, cmd) => {
				let common = ''
				for (let i = 0; i < Math.min(prefix.length, cmd.length); i++) {
					if (prefix[i].toLowerCase() === cmd[i].toLowerCase()) {
						common += prefix[i]
					} else {
						break
					}
				}
				return common
			})

			if (commonPrefix.length > currentInput.length) {
				setCurrentInput(commonPrefix)
				if (soundEnabled) playButtonSound()
			}
		}
	}, [
		currentInput,
		getCommandSuggestions,
		soundEnabled,
		playButtonSound,
		setCurrentInput,
		setSuggestions,
	])

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			// Check for Konami code
			if (checkKonamiCode(e.code)) {
				const output = easterEggCommands.konami()
				setCommandHistory((prev: any) => [
					...prev,
					{
						input: '🎮 KONAMI CODE',
						output,
						timestamp: new Date(),
					},
				])
				return
			}

			if (e.key === 'Enter' && !isProcessing) {
				executeCommand(currentInput)
			} else if (e.key === 'ArrowUp') {
				e.preventDefault()
				setSuggestions([])
				if (inputHistory.length > 0) {
					const newIndex =
						historyIndex === -1 ? inputHistory.length - 1 : Math.max(0, historyIndex - 1)
					setHistoryIndex(newIndex)
					setCurrentInput(inputHistory[newIndex])
				}
			} else if (e.key === 'ArrowDown') {
				e.preventDefault()
				setSuggestions([])
				if (historyIndex !== -1) {
					const newIndex = historyIndex + 1
					if (newIndex >= inputHistory.length) {
						setHistoryIndex(-1)
						setCurrentInput('')
					} else {
						setHistoryIndex(newIndex)
						setCurrentInput(inputHistory[newIndex])
					}
				}
			} else if (e.key === 'Tab') {
				e.preventDefault()
				handleTabCompletion()
			} else if (e.key === 'Escape') {
				setSuggestions([])
			}
		},
		[
			currentInput,
			isProcessing,
			inputHistory,
			historyIndex,
			executeCommand,
			handleTabCompletion,
			checkKonamiCode,
			easterEggCommands,
			setCommandHistory,
			setSuggestions,
			setHistoryIndex,
			setCurrentInput,
		]
	)

	const handleInputChange = useCallback(
		(value: string) => {
			setCurrentInput(value)
			setHistoryIndex(-1)

			// Play typing sound
			if (soundEnabled && value.length > currentInput.length) {
				playTypingSound()
			}

			if (value.trim()) {
				const matches = getCommandSuggestions(value)
				setSuggestions(matches.length > 0 ? matches : [])
			} else {
				setSuggestions([])
			}
		},
		[
			getCommandSuggestions,
			soundEnabled,
			playTypingSound,
			currentInput.length,
			setCurrentInput,
			setHistoryIndex,
			setSuggestions,
		]
	)

	return {
		getCommandSuggestions,
		handleTabCompletion,
		handleKeyDown,
		handleInputChange,
	}
}
