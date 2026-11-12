<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NConfigProvider,
  NGlobalStyle,
  NMenu,
  NInput,
  NButton,
  NTag,
  lightTheme,
  darkTheme,
} from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { Wrench, Type, Braces, ArrowLeftRight, Binary, Search, Sun, Moon } from 'lucide-vue-next'
import { themeOverrides } from './theme'
import { useViewport } from './composables/useViewport'

const route = useRoute()
const router = useRouter()
const { isNarrow } = useViewport()
const keyword = ref('')
const isDark = ref(false)

const tools = [
  { label: '字数统计', key: 'word-count', icon: Type },
  { label: 'JSON / HTML 整理', key: 'json-format', icon: Braces },
  { label: 'Base64 转换', key: 'base64', icon: ArrowLeftRight },
  { label: '进制转换', key: 'base-converter', icon: Binary },
]

const menuOptions = computed<MenuOption[]>(() =>
  tools
    .filter((tool) => tool.label.toLowerCase().includes(keyword.value.trim().toLowerCase()))
    .map((tool) => ({
      label: tool.label,
      key: tool.key,
      icon: () => h(tool.icon, { size: 17 }),
    })),
)

const activeKey = computed(() => String(route.name ?? 'word-count'))
const currentTitle = computed(() => String(route.meta.title ?? '字数统计'))

function navigate(key: string | number) {
  void router.push({ name: String(key) })
}
</script>

<template>
  <n-config-provider
    :theme="isDark ? darkTheme : lightTheme"
    :theme-overrides="isDark ? undefined : themeOverrides"
  >
    <n-global-style />
    <div class="app-shell">
      <header class="topbar">
        <div class="topbar-inner">
          <div class="brand">
            <Wrench :size="18" />
            <span>tool</span>
            <span class="host">attilio.cc</span>
          </div>
          <div class="top-search">
            <n-input v-model:value="keyword" placeholder="搜索工具" clearable size="small">
              <template #prefix><Search :size="14" /></template>
            </n-input>
          </div>
          <n-button class="top-action" quaternary circle @click="isDark = !isDark">
            <template #icon>
              <component :is="isDark ? Moon : Sun" :size="16" />
            </template>
          </n-button>
        </div>
      </header>

      <div class="layout">
        <aside class="sidebar">
          <div class="side-label">工具</div>
          <div class="side-nav">
            <n-menu
              :mode="isNarrow ? 'horizontal' : 'vertical'"
              :value="activeKey"
              :options="menuOptions"
              @update:value="navigate"
            />
          </div>
        </aside>

        <main class="main">
          <div class="page-head">
            <h1>{{ currentTitle }}</h1>
            <n-tag size="small" :bordered="false" type="warning" round>本地计算</n-tag>
          </div>
          <router-view />
        </main>
      </div>
    </div>
  </n-config-provider>
</template>
