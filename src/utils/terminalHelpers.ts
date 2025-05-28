import { COMMANDS, TERMINAL_CONFIG } from '@/constants/terminal'
import { projects } from '@/data/projects'

export const findProjectByName = (name: string): Project | null => {
	const searchTerm = name.toLowerCase()
	return (projects.find(
		(project) =>
			project.title.toLowerCase().includes(searchTerm) ||
			project.id.toLowerCase().includes(searchTerm)
	) || null) as Project
}

export const getAllCommands = (): string[] => {
	return [...COMMANDS.AVAILABLE, ...COMMANDS.HIDDEN, ...COMMANDS.EASTER_EGGS]
}

export const getCommandSuggestions = (input: string): string[] => {
	if (!input.trim()) return []

	const trimmedInput = input.trim().toLowerCase()

	// Handle "show project" command specifically
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

	// General command matching
	const allCommands = getAllCommands()
	const matchingCommands = allCommands.filter((cmd) => cmd.toLowerCase().includes(trimmedInput))
	const wordStartMatches = allCommands.filter((cmd) => {
		const words = cmd.toLowerCase().split(' ')
		return words.some((word) => word.startsWith(trimmedInput))
	})

	return [...new Set([...matchingCommands, ...wordStartMatches])]
}

export const generateProcessingTime = (): number => {
	const { MIN, MAX } = TERMINAL_CONFIG.PROCESSING_TIME
	return Math.random() * (MAX - MIN) + MIN
}

export const shouldPlaySound = (soundEnabled: boolean): boolean => {
	return soundEnabled
}

export const formatTimestamp = (date: Date): string => {
	return date.toLocaleString()
}

export const validateCommand = (command: string): boolean => {
	const allCommands = getAllCommands()
	return (
		allCommands.includes(command.toLowerCase()) || command.toLowerCase().startsWith('show project ')
	)
}
