<script lang="ts" setup>
import { Message } from '@arco-design/web-vue'
import { open } from '@tauri-apps/api/dialog'
import { readBinaryFile } from '@tauri-apps/api/fs'

const emits = defineEmits(['update:base64', 'update:width', 'update:height', 'update:fileName'])

const { loading, setLoading } = useLoading(false)

async function openFile() {
  try {
    setLoading(true)
    const selected = await open({
      multiple: false,
      filters: [{
        name: 'Tagged Image Format',
        extensions: ['tif'],
      }],
    })
    if (selected === null) {
      Message.warning('未选择文件')
    }
    else {
      const contents = await readBinaryFile(selected as string)
      const fileName = getFileNameFromPath(selected as string)
      // 将 Uint8Array 转换为 ArrayBuffer
      const arrayBuffer = contents.buffer.slice(
        contents.byteOffset,
        contents.byteOffset + contents.byteLength,
      )
      const tiff = await fromArrayBuffer(arrayBuffer)
      const image = await tiff.getImage()
      const width = image.getWidth()
      const height = image.getHeight()
      const base64 = await tiff2Png(image)
      // console.warn('base64', base64)
      emits('update:base64', base64)
      emits('update:width', width)
      emits('update:height', height)
      emits('update:fileName', fileName)
    }
  }
  catch (error: any) {
    console.error(error)
  }
  finally {
    setLoading(false)
  }
}
</script>

<template>
  <AButton
    :loading="loading"
    type="primary"
    @click="openFile()"
  >
    <slot />
  </AButton>
</template>
