import antfu from '@antfu/eslint-config'
import prettier from 'eslint-config-prettier'

export default antfu(
  {
    unocss: true,
    stylistic: false,
    ignores: ['docs/**'],
    rules: {
      // 基线兼容规则：避免一次性击穿历史代码
      'arrow-parens': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/no-setup-props-destructure': 'off',
      'vue/block-order': 'off',
      'no-fallthrough': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      'n/prefer-global/process': 'off',
      'prefer-promise-reject-errors': 'off',
      'no-undef': 'warn',
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ],
      // 文件级软约束：先提示历史文件里的 BOM 问题，不直接阻断
      'unicode-bom': ['warn', 'never'],
      // 代码风格提示：先把历史问题显性化
      eqeqeq: ['warn', 'always'],
      'no-var': 'warn',
      'prefer-const': 'warn',
      'no-debugger': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // 与 Prettier 格式化冲突，交由 Prettier 处理
      'antfu/if-newline': 'off'
    },
    languageOptions: {
      globals: {
        // Vue auto-imports
        ref: 'readonly',
        reactive: 'readonly',
        computed: 'readonly',
        watch: 'readonly',
        watchEffect: 'readonly',
        watchPostEffect: 'readonly',
        watchSyncEffect: 'readonly',
        onMounted: 'readonly',
        onBeforeMount: 'readonly',
        onUnmounted: 'readonly',
        onBeforeUnmount: 'readonly',
        onUpdated: 'readonly',
        onBeforeUpdate: 'readonly',
        onActivated: 'readonly',
        onDeactivated: 'readonly',
        onErrorCaptured: 'readonly',
        onRenderTracked: 'readonly',
        onRenderTriggered: 'readonly',
        h: 'readonly',
        unref: 'readonly',
        toRef: 'readonly',
        toRefs: 'readonly',
        toValue: 'readonly',
        isRef: 'readonly',
        shallowRef: 'readonly',
        shallowReactive: 'readonly',
        shallowReadonly: 'readonly',
        triggerRef: 'readonly',
        customRef: 'readonly',
        readonly: 'readonly',
        markRaw: 'readonly',
        provide: 'readonly',
        inject: 'readonly',
        defineComponent: 'readonly',
        defineAsyncComponent: 'readonly',
        nextTick: 'readonly',
        onScopeDispose: 'readonly',
        effectScope: 'readonly',
        getCurrentScope: 'readonly',
        getCurrentInstance: 'readonly',
        // Vue Router auto-imports
        useRoute: 'readonly',
        useRouter: 'readonly',
        onBeforeRouteLeave: 'readonly',
        onBeforeRouteUpdate: 'readonly',
        // Arco Design globals
        Message: 'readonly',
        $loadingBar: 'readonly',
        $message: 'readonly',
        $dialog: 'readonly',
        $notification: 'readonly',
        $modal: 'readonly'
      }
    }
  },
  prettier
)
