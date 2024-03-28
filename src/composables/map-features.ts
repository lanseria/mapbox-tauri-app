import { nanoid } from 'nanoid'
import * as turf from '@turf/turf'

export function addMapFeature(e: any, type: '1' | '2') {
  const id = nanoid()
  if (type === '1') {
    console.warn('[map.click.point]', [e.lngLat.lng, e.lngLat.lat])
    const id = nanoid()
    localDrawFeatureCollection.value.features.push(
      turf.point([e.lngLat.lng, e.lngLat.lat], initDrawPoint(id, [e.lngLat.lng, e.lngLat.lat])),
    )
  }
  if (type === '2') {
    console.warn(e.features[0])
    if (e.features[0].geometry.type === 'LineString') {
      console.warn('[draw]', 'LineString')
      e.features[0].properties = initDrawLine(id, e.features[0].geometry.coordinates)
    }
    if (e.features[0].geometry.type === 'Polygon') {
      e.features[0].properties = initDrawPolygon(id, e.features[0].geometry.coordinates)
      console.warn('[draw]', 'Polygon')
    }
    localDrawFeatureCollection.value.features.push(e.features[0])
    window.draw.deleteAll()
  }
  sessionMouseState.value = 'default'
  addDrawSource()
}
