export type Base64Variant = 'standard' | 'url'

function toUrlSafe(encoded: string): string {
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function encodeBase64(text: string, variant: Base64Variant = 'standard'): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  const encoded = btoa(binary)
  return variant === 'url' ? toUrlSafe(encoded) : encoded
}

export function decodeBase64(encoded: string, variant: Base64Variant = 'standard'): string {
  const trimmed = encoded.trim().replace(/\s+/g, '')
  if (!trimmed) return ''

  let normalized = variant === 'url' ? trimmed.replace(/-/g, '+').replace(/_/g, '/') : trimmed
  while (normalized.length % 4) normalized += '='

  const binary = atob(normalized)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder('utf-8').decode(bytes)
}
