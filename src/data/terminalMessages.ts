import { projects } from './projects'

export const terminalMessages = {
	commands: {
		showProjects: {
			success: [
				'Initializing project database...',
				'Scanning repositories...',
				'Loading project metadata...',
				'',
				`✓ Found ${projects.length} active projects`,
				'✓ Project terminal initialized',
				'',
				'Projects displayed in secondary terminal →',
			],
		},
		showProject: {
			usage: [
				'Usage: show project <name>',
				'',
				'Available projects:',
				...projects.map((project) => `• ${project.id} (${project.title})`),
				'',
				'Example: show project livestock',
			],
			notFound: (projectName: string) => [
				`Project "${projectName}" not found.`,
				'',
				'Available projects:',
				...projects.map((project) => `• ${project.id} (${project.title})`),
				'',
				'Try: show project <name>',
			],
			success: (title: string) => [
				`Loading project: ${title}...`,
				'Fetching detailed information...',
				'Initializing project viewer...',
				'',
				'✓ Project loaded successfully',
				'✓ Detailed view activated',
				'',
				'Project details displayed in secondary terminal →',
			],
		},
		back: {
			toProjects: ['Returning to projects overview...', '✓ Back to project list'],
			closeProjects: ['Closing projects terminal...', '✓ Projects terminal closed'],
			nothing: ['Nothing to go back to.', "Use 'show projects' to view projects."],
		},
		sound: {
			on: [
				'🔊 Sound effects enabled!',
				'All terminal sounds are now active.',
				'You can also use the sound icon in the control panel.',
			],
			off: [
				'🔇 Sound effects disabled.',
				'Terminal is now in silent mode.',
				'You can also use the sound icon in the control panel.',
			],
		},
		language: {
			english: [
				'🇺🇸 Language changed to English',
				'Interface language updated successfully.',
				'Note: Full translation coming soon!',
			],
			spanish: [
				'🇪🇸 Idioma cambiado a Español',
				'Idioma de la interfaz actualizado exitosamente.',
				'Nota: ¡Traducción completa próximamente!',
			],
		},
		error: {
			notFound: (command: string) => [
				`bash: ${command}: command not found`,
				"Type 'help' for available commands",
				'',
			],
		},
	},
} as const
