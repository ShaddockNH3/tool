import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import WordCount from './views/WordCount.vue'
import JsonFormat from './views/JsonFormat.vue'
import Base64View from './views/Base64View.vue'
import BaseConverter from './views/BaseConverter.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/word-count' },
  { path: '/word-count', name: 'word-count', component: WordCount, meta: { title: '字数统计' } },
  { path: '/json-format', name: 'json-format', component: JsonFormat, meta: { title: 'JSON / HTML 整理' } },
  { path: '/base64', name: 'base64', component: Base64View, meta: { title: 'Base64 转换' } },
  { path: '/base-converter', name: 'base-converter', component: BaseConverter, meta: { title: '进制转换' } },
  { path: '/:pathMatch(.*)*', redirect: '/word-count' },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
