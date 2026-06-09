export const defaultLayout = 'normal'

export const defaultPrimaryColor = '#316C72'

export const systemName = import.meta.env.VITE_TITLE || 'Vue Arco Admin'

// 控制布局设置组件是否可见。
export const layoutSettingVisible = true

export const basePermissions = [
  {
    code: 'ExternalLink',
    name: '外链(可内嵌打开)',
    type: 'MENU',
    icon: 'i-fe:external-link',
    order: 98,
    enable: true,
    show: true,
    children: [
      {
        code: 'ShowDocs',
        name: '项目文档',
        type: 'MENU',
        path: 'https://isme.top',
        icon: 'i-me:docs',
        order: 1,
        enable: true,
        show: true
      },
      {
        code: 'ApiFoxDocs',
        name: '接口文档',
        type: 'MENU',
        path: 'https://apifox.com/apidoc/shared-ff4a4d32-c0d1-4caf-b0ee-6abc130f734a',
        icon: 'i-me:apifox',
        order: 2,
        enable: true,
        show: true
      },
      {
        code: 'ArcoDocs',
        name: 'Arco Design',
        type: 'MENU',
        path: 'https://arco.design/vue',
        icon: 'i-mdi:palette-outline',
        order: 3,
        enable: true,
        show: true
      },
      {
        code: 'MyBlog',
        name: '博客-掘金',
        type: 'MENU',
        path: 'https://juejin.cn/user/1961184475483255/posts',
        icon: 'i-simple-icons:juejin',
        order: 4,
        enable: true,
        show: true
      }
    ]
  }
]
