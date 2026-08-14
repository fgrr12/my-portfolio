import { Volume2, VolumeX } from 'lucide-react'

import type { Language, PaneId } from '@/types/ui'

import { useUi } from '@/i18n'

interface StatusLineProps {
	panes: readonly { id: PaneId; label: string }[]
	activePane: PaneId
	onSelectPane: (pane: PaneId) => void
	isProcessing: boolean
	soundEnabled: boolean
	language: Language
	onToggleSound: () => void
	onToggleLanguage: () => void
}

/**
 * tmux's status line, doing tmux's job: it names the session, lists the windows,
 * marks the current one with `*`, and parks machine state on the right. The window
 * list is the primary navigation on mobile, where there is no room for tabs.
 */
export const StatusLine = ({
	panes,
	activePane,
	onSelectPane,
	isProcessing,
	soundEnabled,
	language,
	onToggleSound,
	onToggleLanguage,
}: StatusLineProps) => {
	const ui = useUi()

	return (
		<div className="status-line">
			<div className="status-session">portfolio</div>

			<nav aria-label={ui.panesNav} className="flex items-center h-full overflow-x-auto">
				{panes.map((pane, index) => (
					<button
						key={pane.id}
						type="button"
						className="status-window"
						aria-current={activePane === pane.id}
						onClick={() => onSelectPane(pane.id)}
					>
						{index}:{pane.label}
						{activePane === pane.id ? '*' : ''}
					</button>
				))}
			</nav>

			<div className="ml-auto flex items-center gap-3 pl-3 shrink-0">
				{/* Warp parks the working directory and branch down here rather than in
				    the prompt, which keeps the prompt itself to a single clean line. */}
				<span className="hidden md:flex items-center gap-2">
					<span className="prompt-path">~/portfolio</span>
					<span className="prompt-branch">git:main</span>
				</span>

				<span className="flex items-center gap-1.5">
					<span
						className="w-1.5 h-1.5 rounded-full"
						style={{ background: isProcessing ? 'var(--amber)' : 'var(--green)' }}
					/>
					<span className="hidden sm:inline">
						{isProcessing ? ui.statusProcessing : ui.statusReady}
					</span>
				</span>

				<button
					type="button"
					className="status-window"
					onClick={onToggleSound}
					title={soundEnabled ? ui.soundOn : ui.soundOff}
					aria-label={soundEnabled ? ui.soundOn : ui.soundOff}
				>
					{soundEnabled ? <Volume2 size={12} /> : <VolumeX size={12} />}
				</button>

				<button
					type="button"
					className="status-window"
					onClick={onToggleLanguage}
					title={ui.languageToggle(language.toUpperCase())}
					aria-label={ui.languageToggle(language.toUpperCase())}
				>
					{language.toUpperCase()}
				</button>
			</div>
		</div>
	)
}
