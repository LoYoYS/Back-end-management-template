/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:25:47
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { hyphenate } from '@vueuse/core'
import { defineStore } from 'pinia'
import { isExternal } from '@/utils'

export const usePermissionStore = defineStore('permission', {
  state: () => ({
    accessRoutes: [],
    permissions: [],
    menus: []
  }),
  actions: {
    setPermissions(permissions) {
      this.permissions = permissions
      // 权限切换或重新登录时先重置派生结果，避免路由和菜单对象持续累积。
      this.accessRoutes = []
      this.menus = this.permissions
        .filter((item) => item.type === 'MENU')
        .map((item) => this.getMenuItem(item))
        .filter((item) => !!item)
        .sort((a, b) => a.order - b.order)
    },
    getMenuItem(item, parent) {
      const route = this.generateRoute(item, item.show ? null : parent?.key)
      if (item.enable && route.path && !route.path.startsWith('http')) this.accessRoutes.push(route)
      const menuItem = {
        label: route.meta.title,
        key: route.name,
        path: route.path,
        originPath: route.meta.originPath,
        icon: () => h('i', { class: `${route.meta.icon} text-16` }),
        order: item.order ?? 0
      }
      const children = item.children?.filter((item) => item.type === 'MENU') || []
      if (children.length) {
        menuItem.children = children
          .map((child) => this.getMenuItem(child, menuItem))
          .filter((item) => !!item)
          .sort((a, b) => a.order - b.order)
        if (!menuItem.children.length) delete menuItem.children
      }
      if (!item.show) return null
      return menuItem
    },
    generateRoute(item, parentKey) {
      const isExternalPath = isExternal(item.path)
      const originPath = isExternalPath ? item.path : undefined
      const path = isExternalPath ? `/iframe/${hyphenate(item.code)}` : item.path
      const component = isExternalPath ? '/src/views/iframe/index.vue' : item.component
      return {
        name: item.code,
        path,
        redirect: item.redirect,
        component,
        meta: {
          originPath,
          icon: `${item.icon}?mask`,
          title: item.name,
          layout: item.layout,
          keepAlive: !!item.keepAlive,
          parentKey,
          btns: item.children
            ?.filter((item) => item.type === 'BUTTON')
            .map((item) => ({ code: item.code, name: item.name }))
        }
      }
    },
    resetPermission() {
      this.$reset()
    }
  }
})
