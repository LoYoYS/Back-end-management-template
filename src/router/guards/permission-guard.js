/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:25:07
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import api from '@/api'
import { useAuthStore, usePermissionStore, useUserStore } from '@/store'
import { getPermissions, getUserInfo } from '@/store/helper'

const WHITE_LIST = ['/login', '/404']
const REMOVED_ROUTE_PREFIXES = ['/pms']
const routeComponents = import.meta.glob('@/views/**/*.vue')
const fallbackComponent = routeComponents['/src/views/error-page/404.vue']

export function createPermissionGuard(router) {
  router.beforeEach(async (to) => {
    const authStore = useAuthStore()
    const token = authStore.accessToken

    // 没有 token 时，仅放行白名单页面。
    if (!token) {
      if (WHITE_LIST.includes(to.path)) return true
      return { path: 'login', query: { ...to.query, redirect: to.path } }
    }

    if (to.path === '/login') return { path: '/' }
    if (WHITE_LIST.includes(to.path)) return true

    const userStore = useUserStore()
    const permissionStore = usePermissionStore()
    if (!userStore.userInfo) {
      const [user, permissions] = await Promise.all([getUserInfo(), getPermissions()])
      userStore.setUser(user)
      permissionStore.setPermissions(permissions)

      permissionStore.accessRoutes.forEach((route) => {
        const matchedComponent = route.component ? routeComponents[route.component] : null
        if (!matchedComponent) {
          console.warn(
            `[permission-guard] 未找到页面组件: ${route.component || 'EMPTY'} -> ${route.path}`
          )
        }
        route.component = matchedComponent || fallbackComponent
        !router.hasRoute(route.name) && router.addRoute(route)
      })
      return { ...to, replace: true }
    }

    const routes = router.getRoutes()
    if (routes.some((route) => route.name === to.name)) return true

    // 系统管理模块已从前端移除，直接按不存在页面处理。
    if (REMOVED_ROUTE_PREFIXES.some((prefix) => to.path.startsWith(prefix))) {
      return { name: '404', query: { path: to.fullPath } }
    }

    // 区分无权限页面和不存在页面。
    const { data: hasMenu } = await api.validateMenuPath(to.path)
    return hasMenu
      ? { name: '403', query: { path: to.fullPath }, state: { from: 'permission-guard' } }
      : { name: '404', query: { path: to.fullPath } }
  })
}
