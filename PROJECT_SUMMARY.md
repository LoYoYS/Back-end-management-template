# 项目概览

本文档用于快速说明当前前端项目的技术结构、运行链路、核心约定和二次开发切入点，便于后续在本项目上持续迭代。

## 1. 当前项目状态

- 当前项目根目录已经具备前端项目运行所需的主要文件。
- 当前项目来源于 `vue-naive-admin` 模板。

## 2. 技术栈

- 构建工具：`Vite 8`
- 前端框架：`Vue 3`
- 路由：`vue-router`
- 状态管理：`Pinia`
- UI 组件库：`Naive UI`
- 原子化样式：`UnoCSS`
- 请求库：`Axios`
- 图表：`ECharts`、`vue-echarts`
- 工具库：`@vueuse/core`、`lodash-es`、`dayjs`
- 数据导出：`xlsx`

项目整体采用 `JavaScript`，没有引入 `TypeScript`。

## 3. 目录结构

当前重点目录如下：

- `src`
  - 主体业务代码目录
- `src/api`
  - 应用级 API 定义
- `src/views`
  - 页面级视图目录
- `src/components`
  - 通用组件与业务复用组件
- `src/composables`
  - 组合式逻辑封装
- `src/layouts`
  - 布局层实现
- `src/router`
  - 路由与路由守卫
- `src/store`
  - Pinia 状态模块
- `src/utils`
  - 请求层、存储、通用工具
- `src/directives`
  - 自定义指令
- `src/styles`
  - 全局样式
- `build`
  - 构建期辅助逻辑与自定义 Vite 插件
- `public`
  - 静态资源

## 4. 启动与构建

`package.json` 中的核心脚本如下：

- `npm run dev`
  - 启动本地开发服务
- `npm run build`
  - 生产构建
- `npm run preview`
  - 预览构建结果

当前 Vite 默认开发端口：

- `3200`

路径别名：

- `@` 指向 `src`
- `~` 指向项目根目录

## 5. 环境变量

核心环境文件：

- `.env.development`
- `.env.production`

关键变量：

- `VITE_USE_HASH`
  - 控制是否使用 Hash 路由
- `VITE_PUBLIC_PATH`
  - 公共基础路径
- `VITE_AXIOS_BASE_URL`
  - Axios 基础请求路径
- `VITE_PROXY_TARGET`
  - 本地代理目标地址

当前实际情况：

- 开发环境默认 `VITE_USE_HASH = 'true'`
- 生产环境默认 `VITE_USE_HASH = 'false'`
- 当前默认接口地址仍指向 `Apifox mock`
- 如果后续接真实后端，优先将 `VITE_AXIOS_BASE_URL` 切到 `/api`，再通过 Vite 代理转发

## 6. 应用启动链路

应用入口文件为：

- `src/main.js`

启动顺序如下：

1. 创建 Vue 应用实例
2. 注册 Pinia
3. 注册自定义指令
4. 注册路由与路由守卫
5. 挂载应用
6. 初始化 Naive UI 的全局离散 API

对应调用顺序：

1. `createApp(App)`
2. `setupStore(app)`
3. `setupDirectives(app)`
4. `await setupRouter(app)`
5. `app.mount('#app')`
6. `setupNaiveDiscreteApi()`

## 7. 根组件与布局体系

根组件文件：

- `src/App.vue`

根组件承担的职责：

- 注入 Naive UI 全局主题配置
- 根据当前路由 `meta.layout` 或应用设置选择布局组件
- 承载页面切换动画
- 根据 Tab 状态控制 `KeepAlive`
- 渲染布局设置组件

当前内置布局：

- `src/layouts/normal`
- `src/layouts/full`
- `src/layouts/simple`
- `src/layouts/empty`

当前默认布局配置位于：

- `src/settings.js`

其中默认布局值为：

- `normal`

## 8. 全局配置

全局配置文件：

- `src/settings.js`

当前主要内容：

- 默认布局
- 默认主题色
- Naive UI 主题覆盖配置
- 是否显示布局设置面板
- 基础权限菜单 `basePermissions`

这里的 `basePermissions` 很重要：

- 当后端权限体系未完全接通时，可以在这里临时补静态菜单
- 这些菜单会与后端返回的权限树合并

## 9. 路由体系

路由入口文件：

- `src/router/index.js`

静态基础路由定义文件：

- `src/router/basic-routes.js`

当前基础静态页面包括：

- `/login`
- `/`
- `/403`
- `/404`

### 9.1 路由模式

项目根据环境变量动态决定：

- `createWebHashHistory`
- 或 `createWebHistory`

### 9.2 动态路由机制

项目的核心特点之一是：

- 菜单和页面路由主要由权限数据驱动，而不是全部写死在前端

运行过程如下：

1. 登录成功后只先保存 Token
2. 首次访问受保护页面时，路由守卫拉取用户信息和权限树
3. 权限树在 `permission store` 中被转换为菜单和动态路由
4. 动态路由通过 `router.addRoute()` 注入运行时路由表

动态组件加载方式：

- 使用 `import.meta.glob('@/views/**/*.vue')`

这意味着：

- 后端权限数据中的 `component` 字段必须能精确匹配 `src/views` 下的页面路径

## 10. 路由守卫

守卫注册文件：

- `src/router/guards/index.js`

当前包含四类守卫：

- 页面加载守卫
- 权限守卫
- 页面标题守卫
- Tab 守卫

其中最核心的是：

- `src/router/guards/permission-guard.js`

其主要逻辑如下：

- 没有 Token：
  - 放行白名单页面
  - 其余跳转登录页
- 有 Token 且访问登录页：
  - 直接跳首页
- 有 Token 但用户信息未加载：
  - 并发获取用户信息与权限树
  - 生成菜单与动态路由
  - 重新进入目标路由
- 有 Token 但目标路由不存在：
  - 调接口校验该路径是否是“有权限但未放行”还是“路径不存在”
  - 从而区分 `403` 和 `404`

这个设计意味着：

- 项目对“权限不足”和“页面不存在”做了明确区分
- 二次开发时如果新增页面，但没配权限资源，很可能不会在菜单中出现，也无法通过正常权限流程访问

## 11. 状态管理

Pinia 初始化文件：

- `src/store/index.js`

已启用：

- `pinia-plugin-persistedstate`

核心状态模块如下。

### 11.1 app 模块

文件：

- `src/store/modules/app.js`

主要负责：

- 侧边栏收起状态
- 暗黑模式状态
- 当前布局模式
- 当前主题色
- Naive UI 主题覆盖对象

### 11.2 auth 模块

文件：

- `src/store/modules/auth.js`

主要负责：

- 保存 `accessToken`
- 登录态清理
- 退出登录
- 切换角色后的状态重置

这是登录态重置的核心模块。

### 11.3 user 模块

文件：

- `src/store/modules/user.js`

主要负责：

- 当前用户信息
- 用户名
- 昵称
- 头像
- 当前角色
- 角色列表

### 11.4 permission 模块

文件：

- `src/store/modules/permission.js`

主要负责：

- 保存原始权限树
- 生成侧边栏菜单
- 生成动态可访问路由 `accessRoutes`

这是项目最关键的业务中枢之一。

### 11.5 router 模块

文件：

- `src/store/modules/router.js`

主要负责：

- 暴露当前 `router` 和 `route`
- 在退出登录或切换角色时移除已注入的动态路由

### 11.6 tab 模块

文件：

- `src/store/modules/tab.js`

主要负责：

- 多页签状态管理
- 页面刷新与缓存控制

## 12. 权限模型

项目权限不是简单地“前端写菜单，后端只验接口”，而是：

- 后端权限树驱动前端菜单
- 后端权限树驱动前端动态路由
- 当前路由的按钮权限再反向驱动页面内按钮显隐

### 12.1 菜单权限

菜单和路由转换逻辑位于：

- `src/store/modules/permission.js`

权限项转换后的路由结构包含：

- `name`
- `path`
- `redirect`
- `component`
- `meta.icon`
- `meta.title`
- `meta.layout`
- `meta.keepAlive`
- `meta.parentKey`
- `meta.btns`

### 12.2 按钮权限

自定义指令文件：

- `src/directives/index.js`

当前机制：

- 当前页面可见按钮权限来自当前路由 `meta.btns`
- `v-permission="'AddUser'"` 这样的写法会根据当前页面按钮权限码决定是否移除元素

这意味着：

- 页面内按钮权限不是额外查一遍接口，而是依赖当前菜单权限节点中的 `BUTTON` 子节点

## 13. 请求层设计

请求入口：

- `src/utils/http/index.js`

拦截器：

- `src/utils/http/interceptors.js`

错误处理辅助：

- `src/utils/http/helpers.js`

### 13.1 请求拦截

请求发送前：

- 如果不是 `needToken === false`
- 自动在请求头挂载 `Authorization: Bearer <token>`

### 13.2 响应拦截

当前成功状态码约定为：

- `0`
- `200`

如果响应是 JSON 且不属于成功码：

- 统一走错误分发逻辑
- 通过全局消息或对话框提示用户

### 13.3 登录过期处理

当接口返回以下状态时：

- `401`
- `11007`
- `11008`

会触发统一确认弹窗，随后执行登出逻辑。

二次开发注意事项：

- 如果后端成功码规范与这里不同，需要先改拦截器
- 新增 API 文件建议继续保持“页面目录下独立 `api.js`”或“公共 API 放 `src/api`”的现有风格

## 14. 全局消息与对话框

文件：

- `src/utils/naiveTools.js`

项目对 Naive UI 离散 API 做了统一封装，并挂在 `window` 上：

- `window.$message`
- `window.$dialog`
- `window.$notification`
- `window.$loadingBar`

这带来的好处：

- 任意页面和工具函数都可以统一使用消息与弹窗

同时也意味着：

- 某些通用逻辑对全局运行时环境有依赖，后续若做 SSR 或更严格的运行隔离，需要额外处理

## 15. 通用业务抽象

项目已经内置一套适合后台系统的通用业务抽象。

### 15.1 CRUD 抽象

主要文件：

- `src/composables/useCrud.js`
- `src/components/me/crud/index.vue`
- `src/composables/useForm.js`
- `src/composables/useModal.js`

主要能力：

- 列表查询
- 分页处理
- 新增
- 编辑
- 查看
- 删除
- 弹窗表单联动
- Excel 导出

### 15.2 CRUD 约定

如果使用 `MeCrud`，默认接口约定如下：

请求分页参数：

- `pageNo`
- `pageSize`

响应数据结构：

- `data.pageData`
- `data.total`

如果后端接口不符合这个约定：

- 要么在页面层适配
- 要么修改 `MeCrud` 的通用行为

### 15.3 适用策略

后续新增后台管理页面时，优先复用：

- `MeCrud`
- `MeModal`
- `MeQueryItem`
- `useCrud`

这样可以减少重复表格、查询栏、弹窗表单代码。

## 16. 构建期辅助能力

`build` 目录下有两个很关键的能力。

### 16.1 页面路径生成

文件：

- `build/index.js`
- `build/plugin-isme/page-pathes.js`

用途：

- 扫描 `src/views/**/*.vue`
- 生成页面路径列表
- 供权限资源维护界面下拉选择页面组件路径

### 16.2 图标列表生成

文件：

- `build/index.js`
- `build/plugin-isme/icons.js`

用途：

- 扫描本地图标目录
- 生成可用图标 safelist
- 解决动态图标类名在 UnoCSS 下无法静态分析的问题

### 16.3 当前图标目录

- `src/assets/icons/isme`
- `src/assets/icons/feather`

## 17. 页面模块梳理

### 17.1 登录页

目录：

- `src/views/login`

特点：

- 支持验证码
- 支持记住账号密码
- 支持一键体验登录
- 登录成功后只保存 Token
- 用户与权限数据在路由守卫阶段拉取

### 17.2 首页

目录：

- `src/views/home`

特点：

- 作为模板演示页
- 使用当前用户信息渲染欢迎区
- 使用 ECharts 展示示例图表

### 17.3 用户管理

目录：

- `src/views/pms/user`

能力：

- 用户分页列表
- 创建用户
- 分配角色
- 重置密码
- 启用/停用
- 删除用户

### 17.4 角色管理

目录：

- `src/views/pms/role`

能力：

- 角色 CRUD
- 角色权限树配置
- 角色与用户关联管理

### 17.5 资源权限管理

目录：

- `src/views/pms/resource`

能力：

- 菜单树维护
- 按钮权限维护
- 页面路径选择
- 图标选择

这个模块本质上是“前端权限路由配置的后台管理界面”。

### 17.6 其他示例页面

- `src/views/profile`
- `src/views/base`
- `src/views/demo/upload`
- `src/views/iframe`

这些页面更适合作为开发参考样例。

## 18. 样式体系

UnoCSS 配置文件：

- `uno.config.js`

当前启用：

- `presetWind3`
- `presetAttributify`
- `presetIcons`
- `presetRemToPx`

项目还定义了一些常用快捷类，例如：

- `wh-full`
- `f-c-c`
- `flex-col`
- `card-border`
- `auto-bg`
- `auto-bg-hover`
- `auto-bg-highlight`
- `text-highlight`

主题色通过 CSS 变量控制：

- `--primary-color`

二次开发建议：

- 优先复用 UnoCSS 快捷类和现有设计风格
- 页面级样式若需新增，按照项目规则使用 `scss`

## 19. 二次开发建议

### 19.1 新增一个业务模块的推荐步骤

1. 在 `src/views` 下创建新模块页面
2. 按需在同目录新增 `api.js`
3. 如果是标准后台列表页，优先使用 `MeCrud + MeModal + useCrud`
4. 在后端权限资源中新增菜单与按钮定义
5. 给目标角色授予新资源权限
6. 验证菜单生成、路由注入、按钮权限是否都生效

### 19.2 如果后端权限暂未接通

可以先在：

- `src/settings.js`

中的 `basePermissions` 里临时添加菜单资源，先完成前端开发。

### 19.3 如果要接真实后端

优先处理以下内容：

- 替换 `VITE_AXIOS_BASE_URL`
- 确认 Token 结构
- 确认成功响应码
- 确认分页响应结构
- 确认权限树字段结构

## 20. 当前已识别风险

- 根目录 `.git` 目前为空目录，当前项目还不是可用 Git 仓库
- 当前接口默认走 Mock 数据，不是真实业务后端
- 项目菜单和路由高度依赖权限树配置，单纯新增页面文件并不会自动出现在系统里
- `MeCrud` 对分页接口返回结构有固定假设
- 终端中部分中文注释显示乱码，属于当前终端编码表现问题，不一定表示源文件内容有逻辑错误

## 21. 后续建议优先级

建议后续按以下顺序完善：

1. 先修复并初始化 Git 仓库
2. 确认真实后端接入方式
3. 明确权限资源结构与页面路由映射规范
4. 在通用 CRUD 抽象基础上开展业务页面开发
5. 持续维护本文件，记录新增模块与项目约定

## 22. 与后续协作的关系

后续若继续在本项目中开发新功能，我会默认基于以下理解推进：

- 这是一个以权限树驱动菜单和动态路由的 Vue 3 后台系统
- 业务开发应尽量复用现有 CRUD 体系
- 文档与注释应以中文为主
- 不做无价值抽象，优先直接、稳定、可维护的实现
