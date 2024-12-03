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
    if (map.hasImage(color)) {
      console.warn('[addColorSymbol]', '[hasImage]', color)
      return
    }
    const r = rgb?.r
    const g = rgb?.g
    const b = rgb?.b
    map.addImage(color, createColorPoint(r, g, b, 255))
  }
  else {
    throw new Error(`${color} is not a valid hex color`)
  }
}
// for draw
export function loadDraw() {
  addDrawSource()
  addDrawLayer()
}

export function refreshPointColor() {
  // 获取所有的点的颜色
  const localColors = localDrawFeatureCollection.value.features
    .filter((f: any) => f.geometry.type === 'Point').map((f: any) => f.properties.color)
  const allColors = new Set([INIT_POINT_COLOR, ...localColors])
  // 重新添加颜色点
  for (const color of allColors)
    addColorSymbol(color)
}

// for tiff
export function loadTiff() {
  localTiffDataList.value.forEach((item) => {
    addTiffSource(item)
    addTiffLayer(item)
  })
}

// for kml
export function loadKml() {
  addKmlSource()
  addKmlLayer()
}

// for shp
export function loadShp() {
  addShpSource()
  addShpLayer()
}
// for geojson
export function loadGeoJson() {
  addGeoJsonSource()
  addGeoJsonLayer()
}
export function handleMapLoad(map: mapboxgl.Map) {
  console.warn('[handleMapLoad]', map)
  //
  loadTiff()
  loadDraw()
  loadKml()
  loadShp()
  loadGeoJson()
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  console.warn('_layers', Object.keys(map.style._layers))

  map.addSource('dem', {
    type: 'raster-dem',
    url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
  })
  map.addLayer(
    {
      id: 'hillshading',
      source: 'dem',
      type: 'hillshade',
    },
    // Insert below land-structure-polygon layer,
    // where hillshading sits in the Mapbox Streets style.
    // 'land-structure-polygon',
  )
}
