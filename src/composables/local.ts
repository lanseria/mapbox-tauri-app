import * as turf from '@turf/turf'
import type { TiffData } from '~/types'

export const localDrawFeatureCollection = useLocalStorage('localDrawFeatureCollection', turf.featureCollection([]))

export const localVisibilityLayerIds = useLocalStorage<string[]>('localVisibilityLayerIds', [])
// tiff data
export function initTiffData(): TiffData {
  return {
    id: '',
    name: '',
    base64: '',
    coordinates: [],
    opacity: 0.5,
    visibility: true,
  }
}

export const localTiffDataList = useLocalStorage<TiffData[]>('localTiffDataList', [])
