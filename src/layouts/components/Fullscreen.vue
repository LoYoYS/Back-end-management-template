<template>
  <i
    id="fullscreen"
    class="mr-16 cursor-pointer"
    :class="isFullscreen ? 'i-fe:minimize' : 'i-fe:maximize'"
    @click="toggleFullscreen"
  />
</template>

<script setup>
const isFullscreen = ref(!!document.fullscreenElement)

function syncFullscreenState() {
  isFullscreen.value = !!document.fullscreenElement
}

async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
    } else {
      await document.documentElement.requestFullscreen()
    }
    syncFullscreenState()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', syncFullscreenState)
})

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', syncFullscreenState)
})
</script>
