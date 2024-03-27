<script setup lang="ts">
import { setSourceBarVisible } from '~/composables'

const AboutModalRef = shallowRef()
function handleAbout() {
  AboutModalRef.value.open()
}
</script>

<template>
  <div class="h-40px w-full flex select-none items-center justify-between border-b-1px border-gray-1 bg-white px-1">
    <div class="flex items-center gap-4">
      <IconBtn icon-name="i-carbon-menu" @click="setSourceBarVisible" />
      <div class="font-bold">
        Mapbox Tauri App
      </div>
    </div>
    <div>
      <IconBtn icon-name="i-carbon-help" @click="handleAbout" />
    </div>
  </div>
  <AboutModal ref="AboutModalRef" />
</template>
