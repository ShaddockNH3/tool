const MS_PER_DAY = 86_400_000
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/
const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

export interface CalendarDate {
  year: number
  month: number
  day: number
}

export interface DateDiffResult {
  /** 有符号天数，正数表示目标日期在未来 */
  days: number
  absDays: number
  weeks: number
  restDays: number
  weekday: string
  weekdayIndex: number
  isLeap: boolean
  dayOfYear: number
  target: string
  today: string
  relation: 'future' | 'past' | 'today'
}

/**
 * 把年月日归一到 UTC 零点后再做算术。
 * 直接用本地时间减会踩夏令时：那两天只有 23 或 25 小时，除以一天的毫秒数会掉一天。
 */
function utcStamp(year: number, month: number, day: number): number {
  const stamp = new Date(0)
  stamp.setUTCFullYear(year, month - 1, day)
  stamp.setUTCHours(0, 0, 0, 0)
  return stamp.getTime()
}

function formatISO(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function parseISODate(text: string): CalendarDate {
  const matched = ISO_DATE.exec(text.trim())
  if (!matched) throw new Error('日期格式应为 YYYY-MM-DD')

  const year = Number(matched[1])
  const month = Number(matched[2])
  const day = Number(matched[3])
  if (year < 1 || year > 9999) throw new Error('年份超出支持范围')

  const probe = new Date(utcStamp(year, month, day))
  if (probe.getUTCFullYear() !== year || probe.getUTCMonth() !== month - 1 || probe.getUTCDate() !== day) {
    throw new Error('这个日期不存在')
  }
  return { year, month, day }
}

export function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
}

export function todayISO(now: Date = new Date()): string {
  return formatISO(now.getFullYear(), now.getMonth() + 1, now.getDate())
}

export function addDays(iso: string, days: number): string {
  const { year, month, day } = parseISODate(iso)
  const next = new Date(utcStamp(year, month, day) + days * MS_PER_DAY)
  return formatISO(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate())
}

/** 明年同一天；2 月 29 日碰上平年就落到 3 月 1 日，不然会得到不存在的日期 */
export function sameDayNextYear(iso: string): string {
  const { year, month, day } = parseISODate(iso)
  const nextYear = year + 1
  if (month === 2 && day === 29 && !isLeapYear(nextYear)) return formatISO(nextYear, 3, 1)
  return formatISO(nextYear, month, day)
}

export function diffDates(target: string, today: string): DateDiffResult {
  const goal = parseISODate(target)
  const base = parseISODate(today)

  const days = Math.round((utcStamp(goal.year, goal.month, goal.day) - utcStamp(base.year, base.month, base.day)) / MS_PER_DAY)
  const absDays = Math.abs(days)
  const weekdayIndex = new Date(utcStamp(goal.year, goal.month, goal.day)).getUTCDay()
  const dayOfYear = Math.round((utcStamp(goal.year, goal.month, goal.day) - utcStamp(goal.year, 1, 1)) / MS_PER_DAY) + 1

  return {
    days,
    absDays,
    weeks: Math.floor(absDays / 7),
    restDays: absDays % 7,
    weekday: WEEKDAYS[weekdayIndex],
    weekdayIndex,
    isLeap: isLeapYear(goal.year),
    dayOfYear,
    target: formatISO(goal.year, goal.month, goal.day),
    today: formatISO(base.year, base.month, base.day),
    relation: days > 0 ? 'future' : days < 0 ? 'past' : 'today',
  }
}

export function diffFromToday(target: string, today: string = todayISO()): DateDiffResult {
  return diffDates(target, today)
}

export function describeDiff(result: DateDiffResult): string {
  if (result.relation === 'today') return '就是今天'
  return result.relation === 'future' ? `还有 ${result.absDays} 天` : `已经过去 ${result.absDays} 天`
}
