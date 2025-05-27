import type React from 'react'
import { useEffect, useRef } from 'react'

import CommandHistory from './CommandHistory'
import CommandInput from './CommandInput'
import QuickCommands from './QuickCommands'
import StatusBar from './StatusBar'
import Suggestions from './Suggestions'
import TerminalHeader from './terminalHeader'
import WelcomeMessage from './WelcomeMessage'

interface Command {
	input: string
	output: string[]
	timestamp: Date
	isLoading?: boolean
}

interface MainTerminalProps {
	commandHistory: Command[]
	currentInput: string
	suggestions: string[]
	isProcessing: boolean
	availableCommands: string[]
	onInputChange: (value: string) => void
	onKeyDown: (e: React.KeyboardEvent) => void
	onSuggestionSelect: (suggestion: string) => void
	onQuickCommand: (command: string) => void
	showProjects: boolean
}

export default function MainTerminal({
	commandHistory,
	currentInput,
	suggestions,
	isProcessing,
	availableCommands,
	onInputChange,
	onKeyDown,
	onSuggestionSelect,
	onQuickCommand,
	showProjects,
}: MainTerminalProps) {
	const inputRef = useRef<HTMLInputElement>(null)
	const terminalRef = useRef<HTMLDivElement>(null)

	//biome-ignore lint:call by command history
	useEffect(() => {
		if (terminalRef.current) {
			terminalRef.current.scrollTop = terminalRef.current.scrollHeight
		}
	}, [commandHistory])

	useEffect(() => {
		if (inputRef.current && !isProcessing) {
			inputRef.current.focus()
		}
	}, [isProcessing])

	const quickCommands = availableCommands.filter((cmd) => cmd !== 'clear' && cmd !== 'back')

	return (
		<div className={`${showProjects ? 'lg:w-1/2' : 'w-full'} transition-all duration-500`}>
			<div className="bg-slate-900 rounded-xl border border-teal-500/40 shadow-2xl shadow-teal-500/20 h-full flex flex-col overflow-hidden terminal-glow pipboy-screen">
				<TerminalHeader title="FabricioR@terminal:~" subtitle="MAIN_TERMINAL" />

				<div className="flex-1 flex flex-col p-4 relative min-h-0">
					{/* Scanlines effect */}
					<div className="absolute inset-0 pointer-events-none scanlines" />

					<WelcomeMessage />

					<CommandHistory ref={terminalRef} commands={commandHistory} />

					<div className="relative z-10 flex-shrink-0">
						<Suggestions suggestions={suggestions} onSelect={onSuggestionSelect} />

						<CommandInput
							ref={inputRef}
							value={currentInput}
							onChange={onInputChange}
							onKeyDown={onKeyDown}
							disabled={isProcessing}
							placeholder={isProcessing ? 'Processing...' : 'Type a command...'}
						/>

						<QuickCommands
							commands={quickCommands}
							onExecute={onQuickCommand}
							disabled={isProcessing}
						/>

						<StatusBar isProcessing={isProcessing} />
					</div>
				</div>
			</div>
		</div>
	)
}
