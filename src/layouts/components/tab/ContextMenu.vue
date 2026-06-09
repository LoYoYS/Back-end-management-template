<template>
  <teleport to="body">
    <div
      v-if="show"
      ref="menuRef"
      class="fixed z-2000 min-w-140 rounded-6 bg-white py-6 shadow-lg dark:bg-#232324"
      :style="menuStyle"
    >
      <button
        v-for="option in options"
        :key="option.key"
        type="button"
        :disabled="option.disabled"
        class="w-full flex items-center gap-8px border-none bg-transparent px-12 py-8 text-left text-14 transition disabled:cursor-not-allowed hover:bg-#f2f3f5 disabled:opacity-40 dark:hover:bg-#303133"
        @click="handleSelect(option.key)"
      >
        <i :class="option.iconClass" />
        <span>{{ option.label }}</span>
      </button>
    </div>
  </teleport>
</template>

<script setup>
import { useTabStore } from '@/store'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  currentPath: {
    type: String,
    default: ''
  },
  x: {
    type: Number,
    default: 0
  },
  y: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:show'])

const tabStore = useTabStore()
const menuRef = ref(null)
const route = useRoute()

const optionMetas = [
  { label: '重新加载', key: 'reload', iconClass: 'i-mdi:refresh text-14' },
  { label: '关闭', key: 'close', iconClass: 'i-mdi:close text-14' },
  { label: '关闭其他', key: 'close-other', iconClass: 'i-mdi:arrow-expand-horizontal text-14' },
  { label: '关闭左侧', key: 'close-left', iconClass: 'i-mdi:arrow-expand-left text-14' },
  { label: '关闭右侧', key: 'close-right', iconClass: 'i-mdi:arrow-expand-right text-14' }
]

const menuStyle = computed(() => ({
  left: `${props.x}px`,
  top: `${props.y}px`
}))

const options = computed(() => {
  const isOnlyOneTab = tabStore.tabs.length <= 1
  const isFirstTab = props.currentPath === tabStore.tabs[0]?.path
  const isLastTab = props.currentPath === tabStore.tabs[tabStore.tabs.length - 1]?.path

  return optionMetas.map((item) => {
    switch (item.key) {
      case 'reload':
        return { ...item, disabled: props.currentPath !== tabStore.activeTab }
      case 'close':
      case 'close-other':
        return { ...item, disabled: isOnlyOneTab }
      case 'close-left':
        return { ...item, disabled: isOnlyOneTab || isFirstTab }
      case 'close-right':
        return { ...item, disabled: isOnlyOneTab || isLastTab }
      default:
        return item
    }
  })
})

const actionMap = new Map([
  ['reload', () => tabStore.reloadTab(route.fullPath, route.meta?.keepAlive)],
  ['close', () => tabStore.removeTab(props.currentPath)],
  ['close-other', () => tabStore.removeOther(props.currentPath)],
  ['close-left', () => tabStore.removeLeft(props.currentPath)],
  ['close-right', () => tabStore.removeRight(props.currentPath)]
])

function handleHideDropdown() {
  emit('update:show', false)
}

function handleDocumentClick(event) {
  if (!props.show || menuRef.value?.contains(event.target)) return
  handleHideDropdown()
}

function handleSelect(key) {
  actionMap.get(key)?.()
  handleHideDropdown()
}

watch(
  () => props.show,
  (visible) => {
    if (visible) document.addEventListener('mousedown', handleDocumentClick)
    else document.removeEventListener('mousedown', handleDocumentClick)
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleDocumentClick)
})
</script>
