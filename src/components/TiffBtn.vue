<script lang="ts" setup>
const { open, reset, onChange } = useFileDialog({
  accept: 'image/tiff', // Set to accept only image files
})
onChange(async (files) => {
  /** do something with files */
  if (files) {
    const file = files[0]
    const tiff = await fromBlob(file)
    const bbox_wgs = await workWithGeoTIFF(file)
    const png = await tiff2Png(tiff)

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
    reset()
  }
})
</script>

<template>
  <div class="px-2 py-1">
    <div class="block text-center btn" @click="open()">
      导入Tiff文件
    </div>
  </div>
</template>
