import {
	ChevronDown,
	ChevronRight,
	File,
	FileText,
	Folder,
	FolderOpen,
	Linkedin,
	Play,
} from 'lucide-react'
import { useState } from 'react'

import type { PaneId } from '@/types/ui'

import { useUi } from '@/i18n'

interface FileTreeProps {
	projects: Project[]
	activePane: PaneId
	selectedProjectId: string | null
	onRun: (command: string) => void
	onRunTour: () => void
	showTour: boolean
	disabled: boolean
}

/**
 * The sidebar is a directory listing, not a session list. Warp's own sidebar lists
 * the many working directories *you* have open, which is structure this site does
 * not have — a portfolio has one subject. A file tree, on the other hand, is
 * already true here: these are exactly the entries `ls` prints, and every node maps
 * to a command that exists. Clicking one runs it, so the terminal keeps the trace
 * and the visitor learns the keyboard path.
 */
const FILES = [
	{ name: 'about.md', command: 'about me' },
	{ name: 'skills.md', command: 'skills' },
	{ name: 'contact.md', command: 'open contact' },
] as const

export const FileTree = ({
	projects,
	activePane,
	selectedProjectId,
	onRun,
	onRunTour,
	showTour,
	disabled,
}: FileTreeProps) => {
	const ui = useUi()
	const [expanded, setExpanded] = useState(true)

	const inProjects = activePane === 'projects'

	return (
		<aside
			className="hidden lg:flex flex-col w-60 shrink-0 border-r"
			style={{ background: 'var(--bg-chrome)', borderColor: 'var(--line)' }}
			aria-label={ui.filesNav}
		>
			<div className="label-micro px-3 py-2.5 shrink-0">~/portfolio</div>

			<nav className="flex-1 min-h-0 overflow-y-auto px-2 pb-2">
				{FILES.map(({ name, command }) => (
					<button
						key={name}
						type="button"
						className="tree-row"
						disabled={disabled}
						onClick={() => onRun(command)}
					>
						<FileText size={13} className="tree-icon" />
						{name}
					</button>
				))}

				<button
					type="button"
					className="tree-row"
					disabled={disabled}
					onClick={() => onRun('download resume')}
				>
					<File size={13} className="tree-icon" />
					resume.pdf
				</button>

				{/* Two sibling controls, never nested: the chevron only folds the branch,
				    the label opens the pane. Interactive content inside a button is
				    invalid HTML and unreachable for a screen reader. */}
				<div className="tree-folder" data-active={inProjects && !selectedProjectId}>
					<button
						type="button"
						className="tree-row w-auto px-1"
						aria-expanded={expanded}
						aria-controls="tree-projects"
						aria-label={expanded ? ui.collapse : ui.expand}
						onClick={() => setExpanded((open) => !open)}
					>
						{expanded ? (
							<ChevronDown size={13} className="tree-icon" />
						) : (
							<ChevronRight size={13} className="tree-icon" />
						)}
					</button>

					<button
						type="button"
						className="tree-row flex-1 pl-1"
						aria-current={inProjects && !selectedProjectId}
						disabled={disabled}
						onClick={() => {
							setExpanded(true)
							onRun('show projects')
						}}
					>
						{expanded ? (
							<FolderOpen size={13} className="tree-icon" />
						) : (
							<Folder size={13} className="tree-icon" />
						)}
						projects/
					</button>
				</div>

				<div id="tree-projects" hidden={!expanded}>
					{projects.map((project) => (
						<button
							key={project.id}
							type="button"
							className="tree-row pl-8"
							aria-current={selectedProjectId === project.id}
							disabled={disabled}
							onClick={() => onRun(`show project ${project.id}`)}
							title={project.title}
						>
							<FileText size={13} className="tree-icon" />
							<span className="truncate">{project.id}.md</span>
						</button>
					))}
				</div>
			</nav>

			<div
				className="shrink-0 border-t p-2 flex flex-col gap-1.5"
				style={{ borderColor: 'var(--line)' }}
			>
				{showTour && (
					<button
						type="button"
						className="action justify-center"
						data-emphasis="primary"
						onClick={onRunTour}
						disabled={disabled}
					>
						<Play size={13} />
						{ui.tourTitle}
					</button>
				)}
				<button
					type="button"
					className="action justify-center"
					onClick={() => onRun('connect')}
					disabled={disabled}
				>
					<Linkedin size={13} />
					connect
				</button>
			</div>
		</aside>
	)
}
