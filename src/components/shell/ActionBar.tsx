import { Download, FolderGit2, Linkedin, Play, Terminal, User, Wrench } from 'lucide-react'

import { useUi } from '@/i18n'

interface ActionBarProps {
	onRun: (command: string) => void
	onRunTour: () => void
	showTour: boolean
	disabled: boolean
}

/**
 * Lives in the app chrome, never inside the terminal viewport. A real terminal's
 * output is only ever output; buttons floating among it were the single loudest
 * tell that this was a web page wearing a terminal costume.
 *
 * Labels are the commands themselves, so clicking teaches the keyboard path.
 */
const ACTIONS = [
	{ command: 'about me', icon: User },
	{ command: 'skills', icon: Wrench },
	{ command: 'show projects', icon: FolderGit2 },
	{ command: 'open contact', icon: Terminal },
	{ command: 'download resume', icon: Download },
	{ command: 'connect', icon: Linkedin },
] as const

export const ActionBar = ({ onRun, onRunTour, showTour, disabled }: ActionBarProps) => {
	const ui = useUi()

	return (
		<div
			className="chrome-bar lg:hidden flex-wrap gap-2 px-3 py-2 border-t"
			style={{ borderColor: 'var(--line)' }}
		>
			{showTour && (
				<button
					type="button"
					className="action"
					data-emphasis="primary"
					onClick={onRunTour}
					disabled={disabled}
				>
					<Play size={13} />
					{ui.tourTitle}
				</button>
			)}

			{ACTIONS.map(({ command, icon: Icon }) => (
				<button
					key={command}
					type="button"
					className="action"
					onClick={() => onRun(command)}
					disabled={disabled}
				>
					<Icon size={13} />
					{command}
				</button>
			))}
		</div>
	)
}
