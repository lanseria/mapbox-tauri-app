import * as tj from '@mapbox/togeojson'
import type { FeatureCollection } from '@turf/turf'
import { nanoid } from 'nanoid'

export function kmlToGeoJson(kml: Document) {
  const geojson = tj.kml(kml) as FeatureCollection
  geojson.features.forEach((feature) => {
    const id = nanoid()
    feature.properties = {
      id: feature.properties?.id || feature.id || id,
      name: feature.properties?.name || id,
      visibility: true,
    }
  })
  return geojson
}