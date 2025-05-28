import { useCallback } from 'react'
import { useTerminalState, type Command } from './useTerminalState'
import { useTerminalCommands } from './useTerminalCommands'
import { useTerminalInput } from './useTerminalInput'
import { useSoundEffects } from './useSoundEffects'
import { useEasterEggs } from './useEasterEggs'
import { projects, type Project } from '../data/projects'
import { terminalText } from '../data/terminalText'

export function useTerminal() {
	const {
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
	} = useTerminalState()

	const {
		playTypingSound,
		playButtonSound,
		playCommandSound,
		playSuccessSound,
		playErrorSound,
		playStartupSound,
	} = useSoundEffects()

	const { easterEggCommands, digitalRainMode, isSnowing, isGlitching, checkKonamiCode } =
		useEasterEggs()

	const { commands } = useTerminalCommands({
		soundEnabled,
		setSoundEnabled,
		setLanguage,
		setShowProjects,
		setSelectedProject,
		playSuccessSound,
		playErrorSound,
		playCommandSound,
	})

	const executeCommand = useCallback(
		async (input: string) => {
			if (isProcessing) return

			const trimmedInput = input.trim()
			const lowerInput = trimmedInput.toLowerCase()
			setIsProcessing(true)
			setSuggestions([])

			if (soundEnabled) playCommandSound()

			if (
				trimmedInput &&
				(inputHistory.length === 0 || inputHistory[inputHistory.length - 1] !== trimmedInput)
			) {
				setInputHistory((prev) => [...prev, trimmedInput])
			}
			setHistoryIndex(-1)

			const loadingCommand: Command = {
				input: trimmedInput,
				output: [],
				timestamp: new Date(),
				isLoading: true,
			}

			setCommandHistory((prev) => [...prev, loadingCommand])
			setCurrentInput('')

			const processingTime = Math.random() * 800 + 400
			await new Promise((resolve) => setTimeout(resolve, processingTime))

			setCommandHistory((prev) => prev.slice(0, -1))

			if (lowerInput.startsWith('show project ')) {
				const projectName = trimmedInput.slice(13).trim()
				const output = commands['show project'](projectName)
				setCommandHistory((prev) => [
					...prev,
					{
						input: trimmedInput,
						output,
						timestamp: new Date(),
					},
				])
			} else if (lowerInput === 'back') {
				const output = commands.back(selectedProject, showProjects)
				setCommandHistory((prev) => [
					...prev,
					{
						input: trimmedInput,
						output,
						timestamp: new Date(),
					},
				])
			} else if (lowerInput === 'clear') {
				commands.clear()
				setCommandHistory([])
				setShowProjects(false)
				setSelectedProject(null)
			} else {
				const command = commands[lowerInput as keyof typeof commands] as () => string[]

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
					if (soundEnabled) playErrorSound()
					setCommandHistory((prev) => [
						...prev,
						{
							input: trimmedInput,
							output: terminalText.commands.error.notFound(trimmedInput),
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
		historyIndex,
		setHistoryIndex,
		suggestions,
		setSuggestions,
		soundEnabled,
		playTypingSound,
		playButtonSound,
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
			if (soundEnabled) playButtonSound()
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
			setTimeout(() => playSuccessSound(), 100)
		}
	}, [soundEnabled, playSuccessSound, setSoundEnabled])

	const toggleLanguage = useCallback(() => {
		const newLanguage = language === 'en' ? 'es' : 'en'
		setLanguage(newLanguage)

		if (soundEnabled) {
			setTimeout(() => playButtonSound(), 100)
		}
	}, [language, soundEnabled, playButtonSound, setLanguage])

	const playStartup = useCallback(() => {
		if (soundEnabled) {
			setTimeout(() => playStartupSound(), 1000)
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
		availableCommands: terminalText.commands.available,
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
