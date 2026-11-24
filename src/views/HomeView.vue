<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Search } from 'lucide-vue-next'
import BrandIcon from '../components/BrandIcon.vue'
import { UiChip, UiInput } from '../components/ui'
import { tools } from '../tools/registry'

const router = useRouter()
const sharedKeyword = inject<Ref<string>>('toolSearchKeyword', ref(''))
const activeTag = ref('全部')

const tags = computed(() => ['全部', ...Array.from(new Set(tools.map((t) => t.tag)))])

const filteredTools = computed(() => {
  const q = sharedKeyword.value.trim().toLowerCase()
  return tools.filter((tool) => {
    const matchTag = activeTag.value === '全部' || tool.tag === activeTag.value
    if (!matchTag) return false
    if (!q) return true
    return (
      tool.label.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.tag.toLowerCase().includes(q) ||
      tool.key.includes(q)
    )
  })
})

function openTool(key: string) {
  void router.push({ name: key })
}
</script>

<template>
  <div class="home-page">
    <section class="home-hero">
      <div class="home-hero-head">
        <BrandIcon :size="40" />
        <div class="home-hero-copy">
          <h1>Attilio 工具箱</h1>
          <p>轻量、开箱即用的在线小工具集合，全部计算在浏览器本地完成。</p>
        </div>
      </div>

      <div class="home-hero-controls">
        <div class="home-search">
          <UiInput v-model="sharedKeyword" placeholder="搜索工具名称或用途…" clearable>
            <template #prefix><Search :size="15" /></template>
          </UiInput>
        </div>

        <div class="home-tags" role="tablist" aria-label="按分类筛选">
          <UiChip
            v-for="tag in tags"
            :key="tag"
            shape="pill"
            :active="activeTag === tag"
            @click="activeTag = tag"
          >
            {{ tag }}
          </UiChip>
        </div>
      </div>
    </section>

    <section class="home-section">
      <div class="home-section-head">
        <h2>全部工具</h2>
        <span class="home-count">{{ filteredTools.length }} / {{ tools.length }}</span>
      </div>

      <div v-if="filteredTools.length > 0" class="tool-grid">
        <button
          v-for="tool in filteredTools"
          :key="tool.key"
          type="button"
          class="tool-card"
          @click="openTool(tool.key)"
        >
          <div class="tool-card-top">
            <span class="tool-card-icon">
              <component :is="tool.icon" :size="20" />
            </span>
            <UiChip shape="pill" :clickable="false">{{ tool.tag }}</UiChip>
          </div>
          <h3 class="tool-card-title">{{ tool.label }}</h3>
          <p class="tool-card-desc">{{ tool.description }}</p>
          <div class="tool-card-foot">
            <span>打开工具</span>
            <ArrowRight :size="15" class="tool-card-arrow" />
          </div>
        </button>
      </div>

      <div v-else class="home-empty">
        <p>没有找到匹配“{{ sharedKeyword }}”的工具</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.home-hero {
  background: var(--card-bg);
  border-radius: var(--radius-large);
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: background-color var(--duration-normal) var(--ease-standard);
}

.home-hero-head {
  display: flex;
  align-items: center;
  gap: 16px;
}

.home-hero-copy {
  min-width: 0;
}

.home-hero-copy h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--deep-text);
  line-height: 1.3;
}

.home-hero-copy p {
  margin: 6px 0 0;
  font-size: 14px;
  color: var(--text-2);
}

.home-hero-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.home-search {
  width: 100%;
  max-width: 340px;
}

.home-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.home-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.home-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}

.home-section-head h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--deep-text);
}

.home-count {
  font-size: 12px;
  font-weight: 600;
  color: var(--content-meta);
  font-variant-numeric: tabular-nums;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.tool-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  width: 100%;
  padding: 20px;
  border: none;
  border-radius: var(--radius-large);
  background: var(--card-bg);
  color: inherit;
  font-family: inherit;
  cursor: pointer;
  transition: transform var(--duration-fast) var(--ease-standard),
    background-color var(--duration-fast) var(--ease-standard),
    box-shadow var(--duration-fast) var(--ease-standard);
}

.tool-card:hover {
  background: var(--btn-card-bg-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

:root.dark .tool-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
}

.tool-card:active {
  transform: scale(0.99);
}

.tool-card-top {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
}

.tool-card-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--btn-regular-bg);
  color: var(--btn-content);
  transition: background-color var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard);
}

.tool-card:hover .tool-card-icon {
  background: var(--primary);
  color: #ffffff;
}

:root.dark .tool-card:hover .tool-card-icon {
  color: oklch(0.16 0.014 var(--hue));
}

.tool-card-title {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 700;
  color: var(--deep-text);
}

.tool-card-desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--text-2);
  flex: 1;
}

.tool-card-foot {
  margin-top: 16px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--primary);
}

.tool-card-arrow {
  transition: transform var(--duration-fast) var(--ease-standard);
}

.tool-card:hover .tool-card-arrow {
  transform: translateX(3px);
}

.home-empty {
  background: var(--card-bg);
  border-radius: var(--radius-large);
  padding: 40px 20px;
  text-align: center;
  color: var(--content-meta);
}

.home-empty p {
  margin: 0;
}

@media (max-width: 1024px) {
  .tool-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .home-hero {
    padding: 20px 16px;
    gap: 16px;
  }

  .home-hero-copy h1 {
    font-size: 20px;
  }

  .home-search {
    max-width: none;
  }

  .tool-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }

  .tool-card {
    padding: 16px;
  }
}
</style>
