<template>
  <a-dropdown trigger="hover" @select="handleSelect">
    <div id="user-dropdown" class="flex cursor-pointer items-center">
      <a-avatar :size="36" shape="circle" :image-url="userStore.avatar" />
      <div v-if="userStore.userInfo" class="ml-12 flex-col flex-shrink-0 items-center">
        <span class="text-14">{{ userStore.nickName ?? userStore.username }}</span>
        <span class="text-12 opacity-50">[{{ userStore.currentRole?.name }}]</span>
      </div>
    </div>
    <template #content>
      <a-doption v-for="option in visibleOptions" :key="option.key" :value="option.key">
        <div class="flex items-center gap-8px">
          <i :class="option.iconClass" />
          <span>{{ option.label }}</span>
        </div>
      </a-doption>
    </template>
  </a-dropdown>

  <RoleSelect ref="roleSelectRef" />
</template>

<script setup>
import api from '@/api'
import { RoleSelect } from '@/layouts/components'
import { useAuthStore, usePermissionStore, useUserStore } from '@/store'

const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()
const permissionStore = usePermissionStore()

const options = [
  {
    label: '个人资料',
    key: 'profile',
    iconClass: 'i-material-symbols:person-outline text-14',
    show: () => permissionStore.accessRoutes?.some((item) => item.path === '/profile')
  },
  {
    label: '切换角色',
    key: 'toggleRole',
    iconClass: 'i-basil:exchange-solid text-14',
    show: () => userStore.roles.length > 1
  },
  {
    label: '退出登录',
    key: 'logout',
    iconClass: 'i-mdi:exit-to-app text-14'
  }
]

const visibleOptions = computed(() =>
  options.filter((option) => option.show == null || option.show())
)

const roleSelectRef = ref(null)

function handleSelect(key) {
  switch (key) {
    case 'profile':
      router.push('/profile')
      break
    case 'toggleRole':
      roleSelectRef.value?.open({
        onOk() {
          location.reload()
        }
      })
      break
    case 'logout':
      $dialog.confirm({
        title: '提示',
        type: 'info',
        content: '确认退出？',
        async confirm() {
          try {
            await api.logout()
          } catch (error) {
            console.error(error)
          }
          authStore.logout()
          $message.success('已退出登录')
        }
      })
      break
  }
}
</script>
