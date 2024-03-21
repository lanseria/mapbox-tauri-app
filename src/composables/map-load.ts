import type mapboxgl from 'mapbox-gl'

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null
}

function createColorPoint(...color: number[]) {
  const d = 48
  const r = d / 2
  const r2 = r ** 2
  const bytesPerPixel = 4

  const data = new Uint8Array(d * d * bytesPerPixel)

  for (let x = 0; x < d; x++) {
    for (let y = 0; y < d; y++) {
      if ((x - r) ** 2 + (y - r) ** 2 >= r2)
        continue

      const offset = (y * d + x) * bytesPerPixel
      for (let b = 0; b < bytesPerPixel; b++)
        data[offset + b] = color[b]
    }
  }
  return { width: d, height: d, data }
}

function addColorSymbol(color: string) {
  const map = window.map
  const rgb = hexToRgb(color)
  if (rgb) {
    const r = rgb?.r
    const g = rgb?.g
    const b = rgb?.b
    map.addImage(color, createColorPoint(r, g, b, 255))
  }
  else {
    throw new Error(`${color} is not a valid hex color`)
  }
}

export function loadDraw() {
  addDrawSource()
  addDrawLayer()
}

export function handleMapLoad(map: mapboxgl.Map) {
  console.warn('[handleMapLoad]', map)
  addColorSymbol(INIT_POINT_COLOR)
  loadDraw()
}
