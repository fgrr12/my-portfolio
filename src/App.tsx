import { useEffect } from 'react'

import { DigitalRain } from '@/components/effects/DigitalRain'
import { GlitchEffect } from '@/components/effects/GlitchEffect'
import { SnowEffect } from '@/components/effects/SnowEffect'
import { MainTerminal } from '@/components/terminal/MainTerminal'
import { ProjectsTerminal } from '@/components/terminal/ProjectsTerminal'
import { ControlPanel } from '@/components/ui/ControlPanel'

import { useTerminal } from '@/hooks/useTerminal'

import { LanguageProvider } from '@/i18n'

export const App = () => {
	const {
		currentInput,
		commandHistory,
		suggestions,
		isProcessing,
		showProjects,
		selectedProject,
		projects,
		quickCommands,
		soundEnabled,
		language,
		digitalRainMode,
		isSnowing,
		isGlitching,
		handleInputChange,
		handleKeyDown,
		handleQuickCommand,
		runTour,
		selectSuggestion,
		closeProjects,
		selectProject,
		goBackToProjects,
		playStartup,
		toggleSound,
		toggleLanguage,
	} = useTerminal()

	useEffect(() => {
		playStartup()
	}, [playStartup])

	return (
		<LanguageProvider value={language}>
			<div className="h-screen bg-gray-950 p-4 font-mono pipboy-bg relative">
				<DigitalRain isActive={digitalRainMode} />
				<SnowEffect isActive={isSnowing} />
				<GlitchEffect isActive={isGlitching} />

				<ControlPanel
					soundEnabled={soundEnabled}
					language={language}
					onToggleSound={toggleSound}
					onToggleLanguage={toggleLanguage}
				/>

				<div className="max-w-7xl mx-auto h-full flex flex-col lg:flex-row gap-4 relative z-10">
					<MainTerminal
						commandHistory={commandHistory}
						currentInput={currentInput}
						suggestions={suggestions}
						isProcessing={isProcessing}
						quickCommands={quickCommands}
						onInputChange={handleInputChange}
						onKeyDown={handleKeyDown}
						onSuggestionSelect={selectSuggestion}
						onQuickCommand={handleQuickCommand}
						onRunTour={runTour}
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
		</LanguageProvider>
	)
}
