<script lang="ts" setup>
const emits = defineEmits(['update:bounds'])
const { open, reset, onChange } = useFileDialog({
  accept: '.tfw', // Set to accept only image files
})

onChange(async (files) => {
  /** do something with files */
  if (files) {
    const file = files[0]
    const reader = new FileReader()
    reader.onload = function (e) {
      console.warn(e!.target!.result!)
      const result = e!.target!.result as string
      const lines = result.split('\n').map(line => Number.parseFloat(line))
      emits('update:bounds', lines)
    }
    reader.readAsText(file)
    reset()
  }
})
</script>

<template>
  <div class="flex-1 text-center btn" @click="open()">
    导入Tfw
  </div>
</template>
