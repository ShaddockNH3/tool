<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronRight } from 'lucide-vue-next'
import BrandIcon from '../components/BrandIcon.vue'
import { UiChip } from '../components/ui'
import { tools, toolGroups } from '../tools/registry'

const router = useRouter()
const sharedKeyword = inject<Ref<string>>('toolSearchKeyword', ref(''))

const sections = computed(() => {
  const q = sharedKeyword.value.trim().toLowerCase()
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
    .filter((section) => section.items.length > 0)
})

function openTool(key: string) {
  void router.push({ name: key })
}
</script>

<template>
  <div class="home-page">
    <header class="home-banner">
      <div class="home-emblem">
        <BrandIcon :size="52" />
      </div>
      <h1 class="home-title">Attilio 工具箱</h1>
      <p class="home-subtitle">
        纯前端本地运行的轻量小工具集合，零上传、打开即用。
      </p>
      <div class="home-meta">
        <UiChip shape="pill" active :clickable="false">{{ tools.length }} 个工具</UiChip>
        <UiChip shape="pill" :clickable="false">本地计算</UiChip>
        <UiChip shape="pill" :clickable="false">按 / 搜索</UiChip>
      </div>
    </header>

    <div v-if="sections.length > 0" class="home-groups">
      <section v-for="section in sections" :key="section.id" class="home-group">
        <div class="home-group-head">
          <component :is="section.icon" :size="15" class="home-group-icon" />
          <h2>{{ section.label }}</h2>
        </div>

        <div class="home-list">
          <button
            v-for="tool in section.items"
            :key="tool.key"
            type="button"
            class="home-row"
            @click="openTool(tool.key)"
          >
            <span class="home-row-icon">
              <component :is="tool.icon" :size="18" />
            </span>
            <span class="home-row-body">
              <span class="home-row-title">{{ tool.label }}</span>
              <span class="home-row-desc">{{ tool.description }}</span>
            </span>
            <ChevronRight :size="16" class="home-row-arrow" />
          </button>
        </div>
      </section>
    </div>

    <div v-else class="home-empty">
      没有找到匹配“{{ sharedKeyword }}”的工具
    </div>

    <footer class="home-footer">
      <span>tool.attilio.cc</span>
      <span>·</span>
      <span>从左侧菜单或上方列表选择任意工具开始</span>
    </footer>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 12px 0 24px;
}

.home-banner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px 12px 4px;
}

.home-emblem {
  position: relative;
  margin-bottom: 16px;
}

.home-emblem::before {
  content: '';
  position: absolute;
  inset: -14px;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in oklch, var(--primary) 24%, transparent) 0%, transparent 70%);
  pointer-events: none;
}

.home-title {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--deep-text);
}

.home-subtitle {
  margin: 8px 0 0;
  max-width: 460px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-2);
}

.home-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.home-groups {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.home-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.home-group-head {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 6px;
  color: var(--content-meta);
}

.home-group-icon {
  color: var(--primary);
}

.home-group-head h2 {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.home-list {
  background: var(--card-bg);
  border-radius: var(--radius-large);
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  transition: background-color var(--duration-normal) var(--ease-standard);
}

.home-row {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 13px 14px;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: inherit;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard),
    transform var(--duration-fast) var(--ease-standard);
}

.home-row:hover {
  background: var(--btn-plain-bg-hover);
}

.home-row:active {
  transform: scale(0.995);
}

.home-row-icon {
  flex: none;
  width: 38px;
  height: 38px;
  border-radius: var(--radius-md);
  background: var(--btn-regular-bg);
  color: var(--btn-content);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard);
}

.home-row:hover .home-row-icon {
  background: var(--primary);
  color: #ffffff;
}

:root.dark .home-row:hover .home-row-icon {
  color: oklch(0.16 0.014 var(--hue));
}

.home-row-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.home-row-title {
  font-size: 14.5px;
  font-weight: 600;
  color: var(--deep-text);
}

.home-row-desc {
  font-size: 12.5px;
  color: var(--text-2);
  line-height: 1.5;
}

.home-row-arrow {
  flex: none;
  color: var(--content-meta);
  transition: transform var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard);
}

.home-row:hover .home-row-arrow {
  color: var(--primary);
  transform: translateX(3px);
}

.home-empty {
  background: var(--card-bg);
  border-radius: var(--radius-large);
  padding: 36px 20px;
  text-align: center;
  color: var(--content-meta);
}

.home-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  color: var(--content-meta);
  padding-top: 4px;
}

@media (max-width: 480px) {
  .home-page {
    gap: 20px;
    padding: 6px 0 16px;
  }

  .home-banner {
    padding: 12px 4px 0;
  }

  .home-title {
    font-size: 22px;
  }

  .home-row {
    padding: 11px 10px;
    gap: 12px;
  }
}
</style>
