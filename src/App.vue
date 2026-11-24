<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Wrench, Search, Sun, Moon } from 'lucide-vue-next'
import { UiButton, UiChip, UiInput } from './components/ui'
import { useTheme } from './composables/useTheme'
import { tools, defaultTool } from './tools/registry'

const route = useRoute()
const router = useRouter()
const { isDark, toggleTheme } = useTheme()

const keyword = ref('')
const isScrolled = ref(false)
const searchRef = ref<InstanceType<typeof UiInput> | null>(null)

const filteredTools = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) return tools
  return tools.filter((tool) => tool.label.toLowerCase().includes(q) || tool.key.includes(q))
})

const activeKey = computed(() => String(route.name ?? defaultTool.key))
const currentTitle = computed(() => String(route.meta.title ?? defaultTool.label))

function navigate(key: string) {
  void router.push({ name: key })
}

function handleScroll() {
  isScrolled.value = window.scrollY > 8
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return
  const target = event.target as HTMLElement | null
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
    return
  }
  event.preventDefault()
  searchRef.value?.focus()
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="app-shell">
    <div class="topbar-wrap">
      <header class="topbar" :class="{ 'is-scrolled': isScrolled }">
        <router-link to="/" class="brand">
          <span class="brand-icon"><Wrench :size="18" /></span>
          <span>Attilio</span>
          <span class="host">tool.attilio.cc</span>
        </router-link>

        <div class="top-search">
          <UiInput
            ref="searchRef"
            v-model="keyword"
            placeholder="搜索工具 (/)"
            size="sm"
            clearable
          >
            <template #prefix><Search :size="14" /></template>
          </UiInput>
        </div>

        <div class="top-actions">
          <UiButton
            variant="plain"
            circle
            :aria-label="isDark ? '切换亮色主题' : '切换暗色主题'"
            @click="toggleTheme"
          >
            <template #icon>
              <component :is="isDark ? Moon : Sun" :size="17" />
            </template>
          </UiButton>
        </div>
      </header>
    </div>

    <div class="layout">
      <aside class="sidebar">
        <div class="side-card">
          <div class="side-label">
            <span>工具箱</span>
            <span>{{ filteredTools.length }}</span>
          </div>
          <nav class="side-nav" aria-label="工具导航">
            <button
              v-for="tool in filteredTools"
              :key="tool.key"
              type="button"
              class="side-link"
              :class="{ 'is-active': activeKey === tool.key }"
              @click="navigate(tool.key)"
            >
              <component :is="tool.icon" :size="17" />
              <span>{{ tool.label }}</span>
            </button>
            <div v-if="filteredTools.length === 0" class="side-empty">没有匹配的工具</div>
          </nav>
        </div>
      </aside>

      <main class="main">
        <div class="page-head">
          <h1>{{ currentTitle }}</h1>
          <UiChip shape="pill" active :clickable="false">本地计算</UiChip>
        </div>
        <router-view />
      </main>
    </div>
  </div>
</template>
