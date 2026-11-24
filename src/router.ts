import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { tools } from './tools/registry'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/HomeView.vue'),
    meta: { title: '主页' },
  },
  ...tools.map<RouteRecordRaw>((tool) => ({
    path: tool.path,
    name: tool.key,
    component: tool.load,
    meta: { title: tool.label },
  })),
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const title = to.meta?.title ? String(to.meta.title) : ''
  document.title = title && to.name !== 'home' ? `${title} · tool.attilio.cc` : 'Attilio 工具箱 · tool.attilio.cc'
})
