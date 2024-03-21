import * as turf from '@turf/turf'

export const localDrawFeatureCollection = useLocalStorage('localDrawFeatureCollection', turf.featureCollection([]))
