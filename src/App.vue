<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu, Home, Search, Sun, Moon, ChevronDown, X } from 'lucide-vue-next'
import BrandIcon from './components/BrandIcon.vue'
import { UiButton, UiInput } from './components/ui'
import { useTheme } from './composables/useTheme'
import { tools, toolGroups } from './tools/registry'
import type { ToolGroupId } from './tools/registry'

const route = useRoute()
const router = useRouter()
const { isDark, toggleTheme } = useTheme()

const keyword = ref('')
provide('toolSearchKeyword', keyword)

const isDesktop = ref(true)
const drawerOpen = ref(true)
const isScrolled = ref(false)
const searchRef = ref<InstanceType<typeof UiInput> | null>(null)

const openGroups = reactive<Record<ToolGroupId, boolean>>({
  'text-code': true,
  'encode-convert': true,
  'date-time': true,
})

let desktopQuery: MediaQueryList | undefined

const isHome = computed(() => route.name === 'home')
const activeKey = computed(() => String(route.name ?? 'home'))
const currentTitle = computed(() => String(route.meta.title ?? ''))

const groupedTools = computed(() => {
  const q = keyword.value.trim().toLowerCase()
  return toolGroups
    .map((group) => {
      const items = tools.filter((tool) => {
        if (tool.group !== group.id) return false
        if (!q) return true
        return (
          tool.label.toLowerCase().includes(q) ||
          tool.shortDesc.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.tag.toLowerCase().includes(q) ||
          tool.key.includes(q)
        )
      })
      return { ...group, items }
    })
    .filter((group) => group.items.length > 0)
})

function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value
}

function closeDrawerOnMobile() {
  if (!isDesktop.value) {
    drawerOpen.value = false
  }
}

function toggleGroup(id: ToolGroupId) {
  openGroups[id] = !openGroups[id]
}

function navigate(key: string) {
  void router.push({ name: key })
  closeDrawerOnMobile()
}

function syncViewport() {
  const desktop = desktopQuery?.matches ?? true
  isDesktop.value = desktop
  drawerOpen.value = desktop
}

function handleScroll() {
  isScrolled.value = window.scrollY > 4
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && !isDesktop.value && drawerOpen.value) {
    drawerOpen.value = false
    return
  }
  if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return
  const target = event.target as HTMLElement | null
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
    return
  }
  event.preventDefault()
  if (!drawerOpen.value) drawerOpen.value = true
  requestAnimationFrame(() => searchRef.value?.focus())
}

watch(
  () => route.fullPath,
  () => {
    closeDrawerOnMobile()
  },
)

onMounted(() => {
  desktopQuery = window.matchMedia('(min-width: 1025px)')
  syncViewport()
  desktopQuery.addEventListener('change', syncViewport)
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  desktopQuery?.removeEventListener('change', syncViewport)
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="app-shell" :class="{ 'drawer-docked': isDesktop && drawerOpen }">
    <header class="appbar" :class="{ 'is-scrolled': isScrolled }">
      <div class="appbar-left">
        <UiButton
          variant="plain"
          circle
          :aria-label="drawerOpen ? '收起导航菜单' : '展开导航菜单'"
          @click="toggleDrawer"
        >
          <template #icon>
            <Menu :size="19" />
          </template>
        </UiButton>

        <router-link to="/" class="brand">
          <BrandIcon :size="24" />
          <span class="brand-name">Attilio</span>
        </router-link>

        <template v-if="!isHome && currentTitle">
          <span class="appbar-sep" aria-hidden="true">/</span>
          <span class="appbar-current">{{ currentTitle }}</span>
        </template>
      </div>

      <div class="appbar-right">
        <UiButton
          v-if="!isHome"
          variant="plain"
          circle
          aria-label="返回主页"
          @click="navigate('home')"
        >
          <template #icon>
            <Home :size="17" />
          </template>
        </UiButton>
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

    <Transition name="fade-mask">
      <div
        v-if="!isDesktop && drawerOpen"
        class="drawer-backdrop"
        aria-hidden="true"
        @click="drawerOpen = false"
      />
    </Transition>

    <aside
      class="drawer"
      :class="{ 'is-open': drawerOpen, 'is-overlay': !isDesktop }"
      aria-label="工具导航抽屉"
    >
      <div v-if="!isDesktop" class="drawer-mobile-head">
        <router-link to="/" class="brand" @click="closeDrawerOnMobile">
          <BrandIcon :size="22" />
          <span class="brand-name">Attilio 工具箱</span>
        </router-link>
        <UiButton variant="plain" circle size="sm" aria-label="关闭菜单" @click="drawerOpen = false">
          <template #icon><X :size="16" /></template>
        </UiButton>
      </div>

      <div class="drawer-search">
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

      <nav class="drawer-nav">
        <button
          type="button"
          class="drawer-home-item"
          :class="{ 'is-active': isHome }"
          @click="navigate('home')"
        >
          <Home :size="16" />
          <span>主页</span>
        </button>

        <div class="drawer-divider" />

        <div v-for="group in groupedTools" :key="group.id" class="drawer-group">
          <button
            type="button"
            class="drawer-group-head"
            :aria-expanded="openGroups[group.id] || Boolean(keyword.trim())"
            @click="toggleGroup(group.id)"
          >
            <span class="drawer-group-icon">
              <component :is="group.icon" :size="15" />
            </span>
            <span class="drawer-group-label">{{ group.label }}</span>
            <ChevronDown
              :size="15"
              class="drawer-group-arrow"
              :class="{ 'is-open': openGroups[group.id] || Boolean(keyword.trim()) }"
            />
          </button>

          <div
            class="drawer-group-body"
            :class="{ 'is-open': openGroups[group.id] || Boolean(keyword.trim()) }"
          >
            <div class="drawer-group-inner">
              <button
                v-for="tool in group.items"
                :key="tool.key"
                type="button"
                class="drawer-item"
                :class="{ 'is-active': activeKey === tool.key }"
                @click="navigate(tool.key)"
              >
                <span class="drawer-item-title">{{ tool.label }}</span>
                <span class="drawer-item-sub">{{ tool.shortDesc }}</span>
              </button>
            </div>
          </div>
        </div>

        <div v-if="groupedTools.length === 0" class="drawer-empty">
          没有匹配“{{ keyword }}”的工具
        </div>
      </nav>
    </aside>

    <main class="workspace">
      <div class="workspace-inner" :class="{ 'is-home': isHome }">
        <router-view v-slot="{ Component }">
          <Transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </router-view>
      </div>
    </main>
  </div>
</template>
