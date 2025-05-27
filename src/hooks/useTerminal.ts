import type React from 'react'
import { useCallback, useState } from 'react'

interface Command {
	input: string
	output: string[]
	timestamp: Date
	isLoading?: boolean
}

interface Project {
	title: string
	description: string
	tech: string
	status: string
}

export function useTerminal() {
	const [currentInput, setCurrentInput] = useState('')
	const [commandHistory, setCommandHistory] = useState<Command[]>([])
	const [inputHistory, setInputHistory] = useState<string[]>([])
	const [historyIndex, setHistoryIndex] = useState(-1)
	const [showProjects, setShowProjects] = useState(false)
	const [isProcessing, setIsProcessing] = useState(false)
	const [suggestions, setSuggestions] = useState<string[]>([])

	const projects: Project[] = [
		{
			title: 'Livestock Management System',
			description:
				'A web application designed for managing livestock on farms, built with React and Firebase.',
			tech: 'React, Firebase',
			status: 'Production',
		},
		{
			title: 'Home Maintenance Services Marketplace',
			description:
				'A service for connecting users with home maintenance providers, developed using Angular.',
			tech: 'Angular, TypeScript',
			status: 'Beta',
		},
		{
			title: 'Serena',
			description: 'An innovative project focused on user experience and modern web technologies.',
			tech: 'Next.js, Tailwind CSS',
			status: 'Development',
		},
	]

	const availableCommands = ['show projects', 'about me', 'open contact', 'help', 'clear']

	const commands = {
		'show projects': () => {
			setShowProjects(true)
			return [
				'Initializing project database...',
				'Scanning repositories...',
				'Loading project metadata...',
				'',
				'✓ Found 3 active projects',
				'✓ Project terminal initialized',
				'',
				'Projects displayed in secondary terminal →',
			]
		},
		'about me': () => [
			'Loading developer profile...',
			'',
			'╔══════════════════════════════════════╗',
			'║            DEVELOPER PROFILE         ║',
			'╠══════════════════════════════════════╣',
			'║ Name: Fabricio Rojas                 ║',
			'║ Role: Full Stack Developer           ║',
			'║ Specialization: React, Angular       ║',
			'║ Database: Firebase, PostgreSQL       ║',
			'║ Status: Available                    ║',
			'╚══════════════════════════════════════╝',
			'',
			'💡 Passionate about creating innovative web solutions',
			'🚀 Building the future, one line of code at a time',
			'',
		],
		'open contact': () => [
			'Retrieving contact protocols...',
			'',
			'╔══════════════════════════════════════════════════╗',
			'║                 CONTACT INFORMATION              ║',
			'╠══════════════════════════════════════════════════╣',
			'║ Country: Costa Rica                              ║',
			'║ Email: fgrr12@gmail.com                          ║',
			'║ GitHub: github.com/fgrr12                        ║',
			'║ LinkedIn: linkedin.com/in/fabricio-rojas/        ║',
			'╚══════════════════════════════════════════════════╝',
			'',
			'Feel free to reach out for collaborations!',
			'',
		],
		help: () => [
			'Loading command database...',
			'',
			'╔═══════════════════════════════════════════════════════╗',
			'║                    COMMAND MANUAL                     ║',
			'╠═══════════════════════════════════════════════════════╣',
			'║  COMMAND           │  DESCRIPTION                     ║',
			'║                                                       ║',
			'║  ─────────────────────────────────────────────────    ║',
			'║  show projects     │  Display project portfolio       ║',
			'║  about me          │  Show developer information      ║',
			'║  open contact      │  Display contact details         ║',
			'║  help              │  Show this manual                ║',
			'║  clear             │  Clear terminal screen           ║',
			'║                                                       ║',
			'╠═══════════════════════════════════════════════════════╣',
			'║                    NAVIGATION                         ║',
			'╠═══════════════════════════════════════════════════════╣',
			'║  ↑/↓ arrows        │  Browse command history          ║',
			'║  Tab               │  Auto-complete commands          ║',
			'║  Enter             │  Execute command                 ║',
			'╚═══════════════════════════════════════════════════════╝',
			'',
		],
		clear: () => {
			setCommandHistory([])
			setShowProjects(false)
			return []
		},
	}

	const getCommandSuggestions = useCallback((input: string) => {
		if (!input.trim()) return []
		return availableCommands.filter((cmd) => cmd.toLowerCase().startsWith(input.toLowerCase()))
	}, [])

	const handleTabCompletion = useCallback(() => {
		const matches = getCommandSuggestions(currentInput)

		if (matches.length === 1) {
			setCurrentInput(matches[0])
			setSuggestions([])
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
			}
		}
	}, [currentInput, getCommandSuggestions])

	//biome-ignore lint:ignore commands
	const executeCommand = useCallback(
		async (input: string) => {
			if (isProcessing) return

			const trimmedInput = input.trim().toLowerCase()
			setIsProcessing(true)
			setSuggestions([])

			if (
				trimmedInput &&
				(inputHistory.length === 0 || inputHistory[inputHistory.length - 1] !== trimmedInput)
			) {
				setInputHistory((prev) => [...prev, trimmedInput])
			}
			setHistoryIndex(-1)

			const loadingCommand: Command = {
				input,
				output: [],
				timestamp: new Date(),
				isLoading: true,
			}

			setCommandHistory((prev) => [...prev, loadingCommand])
			setCurrentInput('')

			const processingTime = Math.random() * 800 + 400

			await new Promise((resolve) => setTimeout(resolve, processingTime))

			setCommandHistory((prev) => prev.slice(0, -1))

			const command = commands[trimmedInput as keyof typeof commands]

			if (command) {
				const output = command()
				if (output.length > 0) {
					setCommandHistory((prev) => [
						...prev,
						{
							input,
							output,
							timestamp: new Date(),
						},
					])
				}
			} else if (trimmedInput) {
				setCommandHistory((prev) => [
					...prev,
					{
						input,
						output: [`bash: ${input}: command not found`, "Type 'help' for available commands", ''],
						timestamp: new Date(),
					},
				])
			}

			setIsProcessing(false)
		},
		[isProcessing, inputHistory]
	)

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
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
		[currentInput, isProcessing, inputHistory, historyIndex, executeCommand, handleTabCompletion]
	)

	const handleInputChange = useCallback(
		(value: string) => {
			setCurrentInput(value)
			setHistoryIndex(-1)

			if (value.trim()) {
				const matches = getCommandSuggestions(value)
				setSuggestions(matches.length > 1 ? matches : [])
			} else {
				setSuggestions([])
			}
		},
		[getCommandSuggestions]
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

	const selectSuggestion = useCallback((suggestion: string) => {
		setCurrentInput(suggestion)
		setSuggestions([])
	}, [])

	const closeProjects = useCallback(() => {
		setShowProjects(false)
	}, [])

	return {
		// State
		currentInput,
		commandHistory,
		suggestions,
		isProcessing,
		showProjects,
		projects,
		availableCommands,

		// Handlers
		handleInputChange,
		handleKeyDown,
		handleQuickCommand,
		selectSuggestion,
		closeProjects,
	}
}
