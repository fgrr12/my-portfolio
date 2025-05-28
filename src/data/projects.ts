export interface Project {
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

export const projects: Project[] = [
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
