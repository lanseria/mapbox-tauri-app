import type { Marker } from 'mapbox-gl'

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
}
export interface DrawLine {
  id: string
  name: string
  coords: number[]
  color: string
  width: number
  opacity: number
}
