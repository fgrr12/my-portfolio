import { memo } from 'react'

interface CommandOutputRendererProps {
	output: string[]
}

export const CommandOutputRenderer = memo(function CommandOutputRenderer({
	output,
}: CommandOutputRendererProps) {
	return (
		<div className="space-y-1">
			{output.map((line, index) => {
				if (line.includes('╔') || line.includes('║') || line.includes('╚') || line.includes('═')) {
					return (
						<pre
							key={index}
							className="text-teal-400 glow flicker text-sm overflow-x-auto whitespace-pre"
						>
							{line}
						</pre>
					)
				}

				return (
					<div key={index} className="text-teal-400 glow flicker break-words flex flex-col">
						{line}
					</div>
				)
			})}
		</div>
	)
})
