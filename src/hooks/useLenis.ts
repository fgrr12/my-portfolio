'use client'

import { useEffect } from 'react'

export function useLenis() {
	useEffect(() => {
		const lenisInstances: any[] = []

		const initLenis = async () => {
			const Lenis = (await import('lenis')).default

			const terminalScrollAreas = document.querySelectorAll('.terminal-scroll-area')

			terminalScrollAreas.forEach((element) => {
				if (element instanceof HTMLElement) {
					const lenis = new Lenis({
						wrapper: element,
						content: element.firstElementChild as HTMLElement,
						duration: 1.2,
						easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
						orientation: 'vertical',
						smoothWheel: true,
						syncTouch: false,
						touchMultiplier: 2,
						infinite: false,
					})

					lenisInstances.push(lenis)

					function raf(time: number) {
						lenis.raf(time)
						requestAnimationFrame(raf)
					}

					requestAnimationFrame(raf)

					console.log('Lenis initialized for terminal area:', element)
				}
			})
		}

		const timer = setTimeout(() => {
			initLenis()
		}, 1000)

		return () => {
			clearTimeout(timer)
			lenisInstances.forEach((lenis) => {
				if (lenis) {
					lenis.destroy()
				}
			})
			console.log('All Lenis instances destroyed')
		}
	}, [])

	const reinitializeLenis = async () => {
		const Lenis = (await import('lenis')).default
		const terminalScrollAreas = document.querySelectorAll(
			'.terminal-scroll-area:not([data-lenis-initialized])'
		)

		terminalScrollAreas.forEach((element) => {
			if (element instanceof HTMLElement) {
				element.setAttribute('data-lenis-initialized', 'true')

				const lenis = new Lenis({
					wrapper: element,
					content: element.firstElementChild as HTMLElement,
					duration: 1.2,
					easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
					orientation: 'vertical',
					smoothWheel: true,
					syncTouch: false,
					touchMultiplier: 2,
					infinite: false,
				})

				function raf(time: number) {
					lenis.raf(time)
					requestAnimationFrame(raf)
				}

				requestAnimationFrame(raf)

				console.log('Lenis reinitialized for new terminal area:', element)
			}
		})
	}

	return { reinitializeLenis }
}
