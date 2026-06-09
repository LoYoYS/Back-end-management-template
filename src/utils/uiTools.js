/**********************************
 * @FilePath: uiTools.js
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/04 22:45:20
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { Message, Modal, Notification } from '@arco-design/web-vue'
import NProgress from 'nprogress'

export function setupMessage() {
  class MessageBridge {
    static instance

    constructor() {
      if (MessageBridge.instance) return MessageBridge.instance
      MessageBridge.instance = this
      this.message = new Map()
      this.removeTimer = new Map()
    }

    clearTimer(key) {
      const timer = this.removeTimer.get(key)
      if (timer) {
        clearTimeout(timer)
        this.removeTimer.delete(key)
      }
    }

    removeMessage(key, duration = 5000) {
      this.clearTimer(key)
      if (duration <= 0) {
        this.destroy(key, 0)
        return
      }
      this.removeTimer.set(
        key,
        setTimeout(() => this.destroy(key, 0), duration)
      )
    }

    destroy(key, duration = 200) {
      this.clearTimer(key)
      setTimeout(() => {
        this.message.get(key)?.close?.()
        this.message.delete(key)
        this.removeTimer.delete(key)
      }, duration)
    }

    showMessage(type, content, option = {}) {
      if (Array.isArray(content)) {
        return content.forEach((msg) => Message[type]({ content: msg, duration: option.duration }))
      }

      if (!option.key) {
        return Message[type]({
          content,
          duration: option.duration
        })
      }

      const current = Message[type]({
        id: option.key,
        content,
        duration: 0
      })

      this.message.set(option.key, current)
      this.removeMessage(option.key, option.duration)
    }

    loading(content, option) {
      this.showMessage('loading', content, option)
    }

    success(content, option) {
      this.showMessage('success', content, option)
    }

    error(content, option) {
      this.showMessage('error', content, option)
    }

    info(content, option) {
      this.showMessage('info', content, option)
    }

    warning(content, option) {
      this.showMessage('warning', content, option)
    }
  }

  return new MessageBridge()
}

function createDialogController(instance) {
  const controller = {
    close: () => instance.close?.(),
    update: (config) => instance.update?.(config)
  }

  Object.defineProperty(controller, 'loading', {
    get() {
      return false
    },
    set(value) {
      instance.update?.({ confirmLoading: !!value })
    }
  })

  return controller
}

export function setupDialog() {
  function openConfirm(option = {}) {
    const instance = Modal.confirm({
      title: option.title,
      content: option.content,
      okText: option.positiveText || '确定',
      cancelText: option.negativeText || '取消',
      hideCancel: option.showCancel === false,
      simple: true,
      messageType: option.type || 'warning',
      onOk: option.confirm,
      onCancel: option.cancel,
      onClose: option.onClose,
      maskClosable: true
    })

    return createDialogController(instance)
  }

  return {
    confirm: openConfirm,
    warning: (option) => openConfirm({ ...option, type: option?.type || 'warning' }),
    info: (option) => openConfirm({ ...option, type: 'info' }),
    success: (option) => openConfirm({ ...option, type: 'success' }),
    error: (option) => openConfirm({ ...option, type: 'error' })
  }
}

function setupLoadingBar() {
  NProgress.configure({ showSpinner: false })

  return {
    start() {
      NProgress.start()
    },
    finish() {
      NProgress.done()
    },
    error() {
      NProgress.done(true)
    }
  }
}

export function setupGlobalDiscreteApi() {
  window.$loadingBar = setupLoadingBar()
  window.$notification = Notification
  window.$message = setupMessage()
  window.$dialog = setupDialog()
}
