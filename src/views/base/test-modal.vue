<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2024/01/13 17:41:47
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <CommonPage show-footer>
    <a-button type="primary" @click="openModal1"> 打开第一个弹个窗 </a-button>
    <MeModal ref="$modal1">
      <a-input v-model="text" />
    </MeModal>
    <MeModal ref="$modal2" title="上一个弹窗提交的内容">
      <h2>{{ text }}</h2>
    </MeModal>
  </CommonPage>
</template>

<script setup>
import { MeModal } from '@/components'
import { useModal } from '@/composables'
import { sleep } from '@/utils'

const text = ref('')
const [$modal1, okLoading1] = useModal()
function openModal1() {
  $modal1.value?.open({
    title: '第一个弹窗',
    width: '600px',
    okText: '再弹个窗',
    cancelText: '关闭',
    async onOk() {
      if (!text.value) {
        $message.warning('请输入内容')
        return false
      }
      okLoading1.value = true
      $message.loading('正在提交...', { key: 'modal1' })
      await sleep(1000)
      okLoading1.value = false
      $message.success('提交成功', { key: 'modal1' })
      openModal2()
      return false
    },
    onCancel(message) {
      $message.info(message ?? '已取消')
    }
  })
}

const [$modal2, okLoading2] = useModal()
function openModal2() {
  $modal2.value?.open({
    cancelText: '关闭当前',
    okText: '关闭所有弹窗',
    width: '400px',
    async onOk() {
      okLoading2.value = true
      $message.loading('正在关闭...', { key: 'modal2' })
      await sleep(1000)
      okLoading2.value = false
      $modal1.value?.close()
      $message.success('已关闭', { key: 'modal2' })
    }
  })
}
</script>
