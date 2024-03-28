import * as turf from '@turf/turf'

export const localDrawFeatureCollection = useLocalStorage('localDrawFeatureCollection', turf.featureCollection([]))

export const localVisibilityLayerIds = useLocalStorage<string[]>('localVisibilityLayerIds', [])
