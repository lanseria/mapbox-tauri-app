import type { DrawLine, DrawPoint } from '~/types'

export type MouseState = 'default' | 'point' | 'line' | 'polygon' | 'circle'
/**
 * MouseState
 */
export const sessionMouseState = useSessionStorage<MouseState>('sessionMouseState', 'default')
watchEffect(() => {
  console.warn('[watchEffect]', '[sessionMouseState]')
  if (sessionMouseState.value === 'default')
    window.draw && window.draw.changeMode('simple_select')

  if (sessionMouseState.value === 'line')
    window.draw && window.draw.changeMode('draw_line_string')
})

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

export function initDrawLine(id: string, coords: number[]): DrawLine {
  return {
    id,
    name: id,
    coords,
    color: INIT_LINE_COLOR,
    width: INIT_LINE_WIDTH,
    opacity: INIT_LINE_OPACITY,
  }
}
