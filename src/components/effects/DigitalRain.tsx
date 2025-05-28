import { useEffect, useRef } from 'react'

interface DigitalRainProps {
	isActive: boolean
}

export default function DigitalRain({ isActive }: DigitalRainProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		if (!isActive || !canvasRef.current) return

		const canvas = canvasRef.current
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		canvas.width = window.innerWidth
		canvas.height = window.innerHeight

		// Binary characters and some special symbols
		const chars = '01'.split('')
		const fontSize = 14
		const columns = canvas.width / fontSize

		const drops: number[] = []
		for (let x = 0; x < columns; x++) {
			drops[x] = Math.random() * -100
		}

		function draw() {
			if (!ctx || !canvas) return

			// Semi-transparent black background for trail effect
			ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
			ctx.fillRect(0, 0, canvas.width, canvas.height)

			// Set text properties
			ctx.fillStyle = '#00ff41' // Bright green
			ctx.font = `${fontSize}px monospace`

			for (let i = 0; i < drops.length; i++) {
				// Pick a random character
				const text = chars[Math.floor(Math.random() * chars.length)]

				// Draw the character
				ctx.fillText(text, i * fontSize, drops[i] * fontSize)

				// Reset drop to top randomly
				if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
					drops[i] = 0
				}

				// Move drop down
				drops[i]++
			}
		}

		const interval = setInterval(draw, 50)

		return () => clearInterval(interval)
	}, [isActive])

	if (!isActive) return null

	return (
		<canvas
			ref={canvasRef}
			className="fixed inset-0 pointer-events-none z-50"
			style={{ background: 'transparent' }}
		/>
	)
}
