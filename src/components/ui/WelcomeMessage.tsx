import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'

export const WelcomeMessage = () => {
	const welcomeRef = useRef<HTMLDivElement>(null)
	const hasAnimated = useRef(false)

	useEffect(() => {
		if (!hasAnimated.current && welcomeRef.current) {
			hasAnimated.current = true

			const elements = welcomeRef.current.querySelectorAll('.animate-text')

			if (elements.length > 0) {
				gsap.set(elements, {
					opacity: 0,
				})

				const tl = gsap.timeline({ delay: 1.3 })

				elements.forEach((element, index) => {
					tl.to(
						element,
						{
							opacity: 1,
							scale: 1,
							duration: 0.6,
							ease: 'power2.out',
						},
						index * 0.2
					)
				})
			}
		}
	}, [])

	return (
		<div ref={welcomeRef} className="text-teal-400 mb-4 relative z-10 flex-shrink-0">
			<div className="text-teal-300 glow text-lg flicker animate-text">
				◆ FABRICIO ROJAS PORTFOLIO SYSTEM v2.1.0 ◆
			</div>
			<div className="text-teal-500 text-sm flicker animate-text">
				Type 'help' for available commands
			</div>
			<div className="text-teal-600 text-xs mt-1 flicker animate-text">
				Last login: {new Date().toLocaleString()}
			</div>
			<div className="text-teal-600 text-xs flicker animate-text">
				━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
			</div>
		</div>
	)
}
