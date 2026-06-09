<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/05 21:28:36
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <div class="wh-full flex-col bg-[url(@/assets/images/login_bg.webp)] bg-cover">
    <div
      class="m-auto max-w-700 min-w-345 f-c-c rounded-8 auto-bg bg-opacity-20 bg-cover p-12 card-shadow"
    >
      <div class="hidden w-380 px-20 py-35 md:block">
        <img src="@/assets/images/login_banner.webp" class="w-full" alt="login_banner" />
      </div>

      <div class="w-320 flex-col px-20 py-32">
        <h2 class="f-c-c text-24 text-#6a6a6a font-normal">
          <img src="@/assets/images/logo.png" class="mr-12 h-50" />
          {{ systemName }}
        </h2>
        <a-input
          v-model="loginInfo.username"
          autofocus
          class="mt-32 h-40 items-center"
          placeholder="请输入用户名"
          :max-length="20"
        >
          <template #prefix>
            <i class="i-fe:user mr-12 opacity-20" />
          </template>
        </a-input>
        <a-input-password
          v-model="loginInfo.password"
          class="mt-20 h-40 items-center"
          placeholder="请输入密码"
          :max-length="20"
          @keydown.enter="handleLogin()"
        >
          <template #prefix>
            <i class="i-fe:lock mr-12 opacity-20" />
          </template>
        </a-input-password>

        <div class="mt-20 flex items-center">
          <a-input
            v-model="loginInfo.captcha"
            class="h-40 items-center"
            placeholder="请输入验证码"
            :max-length="4"
            @keydown.enter="handleLogin()"
          >
            <template #prefix>
              <i class="i-fe:key mr-12 opacity-20" />
            </template>
          </a-input>
          <img
            v-if="captchaUrl"
            :src="captchaUrl"
            alt="验证码"
            height="40"
            class="ml-12 w-80 cursor-pointer"
            @click="initCaptcha"
          />
        </div>

        <a-checkbox v-model="isRemember" class="mt-20"> 记住我 </a-checkbox>

        <div class="mt-20 flex items-center">
          <a-button class="h-40 flex-1 rounded-5 text-16" type="outline" @click="quickLogin()">
            一键体验
          </a-button>

          <a-button
            class="ml-32 h-40 flex-1 rounded-5 text-16"
            type="primary"
            :loading="loading"
            @click="handleLogin()"
          >
            登录
          </a-button>
        </div>
      </div>
    </div>

    <TheFooter class="py-12" />
  </div>
</template>

<script setup>
import { useStorage } from '@vueuse/core'
import { systemName } from '@/settings'
import { useAuthStore } from '@/store'
import { lStorage, throttle } from '@/utils'
import api from './api'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const loginInfo = ref({
  username: '',
  password: ''
})

const captchaUrl = ref('')
const initCaptcha = throttle(() => {
  captchaUrl.value = `${import.meta.env.VITE_AXIOS_BASE_URL}/auth/captcha?${Date.now()}`
}, 500)

const localLoginInfo = lStorage.get('loginInfo')
if (localLoginInfo) {
  loginInfo.value.username = localLoginInfo.username || ''
  loginInfo.value.password = localLoginInfo.password || ''
}
initCaptcha()

function quickLogin() {
  loginInfo.value.username = 'admin'
  loginInfo.value.password = '123456'
  handleLogin(true)
}

const isRemember = useStorage('isRemember', true)
const loading = ref(false)
async function handleLogin(isQuick) {
  const { username, password, captcha } = loginInfo.value
  if (!username || !password) return $message.warning('请输入用户名和密码')
  if (!isQuick && !captcha) return $message.warning('请输入验证码')
  try {
    loading.value = true
    $message.loading('正在验证，请稍后...', { key: 'login' })
    const { data } = await api.login({ username, password: password.toString(), captcha, isQuick })
    if (isRemember.value) {
      lStorage.set('loginInfo', { username, password })
    } else {
      lStorage.remove('loginInfo')
    }
    onLoginSuccess(data)
  } catch (error) {
    if (error?.code === 10003) {
      initCaptcha()
    }
    $message.destroy('login')
    console.error(error)
  }
  loading.value = false
}

async function onLoginSuccess(data = {}) {
  authStore.setToken(data)
  $message.loading('登录中...', { key: 'login' })
  try {
    $message.success('登录成功', { key: 'login' })
    if (route.query.redirect) {
      const path = route.query.redirect
      delete route.query.redirect
      router.push({ path, query: route.query })
    } else {
      router.push('/')
    }
  } catch (error) {
    console.error(error)
    $message.destroy('login')
  }
}
</script>
