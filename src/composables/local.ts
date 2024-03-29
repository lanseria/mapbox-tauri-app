import * as turf from '@turf/turf'
import type { KmlData, TiffData } from '~/types'

export const localDrawFeatureCollection = useLocalStorage('localDrawFeatureCollection', turf.featureCollection([]))

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

// kml data
export function initKmlData(): KmlData {
  return {
    id: '',
    name: '',
    geojson: turf.featureCollection([]),
    visibility: true,
  }
}

export const localKmlDataList = useLocalStorage<KmlData[]>('localKmlDataList', [])
