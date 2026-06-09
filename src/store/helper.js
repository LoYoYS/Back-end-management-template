import api from '@/api'
import { basePermissions } from '@/settings'
import { deepClone } from '@/utils/common'

const removedPermissionNames = new Set(['系统管理', '用户管理', '角色管理', '资源管理', '权限管理'])

function isRemovedPermissionNode(item = {}) {
  const path = item.path || ''
  const component = item.component || ''
  const name = item.name || ''

  return (
    path.startsWith('/pms') ||
    component.startsWith('/src/views/pms/') ||
    removedPermissionNames.has(name)
  )
}

function filterRemovedPermissions(list = []) {
  return list
    .filter((item) => !isRemovedPermissionNode(item))
    .map((item) => {
      const next = { ...item }
      if (Array.isArray(item.children)) {
        next.children = filterRemovedPermissions(item.children)
      }
      return next
    })
}

export async function getUserInfo() {
  const res = await api.getUser()
  const { id, username, profile, roles, currentRole } = res.data || {}
  return {
    id,
    username,
    avatar: profile?.avatar,
    nickName: profile?.nickName,
    gender: profile?.gender,
    address: profile?.address,
    email: profile?.email,
    roles,
    currentRole
  }
}

export async function getPermissions() {
  let asyncPermissions = []
  try {
    const res = await api.getRolePermissions()
    asyncPermissions = res?.data || []
  } catch (error) {
    console.error(error)
  }

  const permissions = deepClone(basePermissions).concat(asyncPermissions)
  return filterRemovedPermissions(permissions)
}
