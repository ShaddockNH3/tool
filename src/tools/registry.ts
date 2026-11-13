import type { Component } from 'vue'
import { Type, Braces, ArrowLeftRight, Binary, CalendarDays } from 'lucide-vue-next'

export interface ToolEntry {
  /** 路由 name，同时作为侧栏菜单的 key */
  key: string
  path: string
  label: string
  icon: Component
  /** 懒加载页面，构建时按工具切分 chunk */
  load: () => Promise<{ default: Component }>
}

export const tools: ToolEntry[] = [
  {
    key: 'word-count',
    path: '/word-count',
    label: '字数统计',
    icon: Type,
    load: () => import('../views/WordCount.vue'),
  },
  {
    key: 'json-format',
    path: '/json-format',
    label: 'JSON / HTML 整理',
    icon: Braces,
    load: () => import('../views/JsonFormat.vue'),
  },
  {
    key: 'base64',
    path: '/base64',
    label: 'Base64 转换',
    icon: ArrowLeftRight,
    load: () => import('../views/Base64View.vue'),
  },
  {
    key: 'base-converter',
    path: '/base-converter',
    label: '进制转换',
    icon: Binary,
    load: () => import('../views/BaseConverter.vue'),
  },
  {
    key: 'date-diff',
    path: '/date-diff',
    label: '日期计算',
    icon: CalendarDays,
    load: () => import('../views/DateDiff.vue'),
  },
]

export const defaultTool = tools[0]
