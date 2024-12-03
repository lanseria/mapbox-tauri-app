<script setup lang="ts">
import { setSourceBarVisible } from '~/composables'

const AboutModalRef = shallowRef()
const HillShadingModalRef = shallowRef()
function handleAbout() {
  AboutModalRef.value.open()
}

function handleLayerSave() {
  const canvas = window.map.getCanvas()
  const imgData = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.href = imgData
  link.download = 'map.png'
  link.click()
}

function handleHillShading() {
  HillShadingModalRef.value.open()
}
</script>

<template>
  <div class="h-40px w-full flex select-none items-center justify-between border-b-1px border-gray-1 bg-white px-1">
    <div class="flex items-center gap-4">
      <IconBtn icon-name="i-carbon-menu" tooltip-name="菜单" @click="setSourceBarVisible" />
      <div class="font-bold">
        Mapbox Tauri App
      </div>
    </div>
    <div class="flex gap-1">
      <div>
        <IconBtn icon-name="i-carbon-mountain" tooltip-name="山体阴影" @click="handleHillShading" />
        <HillShadingModal ref="HillShadingModalRef" />
      </div>
      <IconBtn icon-name="i-carbon-save" tooltip-name="导出图片" @click="handleLayerSave" />
      <div>
        <IconBtn icon-name="i-carbon-help" tooltip-name="关于" @click="handleAbout" />
        <AboutModal ref="AboutModalRef" />
      </div>
    </div>
  </div>
</template>
