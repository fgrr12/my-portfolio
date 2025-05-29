import { memo, useEffect } from 'react'

import { ProjectDetail } from '@/components/terminal/ProjectDetail'
import { TerminalHeader } from '@/components/ui/TerminalHeader'

import type { ProjectsTerminalProps } from '@/types/ui'

const ProjectCard = memo(function ProjectCard({
	project,
	onSelect,
}: {
	project: Project
	onSelect: (project: Project) => void
}) {
	return (
		<button
			type="button"
			onClick={() => onSelect(project)}
			className="w-full border border-teal-500/50 rounded-xl p-4 hover:bg-teal-400/5 transition-all duration-300 hover:border-teal-400 hover:shadow-lg hover:shadow-teal-500/20 cursor-pointer pipboy-card"
			tabIndex={-1}
		>
			<div className="flex justify-between items-start mb-2">
				<h3 className="text-lg font-semibold text-teal-300 glow flicker">{project.title}</h3>
				<span
					className={`text-xs px-2 py-1 rounded flicker ${
						project.status === 'Production'
							? 'bg-green-500/20 text-green-400'
							: project.status === 'Beta'
								? 'bg-yellow-500/20 text-yellow-400'
								: 'bg-blue-500/20 text-blue-400'
					} glow`}
				>
					{project.status}
				</span>
			</div>
			<p className="text-teal-400/80 text-sm leading-relaxed mb-3 flicker">{project.description}</p>
			<div className="text-teal-500 text-xs">
				<span className="glow flicker">Tech Stack: {project.tech}</span>
			</div>
		</button>
	)
})

export const ProjectsTerminal = ({
	projects,
	selectedProject,
	onClose,
	onSelectProject,
	onBackToProjects,
}: ProjectsTerminalProps) => {
	useEffect(() => {
		const reInitLenis = async () => {
			const Lenis = (await import('lenis')).default
			const terminalArea = document.querySelector('.projects-terminal-scroll')

			if (
				terminalArea instanceof HTMLElement &&
				!terminalArea.hasAttribute('data-lenis-initialized')
			) {
				terminalArea.setAttribute('data-lenis-initialized', 'true')

				const lenis = new Lenis({
					wrapper: terminalArea,
					content: terminalArea.firstElementChild as HTMLElement,
					duration: 1.2,
					easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
					orientation: 'vertical',
					smoothWheel: true,
					syncTouch: false,
					touchMultiplier: 2,
					infinite: false,
				})

				function raf(time: number) {
					lenis.raf(time)
					requestAnimationFrame(raf)
				}

				requestAnimationFrame(raf)
			}
		}

		const timer = setTimeout(reInitLenis, 500)
		return () => clearTimeout(timer)
	}, [])
	return (
		<div className="lg:w-1/2 w-full pb-20 sm:pb-0">
			<div className="bg-slate-900 rounded-xl border border-teal-500/40 shadow-2xl shadow-teal-500/20 h-full flex flex-col overflow-hidden terminal-glow pipboy-screen">
				<TerminalHeader
					title="projects@terminal:~"
					subtitle="PROJECTS_DB"
					onClose={onClose}
					showCloseButton={true}
				/>

				<div className="flex-1 p-4 relative sm:overflow-y-auto">
					<div className="absolute inset-0 pointer-events-none scanlines" />

					{selectedProject ? (
						<ProjectDetail project={selectedProject} onBack={onBackToProjects} />
					) : (
						<div className="relative z-10">
							<div className="text-teal-300 glow text-lg mb-4 flicker">◆ PROJECT DATABASE ◆</div>

							<div className="space-y-4 max-h-120 sm:max-h-full overflow-y-auto sm:overflow-y-hidden">
								{projects.map((project) => (
									<ProjectCard key={project.id} project={project} onSelect={onSelectProject} />
								))}
							</div>

							<div className="mt-6 text-teal-600 text-xs glow flicker">
								◆ {projects.length} projects loaded • Click on a project or use 'show project{' '}
								{'<name>'}'
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
