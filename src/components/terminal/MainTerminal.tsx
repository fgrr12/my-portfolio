import { memo, useEffect, useRef } from 'react'

import { CommandHistory } from '@/components/commands/CommandHistory'
import { CommandInput } from '@/components/commands/CommandInput'
import { Suggestions } from '@/components/suggestions/Suggestions'

import type { MainTerminalProps } from '@/types/ui'

import { useUi } from '@/i18n'

/**
 * The terminal viewport, and nothing else. Every affordance that used to live in
 * here — quick commands, the tour button, the status readout — now sits in the
 * app chrome, so what scrolls is only ever what the shell printed.
 */
export const MainTerminal = memo(function MainTerminal({
	commandHistory,
	currentInput,
	suggestions,
	isProcessing,
	onInputChange,
	onKeyDown,
	onSuggestionSelect,
}: MainTerminalProps) {
	const ui = useUi()
	const inputRef = useRef<HTMLInputElement>(null)
	const scrollRef = useRef<HTMLDivElement>(null)

	// biome-ignore lint:call by commandHistory
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight
		}
	}, [commandHistory])

	useEffect(() => {
		if (inputRef.current && !isProcessing) {
			inputRef.current.focus()
		}
	}, [isProcessing])

	return (
		<div className="flex flex-col h-full min-h-0 relative">
			<div className="absolute inset-0 pointer-events-none scanlines" aria-hidden="true" />

			{commandHistory.length === 0 && (
				<div className="px-3 sm:px-4 pt-4">
					<p className="text-[13px] max-w-md" style={{ color: 'var(--fg-dim)' }}>
						{ui.emptyState}
					</p>
				</div>
			)}

			<CommandHistory ref={scrollRef} commands={commandHistory} />

			<div className="shrink-0 px-3 sm:px-4 pb-3 relative z-10">
				<Suggestions
					suggestions={suggestions}
					onSelect={onSuggestionSelect}
					inputRef={inputRef as React.RefObject<HTMLInputElement>}
				/>

				<CommandInput
					ref={inputRef}
					value={currentInput}
					onChange={onInputChange}
					onKeyDown={onKeyDown}
					disabled={isProcessing}
					placeholder={isProcessing ? ui.inputProcessing : ui.inputPlaceholder}
				/>
			</div>
		</div>
	)
})
