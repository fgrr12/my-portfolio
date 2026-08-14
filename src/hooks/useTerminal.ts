import { useCallback, useEffect, useMemo, useState } from 'react'

import { prefersReducedMotion } from '@/utils/prefersReducedMotion'
import {
	findProjectByName,
	generateProcessingTime,
	getCommandSuggestions,
	shouldPlaySound,
} from '@/utils/terminalHelpers'

import { useEasterEggs } from '@/hooks/useEasterEggs'
import { useSoundEffects } from '@/hooks/useSoundEffects'

import type { PaneId } from '@/types/ui'

import { TERMINAL_CONFIG, TOUR_COMMANDS } from '@/constants/terminal'
import { getProjects } from '@/data/projects'
import { terminalContent } from '@/data/terminalContent'
import { terminalMessages } from '@/data/terminalMessages'
import {
	documentTitles,
	getInitialLanguage,
	getInitialProjectId,
	type Language,
	languageHref,
	persistLanguage,
} from '@/i18n'

export function useTerminal() {
	const [currentInput, setCurrentInput] = useState('')
	const [language, setLanguage] = useState<Language>(getInitialLanguage)

	/**
	 * The login banner is seeded as an ordinary history entry with no input, so it
	 * behaves like everything else the shell printed: it scrolls away as commands
	 * pile up, and `clear` / `cls` / Ctrl+L wipe it. It keeps the language it was
	 * printed in, exactly like the rest of the scrollback.
	 */
	const [commandHistory, setCommandHistory] = useState<Command[]>(() => [
		{
			id: crypto.randomUUID(),
			input: '',
			output: [...terminalContent[language].motd(new Date().toLocaleString())],
			timestamp: new Date(),
		},
	])
	const [inputHistory, setInputHistory] = useState<string[]>([])
	const [historyIndex, setHistoryIndex] = useState(-1)
	// A ?project=<id> link opens straight into that project's detail view.
	const [initialProjectId] = useState(() => {
		const id = getInitialProjectId()
		return id && getProjects('en').some((project) => project.id === id) ? id : null
	})
	const [activePane, setActivePane] = useState<PaneId>(initialProjectId ? 'projects' : 'main')
	const [selectedProjectId, setSelectedProjectId] = useState<string | null>(initialProjectId)
	const [isProcessing, setIsProcessing] = useState(false)
	const [suggestions, setSuggestions] = useState<string[]>([])
	const [soundEnabled, setSoundEnabled] = useState(true)

	// Derived, so switching language re-localises the open project instead of
	// leaving a stale object from the previous language in state.
	const projects = useMemo(() => getProjects(language), [language])
	const selectedProject = projects.find((project) => project.id === selectedProjectId) ?? null
	const content = terminalContent[language]
	const messages = terminalMessages[language]

	const changeLanguage = useCallback((next: Language) => {
		setLanguage(next)
		persistLanguage(next)
	}, [])

	// Single writer for the address bar. Language owns the path and the open project
	// owns the query, so they have to be written together — updating either one on its
	// own would drop the other.
	useEffect(() => {
		const url = languageHref(language) + (selectedProjectId ? `?project=${selectedProjectId}` : '')
		window.history.replaceState(null, '', url)
		document.title = documentTitles[language]
	}, [language, selectedProjectId])

	const soundEffects = useSoundEffects()
	const { easterEggCommands, digitalRainMode, isSnowing, isGlitching, checkKonamiCode } =
		useEasterEggs(soundEnabled)
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
			setActivePane('projects')
			setSelectedProjectId(null)
			if (shouldPlaySound(soundEnabled)) playSuccessSound()
			return messages.showProjects.success
		},

		'show project': (projectName?: string) => {
			if (!projectName) {
				return messages.showProject.usage
			}

			const project = findProjectByName(projectName, language)
			if (!project) {
				if (shouldPlaySound(soundEnabled)) playErrorSound()
				return messages.showProject.notFound(projectName)
			}

			setActivePane('projects')
			setSelectedProjectId(project.id)
			if (shouldPlaySound(soundEnabled)) playSuccessSound()
			return messages.showProject.success(project.title)
		},

		back: () => {
			if (selectedProject) {
				setSelectedProjectId(null)
				if (shouldPlaySound(soundEnabled)) playCommandSound()
				return messages.back.toProjects
			}
			if (activePane === 'projects') {
				setActivePane('main')
				if (shouldPlaySound(soundEnabled)) playCommandSound()
				return messages.back.closeProjects
			}
			if (shouldPlaySound(soundEnabled)) playErrorSound()
			return messages.back.nothing
		},

		'about me': () => {
			if (shouldPlaySound(soundEnabled)) playSuccessSound()
			return content.aboutMe
		},

		skills: () => {
			if (shouldPlaySound(soundEnabled)) playSuccessSound()
			return content.skills
		},

		'open contact': () => {
			if (shouldPlaySound(soundEnabled)) playSuccessSound()
			return content.contact
		},

		help: () => {
			if (shouldPlaySound(soundEnabled)) playSuccessSound()
			return content.help
		},

		cls: () => {
			if (shouldPlaySound(soundEnabled)) playCommandSound()
			return []
		},

		'sound on': () => {
			setSoundEnabled(true)
			playSuccessSound()
			return messages.sound.on
		},

		'sound off': () => {
			setSoundEnabled(false)
			return messages.sound.off
		},

		'lang en': () => {
			changeLanguage('en')
			if (shouldPlaySound(soundEnabled)) playSuccessSound()
			return messages.language.english
		},

		'lang es': () => {
			changeLanguage('es')
			if (shouldPlaySound(soundEnabled)) playSuccessSound()
			return messages.language.spanish
		},

		'download resume': () => {
			if (shouldPlaySound(soundEnabled)) playSuccessSound()
			return messages.download.resume
		},

		connect: () => {
			if (shouldPlaySound(soundEnabled)) playSuccessSound()
			return messages.connect.linkedin
		},

		ls: () => messages.shell.ls,
		pwd: () => messages.shell.pwd,
		whoami: () => messages.shell.whoami,
		date: () => [new Date().toString()],
		man: () => messages.shell.man,
		exit: () => messages.shell.exit,
		sudo: () => {
			if (shouldPlaySound(soundEnabled)) playErrorSound()
			return messages.shell.sudo
		},

		...easterEggCommands,
	}

	const addCommandToHistory = async (output: string[], input: string, failed = false) => {
		const id = crypto.randomUUID()

		setCommandHistory((prev) => [...prev, { id, input, output: [], timestamp: new Date(), failed }])

		// The staggered reveal is decoration; print it all at once when motion is reduced.
		if (prefersReducedMotion()) {
			setCommandHistory((prev) =>
				prev.map((cmd) => (cmd.id === id ? { ...cmd, output: [...output] } : cmd))
			)
			return
		}

		for (const line of output) {
			await new Promise((resolve) => setTimeout(resolve, TERMINAL_CONFIG.LINE_REVEAL))

			setCommandHistory((prev) =>
				prev.map((cmd) => (cmd.id === id ? { ...cmd, output: [...cmd.output, line] } : cmd))
			)
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

			const loadingId = crypto.randomUUID()
			const loadingCommand: Command = {
				id: loadingId,
				input: trimmedInput,
				output: [],
				timestamp: new Date(),
				isLoading: true,
			}

			setCommandHistory((prev) => [...prev, loadingCommand])
			setCurrentInput('')

			const processingTime = generateProcessingTime()
			await new Promise((resolve) => setTimeout(resolve, processingTime))

			setCommandHistory((prev) => prev.filter((cmd) => cmd.id !== loadingId))

			// Resolves once every output line has been revealed. isProcessing is cleared
			// before awaiting it, so typing stays responsive during the reveal, while
			// callers that need to chain commands (runTour) can wait for a clean finish.
			let revealing: Promise<void> = Promise.resolve()

			if (lowerInput.startsWith('show project ')) {
				const projectName = trimmedInput.slice(13).trim()
				const output = commands['show project'](projectName)
				revealing = addCommandToHistory(output as string[], trimmedInput)
			} else if (lowerInput === 'download resume') {
				const output = commands['download resume']()
				revealing = addCommandToHistory(output as readonly string[] as string[], trimmedInput)
				window.open(
					`${import.meta.env.BASE_URL}assets/documents/CV%20-%20Fabricio%20Rojas.pdf`,
					'_blank',
					'noopener,noreferrer'
				)
			} else if (lowerInput === 'connect') {
				const output = commands.connect()
				revealing = addCommandToHistory(output as readonly string[] as string[], trimmedInput)
				window.open('https://www.linkedin.com/in/fabricio-rojas', '_blank', 'noopener,noreferrer')
			} else if (lowerInput === 'back') {
				const output = commands.back()
				revealing = addCommandToHistory(output as readonly string[] as string[], trimmedInput)
			} else if (lowerInput === 'sudo' || lowerInput.startsWith('sudo ')) {
				// Whatever they tried to sudo, the answer is the same.
				const output = commands.sudo()
				revealing = addCommandToHistory(output as readonly string[] as string[], trimmedInput)
			} else if (lowerInput === 'cls' || lowerInput === 'clear') {
				commands.cls()
				setCommandHistory([])
				setActivePane('main')
				setSelectedProjectId(null)
			} else {
				const command = commands[lowerInput as keyof typeof commands]

				if (command) {
					const output = command()
					if (output.length > 0) {
						revealing = addCommandToHistory(output as string[], trimmedInput)
					}
				} else if (trimmedInput) {
					if (shouldPlaySound(soundEnabled)) playErrorSound()
					revealing = addCommandToHistory(
						messages.error.notFound(trimmedInput) as string[],
						trimmedInput,
						true
					)
				}
			}

			setIsProcessing(false)
			await revealing
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
		const matches = getCommandSuggestions(currentInput, language)

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
	}, [currentInput, language, soundEnabled, playButtonSound])

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.ctrlKey && e.key.toLowerCase() === 'l') {
				e.preventDefault()
				setCommandHistory([])
				setSuggestions([])
				return
			}

			if (e.ctrlKey && e.key.toLowerCase() === 'c') {
				// Only interrupt when there is nothing to copy — otherwise the browser's
				// own copy shortcut is what the user meant.
				const input = e.currentTarget as HTMLInputElement
				if (input.selectionStart === input.selectionEnd) {
					e.preventDefault()
					setCommandHistory((prev) => [
						...prev,
						{
							id: crypto.randomUUID(),
							input: `${currentInput}^C`,
							output: [],
							timestamp: new Date(),
						},
					])
					setCurrentInput('')
					setSuggestions([])
					setHistoryIndex(-1)
					return
				}
			}

			if (checkKonamiCode(e.code)) {
				const output = easterEggCommands.konami()
				setCommandHistory((prev) => [
					...prev,
					{
						id: crypto.randomUUID(),
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
			} else if (e.key === 'Tab' && !e.shiftKey) {
				// Shift+Tab is left alone so keyboard users can move focus out of the input.
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
				const matches = getCommandSuggestions(value, language)
				setSuggestions(matches.length > 0 ? matches : [])
			} else {
				setSuggestions([])
			}
		},
		[soundEnabled, language, playTypingSound, currentInput.length]
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

	const runTour = useCallback(async () => {
		for (const cmd of TOUR_COMMANDS) {
			await executeCommand(cmd)
		}
	}, [executeCommand])

	const selectSuggestion = useCallback(
		(suggestion: string) => {
			setCurrentInput(suggestion)
			setSuggestions([])
			if (shouldPlaySound(soundEnabled)) playButtonSound()
		},
		[soundEnabled, playButtonSound]
	)

	const selectProject = useCallback((project: Project) => {
		setSelectedProjectId(project.id)
	}, [])

	const goBackToProjects = useCallback(() => {
		setSelectedProjectId(null)
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
		changeLanguage(newLanguage)

		if (shouldPlaySound(soundEnabled)) {
			setTimeout(() => playButtonSound(), TERMINAL_CONFIG.ANIMATION_DELAYS.SOUND_FEEDBACK)
		}
	}, [language, changeLanguage, soundEnabled, playButtonSound])

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
		activePane,
		selectedProject,
		selectedProjectId,
		projects,
		soundEnabled,
		language,
		digitalRainMode,
		isSnowing,
		isGlitching,

		// Handlers
		handleInputChange,
		handleKeyDown,
		handleQuickCommand,
		runTour,
		selectSuggestion,
		setActivePane,
		selectProject,
		goBackToProjects,
		playStartup,
		toggleSound,
		toggleLanguage,
	}
}
