import { useEffect } from 'react'

import DigitalRain from './components/effects/DigitalRain'
import { GlitchEffect } from './components/effects/GlitchEffect'
import { SnowEffect } from './components/effects/SnowEffect'
import { MainTerminal } from './components/terminal/MainTerminal'
import { ProjectsTerminal } from './components/terminal/ProjectsTerminal'
import { useLenis } from './hooks/useLenis'
import { useTerminal } from './hooks/useTerminal'

export const App = () => {
	const {
		currentInput,
		commandHistory,
		suggestions,
		isProcessing,
		showProjects,
		selectedProject,
		projects,
		availableCommands,
		soundEnabled,
		digitalRainMode,
		isSnowing,
		isGlitching,
		handleInputChange,
		handleKeyDown,
		handleQuickCommand,
		selectSuggestion,
		closeProjects,
		selectProject,
		goBackToProjects,
		playStartup,
	} = useTerminal()

	useLenis()

	useEffect(() => {
		playStartup()
	}, [playStartup])

	return (
		<div className="h-screen bg-gray-950 p-4 font-mono pipboy-bg">
			<DigitalRain isActive={digitalRainMode} />
			<SnowEffect isActive={isSnowing} />
			<GlitchEffect isActive={isGlitching} />

			<div className="fixed top-4 right-4 z-30 text-teal-500 text-xs glow flicker">
				🔊 Sound: {soundEnabled ? 'ON' : 'OFF'}
			</div>

			<div className="max-w-7xl mx-auto h-full flex flex-col lg:flex-row gap-4">
				<MainTerminal
					commandHistory={commandHistory}
					currentInput={currentInput}
					suggestions={suggestions}
					isProcessing={isProcessing}
					availableCommands={availableCommands}
					onInputChange={handleInputChange}
					onKeyDown={handleKeyDown}
					onSuggestionSelect={selectSuggestion}
					onQuickCommand={handleQuickCommand}
					showProjects={showProjects}
				/>

				{showProjects && (
					<ProjectsTerminal
						projects={projects}
						selectedProject={selectedProject}
						onClose={closeProjects}
						onSelectProject={selectProject}
						onBackToProjects={goBackToProjects}
					/>
				)}
			</div>
		</div>
	)
}
