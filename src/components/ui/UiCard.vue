<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    meta?: string
    compact?: boolean
  }>(),
  {
    title: '',
    meta: '',
    compact: false,
  },
)
</script>

<template>
  <section class="ui-card" :class="{ 'is-compact': compact }">
    <header v-if="title || meta || $slots.header || $slots['header-extra']" class="ui-card-head">
      <div class="ui-card-title-wrap">
        <slot name="header">
          <h2 v-if="title" class="ui-card-title">{{ title }}</h2>
        </slot>
        <span v-if="meta" class="ui-card-meta">{{ meta }}</span>
      </div>
      <div v-if="$slots['header-extra']" class="ui-card-extra">
        <slot name="header-extra" />
      </div>
    </header>
    <div class="ui-card-body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.ui-card {
  background: var(--card-bg);
  border-radius: var(--radius-large);
  padding: 18px;
  transition: background-color var(--duration-normal) var(--ease-standard);
}

.ui-card.is-compact {
  padding: 14px 16px;
}

.ui-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}

.ui-card-title-wrap {
  display: flex;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
}

.ui-card-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--deep-text);
}

.ui-card-meta {
  font-size: 12px;
  color: var(--content-meta);
  font-variant-numeric: tabular-nums;
}

.ui-card-extra {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
