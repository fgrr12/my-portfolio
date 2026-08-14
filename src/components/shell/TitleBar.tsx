import type { PaneId } from '@/types/ui'

interface TitleBarProps {
	panes: readonly { id: PaneId; label: string }[]
	activePane: PaneId
	onSelect: (pane: PaneId) => void
}

export const TitleBar = ({ panes, activePane, onSelect }: TitleBarProps) => {
	return (
		<div className="chrome-bar h-9 border-b" style={{ borderColor: 'var(--line)' }}>
			{/* Window controls are decoration here, so they are hidden from assistive
			    tech rather than announced as buttons that do nothing. */}
			<div className="flex items-center gap-2 px-3.5 shrink-0" aria-hidden="true">
				<span className="w-3 h-3 rounded-full" style={{ background: '#f7768e' }} />
				<span className="w-3 h-3 rounded-full" style={{ background: '#e0af68' }} />
				<span className="w-3 h-3 rounded-full" style={{ background: '#9ece6a' }} />
			</div>

			<div role="tablist" aria-label="Terminal panes" className="flex h-full overflow-x-auto">
				{panes.map((pane) => (
					<button
						key={pane.id}
						type="button"
						role="tab"
						aria-selected={activePane === pane.id}
						className="tab"
						onClick={() => onSelect(pane.id)}
					>
						{pane.label}
					</button>
				))}
			</div>

			<div className="label-micro ml-auto pr-3.5 hidden sm:block">fabricio@portfolio</div>
		</div>
	)
}
