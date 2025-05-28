import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'virtual:uno.css'
import './i18n'
import './index.css'

import { App } from './App'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>
)
