import { memo } from 'react'

import { CommandOutputRenderer } from '@/components/commands/CommandOutputRenderer'
import { LoadingDots } from '@/components/ui/LoadingDots'

interface CommandBlockProps {
	command: Command
}

/**
 * A command and everything it printed are one unit, the way Warp groups them.
 * The coloured rail on the left is the whole point: it makes the grouping legible
 * without borders or cards, and it encodes the outcome, so a failed command is
 * findable by colour before it is read.
 */
export const CommandBlock = memo(function CommandBlock({ command }: CommandBlockProps) {
	const state = command.isLoading ? 'running' : command.failed ? 'failed' : 'done'

	return (
		<div className="block" data-state={state}>
			<div className="flex items-baseline gap-2 text-[13px]">
				<span className="prompt-path shrink-0 hidden sm:inline">~/portfolio</span>
				<span className="prompt-caret shrink-0">❯</span>
				<span className="break-all" style={{ color: 'var(--fg)' }}>
					{command.input}
				</span>
				<time
					className="ml-auto shrink-0 tabular-nums text-[11px] hidden sm:block"
					style={{ color: 'var(--fg-muted)' }}
					dateTime={command.timestamp.toISOString()}
				>
					{command.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
				</time>
			</div>

			{command.isLoading ? (
				<div className="mt-1.5">
					<LoadingDots />
				</div>
			) : (
				command.output.length > 0 && (
					<div className="mt-1.5">
						<CommandOutputRenderer output={command.output} />
					</div>
				)
			)}
		</div>
	)
})
