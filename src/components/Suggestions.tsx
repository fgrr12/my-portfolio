interface SuggestionsProps {
	suggestions: string[]
	onSelect: (suggestion: string) => void
}

export default function Suggestions({ suggestions, onSelect }: SuggestionsProps) {
	if (suggestions.length === 0) return null

	return (
		<div className="mb-2">
			<div className="text-teal-600 text-xs mb-1 flicker">◆ Suggestions:</div>
			<div className="flex flex-wrap gap-2">
				{suggestions.map((suggestion, index) => (
					<button
						type="button"
						key={index}
						onClick={() => onSelect(suggestion)}
						className="text-teal-500 hover:text-teal-300 hover:bg-teal-400/10 px-2 py-1 rounded text-sm border border-teal-500/30 hover:border-teal-400/50 transition-colors glow flicker cursor-pointer"
					>
						{suggestion}
					</button>
				))}
			</div>
		</div>
	)
}
