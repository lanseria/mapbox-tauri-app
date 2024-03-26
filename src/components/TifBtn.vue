<script lang="ts" setup>
const emits = defineEmits(['update:base64', 'update:width', 'update:height'])
const { open, reset, onChange } = useFileDialog({
  accept: '.tif', // Set to accept only image files
})
onChange(async (files) => {
  /** do something with files */
  if (files) {
    const file = files[0]
    const tiff = await fromBlob(file)
    const image = await tiff.getImage()
    const width = image.getWidth()
    const height = image.getHeight()
    const base64 = await tiff2Png(image)
    console.warn('base64', base64)
    emits('update:base64', base64)
    emits('update:width', width)
    emits('update:height', height)
    reset()
  }
})
</script>

<template>
  <div class="flex-1 text-center btn" @click="open()">
    导入Tif
  </div>
</template>
