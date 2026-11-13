import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { tools, defaultTool } from './tools/registry'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: defaultTool.path },
  ...tools.map<RouteRecordRaw>((tool) => ({
    path: tool.path,
    name: tool.key,
    component: tool.load,
    meta: { title: tool.label },
  })),
  { path: '/:pathMatch(.*)*', redirect: defaultTool.path },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
