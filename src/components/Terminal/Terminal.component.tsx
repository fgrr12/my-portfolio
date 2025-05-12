import { type KeyboardEvent, useEffect, useRef, useState } from 'react'

export const Terminal = () => {
	const bottomRef = useRef<HTMLDivElement>(null)
	const [text, setText] = useState('')
	const [list, setList] = useState<string[]>([])
	const stage = useRef<'idle' | 'loading' | 'done'>('idle')

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setText(e.target.value)
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && text.trim()) {
			setList((prev) => [...prev, `> ${text.trim()}`])
			stage.current = 'loading'
			setText('')
		}
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: UseEffect is called by list
	useEffect(() => {
		if (stage.current !== 'loading') return
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' })

		const loadingTimeout = setTimeout(() => {
			setList((prev) => [...prev, 'Loading...'])
			stage.current = 'done'
		}, 200)

		return () => clearTimeout(loadingTimeout)
	}, [list])

	useEffect(() => {
		if (stage.current !== 'done') return

		const doneTimeout = setTimeout(() => {
			const phrase = list[list.length - 2].toLowerCase().split(' ').splice(1).join(' ')
			if (itemsList.includes(phrase)) {
				setList((prev) => [...prev.slice(0, -1), 'Loaded!'])
			} else {
				setList((prev) => [...prev.slice(0, -1), 'Something went wrong... Try again.'])
			}

			stage.current = 'idle'
		}, 1000)

		return () => clearTimeout(doneTimeout)
	}, [list])

	return (
		<div className="relative bg-black text-neon font-mono text-base p-8 leading-relaxed border shadow-[0_0_10px_#00f0c033] rounded-xl overflow-hidden pipboy-terminal">
			<div className="flex flex-col pb-8">
				{itemsList.map((item, index) => (
					<div key={index} className="animate-flicker first-letter:uppercase">
						{item}
					</div>
				))}
			</div>
			<div
				className="h-[72%] overflow-auto pr-2 scrollbar-thin scrollbar-thumb-neon scrollbar-track-transparent"
				onWheel={(e) => e.stopPropagation()}
			>
				{list.map((item, index) => (
					<div key={index} className="animate-flicker" ref={bottomRef}>
						{item}
					</div>
				))}
			</div>
			<input
				type="text"
				className="bg-transparent text-neon font-mono mt-4 p-2 leading-relaxed w-full focus:outline-neon animate-flicker"
				placeholder={stage.current === 'idle' ? 'Type here...' : 'Loading...'}
				value={text}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				// disabled={stage.current !== 'idle'}
			/>
		</div>
	)
}

const itemsList = ['show projects', 'about me', 'contact me']
