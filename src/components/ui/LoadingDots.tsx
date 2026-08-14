import { useUi } from '@/i18n'

/** A blinking block cursor is what a shell shows while a command runs. */
export const LoadingDots = () => {
	const ui = useUi()

	return (
		// <output> already carries role="status", so screen readers announce the run.
		<output
			aria-label={ui.inputProcessing}
			className="inline-block w-2 h-4 align-middle caret-blink"
			style={{ background: 'var(--amber)' }}
		/>
	)
}
