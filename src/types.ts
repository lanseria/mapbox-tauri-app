import type { FeatureCollection } from '@turf/turf'
import type { Marker } from 'mapbox-gl'

export type MouseState = 'default' | 'point' | 'line' | 'polygon' | 'circle'

export interface DrawPoint {
  id: string
  name: string
  coords: number[]
  color: string
  size: number
  textFillColor: string
  textStrokeColor: string
  textSize: number
  _marker?: Marker
  visibility: boolean
}

export interface DrawLine {
  id: string
  name: string
  coords: number[]
  color: string
  width: number
  opacity: number
  visibility: boolean
}

export interface DrawPolygon {
  id: string
  name: string
  coords: number[]
  fillColor: string
  fillOpacity: number
  lineColor: string
  lineWidth: number
  visibility: boolean
}

export interface TiffData {
  id: string
  name: string
  base64: string
  coordinates: number[][]
  opacity: number
  visibility: boolean
}

export interface KmlData {
  id: string
  name: string
  geojson: FeatureCollection
  visibility: boolean
}
