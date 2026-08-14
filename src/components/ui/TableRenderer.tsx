import { Check, Copy } from 'lucide-react'
import { memo, useState } from 'react'

import type { TableRendererProps } from '@/types/ui'

import { useUi } from '@/i18n'

const isUrl = (text: string) => /^(https?:\/\/|www\.|github\.com|linkedin\.com|mailto:)/i.test(text)
const isEmail = (text: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)

const makeLink = (text: string) => {
	const href = isEmail(text)
		? `mailto:${text}`
		: /^https?:\/\//i.test(text)
			? text
			: `https://${text}`

	return (
		<a
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			className="underline underline-offset-2 transition-colors"
			style={{ color: 'var(--cyan)' }}
		>
			{text}
		</a>
	)
}

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
			// Clipboard needs a secure context and permission; the link still works.
		}
	}

	return (
		<button
			type="button"
			onClick={handleCopy}
			title={copied ? ui.copied : ui.copy}
			aria-label={`${ui.copy}: ${value}`}
			className="shrink-0 rounded p-1 transition-colors cursor-pointer"
			style={{ color: copied ? 'var(--green)' : 'var(--fg-muted)' }}
		>
			{copied ? <Check size={13} /> : <Copy size={13} />}
		</button>
	)
}

/**
 * Command output that declares a TABLE block gets real table semantics — the data
 * is tabular, so it should be a table for a screen reader too, not ASCII art.
 */
export const TableRenderer = memo(function TableRenderer({
	data,
	className = '',
}: TableRendererProps) {
	const { title, headers, rows } = data

	return (
		<div className={`my-3 overflow-x-auto ${className}`}>
			<table className="data-table">
				<caption>{title}</caption>
				{headers && (
					<thead>
						<tr>
							{headers.map((header) => (
								<th key={header}>{header}</th>
							))}
						</tr>
					</thead>
				)}
				<tbody>
					{rows.map((row) => (
						<tr key={row.join('|')}>
							{row.map((cell, cellIndex) => (
								<td key={`${cell}-${cellIndex}`}>
									{isUrl(cell) || isEmail(cell) ? (
										<span className="inline-flex items-center gap-1.5">
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
	)
})
