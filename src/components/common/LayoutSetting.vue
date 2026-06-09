<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2023/12/16 18:49:53
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <div>
    <a-tooltip position="left" content="布局设置">
      <div id="layout-setting" class="f-c-c rounded-4 bg-primary p-8" @click="modalRef.open()">
        <i class="i-fe:settings cursor-pointer bg-white text-20" />
      </div>
    </a-tooltip>

    <MeModal ref="modalRef" title="布局设置" :show-footer="false" width="600px">
      <div class="layout-options">
        <div class="layout-option" @click="setLayout('simple')">
          <div class="layout-preview layout-preview--simple">
            <span class="layout-block layout-block--aside" />
            <span class="layout-block layout-block--content" />
          </div>
          <button
            type="button"
            class="layout-option__button"
            :class="{ 'layout-option__button--active': currentLayout === 'simple' }"
          >
            简约
          </button>
        </div>

        <div class="layout-option" @click="setLayout('normal')">
          <div class="layout-preview layout-preview--normal">
            <span class="layout-block layout-block--aside" />
            <div class="layout-main">
              <span class="layout-block layout-block--header" />
              <span class="layout-block layout-block--content" />
            </div>
          </div>
          <button
            type="button"
            class="layout-option__button"
            :class="{ 'layout-option__button--active': currentLayout === 'normal' }"
          >
            通用
          </button>
        </div>

        <div class="layout-option" @click="setLayout('full')">
          <div class="layout-preview layout-preview--full">
            <span class="layout-block layout-block--aside" />
            <div class="layout-main">
              <span class="layout-block layout-block--toolbar" />
              <span class="layout-block layout-block--header-thin" />
              <span class="layout-block layout-block--content" />
            </div>
          </div>
          <button
            type="button"
            class="layout-option__button"
            :class="{ 'layout-option__button--active': currentLayout === 'full' }"
          >
            全面
          </button>
        </div>

        <div class="layout-option" @click="setLayout('empty')">
          <div class="layout-preview layout-preview--empty">
            <span class="layout-block layout-block--content" />
          </div>
          <button
            type="button"
            class="layout-option__button"
            :class="{ 'layout-option__button--active': currentLayout === 'empty' }"
          >
            空白
          </button>
        </div>
      </div>

      <p class="layout-tip">
        注：此设置仅对未设置 layout 或设置成跟随系统的页面有效，菜单设置的 layout 优先级最高。
      </p>
    </MeModal>
  </div>
</template>

<script setup>
import { MeModal } from '@/components'
import { useModal } from '@/composables'
import { defaultLayout } from '@/settings'
import { useAppStore } from '@/store'

const appStore = useAppStore()
const [modalRef] = useModal()
const currentLayout = computed(() => appStore.layout || defaultLayout)

function setLayout(layout) {
  appStore.setLayout(layout)
}
</script>

<style scoped lang="scss">
.layout-options {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.layout-option {
  display: flex;
  cursor: pointer;
  flex-direction: column;
  align-items: center;

  &__button {
    width: 92px;
    height: 32px;
    cursor: pointer;
    border: 1px solid rgba(var(--primary-color), 0.55);
    border-radius: 4px;
    color: rgb(var(--primary-color));
    background-color: transparent;
    transition: all 0.2s ease;

    &--active {
      border-color: rgb(var(--primary-color));
      color: #fff;
      background-color: rgb(var(--primary-color));
    }
  }
}

.layout-preview {
  display: flex;
  width: 104px;
  height: 60px;
  margin-bottom: 12px;
  gap: 4px;
}

.layout-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
}

.layout-block {
  display: block;
  border-radius: 2px;
  background: #e5e7eb;

  &--aside {
    width: 20px;
    height: 100%;
  }

  &--toolbar {
    width: 100%;
    height: 6px;
  }

  &--header-thin {
    width: 100%;
    height: 4px;
  }

  &--header {
    width: 100%;
    height: 10px;
  }

  &--content {
    flex: 1;
  }
}

.layout-tip {
  margin-top: 16px;
  color: rgba(15, 23, 42, 0.5);
}
</style>
