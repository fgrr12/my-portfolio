import * as path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig({
	base: '/my-portfolio/',
	root: './',
	publicDir: './public',
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	plugins: [tailwindcss(), react()],
	build: {
		// Two real, crawlable URLs so hreflang has something to point at. Same app,
		// different <head> and starting language (see getInitialLanguage).
		rollupOptions: {
			input: {
				main: path.resolve(__dirname, 'index.html'),
				es: path.resolve(__dirname, 'es/index.html'),
			},
		},
	},
})
