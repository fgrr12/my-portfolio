import gsap from 'gsap'
import 'lenis/dist/lenis.css'
import ReactLenis from 'lenis/react'
import { useEffect, useRef } from 'react'

import { Terminal } from './components/Terminal/Terminal.component'
import { TopBar } from './components/TopBar/TopBar.component'

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

			<div className="inset-0 bg-gradient-to-b from-[#04131c] to-[#010d12] w-auto h-auto sm:w-[80%] sm:h-[80%] z-10 rounded-4xl p-4 border-2 border-[#092f42] border-solid">
				<TopBar />
				<div className="grid grid-cols-1 sm:grid-cols-3 w-full h-[90%] p-4 gap-4">
					<Terminal />
					<div className="col-span-1 sm:col-span-2 flex flex-col gap-4 w-full bg-[#0b1114] text-[#00f0c0] font-mono p-6 rounded-xl border shadow-[0_0_10px_#00f0c033]">
						<ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
							{/* <TypewriterText as="h1" className="glow-text text-4xl font-mono">
								Projects
							</TypewriterText>
							<div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-neon-glow transition hover:shadow-lg hover:shadow-cyan-500/20">
								<h2 className="text-neon text-xl font-bold">Project Name</h2>
								<p className="text-white/80">Short description...</p>
							</div> */}
							<h2 className="text-lg tracking-widest border-b border-[#00f0c0]/20 pb-2">
								PROJECTS
							</h2>

							<div className="border border-[#00f0c0]/40 rounded-md p-4 hover:bg-[#00f0c005] transition cursor-pointer">
								<h3 className="font-semibold text-md mb-1">
									<span className="text-[#00f0c0]">Livestock </span>
									<span className="text-[#00f0c0]">Managemennt </span>
									<span className="text-[#00f0c0]">System</span>
								</h3>
								<p className="text-sm text-[#b5ffe8] leading-snug">
									A web appLication designed for managing livestock on farms, built with React and
									Firebase.
								</p>
							</div>

							<div className="border border-[#00f0c0]/40 rounded-md p-4 hover:bg-[#00f0c005] transition">
								<h3 className="font-semibold text-md mb-1">
									Home Maintenanace Services Marketplace
								</h3>
								<p className="text-sm text-[#b5ffe8] leading-snug">
									A service for connecting users with home maintenance providers, developed using
									Angular.
								</p>
							</div>

							<div className="border border-[#00f0c0]/40 rounded-md p-4 hover:bg-[#00f0c005] transition">
								<h3 className="font-semibold text-md">Serena</h3>
							</div>
						</ReactLenis>
					</div>
				</div>
			</div>
		</div>
	)
}

export default App
