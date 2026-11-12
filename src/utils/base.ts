const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz'

export const MIN_BASE = 2
export const MAX_BASE = 36

export function convertBase(value: string, from: number, to: number): string {
  const valid = (n: number) => Number.isInteger(n) && n >= MIN_BASE && n <= MAX_BASE
  if (!valid(from) || !valid(to)) throw new Error('进制必须在 2 到 36 之间')

  const trimmed = value.trim().replace(/\s+/g, '')
  if (!trimmed) return ''

  const negative = trimmed.startsWith('-')
  const body = negative ? trimmed.slice(1) : trimmed
  if (!body) return ''

  const source = BigInt(from)
  let decimal = 0n
  for (const char of body.toLowerCase()) {
    const digit = DIGITS.indexOf(char)
    if (digit < 0 || BigInt(digit) >= source) throw new Error(`「${char}」不属于 ${from} 进制`)
    decimal = decimal * source + BigInt(digit)
  }

  if (decimal === 0n) return '0'

  const target = BigInt(to)
  let result = ''
  while (decimal > 0n) {
    result = DIGITS[Number(decimal % target)] + result
    decimal /= target
  }
  return negative ? `-${result}` : result
}
