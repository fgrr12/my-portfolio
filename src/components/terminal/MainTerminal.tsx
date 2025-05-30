import { gsap } from 'gsap'
import { memo, useEffect, useRef, useState } from 'react'

import { CommandHistory } from '@/components/commands/CommandHistory'
import { CommandInput } from '@/components/commands/CommandInput'
import { QuickCommands } from '@/components/commands/QuickCommands'
import { Suggestions } from '@/components/suggestions/Suggestions'
import { StatusBar } from '@/components/ui/StatusBar'
import { TerminalHeader } from '@/components/ui/TerminalHeader'
import { WelcomeMessage } from '@/components/ui/WelcomeMessage'

import type { MainTerminalProps } from '@/types/ui'

export const MainTerminal = memo(function MainTerminal({
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
	const containerRef = useRef<HTMLDivElement>(null)
	const [hasInitialized, setHasInitialized] = useState(false)

	useEffect(() => {
		if (!hasInitialized && containerRef.current) {
			setHasInitialized(true)

			gsap.set(containerRef.current, {
				scale: 0.8,
				opacity: 0,
				rotationX: -15,
			})

			const tl = gsap.timeline()

			tl.to(containerRef.current, {
				scale: 1,
				opacity: 1,
				rotationX: 0,
				duration: 1.2,
				ease: 'power3.out',
			})

			tl.to(
				containerRef.current,
				{
					boxShadow: '0 0 50px rgba(20, 184, 166, 0.4), inset 0 0 50px rgba(20, 184, 166, 0.15)',
					duration: 0.8,
					ease: 'power2.inOut',
				},
				'-=0.5'
			)
		}
	}, [hasInitialized])

	// biome-ignore lint:call by commandHistory
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

	return (
		<div className={`${showProjects ? 'lg:w-1/2' : 'w-full'} transition-all duration-500`}>
			<div
				ref={containerRef}
				className="bg-slate-900 rounded-xl border border-teal-500/40 shadow-2xl shadow-teal-500/20 h-full flex flex-col overflow-hidden terminal-glow pipboy-screen"
			>
				<TerminalHeader title="fabricio@terminal:~" subtitle="MAIN_TERMINAL" />

				<div className="flex-1 flex flex-col p-4 relative min-h-0">
					<div className="absolute inset-0 pointer-events-none scanlines" />

					<WelcomeMessage />

					<CommandHistory ref={terminalRef} commands={commandHistory} />

					<div className="relative z-10 flex-shrink-0">
						<Suggestions
							suggestions={suggestions}
							onSelect={onSuggestionSelect}
							inputRef={inputRef as any}
						/>

						<CommandInput
							ref={inputRef}
							value={currentInput}
							onChange={onInputChange}
							onKeyDown={onKeyDown}
							disabled={isProcessing}
							placeholder={isProcessing ? 'Processing...' : 'Type a command...'}
						/>

						<QuickCommands
							commands={availableCommands}
							onExecute={onQuickCommand}
							disabled={isProcessing}
						/>

						<StatusBar isProcessing={isProcessing} />
					</div>
				</div>
			</div>
		</div>
	)
})
