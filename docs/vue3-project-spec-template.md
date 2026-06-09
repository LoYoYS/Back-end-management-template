# 通用 Vue3 项目开发规范模板

## 1. 适用范围

本模板适用于大多数 Vue 3 前端项目，尤其是：

- 中后台项目
- 可视化项目
- 基于 Vite 的工程
- 多人协作仓库

目标不是追求“配置越多越好”，而是建立一套稳、清晰、能长期维护的工程规范基线。

---

## 2. 推荐规范目标

建议新项目从第一天就明确四件事：

1. 包管理器统一
2. 代码质量检查统一
3. 代码格式统一
4. 提交行为统一

推荐默认组合：

- 包管理器：`pnpm`
- Lint：`ESLint`
- 格式化：`Prettier`
- 编辑器基础行为：`EditorConfig`
- 提交钩子：`Husky`
- 暂存区检查：`lint-staged`
- 提交信息规范：`commitlint`

---

## 3. 推荐目录与文件清单

一个完整的 Vue 3 工程规范基线，建议至少包含：

- `package.json`
- `.eslintrc.cjs`
- `.prettierrc.json`
- `.editorconfig`
- `.eslintignore`
- `.prettierignore`
- `.lintstagedrc.cjs`
- `commitlint.config.cjs`
- `.husky/pre-commit`
- `.husky/commit-msg`
- `.vscode/settings.json`
- `.vscode/extensions.json`
- `.gitignore`
- `README.md`

---

## 4. 推荐脚本规范

建议统一如下脚本：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext .vue,.js,.jsx,.ts,.tsx,.cjs,.mjs",
    "lint:fix": "eslint . --ext .vue,.js,.jsx,.ts,.tsx,.cjs,.mjs --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "prepare": "husky"
  }
}
```

建议原则：

- `lint` 和 `lint:fix` 分开
- `format` 和 `format:check` 分开
- `prepare` 用于安装后初始化 Husky

---

## 5. 推荐 ESLint 策略

### 5.1 新项目策略

新项目建议直接偏严格：

```js
'no-undef': 'error',
'no-unused-vars': ['error', {
  argsIgnorePattern: '^_',
  varsIgnorePattern: '^_',
  ignoreRestSiblings: true
}],
eqeqeq: ['error', 'always'],
'no-var': 'error',
'prefer-const': 'error',
'no-debugger': 'error',
'no-console': ['warn', { allow: ['warn', 'error'] }]
```

原因：

- 新项目没有历史包袱
- 越早统一，后期成本越低

### 5.2 历史项目策略

历史项目不要一上来就全开 `error`。

建议顺序：

1. 先 `warn`
2. 清理历史问题
3. 再升 `error`

### 5.3 自动导入项目注意事项

如果项目用了：

- `unplugin-auto-import`
- Vue 自动导入
- Pinia 自动导入
- Vue Router 自动导入

要同步维护 ESLint `globals`，否则 `no-undef` 会出现大量误报。

---

## 6. 推荐 Prettier 策略

推荐基础配置：

```json
{
  "semi": false,
  "tabWidth": 2,
  "singleQuote": true,
  "printWidth": 100,
  "trailingComma": "none",
  "endOfLine": "auto"
}
```

说明：

- `semi: false`：无分号风格
- `tabWidth: 2`：2 空格缩进
- `singleQuote: true`：单引号
- `printWidth: 100`：避免过长行
- `trailingComma: none`：降低尾逗号争议
- `endOfLine: auto`：Windows 团队更稳

如果团队已经明确统一 LF，可把 `endOfLine` 改成 `lf`。

---

## 7. 推荐 EditorConfig 策略

推荐配置：

```ini
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

作用：

- 统一基础编辑器行为
- 减少“我本地和你本地不一样”的问题

---

## 8. 推荐提交规范策略

### 8.1 pre-commit

推荐只校验暂存区文件：

```js
module.exports = {
  '*.{vue,js,jsx,ts,tsx,cjs,mjs}': ['eslint --fix', 'prettier --write'],
  '*.{json,css,scss,md,yml,yaml}': ['prettier --write']
}
```

原因：

- 提交速度更稳
- 不会被全仓库历史问题击穿

### 8.2 commit-msg

推荐使用 Conventional Commits：

```text
type(scope): subject
```

示例：

```text
feat(login): 新增登录校验
fix(map): 修复图层重复渲染
chore(config): 对齐工程配置
```

emoji 可以支持，但不建议强制要求。

---

## 9. 推荐 VS Code 工作区策略

推荐配置重点：

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact", "vue"],
  "js/ts.format.enabled": false
}
```

推荐插件：

- ESLint
- Prettier
- Volar
- Vue TypeScript 插件

原则：

- 工作区配置只保留项目必要项
- 不提交个人偏好项

---

## 10. 推荐 `.gitignore` 策略

推荐保留：

```gitignore
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
```

作用：

- 允许项目级工作区配置入库
- 避免个人编辑器临时文件污染仓库

---

## 11. Vue 组件样式建议

如果团队统一使用 SCSS，建议从第一天就固定：

- `.vue` 中统一使用 `lang="scss"`
- 类名使用 `kebab-case`
- 样式优先按组件结构嵌套

不要在一个项目里长期混用：

- 纯 `css`
- `scss`
- `less`

除非团队明确允许。

---

## 12. 推荐落地顺序

建议按下面顺序推，不要一次性把所有规则全打满：

### 第一步：统一工具链

- `pnpm`
- `ESLint`
- `Prettier`
- `EditorConfig`

### 第二步：接入提交流程

- `Husky`
- `lint-staged`
- `commitlint`

### 第三步：逐步收紧规则

- `no-unused-vars`
- `no-undef`
- `no-console`
- `eqeqeq`

### 第四步：接入 CI

至少建议在 CI 中增加：

```sh
pnpm lint
pnpm format:check
pnpm build
```

---

## 13. 新项目与历史项目的不同处理方式

### 新项目

建议：

- 一开始就严格
- 规则尽量直接用 `error`

### 历史项目

建议：

- 先让工具链跑通
- 先 `warn`
- 再做历史治理
- 最后再升 `error`

这是成本最低、也最不容易引发大面积冲突的做法。

---

## 14. 一套可复用的落地原则

如果要把这套规范迁移到下一个项目，最应该复用的是下面这条链路，而不是单独某一个文件：

1. 编辑器统一行为
2. ESLint 负责代码质量
3. Prettier 负责格式统一
4. 提交前只校验暂存区
5. 提交信息统一格式
6. 历史项目先告警，再收紧

这套方法足够稳，也足够通用，适合大多数 Vue 3 团队项目。
