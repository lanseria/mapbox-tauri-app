<script lang="ts" setup>
import type { FeatureCollection } from '@turf/turf'
import { merge } from 'lodash-es'
import { nanoid } from 'nanoid'
import { localShpDataList } from '~/composables'

let fileName = ''
let shpBuffer = new Uint8Array(0)
let dbfBuffer = new Uint8Array(0)
// ref
const isLoadShp = ref(false)
const isLoadDbf = ref(false)
function initLoad() {
  isLoadShp.value = false
  isLoadDbf.value = false
}
function updateFilename(data: string) {
  fileName = data
}
function updateShpBuffer(data: Uint8Array) {
  shpBuffer = data
  isLoadShp.value = true
}
function updateDbfBuffer(data: Uint8Array) {
  dbfBuffer = data
  isLoadDbf.value = true
}
function handleMerge() {
  const shpGeojson: FeatureCollection = new ShpParser(shpBuffer, dbfBuffer).parse()
  const geojson = shp2geojson(shpGeojson)
  const shpData = merge(initShpData(), {
    id: nanoid(),
    name: fileName,
    geojson,
  })
  localShpDataList.value.push(shpData)
  addShpSource()
  initLoad()
}
</script>

<template>
  <div class="w-full flex shrink grow basis-0 flex-col overflow-y-hidden">
    <div class="w-full flex flex-none gap-2 px-2 py-1">
      <ShpBtn
        class="flex-1"
        @update:buffer="updateShpBuffer"
        @update:file-name="updateFilename"
      >
        导入Shp<IconCheck v-if="isLoadShp" />
      </ShpBtn>
      <DbfBtn
        class="flex-1"
        @update:buffer="updateDbfBuffer"
      >
        导入Dbf<IconCheck v-if="isLoadDbf" />
      </DbfBtn>
    </div>
    <div class="w-full flex gap-2 px-2 py-1">
      <AButton
        type="primary"
        long
        :disabled="!isLoadShp || !isLoadDbf"
        @click="handleMerge"
      >
        合并 Dbf/Shp 文件
      </AButton>
    </div>
    <div class="h-1px flex-none bg-slate-2" />
    <div class="w-full overflow-y-auto">
      <MapLayerItem
        v-for="item in localShpDataList"
        :key="item.id"
        :item="item"
        layer-type="shp"
      />
    </div>
  </div>
</template>
