import { useCallback } from 'react'
import { useTerminalCommands } from './useTerminalCommands'
import { useTerminalInput } from './useTerminalInput'
import { useSoundEffects } from './useSoundEffects'
import { useEasterEggs } from './useEasterEggs'
import { useTerminalState } from './useTerminalState'
import { generateProcessingTime, shouldPlaySound } from '@/utils/terminalHelpers'
import { terminalMessages } from '@/data/terminalMessages'
import { COMMANDS, TERMINAL_CONFIG } from '@/constants/terminal'
import { projects } from '@/data/projects'

export function useTerminal() {
	const terminalState = useTerminalState()
	const soundEffects = useSoundEffects()
	const { easterEggCommands, digitalRainMode, isSnowing, isGlitching, checkKonamiCode } =
		useEasterEggs()

	const {
		currentInput,
		commandHistory,
		inputHistory,
		showProjects,
		selectedProject,
		isProcessing,
		suggestions,
		soundEnabled,
		language,
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
	} = terminalState

	const { playCommandSound, playErrorSound, playStartupSound, playSuccessSound, playButtonSound } =
		soundEffects

	const { commands } = useTerminalCommands({
		soundEnabled,
		setSoundEnabled,
		setLanguage,
		setShowProjects,
		setSelectedProject,
		soundEffects,
	})

	const executeCommand = useCallback(
		async (input: string) => {
			if (isProcessing) return

			const trimmedInput = input.trim()
			const lowerInput = trimmedInput.toLowerCase()
			setIsProcessing(true)
			setSuggestions([])

			if (shouldPlaySound(soundEnabled)) playCommandSound()

			// Add to input history
			if (
				trimmedInput &&
				(inputHistory.length === 0 || inputHistory[inputHistory.length - 1] !== trimmedInput)
			) {
				setInputHistory((prev) => [...prev, trimmedInput])
			}
			setHistoryIndex(-1)

			// Show loading command
			const loadingCommand: Command = {
				input: trimmedInput,
				output: [],
				timestamp: new Date(),
				isLoading: true,
			}

			setCommandHistory((prev) => [...prev, loadingCommand])
			setCurrentInput('')

			// Simulate processing time
			const processingTime = generateProcessingTime()
			await new Promise((resolve) => setTimeout(resolve, processingTime))

			// Remove loading command
			setCommandHistory((prev) => prev.slice(0, -1))

			// Execute command
			if (lowerInput.startsWith('show project ')) {
				const projectName = trimmedInput.slice(13).trim()
				const output = commands['show project'](projectName)
				setCommandHistory(
					(prev) =>
						[
							...prev,
							{
								input: trimmedInput,
								output,
								timestamp: new Date(),
							},
						] as Command[]
				)
			} else if (lowerInput === 'back') {
				const output = commands.back(selectedProject, showProjects)
				setCommandHistory(
					(prev) =>
						[
							...prev,
							{
								input: trimmedInput,
								output,
								timestamp: new Date(),
							},
						] as Command[]
				)
			} else if (lowerInput === 'clear') {
				commands.clear()
				setCommandHistory([])
				setShowProjects(false)
				setSelectedProject(null)
			} else {
				const command = commands[lowerInput as keyof typeof commands] as CommandFunction

				if (command) {
					const output = command()
					if (output.length > 0) {
						setCommandHistory((prev) => [
							...prev,
							{
								input: trimmedInput,
								output,
								timestamp: new Date(),
							},
						])
					}
				} else if (trimmedInput) {
					if (shouldPlaySound(soundEnabled)) playErrorSound()
					setCommandHistory((prev) => [
						...prev,
						{
							input: trimmedInput,
							output: terminalMessages.commands.error.notFound(trimmedInput),
							timestamp: new Date(),
						},
					])
				}
			}

			setIsProcessing(false)
		},
		[
			isProcessing,
			inputHistory,
			soundEnabled,
			playCommandSound,
			playErrorSound,
			commands,
			selectedProject,
			showProjects,
			setIsProcessing,
			setSuggestions,
			setInputHistory,
			setHistoryIndex,
			setCommandHistory,
			setCurrentInput,
			setShowProjects,
			setSelectedProject,
		]
	)

	const { handleKeyDown, handleInputChange } = useTerminalInput({
		currentInput,
		setCurrentInput,
		inputHistory,
		setInputHistory,
		historyIndex: terminalState.historyIndex,
		setHistoryIndex,
		suggestions,
		setSuggestions,
		soundEnabled,
		playTypingSound: soundEffects.playTypingSound,
		playButtonSound: soundEffects.playButtonSound,
		checkKonamiCode,
		easterEggCommands,
		setCommandHistory,
		executeCommand,
		isProcessing,
	})

	const handleQuickCommand = useCallback(
		async (cmd: string) => {
			if (isProcessing) return
			setCurrentInput(cmd)
			setSuggestions([])
			await executeCommand(cmd)
		},
		[isProcessing, executeCommand, setCurrentInput, setSuggestions]
	)

	const selectSuggestion = useCallback(
		(suggestion: string) => {
			setCurrentInput(suggestion)
			setSuggestions([])
			if (shouldPlaySound(soundEnabled)) playButtonSound()
		},
		[soundEnabled, playButtonSound, setCurrentInput, setSuggestions]
	)

	const closeProjects = useCallback(() => {
		setShowProjects(false)
		setSelectedProject(null)
	}, [setShowProjects, setSelectedProject])

	const selectProject = useCallback(
		(project: Project) => {
			setSelectedProject(project)
		},
		[setSelectedProject]
	)

	const goBackToProjects = useCallback(() => {
		setSelectedProject(null)
	}, [setSelectedProject])

	const toggleSound = useCallback(() => {
		const newSoundState = !soundEnabled
		setSoundEnabled(newSoundState)

		if (newSoundState) {
			setTimeout(() => playSuccessSound(), TERMINAL_CONFIG.ANIMATION_DELAYS.SOUND_FEEDBACK)
		}
	}, [soundEnabled, playSuccessSound, setSoundEnabled])

	const toggleLanguage = useCallback(() => {
		const newLanguage = language === 'en' ? 'es' : 'en'
		setLanguage(newLanguage)

		if (shouldPlaySound(soundEnabled)) {
			setTimeout(() => playButtonSound(), TERMINAL_CONFIG.ANIMATION_DELAYS.SOUND_FEEDBACK)
		}
	}, [language, soundEnabled, playButtonSound, setLanguage])

	const playStartup = useCallback(() => {
		if (shouldPlaySound(soundEnabled)) {
			setTimeout(() => playStartupSound(), TERMINAL_CONFIG.ANIMATION_DELAYS.STARTUP_SOUND)
		}
	}, [soundEnabled, playStartupSound])

	return {
		// State
		currentInput,
		commandHistory,
		suggestions,
		isProcessing,
		showProjects,
		selectedProject,
		projects,
		availableCommands: COMMANDS.AVAILABLE,
		soundEnabled,
		language,
		digitalRainMode,
		isSnowing,
		isGlitching,

		// Handlers
		handleInputChange,
		handleKeyDown,
		handleQuickCommand,
		selectSuggestion,
		closeProjects,
		selectProject,
		goBackToProjects,
		playStartup,
		toggleSound,
		toggleLanguage,
	}
}
