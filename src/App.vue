<template>
  <AConfigProvider class="wh-full" :locale="zhCn">
    <router-view v-if="Layout" v-slot="{ Component, route: curRoute }">
      <component :is="Layout" :key="layoutName">
        <transition name="fade-slide" mode="out-in" appear>
          <KeepAlive :include="keepAliveNames">
            <component :is="Component" v-if="!tabStore.reloading" :key="curRoute.fullPath" />
          </KeepAlive>
        </transition>
      </component>

      <LayoutSetting v-if="layoutSettingVisible" class="fixed right-12 top-1/2 z-999" />
    </router-view>
  </AConfigProvider>
</template>

<script setup>
import { ConfigProvider as AConfigProvider } from '@arco-design/web-vue'
import zhCn from '@arco-design/web-vue/es/locale/lang/zh-cn'
import { LayoutSetting } from '@/components'
import { useAppStore, useTabStore } from '@/store'
import { defaultLayout, layoutSettingVisible } from './settings'

const layouts = new Map()
function getLayout(name) {
  if (layouts.get(name)) return layouts.get(name)
  const layout = markRaw(defineAsyncComponent(() => import(`@/layouts/${name}/index.vue`)))
  layouts.set(name, layout)
  return layout
}

const route = useRoute()
const appStore = useAppStore()
if (appStore.layout === 'default') appStore.setLayout('')
const layoutName = computed(() => route.meta?.layout || appStore.layout || defaultLayout)
const Layout = computed(() => {
  if (!route.matched?.length) return null
  return getLayout(layoutName.value)
})

const tabStore = useTabStore()
const keepAliveNames = computed(() => {
  return tabStore.tabs.filter((item) => item.keepAlive).map((item) => item.name)
})

watch(
  [() => appStore.primaryColor, () => appStore.isDark],
  ([primaryColor, isDark]) => {
    appStore.setThemeColor(primaryColor, isDark)
    document.body.setAttribute('arco-theme', isDark ? 'dark' : 'light')
  },
  { immediate: true }
)
</script>
