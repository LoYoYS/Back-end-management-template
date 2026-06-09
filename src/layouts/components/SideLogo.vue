<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/16 18:50:28
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <router-link class="h-60 f-c-c" to="/">
    <TheLogo />
    <h2
      v-show="!appStore.collapsed"
      class="ml-10 max-w-140 flex-shrink-0 text-16 color-primary font-bold"
    >
      {{ systemName }}
    </h2>
  </router-link>
</template>

<script setup>
import { systemName } from '@/settings'
import { useAppStore } from '@/store'

const appStore = useAppStore()
</script>
