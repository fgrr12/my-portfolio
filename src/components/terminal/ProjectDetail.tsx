import { ArrowLeft, Github, Play, ShoppingBag } from 'lucide-react'
import { memo } from 'react'

import { useUi } from '@/i18n'

interface ProjectDetailProps {
	project: Project
	onBack: () => void
}

const STATUS_COLOR: Record<Project['status'], string> = {
	Production: 'var(--green)',
	Beta: 'var(--amber)',
	Development: 'var(--blue)',
}

const LINKS = [
	{ key: 'github', icon: Github, labelKey: 'viewCode' },
	{ key: 'demo', icon: Play, labelKey: 'liveDemo' },
	{ key: 'store', icon: ShoppingBag, labelKey: 'appStore' },
] as const

export const ProjectDetail = memo(function ProjectDetail({ project, onBack }: ProjectDetailProps) {
	const ui = useUi()

	return (
		<article className="max-w-3xl">
			<button
				type="button"
				onClick={onBack}
				className="action mb-5"
				style={{ color: 'var(--fg-dim)' }}
			>
				<ArrowLeft size={13} />
				{ui.backToProjects}
			</button>

			<header className="mb-6">
				<div className="flex items-start justify-between gap-3 mb-2">
					<h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--fg)' }}>
						{project.title}
					</h1>
					<span
						className="chip shrink-0"
						style={{
							color: STATUS_COLOR[project.status],
							borderColor: STATUS_COLOR[project.status],
						}}
					>
						{ui.statusLabels[project.status]}
					</span>
				</div>

				<div className="label-micro mb-4">
					{project.company} · {project.year}
				</div>

				<p className="text-[14px] leading-relaxed" style={{ color: 'var(--fg-dim)' }}>
					{project.fullDescription}
				</p>
			</header>

			{LINKS.some(({ key }) => project[key]) && (
				<div className="flex flex-wrap gap-2 mb-7">
					{LINKS.map(({ key, icon: Icon, labelKey }) =>
						project[key] ? (
							<a
								key={key}
								href={project[key]}
								target="_blank"
								rel="noopener noreferrer"
								className="action"
							>
								<Icon size={13} />
								{ui[labelKey]}
							</a>
						) : null
					)}
				</div>
			)}

			<section className="mb-7">
				<h2 className="label-micro mb-3">{ui.keyFeatures}</h2>
				<ul className="space-y-1.5">
					{project.features.map((feature) => (
						<li
							key={feature}
							className="flex gap-2.5 text-[13px]"
							style={{ color: 'var(--fg-dim)' }}
						>
							<span className="shrink-0" style={{ color: 'var(--purple)' }} aria-hidden="true">
								▸
							</span>
							<span>{feature}</span>
						</li>
					))}
				</ul>
			</section>

			<section>
				<h2 className="label-micro mb-3">{ui.technicalStack}</h2>
				<div className="flex flex-wrap gap-1.5">
					{project.tech.split(',').map((tech) => (
						<span key={tech} className="chip">
							{tech.trim()}
						</span>
					))}
				</div>
			</section>
		</article>
	)
})
