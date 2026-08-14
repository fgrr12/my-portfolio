import { forwardRef, useEffect } from 'react'

import type { CommandInputProps } from '@/types/ui'

/**
 * A two-line prompt, the shape most developers actually run (powerlevel10k and
 * friends): context on the first line, a clean input line below it. It replaces
 * the old ASCII welcome banner as the opening statement — the location and the
 * git branch say "working environment" better than a title ever did.
 */
export const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(
	({ value, onChange, onKeyDown, disabled, placeholder }, ref) => {
		useEffect(() => {
			if (ref && typeof ref === 'object' && ref.current) {
				const input = ref.current
				if (document.activeElement === input) {
					input.setSelectionRange(value.length, value.length)
				}
			}
		}, [value, ref])

		return (
			<div className="flex items-center gap-2 pt-1">
				<span className="prompt-caret shrink-0 text-base leading-none">❯</span>
				<input
					ref={ref}
					type="text"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onKeyDown={onKeyDown}
					disabled={disabled}
					placeholder={placeholder}
					spellCheck={false}
					autoComplete="off"
					autoCapitalize="off"
					autoCorrect="off"
					aria-label={placeholder}
					className="flex-1 min-w-0 bg-transparent outline-none disabled:opacity-50 text-[14px]"
					style={{ color: 'var(--fg)', caretColor: 'var(--purple)' }}
				/>
			</div>
		)
	}
)
