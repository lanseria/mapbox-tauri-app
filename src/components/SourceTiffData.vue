<script lang="ts" setup>
const { open, reset, onChange } = useFileDialog({
  accept: '.zip',
})
onChange(async (files) => {
  /** do something with files */
  if (files) {
    const file = files[0]
    //
    reset()
  }
})
</script>

<template>
  <div>
    <TiffBtn />
    <div class="p-2">
      <div class="block text-center btn" @click="open()">
        导入tif/tfw.zip文件
      </div>
    </div>
  </div>
</template>
