import TypewriterText from '../TypeWriter/TypeWriter'

export const TopBar = () => {
	return (
		<div className="navbar bg-transparent shadow-sm">
			<div className="navbar-start">
				<TypewriterText as="span" className="px-4 text-xl text-neon typewriter">
					Portfolio of Full Stack Developer
				</TypewriterText>
			</div>
			<div className="navbar-end">
				<div className="dropdown dropdown-end">
					<button type="button" className="px-4 btn-circle border-neon border-1 text-neon">
						<i className="i-flowbite-bars-from-left-outline w-8! h-8!" />
					</button>
					<ul className="menu menu-sm dropdown-content bg-base-100 rounded-box border-neon border-1 z-1 mt-3 w-52 p-2 shadow">
						<li>
							<button type="button" className="text-neon">
								Show Projects
							</button>
						</li>
						<div className="divider m-0" />
						<li>
							<button type="button" className="text-neon">
								About Me
							</button>
						</li>
						<div className="divider m-0" />
						<li>
							<button type="button" className="text-neon">
								Contact Me
							</button>
						</li>
					</ul>
				</div>
			</div>
		</div>
	)
}
