import { useEffect, useRef } from 'react'

interface SnowEffectProps {
	isActive: boolean
}

export const SnowEffect = ({ isActive }: SnowEffectProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useEffect(() => {
		if (!isActive || !canvasRef.current) return

		const canvas = canvasRef.current
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		canvas.width = window.innerWidth
		canvas.height = window.innerHeight

		const snowflakes: Array<{
			x: number
			y: number
			radius: number
			speed: number
			wind: number
		}> = []

		// Create snowflakes
		for (let i = 0; i < 100; i++) {
			snowflakes.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				radius: Math.random() * 3 + 1,
				speed: Math.random() * 2 + 0.5,
				wind: Math.random() * 0.5 - 0.25,
			})
		}

		function draw() {
			if (!ctx || !canvas) return

			ctx.clearRect(0, 0, canvas.width, canvas.height)

			ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
			ctx.beginPath()

			for (const flake of snowflakes) {
				ctx.moveTo(flake.x, flake.y)
				ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2, true)
			}

			ctx.fill()

			// Update snowflake positions
			for (const flake of snowflakes) {
				flake.y += flake.speed
				flake.x += flake.wind

				// Reset snowflake if it goes off screen
				if (flake.y > canvas.height) {
					flake.y = -10
					flake.x = Math.random() * canvas.width
				}
				if (flake.x > canvas.width) {
					flake.x = 0
				} else if (flake.x < 0) {
					flake.x = canvas.width
				}
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
