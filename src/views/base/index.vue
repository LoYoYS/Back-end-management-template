<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/04 22:46:57
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <CommonPage show-footer>
    <a-space size="large">
      <a-card title="按钮 Button">
        <a-space>
          <a-button>Default</a-button>
          <a-button type="text"> Tertiary </a-button>
          <a-button type="primary"> Primary </a-button>
          <a-button type="primary"> Info </a-button>
          <a-button type="primary" status="success"> Success </a-button>
          <a-button type="primary" status="warning"> Warning </a-button>
          <a-button type="primary" status="danger"> Error </a-button>
        </a-space>
      </a-card>

      <a-card title="带 Icon 的按钮">
        <a-space>
          <a-button type="primary">
            <i class="i-material-symbols:add mr-4 text-18" />
            新增
          </a-button>
          <a-button type="primary" status="danger">
            <i class="i-material-symbols:delete-outline mr-4 text-18" />
            删除
          </a-button>
          <a-button type="primary" status="warning">
            <i class="i-material-symbols:edit-outline mr-4 text-18" />
            编辑
          </a-button>
          <a-button type="primary">
            <i class="i-majesticons:eye-line mr-4 text-18" />
            查看
          </a-button>
        </a-space>
      </a-card>
    </a-space>

    <a-space size="large" mt-30>
      <a-card min-w-340 title="通知 Notification">
        <a-space>
          <a-button @click="notify('info')"> 信息 </a-button>
          <a-button @click="notify('success')"> 成功 </a-button>
          <a-button @click="notify('warning')"> 警告 </a-button>
          <a-button @click="notify('error')"> 错误 </a-button>
        </a-space>
      </a-card>

      <a-card min-w-340 title="确认弹窗 Dialog">
        <a-button type="primary" status="danger" @click="handleDelete">
          <i class="i-mi:delete mr-4" />
          删除
        </a-button>
      </a-card>

      <a-card min-w-340 title="消息提醒 Message">
        <a-space>
          <a-button :loading="loading" type="primary" @click="handleLogin">
            <i v-show="!loading" class="i-mdi:login mr-4" />
            登录
          </a-button>
          <a-button type="primary" status="danger" @click="handleMultiMessage">
            多个错误提醒
          </a-button>
        </a-space>
      </a-card>
    </a-space>
  </CommonPage>
</template>

<script setup>
import { sleep } from '@/utils'

function handleDelete() {
  $dialog.confirm({
    content: '确认删除？',
    confirm() {
      $message.success('删除成功')
    },
    cancel() {
      $message.warning('已取消')
    }
  })
}

const loading = ref(false)
async function handleLogin() {
  loading.value = true
  $message.loading('登录中...', { key: 'login' })
  await sleep(2000)
  $message.error('登录失败', { key: 'login' })
  await sleep(500)
  $message.loading('正在尝试重新登录...', { key: 'login' })
  await sleep(2000)
  $message.success('登录成功', { key: 'login' })
  loading.value = false
}

function handleMultiMessage() {
  $message.error(['用户名不能为空！', '密码不能为空！', '密码必须大于6位！'])
}

function notify(type) {
  $notification[type]({
    content: '说点啥呢',
    meta: '想不出来',
    duration: 2500,
    keepAliveOnHover: true
  })
}
</script>
