import { memo } from 'react'

import { TableRenderer } from '@/components/ui/TableRenderer'

interface CommandOutputRendererProps {
	output: string[]
}

const detectTable = (
	lines: string[],
	startIndex: number
): { table: any; endIndex: number } | null => {
	if (startIndex >= lines.length - 2) return null

	const potentialTableStart = lines[startIndex]
	if (!potentialTableStart.includes('TABLE:')) return null

	const title = potentialTableStart.replace('TABLE:', '').trim()
	let currentIndex = startIndex + 1
	const headers: string[] = []
	const rows: string[][] = []
	let isParsingHeaders = true

	while (currentIndex < lines.length) {
		const line = lines[currentIndex].trim()

		if (line === '' || line === 'END_TABLE') {
			break
		}

		if (line.startsWith('HEADERS:')) {
			const headerLine = line.replace('HEADERS:', '').trim()
			headerLine.split('|').forEach((header) => headers.push(header.trim()))
			isParsingHeaders = false
			currentIndex++
			continue
		}

		if (!isParsingHeaders) {
			const rowData = line.split('|').map((cell) => cell.trim())
			rows.push(rowData)
		}

		currentIndex++
	}

	return {
		table: {
			title,
			headers: headers.length > 0 ? headers : undefined,
			rows,
		},
		endIndex: currentIndex,
	}
}

export const CommandOutputRenderer = memo(function CommandOutputRenderer({
	output,
}: CommandOutputRendererProps) {
	const renderOutput = () => {
		const result = []
		let i = 0

		while (i < output.length) {
			const line = output[i]

			const tableData = detectTable(output, i)
			if (tableData) {
				result.push(<TableRenderer key={`table-${i}`} data={tableData.table} />)
				i = tableData.endIndex + 1
				continue
			}

			// A shell prints its own failures in red; matching that is information,
			// not styling — you can spot a failed line without reading it.
			const isError = /^bash:|^\[sudo\]/.test(line)

			result.push(
				<div
					key={`line-${i}`}
					className="break-words max-w-full text-[13px] leading-relaxed"
					style={{ color: isError ? 'var(--pink)' : 'var(--fg)' }}
				>
					{line || ' '}
				</div>
			)
			i++
		}

		return result
	}

	return (
		<div className="max-w-full overflow-x-auto block-output">
			<div className="max-w-full sm:max-w-none">{renderOutput()}</div>
		</div>
	)
})
