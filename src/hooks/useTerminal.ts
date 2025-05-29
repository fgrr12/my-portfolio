import { useCallback, useState } from 'react'

import {
	findProjectByName,
	generateProcessingTime,
	getCommandSuggestions,
	shouldPlaySound,
} from '@/utils/terminalHelpers'

import { useEasterEggs } from '@/hooks/useEasterEggs'
import { useSoundEffects } from '@/hooks/useSoundEffects'

import { COMMANDS, TERMINAL_CONFIG } from '@/constants/terminal'
import { projects } from '@/data/projects'
import { terminalContent } from '@/data/terminalContent'
import { terminalMessages } from '@/data/terminalMessages'

export function useTerminal() {
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

	const soundEffects = useSoundEffects()
	const { easterEggCommands, digitalRainMode, isSnowing, isGlitching, checkKonamiCode } =
		useEasterEggs()
	const {
		playCommandSound,
		playErrorSound,
		playStartupSound,
		playSuccessSound,
		playButtonSound,
		playTypingSound,
	} = soundEffects

	const commands = {
		'show projects': () => {
			setShowProjects(true)
			setSelectedProject(null)
			if (shouldPlaySound(soundEnabled)) playSuccessSound()
			return terminalMessages.commands.showProjects.success
		},

		'show project': (projectName?: string) => {
			if (!projectName) {
				return terminalMessages.commands.showProject.usage
			}

			const project = findProjectByName(projectName)
			if (!project) {
				if (shouldPlaySound(soundEnabled)) playErrorSound()
				return terminalMessages.commands.showProject.notFound(projectName)
			}

			setShowProjects(true)
			setSelectedProject(project)
			if (shouldPlaySound(soundEnabled)) playSuccessSound()
			return terminalMessages.commands.showProject.success(project.title)
		},

		back: () => {
			if (selectedProject) {
				setSelectedProject(null)
				if (shouldPlaySound(soundEnabled)) playCommandSound()
				return terminalMessages.commands.back.toProjects
			}
			if (showProjects) {
				setShowProjects(false)
				if (shouldPlaySound(soundEnabled)) playCommandSound()
				return terminalMessages.commands.back.closeProjects
			}
			if (shouldPlaySound(soundEnabled)) playErrorSound()
			return terminalMessages.commands.back.nothing
		},

		'about me': () => {
			if (shouldPlaySound(soundEnabled)) playSuccessSound()
			return terminalContent.aboutMe
		},

		skills: () => {
			if (shouldPlaySound(soundEnabled)) playSuccessSound()
			return terminalContent.skills
		},

		'open contact': () => {
			if (shouldPlaySound(soundEnabled)) playSuccessSound()
			return terminalContent.contact
		},

		help: () => {
			if (shouldPlaySound(soundEnabled)) playSuccessSound()
			return terminalContent.help
		},

		cls: () => {
			if (shouldPlaySound(soundEnabled)) playCommandSound()
			return []
		},

		'sound on': () => {
			setSoundEnabled(true)
			playSuccessSound()
			return terminalMessages.commands.sound.on
		},

		'sound off': () => {
			setSoundEnabled(false)
			return terminalMessages.commands.sound.off
		},

		'lang en': () => {
			setLanguage('en')
			if (shouldPlaySound(soundEnabled)) playSuccessSound()
			return terminalMessages.commands.language.english
		},

		'lang es': () => {
			setLanguage('es')
			if (shouldPlaySound(soundEnabled)) playSuccessSound()
			return terminalMessages.commands.language.spanish
		},

		'download resume': () => {
			if (shouldPlaySound(soundEnabled)) playSuccessSound()
			return terminalMessages.commands.download.resume
		},

		connect: () => {
			if (shouldPlaySound(soundEnabled)) playSuccessSound()
			return terminalMessages.commands.connect.linkedin
		},

		...easterEggCommands,
	}

	const addCommandToHistory = async (output: string[], input: string) => {
		const timestamp = new Date()
		const baseCommand: Command = {
			input,
			output: [],
			timestamp,
		}

		setCommandHistory((prev) => [...prev, baseCommand])

		for (let i = 0; i < output.length; i++) {
			await new Promise((resolve) => setTimeout(resolve, 150))

			setCommandHistory((prev) => {
				const updated = [...prev]
				const last = { ...updated[updated.length - 1] }
				last.output = [...last.output, output[i]]
				updated[updated.length - 1] = last
				return updated
			})
		}
	}

	// biome-ignore lint:call by commands
	const executeCommand = useCallback(
		async (input: string) => {
			if (isProcessing) return

			const trimmedInput = input.trim()
			const lowerInput = trimmedInput.toLowerCase()
			setIsProcessing(true)
			setSuggestions([])

			if (shouldPlaySound(soundEnabled)) playCommandSound()

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

			const processingTime = generateProcessingTime()
			await new Promise((resolve) => setTimeout(resolve, processingTime))

			setCommandHistory((prev) => prev.slice(0, -1))

			if (lowerInput.startsWith('show project ')) {
				const projectName = trimmedInput.slice(13).trim()
				const output = commands['show project'](projectName)
				addCommandToHistory(output as string[], trimmedInput)
			} else if (lowerInput === 'download resume') {
				const output = commands['download resume']()
				addCommandToHistory(output as readonly string[] as string[], trimmedInput)
				window.open('/my-portfolio/public/assets/documents/CV%20-%20Fabricio%20Rojas.pdf', '_blank')
			} else if (lowerInput === 'connect') {
				const output = commands.connect()
				addCommandToHistory(output as readonly string[] as string[], trimmedInput)
				window.open('https://www.linkedin.com/in/fabricio-rojas', '_blank')
			} else if (lowerInput === 'back') {
				const output = commands.back()
				addCommandToHistory(output as readonly string[] as string[], trimmedInput)
			} else if (lowerInput === 'cls') {
				commands.cls()
				setCommandHistory([])
				setShowProjects(false)
				setSelectedProject(null)
			} else {
				const command = commands[lowerInput as keyof typeof commands]

				if (command) {
					const output = command()
					if (output.length > 0) {
						addCommandToHistory(output as string[], trimmedInput)
					}
				} else if (trimmedInput) {
					if (shouldPlaySound(soundEnabled)) playErrorSound()
					addCommandToHistory(
						terminalMessages.commands.error.notFound(trimmedInput) as string[],
						trimmedInput
					)
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
			commands.back,
			commands['show project'],
		]
	)

	const handleTabCompletion = useCallback(() => {
		const matches = getCommandSuggestions(currentInput)

		if (matches.length === 1) {
			setCurrentInput(matches[0])
			setSuggestions([])
			if (soundEnabled) playButtonSound()
		} else if (matches.length > 1) {
			setSuggestions(matches)

			const commonPrefix = matches.reduce((prefix: any, cmd: any) => {
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
	}, [currentInput, soundEnabled, playButtonSound])

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (checkKonamiCode(e.code)) {
				const output = easterEggCommands.konami()
				setCommandHistory((prev) => [
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
			easterEggCommands.konami,
		]
	)

	const handleInputChange = useCallback(
		(value: string) => {
			setCurrentInput(value)
			setHistoryIndex(-1)

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
		[soundEnabled, playTypingSound, currentInput.length]
	)

	const handleQuickCommand = useCallback(
		async (cmd: string) => {
			if (isProcessing) return
			setCurrentInput(cmd)
			setSuggestions([])
			await executeCommand(cmd)
		},
		[isProcessing, executeCommand]
	)

	const selectSuggestion = useCallback(
		(suggestion: string) => {
			setCurrentInput(suggestion)
			setSuggestions([])
			if (shouldPlaySound(soundEnabled)) playButtonSound()
		},
		[soundEnabled, playButtonSound]
	)

	const closeProjects = useCallback(() => {
		setShowProjects(false)
		setSelectedProject(null)
	}, [])

	const selectProject = useCallback((project: Project) => {
		setSelectedProject(project)
	}, [])

	const goBackToProjects = useCallback(() => {
		setSelectedProject(null)
	}, [])

	const toggleSound = useCallback(() => {
		const newSoundState = !soundEnabled
		setSoundEnabled(newSoundState)

		if (newSoundState) {
			setTimeout(() => playSuccessSound(), TERMINAL_CONFIG.ANIMATION_DELAYS.SOUND_FEEDBACK)
		}
	}, [soundEnabled, playSuccessSound])

	const toggleLanguage = useCallback(() => {
		const newLanguage = language === 'en' ? 'es' : 'en'
		setLanguage(newLanguage)

		if (shouldPlaySound(soundEnabled)) {
			setTimeout(() => playButtonSound(), TERMINAL_CONFIG.ANIMATION_DELAYS.SOUND_FEEDBACK)
		}
	}, [language, soundEnabled, playButtonSound])

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
