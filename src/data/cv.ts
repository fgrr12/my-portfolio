import type { Language } from '@/i18n'

/**
 * The parts of the CV that are not already somewhere else.
 *
 * Skills come from `terminalContent[lang].skills` and the project list from
 * `getProjects(lang)` — the generator reads those directly, so the PDF can never
 * disagree with the site. Only what has no home yet lives here.
 *
 * ────────────────────────────────────────────────────────────────────────────
 *  STILL MISSING — a CV is not credible without these. Fill them in and re-run
 *  `pnpm cv`; the generator omits any section that is still empty, so a partial
 *  file produces a shorter PDF rather than a wrong one.
 *
 *    · location          where you are, and whether you want remote / relocation
 *    · experience[]      the `role` for each company, the start dates that are
 *                        still blank, and 2-3 highlights each.
 *    · education[]
 *    · languages[]       with level
 * ────────────────────────────────────────────────────────────────────────────
 */

export interface CvRole {
	company: string
	role: string
	/** Free text so "2022" or "Mar 2022" both work. */
	from: string
	/** Empty string reads as "present". */
	to: string
	highlights: string[]
}

export interface CvStudy {
	institution: string
	degree: string
	from: string
	to: string
	/** Anything worth one extra line, e.g. a thesis grade. */
	note?: string
}

export interface CvLanguage {
	name: string
	level: string
}

interface CvData {
	name: string
	title: string
	summary: string
	location: string
	email: string
	github: string
	linkedin: string
	site: string
	experience: CvRole[]
	education: CvStudy[]
	languages: CvLanguage[]
}

const contact = {
	email: 'fgrr12@gmail.com',
	github: 'github.com/fgrr12',
	linkedin: 'linkedin.com/in/fabricio-rojas',
	site: 'fgrr12.github.io/my-portfolio',
}

export const cv: Record<Language, CvData> = {
	en: {
		...contact,
		name: 'Fabricio Rojas',
		title: 'Full Stack Developer',
		summary:
			'Full Stack Developer with 8+ years shipping web and mobile products end to end, across two stacks that rarely appear on the same CV: JavaScript/TypeScript (React, Angular, Node) and .NET (C#, Minimal APIs, EF Core, Blazor, MAUI). Currently building access control platforms for corporate campuses. Also run a livestock platform of my own where a voice assistant turns spoken updates into structured records using Whisper and schema-constrained LLM output.',
		location: 'Costa Rica · Remote',
		experience: [
			{
				company: 'Accesos Automáticos S.A.',
				role: 'Full Stack Developer (contract)',
				from: 'Oct 2025',
				to: '',
				highlights: [
					'Built the entire web frontend for Earth, an access control platform for corporate campuses, and co-owned its backend, database design and IIS deployment.',
					'Delivered the INTACO carrier registry end to end: a Blazor WebAssembly portal over a .NET Minimal API, plus an Android app that scans ID documents at gate points.',
					'Rebuilt the visitor registry frontend with server-side rendering and live updates across screens over SignalR.',
				],
			},
			{
				company: 'Independent',
				role: 'Product Development',
				from: 'Oct 2024',
				to: 'Sep 2025',
				highlights: [
					'Built and shipped a multi-tenant livestock management platform end to end — frontend, backend, database and the AI layer — now running in production on a working farm.',
					'Designed its voice pipeline: spoken updates transcribed with Whisper, then parsed into typed farm actions by a schema-constrained LLM, so field staff never fill in a form.',
				],
			},
			{
				company: 'Qubo Systems',
				role: 'Full Stack Developer',
				from: 'Jul 2022',
				to: 'Sep 2024',
				highlights: [
					'Led ongoing development of Serena, a childcare platform: took full ownership of an existing production application, built Angular and React Native features, improved backend performance and security on Express and Firebase, and added in-app messaging for real-time updates.',
					'Built a finance module as a microservice for a condominium platform — a React interface embedded in an Angular back office, contributing over half of its UI, with PostgreSQL tables designed for per-property financial operations.',
					'Across the wider condominium ecosystem (Angular/Ionic frontends, several Express APIs, Firebase messaging, PostgreSQL on AWS): improved query performance, added internationalisation and shipped features on both the mobile app and the back office.',
				],
			},
			{
				company: 'CoBuild Lab',
				role: 'Full Stack Developer',
				from: 'Sep 2021',
				to: 'Apr 2022',
				highlights: [
					'Led development of BitBasel, an NFT marketplace on Stacks (Next.js, Styled Components, Hiro Wallet), owned its architecture and supervised a junior developer through the implementation.',
					'Built custom endpoints and internal logic for Pivot Market, a published platform for booking retail space in malls, integrating Stripe for payments and Cypress for testing.',
					'Shipped user-facing features for Candid Travel Ventures, a travel booking app for the Texas market, during the final stages before launch (8Base, Next.js, Stripe, Material UI, SendGrid).',
				],
			},
			{
				company: 'GBM as a Service',
				role: 'Frontend Web Developer',
				from: 'Oct 2017',
				to: 'Dec 2020',
				highlights: [
					'Worked in a cross-functional Agile Scrum team of designers, developers, QA, product owners and project managers.',
					'Built an internal resume management system with Angular and Firebase that streamlined CV tracking and staffing for upcoming projects.',
					'Led my graduation thesis inside the company: a KPI dashboard in AngularJS integrating backend services, giving real-time visibility of project performance through interactive charts.',
				],
			},
		],
		education: [
			{
				institution: 'Universidad Invenio',
				degree: 'Licentiate, Business Information and Communication Technologies',
				from: 'Jan 2017',
				to: 'Jul 2021',
				note: 'Thesis grade: 92',
			},
		],
		languages: [
			{ name: 'Spanish', level: 'Native' },
			{ name: 'English', level: 'Professional' },
		],
	},

	es: {
		...contact,
		name: 'Fabricio Rojas',
		title: 'Desarrollador Full Stack',
		summary:
			'Desarrollador Full Stack con más de 8 años entregando productos web y móviles de punta a punta, en dos stacks que rara vez aparecen en el mismo CV: JavaScript/TypeScript (React, Angular, Node) y .NET (C#, Minimal APIs, EF Core, Blazor, MAUI). Actualmente construyendo plataformas de control de acceso para campus corporativos. También mantengo una plataforma ganadera propia donde un asistente de voz convierte lo hablado en registros estructurados usando Whisper y salida de LLM restringida por esquema.',
		location: 'Costa Rica · Remoto',
		experience: [
			{
				company: 'Accesos Automáticos S.A.',
				role: 'Full Stack Developer (contrato)',
				from: 'Oct 2025',
				to: '',
				highlights: [
					'Construí todo el frontend web de Earth, una plataforma de control de acceso para campus corporativos, y compartí la propiedad del backend, el diseño de base de datos y el despliegue en IIS.',
					'Entregué de punta a punta el registro de transportistas de INTACO: portal en Blazor WebAssembly sobre una Minimal API de .NET, más una app Android que escanea documentos de identidad en los portones.',
					'Reconstruí el frontend del registro de visitantes con renderizado en servidor y actualizaciones en vivo entre pantallas vía SignalR.',
				],
			},
			{
				company: 'Independent',
				role: 'Product Development',
				from: 'Oct 2024',
				to: 'Sep 2025',
				highlights: [
					'Built and shipped a multi-tenant livestock management platform end to end — frontend, backend, database and the AI layer — now running in production on a working farm.',
					'Designed its voice pipeline: spoken updates transcribed with Whisper, then parsed into typed farm actions by a schema-constrained LLM, so field staff never fill in a form.',
				],
			},
			{
				company: 'Independiente',
				role: 'Desarrollo de producto propio',
				from: 'Oct 2024',
				to: 'Sep 2025',
				highlights: [
					'Construí y puse en producción una plataforma ganadera multi-tenant de punta a punta —frontend, backend, base de datos y la capa de IA—, hoy en uso en una finca real.',
					'Diseñé su flujo de voz: lo hablado se transcribe con Whisper y un LLM restringido por esquema lo convierte en acciones tipadas, así el personal de campo nunca llena un formulario.',
				],
			},
			{
				company: 'Qubo Systems',
				role: 'Full Stack Developer',
				from: 'Jul 2022',
				to: 'Sep 2024',
				highlights: [
					'Lideré el desarrollo continuo de Serena, una plataforma de cuidado infantil: tomé propiedad total de una aplicación ya en producción, construí funcionalidades en Angular y React Native, mejoré rendimiento y seguridad del backend en Express y Firebase, y agregué mensajería in-app en tiempo real.',
					'Construí un módulo de finanzas como microservicio para una plataforma de condominios: una interfaz React embebida en un back office Angular, aportando más de la mitad de su UI, con tablas PostgreSQL diseñadas para operaciones financieras por propiedad.',
					'En el ecosistema mayor de condominios (frontends Angular/Ionic, varias APIs Express, mensajería Firebase, PostgreSQL en AWS): mejoré el rendimiento de las consultas, agregué internacionalización y entregué funcionalidades en la app móvil y el back office.',
				],
			},
			{
				company: 'CoBuild Lab',
				role: 'Full Stack Developer',
				from: 'Sep 2021',
				to: 'Abr 2022',
				highlights: [
					'Lideré el desarrollo de BitBasel, un marketplace de NFTs sobre Stacks (Next.js, Styled Components, Hiro Wallet), fui dueño de su arquitectura y supervisé a un desarrollador junior durante la implementación.',
					'Construí endpoints y lógica interna para Pivot Market, una plataforma publicada para reservar locales comerciales en centros comerciales, integrando Stripe para pagos y Cypress para pruebas.',
					'Entregué funcionalidades de cara al usuario para Candid Travel Ventures, una app de reservas de viajes para el mercado de Texas, en las etapas finales previas al lanzamiento (8Base, Next.js, Stripe, Material UI, SendGrid).',
				],
			},
			{
				company: 'GBM as a Service',
				role: 'Frontend Web Developer',
				from: 'Oct 2017',
				to: 'Dic 2020',
				highlights: [
					'Trabajé en un equipo ágil multidisciplinario con diseñadores, desarrolladores, QA, product owners y project managers, bajo Scrum.',
					'Construí un sistema interno de gestión de currículums con Angular y Firebase que ordenó el seguimiento de CVs y la asignación de personal a proyectos.',
					'Lideré mi proyecto de tesis dentro de la empresa: un dashboard de KPIs en AngularJS integrado con servicios de backend, que dio visibilidad en tiempo real del desempeño de los proyectos mediante gráficos interactivos.',
				],
			},
		],
		education: [
			{
				institution: 'Universidad Invenio',
				degree: 'Licenciatura en Tecnologías de la Información y Comunicación Empresarial',
				from: 'Ene 2017',
				to: 'Jul 2021',
				note: 'Nota de tesis: 92',
			},
		],
		languages: [
			{ name: 'Español', level: 'Nativo' },
			{ name: 'Inglés', level: 'Profesional' },
		],
	},
}
