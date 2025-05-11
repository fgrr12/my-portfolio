import gsap from 'gsap'
import 'lenis/dist/lenis.css'
import ReactLenis from 'lenis/react'
import { useEffect, useRef } from 'react'
import { Terminal } from './components/Terminal/Terminal.component'
import { TopBar } from './components/TopBar/TopBar.component'
import TypewriterText from './components/TypeWriter/TypeWriter'

function App() {
	const lenisRef: any = useRef(null)

	useEffect(() => {
		function update(time: any) {
			lenisRef.current?.lenis?.raf(time * 1000)
		}

		gsap.ticker.add(update)

		return () => gsap.ticker.remove(update)
	}, [])

	return (
		<div className="flex items-center justify-center h-screen w-screen fixed inset-0 z-[-1] bg-terminal">
			<div className="absolute inset-0 bg-terminal-pattern bg-grid-sm opacity-10" />
			<div className="absolute inset-0 bg-gradient-to-br from-transparent via-cyan-900/20 to-transparent blur-2xl animate-pulse" />

			<div className="inset-0 bg-gradient-to-b from-[#111827] to-[#0a0a0a] w-[90%] h-[90%] z-10 rounded-4xl p-4 border-1 border-sky-700 border-solid">
				<TopBar />
				<div className="grid grid-cols-1 sm:grid-cols-2 w-full h-[90%] p-4 gap-4">
					<Terminal />
					<ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
						<div>
							<TypewriterText as="h1" className="glow-text text-4xl font-mono">
								Projects
							</TypewriterText>
							<div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-neon-glow transition hover:shadow-lg hover:shadow-cyan-500/20">
								<h2 className="text-neon text-xl font-bold">Project Name</h2>
								<p className="text-white/80">Short description...</p>
							</div>
						</div>
					</ReactLenis>
				</div>
			</div>
		</div>
	)
}

export default App
