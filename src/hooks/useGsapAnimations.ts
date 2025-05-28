import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { useEffect, useRef } from 'react'

if (typeof window !== 'undefined') {
	gsap.registerPlugin(TextPlugin)
}

export const useGSAPAnimations = () => {
	const timelineRef = useRef<gsap.core.Timeline | null>(null)
	const hasAnimatedStartup = useRef(false)

	useEffect(() => {
		timelineRef.current = gsap.timeline()

		return () => {
			if (timelineRef.current) {
				timelineRef.current.kill()
			}
		}
	}, [])

	const animateTerminalStartup = (terminalRef: React.RefObject<HTMLDivElement>) => {
		if (!terminalRef.current || hasAnimatedStartup.current) return

		hasAnimatedStartup.current = true

		const tl = gsap.timeline()

		gsap.set(terminalRef.current, {
			scale: 0.8,
			opacity: 0,
			rotationX: -15,
		})

		tl.to(terminalRef.current, {
			scale: 1,
			opacity: 1,
			rotationX: 0,
			duration: 1.2,
			ease: 'power3.out',
		})

		tl.to(
			terminalRef.current,
			{
				boxShadow: '0 0 50px rgba(20, 184, 166, 0.4), inset 0 0 50px rgba(20, 184, 166, 0.15)',
				duration: 0.8,
				ease: 'power2.inOut',
			},
			'-=0.5'
		)

		return tl
	}

	const animateWelcomeMessage = (welcomeRef: React.RefObject<HTMLDivElement>) => {
		if (!welcomeRef.current) return

		const elements = welcomeRef.current.querySelectorAll('.animate-text')
		if (elements.length === 0) return

		const tl = gsap.timeline()

		gsap.set(elements, {
			opacity: 0,
			y: 20,
			scale: 0.9,
		})

		elements.forEach((element, index) => {
			tl.to(
				element,
				{
					opacity: 1,
					y: 0,
					scale: 1,
					duration: 0.6,
					ease: 'power2.out',
				},
				index * 0.2
			)
		})

		return tl
	}

	const animateCommandExecution = (commandRef: React.RefObject<HTMLDivElement>) => {
		if (!commandRef.current) return

		const tl = gsap.timeline()

		gsap.set(commandRef.current, {
			opacity: 0,
			x: -20,
		})

		tl.to(commandRef.current, {
			opacity: 1,
			x: 0,
			duration: 0.3,
			ease: 'power2.out',
		})

		const outputLines = commandRef.current.querySelectorAll('.command-output')
		if (outputLines.length > 0) {
			gsap.set(outputLines, {
				opacity: 0,
				x: 10,
			})

			outputLines.forEach((line, index) => {
				tl.to(
					line,
					{
						opacity: 1,
						x: 0,
						duration: 0.4,
						ease: 'power2.out',
					},
					index * 0.1
				)
			})
		}

		return tl
	}

	const animateProjectCard = (cardRef: React.RefObject<HTMLDivElement>) => {
		if (!cardRef.current) return

		const tl = gsap.timeline()

		gsap.set(cardRef.current, {
			opacity: 0,
			y: 30,
			scale: 0.95,
		})

		tl.to(cardRef.current, {
			opacity: 1,
			y: 0,
			scale: 1,
			duration: 0.6,
			ease: 'power3.out',
		})

		return tl
	}

	const animateProjectDetail = (detailRef: React.RefObject<HTMLDivElement>) => {
		if (!detailRef.current) return

		const tl = gsap.timeline()

		gsap.set(detailRef.current, {
			opacity: 0,
			x: 50,
		})

		tl.to(detailRef.current, {
			opacity: 1,
			x: 0,
			duration: 0.8,
			ease: 'power3.out',
		})

		const title = detailRef.current.querySelector('.project-title')
		if (title && title.textContent) {
			const originalText = title.textContent
			gsap.set(title, { text: '' })

			tl.to(
				title,
				{
					text: originalText,
					duration: 1.5,
					ease: 'none',
				},
				'-=0.5'
			)
		}

		const buttons = detailRef.current.querySelectorAll('.action-button')
		if (buttons.length > 0) {
			gsap.set(buttons, {
				opacity: 0,
				y: 20,
				scale: 0.8,
			})

			buttons.forEach((button, index) => {
				tl.to(
					button,
					{
						opacity: 1,
						y: 0,
						scale: 1,
						duration: 0.5,
						ease: 'back.out(1.7)',
					},
					index * 0.1
				)
			})
		}

		const features = detailRef.current.querySelectorAll('.feature-item')
		if (features.length > 0) {
			gsap.set(features, {
				opacity: 0,
				x: -20,
			})

			features.forEach((feature, index) => {
				tl.to(
					feature,
					{
						opacity: 1,
						x: 0,
						duration: 0.4,
						ease: 'power2.out',
					},
					index * 0.05
				)
			})
		}

		return tl
	}

	const animateHoverEffect = (element: HTMLElement) => {
		const tl = gsap.timeline()

		tl.to(element, {
			scale: 1.05,
			boxShadow: '0 0 20px rgba(20, 184, 166, 0.3)',
			duration: 0.3,
			ease: 'power2.out',
		})

		return tl
	}

	const animateHoverOut = (element: HTMLElement) => {
		const tl = gsap.timeline()

		tl.to(element, {
			scale: 1,
			boxShadow: '0 0 30px rgba(20, 184, 166, 0.3), inset 0 0 30px rgba(20, 184, 166, 0.1)',
			duration: 0.3,
			ease: 'power2.out',
		})

		return tl
	}

	const animateFlickerEffect = (elements: NodeListOf<Element>) => {
		elements.forEach((element) => {
			gsap.to(element, {
				opacity: 1.3,
				textShadow: '0 0 8px currentColor, 0 0 15px currentColor, 0 0 20px currentColor',
				duration: 0.1,
				repeat: -1,
				yoyo: true,
				delay: Math.random() * 4,
				repeatDelay: Math.random() * 3 + 2,
				ease: 'power2.inOut',
			})
		})
	}

	const resetStartupAnimation = () => {
		hasAnimatedStartup.current = false
	}

	return {
		animateTerminalStartup,
		animateWelcomeMessage,
		animateCommandExecution,
		animateProjectCard,
		animateProjectDetail,
		animateHoverEffect,
		animateHoverOut,
		animateFlickerEffect,
		resetStartupAnimation,
	}
}
