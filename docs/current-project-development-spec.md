# 当前项目开发规范说明

## 1. 文档目的

本文档只描述当前项目已经实际落地的工程规范，不讨论通用模板，只回答当前仓库里的三个问题：

1. 配了什么
2. 分别有什么作用
3. 什么时候生效

---

## 2. 当前项目规范总览

| 规范模块          | 文件                                                | 作用                                       | 生效时机                                                       |
| ----------------- | --------------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------- |
| 包管理与脚本      | `package.json`                                      | 统一依赖安装、构建、Lint、格式化命令入口   | 手动执行命令时                                                 |
| 代码质量检查      | `.eslintrc.cjs`                                     | 检查语法错误、潜在 Bug、非推荐写法         | 执行 `pnpm lint` / `pnpm lint:fix`、保存触发 ESLint 时         |
| 代码格式化        | `.prettierrc.json`                                  | 统一格式风格                               | 执行 `pnpm format` / `pnpm format:check`、VS Code 保存格式化时 |
| 编辑器基础行为    | `.editorconfig`                                     | 统一缩进、编码、换行、尾随空格策略         | 编辑器保存文件时                                               |
| Lint 忽略范围     | `.eslintignore`                                     | 排除不需要 ESLint 扫描的目录与文件         | 执行 ESLint 时                                                 |
| Prettier 忽略范围 | `.prettierignore`                                   | 排除不需要格式化的目录与文件               | 执行 Prettier 时                                               |
| 提交前校验        | `.husky/pre-commit` + `.lintstagedrc.cjs`           | 仅检查暂存区文件                           | `git commit` 时                                                |
| 提交信息校验      | `.husky/commit-msg` + `commitlint.config.cjs`       | 统一提交信息格式                           | `git commit` 时                                                |
| 编辑器工作区建议  | `.vscode/settings.json` + `.vscode/extensions.json` | 统一 VS Code 保存行为与推荐插件            | 使用 VS Code 打开项目时                                        |
| Git 跟踪策略      | `.gitignore`                                        | 忽略无关文件，同时允许提交必要的工作区配置 | `git status` / `git add` 时                                    |
| 开发说明          | `README.md`                                         | 提供开发命令、提交规范、临时跳过说明       | 人工查阅时                                                     |

---

## 3. 当前项目实际配置

### 3.1 `package.json`

当前项目统一使用 `pnpm`，规范相关脚本如下：

```json
{
  "scripts": {
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs",
    "lint:fix": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs --fix",
    "format": "prettier --write \"src/**/*.{vue,js,jsx,cjs,mjs,json,css,scss}\" \"*.{json,md}\" .vscode/settings.json .vscode/extensions.json",
    "format:check": "prettier --check \"src/**/*.{vue,js,jsx,cjs,mjs,json,css,scss}\" \"*.{json,md}\" .vscode/settings.json .vscode/extensions.json",
    "prepare": "husky"
  }
}
```

作用：

- `lint`：代码质量检查，不改文件
- `lint:fix`：自动修复可修复问题
- `format`：格式化文件
- `format:check`：只检查格式是否合规
- `prepare`：安装依赖后启用 Husky

### 3.2 `.eslintrc.cjs`

当前 ESLint 基线：

- `plugin:vue/vue3-essential`
- `eslint:recommended`
- `@vue/eslint-config-prettier/skip-formatting`

当前已生效的重点规则：

```js
'arrow-parens': 'off',
'vue/multi-word-component-names': 'off',
'vue/no-setup-props-destructure': 'off',
'no-undef': 'warn',
'no-unused-vars': ['warn', {
  argsIgnorePattern: '^_',
  varsIgnorePattern: '^_',
  ignoreRestSiblings: true
}],
'unicode-bom': ['warn', 'never'],
eqeqeq: ['warn', 'always'],
'no-var': 'warn',
'prefer-const': 'warn',
'no-debugger': 'warn',
'no-console': ['warn', { allow: ['warn', 'error'] }]
```

作用：

- `no-undef`：提示未定义变量
- `no-unused-vars`：提示无用变量、无用参数、无用导入
- `unicode-bom`：提示 BOM
- `eqeqeq`：提示使用严格比较
- `no-var` / `prefer-const`：提示变量声明规范
- `no-debugger` / `no-console`：提示调试与日志问题

当前状态：

- `pnpm lint` 可以通过
- 仍保留一批 `no-unused-vars` 告警，属于历史存量

### 3.3 `globals`

当前项目在 ESLint 中额外声明了三类全局：

- Vue / Vue Router / Pinia 自动导入标识
  - 如 `ref`、`reactive`、`computed`、`watch`、`onMounted`、`storeToRefs`
- 项目运行环境全局
  - 如 `__g`、`HostConfig`、`MqttConfig`、`DigitalTwinPlayer`
- 业务辅助全局
  - 如 `RendererType`、`__getEchartsSize`、`ElMessage`

作用：

- 避免真实存在的全局对象被 `no-undef` 误报

### 3.4 `.prettierrc.json`

当前 Prettier 配置：

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

作用：

- 统一无分号、2 空格、单引号、100 列换行
- `endOfLine: auto` 用于兼容当前 Windows 仓库与历史文件

### 3.5 `.editorconfig`

当前配置：

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

- 统一 UTF-8 编码
- 统一 2 空格缩进
- 统一文件末尾换行
- Markdown 保留必要尾随空格

### 3.6 `.eslintignore`

当前忽略项：

```text
node_modules/
dist/
dist-ssr/
coverage/
public/
.vscode/
.idea/
*.d.ts
```

作用：

- 避免扫描依赖、构建产物、编辑器目录与类型生成文件

### 3.7 `.prettierignore`

当前忽略项：

```text
node_modules/
dist/
dist-ssr/
coverage/
public/
pnpm-lock.yaml
package-lock.json
```

作用：

- 避免格式化依赖、构建产物和锁文件

### 3.8 `.husky/pre-commit` 与 `.lintstagedrc.cjs`

当前提交前检查：

`/.husky/pre-commit`

```sh
lint-staged
```

`/.lintstagedrc.cjs`

```js
module.exports = {
  '*.{vue,js,jsx,cjs,mjs}': ['eslint --fix', 'prettier --write'],
  '*.{json,css,scss,md,yml,yaml}': ['prettier --write']
}
```

作用：

- 只处理暂存区文件
- 避免每次提交全量扫描整个仓库

### 3.9 `.husky/commit-msg` 与 `commitlint.config.cjs`

当前提交信息校验：

`/.husky/commit-msg`

```sh
commitlint --edit "$1"
```

当前支持的提交格式：

```text
feat(scope): subject
✨ feat(scope): subject
```

作用：

- 统一提交信息
- 允许手动补 emoji，但不强制

### 3.10 `.vscode/settings.json`

当前重点配置：

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript", "javascriptreact", "vue"],
  "js/ts.format.enabled": false,
  "editor.tabSize": 2,
  "editor.insertSpaces": true
}
```

作用：

- 保存即格式化
- 保存即执行 ESLint 修复
- 禁用 JS/TS 内置格式化，避免和 Prettier 冲突

### 3.11 `.vscode/extensions.json`

当前推荐插件：

- `dbaeumer.vscode-eslint`
- `esbenp.prettier-vscode`
- `Vue.volar`
- `Vue.vscode-typescript-vue-plugin`

### 3.12 `.gitignore`

当前关键配置：

```gitignore
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
```

作用：

- 默认忽略 `.vscode` 目录
- 只允许项目需要的工作区配置入库

### 3.13 Vue 样式约定

当前项目额外约定：

- `.vue` 样式统一使用 `scss`
- 样式优先嵌套组织
- 类名使用 `kebab-case`

---

## 4. 当前项目规范什么时候生效

### 4.1 编码阶段

- VS Code 保存时：
  - Prettier 格式化
  - ESLint 自动修复部分问题

### 4.2 手动检查阶段

- `pnpm lint`
- `pnpm lint:fix`
- `pnpm format`
- `pnpm format:check`

### 4.3 提交阶段

- `pre-commit`：检查暂存区文件
- `commit-msg`：检查提交信息格式

### 4.4 Git 跟踪阶段

- `git status`
- `git add`

---

## 5. 当前项目的临时绕过方式

### 单次跳过提交校验

```sh
git commit --no-verify -m "chore(config): 项目规范配置"
```

### 当前终端临时关闭 Husky

PowerShell:

```powershell
$env:HUSKY="0"
git commit -m "chore(config): 项目规范配置"
```

恢复：

```powershell
Remove-Item Env:HUSKY
```

---

## 6. 当前项目后续建议

当前项目后续最值得继续做的三件事：

1. 逐步清理 `no-unused-vars` 历史告警
2. 在全局声明稳定后，把 `no-undef` 从 `warn` 升到 `error`
3. 在 CI 中增加 `pnpm lint`、`pnpm format:check`、`pnpm build`
