import { memo, useEffect, useRef } from 'react'

import { CommandHistory } from '@/components/commands/CommandHistory'
import { CommandInput } from '@/components/commands/CommandInput'
import { Suggestions } from '@/components/suggestions/Suggestions'

import type { MainTerminalProps } from '@/types/ui'

import { useUi } from '@/i18n'

/**
 * The terminal viewport, and nothing else. Every affordance that used to live in
 * here — quick commands, the tour button, the status readout — now sits in the app
 * chrome, so what scrolls is only ever what the shell printed.
 *
 * The prompt is part of that scroll, not pinned below it: in a real terminal the
 * cursor sits directly under the last line of output and only reaches the bottom
 * of the window once the scrollback has filled it.
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

	// Clicking anywhere in the viewport puts you back on the prompt, like a terminal.
	// Selecting text or hitting a link is left alone.
	const focusPrompt = (event: React.MouseEvent) => {
		if (window.getSelection()?.toString()) return
		if ((event.target as HTMLElement).closest('a, button')) return
		inputRef.current?.focus()
	}

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: the viewport is not a control — this only forwards stray clicks to the prompt.
		// biome-ignore lint/a11y/useKeyWithClickEvents: pointer shortcut only; the input is already in the tab order and focused on mount.
		<div
			ref={scrollRef}
			onClick={focusPrompt}
			className="h-full overflow-y-auto px-3 sm:px-4 py-3 relative"
		>
			<div className="absolute inset-0 pointer-events-none scanlines" aria-hidden="true" />

			<CommandHistory commands={commandHistory} />

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
	)
})
