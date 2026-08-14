import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

/**
 * Prints the CV pages emitted by `vite build` to PDF.
 *
 * Chrome is the renderer because it is the only thing that already agrees with
 * how the HTML looks, and because it is already on the machine — a PDF library
 * would mean re-describing the layout in a second language.
 *
 * The PDFs are committed, so CI stays a plain `vite build` with no browser step.
 * Re-run this whenever src/data/cv.ts changes.
 */

const CHROME =
	process.env.CHROME_PATH ??
	(process.platform === 'darwin'
		? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
		: 'google-chrome')

const OUTPUTS = [
	{ page: 'cv-en.html', pdf: 'public/assets/documents/CV - Fabricio Rojas.pdf' },
	{ page: 'cv-es.html', pdf: 'public/assets/documents/CV - Fabricio Rojas (ES).pdf' },
]

if (!existsSync(CHROME)) {
	console.error(`Chrome not found at ${CHROME}. Set CHROME_PATH to override.`)
	process.exit(1)
}

for (const { page, pdf } of OUTPUTS) {
	const source = resolve('dist', page)

	if (!existsSync(source)) {
		console.error(`Missing ${source}. Run \`pnpm build\` first.`)
		process.exit(1)
	}

	const target = resolve(pdf)
	mkdirSync(dirname(target), { recursive: true })

	execFileSync(CHROME, [
		'--headless',
		'--disable-gpu',
		'--no-pdf-header-footer',
		`--print-to-pdf=${target}`,
		`file://${source}`,
	])

	console.log(`✓ ${pdf}`)
}
