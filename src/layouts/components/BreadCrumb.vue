<template>
  <a-breadcrumb class="app-breadcrumb">
    <a-breadcrumb-item v-if="!breadItems?.length">
      {{ route.meta.title }}
    </a-breadcrumb-item>
    <a-breadcrumb-item
      v-for="(item, index) of breadItems"
      v-else
      :key="item.code"
      @click="handleItemClick(item)"
    >
      <a-dropdown
        v-if="index < breadItems.length - 1 && getDropOptions(item.children).length"
        trigger="hover"
        @select="handleDropSelect"
      >
        <div class="flex cursor-pointer items-center">
          <i :class="item.icon" class="mr-8" />
          {{ item.name }}
        </div>
        <template #content>
          <a-doption
            v-for="option in getDropOptions(item.children)"
            :key="option.key"
            :value="option.key"
          >
            <div class="flex items-center gap-8px">
              <i :class="option.iconClass" />
              <span>{{ option.label }}</span>
            </div>
          </a-doption>
        </template>
      </a-dropdown>
      <div v-else class="flex items-center">
        <i :class="item.icon" class="mr-8" />
        {{ item.name }}
      </div>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script setup>
import { usePermissionStore } from '@/store'

const router = useRouter()
const route = useRoute()
const permissionStore = usePermissionStore()

const breadItems = ref([])

watch(
  () => route.name,
  (name) => {
    breadItems.value = findMatchs(permissionStore.permissions, name)
  },
  { immediate: true }
)

function findMatchs(tree, code, parents = []) {
  for (const item of tree) {
    if (item.code === code) {
      return [...parents, item]
    }
    if (item.children?.length) {
      const found = findMatchs(item.children, code, [...parents, item])
      if (found) return found
    }
  }
  return null
}

function handleItemClick(item) {
  if (item.path && item.code !== route.name) navigateTo(item.path)
}

function getDropOptions(list = []) {
  return list
    .filter((item) => item.show)
    .map((child) => ({
      label: child.name,
      key: child.code,
      iconClass: child.icon
    }))
}

function handleDropSelect(code) {
  if (code && code !== route.name) navigateTo({ name: code })
}

async function navigateTo(target) {
  try {
    await router.push(target)
  } catch (error) {
    console.error(error)
    $message.error('页面跳转失败，请检查菜单配置')
  }
}
</script>

<style scoped lang="scss">
.app-breadcrumb {
  :deep(.arco-breadcrumb-item:last-child),
  :deep(.arco-breadcrumb-item:last-child .arco-breadcrumb-item-text),
  :deep(.arco-breadcrumb-item:hover .arco-breadcrumb-item-text),
  :deep(.arco-breadcrumb-item:hover i) {
    color: rgb(var(--primary-color));
  }
}
</style>
