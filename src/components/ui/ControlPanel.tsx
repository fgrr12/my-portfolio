import { Volume2, VolumeX, Globe } from 'lucide-react'

interface ControlPanelProps {
	soundEnabled: boolean
	language: 'en' | 'es'
	onToggleSound: () => void
	onToggleLanguage: () => void
}

export const ControlPanel = ({
	soundEnabled,
	language,
	onToggleSound,
	onToggleLanguage,
}: ControlPanelProps) => {
	return (
		<>
			{/* Desktop Layout - Column (top right) */}
			<div className="hidden sm:flex fixed top-3 right-3 z-30 flex-col gap-2">
				{/* Sound Control */}
				<button
					onClick={onToggleSound}
					className="w-12 h-12 rounded-xl border border-teal-500/30 bg-slate-900/90 backdrop-blur-sm hover:bg-teal-500/10 transition-all duration-300 group flex items-center justify-center"
					title={soundEnabled ? 'Sound: ON (click to disable)' : 'Sound: OFF (click to enable)'}
				>
					{soundEnabled ? (
						<Volume2
							size={20}
							className="text-teal-400 glow group-hover:text-teal-300 transition-colors"
						/>
					) : (
						<VolumeX
							size={20}
							className="text-teal-600 group-hover:text-teal-500 transition-colors"
						/>
					)}

					{/* Pulse animation when sound is on */}
					{soundEnabled && (
						<div className="absolute inset-0 rounded-xl border border-teal-400/50 animate-pulse pointer-events-none" />
					)}
				</button>

				{/* Language Control */}
				<button
					onClick={onToggleLanguage}
					className="w-12 h-12 rounded-xl border border-teal-500/30 bg-slate-900/90 backdrop-blur-sm hover:bg-teal-500/10 transition-all duration-300 group flex items-center justify-center relative"
					title={`Language: ${language.toUpperCase()} (click to switch)`}
				>
					<Globe
						size={20}
						className="text-teal-400 glow group-hover:text-teal-300 transition-colors"
					/>

					{/* Language indicator */}
					<span className="absolute -bottom-1 -right-1 text-[10px] font-bold text-teal-300 bg-slate-800 rounded-full w-5 h-5 flex items-center justify-center border border-teal-500/50 glow">
						{language.toUpperCase()}
					</span>
				</button>
			</div>

			{/* Mobile Layout - Row (bottom right) */}
			<div className="sm:hidden fixed bottom-5 right-3 z-30 flex flex-row gap-3">
				{/* Sound Control */}
				<button
					onClick={onToggleSound}
					className="w-11 h-11 rounded-xl border border-teal-500/30 bg-slate-900/90 backdrop-blur-sm hover:bg-teal-500/10 transition-all duration-300 group flex items-center justify-center"
					title={soundEnabled ? 'Sound: ON' : 'Sound: OFF'}
				>
					{soundEnabled ? (
						<Volume2
							size={18}
							className="text-teal-400 glow group-hover:text-teal-300 transition-colors"
						/>
					) : (
						<VolumeX
							size={18}
							className="text-teal-600 group-hover:text-teal-500 transition-colors"
						/>
					)}

					{/* Pulse animation when sound is on */}
					{soundEnabled && (
						<div className="absolute inset-0 rounded-xl border border-teal-400/50 animate-pulse pointer-events-none" />
					)}
				</button>

				{/* Language Control */}
				<button
					onClick={onToggleLanguage}
					className="w-11 h-11 rounded-xl border border-teal-500/30 bg-slate-900/90 backdrop-blur-sm hover:bg-teal-500/10 transition-all duration-300 group flex items-center justify-center relative"
					title={`Language: ${language.toUpperCase()}`}
				>
					<Globe
						size={18}
						className="text-teal-400 glow group-hover:text-teal-300 transition-colors"
					/>

					{/* Language indicator */}
					<span className="absolute -bottom-0.5 -right-0.5 text-[8px] font-bold text-teal-300 bg-slate-800 rounded-full w-4 h-4 flex items-center justify-center border border-teal-500/50 glow">
						{language.toUpperCase()}
					</span>
				</button>
			</div>
		</>
	)
}
