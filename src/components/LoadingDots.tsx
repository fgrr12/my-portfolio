import { useEffect, useState } from 'react'

export default function LoadingDots() {
	const [dots, setDots] = useState('')

	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prev) => {
				if (prev === '...') return ''
				return `${prev}.`
			})
		}, 300)

		return () => clearInterval(interval)
	}, [])

	return <span className="text-teal-400 glow flicker">Processing{dots}</span>
}
