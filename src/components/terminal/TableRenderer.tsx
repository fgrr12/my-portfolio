import { memo } from 'react'

import type { TableRendererProps } from '@/types/ui'

const isUrl = (text: string) => {
	return /^(https?:\/\/|www\.|github\.com|linkedin\.com|mailto:)/i.test(text)
}

const isEmail = (text: string) => {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)
}

const makeLink = (text: string) => {
	let href = text
	if (isEmail(text)) {
		href = `mailto:${text}`
	} else if (!/^https?:\/\//i.test(text)) {
		href = `https://${text}`
	}

	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className="underline text-teal-300 hover:text-teal-100 transition-colors"
		>
			{text}
		</a>
	)
}

export const TableRenderer = memo(function TableRenderer({
	data,
	className = '',
}: TableRendererProps) {
	const { title, headers, rows } = data

	return (
		<div className={`my-4 max-w-fit ${className}`}>
			<div className="overflow-x-auto rounded-xl border border-teal-500/40 bg-slate-900/70">
				<table className="w-full border-collapse text-teal-400 glow flicker">
					<caption className="text-center font-bold text-teal-300 bg-slate-800/80 px-4 py-2 border-b border-teal-500/40 rounded-t-xl">
						◆ {title} ◆
					</caption>
					{headers && (
						<thead className="bg-slate-800/60">
							<tr>
								{headers.map((header, index) => (
									<th
										key={index}
										className="text-left px-3 py-2 text-teal-300 font-mono text-sm border-b border-teal-500/30"
									>
										{header}
									</th>
								))}
							</tr>
						</thead>
					)}
					<tbody>
						{rows.map((row, rowIndex) => (
							<tr key={rowIndex} className="hover:bg-teal-500/10 transition-colors">
								{row.map((cell, cellIndex) => (
									<td
										key={cellIndex}
										className="px-3 py-2 text-teal-400/90 font-mono text-sm whitespace-nowrap border-b border-teal-500/20"
									>
										{isUrl(cell) || isEmail(cell) ? makeLink(cell) : cell}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
})
