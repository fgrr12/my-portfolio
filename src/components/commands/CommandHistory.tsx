import { forwardRef } from 'react'

import { CommandOutputRenderer } from '@/components/commands/CommandOutputRenderer'
import { LoadingDots } from '@/components/ui/LoadingDots'

interface CommandHistoryProps {
	commands: Command[]
}

export const CommandHistory = forwardRef<HTMLDivElement, CommandHistoryProps>(
	({ commands }, ref) => {
		return (
			<div
				ref={ref}
				className="flex-1 overflow-y-auto space-y-2 relative z-10 min-h-0 mb-4 terminal-scroll-area"
				style={{
					height: '100%',
					overflowY: 'auto',
				}}
			>
				<div className="space-y-2 max-w-full max-h-80 sm:max-h-full">
					{commands.map((cmd, index) => (
						<div key={index} className="space-y-1 max-w-full">
							<div className="flex items-center space-x-2">
								<span className="text-teal-400 glow flicker">fabricio:-+</span>
								<span className="text-teal-300 flicker break-all">{cmd.input}</span>
							</div>
							{cmd.isLoading ? (
								<div className="ml-4">
									<LoadingDots />
								</div>
							) : (
								<div className="ml-4 max-w-full overflow-hidden">
									<CommandOutputRenderer output={cmd.output} />
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		)
	}
)
