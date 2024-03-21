import { featureCollection } from '@turf/turf'

// for draw
export function addDrawSource() {
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
