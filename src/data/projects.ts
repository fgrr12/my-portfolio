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
		id: 'marketplace',
		tech: 'Flutter, React, Express.js, PostgreSQL',
		status: 'Development',
		github: '',
		demo: '',
		store: '',
		year: '2025',
		en: {
			title: 'Home Maintenance Services Marketplace',
			description:
				'A service for connecting users with home maintenance providers, currently in development.',
			fullDescription:
				'A platform designed to connect homeowners with nearby home maintenance service providers. The mobile app is being developed using Flutter, the admin panel with React, and the backend with Express.js and PostgreSQL.',
			features: [
				'Service listing and filtering',
				'Client and provider registration',
				'Real-time service availability',
				'Admin management panel',
				'Secure authentication and session control',
				'Scalable PostgreSQL schema design',
			],
			company: 'Personal Project',
		},
		es: {
			title: 'Marketplace de Servicios para el Hogar',
			description:
				'Un servicio para conectar usuarios con proveedores de mantenimiento del hogar, actualmente en desarrollo.',
			fullDescription:
				'Una plataforma diseñada para conectar a propietarios con proveedores de servicios de mantenimiento del hogar cercanos. La app móvil se desarrolla con Flutter, el panel administrativo con React, y el backend con Express.js y PostgreSQL.',
			features: [
				'Listado y filtrado de servicios',
				'Registro de clientes y proveedores',
				'Disponibilidad de servicios en tiempo real',
				'Panel de administración',
				'Autenticación y control de sesión seguros',
				'Diseño de esquema PostgreSQL escalable',
			],
			company: 'Proyecto Personal',
		},
	},
	{
		id: 'cattle-tracker',
		tech: 'React, Firebase',
		status: 'Production',
		github: '',
		demo: '',
		store: '',
		year: '2024',
		en: {
			title: 'Cattle Tracker & Farm Management',
			description:
				'A responsive farm management system for tracking animals, employees, and productivity.',
			fullDescription:
				'A complete web application developed to manage livestock on a family farm. Includes species classification, production tracking, employee task assignments, and familial relationships among animals. Built to be responsive and user-friendly, with ongoing improvements.',
			features: [
				'Animal registration and categorization',
				'Daily production tracking',
				'Parental relationship tracking',
				'Task management for employees',
				'Responsive UI for mobile and desktop',
				'Real-time updates with Firebase',
				'Multi-species management',
			],
			company: 'Personal Project',
		},
		es: {
			title: 'Gestión de Ganado y Finca',
			description:
				'Un sistema responsivo de gestión de finca para llevar el control de animales, empleados y productividad.',
			fullDescription:
				'Una aplicación web completa desarrollada para gestionar el ganado de una finca familiar. Incluye clasificación por especie, seguimiento de producción, asignación de tareas a empleados y relaciones de parentesco entre animales. Construida para ser responsiva y fácil de usar, con mejoras continuas.',
			features: [
				'Registro y categorización de animales',
				'Seguimiento de producción diaria',
				'Control de relaciones de parentesco',
				'Gestión de tareas para empleados',
				'Interfaz responsiva para móvil y escritorio',
				'Actualizaciones en tiempo real con Firebase',
				'Gestión de múltiples especies',
			],
			company: 'Proyecto Personal',
		},
	},
	{
		id: 'condo-finances',
		tech: 'React, Express.js, PostgreSQL',
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
		id: 'condo-app',
		tech: 'Angular, Ionic, Express.js, PostgreSQL, Firebase',
		status: 'Production',
		year: '2023',
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
		id: 'nft-store',
		tech: 'Bubble.io',
		status: 'Production',
		year: '2022',
		en: {
			title: 'NFT Storefront Platform',
			description: 'A marketplace for buying and selling NFTs.',
			fullDescription:
				'A no-code NFT store developed and led using Bubble.io. Oversaw a small team and directed development across frontend and backend functionalities to enable NFT listings, purchases, and user management. Served as project lead between 2021 and 2022.',
			features: [
				'NFT listings and profiles',
				'User authentication and wallets',
				'Transaction processing',
				'Custom admin tools',
			],
			company: 'CoBuild Lab',
		},
		es: {
			title: 'Plataforma de Tienda NFT',
			description: 'Un marketplace para comprar y vender NFTs.',
			fullDescription:
				'Una tienda de NFTs sin código desarrollada y liderada con Bubble.io. Coordiné un equipo pequeño y dirigí el desarrollo de funcionalidades de frontend y backend para habilitar publicaciones, compras y gestión de usuarios. Fui líder del proyecto entre 2021 y 2022.',
			features: [
				'Publicaciones y perfiles de NFT',
				'Autenticación de usuarios y wallets',
				'Procesamiento de transacciones',
				'Herramientas administrativas a medida',
			],
			company: 'CoBuild Lab',
		},
	},
	{
		id: 'pivot-market',
		tech: 'Bubble.io',
		status: 'Production',
		year: '2021',
		en: {
			title: 'Pivot Market Platform',
			description: 'A platform for renting retail spaces in malls.',
			fullDescription:
				'Developed backend logic and internal functions using Bubble.io for Pivot Market, a platform that facilitates the rental of retail spaces in shopping centers. Created and maintained workflows, endpoints, and data integrations.',
			features: [
				'Custom backend workflows',
				'Business user management',
				'Space listing and filtering',
				'Integration with scheduling APIs',
			],
			company: 'CoBuild Lab',
		},
		es: {
			title: 'Plataforma Pivot Market',
			description: 'Una plataforma para alquilar locales comerciales en centros comerciales.',
			fullDescription:
				'Desarrollé la lógica de backend y las funciones internas con Bubble.io para Pivot Market, una plataforma que facilita el alquiler de locales comerciales en centros comerciales. Creé y mantuve workflows, endpoints e integraciones de datos.',
			features: [
				'Workflows de backend a medida',
				'Gestión de usuarios empresariales',
				'Listado y filtrado de espacios',
				'Integración con APIs de agendamiento',
			],
			company: 'CoBuild Lab',
		},
	},
	{
		id: 'texas-travel',
		tech: 'React, Firebase',
		status: 'Production',
		year: '2021',
		en: {
			title: 'Texas Travel Activity Planner',
			description: 'An app for selecting and paying for activities before traveling.',
			fullDescription:
				'A travel planning platform where users can preselect and pay for tourism activities in Texas before their arrival. Joined the project during mid-to-late stages of development as a developer focused on improving existing components.',
			features: [
				'Activity selection interface',
				'Online payments',
				'Tour and activity scheduling',
				'Responsive mobile design',
			],
			company: 'CoBuild Lab',
		},
		es: {
			title: 'Planificador de Actividades Texas Travel',
			description: 'Una app para elegir y pagar actividades antes de viajar.',
			fullDescription:
				'Una plataforma de planificación de viajes donde los usuarios pueden preseleccionar y pagar actividades turísticas en Texas antes de llegar. Me sumé al proyecto en etapas medias y finales del desarrollo, enfocado en mejorar componentes existentes.',
			features: [
				'Interfaz de selección de actividades',
				'Pagos en línea',
				'Agendamiento de tours y actividades',
				'Diseño responsivo para móvil',
			],
			company: 'CoBuild Lab',
		},
	},
]

export const getProjects = (language: Language): Project[] =>
	projectSources.map(({ en, es, ...base }) => ({ ...base, ...(language === 'es' ? es : en) }))
