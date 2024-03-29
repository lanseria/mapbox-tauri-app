<script lang="ts" setup>
import { merge } from 'lodash-es'
import type { LngLatBoundsLike } from 'mapbox-gl'
import { nanoid } from 'nanoid'
import { localTiffDataList } from '~/composables'

let base64 = ''
let fileName = ''
let bounds: number[] = []
let bbox: number[][] = []
let width = 0
let height = 0
let coordinates: number[][] = []
// ref
const isLoadTif = ref(false)
const isLoadTfw = ref(false)
function initLoad() {
  isLoadTif.value = false
  isLoadTfw.value = false
}
function updateFilename(data: string) {
  fileName = data
}
function updateWidth(data: number) {
  width = data
}
function updateHeight(data: number) {
  height = data
}
function updateBase64(data: string) {
  isLoadTif.value = true
  base64 = data
}
function updateBound(data: number[]) {
  isLoadTfw.value = true
  bounds = data
}
function calculateBounds() {
  const pixelScaleX = bounds[0]
  const pixelScaleY = -Math.abs(bounds[3])
  const originX = bounds[4]
  const originY = bounds[5]
  const bottomLeftX = originX
  const bottomLeftY = originY + pixelScaleY * height
  const topRightX = originX + pixelScaleX * width
  const topRightY = originY
  return [
    [bottomLeftX, bottomLeftY], // bottom left
    [topRightX, topRightY], // top right
  ]
}

function handleMerge() {
  bbox = calculateBounds()
  coordinates = [
    [bbox[0][0], bbox[1][1]], // top left
    [bbox[1][0], bbox[1][1]], // top right
    [bbox[1][0], bbox[0][1]], // bottom right
    [bbox[0][0], bbox[0][1]], // bottom left
  ]
  console.warn('bounds', bounds)
  console.warn('bbox', bbox)
  const tiffData = merge(initTiffData(), {
    id: nanoid(),
    name: fileName,
    base64,
    coordinates,
  })
  localTiffDataList.value.push(tiffData)
  const map = window.map
  loadTiff()
  map.fitBounds(
    [bbox[0], bbox[1]] as LngLatBoundsLike,
    { padding: 20 },
  )
  initLoad()
}
</script>

<template>
  <div class="w-full flex shrink grow basis-0 flex-col overflow-y-hidden">
    <TiffBtn class="flex-none" />
    <div class="w-full flex flex-none gap-2 px-2 py-1">
      <TifBtn
        class="flex-1"
        @update:base64="updateBase64"
        @update:width="updateWidth"
        @update:height="updateHeight"
        @update:file-name="updateFilename"
      >
        导入Tif<IconCheck v-if="isLoadTif" />
      </TifBtn>
      <TfwBtn
        class="flex-1"
        @update:bounds="updateBound"
      >
        导入Tfw<IconCheck v-if="isLoadTfw" />
      </TfwBtn>
    </div>
    <div class="w-full flex flex-none gap-2 px-2 py-1">
      <AButton
        type="primary"
        long
        :disabled="!isLoadTif || !isLoadTfw"
        @click="handleMerge"
      >
        合并 Tfw/Tif 文件
      </AButton>
    </div>
    <div class="h-1px flex-none bg-slate-2" />
    <div class="w-full overflow-y-auto">
      <MapLayerItem
        v-for="item in localTiffDataList"
        :key="item.id"
        :item="item"
        layer-type="tiff"
      />
    </div>
  </div>
</template>
