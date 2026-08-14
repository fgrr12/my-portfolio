import { getProjects } from '@/data/projects'
import type { Language } from '@/i18n'

const buildEnglish = () => {
	const list = getProjects('en')
	const available = list.map((project) => `• ${project.id} (${project.title})`)

	return {
		showProjects: {
			success: [
				'Initializing project database...',
				'Scanning repositories...',
				'Loading project metadata...',
				'',
				`✓ Found ${list.length} active projects`,
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
				...available,
				'',
				'Example: show project cattle-tracker',
			],
			notFound: (projectName: string) => [
				`Project "${projectName}" not found.`,
				'',
				'Available projects:',
				...available,
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
				'Interface, projects and content are now in English.',
				"Use 'lang es' to switch back to Spanish.",
			],
			spanish: [
				'🇪🇸 Idioma cambiado a Español',
				'La interfaz, los proyectos y el contenido ahora están en español.',
				"Usá 'lang en' para volver al inglés.",
			],
		},
		download: {
			resume: [
				'Initiating resume download protocol...',
				'',
				'Fetching file from /assets/documents/...',
				'',
				'✅ Resume ready. Opening download in 3... 2... 1...',
				'',
				'Tip: You can also find it in the "contact" section.',
			],
		},
		connect: {
			linkedin: [
				'Initiating LinkedIn connection...',
				'',
				'Fetching user profile...',
				'',
				'✓ LinkedIn profile loaded successfully',
				'✓ Username and profile URL added to contact database',
				'',
				'Tip: You can also find it in the "contact" section.',
			],
		},
		error: {
			notFound: (command: string) => [
				`bash: ${command}: command not found`,
				"Type 'help' for available commands",
				'',
			],
		},
	}
}

const buildSpanish = () => {
	const list = getProjects('es')
	const available = list.map((project) => `• ${project.id} (${project.title})`)

	return {
		showProjects: {
			success: [
				'Inicializando base de datos de proyectos...',
				'Escaneando repositorios...',
				'Cargando metadatos de los proyectos...',
				'',
				`✓ Se encontraron ${list.length} proyectos activos`,
				'✓ Terminal de proyectos inicializado',
				'',
				'Proyectos mostrados en el terminal secundario →',
			],
		},
		showProject: {
			usage: [
				'Uso: show project <nombre>',
				'',
				'Proyectos disponibles:',
				...available,
				'',
				'Ejemplo: show project cattle-tracker',
			],
			notFound: (projectName: string) => [
				`No se encontró el proyecto "${projectName}".`,
				'',
				'Proyectos disponibles:',
				...available,
				'',
				'Probá: show project <nombre>',
			],
			success: (title: string) => [
				`Cargando proyecto: ${title}...`,
				'Obteniendo información detallada...',
				'Inicializando visor de proyectos...',
				'',
				'✓ Proyecto cargado correctamente',
				'✓ Vista detallada activada',
				'',
				'Detalle del proyecto mostrado en el terminal secundario →',
			],
		},
		back: {
			toProjects: ['Volviendo al listado de proyectos...', '✓ De vuelta en la lista'],
			closeProjects: ['Cerrando el terminal de proyectos...', '✓ Terminal de proyectos cerrado'],
			nothing: ['No hay nada a lo que volver.', "Usá 'show projects' para ver los proyectos."],
		},
		sound: {
			on: [
				'🔊 ¡Efectos de sonido activados!',
				'Todos los sonidos del terminal están activos.',
				'También podés usar el ícono de sonido en el panel de control.',
			],
			off: [
				'🔇 Efectos de sonido desactivados.',
				'El terminal está en modo silencioso.',
				'También podés usar el ícono de sonido en el panel de control.',
			],
		},
		language: {
			english: [
				'🇺🇸 Language changed to English',
				'Interface, projects and content are now in English.',
				"Use 'lang es' to switch back to Spanish.",
			],
			spanish: [
				'🇪🇸 Idioma cambiado a Español',
				'La interfaz, los proyectos y el contenido ahora están en español.',
				"Usá 'lang en' para volver al inglés.",
			],
		},
		download: {
			resume: [
				'Iniciando protocolo de descarga del CV...',
				'',
				'Obteniendo archivo desde /assets/documents/...',
				'',
				'✅ CV listo. Abriendo la descarga en 3... 2... 1...',
				'',
				'Tip: También lo encontrás en la sección "contact".',
			],
		},
		connect: {
			linkedin: [
				'Iniciando conexión con LinkedIn...',
				'',
				'Obteniendo perfil...',
				'',
				'✓ Perfil de LinkedIn cargado correctamente',
				'✓ Usuario y URL agregados a la base de contactos',
				'',
				'Tip: También lo encontrás en la sección "contact".',
			],
		},
		error: {
			notFound: (command: string) => [
				`bash: ${command}: no se encontró el comando`,
				"Escribí 'help' para ver los comandos disponibles",
				'',
			],
		},
	}
}

export const terminalMessages: Record<Language, ReturnType<typeof buildEnglish>> = {
	en: buildEnglish(),
	es: buildSpanish(),
}
