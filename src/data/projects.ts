import type { Language } from '@/i18n'

interface LocalizedProject {
	title: string
	description: string
	fullDescription: string
	features: string[]
	company: string
}

type ProjectSource = Omit<
	Project,
	'title' | 'description' | 'fullDescription' | 'features' | 'company'
> &
	Record<Language, LocalizedProject>

const projectSources: ProjectSource[] = [
	{
		id: 'earth',
		tech: 'Angular 21, C# .NET 10, EF Core, SQL Server, Avalonia, SignalR, IIS',
		status: 'Production',
		year: '2026 — present',
		en: {
			title: 'Earth — Campus Access Control',
			description:
				'Access control and security platform for corporate campuses: who enters, with which credentials, on what schedule.',
			fullDescription:
				'A security platform that governs movement through corporate campuses — people, visitors, invitations and access cards, plus asset movement between sites, internal transport routes, space reservations and attendance. I built the entire web frontend, co-owned the backend and the database design, and handled the IIS deployment. Guards work from an offline-capable PWA, and a cross-platform handheld app covers checkpoints without a desk.',
			features: [
				'Person, visitor, invitation and access-card management',
				'Asset movement tracking between sites',
				'Internal transport routes and space reservations',
				'Attendance plus role and permission management',
				'Offline-capable PWA for guards and field staff',
				'Cross-platform handheld app for Android, iOS and desktop',
				'Real-time updates over SignalR',
			],
			company: 'Accesos Automáticos',
		},
		es: {
			title: 'Earth — Control de Acceso para Campus',
			description:
				'Plataforma de control de acceso y seguridad para campus corporativos: quién entra, con qué credenciales y en qué horario.',
			fullDescription:
				'Una plataforma de seguridad que gobierna el movimiento dentro de campus corporativos: personas, visitantes, invitaciones y tarjetas de acceso, además de traslado de activos entre sedes, rutas de transporte interno, reserva de espacios y asistencia. Construí todo el frontend web, compartí la propiedad del backend y del diseño de base de datos, y me encargué del despliegue en IIS. Los guardas trabajan desde una PWA que funciona sin conexión, y una app handheld multiplataforma cubre los puntos de control sin escritorio.',
			features: [
				'Gestión de personas, visitantes, invitaciones y tarjetas de acceso',
				'Trazabilidad de traslado de activos entre sedes',
				'Rutas de transporte interno y reserva de espacios',
				'Control de asistencia y gestión de roles y permisos',
				'PWA con soporte offline para guardas y personal de campo',
				'App handheld multiplataforma para Android, iOS y escritorio',
				'Actualizaciones en tiempo real con SignalR',
			],
			company: 'Accesos Automáticos',
		},
	},
	{
		id: 'visit-registry',
		tech: 'Angular, SSR, SignalR, ExcelJS, C# .NET, SQL Server',
		status: 'Production',
		year: '2026',
		en: {
			title: 'Visitor Registry',
			description: 'Second-generation visitor check-in and reporting system for corporate sites.',
			fullDescription:
				'A rebuild of the visitor check-in system used at reception and gate points, with live updates pushed to every screen as people arrive and leave, and exportable reports for security teams. I built the entire frontend, including the server-rendered app and the real-time layer. Delivered and stable.',
			features: [
				'Visitor check-in and check-out with live status',
				'Real-time updates across screens via SignalR',
				'Excel report export for security teams',
				'Server-side rendering for fast first load',
				'Companion handheld app for gate points',
			],
			company: 'Accesos Automáticos',
		},
		es: {
			title: 'Registro de Visitantes',
			description:
				'Segunda generación del sistema de registro de ingresos y reportería para sedes corporativas.',
			fullDescription:
				'Una reconstrucción del sistema de registro de visitantes usado en recepción y en portones, con actualizaciones en vivo en todas las pantallas a medida que la gente entra y sale, y reportes exportables para los equipos de seguridad. Construí todo el frontend, incluida la app renderizada en servidor y la capa de tiempo real. Entregado y estable.',
			features: [
				'Registro de entrada y salida de visitantes con estado en vivo',
				'Actualizaciones en tiempo real entre pantallas con SignalR',
				'Exportación de reportes a Excel para seguridad',
				'Renderizado en servidor para una primera carga rápida',
				'App handheld complementaria para puntos de acceso',
			],
			company: 'Accesos Automáticos',
		},
	},
	{
		id: 'intaco-transportistas',
		tech: 'Blazor WebAssembly, C# .NET 10, Minimal APIs, EF Core, .NET MAUI, SQL Server',
		status: 'Production',
		year: '2025 — 2026',
		en: {
			title: 'INTACO Carrier Registry',
			description:
				'Carrier registration and gate access control, with ID-document scanning on Android.',
			fullDescription:
				'A system for registering transport carriers and controlling their access at dropoff locations. I built the entire Blazor WebAssembly admin portal against a .NET Minimal API. At the gate, an Android app scans ID documents and barcodes so a driver is identified without anyone typing a plate or a licence number. Delivered and stable.',
			features: [
				'Carrier and driver registration',
				'Gate access control at dropoff locations',
				'ID-document and barcode scanning from an Android device',
				'Admin portal running fully in the browser via WebAssembly',
				'Database-first data layer shared between API and frontend',
			],
			company: 'Accesos Automáticos',
		},
		es: {
			title: 'Registro de Transportistas INTACO',
			description:
				'Registro de transportistas y control de acceso en portón, con escaneo de documentos en Android.',
			fullDescription:
				'Un sistema para registrar transportistas y controlar su acceso en los puntos de descarga. Construí todo el portal administrativo en Blazor WebAssembly contra una Minimal API de .NET. En el portón, una app Android escanea documentos de identidad y códigos de barras, así se identifica al chofer sin que nadie tenga que digitar una placa o un número de licencia. Entregado y estable.',
			features: [
				'Registro de transportistas y choferes',
				'Control de acceso en puntos de descarga',
				'Escaneo de documentos de identidad y códigos de barras desde Android',
				'Portal administrativo corriendo entero en el navegador con WebAssembly',
				'Capa de datos database-first compartida entre API y frontend',
			],
			company: 'Accesos Automáticos',
		},
	},
	{
		id: 'lyra',
		tech: 'Tauri v2, Rust, React 19, TypeScript, Tailwind 4',
		status: 'Beta',
		year: '2026',
		en: {
			title: 'Lyra — Synced Lyrics Overlay',
			description:
				'A transparent desktop overlay that reads whatever the OS is playing and shows time-synced lyrics.',
			fullDescription:
				'A native desktop app built with Tauri and Rust. It reads the operating system media session directly, so it works with any player without integrating with one, fetches time-synced lyrics from LRCLIB and floats them borderless and always on top. No account, no API keys. The Rust side handles media detection, screen sampling for contrast, window state and an offline licence check bound to the machine.',
			features: [
				'Transparent, borderless, always-on-top overlay',
				'Reads the OS media session — works with any player',
				'Time-synced lyrics with no login and no API keys',
				'Native Rust backend for media detection and window state',
				'Screen sampling so the overlay stays readable over any background',
				'Offline licence validation bound to the machine',
			],
			company: 'Personal Project',
		},
		es: {
			title: 'Lyra — Overlay de Letras Sincronizadas',
			description:
				'Un overlay de escritorio transparente que lee lo que reproduce el sistema y muestra la letra sincronizada.',
			fullDescription:
				'Una app de escritorio nativa hecha con Tauri y Rust. Lee directo la sesión de medios del sistema operativo, así que funciona con cualquier reproductor sin integrarse con ninguno, trae la letra sincronizada desde LRCLIB y la muestra flotante, sin bordes y siempre encima. Sin cuenta y sin API keys. La parte en Rust maneja la detección de medios, el muestreo de pantalla para el contraste, el estado de la ventana y una validación de licencia offline atada a la máquina.',
			features: [
				'Overlay transparente, sin bordes y siempre encima',
				'Lee la sesión de medios del sistema — sirve con cualquier reproductor',
				'Letras sincronizadas sin login y sin API keys',
				'Backend nativo en Rust para detección de medios y estado de ventana',
				'Muestreo de pantalla para que el overlay sea legible sobre cualquier fondo',
				'Validación de licencia offline atada a la máquina',
			],
			company: 'Proyecto Personal',
		},
	},
	{
		id: 'finance-tracker',
		tech: 'React 19, TypeScript, TanStack Router/Query, Supabase, Python',
		status: 'Production',
		year: '2026',
		en: {
			title: 'Freelance Finance Tracker',
			description:
				'Time tracking, invoicing and expense reporting for freelance work, with a client portal.',
			fullDescription:
				'A tool I built to run my own freelance side: tracked hours roll into clients, projects, payments and expenses, with reports and a portal clients can open themselves. A separate Python toolkit parses Costa Rican Hacienda electronic invoice XMLs so tax records reconcile without manual entry. The tricky logic — Excel date and duration guessing, Monday-based week math, the pre-IVA money rule — is the part covered by tests, because it is the part that fails silently.',
			features: [
				'Time tracking rolled up by client and project',
				'Payments, expenses and reporting',
				'Client portal with its own access',
				'Costa Rican Hacienda e-invoice XML parsing in Python',
				'Tests focused on the logic that fails without complaining',
			],
			company: 'Personal Project',
		},
		es: {
			title: 'Gestor de Finanzas Freelance',
			description:
				'Control de horas, facturación y gastos para trabajo freelance, con portal de clientes.',
			fullDescription:
				'Una herramienta que hice para administrar mi propio trabajo freelance: las horas registradas se agrupan por cliente, proyecto, pagos y gastos, con reportes y un portal que los clientes abren por su cuenta. Un toolkit aparte en Python procesa los XML de factura electrónica de Hacienda de Costa Rica para que los registros fiscales cuadren sin digitar nada. La lógica complicada —adivinar fechas y duraciones de Excel, la matemática de semanas que empiezan en lunes, la regla del monto antes de IVA— es la parte cubierta por tests, porque es la que falla en silencio.',
			features: [
				'Control de horas agrupado por cliente y proyecto',
				'Pagos, gastos y reportería',
				'Portal de clientes con acceso propio',
				'Procesamiento en Python de XML de factura electrónica de Hacienda',
				'Tests enfocados en la lógica que falla sin avisar',
			],
			company: 'Proyecto Personal',
		},
	},
	{
		id: 'chicken-farm',
		tech: 'Expo, React Native, TypeScript, Drizzle, SQLite, Supabase, TanStack Query',
		status: 'Development',
		year: '2026',
		en: {
			title: 'Broiler Farm Management',
			description:
				'Offline-first mobile app for running a broiler chicken farm under an integrator contract.',
			fullDescription:
				'A mobile app for a broiler operation in Costa Rica, with open houses and an integrator contract. Staff record work in places with no signal, so it is offline-first by design: a local SQLite database with Drizzle is the source of truth on the device and reconciles with Supabase when a connection appears.',
			features: [
				'Offline-first — the local database is the source of truth on device',
				'Sync to Supabase Postgres with row-level security',
				'Scheduled jobs with pg_cron and Edge Functions',
				'Push notifications for flock and task reminders',
				'Typed forms validated with Zod',
			],
			company: 'Personal Project',
		},
		es: {
			title: 'Gestión de Granja Avícola',
			description:
				'App móvil offline-first para operar una granja de pollo de engorde con contrato de integradora.',
			fullDescription:
				'Una app móvil para una operación de pollo de engorde en Costa Rica, con galeras abiertas y contrato con integradora. El personal registra el trabajo en lugares sin señal, así que es offline-first por diseño: una base SQLite local con Drizzle es la fuente de verdad en el dispositivo y se reconcilia con Supabase cuando aparece conexión.',
			features: [
				'Offline-first — la base local es la fuente de verdad en el dispositivo',
				'Sincronización con Supabase Postgres y row-level security',
				'Trabajos agendados con pg_cron y Edge Functions',
				'Notificaciones push para recordatorios de lote y tareas',
				'Formularios tipados validados con Zod',
			],
			company: 'Proyecto Personal',
		},
	},
	{
		id: 'cattle-tracker',
		tech: 'React 19, TypeScript, Firebase Functions, Firestore, OpenAI, Zod, PWA',
		status: 'Production',
		github: '',
		demo: '',
		store: '',
		year: '2024 — present',
		en: {
			title: 'Farm Management System',
			description:
				'Multi-tenant livestock platform with a voice assistant that turns spoken updates into structured farm records.',
			fullDescription:
				'A farm management platform I built and run end to end — frontend, backend, database and the AI layer. Field staff record work by speaking: audio is transcribed with Whisper, then a GPT model constrained by a Zod schema turns it into structured actions the app applies, so a farmhand with dirty hands never has to fill in a form. Multi-tenant by farm, role-based access for employees, owners and admins, bilingual end to end, and installable as a PWA with push notifications scheduled through Google Cloud Scheduler.',
			features: [
				'Voice-to-records: Whisper transcription parsed into typed actions with schema-constrained LLM output',
				'Multi-tenant isolation enforced at the query level, not only in security rules',
				'Role-based access for employees, owners and admins',
				'Animal registry, parentage tracking and daily production',
				'Scheduled push notifications with retry and backoff',
				'Offline-capable PWA with a hand-written service worker',
				'Bilingual across frontend and backend, driven by one language field',
			],
			company: 'Personal Project',
		},
		es: {
			title: 'Sistema de Gestión de Finca',
			description:
				'Plataforma ganadera multi-tenant con asistente de voz que convierte lo hablado en registros estructurados.',
			fullDescription:
				'Una plataforma de gestión de finca que construí y mantengo de punta a punta: frontend, backend, base de datos y la capa de IA. El personal de campo registra el trabajo hablando: el audio se transcribe con Whisper y un modelo GPT restringido por un esquema Zod lo convierte en acciones estructuradas que la app aplica, así nadie con las manos sucias tiene que llenar un formulario. Multi-tenant por finca, accesos por rol para empleados, dueños y administradores, bilingüe de punta a punta, e instalable como PWA con notificaciones push agendadas vía Google Cloud Scheduler.',
			features: [
				'Voz a registros: transcripción con Whisper y salida de LLM restringida por esquema',
				'Aislamiento multi-tenant aplicado a nivel de consulta, no solo en reglas de seguridad',
				'Accesos por rol para empleados, dueños y administradores',
				'Registro de animales, parentesco y producción diaria',
				'Notificaciones push agendadas, con reintentos y backoff',
				'PWA con service worker propio y soporte offline',
				'Bilingüe en frontend y backend, desde un solo campo de idioma',
			],
			company: 'Proyecto Personal',
		},
	},
	{
		id: 'condo-finances',
		tech: 'React 19, TypeScript, Express, Firebase Functions, PostgreSQL, Zustand',
		status: 'Production',
		year: '2024',
		en: {
			title: 'Condo Financial Management Microservice',
			description: 'A financial tracking microservice for condominium administration.',
			fullDescription:
				'Developed a new module integrated into an existing condominium management system to allow each condo to track and manage its finances. Designed about 50% of the frontend using React, improved and created key database tables, while collaborating with the team maintaining the Express.js backend.',
			features: [
				'Custom financial dashboards',
				'Dynamic reports and visualizations',
				'Integration with existing condo systems',
				'Table and data management in PostgreSQL',
			],
			company: 'Qubo Systems',
		},
		es: {
			title: 'Microservicio Financiero para Condominios',
			description: 'Un microservicio de control financiero para la administración de condominios.',
			fullDescription:
				'Desarrollé un módulo nuevo integrado a un sistema existente de gestión de condominios para que cada condominio pudiera llevar y administrar sus finanzas. Diseñé cerca del 50% del frontend con React, mejoré y creé tablas clave de la base de datos, en colaboración con el equipo que mantenía el backend en Express.js.',
			features: [
				'Dashboards financieros personalizados',
				'Reportes y visualizaciones dinámicas',
				'Integración con sistemas de condominio existentes',
				'Gestión de tablas y datos en PostgreSQL',
			],
			company: 'Qubo Systems',
		},
	},
	{
		id: 'condo-app-current',
		tech: 'Angular, Nx, Node.js, Express, React Native, Expo, PostgreSQL, Firebase',
		status: 'Production',
		year: '2025 — present',
		en: {
			title: 'Condominium Platform — Ongoing Development',
			description:
				'Continued development of the condominium platform after its owners brought the work in house.',
			fullDescription:
				'The same condominium platform I had worked on years earlier, now maintained and extended by the company that owns it. I contribute across the stack — a substantial share of the frontend plus targeted backend and schema work — on a codebase that has been in production since 2020 and serves real residents daily.',
			features: [
				'Feature work across an Angular Nx admin and a React Native app',
				'Backend and schema changes on a long-lived production system',
				'Resident access management and internal services',
				'Real-time messaging with Firebase',
			],
			company: 'Accesos Automáticos',
		},
		es: {
			title: 'Plataforma de Condominios — Desarrollo Continuo',
			description:
				'Desarrollo continuo de la plataforma de condominios luego de que sus dueños internalizaran el trabajo.',
			fullDescription:
				'La misma plataforma de condominios en la que había trabajado años antes, ahora mantenida y ampliada por la empresa que es dueña del producto. Aporto en todo el stack — una parte importante del frontend más trabajo puntual de backend y de esquema — sobre un código que está en producción desde 2020 y que usan residentes reales todos los días.',
			features: [
				'Desarrollo de funcionalidades sobre un admin en Angular Nx y una app React Native',
				'Cambios de backend y de esquema en un sistema productivo de larga vida',
				'Gestión de accesos de residentes y servicios internos',
				'Mensajería en tiempo real con Firebase',
			],
			company: 'Accesos Automáticos',
		},
	},
	{
		id: 'condo-app',
		tech: 'Angular, Ionic, Express.js, PostgreSQL, Firebase',
		status: 'Production',
		year: '2023 — 2024',
		en: {
			title: 'Condominium Management Platform',
			description: 'A platform for managing condominium permissions and internal services.',
			fullDescription:
				'A system for managing internal processes in condominiums, including permissions, access, equipment rentals, and messaging. Improved database query performance, implemented multi-language support, and enhanced UI/UX across the mobile app (Ionic) and backOffice (Angular). The backend runs on Express.js with data hosted in AWS PostgreSQL.',
			features: [
				'Resident access management',
				'Real-time messaging with Firebase',
				'Multi-language support',
				'Improved backend efficiency',
				'Enhanced mobile and admin UI/UX',
			],
			company: 'Qubo Systems',
		},
		es: {
			title: 'Plataforma de Gestión de Condominios',
			description: 'Una plataforma para administrar permisos y servicios internos de condominios.',
			fullDescription:
				'Un sistema para gestionar procesos internos en condominios, incluyendo permisos, accesos, alquiler de equipos y mensajería. Mejoré el rendimiento de las consultas a la base de datos, implementé soporte multiidioma y trabajé el UI/UX tanto de la app móvil (Ionic) como del backOffice (Angular). El backend corre sobre Express.js con los datos alojados en PostgreSQL en AWS.',
			features: [
				'Gestión de accesos de residentes',
				'Mensajería en tiempo real con Firebase',
				'Soporte multiidioma',
				'Mayor eficiencia del backend',
				'UI/UX mejorada en móvil y administración',
			],
			company: 'Qubo Systems',
		},
	},
	{
		id: 'serena-app',
		tech: 'Angular, React Native, Firebase, Express.js',
		status: 'Production',
		year: '2022',
		en: {
			title: 'Serena: Nanny Service Platform',
			description: 'A mobile and web platform for booking and managing nanny services.',
			fullDescription:
				'Led the development and maintenance of Serena, a nanny service app already in production. Responsible for managing client communication, defining objectives, improving UI/UX for both app and backOffice, enhancing backend performance and security, and implementing Firebase messaging. Supported customer service staff in using the system effectively.',
			features: [
				'Android/iOS app with real-time booking',
				'Admin dashboard with role-based access',
				'Firebase messaging system',
				'Performance and security enhancements',
				'Cross-team collaboration with non-dev users',
			],
			company: 'Qubo Systems',
		},
		es: {
			title: 'Serena: Plataforma de Servicio de Niñeras',
			description: 'Una plataforma móvil y web para reservar y gestionar servicios de niñeras.',
			fullDescription:
				'Lideré el desarrollo y mantenimiento de Serena, una app de servicio de niñeras ya en producción. Me encargué de la comunicación con el cliente, la definición de objetivos, la mejora del UI/UX tanto de la app como del backOffice, el rendimiento y la seguridad del backend, y la implementación de mensajería con Firebase. También acompañé al equipo de atención al cliente en el uso del sistema.',
			features: [
				'App Android/iOS con reservas en tiempo real',
				'Panel administrativo con accesos por rol',
				'Sistema de mensajería con Firebase',
				'Mejoras de rendimiento y seguridad',
				'Colaboración con equipos no técnicos',
			],
			company: 'Qubo Systems',
		},
	},
	{
		id: 'bitbasel',
		tech: 'Next.js, React, Styled Components, Hiro Wallet, Stacks',
		status: 'Production',
		year: '2021 — 2022',
		en: {
			title: 'BitBasel — NFT Marketplace',
			description:
				'An NFT marketplace built on Stacks, with wallet-based identity instead of accounts.',
			fullDescription:
				'A marketplace for listing, buying and selling NFTs, where a Hiro Wallet connection is the identity — there is no signup and no password to lose. I led the development, owned the architecture and supervised a junior developer through the implementation, which meant reviewing their work and pairing on the parts that were new to them.',
			features: [
				'NFT listings, purchases and collection browsing',
				'Wallet-based identity through Hiro Wallet on Stacks',
				'Server-rendered pages for listings that need to be shareable',
				'Architecture owned end to end',
				'Mentoring and code review for a junior developer',
			],
			company: 'CoBuild Lab',
		},
		es: {
			title: 'BitBasel — Marketplace de NFTs',
			description:
				'Un marketplace de NFTs sobre Stacks, con identidad por wallet en vez de cuentas.',
			fullDescription:
				'Un marketplace para publicar, comprar y vender NFTs, donde la conexión con Hiro Wallet es la identidad: no hay registro ni contraseña que perder. Lideré el desarrollo, fui dueño de la arquitectura y supervisé a un desarrollador junior durante la implementación, lo que implicó revisar su trabajo y programar en conjunto las partes que le eran nuevas.',
			features: [
				'Publicación, compra y exploración de colecciones de NFTs',
				'Identidad por wallet mediante Hiro Wallet sobre Stacks',
				'Páginas renderizadas en servidor para que las publicaciones sean compartibles',
				'Arquitectura propia de punta a punta',
				'Mentoría y revisión de código a un desarrollador junior',
			],
			company: 'CoBuild Lab',
		},
	},
]

export const getProjects = (language: Language): Project[] =>
	projectSources.map(({ en, es, ...base }) => ({ ...base, ...(language === 'es' ? es : en) }))
