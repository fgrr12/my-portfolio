import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { createElement, useEffect, useRef } from 'react'

gsap.registerPlugin(useGSAP)

interface Props {
	children: string
	as?: any
	className?: string
}

export default function TypewriterText({ children, as = 'h1', className = '' }: Props) {
	const ref = useRef<HTMLElement>(null)

	useEffect(() => {
		const el = ref.current
		if (!el) return

		const cursor = document.createElement('span')
		cursor.textContent = '|'
		cursor.style.marginLeft = '2px'
		cursor.style.animation = 'blink 1s step-end infinite'
		cursor.style.display = 'inline-block'

		const text = children
		el.textContent = ''
		el.appendChild(cursor)

		let index = 0
		const interval = setInterval(() => {
			if (index < text.length && cursor.isConnected) {
				el.insertBefore(document.createTextNode(text[index]), cursor)
				index++
			} else {
				clearInterval(interval)
				cursor.remove()
			}
		}, 50)
	}, [children])

	return createElement(as, {
		ref,
		className: `${className} typewriter-text`,
	})
}
