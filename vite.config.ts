import * as path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig, type Plugin } from 'vite'

import { buildCvHtml } from './scripts/cv-html'
import { buildSeoHtml } from './scripts/seo-html'

/**
 * Injects the crawler/screen-reader content block into both entry HTML files.
 * Runs for `vite dev` too, so what ships is what you can inspect locally.
 */
const seoContent = (): Plugin => ({
	name: 'inject-seo-content',
	transformIndexHtml: {
		order: 'pre',
		handler: (html, ctx) => {
			const language = ctx.path.includes('/es/') ? 'es' : 'en'
			return html.replace('<div id="root"></div>', `<div id="root"></div>${buildSeoHtml(language)}`)
		},
	},
})

/**
 * Emits the printable CV alongside the site. `pnpm cv` then prints it to PDF —
 * keeping generation in the build is what guarantees the CV and the portfolio
 * are reading the same data.
 */
const cvPage = (): Plugin => ({
	name: 'emit-cv-html',
	generateBundle() {
		for (const language of ['en', 'es'] as const) {
			this.emitFile({
				type: 'asset',
				fileName: `cv-${language}.html`,
				source: buildCvHtml(language),
			})
		}
	},
})

export default defineConfig({
	base: '/my-portfolio/',
	root: './',
	publicDir: './public',
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	plugins: [tailwindcss(), react(), seoContent(), cvPage()],
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
