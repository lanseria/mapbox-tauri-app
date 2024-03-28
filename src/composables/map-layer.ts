import type { TiffData } from '~/types'

export function addDrawPointLayer() {
  const map = window.map
  if (map.getLayer(MAP_DRAW_POINT_LAYER_NAME))
    map.removeLayer(MAP_DRAW_POINT_LAYER_NAME)
  map.addLayer({
    id: MAP_DRAW_POINT_LAYER_NAME,
    type: 'symbol',
    source: MAP_DRAW_SOURCE_NAME,
    layout: {
      'icon-image': ['get', 'color'],
      'icon-size': ['get', 'size'],
      'text-field': ['get', 'name'],
      'text-size': ['get', 'textSize'],
      'text-offset': [0, 0.5],
      'text-anchor': 'top',
      'icon-allow-overlap': true,
    },
    paint: {
      'text-color': ['get', 'textFillColor'],
      'text-halo-color': ['get', 'textStrokeColor'],
      'text-halo-width': 1,
      'text-halo-blur': 0,
    },
    filter: [
      'all',
      ['==', ['geometry-type'], 'Point'],
      ['==', ['get', 'visibility'], true],
    ],
  })
  map.on('click', MAP_DRAW_POINT_LAYER_NAME, (e) => {
    if (e.features) {
      console.warn(e.features[0].properties!.id)
      sessionDrawActiveId.value = e.features[0].properties!.id
    }
  })
  map.on('mouseenter', MAP_DRAW_POINT_LAYER_NAME, (_e) => {
    map.getCanvas().style.cursor = 'pointer'
  })
  map.on('mouseleave', MAP_DRAW_POINT_LAYER_NAME, (_e) => {
    map.getCanvas().style.cursor = ''
  })
}

export function addDrawLineLayer() {
  const map = window.map
  if (map.getLayer(MAP_DRAW_LINE_LAYER_NAME))
    map.removeLayer(MAP_DRAW_LINE_LAYER_NAME)
  map.addLayer({
    id: MAP_DRAW_LINE_LAYER_NAME,
    type: 'line',
    source: MAP_DRAW_SOURCE_NAME,
    layout: {
      'line-cap': ['coalesce', ['get', 'line-cap'], 'round'],
      'line-join': ['coalesce', ['get', 'line-cap'], 'round'],
    },
    paint: {
      'line-color': ['coalesce', ['get', 'color'], '#000'],
      'line-width': ['coalesce', ['get', 'width'], 2],
      'line-opacity': ['coalesce', ['get', 'opacity'], 1],
    },
    filter: [
      'all',
      ['==', ['geometry-type'], 'LineString'],
      ['==', ['get', 'visibility'], true],
    ],
  })
  map.on('click', MAP_DRAW_LINE_LAYER_NAME, (e) => {
    if (e.features) {
      console.warn(e.features[0].properties!.id)
      sessionDrawActiveId.value = e.features[0].properties!.id
    }
  })
  map.on('mouseenter', MAP_DRAW_LINE_LAYER_NAME, (_e) => {
    map.getCanvas().style.cursor = 'pointer'
  })
  map.on('mouseleave', MAP_DRAW_LINE_LAYER_NAME, (_e) => {
    map.getCanvas().style.cursor = ''
  })
}

export function addDrawPolygonLayer() {
  console.warn('[addDrawPolygonLayer]')
  const map = window.map
  if (map.getLayer(MAP_DRAW_POLYGON_LAYER_NAME))
    map.removeLayer(MAP_DRAW_POLYGON_LAYER_NAME)
  map.addLayer({
    id: MAP_DRAW_POLYGON_LAYER_NAME,
    type: 'fill',
    source: MAP_DRAW_SOURCE_NAME,
    paint: {
      'fill-color': ['coalesce', ['get', 'fillColor'], '#000'],
      'fill-opacity': ['coalesce', ['get', 'fillOpacity'], 1],
    },
    filter: [
      'all',
      ['match', ['geometry-type'], ['Polygon'], !0, !1],
      ['==', ['get', 'visibility'], true],
    ],
  })
  if (map.getLayer(MAP_DRAW_POLYGON_LINE_LAYER_NAME))
    map.removeLayer(MAP_DRAW_POLYGON_LINE_LAYER_NAME)
  map.addLayer({
    id: MAP_DRAW_POLYGON_LINE_LAYER_NAME,
    type: 'line',
    source: MAP_DRAW_SOURCE_NAME,
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': ['coalesce', ['get', 'lineColor'], '#000'],
      'line-width': ['coalesce', ['get', 'lineWidth'], 1],
    },
    filter: [
      'all',
      ['match', ['geometry-type'], ['Polygon'], !0, !1],
      ['==', ['get', 'visibility'], true],
    ],
  })
  const layerNameArr = [MAP_DRAW_POLYGON_LAYER_NAME, MAP_DRAW_POLYGON_LINE_LAYER_NAME]
  map.on('click', layerNameArr, (e) => {
    if (e.features) {
      console.warn(e.features[0].properties!.id)
      sessionDrawActiveId.value = e.features[0].properties!.id
    }
  })
  map.on('mouseenter', layerNameArr, (_e) => {
    map.getCanvas().style.cursor = 'pointer'
  })
  map.on('mouseleave', layerNameArr, (_e) => {
    map.getCanvas().style.cursor = ''
  })
}

export function addDrawLayer() {
  addDrawPointLayer()
  addDrawLineLayer()
  addDrawPolygonLayer()
}

// for tiff
export function addTiffLayer(item: TiffData) {
  const map = window.map
  const sourceName = `tiff-source-${item.id}`
  const layerName = `tif-layer-${item.id}`
  if (map.getLayer(layerName))
    map.removeLayer(layerName)
  map.addLayer({
    id: layerName,
    type: 'raster',
    source: sourceName,
    layout: {
      visibility: item.visibility ? 'visible' : 'none',
    },
    paint: {
      'raster-opacity': item.opacity,
    },
  }, 'map-draw-point-layer')
}
export function clearTiffLayer() {
  localTiffDataList.value.forEach((item) => {
    const layerName = `tif-layer-${item.id}`
    if (window.map.getLayer(layerName))
      window.map.removeLayer(layerName)
  })
}
