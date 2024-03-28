import { featureCollection } from '@turf/turf'
import type { TiffData } from '~/types'

// for draw
export function addDrawSource() {
  refreshPointColor()
  const map = window.map
  const data: any = localDrawFeatureCollection.value
  const source: any = map.getSource(MAP_DRAW_SOURCE_NAME)
  // 判断 source
  if (source) {
    source.setData(data)
  }
  else {
    map.addSource(MAP_DRAW_SOURCE_NAME, {
      type: 'geojson',
      data,
    })
  }
}

export function clearDrawSource() {
  const map = window.map
  const source: any = map.getSource(MAP_DRAW_SOURCE_NAME)
  // 判断 source
  if (source)
    source.setData(featureCollection([]))
}

// for tif
export function addTiffSource(item: TiffData) {
  const map = window.map
  const sourceName = `tiff-source-${item.id}`
  const source: any = map.getSource(sourceName)
  if (!source) {
    map.addSource(sourceName, {
      type: 'image',
      url: item.base64,
      coordinates: item.coordinates,
    })
  }
}
export function clearTiffSource() {
  const map = window.map
  localTiffDataList.value.forEach((item) => {
    const sourceName = `tiff-source-${item.id}`
    if (map.getSource(sourceName))
      map.removeSource(sourceName)
  })
}
