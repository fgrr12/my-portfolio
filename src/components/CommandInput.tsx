import type React from 'react'
import { forwardRef } from 'react'

interface CommandInputProps {
	value: string
	onChange: (value: string) => void
	onKeyDown: (e: React.KeyboardEvent) => void
	disabled: boolean
	placeholder: string
}

const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(
	({ value, onChange, onKeyDown, disabled, placeholder }, ref) => {
		return (
			<div className="flex items-center space-x-2 mb-4">
				<span className="text-teal-400 glow flicker">FabricioR:-+</span>
				<input
					ref={ref}
					type="text"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onKeyDown={onKeyDown}
					disabled={disabled}
					className="flex-1 bg-transparent text-teal-300 outline-none glow caret-teal-400 disabled:opacity-50 flicker"
					placeholder={placeholder}
				/>
				<span className="text-teal-400 animate-pulse glow">|</span>
			</div>
		)
	}
)

CommandInput.displayName = 'CommandInput'

export default CommandInput
