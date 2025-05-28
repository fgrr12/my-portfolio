import { findProjectByName, shouldPlaySound } from '@/utils/terminalHelpers'
import { useEasterEggs } from './useEasterEggs'
import { terminalMessages } from '@/data/terminalMessages'
import { terminalContent } from '@/data/terminalContent'

interface UseTerminalCommandsProps {
	soundEnabled: boolean
	setSoundEnabled: (enabled: boolean) => void
	setLanguage: (lang: 'en' | 'es') => void
	setShowProjects: (show: boolean) => void
	setSelectedProject: (project: Project | null) => void
	soundEffects: SoundEffects
}

export const useTerminalCommands = ({
	soundEnabled,
	setSoundEnabled,
	setLanguage,
	setShowProjects,
	setSelectedProject,
	soundEffects,
}: UseTerminalCommandsProps) => {
	const { easterEggCommands } = useEasterEggs()
	const { playSuccessSound, playErrorSound, playCommandSound } = soundEffects

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

		back: (selectedProject: Project | null, showProjects: boolean) => {
			if (selectedProject) {
				setSelectedProject(null)
				if (shouldPlaySound(soundEnabled)) playCommandSound()
				return terminalMessages.commands.back.toProjects
			} else if (showProjects) {
				setShowProjects(false)
				if (shouldPlaySound(soundEnabled)) playCommandSound()
				return terminalMessages.commands.back.closeProjects
			} else {
				if (shouldPlaySound(soundEnabled)) playErrorSound()
				return terminalMessages.commands.back.nothing
			}
		},

		'about me': () => {
			if (shouldPlaySound(soundEnabled)) playSuccessSound()
			return terminalContent.aboutMe
		},

		'open contact': () => {
			if (shouldPlaySound(soundEnabled)) playSuccessSound()
			return terminalContent.contact
		},

		help: () => {
			if (shouldPlaySound(soundEnabled)) playSuccessSound()
			return terminalContent.help
		},

		clear: () => {
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

		...easterEggCommands,
	}

	return { commands }
}
