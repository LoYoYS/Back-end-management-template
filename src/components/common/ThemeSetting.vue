<template>
  <a-tooltip content="设置主题色">
    <a-trigger trigger="click" position="bottom" :unmount-on-close="false">
      <div id="theme-setting" class="theme-trigger" :style="{ '--theme-color': activeColor }">
        <span class="theme-trigger__inner" />
      </div>

      <template #content>
        <div class="theme-panel">
          <p class="theme-panel__title">设置主题色</p>

          <div class="theme-panel__swatches">
            <button
              v-for="color in primaryColors"
              :key="color"
              type="button"
              class="theme-swatch"
              :class="{ 'theme-swatch--active': color === activeColor }"
              :style="{ backgroundColor: color }"
              @click="setColor(color)"
            />
          </div>

          <label class="theme-panel__custom">
            <span>自定义</span>
            <input :value="activeColor" type="color" @input="onColorInput" />
          </label>
        </div>
      </template>
    </a-trigger>
  </a-tooltip>
</template>

<script setup>
import { getPresetColors } from '@arco-design/color'
import { defaultPrimaryColor } from '@/settings'
import { useAppStore } from '@/store'

const appStore = useAppStore()
const activeColor = computed(() => appStore.primaryColor || defaultPrimaryColor)
const primaryColors = Object.values(getPresetColors()).map((item) => item.primary)

function setColor(color) {
  appStore.setPrimaryColor(color)
}

function onColorInput(event) {
  setColor(event.target.value)
}
</script>

<style scoped lang="scss">
.theme-trigger {
  display: flex;
  width: 32px;
  height: 32px;
  margin-right: 10px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;

  &__inner {
    width: 24px;
    height: 24px;
    border-radius: 2px;
    background: var(--theme-color);
  }
}

.theme-panel {
  width: 220px;
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.16);

  &__title {
    margin-bottom: 12px;
    font-size: 13px;
    color: #4b5563;
  }

  &__swatches {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 10px;
  }

  &__custom {
    display: flex;
    margin-top: 12px;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    color: #4b5563;
  }
}

.theme-swatch {
  width: 28px;
  height: 28px;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 6px;

  &--active {
    border-color: #111827;
  }
}
</style>
