import { CommandBlock } from '@/components/commands/CommandBlock'

interface CommandHistoryProps {
	commands: Command[]
}

export const CommandHistory = ({ commands }: CommandHistoryProps) => (
	<>
		{commands.map((command) => (
			<CommandBlock key={command.id} command={command} />
		))}
	</>
)
