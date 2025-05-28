import { ArrowLeft, Github, Play, ShoppingBag } from 'lucide-react'
import { memo, useEffect, useRef } from 'react'

import { useGSAPAnimations } from '@/hooks/useGsapAnimations'

interface ProjectDetailProps {
	project: Project
	onBack: () => void
}

export const ProjectDetail = memo(function ProjectDetail({ project, onBack }: ProjectDetailProps) {
	const detailRef: any = useRef<HTMLDivElement>(null)
	const { animateProjectDetail, animateHoverEffect, animateHoverOut } = useGSAPAnimations()

	// biome-ignore lint:call by project id
	useEffect(() => {
		animateProjectDetail(detailRef)
	}, [project.id, animateProjectDetail])

	const handleLinkClick = (url: string) => {
		window.open(url, '_blank', 'noopener,noreferrer')
	}

	const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
		animateHoverEffect(e.currentTarget)
	}

	const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
		animateHoverOut(e.currentTarget)
	}

	return (
		<div ref={detailRef} className="relative z-10">
			<div className="flex items-center justify-between mb-4">
				<button
					type="button"
					onClick={onBack}
					className="flex items-center space-x-2 text-teal-500 hover:text-teal-300 transition-colors glow flicker cursor-pointer"
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<ArrowLeft size={16} />
					<span>Back to Projects</span>
				</button>
				<div className="text-teal-600 text-xs glow flicker">PROJECT_DETAIL</div>
			</div>

			<div className="mb-6">
				<div className="flex items-center justify-between mb-2">
					<h1 className="text-2xl font-bold text-teal-300 glow flicker project-title">
						{project.title}
					</h1>
					<span
						className={`text-xs px-3 py-1 rounded flicker ${
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
				<div className="text-teal-500 text-sm mb-2 glow flicker">
					{project.company} • {project.tech} • {project.year} 
				</div>
				<p className="text-teal-400/90 leading-relaxed glow flicker">{project.fullDescription}</p>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
				{project.github && (
					<button
						type="button"
						onClick={() => handleLinkClick(project.github!)}
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
						className="flex items-center justify-center space-x-2 bg-teal-500/10 border border-teal-500/30 rounded-xl px-4 py-3 hover:bg-teal-500/20 hover:border-teal-400/50 transition-all duration-300 glow flicker action-button  cursor-pointer"
					>
						<Github size={18} />
						<span>View Code</span>
					</button>
				)}
				{project.demo && (
					<button
						type="button"
						onClick={() => handleLinkClick(project.demo!)}
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
						className="flex items-center justify-center space-x-2 bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-3 hover:bg-blue-500/20 hover:border-blue-400/50 transition-all duration-300 glow flicker action-button  cursor-pointer"
					>
						<Play size={18} />
						<span>Live Demo</span>
					</button>
				)}
				{project.store && (
					<button
						type="button"
						onClick={() => handleLinkClick(project.store!)}
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
						className="flex items-center justify-center space-x-2 bg-purple-500/10 border border-purple-500/30 rounded-xl px-4 py-3 hover:bg-purple-500/20 hover:border-purple-400/50 transition-all duration-300 glow flicker action-button  cursor-pointer"
					>
						<ShoppingBag size={18} />
						<span>App Store</span>
					</button>
				)}
			</div>

			<div className="mb-6">
				<h3 className="text-lg font-semibold text-teal-300 mb-3 glow flicker">Key Features</h3>
				<div className="grid grid-cols-1 gap-2">
					{project.features.map((feature, index) => (
						<div
							key={index}
							className="flex items-center space-x-2 text-teal-400/80 glow flicker feature-item"
						>
							<span className="text-teal-500">▸</span>
							<span>{feature}</span>
						</div>
					))}
				</div>
			</div>

			<div className="border rounded-xl border-teal-500/30 p-4 pipboy-card">
				<h3 className="text-lg font-semibold text-teal-300 mb-3 glow flicker">Technical Stack</h3>
				<div className="text-teal-400/80 glow flicker">
					<div className="mb-2">
						<span className="text-teal-500">Technologies:</span> {project.tech}
					</div>
					<div className="mb-2">
						<span className="text-teal-500">Status:</span> {project.status}
					</div>
					<div>
						<span className="text-teal-500">Year:</span> {project.year}
					</div>
				</div>
			</div>

			<div className="mt-6 text-teal-600 text-xs glow flicker">
				◆ Use 'back' command or click the back button to return to projects
			</div>
		</div>
	)
})
