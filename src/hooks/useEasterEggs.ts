import { useCallback, useState } from 'react'

import { useSoundEffects } from '@/hooks/useSoundEffects'

export const useEasterEggs = () => {
	const [digitalRainMode, setDigitalRainMode] = useState(false)
	const [konamiSequence, setKonamiSequence] = useState<string[]>([])
	const [isSnowing, setIsSnowing] = useState(false)
	const [isGlitching, setIsGlitching] = useState(false)
	const { playDiscoverySound } = useSoundEffects()

	const konamiCode = [
		'ArrowUp',
		'ArrowUp',
		'ArrowDown',
		'ArrowDown',
		'ArrowLeft',
		'ArrowRight',
		'ArrowLeft',
		'ArrowRight',
		'KeyB',
		'KeyA',
	]

	const checkKonamiCode = useCallback(
		(key: string) => {
			const newSequence = [...konamiSequence, key].slice(-10)
			setKonamiSequence(newSequence)

			if (newSequence.join(',') === konamiCode.join(',')) {
				playDiscoverySound()
				setKonamiSequence([])
				return true
			}
			return false
		},
		[konamiSequence, playDiscoverySound]
	)

	const easterEggCommands = {
		'digital rain': () => {
			setDigitalRainMode(true)
			setTimeout(() => setDigitalRainMode(false), 12000)
			playDiscoverySound()
			return [
				'Initializing digital precipitation protocol...',
				'Loading binary weather patterns...',
				'Activating atmospheric data streams...',
				'',
				'01001000 01100101 01101100 01101100 01101111',
				'01010111 01101111 01110010 01101100 01100100',
				'',
				'🌧️ Digital rain activated for 12 seconds',
				'Watch the binary data fall from the digital sky...',
			]
		},

		brew: () => {
			playDiscoverySound()
			return [
				'Starting coffee brewing sequence...',
				'Grinding beans... ████████████ 100%',
				'Heating water to optimal temperature...',
				'Extracting caffeine goodness...',
				'',
				'        )  (  (',
				'       (   ) )',
				'        ) ( (',
				'      _______)_',
				"   .-'---------|  ",
				'  ( C|/\\/\\/\\/\\/|',
				"   '-./\\/\\/\\/\\/|",
				"     '_________'",
				"      '-------'",
				'',
				'☕ Perfect brew ready!',
				'Caffeine levels: ████████████ MAX',
				'Productivity boost: +200%',
				'',
				'💡 Pro tip: Coffee makes code compile faster!',
			]
		},

		snow: () => {
			setIsSnowing(true)
			setTimeout(() => setIsSnowing(false), 20000)
			playDiscoverySound()
			return [
				'Initializing winter simulation...',
				'Temperature dropping... ❄️',
				'Crystallizing atmospheric moisture...',
				'Deploying snowflake algorithms...',
				'',
				'❄️ ❅ ❄️ ❅ ❄️ ❅ ❄️ ❅ ❄️',
				'',
				'🌨️ Let it snow, let it code! 🌨️',
				'Winter wonderland activated for 20 seconds',
				'',
				'Each snowflake is unique, just like your bugs! ❄️',
			]
		},

		glitch: () => {
			setIsGlitching(true)
			setTimeout(() => setIsGlitching(false), 8000)
			playDiscoverySound()
			return [
				'D3t3ct1ng 5y5t3m 4n0m4ly...',
				'R34l1ty m4tr1x d35t4b1l1z1ng...',
				'G1!tch pr0t0c01 4ct1v4t3d...',
				'',
				'E̴R̷R̸O̵R̶:̷ ̸R̴E̷A̸L̵I̷T̸Y̶.̵E̷X̸E̴ ̸H̷A̵S̶ ̴S̷T̸O̵P̷P̸E̷D̴ ̸W̵O̷R̸K̵I̷N̸G̶',
				'',
				'⚠️ Reality.exe has encountered an error ⚠️',
				'Glitch mode: ACTIVE',
				'Duration: 8 seconds',
				'',
				"Don't worry, it's just a feature, not a bug! 🐛",
			]
		},

		'dev mode': () => {
			playDiscoverySound()
			return [
				'🔓 Developer mode activated!',
				'',
				'Access granted to secret developer tools:',
				'',
				'╔══════════════════════════════════════╗',
				'║         DEVELOPER CONSOLE            ║',
				'╠══════════════════════════════════════╣',
				'║ • Infinite coffee supply: ✅         ║',
				'║ • Bug-free code generator: ❌        ║',
				'║ • Stack Overflow integration: ✅     ║',
				'║ • Rubber duck debugger: ✅           ║',
				'║ • Time machine (for deadlines): ❌   ║',
				'║ • Mind reading IDE: ❌               ║',
				'╚══════════════════════════════════════╝',
				'',
				'🎯 Secret commands unlocked:',
				"• Type 'rubber duck' for debugging help",
				"• Type 'stack overflow' for instant answers",
				'',
				'Remember: With great power comes great responsibility! 🕷️',
			]
		},

		'rubber duck': () => {
			const responses = [
				'🦆 *Quack* Have you tried turning it off and on again?',
				"🦆 *Quack* The bug is probably in the last line you're sure is correct.",
				"🦆 *Quack* Did you check if it's plugged in?",
				'🦆 *Quack* Maybe add some console.log() statements?',
				'🦆 *Quack* Have you tried explaining the problem to me again?',
				'🦆 *Quack* The answer is probably simpler than you think.',
				'🦆 *Quack* Check your semicolons and brackets!',
				'🦆 *Quack* When in doubt, blame the cache.',
			]

			const randomResponse = responses[Math.floor(Math.random() * responses.length)]

			return [
				'Summoning rubber duck debugger...',
				'🦆 *Splash* 🦆',
				'',
				'        __',
				'       (  )',
				'     ( (  ) )',
				'   (    (  ) )',
				'  ( (  (    ) )',
				' (  (  (  (  ) )',
				'( (  (  ) (  ) )',
				' (  (  ( (  ) )',
				'  ( (  )   ) )',
				'   (  ) ( ( )',
				'     )   ( )',
				'    (     )',
				'',
				randomResponse,
				'',
				'🦆 Rubber Duck says: Explain your code to me line by line!',
				'Often the solution becomes clear just by talking through it.',
			]
		},

		'stack overflow': () => {
			const questions = [
				'How to center a div?',
				'Why is my code not working?',
				"What's the difference between == and ===?",
				'How to exit vim?',
				'Why is my array empty?',
				'How to make HTTP request in JavaScript?',
				"What is 'this' in JavaScript?",
				'How to reverse a string?',
			]

			const randomQuestion = questions[Math.floor(Math.random() * questions.length)]

			return [
				'Connecting to Stack Overflow...',
				'Searching for solutions...',
				'Found 47,382 similar questions...',
				'',
				`📚 Top result for: '${randomQuestion}'`,
				'',
				'╔══════════════════════════════════════╗',
				'║ ⬆️ 2,847  Question marked as duplicate ║',
				'║ ⬇️ -12   by user: CodeMaster2000      ║',
				'╚══════════════════════════════════════╝',
				'',
				'💬 Top Answer (✅ Accepted):',
				'"Just use jQuery. It works for me."',
				'',
				'💬 Second Answer:',
				'"This question has been asked 1000 times.',
				'Please search before posting. [CLOSED]"',
				'',
				'🏆 Welcome to Stack Overflow! Where the points',
				"don't matter and your question is always a duplicate! 😄",
			]
		},

		konami: () => [
			'🎮 KONAMI CODE ACTIVATED! 🎮',
			'',
			'⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️🅱️🅰️',
			'',
			'🎉 You found the legendary cheat code! 🎉',
			'✨ 30 extra lives granted ✨',
			'🚀 God mode: ENABLED 🚀',
			'',
			"Achievement unlocked: 'Konami Master'",
			'',
			'🎯 Special abilities activated:',
			'• Infinite debugging patience',
			'• Auto-complete for all languages',
			'• Immunity to merge conflicts',
			'• Perfect code on first try',
			'',
			'Fun fact: The Konami Code was created in 1986!',
		],
	}

	return {
		easterEggCommands,
		digitalRainMode,
		isSnowing,
		isGlitching,
		checkKonamiCode,
	}
}
