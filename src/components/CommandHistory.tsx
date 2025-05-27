import { forwardRef } from 'react'

import LoadingDots from './LoadingDots'

interface Command {
	input: string
	output: string[]
	timestamp: Date
	isLoading?: boolean
}

interface CommandHistoryProps {
	commands: Command[]
}

const CommandHistory = forwardRef<HTMLDivElement, CommandHistoryProps>(({ commands }, ref) => {
	return (
		<div ref={ref} className="flex-1 overflow-y-auto space-y-2 relative z-10 min-h-0 mb-4">
			{commands.map((cmd, index) => (
				<div key={index} className="space-y-1">
					<div className="flex items-center space-x-2">
						<span className="text-teal-400 glow flicker">FabricioR:-+</span>
						<span className="text-teal-300 flicker">{cmd.input}</span>
					</div>
					{cmd.isLoading ? (
						<div className="ml-4">
							<LoadingDots />
						</div>
					) : (
						cmd.output.map((line, lineIndex) => (
							<div key={lineIndex} className="text-teal-400 ml-4 glow flicker">
								<pre>{line}</pre>
							</div>
						))
					)}
				</div>
			))}
		</div>
	)
})

CommandHistory.displayName = 'CommandHistory'

export default CommandHistory
