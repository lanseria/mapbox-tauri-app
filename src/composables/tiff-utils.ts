import type { GeoTIFFImage } from 'geotiff'
import { fromBlob } from 'geotiff'
import proj4 from 'proj4'
import geokeysToProj4 from 'geotiff-geokeys-to-proj4'

export { fromBlob, fromArrayBuffer } from 'geotiff'

export async function getBoundingBoxFormUint8Array(arrayBuffer: ArrayBuffer) {
  const tiff = await fromArrayBuffer(arrayBuffer)
  const image = await tiff.getImage(0) // Get image instance
  const geoKeys = image.getGeoKeys() // Get geokeys
  const projObj = geokeysToProj4.toProj4(geoKeys) // Convert geokeys to proj4 string
  const [x1, y1, x2, y2] = image.getBoundingBox()
  // const [xSize, ySize] = image.getResolution()

  const [lng1, lat1] = proj4(projObj.proj4, 'WGS84').forward([x1, y1]) // Project these coordinates
  const [lng2, lat2] = proj4(projObj.proj4, 'WGS84').forward([x2, y2]) // Project these coordinates
  // Work with projected coordinates...
  return [
    [lng1, lat1],
    [lng2, lat1],
    [lng2, lat2],
    [lng1, lat2],
  ]
}
// Let's wrap our example in a function
export async function workWithGeoTIFF(blob: any) {
  // Read image. See geotiff.js docs on what all of that means.
  const tiff = await fromBlob(blob) // Read blob

  const image = await tiff.getImage(0) // Get image instance
  const geoKeys = image.getGeoKeys() // Get geokeys
  const projObj = geokeysToProj4.toProj4(geoKeys) // Convert geokeys to proj4 string
  const [x1, y1, x2, y2] = image.getBoundingBox()
  // const [xSize, ySize] = image.getResolution()

  const [lng1, lat1] = proj4(projObj.proj4, 'WGS84').forward([x1, y1]) // Project these coordinates
  const [lng2, lat2] = proj4(projObj.proj4, 'WGS84').forward([x2, y2]) // Project these coordinates
  // Work with projected coordinates...
  return [
    [lng1, lat1],
    [lng2, lat1],
    [lng2, lat2],
    [lng1, lat2],
  ]
}
export async function tiff2Png(image: GeoTIFFImage) {
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

export async function tiff2Base64(image: GeoTIFFImage) {
  const data = await image.readRasters()
  const thumbnailPixelHeight = data.height
  const thumbnailPixelWidth = data.width
  const canvas = document.createElement('canvas')
  canvas.width = thumbnailPixelWidth
  canvas.height = thumbnailPixelHeight
  const ctx = canvas.getContext('2d')
  let totalPixelCount = 0
  for (let y = 0; y < thumbnailPixelHeight; y++) {
    for (let x = 0; x < thumbnailPixelWidth; x++) {
      let colour = 'rgb(0, 0, 0, 0)' // let the default be no data (transparent)
      // 根据灰度值所在范围渲染颜色
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      if (data[0][totalPixelCount] > 0) {
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-expect-error
        if (data[0][totalPixelCount] > 50 && data[0][totalPixelCount] <= 55)
          colour = `rgb(15, 255, 0, 1)`
          // eslint-disable-next-line ts/ban-ts-comment
          // @ts-expect-error
        else if (data[0][totalPixelCount] > 55 && data[0][totalPixelCount] <= 60)
          colour = `rgb(155, 255, 0, 1)`
          // eslint-disable-next-line ts/ban-ts-comment
          // @ts-expect-error
        else if (data[0][totalPixelCount] > 60 && data[0][totalPixelCount] <= 65)
          colour = `rgb(255, 255, 0, 1)`
        else
          colour = `rgb(255, 255, 0, 1)`
      }
      ctx!.fillStyle = colour
      ctx!.fillRect(x, y, 1, 1)
      totalPixelCount++
    }
  }
  const canvasImage = canvas.toDataURL('image/png')
  return canvasImage
}
