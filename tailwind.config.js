module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			backgroundImage: {
				'terminal-pattern': 'radial-gradient(#2dd4bf 1px, transparent 1px)',
			},
			backgroundSize: {
				'grid-sm': '20px 20px',
			},
			colors: {
				terminal: '#0f0f0f',
				neon: '#8cf4d7',
				pipgreen: '#00ff99',
			},
			boxShadow: {
				'neon-glow': '0 0 10px #00ffe0',
				pipgreen: '0 0 10px #00ff99',
			},
			fontFamily: {
				mono: ['"IBM Plex Mono"', 'Courier New', 'monospace'],
			},
			animation: {
				flicker: 'flicker 2s infinite',
				scanlines: 'scanlines 1s linear infinite',
			},
			keyframes: {
				flicker: {
					'0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
					'20%, 22%, 24%, 55%': { opacity: '0.3' },
				},
				scanlines: {
					'0%': { backgroundPosition: '0 0' },
					'100%': { backgroundPosition: '0 4px' },
				},
			},
		},
		plugins: [],
	},
}
