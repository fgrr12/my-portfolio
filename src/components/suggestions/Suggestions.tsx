import { useEffect, useRef } from 'react'

import type { SuggestionsProps } from '@/types/ui'

export const Suggestions = ({ suggestions, onSelect, inputRef }: SuggestionsProps) => {
	const suggestionsRef = useRef<HTMLDivElement>(null)

	const handleSelect = (suggestion: string) => {
		onSelect(suggestion)

		setTimeout(() => {
			if (inputRef?.current) {
				inputRef.current.focus()
				const length = suggestion.length
				inputRef.current.setSelectionRange(length, length)
			}
		}, 0)
	}

	//biome-ignore lint:call by suggestions
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!suggestionsRef.current || suggestions.length === 0) return

			const buttons = suggestionsRef.current.querySelectorAll('button')
			const focusedElement = document.activeElement as HTMLElement
			const currentIndex = Array.from(buttons).indexOf(focusedElement as HTMLButtonElement)

			if (e.key === 'ArrowDown') {
				e.preventDefault()
				const nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0
				buttons[nextIndex]?.focus()
			} else if (e.key === 'ArrowUp') {
				e.preventDefault()
				const prevIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1
				buttons[prevIndex]?.focus()
			} else if (e.key === 'Escape') {
				if (inputRef?.current) {
					inputRef.current.focus()
					const currentValue = inputRef.current.value
					inputRef.current.setSelectionRange(currentValue.length, currentValue.length)
				}
			} else if (e.key === 'Enter' && currentIndex >= 0) {
				e.preventDefault()
				const selectedSuggestion = suggestions[currentIndex]
				if (selectedSuggestion) {
					handleSelect(selectedSuggestion)
				}
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [suggestions, inputRef])

	if (suggestions.length === 0) return null

	return (
		<div ref={suggestionsRef} className="mb-2">
			<div className="text-teal-600 text-xs mb-1 flicker">◆ Suggestions:</div>
			<div className="flex flex-wrap gap-2">
				{suggestions.map((suggestion, index) => (
					<button
						key={index}
						type="button"
						onClick={() => handleSelect(suggestion)}
						className="text-teal-500 hover:text-teal-300 hover:bg-teal-400/10 px-2 py-1 rounded text-sm border border-teal-500/30 hover:border-teal-400/50 transition-colors glow flicker focus:outline-none focus:ring-2 focus:ring-teal-400/50"
					>
						{suggestion}
					</button>
				))}
			</div>
		</div>
	)
}
