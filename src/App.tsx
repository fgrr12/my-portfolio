import { useEffect } from 'react'

import { DigitalRain } from '@/components/effects/DigitalRain'
import { GlitchEffect } from '@/components/effects/GlitchEffect'
import { SnowEffect } from '@/components/effects/SnowEffect'
import { ActionBar } from '@/components/shell/ActionBar'
import { StatusLine } from '@/components/shell/StatusLine'
import { TitleBar } from '@/components/shell/TitleBar'
import { MainTerminal } from '@/components/terminal/MainTerminal'
import { ProjectsTerminal } from '@/components/terminal/ProjectsTerminal'

import { useTerminal } from '@/hooks/useTerminal'

import { LanguageProvider } from '@/i18n'

const PANES = [
	{ id: 'main', label: 'main' },
	{ id: 'projects', label: 'projects' },
] as const

export const App = () => {
	const {
		currentInput,
		commandHistory,
		suggestions,
		isProcessing,
		activePane,
		selectedProject,
		projects,
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
		setActivePane,
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
			<div className="app-shell">
				<DigitalRain isActive={digitalRainMode} />
				<SnowEffect isActive={isSnowing} />
				<GlitchEffect isActive={isGlitching} />

				<TitleBar panes={PANES} activePane={activePane} onSelect={setActivePane} />

				<main className="pane min-w-0">
					{activePane === 'main' ? (
						<MainTerminal
							commandHistory={commandHistory}
							currentInput={currentInput}
							suggestions={suggestions}
							isProcessing={isProcessing}
							onInputChange={handleInputChange}
							onKeyDown={handleKeyDown}
							onSuggestionSelect={selectSuggestion}
						/>
					) : (
						<ProjectsTerminal
							projects={projects}
							selectedProject={selectedProject}
							onSelectProject={selectProject}
							onBackToProjects={goBackToProjects}
						/>
					)}
				</main>

				<ActionBar
					onRun={handleQuickCommand}
					onRunTour={runTour}
					showTour={!commandHistory.some((command) => command.input !== '')}
					disabled={isProcessing}
				/>

				<StatusLine
					panes={PANES}
					activePane={activePane}
					onSelectPane={setActivePane}
					isProcessing={isProcessing}
					soundEnabled={soundEnabled}
					language={language}
					onToggleSound={toggleSound}
					onToggleLanguage={toggleLanguage}
				/>
			</div>
		</LanguageProvider>
	)
}
