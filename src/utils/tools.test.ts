import { describe, expect, it } from 'vitest'
import { countText } from './count'
import { encodeBase64, decodeBase64 } from './base64'
import { convertBase, MIN_BASE, MAX_BASE } from './base'
import { formatJson, minifyHtml } from './format'
import { diffDates, parseISODate, isLeapYear, addDays, sameDayNextYear } from './dateDiff'

describe('countText', () => {
  it('按字素计数，emoji 只算一个', () => {
    const result = countText('鲸🐋')
    expect(result.chars).toBe(2)
    expect(result.han).toBe(1)
  })

  it('统计行数与 UTF-8 字节数', () => {
    const result = countText('ab\n中文')
    expect(result.lines).toBe(2)
    expect(result.bytes).toBe(9)
  })

  it('空文本全为 0', () => {
    expect(countText('')).toEqual({ chars: 0, han: 0, words: 0, lines: 0, bytes: 0 })
  })
})

describe('base64', () => {
  it('中文和 emoji 可往返', () => {
    const text = '今天改完了工具站 🐋'
    expect(decodeBase64(encodeBase64(text))).toBe(text)
  })

  it('URL 安全变体不含 + / =', () => {
    const encoded = encodeBase64('??>>>', 'url')
    expect(encoded).not.toMatch(/[+/=]/)
    expect(decodeBase64(encoded, 'url')).toBe('??>>>')
  })

  it('非法输入抛错', () => {
    expect(() => decodeBase64('!!!')).toThrow()
  })
})

describe('convertBase', () => {
  it('大整数不丢精度', () => {
    const decimal = '123456789012345678901234567890'
    const hex = convertBase(decimal, 10, 16)
    expect(convertBase(hex, 16, 10)).toBe(decimal)
  })

  it('常见进制互转', () => {
    expect(convertBase('255', 10, 16)).toBe('ff')
    expect(convertBase('ff', 16, 2)).toBe('11111111')
    expect(convertBase('zz', 36, 10)).toBe('1295')
  })

  it('保留负号', () => {
    expect(convertBase('-10', 10, 2)).toBe('-1010')
  })

  it('非法字符与越界进制抛错', () => {
    expect(() => convertBase('2', 2, 10)).toThrow()
    expect(() => convertBase('10', MIN_BASE - 1, 10)).toThrow()
    expect(() => convertBase('10', 10, MAX_BASE + 1)).toThrow()
  })
})

describe('format', () => {
  it('JSON 美化与压缩', () => {
    expect(formatJson('{"a":1}', 'pretty')).toBe('{\n  "a": 1\n}')
    expect(formatJson('{ "a" : 1 }', 'minify')).toBe('{"a":1}')
  })

  it('非法 JSON 抛错', () => {
    expect(() => formatJson('{oops', 'pretty')).toThrow()
  })

  it('HTML 压缩去掉标签间空白', () => {
    expect(minifyHtml('<div>\n  <span>hi</span>\n</div>')).toBe('<div><span>hi</span></div>')
  })
})

describe('dateDiff', () => {
  it('跨月跨年算准天数', () => {
    const result = diffDates('2027-04-01', '2026-11-13')
    expect(result.days).toBe(139)
    expect(result.relation).toBe('future')
    expect(result.weekday).toBe('星期四')
    expect(result.dayOfYear).toBe(91)
  })

  it('过去日期得到负天数，当天为 0', () => {
    expect(diffDates('2026-11-01', '2026-11-13').days).toBe(-12)
    expect(diffDates('2026-11-13', '2026-11-13')).toMatchObject({ days: 0, relation: 'today', weekday: '星期五' })
  })

  it('跨夏令时切换日仍是整天数', () => {
    expect(diffDates('2026-03-09', '2026-03-07').days).toBe(2)
  })

  it('非法日期抛错', () => {
    expect(() => parseISODate('2027-02-29')).toThrow()
    expect(() => parseISODate('2026-13-01')).toThrow()
    expect(() => parseISODate('2026/11/13')).toThrow()
  })

  it('闰年判断按世纪规则', () => {
    expect(isLeapYear(2000)).toBe(true)
    expect(isLeapYear(1900)).toBe(false)
    expect(isLeapYear(2028)).toBe(true)
  })

  it('日期加减跨闰日与年末', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29')
    expect(addDays('2026-11-13', -13)).toBe('2026-10-31')
  })

  it('明年今天遇到平年 2 月 29 日顺延到 3 月 1 日', () => {
    expect(sameDayNextYear('2028-02-29')).toBe('2029-03-01')
    expect(sameDayNextYear('2026-11-13')).toBe('2027-11-13')
  })
})
