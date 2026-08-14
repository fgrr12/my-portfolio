import type { SuggestionsProps } from '@/types/ui'

import { useUi } from '@/i18n'

export const Suggestions = ({ suggestions, onSelect, inputRef }: SuggestionsProps) => {
	const ui = useUi()

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
		<div className="mb-2.5">
			<div className="label-micro mb-1.5">{ui.suggestions}</div>
			<div className="flex flex-wrap gap-2">
				{suggestions.map((suggestion) => (
					<button
						key={suggestion}
						type="button"
						onClick={() => handleSelect(suggestion)}
						className="action"
					>
						{suggestion}
					</button>
				))}
			</div>
		</div>
	)
}
