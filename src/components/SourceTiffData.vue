<script lang="ts" setup>
import type { LngLatBoundsLike } from 'mapbox-gl'

const base64 = ref('')
const width = ref(0)
const height = ref(0)
const bounds = ref<number[]>([])
const bbox = ref<number[][]>()
const coordinates = ref<number[][]>()
function calculateBounds(tfwParams: number[]) {
  const pixelScaleX = tfwParams[0]
  const pixelScaleY = -Math.abs(tfwParams[3])
  const originX = tfwParams[4]
  const originY = tfwParams[5]
  const bottomLeftX = originX
  const bottomLeftY = originY + pixelScaleY * height.value
  const topRightX = originX + pixelScaleX * width.value
  const topRightY = originY
  return [
    [bottomLeftX, bottomLeftY], // bottom left
    [topRightX, topRightY], // top right
  ]
}

function handleMerge() {
  bbox.value = calculateBounds(bounds.value)
  coordinates.value = [
    [bbox.value[0][0], bbox.value[1][1]], // top left
    [bbox.value[1][0], bbox.value[1][1]], // top right
    [bbox.value[1][0], bbox.value[0][1]], // bottom right
    [bbox.value[0][0], bbox.value[0][1]], // bottom left
  ]
  console.warn('bounds', bounds.value)
  console.warn('bbox', bbox.value)
  const map = window.map
  map.addSource('tiff-source', {
    type: 'image',
    url: base64.value,
    coordinates: coordinates.value,
  })
  map.fitBounds(
    [bbox.value[0], bbox.value[1]] as LngLatBoundsLike,
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
      <TifBtn @update:base64="(data) => base64 = data" />
      <TfwBtn @update:bounds="(data) => bounds = data" />
    </div>
    <div class="w-full flex gap-2 px-2 py-1" @click="handleMerge">
      <div class="flex-1 text-center btn">
        合并文件
      </div>
    </div>
  </div>
</template>
