import type { Component } from 'vue'
import { Type, Braces, ArrowLeftRight, Binary, CalendarDays } from 'lucide-vue-next'

export interface ToolEntry {
  /** 路由 name，同时作为侧栏菜单的 key */
  key: string
  path: string
  label: string
  description: string
  tag: string
  icon: Component
  /** 懒加载页面，构建时按工具切分 chunk */
  load: () => Promise<{ default: Component }>
}

export const tools: ToolEntry[] = [
  {
    key: 'word-count',
    path: '/word-count',
    label: '字数统计',
    description: '实时统计字符、中文汉字、词数、行数与 UTF-8 字节数，支持 emoji。',
    tag: '文本',
    icon: Type,
    load: () => import('../views/WordCount.vue'),
  },
  {
    key: 'json-format',
    path: '/json-format',
    label: 'JSON / HTML 整理',
    description: '一键美化或压缩 JSON 与 HTML 代码，自动校验语法并支持快捷复制。',
    tag: '格式化',
    icon: Braces,
    load: () => import('../views/JsonFormat.vue'),
  },
  {
    key: 'base64',
    path: '/base64',
    label: 'Base64 转换',
    description: 'UTF-8 文本与 Base64 双向编解码，支持标准模式与 URL 安全变体。',
    tag: '编码',
    icon: ArrowLeftRight,
    load: () => import('../views/Base64View.vue'),
  },
  {
    key: 'base-converter',
    path: '/base-converter',
    label: '进制转换',
    description: '支持 2 到 36 进制任意大整数互转，提供常用进制快捷切换。',
    tag: '换算',
    icon: Binary,
    load: () => import('../views/BaseConverter.vue'),
  },
  {
    key: 'date-diff',
    path: '/date-diff',
    label: '日期计算',
    description: '计算目标日期距今天数、周数、星期、当年第几天与闰年信息。',
    tag: '日期',
    icon: CalendarDays,
    load: () => import('../views/DateDiff.vue'),
  },
]

export const defaultTool = tools[0]
