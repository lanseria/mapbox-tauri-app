<script lang="ts" setup>
import { Message } from '@arco-design/web-vue'
import { open } from '@tauri-apps/api/dialog'
import { readTextFile } from '@tauri-apps/api/fs'
import { merge } from 'lodash-es'
import { nanoid } from 'nanoid'

async function openFile() {
  const selected = await open({
    multiple: false,
    filters: [{
      name: 'GIS file format',
      extensions: ['geojson'],
    }],
  })
  if (selected === null) {
    Message.warning('未选择文件')
  }
  else {
    const contents = await readTextFile(selected as string)
    const fileName = getFileNameFromPath(selected as string)
    // 读取KML文件
    const geojsonObj = JSON.parse(contents)
    // 转换为GeoJSON
    const kmlData = merge(initKmlData(), {
      id: nanoid(),
      name: fileName,
      geojson: toGeoJson(geojsonObj),
    })
    localGeoJsonDataList.value.push(kmlData)
    addGeoJsonSource()
  }
}
</script>

<template>
  <div class="px-2 py-1">
    <AButton
      type="primary"
      long
      @click="openFile()"
    >
      导入GeoJson文件
    </AButton>
  </div>
</template>
