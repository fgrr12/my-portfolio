export default function WelcomeMessage() {
	return (
		<div className="text-teal-400 mb-4 relative z-10 flex-shrink-0">
			<div className="text-teal-300 glow text-lg flicker">
				◆ FABRICIO ROJAS PORTFOLIO SYSTEM v2.1.0 ◆
			</div>
			<div className="text-teal-500 text-sm flicker">Type 'help' for available commands</div>
			<div className="text-teal-600 text-xs mt-1 flicker">
				Last login: {new Date().toLocaleString()}
			</div>
			<div className="text-teal-600 text-xs flicker">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
		</div>
	)
}
