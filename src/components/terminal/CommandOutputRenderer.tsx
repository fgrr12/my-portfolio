
import { memo } from "react"
import { TableRenderer } from "./tableRenderer";

interface CommandOutputRendererProps {
  output: string[]
}
 
const detectTable = (lines: string[], startIndex: number): { table: any; endIndex: number } | null => {
  if (startIndex >= lines.length - 2) return null

  const potentialTableStart = lines[startIndex]
  if (!potentialTableStart.includes("TABLE:")) return null

  const title = potentialTableStart.replace("TABLE:", "").trim()
  let currentIndex = startIndex + 1
  const headers: string[] = []
  const rows: string[][] = []
  let isParsingHeaders = true

  while (currentIndex < lines.length) {
    const line = lines[currentIndex].trim()

    if (line === "" || line === "END_TABLE") {
      break
    }

    if (line.startsWith("HEADERS:")) {
      const headerLine = line.replace("HEADERS:", "").trim()
      headerLine.split("|").forEach((header) => headers.push(header.trim()))
      isParsingHeaders = false
      currentIndex++
      continue
    }

    if (!isParsingHeaders) {
      const rowData = line.split("|").map((cell) => cell.trim())
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

export const CommandOutputRenderer = memo(function CommandOutputRenderer({ output }: CommandOutputRendererProps) {
  const renderOutput = () => {
    const result = []
    let i = 0

    while (i < output.length) {
      const line = output[i]

      // Detectar si es una tabla
      const tableData = detectTable(output, i)
      if (tableData) {
        result.push(<TableRenderer key={`table-${i}`} data={tableData.table} />)
        i = tableData.endIndex + 1
        continue
      }

      // Línea normal
      result.push(
        <div key={`line-${i}`} className="text-teal-400 glow flicker break-words max-w-full">
          {line}
        </div>,
      )
      i++
    }

    return result
  }

  return (
    <div className="space-y-1 max-w-full overflow-x-auto">
      <div className="max-w-full sm:max-w-none">{renderOutput()}</div>
    </div>
  )
})
