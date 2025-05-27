import TerminalHeader from './terminalHeader'

interface Project {
	title: string
	description: string
	tech: string
	status: string
}

interface ProjectsTerminalProps {
	projects: Project[]
	onClose: () => void
}

export default function ProjectsTerminal({ projects, onClose }: ProjectsTerminalProps) {
	return (
		<div className="lg:w-1/2 w-full">
			<div className="bg-slate-900 rounded-xl border border-teal-500/40 shadow-2xl shadow-teal-500/20 h-full flex flex-col overflow-hidden terminal-glow pipboy-screen">
				<TerminalHeader
					title="projects@terminal:~"
					subtitle="PROJECT_DB"
					onClose={onClose}
					showCloseButton={true}
				/>

				<div className="flex-1 p-4 overflow-y-auto relative">
					{/* Scanlines effect */}
					<div className="absolute inset-0 pointer-events-none scanlines" />

					<div className="relative z-10">
						<div className="text-teal-300 glow text-lg mb-4 flicker">◆ PROJECT DATABASE ◆</div>

						<div className="space-y-4">
							{projects.map((project, index) => (
								<div
									key={index}
									className="border border-teal-500/50 rounded-xl p-4 hover:bg-teal-400/5 transition-all duration-300 hover:border-teal-400 hover:shadow-lg hover:shadow-teal-500/20 cursor-pointer pipboy-card"
								>
									<div className="flex justify-between items-start mb-2">
										<h3 className="text-lg font-semibold text-teal-300 glow flicker">
											{project.title}
										</h3>
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
									<p className="text-teal-400/80 text-sm leading-relaxed mb-3 flicker">
										{project.description}
									</p>
									<div className="text-teal-500 text-xs">
										<span className="glow flicker">Tech Stack: {project.tech}</span>
									</div>
								</div>
							))}
						</div>

						<div className="mt-6 text-teal-600 text-xs glow flicker">
							◆ {projects.length} projects loaded successfully
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
