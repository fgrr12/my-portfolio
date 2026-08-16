import type { Language } from '@/i18n'

/**
 * The pet is a miniature terminal window with a face on its screen — the same
 * thing the whole site claims to be, shrunk down to 90 pixels. So it is named
 * like a daemon rather than like a mascot: `tico`, Costa Rican, one syllable,
 * and it reads as a process when you type it at the prompt.
 *
 * Everything it says comes from the same material as the rest of the portfolio:
 * the projects in `projects.ts` and the experience in `cv.ts`. It is a guide to
 * that work, not a decoration with a script of its own — which is why the lines
 * are here, beside the data, and keyed by language like everything else.
 */

/**
 * One glyph per project. The pet shows it on its own screen when a project
 * opens, so the domain lands before the title is read.
 */
export const PROJECT_GLYPHS: Record<string, string> = {
	earth: '🎓',
	'visit-registry': '🛂',
	'intaco-transportistas': '🚚',
	lyra: '🎵',
	'finance-tracker': '🧾',
	'chicken-farm': '🐔',
	'cattle-tracker': '🐄',
	'condo-finances': '💰',
	'condo-app-current': '🏢',
	'condo-app': '🏢',
	'serena-app': '🍼',
	bitbasel: '💎',
	'candid-travel': '✈️',
	'pivot-market': '🏬',
}

export interface CompanionTip {
	text: string
	command: string
}

interface CompanionCopy {
	/** Announced once, a beat after boot. */
	boot: string[]
	/** Unprompted chatter while nobody is typing. */
	idle: string[]
	click: string[]
	pet: string[]
	dizzy: string[]
	drag: string[]
	thinking: string[]
	error: string[]
	wake: string[]
	/** Keyed by the command as typed, lowercased. */
	commands: Record<string, string>
	/** Keyed by `Project['id']`. */
	projects: Record<string, string>
	/** Offered as a clickable bubble — the button runs the real command. */
	tips: CompanionTip[]
	eggs: Record<'rain' | 'snow' | 'glitch' | 'konami', string>
	/** The pet's accessible name — it is a real button. */
	label: string
}

export const companionCopy: Record<Language, CompanionCopy> = {
	en: {
		boot: [
			"tico online. I watch the shell so you don't have to.",
			'tico started. Ask the terminal anything, I will translate.',
			'tico here. Eight years of work in that sidebar — I know all of it.',
		],

		idle: [
			'Two stacks: TypeScript and .NET. They rarely share a CV.',
			'Right now he is building access control for a university campus.',
			'Fourteen projects in that sidebar. All shipped, none invented.',
			'Costa Rica. GMT-6. Remote.',
			'Rust in Lyra, C# at work, TypeScript nearly everywhere else.',
			'Offline-first is not a feature here. There is no signal in a chicken house.',
			'Guards use his PWA at 4am. That is why it works without a network.',
			'He has been shipping since 2017. No restarts.',
			'The farm app listens. You speak, Whisper transcribes, a schema does the rest.',
			'Every project here is something real people opened today.',
		],

		click: [
			'That tickles.',
			'I am a daemon, not a button.',
			'Still running. Zero crashes.',
			"Quack? Wrong pet — try 'rubber duck'.",
			'Poke me again and I get dizzy.',
			"Type 'help'. I will wait.",
			'You can drag me somewhere else, you know.',
		],

		pet: ['Purring at 60 frames per second.', 'Okay, this is nice.', 'Uptime: happy.'],

		dizzy: ['Okay… okay… everything is spinning.', 'I am a process, not a toy. Mostly.'],

		drag: ['Whoa!', 'Put me down. Gently.', 'I float, I do not fly.'],

		thinking: ['Compiling…', 'Fetching…', 'Waiting on the shell.', 'Thinking. Mostly waiting.'],

		error: [
			'bash disagrees.',
			"Not in the manual. Try 'help'.",
			'That command does not exist. Yet.',
		],

		wake: ['I am up, I am up.', 'Back online.'],

		commands: {
			'about me': 'Eight years, two stacks, one person. It is short — read it.',
			skills: 'Look at the AI row. That one runs in production, not in a demo.',
			'show projects': 'Fourteen of them, newest first. Open one and I will tell you about it.',
			'open contact': 'He answers. Usually the same day.',
			'download resume':
				'That PDF is generated from this same data. It cannot disagree with the site.',
			connect: 'LinkedIn is open. Say hello — he replies.',
			help: 'Not every command is on that list. Keep typing.',
			ls: 'A real listing, from a real shell. That is the whole point of this place.',
			pwd: 'Home. His, not yours.',
			whoami: 'You are a guest. He is fabricio.',
			date: 'Time passes. The deploys keep going out.',
			sudo: 'Nice try.',
			exit: "There is no exit from here. Only 'connect'.",
			man: "Try 'help'. I wrote half of it.",
			back: 'Back we go.',
			clear: 'Clean slate.',
			cls: 'Clean slate.',
			'lang es': 'Bilingüe de punta a punta. Igual que la app de la finca.',
			'lang en': 'Bilingual, end to end. Same as the farm app he built.',
			brew: 'Coffee. Costa Rican, obviously.',
			'rubber duck': 'Finally, a colleague.',
			'stack overflow': 'Closed as duplicate. It always is.',
			'dev mode': 'The console is a joke. The projects are not.',
		},

		projects: {
			earth:
				'A whole campus: who enters, with which card, at what hour. The entire frontend is his.',
			'visit-registry': 'Reception, gate, every screen updating live over SignalR.',
			'intaco-transportistas':
				"The Android app scans the driver's ID. Nobody types a plate at the gate.",
			lyra: 'Rust and Tauri. It reads the OS media session, so it works with any player.',
			'finance-tracker': 'He built it to invoice his own clients. The tax XML parser is Python.',
			'chicken-farm': 'No signal in the chicken houses. So the phone is the source of truth.',
			'cattle-tracker':
				'Someone speaks, Whisper listens, a schema turns it into a record. No forms.',
			'condo-finances': 'React embedded inside an Angular back office. Half of that UI is his.',
			'condo-app-current': 'Same platform, years later, still in production. Still his commits.',
			'condo-app': 'Angular, Ionic, Express, Postgres on AWS. The classic quartet.',
			'serena-app': 'He took over an app that was already live, and it stayed live.',
			bitbasel: 'Your wallet is your account. No signup, no password to lose.',
			'candid-travel': 'He joined weeks before launch. Stripe had to work on day one.',
			'pivot-market': 'Bubble on the outside, real endpoints and Cypress tests underneath.',
		},

		tips: [
			{ text: "Try 'skills' — the two-stack table.", command: 'skills' },
			{ text: "'about me' is four paragraphs. I timed it.", command: 'about me' },
			{ text: "'show projects' opens the second window.", command: 'show projects' },
			{ text: "'download resume' hands you the PDF.", command: 'download resume' },
			{ text: "'brew' makes coffee. Sort of.", command: 'brew' },
			{ text: "'snow' — it never snows here, so we simulate it.", command: 'snow' },
			{ text: "'digital rain', if you miss 1999.", command: 'digital rain' },
			{
				text: 'Ask for the cattle one. It is the one he is proud of.',
				command: 'show project cattle-tracker',
			},
		],

		eggs: {
			rain: 'Wake up, Neo…',
			snow: 'Snow. In Costa Rica. Sure.',
			glitch: 'R34l1ty.3x3 st0pp3d w0rk1ng.',
			konami: 'Thirty lives. Spend them on merge conflicts.',
		},

		label: 'tico, the terminal pet — click to talk, drag to move',
	},

	es: {
		boot: [
			'tico en línea. Yo vigilo la shell para que vos no tengás que hacerlo.',
			'tico arrancado. Preguntale lo que sea al terminal, yo traduzco.',
			'tico presente. Ocho años de trabajo en esa barra — me los conozco todos.',
		],

		idle: [
			'Dos stacks: TypeScript y .NET. Rara vez comparten un CV.',
			'Ahora mismo está construyendo control de acceso para un campus universitario.',
			'Catorce proyectos en esa barra. Todos entregados, ninguno inventado.',
			'Costa Rica. GMT-6. Remoto.',
			'Rust en Lyra, C# en el trabajo, TypeScript casi en todo lo demás.',
			'Acá offline-first no es una feature. En una galera no hay señal.',
			'Los guardas usan su PWA a las 4am. Por eso funciona sin red.',
			'Lleva entregando desde 2017. Sin reinicios.',
			'La app de la finca escucha. Usted habla, Whisper transcribe, el esquema hace el resto.',
			'Cada proyecto de acá es algo que gente real abrió hoy.',
		],

		click: [
			'Eso hace cosquillas.',
			'Soy un daemon, no un botón.',
			'Sigo corriendo. Cero caídas.',
			"¿Cuac? Mascota equivocada — probá 'rubber duck'.",
			'Picame otra vez y me mareo.',
			"Escribí 'help'. Yo espero.",
			'Podés arrastrarme a otro lado, por si acaso.',
		],

		pet: ['Ronroneando a 60 cuadros por segundo.', 'Bueno, esto está bien.', 'Uptime: feliz.'],

		dizzy: ['Ya… ya… todo me da vueltas.', 'Soy un proceso, no un juguete. Casi siempre.'],

		drag: ['¡Ey!', 'Bajame. Despacio.', 'Yo floto, no vuelo.'],

		thinking: [
			'Compilando…',
			'Trayendo datos…',
			'Esperando a la shell.',
			'Pensando. Bueno, esperando.',
		],

		error: [
			'bash no está de acuerdo.',
			"Eso no está en el manual. Probá 'help'.",
			'Ese comando no existe. Todavía.',
		],

		wake: ['Ya desperté, ya desperté.', 'De vuelta en línea.'],

		commands: {
			'about me': 'Ocho años, dos stacks, una sola persona. Es corto — leelo.',
			skills: 'Mirá la fila de IA. Esa corre en producción, no en un demo.',
			'show projects': 'Catorce, del más nuevo al más viejo. Abrí uno y te cuento.',
			'open contact': 'Contesta. Casi siempre el mismo día.',
			'download resume': 'Ese PDF se genera de estos mismos datos. No puede contradecir al sitio.',
			connect: 'LinkedIn abierto. Saludalo, sí responde.',
			help: 'No todos los comandos están en esa lista. Seguí escribiendo.',
			ls: 'Un listado de verdad, de una shell de verdad. De eso se trata este lugar.',
			pwd: 'Su casa, no la suya.',
			whoami: 'Usted es un invitado. Él es fabricio.',
			date: 'El tiempo pasa. Los despliegues siguen saliendo.',
			sudo: 'Buen intento.',
			exit: "De aquí no hay salida. Solo 'connect'.",
			man: "Probá 'help'. La mitad la escribí yo.",
			back: 'Nos devolvemos.',
			clear: 'Borrón y cuenta nueva.',
			cls: 'Borrón y cuenta nueva.',
			'lang es': 'Bilingüe de punta a punta. Igual que la app de la finca.',
			'lang en': 'Bilingual, end to end. Same as the farm app he built.',
			brew: 'Café. Costarricense, obviamente.',
			'rubber duck': 'Por fin, un colega.',
			'stack overflow': 'Cerrada por duplicada. Siempre lo es.',
			'dev mode': 'La consola es una broma. Los proyectos no.',
		},

		projects: {
			earth:
				'Un campus entero: quién entra, con cuál tarjeta, a qué hora. Todo el frontend es suyo.',
			'visit-registry': 'Recepción, portón, y cada pantalla actualizándose en vivo con SignalR.',
			'intaco-transportistas':
				'La app Android escanea la cédula del chofer. Nadie digita una placa en el portón.',
			lyra: 'Rust y Tauri. Lee la sesión de medios del sistema, así sirve con cualquier reproductor.',
			'finance-tracker':
				'Lo hizo para facturarle a sus propios clientes. El parser de XML es Python.',
			'chicken-farm': 'En las galeras no hay señal. Por eso el teléfono es la fuente de verdad.',
			'cattle-tracker':
				'Alguien habla, Whisper escucha, un esquema lo vuelve un registro. Sin formularios.',
			'condo-finances': 'React embebido dentro de un back office Angular. Media UI es suya.',
			'condo-app-current':
				'La misma plataforma, años después, todavía en producción. Y sigue aportando.',
			'condo-app': 'Angular, Ionic, Express, Postgres en AWS. El cuarteto clásico.',
			'serena-app': 'Agarró una app que ya estaba viva, y siguió viva.',
			bitbasel: 'Tu wallet es tu cuenta. Sin registro, sin contraseña que perder.',
			'candid-travel': 'Entró semanas antes del lanzamiento. Stripe tenía que servir el día uno.',
			'pivot-market': 'Bubble por fuera, endpoints de verdad y pruebas Cypress por debajo.',
		},

		tips: [
			{ text: "Probá 'skills' — la tabla de los dos stacks.", command: 'skills' },
			{ text: "'about me' son cuatro párrafos. Los conté.", command: 'about me' },
			{ text: "'show projects' abre la segunda ventana.", command: 'show projects' },
			{ text: "'download resume' te entrega el PDF.", command: 'download resume' },
			{ text: "'brew' hace café. Más o menos.", command: 'brew' },
			{ text: "'snow' — acá nunca nieva, así que lo simulamos.", command: 'snow' },
			{ text: "'digital rain', si extrañás 1999.", command: 'digital rain' },
			{
				text: 'Pedí el del ganado. Ese es el que lo enorgullece.',
				command: 'show project cattle-tracker',
			},
		],

		eggs: {
			rain: 'Despertá, Neo…',
			snow: 'Nieve. En Costa Rica. Claro.',
			glitch: 'R34l1d4d.3x3 d3jó d3 funci0n4r.',
			konami: 'Treinta vidas. Gastalas en los merge conflicts.',
		},

		label: 'tico, la mascota del terminal — clic para hablar, arrastrá para moverlo',
	},
}
