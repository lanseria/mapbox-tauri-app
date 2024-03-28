<script lang="ts" setup>
import { Message } from '@arco-design/web-vue'
import { open } from '@tauri-apps/api/dialog'
import { readBinaryFile } from '@tauri-apps/api/fs'

async function openFile() {
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
    // 将 Uint8Array 转换为 ArrayBuffer
    const arrayBuffer = contents.buffer.slice(
      contents.byteOffset,
      contents.byteOffset + contents.byteLength,
    )
    const tiff = await fromArrayBuffer(arrayBuffer)
    const image = await tiff.getImage()
    const bbox_wgs = await getBoundingBoxFormUint8Array(arrayBuffer)
    const png = await tiff2Png(image)

    console.warn('bbox_wgs', bbox_wgs)
    const map = window.map
    map.addSource('tiff-source', {
      type: 'image',
      url: png,
      coordinates: bbox_wgs,
    })
    map.addLayer({
      id: 'tiff-layer',
      type: 'raster',
      source: 'tiff-source',
      paint: {
        'raster-opacity': 0.5,
        'raster-fade-duration': 0,
      },
    })
  }
}
</script>

<template>
  <div class="px-2 py-1">
    <button class="ms-blue-btn w-full text-center" @click="openFile()">
      导入Tiff文件
    </button>
  </div>
</template>
