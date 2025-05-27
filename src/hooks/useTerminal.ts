import type React from 'react'
import { useCallback, useState } from 'react'

interface Command {
	input: string
	output: string[]
	timestamp: Date
	isLoading?: boolean
}

interface Project {
	id: string
	title: string
	description: string
	tech: string
	status: string
	fullDescription: string
	features: string[]
	github?: string
	demo?: string
	store?: string
	images?: string[]
	year: string
}

export const useTerminal = () => {
	const [currentInput, setCurrentInput] = useState('')
	const [commandHistory, setCommandHistory] = useState<Command[]>([])
	const [inputHistory, setInputHistory] = useState<string[]>([])
	const [historyIndex, setHistoryIndex] = useState(-1)
	const [showProjects, setShowProjects] = useState(false)
	const [selectedProject, setSelectedProject] = useState<Project | null>(null)
	const [isProcessing, setIsProcessing] = useState(false)
	const [suggestions, setSuggestions] = useState<string[]>([])

	const projects: Project[] = [
		{
			id: 'livestock',
			title: 'Livestock Management System',
			description:
				'A web application designed for managing livestock on farms, built with React and Firebase.',
			tech: 'React, Firebase',
			status: 'Production',
			fullDescription:
				'A comprehensive livestock management system that helps farmers track their animals, monitor health records, manage breeding cycles, and optimize feed distribution. The system includes real-time analytics and reporting features.',
			features: [
				'Animal tracking and identification',
				'Health record management',
				'Breeding cycle monitoring',
				'Feed optimization algorithms',
				'Real-time analytics dashboard',
				'Mobile-responsive design',
				'Multi-farm support',
			],
			github: 'https://github.com/luk/livestock-management',
			demo: 'https://livestock-demo.luk.dev',
			year: '2023',
		},
		{
			id: 'marketplace',
			title: 'Home Maintenance Services Marketplace',
			description:
				'A service for connecting users with home maintenance providers, developed using Angular.',
			tech: 'Angular, TypeScript',
			status: 'Beta',
			fullDescription:
				'A comprehensive marketplace platform that connects homeowners with verified maintenance service providers. Features include real-time booking, payment processing, review systems, and service tracking.',
			features: [
				'Service provider verification',
				'Real-time booking system',
				'Integrated payment processing',
				'Review and rating system',
				'Service tracking and notifications',
				'Multi-language support',
				'Advanced search and filtering',
			],
			github: 'https://github.com/luk/home-services',
			demo: 'https://homeservices-demo.luk.dev',
			store: 'https://play.google.com/store/apps/homeservices',
			year: '2024',
		},
		{
			id: 'serena',
			title: 'Serena',
			description: 'An innovative project focused on user experience and modern web technologies.',
			tech: 'Next.js, Tailwind CSS',
			status: 'Development',
			fullDescription:
				'Serena is an AI-powered personal assistant web application that helps users organize their daily tasks, schedule meetings, and manage personal projects with intelligent suggestions and automation.',
			features: [
				'AI-powered task suggestions',
				'Smart calendar integration',
				'Voice command support',
				'Cross-platform synchronization',
				'Advanced analytics',
				'Customizable workflows',
				'Third-party integrations',
			],
			github: 'https://github.com/luk/serena',
			demo: 'https://serena-demo.luk.dev',
			year: '2024',
		},
	]

	const availableCommands = [
		'show projects',
		'show project',
		'about me',
		'open contact',
		'help',
		'clear',
		'back',
	]

	const findProjectByName = (name: string): Project | null => {
		const searchTerm = name.toLowerCase()
		return (
			projects.find(
				(project) =>
					project.title.toLowerCase().includes(searchTerm) ||
					project.id.toLowerCase().includes(searchTerm)
			) || null
		)
	}

	const commands = {
		'show projects': () => {
			setShowProjects(true)
			setSelectedProject(null)
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
		'show project': (projectName?: string) => {
			if (!projectName) {
				return [
					'Usage: show project <name>',
					'',
					'Available projects:',
					'• livestock (Livestock Management System)',
					'• marketplace (Home Maintenance Services)',
					'• serena (Serena AI Assistant)',
					'',
					'Example: show project livestock',
				]
			}

			const project = findProjectByName(projectName)
			if (!project) {
				return [
					`Project "${projectName}" not found.`,
					'',
					'Available projects:',
					'• livestock',
					'• marketplace',
					'• serena',
					'',
					'Try: show project <name>',
				]
			}

			setShowProjects(true)
			setSelectedProject(project)
			return [
				`Loading project: ${project.title}...`,
				'Fetching detailed information...',
				'Initializing project viewer...',
				'',
				'✓ Project loaded successfully',
				'✓ Detailed view activated',
				'',
				'Project details displayed in secondary terminal →',
			]
		},
		back: () => {
			if (selectedProject) {
				setSelectedProject(null)
				return ['Returning to projects overview...', '✓ Back to project list']
			}
			if (showProjects) {
				setShowProjects(false)
				return ['Closing projects terminal...', '✓ Projects terminal closed']
			}
			return ['Nothing to go back to.', "Use 'show projects' to view projects."]
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
			'║  COMMAND              │  DESCRIPTION                  ║',
			'║                                                       ║',
			'║  ─────────────────────────────────────────────────    ║',
			'║  show projects        │  Display project portfolio    ║',
			'║  show project <name>  │  View detailed project info   ║',
			'║  about me             │  Show developer information   ║',
			'║  open contact         │  Display contact details      ║',
			'║  back                 │  Go back to previous view     ║',
			'║  help                 │  Show this manual             ║',
			'║  clear                │  Clear terminal screen        ║',
			'║                                                       ║',
			'╠═══════════════════════════════════════════════════════╣',
			'║                    NAVIGATION                         ║',
			'╠═══════════════════════════════════════════════════════╣',
			'║  ↑/↓ arrows           │  Browse command history       ║',
			'║  Tab                  │  Auto-complete commands       ║',
			'║  Enter                │  Execute command              ║',
			'║  Esc                  │  Clear suggestions            ║',
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
			}
			return projects.map((project) => `show project ${project.id}`)
		}

		const matchingCommands = availableCommands.filter((cmd) =>
			cmd.toLowerCase().includes(trimmedInput)
		)

		const wordStartMatches = availableCommands.filter((cmd) => {
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

			const trimmedInput = input.trim()
			const lowerInput = trimmedInput.toLowerCase()
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

			// Handle "show project <name>" command
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
			} else {
				const command = commands[lowerInput as keyof typeof commands]

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
					setCommandHistory((prev) => [
						...prev,
						{
							input: trimmedInput,
							output: [
								`bash: ${trimmedInput}: command not found`,
								"Type 'help' for available commands",
								'',
							],
							timestamp: new Date(),
						},
					])
				}
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
		setSelectedProject(null)
	}, [])

	const selectProject = useCallback((project: Project) => {
		setSelectedProject(project)
	}, [])

	const goBackToProjects = useCallback(() => {
		setSelectedProject(null)
	}, [])

	return {
		// State
		currentInput,
		commandHistory,
		suggestions,
		isProcessing,
		showProjects,
		selectedProject,
		projects,
		availableCommands,

		// Handlers
		handleInputChange,
		handleKeyDown,
		handleQuickCommand,
		selectSuggestion,
		closeProjects,
		selectProject,
		goBackToProjects,
	}
}
