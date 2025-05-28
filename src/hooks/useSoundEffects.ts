import { useCallback, useRef } from 'react'

export const useSoundEffects = () => {
	const audioContextRef = useRef<AudioContext | null>(null)

	const initAudioContext = useCallback(() => {
		if (!audioContextRef.current) {
			audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
		}
		return audioContextRef.current
	}, [])

	// Subtle typing sound effect
	const playTypingSound = useCallback(() => {
		const audioContext = initAudioContext()
		const oscillator = audioContext.createOscillator()
		const gainNode = audioContext.createGain()

		oscillator.connect(gainNode)
		gainNode.connect(audioContext.destination)

		// More subtle typing sound
		oscillator.frequency.setValueAtTime(1200 + Math.random() * 200, audioContext.currentTime)
		oscillator.type = 'square'

		gainNode.gain.setValueAtTime(0.02, audioContext.currentTime) // Much quieter
		gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05)

		oscillator.start(audioContext.currentTime)
		oscillator.stop(audioContext.currentTime + 0.05)
	}, [initAudioContext])

	// Soft button click sound
	const playButtonSound = useCallback(() => {
		const audioContext = initAudioContext()
		const oscillator = audioContext.createOscillator()
		const gainNode = audioContext.createGain()

		oscillator.connect(gainNode)
		gainNode.connect(audioContext.destination)

		oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
		oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1)
		oscillator.type = 'sine'

		gainNode.gain.setValueAtTime(0.05, audioContext.currentTime)
		gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1)

		oscillator.start(audioContext.currentTime)
		oscillator.stop(audioContext.currentTime + 0.1)
	}, [initAudioContext])

	// Command execution sound
	const playCommandSound = useCallback(() => {
		const audioContext = initAudioContext()
		const oscillator = audioContext.createOscillator()
		const gainNode = audioContext.createGain()

		oscillator.connect(gainNode)
		gainNode.connect(audioContext.destination)

		oscillator.frequency.setValueAtTime(500, audioContext.currentTime)
		oscillator.frequency.exponentialRampToValueAtTime(250, audioContext.currentTime + 0.15)
		oscillator.type = 'sawtooth'

		gainNode.gain.setValueAtTime(0.08, audioContext.currentTime)
		gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15)

		oscillator.start(audioContext.currentTime)
		oscillator.stop(audioContext.currentTime + 0.15)
	}, [initAudioContext])

	// Success sound
	const playSuccessSound = useCallback(() => {
		const audioContext = initAudioContext()

		// Create a sequence of notes for success
		const notes = [523.25, 659.25, 783.99] // C5, E5, G5

		notes.forEach((freq, index) => {
			const oscillator = audioContext.createOscillator()
			const gainNode = audioContext.createGain()

			oscillator.connect(gainNode)
			gainNode.connect(audioContext.destination)

			oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.1)
			oscillator.type = 'sine'

			gainNode.gain.setValueAtTime(0.08, audioContext.currentTime + index * 0.1)
			gainNode.gain.exponentialRampToValueAtTime(
				0.001,
				audioContext.currentTime + index * 0.1 + 0.2
			)

			oscillator.start(audioContext.currentTime + index * 0.1)
			oscillator.stop(audioContext.currentTime + index * 0.1 + 0.2)
		})
	}, [initAudioContext])

	// Error sound
	const playErrorSound = useCallback(() => {
		const audioContext = initAudioContext()
		const oscillator = audioContext.createOscillator()
		const gainNode = audioContext.createGain()

		oscillator.connect(gainNode)
		gainNode.connect(audioContext.destination)

		oscillator.frequency.setValueAtTime(150, audioContext.currentTime)
		oscillator.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.3)
		oscillator.type = 'sawtooth'

		gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
		gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3)

		oscillator.start(audioContext.currentTime)
		oscillator.stop(audioContext.currentTime + 0.3)
	}, [initAudioContext])

	// Startup sound
	const playStartupSound = useCallback(() => {
		const audioContext = initAudioContext()

		// Classic computer startup sound
		const frequencies = [220, 330, 440, 550, 660]

		frequencies.forEach((freq, index) => {
			const oscillator = audioContext.createOscillator()
			const gainNode = audioContext.createGain()

			oscillator.connect(gainNode)
			gainNode.connect(audioContext.destination)

			oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.05)
			oscillator.type = 'sine'

			gainNode.gain.setValueAtTime(0.06, audioContext.currentTime + index * 0.05)
			gainNode.gain.exponentialRampToValueAtTime(
				0.001,
				audioContext.currentTime + index * 0.05 + 0.15
			)

			oscillator.start(audioContext.currentTime + index * 0.05)
			oscillator.stop(audioContext.currentTime + index * 0.05 + 0.15)
		})
	}, [initAudioContext])

	// Easter egg discovery sound
	const playDiscoverySound = useCallback(() => {
		const audioContext = initAudioContext()

		// Magical discovery sound
		const notes = [440, 554.37, 659.25, 880] // A4, C#5, E5, A5

		notes.forEach((freq, index) => {
			const oscillator = audioContext.createOscillator()
			const gainNode = audioContext.createGain()

			oscillator.connect(gainNode)
			gainNode.connect(audioContext.destination)

			oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.15)
			oscillator.type = 'sine'

			gainNode.gain.setValueAtTime(0.1, audioContext.currentTime + index * 0.15)
			gainNode.gain.exponentialRampToValueAtTime(
				0.001,
				audioContext.currentTime + index * 0.15 + 0.4
			)

			oscillator.start(audioContext.currentTime + index * 0.15)
			oscillator.stop(audioContext.currentTime + index * 0.15 + 0.4)
		})
	}, [initAudioContext])

	return {
		playTypingSound,
		playButtonSound,
		playCommandSound,
		playSuccessSound,
		playErrorSound,
		playStartupSound,
		playDiscoverySound,
	}
}
