<script lang="ts" setup>
import type GeoTIFF from 'geotiff'
import { fromBlob } from 'geotiff'
import gcoord from 'gcoord'

async function tiff2Png(tiff: GeoTIFF) {
  const image = await tiff.getImage()
  const width = image.getWidth()
  const height = image.getHeight()

  const rgb = await image.readRGB()

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')

  const data = context!.getImageData(0, 0, width, height)
  const rgba = data.data
  let j = 0
  for (let i = 0; i < rgb.length; i += 3) {
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    rgba[j] = rgb[i]

    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    rgba[j + 1] = rgb[i + 1]

    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    rgba[j + 2] = rgb[i + 2]
    rgba[j + 3] = 255
    j += 4
  }
  context!.putImageData(data, 0, 0)
  return canvas.toDataURL()
}
const { open, reset, onChange } = useFileDialog({
  accept: 'image/tiff', // Set to accept only image files
})
onChange(async (files) => {
  /** do something with files */
  if (files) {
    const file = files[0]
    const tiff = await fromBlob(file)
    const png = await tiff2Png(tiff)
    const image = await tiff.getImage() // by default, the first image is read.
    const bbox = image.getBoundingBox()

    const origin = image.getOrigin()
    const resolution = image.getResolution()
    console.warn(
      `Tiff data: bbox=${bbox}`,
      `origin=${origin}`,
      `resolution=${resolution}`,
    )
    const data_tl = gcoord.transform([bbox[0], bbox[1]], gcoord.WebMercator, gcoord.WGS84)
    const data_br = gcoord.transform([bbox[2], bbox[3]], gcoord.WebMercator, gcoord.WGS84)
    console.warn('data_tl', data_tl, 'data_br', data_br)
    console.warn('image base64', png)
    const bbox_wgs1 = [
      [data_tl[0], data_tl[1]],
      [data_br[0], data_br[1]],
      [data_br[0], data_tl[1]],
      [data_tl[0], data_br[1]],
    ]
    const bbox_wgs = [
      // [-115.76, 0],
      [-80.425, 46.437],
      [-71.516, 46.437],
      [-71.516, 37.936],
      [-80.425, 37.936],
    ]

    console.warn('bbox_wgs', bbox_wgs1)
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
        'raster-fade-duration': 0,
      },
    })
    reset()
  }
})
</script>

<template>
  <div>
    <div class="p-2">
      <div class="block text-center btn" @click="open()">
        导入Tiff文件
      </div>
    </div>
  </div>
</template>
