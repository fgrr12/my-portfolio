import type { TerminalHeaderProps } from '@/types/ui'

export const TerminalHeader = ({
	title,
	subtitle,
	onClose,
	showCloseButton = false,
}: TerminalHeaderProps) => {
	return (
		<div className="bg-slate-800 px-4 py-2 flex justify-between items-center border-b border-teal-500/30">
			<div className="flex items-center space-x-2">
				{showCloseButton ? (
					<button
						type="button"
						onClick={onClose}
						className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 transition-colors cursor-pointer"
						title="Close terminal"
					/>
				) : (
					<div className="w-3 h-3 bg-red-500 rounded-full" />
				)}
				<div className="w-3 h-3 bg-yellow-500 rounded-full" />
				<div className="w-3 h-3 bg-green-500 rounded-full" />
				<span className="ml-4 text-teal-400 text-sm glow flicker">{title}</span>
			</div>
			<div className="text-teal-500 text-xs glow flicker">{subtitle}</div>
		</div>
	)
}
