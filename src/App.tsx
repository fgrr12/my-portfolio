import { useEffect, useState } from 'react'

import { Companion } from '@/components/companion/Companion'
import { DigitalRain } from '@/components/effects/DigitalRain'
import { GlitchEffect } from '@/components/effects/GlitchEffect'
import { SnowEffect } from '@/components/effects/SnowEffect'
import { ActionBar } from '@/components/shell/ActionBar'
import { CommandPalette } from '@/components/shell/CommandPalette'
import { FileTree } from '@/components/shell/FileTree'
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
		selectedProjectId,
		projects,
		soundEnabled,
		companionVisible,
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

	const [paletteOpen, setPaletteOpen] = useState(false)

	/**
	 * ⌘K / Ctrl+K is an app-level shortcut, so it belongs on the document — unlike
	 * arrows and Tab, which the prompt owns and which a document listener would
	 * fight over (see useTerminal.handleKeyDown).
	 */
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
				event.preventDefault()
				setPaletteOpen((open) => !open)
			}
		}

		document.addEventListener('keydown', onKeyDown)
		return () => document.removeEventListener('keydown', onKeyDown)
	}, [])

	// The MOTD has an empty input, so it does not count as a command the visitor ran.
	const showTour = !commandHistory.some((command) => command.input !== '')

	useEffect(() => {
		playStartup()
	}, [playStartup])

	return (
		<LanguageProvider value={language}>
			<div className="app-shell">
				<DigitalRain isActive={digitalRainMode} />
				<SnowEffect isActive={isSnowing} />
				<GlitchEffect isActive={isGlitching} />

				<TitleBar
					panes={PANES}
					activePane={activePane}
					onSelect={setActivePane}
					onOpenPalette={() => setPaletteOpen(true)}
				/>

				<CommandPalette
					open={paletteOpen}
					onClose={() => setPaletteOpen(false)}
					projects={projects}
					onRun={handleQuickCommand}
				/>

				{/* relative, so the pet is positioned against the pane row: it floats over
				    the terminal but never over the action bar or the status line. */}
				<div className="flex flex-1 min-h-0 relative">
					<FileTree
						projects={projects}
						activePane={activePane}
						selectedProjectId={selectedProjectId}
						onRun={handleQuickCommand}
						onRunTour={runTour}
						showTour={showTour}
						disabled={isProcessing}
					/>

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

					{/* Chrome, like every other affordance: it floats above the viewport
					    rather than printing itself into the scrollback. */}
					<Companion
						visible={companionVisible}
						isProcessing={isProcessing}
						currentInput={currentInput}
						commandHistory={commandHistory}
						selectedProject={selectedProject}
						digitalRainMode={digitalRainMode}
						isSnowing={isSnowing}
						isGlitching={isGlitching}
						soundEnabled={soundEnabled}
						onRun={handleQuickCommand}
					/>
				</div>

				{/* Below lg there is no room for the sidebar, so the same commands come
				    back as a chip row. Same navigation, form suited to the width. */}
				<ActionBar
					onRun={handleQuickCommand}
					onRunTour={runTour}
					showTour={showTour}
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
