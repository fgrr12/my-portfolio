interface StatusBarProps {
	isProcessing: boolean
}

export default function StatusBar({ isProcessing }: StatusBarProps) {
	return (
		<div className="pt-2 border-t border-teal-500/20 text-xs text-teal-600">
			{isProcessing ? (
				<div className="flex items-center space-x-2">
					<div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
					<span className="glow flicker">Processing command...</span>
				</div>
			) : (
				<div className="flex items-center space-x-2">
					<div className="w-2 h-2 bg-green-400 rounded-full glow" />
					<span className="glow flicker">System Ready</span>
				</div>
			)}
		</div>
	)
}
