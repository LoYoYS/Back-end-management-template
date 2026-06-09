<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/05 21:30:11
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <AppPage show-footer>
    <a-card>
      <a-space align="center">
        <a-avatar :size="100" shape="circle" :image-url="userStore.avatar" />
        <div class="ml-20">
          <div class="flex items-center text-16">
            <span>用户名:</span>
            <span class="ml-12 opacity-80">{{ userStore.username }}</span>
            <a-button class="ml-32" type="text" @click="pwdModalRef.open()">
              <i class="i-fe:edit mr-4" />
              修改密码
            </a-button>
          </div>
          <div class="mt-16 flex items-center">
            <a-button type="outline" @click="avatarModalRef.open()"> 更改头像 </a-button>
            <span class="ml-12 opacity-60">
              修改头像只支持在线链接，不提供上传图片功能，如有需要可自行对接！
            </span>
          </div>
        </div>
      </a-space>
    </a-card>

    <a-card class="mt-20" title="个人资料信息">
      <template #extra>
        <a-button type="text" @click="profileModalRef.open()">
          <i class="i-fe:edit mr-4" />
          修改资料
        </a-button>
      </template>

      <a-descriptions :column="1" bordered>
        <a-descriptions-item label="昵称">
          {{ userStore.nickName }}
        </a-descriptions-item>
        <a-descriptions-item label="性别">
          {{ genders.find((item) => item.value === userStore.userInfo?.gender)?.label ?? '未知' }}
        </a-descriptions-item>
        <a-descriptions-item label="地址">
          {{ userStore.userInfo?.address }}
        </a-descriptions-item>
        <a-descriptions-item label="邮箱">
          {{ userStore.userInfo?.email }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>

    <MeModal ref="avatarModalRef" width="420px" title="更改头像" @ok="handleAvatarSave()">
      <a-input v-model="newAvatar" />
    </MeModal>

    <MeModal ref="pwdModalRef" title="修改密码" width="420px" @ok="handlePwdSave()">
      <a-form ref="pwdFormRef" :model="pwdForm" layout="horizontal">
        <a-form-item label="原密码" field="oldPassword" :rules="required">
          <a-input-password v-model="pwdForm.oldPassword" placeholder="请输入原密码" />
        </a-form-item>
        <a-form-item label="新密码" field="newPassword" :rules="required">
          <a-input-password v-model="pwdForm.newPassword" placeholder="请输入新密码" />
        </a-form-item>
      </a-form>
    </MeModal>

    <MeModal ref="profileModalRef" title="修改资料" width="420px" @ok="handleProfileSave()">
      <a-form ref="profileFormRef" :model="profileForm" layout="horizontal">
        <a-form-item label="昵称" field="nickName">
          <a-input v-model="profileForm.nickName" placeholder="请输入昵称" />
        </a-form-item>
        <a-form-item label="性别" field="gender">
          <a-select v-model="profileForm.gender" :options="genders" placeholder="请选择性别" />
        </a-form-item>
        <a-form-item label="地址" field="address">
          <a-input v-model="profileForm.address" placeholder="请输入地址" />
        </a-form-item>
        <a-form-item label="邮箱" field="email">
          <a-input v-model="profileForm.email" placeholder="请输入邮箱" />
        </a-form-item>
      </a-form>
    </MeModal>
  </AppPage>
</template>

<script setup>
import { MeModal } from '@/components'
import { useForm, useModal } from '@/composables'
import { useUserStore } from '@/store'
import { getUserInfo } from '@/store/helper'
import api from './api'

const userStore = useUserStore()
const required = {
  required: true,
  message: '此为必填项',
  trigger: ['blur', 'change']
}

const [pwdModalRef] = useModal()
const [pwdFormRef, pwdForm, pwdValidation] = useForm()

async function handlePwdSave() {
  await pwdValidation()
  await api.changePassword(pwdForm.value)
  $message.success('密码修改成功')
  refreshUserInfo()
}

const newAvatar = ref(userStore.avatar)
const [avatarModalRef] = useModal()
async function handleAvatarSave() {
  if (!newAvatar.value) {
    $message.error('请输入头像地址')
    return false
  }
  await api.updateProfile({ id: userStore.userId, avatar: newAvatar.value })
  $message.success('头像修改成功')
  refreshUserInfo()
}

const genders = [
  { label: '保密', value: 0 },
  { label: '男', value: 1 },
  { label: '女', value: 2 }
]
const [profileModalRef] = useModal()
const [profileFormRef, profileForm, profileValidation] = useForm({
  id: userStore.userId,
  nickName: userStore.nickName,
  gender: userStore.userInfo?.gender ?? 0,
  address: userStore.userInfo?.address,
  email: userStore.userInfo?.email
})
async function handleProfileSave() {
  await profileValidation()
  await api.updateProfile(profileForm.value)
  $message.success('资料修改成功')
  refreshUserInfo()
}

async function refreshUserInfo() {
  const user = await getUserInfo()
  userStore.setUser(user)
}
</script>
