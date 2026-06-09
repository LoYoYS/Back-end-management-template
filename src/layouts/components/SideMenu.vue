<template>
  <a-menu
    class="side-menu"
    :class="{ 'side-menu--collapsed': appStore.collapsed }"
    mode="vertical"
    :accordion="true"
    :level-indent="18"
    :collapsed-icon-size="22"
    :collapsed-width="64"
    :collapsed="appStore.collapsed"
    :selected-keys="activeKeys"
    :auto-open-selected="true"
    :theme="menuTheme"
    @menu-item-click="handleMenuSelect"
  >
    <MenuNode v-for="item in permissionStore.menus" :key="item.key" :item="item" />
  </a-menu>
</template>

<script setup>
import { MenuItem, SubMenu } from '@arco-design/web-vue'
import { useAppStore, usePermissionStore } from '@/store'
import { isExternal } from '@/utils'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const permissionStore = usePermissionStore()

const activeKeys = computed(() => {
  const key = route.meta?.parentKey || route.name
  return key ? [String(key)] : []
})
const menuTheme = computed(() =>
  document.body.getAttribute('arco-theme') === 'dark' ? 'dark' : 'light'
)

const MenuNode = defineComponent({
  name: 'SideMenuNode',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    return () => {
      if (props.item.children?.length) {
        return h(
          SubMenu,
          { key: props.item.key },
          {
            icon: props.item.icon,
            title: () => props.item.label,
            default: () =>
              props.item.children.map((child) => h(MenuNode, { key: child.key, item: child }))
          }
        )
      }
      return h(
        MenuItem,
        { key: props.item.key },
        {
          icon: props.item.icon,
          default: () => props.item.label
        }
      )
    }
  }
})

function findMenuItem(list, key) {
  for (const item of list) {
    if (item.key === key) return item
    if (item.children?.length) {
      const target = findMenuItem(item.children, key)
      if (target) return target
    }
  }
  return null
}

async function navigateTo(target) {
  try {
    await router.push(target)
  } catch (error) {
    console.error(error)
    $message.error('页面跳转失败，请检查菜单配置')
  }
}

function handleMenuSelect(key) {
  const item = findMenuItem(permissionStore.menus, key)
  if (!item) return
  if (isExternal(item.originPath)) {
    $dialog.confirm({
      type: 'info',
      title: '请选择打开方式',
      positiveText: '外链打开',
      negativeText: '在本站内嵌打开',
      confirm() {
        window.open(item.originPath)
      },
      cancel: () => {
        navigateTo(item.path)
      }
    })
  } else {
    if (!item.path) return
    navigateTo(item.path)
  }
}
</script>

<style scoped lang="scss">
.side-menu {
  height: 100%;

  :deep(.arco-menu-inner) {
    padding: 8px 0;
  }

  :deep(.arco-menu-icon),
  :deep(.arco-menu-icon i) {
    color: inherit;
  }

  :deep(.arco-menu-item),
  :deep(.arco-menu-inline-header) {
    margin: 0 8px 4px;
    border-radius: 6px;
  }
}

.side-menu.side-menu--collapsed {
  :deep(.arco-menu-item),
  :deep(.arco-menu-inline-header) {
    display: flex;
    justify-content: center;
    padding-right: 0 !important;
    padding-left: 0 !important;
  }

  :deep(.arco-menu-icon) {
    display: inline-flex;
    margin-right: 0;
    align-items: center;
    justify-content: center;
  }
}

.side-menu:not(.side-menu--collapsed) {
  :deep(.arco-menu-item.arco-menu-selected) {
    color: rgb(var(--primary-color));
    background-color: rgba(var(--primary-color), 0.1);
  }

  :deep(.arco-menu-inline-header.arco-menu-selected) {
    color: rgb(var(--primary-color));
    background-color: transparent;
  }

  :deep(.arco-menu-item.arco-menu-selected .arco-menu-icon),
  :deep(.arco-menu-inline-header.arco-menu-selected .arco-menu-icon),
  :deep(.arco-menu-item:hover),
  :deep(.arco-menu-inline-header:hover) {
    color: rgb(var(--primary-color));
  }
}
</style>
