<template>
  <a-tooltip>
    <i class="i-fe:beginner mr-16 cursor-pointer text-20" @click="show = true" />
    <template #content> 操作指引 </template>
  </a-tooltip>

  <Vue3IntroStep ref="myIntroStep" v-model:show="show" :config="config">
    <template #prev="{ tipItem, index }">
      <a-button
        class="mr-12"
        type="outline"
        shape="round"
        size="mini"
        style="color: #fff; border-color: #fff"
        @click="prev(tipItem, index)"
      >
        上一步
      </a-button>
    </template>
    <template #next="{ tipItem }">
      <a-button
        class="mr-12"
        type="outline"
        shape="round"
        size="mini"
        style="color: #fff; border-color: #fff"
        @click="next(tipItem)"
      >
        下一步
      </a-button>
    </template>

    <template #skip>
      <a-button
        type="outline"
        shape="round"
        size="mini"
        style="color: #fff; border-color: #fff"
        @click="skip"
      >
        跳过
      </a-button>
    </template>

    <template #done>
      <a-button
        type="outline"
        shape="round"
        size="mini"
        style="color: #fff; border-color: #fff"
        @click="done"
      >
        完成
      </a-button>
    </template>
  </Vue3IntroStep>
</template>

<script setup>
import Vue3IntroStep from 'vue3-intro-step'

const myIntroStep = shallowRef(null)
const show = shallowRef(false)
const config = {
  backgroundOpacity: 0.8,
  titleStyle: {
    textAlign: 'left',
    fontSize: '18px'
  },
  contentStyle: {
    textAlign: 'left',
    fontSize: '14px'
  },
  tips: [
    {
      el: '#toggleTheme',
      tipPosition: 'bottom',
      title: '切换系统主题',
      content: '一键开启护眼模式'
    },
    {
      el: '#fullscreen',
      tipPosition: 'bottom',
      title: '全屏/退出全屏',
      content: '一键开启全屏'
    },
    {
      el: '#theme-setting',
      tipPosition: 'bottom',
      title: '设置主题色',
      content: '调整为你喜欢的主题色'
    },
    {
      el: '#user-dropdown',
      tipPosition: 'bottom',
      title: '个人中心',
      content: '查看个人资料和退出系统'
    },
    {
      el: '#menu-collapse',
      tipPosition: 'bottom',
      title: '展开/收起菜单',
      content: '一键展开/收起菜单'
    },
    {
      el: '#top-tab',
      tipPosition: 'bottom',
      title: '标签栏',
      content: '鼠标滚轮滑动可调整至最佳视野'
    },
    {
      el: '#layout-setting',
      tipPosition: 'left',
      title: '调整系统布局',
      content: '将系统布局调整为你喜欢的样子'
    }
  ]
}

function skip() {
  show.value = false
}

function done() {
  show.value = false
}

function next() {
  myIntroStep.value.next()
}

function prev() {
  myIntroStep.value.prev()
}
</script>
