import { Search } from 'lucide-react'

import type { PaneId } from '@/types/ui'

import { useUi } from '@/i18n'

interface TitleBarProps {
	panes: readonly { id: PaneId; label: string }[]
	activePane: PaneId
	onSelect: (pane: PaneId) => void
	onOpenPalette: () => void
}

export const TitleBar = ({ panes, activePane, onSelect, onOpenPalette }: TitleBarProps) => {
	const ui = useUi()

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

			<button
				type="button"
				onClick={onOpenPalette}
				className="action ml-auto mr-2 hidden sm:inline-flex"
				style={{ color: 'var(--fg-muted)' }}
			>
				<Search size={12} />
				{ui.paletteHint}
				<kbd
					className="ml-2 px-1.5 py-0.5 rounded text-[10px]"
					style={{ background: 'var(--bg-deep)', color: 'var(--fg-dim)' }}
				>
					⌘K
				</kbd>
			</button>
		</div>
	)
}
