<script lang="ts" setup>
import type { LngLatBoundsLike } from 'mapbox-gl'

let base64 = ''
let bounds: number[] = []
let bbox: number[][] = []
let width = 0
let height = 0
let coordinates: number[][] = []
function updateWidth(data: number) {
  width = data
}
function updateHeight(data: number) {
  height = data
}
function updateBase64(data: string) {
  base64 = data
}
function updateBound(data: number[]) {
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
  const map = window.map
  map.addSource('tiff-source', {
    type: 'image',
    url: base64,
    coordinates,
  })
  map.fitBounds(
    [bbox[0], bbox[1]] as LngLatBoundsLike,
    { padding: 20 },
  )
  map.addLayer({
    id: 'tif-layer',
    type: 'raster',
    source: 'tiff-source',
    paint: {
      'raster-opacity': 0.5,
    },
  })
}
</script>

<template>
  <div>
    <TiffBtn />
    <div class="w-full flex gap-2 px-2 py-1">
      <TifBtn
        @update:base64="updateBase64"
        @update:width="updateWidth"
        @update:height="updateHeight"
      />
      <TfwBtn @update:bounds="updateBound" />
    </div>
    <div class="w-full flex gap-2 px-2 py-1" @click="handleMerge">
      <div class="flex-1 text-center btn">
        合并文件
      </div>
    </div>
  </div>
</template>
