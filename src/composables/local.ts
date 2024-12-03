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

// shp data
export function initShpData(): KmlData {
  return {
    id: '',
    name: '',
    geojson: turf.featureCollection([]),
    visibility: true,
  }
}
export const localShpDataList = useLocalStorage<KmlData[]>('localShpDataList', [])

// geojson data
export function initGeoJsonData(): KmlData {
  return {
    id: '',
    name: '',
    geojson: turf.featureCollection([]),
    visibility: true,
  }
}
export const localGeoJsonDataList = useLocalStorage<KmlData[]>('localGeoJsonDataList', [])

export const localHillshadeExaggeration = useLocalStorage('localHillshadeExaggeration', 0.5)
export const localHillshadeAccentColor = useLocalStorage('localHillshadeAccentColor', '#000000')
export const localHillshadeShadowColor = useLocalStorage('localHillshadeShadowColor', '#000000')
export const localHillshadeHighlightColor = useLocalStorage('localHillshadeHighlightColor', '#FFFFFF')
export const localHillshadeIlluminationDirection = useLocalStorage('localHillshadeIlluminationDirection', 335)
