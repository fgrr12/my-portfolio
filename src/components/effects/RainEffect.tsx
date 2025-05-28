import { useEffect, useRef } from 'react'

interface RainEffectProps {
	isActive: boolean
}

export const RainEffect = ({ isActive }: RainEffectProps) => {
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!isActive || !containerRef.current) return

		const container = containerRef.current
		const raindrops: HTMLDivElement[] = []

		const createRaindrop = () => {
			const raindrop = document.createElement('div')
			raindrop.className = 'raindrop'
			raindrop.style.cssText = `
        position: absolute;
        width: 2px;
        height: 20px;
        background: linear-gradient(to bottom, transparent, #14b8a6);
        left: ${Math.random() * 100}%;
        top: -20px;
        animation: fall ${Math.random() * 1 + 0.5}s linear infinite;
        opacity: ${Math.random() * 0.7 + 0.3};
      `
			container.appendChild(raindrop)
			raindrops.push(raindrop)

			setTimeout(() => {
				if (raindrop.parentNode) {
					raindrop.parentNode.removeChild(raindrop)
				}
				const index = raindrops.indexOf(raindrop)
				if (index > -1) {
					raindrops.splice(index, 1)
				}
			}, 2000)
		}

		// Add CSS animation
		const style = document.createElement('style')
		style.textContent = `
      @keyframes fall {
        to {
          transform: translateY(100vh);
        }
      }
    `
		document.head.appendChild(style)

		const interval = setInterval(createRaindrop, 50)

		return () => {
			clearInterval(interval)
			raindrops.forEach((drop) => {
				if (drop.parentNode) {
					drop.parentNode.removeChild(drop)
				}
			})
			if (style.parentNode) {
				style.parentNode.removeChild(style)
			}
		}
	}, [isActive])

	if (!isActive) return null

	return (
		<div ref={containerRef} className="fixed inset-0 pointer-events-none z-40 overflow-hidden" />
	)
}
