<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/16 18:50:54
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <div id="top-tab" class="top-tab">
    <a-tabs
      :active-key="tabStore.activeTab"
      :editable="tabStore.tabs.length > 1"
      type="card-gutter"
      :show-add-button="false"
      hide-content
      @delete="(path) => tabStore.removeTab(path)"
    >
      <a-tab-pane v-for="item in tabStore.tabs" :key="item.path">
        <template #title>
          <span
            @click="handleItemClick(item.path)"
            @contextmenu.prevent="handleContextMenu($event, item)"
          >
            {{ item.title }}
          </span>
        </template>
      </a-tab-pane>
    </a-tabs>

    <ContextMenu
      v-if="contextMenuOption.show"
      v-model:show="contextMenuOption.show"
      :current-path="contextMenuOption.currentPath"
      :x="contextMenuOption.x"
      :y="contextMenuOption.y"
    />
  </div>
</template>

<script setup>
import { useTabStore } from '@/store'
import ContextMenu from './ContextMenu.vue'

const router = useRouter()
const tabStore = useTabStore()

const contextMenuOption = reactive({
  show: false,
  x: 0,
  y: 0,
  currentPath: ''
})

function handleItemClick(path) {
  tabStore.setActiveTab(path)
  router.push(path)
}

function showContextMenu() {
  contextMenuOption.show = true
}
function hideContextMenu() {
  contextMenuOption.show = false
}
function setContextMenu(x, y, currentPath) {
  Object.assign(contextMenuOption, { x, y, currentPath })
}

async function handleContextMenu(e, tagItem) {
  const { clientX, clientY } = e
  hideContextMenu()
  setContextMenu(clientX, clientY, tagItem.path)
  await nextTick()
  showContextMenu()
}
</script>

<style scoped lang="scss">
.top-tab {
  :deep(.arco-tabs-nav::before),
  :deep(.arco-tabs-content) {
    display: none;
  }

  :deep(.arco-tabs-tab) {
    height: 36px;
    margin-right: 4px;
    border: 1px solid var(--color-border-2);
    border-radius: 4px;
    background: transparent;
    transition: all 0.2s ease;
  }

  :deep(.arco-tabs-tab:hover) {
    border-color: rgb(var(--primary-color));
    color: rgb(var(--primary-color));
  }

  :deep(.arco-tabs-tab-active) {
    border-color: rgb(var(--primary-color));
    background-color: rgba(var(--primary-color), 0.1);
  }

  :deep(.arco-tabs-nav-ink) {
    display: none;
  }
}
</style>
