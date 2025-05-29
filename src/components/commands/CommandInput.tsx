import { forwardRef, useEffect } from 'react'

import type { CommandInputProps } from '@/types/ui'

export const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(
	({ value, onChange, onKeyDown, disabled, placeholder }, ref) => {
		useEffect(() => {
			if (ref && typeof ref === 'object' && ref.current) {
				const input = ref.current
				if (document.activeElement === input) {
					const length = value.length
					input.setSelectionRange(length, length)
				}
			}
		}, [value, ref])

		return (
			<div className="flex items-center space-x-2 mb-4">
				<span className="text-teal-400 glow flicker">fabricio:-+</span>
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
