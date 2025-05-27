interface QuickCommandsProps {
	commands: string[]
	onExecute: (command: string) => void
	disabled: boolean
}

export default function QuickCommands({ commands, onExecute, disabled }: QuickCommandsProps) {
	return (
		<div className="text-sm mb-4">
			<div className="text-teal-600 mb-2 glow flicker">◆ Quick commands:</div>
			<div className="grid grid-cols-2 gap-2">
				{commands.map((cmd) => (
					<button
						type="button"
						key={cmd}
						onClick={() => onExecute(cmd)}
						disabled={disabled}
						className="text-left text-teal-500 hover:text-teal-300 hover:bg-teal-400/10 px-2 py-2 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed glow flicker cursor-pointer"
					>
						▸ {cmd}
					</button>
				))}
			</div>
		</div>
	)
}
