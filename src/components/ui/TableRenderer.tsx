import { Check, Copy } from 'lucide-react'
import { memo, useState } from 'react'

import type { TableRendererProps } from '@/types/ui'

import { useUi } from '@/i18n'

/** Contact details are meant to be taken away, not retyped. */
const CopyButton = ({ value }: { value: string }) => {
	const ui = useUi()
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(value)
			setCopied(true)
			setTimeout(() => setCopied(false), 1500)
		} catch {
			// Clipboard needs a secure context and permission; the mailto link still works.
		}
	}

	return (
		<button
			type="button"
			onClick={handleCopy}
			title={copied ? ui.copied : ui.copy}
			aria-label={`${ui.copy}: ${value}`}
			className="shrink-0 rounded p-1 text-teal-500 transition-colors hover:bg-teal-400/10 hover:text-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400/50 cursor-pointer"
		>
			{copied ? <Check size={14} /> : <Copy size={14} />}
		</button>
	)
}

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
				<table className="w-full border-collapse text-teal-400 glow">
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
										{isUrl(cell) || isEmail(cell) ? (
											<span className="inline-flex items-center gap-2">
												{makeLink(cell)}
												<CopyButton value={cell} />
											</span>
										) : (
											cell
										)}
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
