import type { DrawLine, DrawPoint, DrawPolygon, MouseState } from '~/types'

export const sessionSourceBarVisible = useSessionStorage('sessionSourceBarVisible', true)
export function setSourceBarVisible() {
  sessionSourceBarVisible.value = !sessionSourceBarVisible.value
  nextTick(() => {
    window.map.resize()
  })
}
/**
 * MouseState
 */
export const sessionMouseState = useSessionStorage<MouseState>('sessionMouseState', 'default')
watch(sessionMouseState, () => {
  console.warn('[watchEffect]', '[sessionMouseState]', sessionMouseState.value)
  if (sessionMouseState.value === 'default')
    window.draw && window.draw.changeMode('simple_select')
  if (sessionMouseState.value === 'line')
    window.draw && window.draw.changeMode('draw_line_string')
  if (sessionMouseState.value === 'polygon')
    window.draw && window.draw.changeMode('draw_polygon')
  if (sessionMouseState.value === 'circle')
    window.draw && window.draw.changeMode('draw_radius')
})

export const sessionDrawActiveId = useSessionStorage('sessionDrawActiveId', '')

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
    visibility: true,
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
    visibility: true,
  }
}

export function initDrawPolygon(id: string, coords: number[]): DrawPolygon {
  return {
    id,
    name: id,
    coords,
    fillColor: INIT_POLYGON_FILL_COLOR,
    fillOpacity: INIT_POLYGON_FILL_OPACITY,
    lineColor: INIT_POLYGON_LINE_COLOR,
    lineWidth: INIT_POLYGON_LINE_WIDTH,
    visibility: true,
  }
}
