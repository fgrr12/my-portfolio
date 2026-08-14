import { forwardRef } from 'react'

import { CommandBlock } from '@/components/commands/CommandBlock'

interface CommandHistoryProps {
	commands: Command[]
}

export const CommandHistory = forwardRef<HTMLDivElement, CommandHistoryProps>(
	({ commands }, ref) => {
		return (
			<div ref={ref} className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4">
				{commands.map((command) => (
					<CommandBlock key={command.id} command={command} />
				))}
			</div>
		)
	}
)
