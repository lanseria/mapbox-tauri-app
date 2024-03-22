import type { DrawPoint } from '~/types'

export type MouseState = 'default' | 'point' | 'line' | 'polygon' | 'circle'
/**
 * MouseState
 */
export const sessionMouseState = useSessionStorage<MouseState>('sessionMouseState', 'default')

export function initDrawPoint(id: string, coords: number[]): DrawPoint {
  return {
    id,
    name: id,
    coords,
    color: INIT_POINT_COLOR,
    size: INIT_POINT_SIZE,
    textFillColor: INIT_POINT_TEXT_FILL_COLOR,
    textStrokeColor: INIT_POINT_TEXT_HALO_COLOR,
    textSize: INIT_POINT_TEXT_SIZE,
  }
}
/**
 * DrawPointList
 */
export const sessionDrawPointList = useSessionStorage<DrawPoint[]>('sessionDrawPointList', [])
