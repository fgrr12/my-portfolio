import { useCallback } from 'react'
import { projects, type Project } from '../data/projects'
import { useEasterEggs } from './useEasterEggs'
import { terminalText } from '@/data/terminalText'

interface UseTerminalCommandsProps {
	soundEnabled: boolean
	setSoundEnabled: (enabled: boolean) => void
	setLanguage: (lang: 'en' | 'es') => void
	setShowProjects: (show: boolean) => void
	setSelectedProject: (project: Project | null) => void
	playSuccessSound: () => void
	playErrorSound: () => void
	playCommandSound: () => void
}

export function useTerminalCommands({
	soundEnabled,
	setSoundEnabled,
	setLanguage,
	setShowProjects,
	setSelectedProject,
	playSuccessSound,
	playErrorSound,
	playCommandSound,
}: UseTerminalCommandsProps) {
	const { easterEggCommands } = useEasterEggs()

	const findProjectByName = useCallback((name: string): Project | null => {
		const searchTerm = name.toLowerCase()
		return (
			projects.find(
				(project) =>
					project.title.toLowerCase().includes(searchTerm) ||
					project.id.toLowerCase().includes(searchTerm)
			) || null
		)
	}, [])

	const commands = {
		'show projects': () => {
			setShowProjects(true)
			setSelectedProject(null)
			if (soundEnabled) playSuccessSound()
			return terminalText.commands.showProjects.success
		},

		'show project': (projectName?: string) => {
			if (!projectName) {
				return terminalText.commands.showProject.usage
			}

			const project = findProjectByName(projectName)
			if (!project) {
				if (soundEnabled) playErrorSound()
				return terminalText.commands.showProject.notFound(projectName)
			}

			setShowProjects(true)
			setSelectedProject(project)
			if (soundEnabled) playSuccessSound()
			return terminalText.commands.showProject.success(project.title)
		},

		back: (selectedProject: Project | null, showProjects: boolean) => {
			if (selectedProject) {
				setSelectedProject(null)
				if (soundEnabled) playCommandSound()
				return terminalText.commands.back.toProjects
			} else if (showProjects) {
				setShowProjects(false)
				if (soundEnabled) playCommandSound()
				return terminalText.commands.back.closeProjects
			} else {
				if (soundEnabled) playErrorSound()
				return terminalText.commands.back.nothing
			}
		},

		'about me': () => {
			if (soundEnabled) playSuccessSound()
			return terminalText.commands.aboutMe
		},

		'open contact': () => {
			if (soundEnabled) playSuccessSound()
			return terminalText.commands.contact
		},

		help: () => {
			if (soundEnabled) playSuccessSound()
			return terminalText.commands.help
		},

		clear: () => {
			if (soundEnabled) playCommandSound()
			return []
		},

		'sound on': () => {
			setSoundEnabled(true)
			playSuccessSound()
			return terminalText.commands.sound.on
		},

		'sound off': () => {
			setSoundEnabled(false)
			return terminalText.commands.sound.off
		},

		'lang en': () => {
			setLanguage('en')
			if (soundEnabled) playSuccessSound()
			return terminalText.commands.language.eng
		},

		'lang es': () => {
			setLanguage('es')
			if (soundEnabled) playSuccessSound()
			return terminalText.commands.language.spa
		},

		'digital rain': easterEggCommands['digital rain'],
		brew: easterEggCommands.brew,
		snow: easterEggCommands.snow,
		glitch: easterEggCommands.glitch,
		'dev mode': easterEggCommands['dev mode'],
		'rubber duck': easterEggCommands['rubber duck'],
		'stack overflow': easterEggCommands['stack overflow'],
		konami: easterEggCommands.konami,
	}

	return { commands, findProjectByName }
}
