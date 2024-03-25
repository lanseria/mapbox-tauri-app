import { fromBlob } from 'geotiff'
import type GeoTIFF from 'geotiff'
import proj4 from 'proj4'
import geokeysToProj4 from 'geotiff-geokeys-to-proj4'

export { fromBlob } from 'geotiff'
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
export async function tiff2Png(tiff: GeoTIFF) {
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
