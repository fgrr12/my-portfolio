import { gsap } from 'gsap'
import type React from 'react'
import { memo, useEffect, useRef, useState } from 'react'

import { CommandHistory } from './CommandHistory'
import { CommandInput } from './CommandInput'
import { QuickCommands } from './QuickCommands'
import { StatusBar } from './StatusBar'
import { Suggestions } from './Suggestions'
import { TerminalHeader } from './terminalHeader'
import { WelcomeMessage } from './WelcomeMessage'

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

export const MainTerminal = memo(
	({
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
	}: MainTerminalProps) => {
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

				console.log('Terminal startup animation started')
			}
		}, [hasInitialized])

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

		useEffect(() => {
			const timer = setTimeout(() => {
				const flickerElements = document.querySelectorAll('.flicker')
				if (flickerElements.length > 0) {
					flickerElements.forEach((element) => {
						gsap.to(element, {
							opacity: 1.3,
							textShadow: '0 0 8px currentColor, 0 0 15px currentColor, 0 0 20px currentColor',
							duration: 0.1,
							repeat: -1,
							yoyo: true,
							delay: Math.random() * 4,
							repeatDelay: Math.random() * 3 + 2,
							ease: 'power2.inOut',
						})
					})
					console.log('Flicker effects initialized')
				}
			}, 2000)

			return () => clearTimeout(timer)
		}, [])

		const quickCommands = availableCommands.filter((cmd) => cmd !== 'clear')

		return (
			<div className={`${showProjects ? 'lg:w-1/2' : 'w-full'} transition-all duration-500`}>
				<div
					ref={containerRef}
					className="bg-slate-900 rounded-xl border border-teal-500/40 shadow-2xl shadow-teal-500/20 h-full flex flex-col overflow-hidden terminal-glow pipboy-screen"
				>
					<TerminalHeader title="FabricioR@terminal:~" subtitle="MAIN_TERMINAL" />

					<div className="flex-1 flex flex-col p-4 relative min-h-0">
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
)
