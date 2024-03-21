<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'

const OS = getSystem()
</script>

<template>
  <div data-tauri-drag-region class="h-30px w-full select-none border-b-1px border-gray-1 bg-white">
    <template v-if="OS !== 'macos'">
      <div class="absolute left-1/2 font-bold leading-30px -translate-x-1/2">
        Mapbox Tauri App
      </div>
      <div class="flex justify-end">
        <div id="titlebar-minimize" class="titlebar-button" @click="appWindow.minimize()">
          <img
            src="https://api.iconify.design/mdi:window-minimize.svg"
            alt="minimize"
          >
        </div>
        <div id="titlebar-maximize" class="titlebar-button" @click="appWindow.maximize()">
          <img
            src="https://api.iconify.design/mdi:window-maximize.svg"
            alt="maximize"
          >
        </div>
        <div id="titlebar-close" class="titlebar-button" @click="appWindow.close()">
          <img src="https://api.iconify.design/mdi:close.svg" alt="close">
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="css" scoped>
.titlebar-button {
  @apply inline-flex justify-center items-center w-30px h-30px;
}
.titlebar-button:hover {
  @apply bg-blue-5;
}
</style>
