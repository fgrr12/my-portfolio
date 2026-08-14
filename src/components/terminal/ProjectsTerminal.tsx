import { memo } from 'react'

import { ProjectDetail } from '@/components/terminal/ProjectDetail'

import type { ProjectsTerminalProps } from '@/types/ui'

import { useUi } from '@/i18n'

const STATUS_COLOR: Record<Project['status'], string> = {
	Production: 'var(--green)',
	Beta: 'var(--amber)',
	Development: 'var(--blue)',
}

const ProjectCard = memo(function ProjectCard({
	project,
	onSelect,
}: {
	project: Project
	onSelect: (project: Project) => void
}) {
	const ui = useUi()

	return (
		<button type="button" onClick={() => onSelect(project)} className="card">
			<div className="flex items-start justify-between gap-3 mb-1.5">
				<h3 className="text-[15px] font-semibold" style={{ color: 'var(--fg)' }}>
					{project.title}
				</h3>
				<span
					className="chip shrink-0"
					style={{ color: STATUS_COLOR[project.status], borderColor: STATUS_COLOR[project.status] }}
				>
					{ui.statusLabels[project.status]}
				</span>
			</div>

			<p className="text-[13px] leading-relaxed mb-3" style={{ color: 'var(--fg-dim)' }}>
				{project.description}
			</p>

			<div className="flex items-center gap-2 text-[11px]" style={{ color: 'var(--fg-muted)' }}>
				<span className="tabular-nums">{project.year}</span>
				<span aria-hidden="true">·</span>
				<span className="truncate">{project.tech}</span>
			</div>
		</button>
	)
})

export const ProjectsTerminal = ({
	projects,
	selectedProject,
	onSelectProject,
	onBackToProjects,
}: ProjectsTerminalProps) => {
	const ui = useUi()

	return (
		<div className="pane h-full">
			<div className="px-3 sm:px-5 py-5 max-w-6xl">
				{selectedProject ? (
					<ProjectDetail project={selectedProject} onBack={onBackToProjects} />
				) : (
					<>
						<div className="label-micro mb-3">
							{ui.projectDatabase} · {projects.length}
						</div>

						<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
							{projects.map((project) => (
								<ProjectCard key={project.id} project={project} onSelect={onSelectProject} />
							))}
						</div>
					</>
				)}
			</div>
		</div>
	)
}
