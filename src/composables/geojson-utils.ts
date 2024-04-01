import type { FeatureCollection } from '@turf/turf'
import { nanoid } from 'nanoid'

export function toGeoJson(geojson: FeatureCollection) {
  geojson.features.forEach((feature) => {
    const id = nanoid()
    feature.properties = {
      ...feature.properties,
      id: feature.properties?.id || feature.id || id,
      name: feature.properties?.name || id,
      visibility: true,
    }
  })
  return geojson
}
