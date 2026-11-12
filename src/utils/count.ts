export interface CountResult {
  chars: number
  han: number
  words: number
  lines: number
  bytes: number
}

function countGraphemes(text: string): number {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter('zh', { granularity: 'grapheme' })
    let total = 0
    for (const _part of segmenter.segment(text)) total += 1
    return total
  }
  return Array.from(text).length
}

export function countText(text: string): CountResult {
  return {
    chars: countGraphemes(text),
    han: (text.match(/[一-鿿]/g) ?? []).length,
    words: (text.match(/[一-鿿]|[a-zA-Z0-9']+/g) ?? []).length,
    lines: text ? text.split(/\r\n|\r|\n/).length : 0,
    bytes: new TextEncoder().encode(text).length,
  }
}
