import { CornerDownLeft, FileText, TerminalSquare } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useUi } from '@/i18n'

interface CommandPaletteProps {
	open: boolean
	onClose: () => void
	projects: Project[]
	onRun: (command: string) => void
}

/**
 * Curated on purpose. Easter eggs stay out — listing them would spend the only
 * thing they have — and `show project` with no argument is dropped because every
 * project is offered individually below it.
 */
const PALETTE_COMMANDS = [
	'about me',
	'skills',
	'show projects',
	'open contact',
	'download resume',
	'connect',
	'help',
	'clear',
] as const

export const CommandPalette = ({ open, onClose, projects, onRun }: CommandPaletteProps) => {
	const ui = useUi()
	const dialogRef = useRef<HTMLDialogElement>(null)
	const [query, setQuery] = useState('')
	const [activeIndex, setActiveIndex] = useState(0)

	const options = useMemo(() => {
		const needle = query.trim().toLowerCase()

		const commands = PALETTE_COMMANDS.map((command) => ({
			id: `cmd-${command}`,
			label: command,
			group: ui.paletteCommands,
			command,
		}))

		const projectOptions = projects.map((project) => ({
			id: `project-${project.id}`,
			label: project.title,
			group: ui.paletteProjects,
			command: `show project ${project.id}`,
		}))

		return [...commands, ...projectOptions].filter(
			(option) =>
				!needle ||
				option.label.toLowerCase().includes(needle) ||
				option.command.toLowerCase().includes(needle)
		)
	}, [query, projects, ui])

	// The native dialog gives focus trapping, Esc and top-layer painting for free.
	useEffect(() => {
		const dialog = dialogRef.current
		if (!dialog) return

		if (open && !dialog.open) {
			dialog.showModal()
			setQuery('')
			setActiveIndex(0)
		} else if (!open && dialog.open) {
			dialog.close()
		}
	}, [open])

	const run = (command: string) => {
		onClose()
		onRun(command)
	}

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'ArrowDown') {
			event.preventDefault()
			setActiveIndex((index) => (index + 1) % Math.max(options.length, 1))
		} else if (event.key === 'ArrowUp') {
			event.preventDefault()
			setActiveIndex((index) => (index - 1 + options.length) % Math.max(options.length, 1))
		} else if (event.key === 'Enter') {
			event.preventDefault()
			const option = options[activeIndex]
			if (option) run(option.command)
		}
	}

	let lastGroup = ''

	return (
		<dialog ref={dialogRef} className="palette" onClose={onClose} aria-label={ui.paletteLabel}>
			<input
				type="text"
				className="palette-search"
				placeholder={ui.paletteHint}
				value={query}
				onChange={(event) => {
					setQuery(event.target.value)
					setActiveIndex(0)
				}}
				onKeyDown={handleKeyDown}
				spellCheck={false}
				autoComplete="off"
				aria-label={ui.paletteHint}
				aria-activedescendant={options[activeIndex]?.id}
				aria-controls="palette-list"
			/>

			<div id="palette-list" className="overflow-y-auto py-1.5" style={{ maxHeight: '22rem' }}>
				{options.length === 0 && (
					<p className="px-4 py-3 text-[13px]" style={{ color: 'var(--fg-muted)' }}>
						{ui.paletteEmpty}
					</p>
				)}

				{options.map((option, index) => {
					const showGroup = option.group !== lastGroup
					lastGroup = option.group

					return (
						<div key={option.id}>
							{showGroup && <div className="label-micro px-4 pt-2.5 pb-1">{option.group}</div>}
							<button
								type="button"
								id={option.id}
								className="palette-option"
								data-active={index === activeIndex}
								onMouseMove={() => setActiveIndex(index)}
								onClick={() => run(option.command)}
							>
								{option.group === ui.paletteProjects ? (
									<FileText size={13} style={{ color: 'var(--fg-muted)' }} />
								) : (
									<TerminalSquare size={13} style={{ color: 'var(--fg-muted)' }} />
								)}
								<span className="truncate">{option.label}</span>
								{index === activeIndex && (
									<CornerDownLeft
										size={12}
										className="ml-auto shrink-0"
										style={{ color: 'var(--fg-muted)' }}
									/>
								)}
							</button>
						</div>
					)
				})}
			</div>
		</dialog>
	)
}
