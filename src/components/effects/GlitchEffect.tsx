import { useEffect } from 'react'

interface GlitchEffectProps {
	isActive: boolean
}

export const GlitchEffect = ({ isActive }: GlitchEffectProps) => {
	useEffect(() => {
		if (!isActive) return

		const style = document.createElement('style')
		style.textContent = `
      .glitch-active {
        animation: glitch 0.3s infinite;
      }
      
      @keyframes glitch {
        0% {
          transform: translate(0);
          filter: hue-rotate(0deg);
        }
        10% {
          transform: translate(-2px, 2px);
          filter: hue-rotate(90deg);
        }
        20% {
          transform: translate(-1px, -1px);
          filter: hue-rotate(180deg);
        }
        30% {
          transform: translate(1px, 1px);
          filter: hue-rotate(270deg);
        }
        40% {
          transform: translate(1px, -1px);
          filter: hue-rotate(360deg);
        }
        50% {
          transform: translate(-1px, 2px);
          filter: hue-rotate(45deg);
        }
        60% {
          transform: translate(-1px, 1px);
          filter: hue-rotate(135deg);
        }
        70% {
          transform: translate(2px, 1px);
          filter: hue-rotate(225deg);
        }
        80% {
          transform: translate(-2px, -1px);
          filter: hue-rotate(315deg);
        }
        90% {
          transform: translate(1px, 2px);
          filter: hue-rotate(60deg);
        }
        100% {
          transform: translate(0);
          filter: hue-rotate(0deg);
        }
      }
    `
		document.head.appendChild(style)

		// Apply glitch effect to terminal
		const terminals = document.querySelectorAll('.pipboy-screen')
		terminals.forEach((terminal) => {
			terminal.classList.add('glitch-active')
		})

		return () => {
			if (style.parentNode) {
				style.parentNode.removeChild(style)
			}
			terminals.forEach((terminal) => {
				terminal.classList.remove('glitch-active')
			})
		}
	}, [isActive])

	return null
}
