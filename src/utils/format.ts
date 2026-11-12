import type { Options } from 'prettier'

export type FormatKind = 'json' | 'html'
export type FormatMode = 'pretty' | 'minify'

export function formatJson(input: string, mode: FormatMode): string {
  const parsed: unknown = JSON.parse(input)
  return mode === 'pretty' ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed)
}

export function minifyHtml(input: string): string {
  return input.replace(/>\s+</g, '><').trim()
}

export async function formatHtml(input: string, mode: FormatMode): Promise<string> {
  if (mode === 'minify') return minifyHtml(input)

  const prettier = await import('prettier/standalone')
  const [html, babel, estree, postcss] = await Promise.all([
    import('prettier/plugins/html'),
    import('prettier/plugins/babel'),
    import('prettier/plugins/estree'),
    import('prettier/plugins/postcss'),
  ])

  const options: Options = {
    parser: 'html',
    plugins: [html, babel, estree, postcss] as Options['plugins'],
    printWidth: 100,
  }
  return prettier.format(input, options)
}
