import type { SuggestionsProps } from '@/types/ui'

export const Suggestions = ({ suggestions, onSelect, inputRef }: SuggestionsProps) => {
	// Arrow keys belong to command history (see useTerminal.handleKeyDown); suggestions
	// are reached with Tab completion or a click, the way a real shell behaves.
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

	if (suggestions.length === 0) return null

	return (
		<div className="mb-2">
			<div className="text-teal-600 text-xs mb-1 flicker">◆ Suggestions:</div>
			<div className="flex flex-wrap gap-2">
				{suggestions.map((suggestion) => (
					<button
						key={suggestion}
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
