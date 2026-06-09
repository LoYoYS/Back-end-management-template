<!--------------------------------
 - @Author: Ronnie Zhang
 - @LastEditor: Ronnie Zhang
 - @LastEditTime: 2024/01/13 17:41:38
 - @Email: zclzone@outlook.com
 - Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 --------------------------------->

<template>
  <a-modal
    v-model:visible="show"
    class="me-modal"
    :modal-style="{ width: modalOptions.width, ...modalOptions.modalStyle }"
    :footer="false"
    :closable="false"
    :mask-closable="modalOptions.closable"
    :unmount-on-close="true"
    draggable
  >
    <div class="me-modal__panel" :style="modalOptions.contentStyle">
      <header class="me-modal__header">
        <span class="me-modal__title">{{ modalOptions.title }}</span>
        <button v-if="modalOptions.closable" type="button" class="me-modal__close" @click="close()">
          <i class="i-mdi:close text-18" />
        </button>
      </header>

      <div class="me-modal__body">
        <slot />
      </div>

      <slot name="footer">
        <footer v-if="modalOptions.showFooter" class="me-modal__footer">
          <a-button v-if="modalOptions.showCancel" @click="handleCancel()">
            {{ modalOptions.cancelText }}
          </a-button>
          <a-button
            v-if="modalOptions.showOk"
            type="primary"
            :loading="modalOptions.okLoading"
            class="me-modal__ok"
            @click="handleOk()"
          >
            {{ modalOptions.okText }}
          </a-button>
        </footer>
      </slot>
    </div>
  </a-modal>
</template>

<script setup>
const props = defineProps({
  width: {
    type: String,
    default: '800px'
  },
  title: {
    type: String,
    default: ''
  },
  closable: {
    type: Boolean,
    default: true
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  okText: {
    type: String,
    default: '确定'
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  showOk: {
    type: Boolean,
    default: true
  },
  modalStyle: {
    type: Object,
    default: () => {}
  },
  contentStyle: {
    type: Object,
    default: () => {}
  },
  onOk: {
    type: Function,
    default: () => {}
  },
  onCancel: {
    type: Function,
    default: () => {}
  }
})
// 声明一个show变量，用于控制模态框的显示与隐藏
const show = ref(false)
// 声明一个modalOptions变量，用于存储模态框的配置信息
const modalOptions = ref({})

const okLoading = computed({
  get() {
    return !!modalOptions.value?.okLoading
  },
  set(v) {
    if (modalOptions.value) {
      modalOptions.value.okLoading = v
    }
  }
})

// 打开模态框
async function open(options = {}) {
  modalOptions.value = { ...props, ...options }
  show.value = true
}

function close() {
  show.value = false
}

async function handleOk(data) {
  if (typeof modalOptions.value.onOk !== 'function') {
    return close()
  }
  try {
    const res = await modalOptions.value.onOk(data)
    if (res !== false) close()
  } catch (error) {
    console.error(error)
    okLoading.value = false
  }
}

async function handleCancel(data) {
  if (typeof modalOptions.value.onCancel !== 'function') {
    return close()
  }
  try {
    const res = await modalOptions.value.onCancel(data)
    if (res !== false) close()
  } catch (error) {
    console.error(error)
    okLoading.value = false
  }
}
defineExpose({
  open,
  close,
  handleOk,
  handleCancel,
  okLoading,
  options: modalOptions
})
</script>

<style scoped lang="scss">
.me-modal {
  :deep(.arco-modal-body) {
    padding: 0;
  }
}

.me-modal__panel {
  border-radius: 12px;
  background-color: var(--color-bg-2);
}

.me-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 0;
  font-size: 16px;
  font-weight: 600;
}

.me-modal__title {
  min-width: 0;
  color: var(--color-text-1);
}

.me-modal__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--color-text-2);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background-color: var(--color-fill-2);
    color: var(--color-text-1);
  }
}

.me-modal__body {
  padding: 16px 20px 20px;
}

.me-modal__footer {
  display: flex;
  justify-content: flex-end;
  padding: 0 20px 20px;
}

.me-modal__ok {
  margin-left: 20px;
}
</style>
