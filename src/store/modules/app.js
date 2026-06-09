/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:25:31
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { generate, getRgbStr } from '@arco-design/color'
import { useDark } from '@vueuse/core'
import { defineStore } from 'pinia'
import { defaultLayout, defaultPrimaryColor } from '@/settings'

let appliedThemeToken = ''

function applyThemeColorVars(color, isDark) {
  if (typeof document === 'undefined') return

  const themeToken = `${color || defaultPrimaryColor}_${Number(!!isDark)}`
  if (appliedThemeToken === themeToken) return

  const colors = generate(color || defaultPrimaryColor, {
    list: true,
    dark: isDark
  })
  const root = document.documentElement
  const body = document.body
  const primaryColor = getRgbStr(colors[5])

  root.style.setProperty('--primary-color', primaryColor)
  body.style.setProperty('--primary-color', primaryColor)

  colors.forEach((item, index) => {
    const step = index + 1
    const rgb = getRgbStr(item)

    root.style.setProperty(`--arcoblue-${step}`, rgb)
    root.style.setProperty(`--primary-${step}`, rgb)
    root.style.setProperty(`--link-${step}`, rgb)
    body.style.setProperty(`--arcoblue-${step}`, rgb)
    body.style.setProperty(`--primary-${step}`, rgb)
    body.style.setProperty(`--link-${step}`, rgb)
  })

  appliedThemeToken = themeToken
}

export const useAppStore = defineStore('app', {
  state: () => ({
    collapsed: false,
    isDark: useDark(),
    layout: defaultLayout,
    primaryColor: defaultPrimaryColor
  }),
  actions: {
    switchCollapsed() {
      this.collapsed = !this.collapsed
    },
    setCollapsed(value) {
      this.collapsed = value
    },
    toggleDark() {
      this.isDark = !this.isDark
      this.setThemeColor(this.primaryColor, this.isDark)
    },
    setLayout(layout) {
      this.layout = layout
    },
    setPrimaryColor(color) {
      this.primaryColor = color || defaultPrimaryColor
      this.setThemeColor(this.primaryColor, this.isDark)
    },
    setThemeColor(color = this.primaryColor, isDark = this.isDark) {
      // 同步 Arco 和项目内自定义主题变量，避免主题色设置后局部颜色不一致。
      applyThemeColorVars(color || defaultPrimaryColor, isDark)
    }
  },
  persist: {
    pick: ['collapsed', 'layout', 'primaryColor'],
    storage: sessionStorage
  }
})
