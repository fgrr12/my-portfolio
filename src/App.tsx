import MainTerminal from './components/MainTerminal'
import ProjectsTerminal from './components/ProjectsTerminal'
import { useTerminal } from './hooks/useTerminal'

export default function FunctionalTerminal() {
	const {
		currentInput,
		commandHistory,
		suggestions,
		isProcessing,
		showProjects,
		projects,
		availableCommands,
		handleInputChange,
		handleKeyDown,
		handleQuickCommand,
		selectSuggestion,
		closeProjects,
	} = useTerminal()

	return (
		<div className="h-screen bg-gray-950 p-4 font-mono pipboy-bg">
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

				{showProjects && <ProjectsTerminal projects={projects} onClose={closeProjects} />}
			</div>
		</div>
	)
}
