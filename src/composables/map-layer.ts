import type { TiffData } from '~/types'
/**
 * 公共添加点
 * @param layerName
 * @param sourceName
 */
function addPointLayer(layerName: string, sourceName: string) {
  const map = window.map
  if (map.getLayer(layerName))
    map.removeLayer(layerName)
  map.addLayer({
    id: layerName,
    type: 'symbol',
    source: sourceName,
    layout: {
      'icon-image': ['coalesce', ['get', 'color'], INIT_POINT_COLOR],
      'icon-size': ['coalesce', ['get', 'size'], INIT_POINT_SIZE],
      'text-field': ['get', 'name'],
      'text-size': ['coalesce', ['get', 'textSize'], INIT_POINT_TEXT_SIZE],
      'text-offset': [0, 0.5],
      'text-anchor': 'top',
      'icon-allow-overlap': true,
    },
    paint: {
      'text-color': ['coalesce', ['get', 'textFillColor'], INIT_POINT_TEXT_FILL_COLOR],
      'text-halo-color': ['coalesce', ['get', 'textStrokeColor'], INIT_POINT_TEXT_HALO_COLOR],
      'text-halo-width': 1,
      'text-halo-blur': 0,
    },
    filter: [
      'all',
      ['==', ['geometry-type'], 'Point'],
      ['==', ['get', 'visibility'], true],
    ],
  })
  map.on('click', layerName, (e) => {
    if (e.features) {
      console.warn(e.features[0].properties!.id)
      sessionDrawActiveId.value = e.features[0].properties!.id
    }
  })
  map.on('mouseenter', layerName, (_e) => {
    map.getCanvas().style.cursor = 'pointer'
  })
  map.on('mouseleave', layerName, (_e) => {
    map.getCanvas().style.cursor = ''
  })
}
/**
 * 公共添加线
 * @param layerName
 * @param sourceName
 */
function addLineLayer(layerName: string, sourceName: string) {
  const map = window.map
  if (map.getLayer(layerName))
    map.removeLayer(layerName)
  map.addLayer({
    id: layerName,
    type: 'line',
    source: sourceName,
    layout: {
      'line-cap': ['coalesce', ['get', 'line-cap'], 'round'],
      'line-join': ['coalesce', ['get', 'line-cap'], 'round'],
    },
    paint: {
      'line-color': ['coalesce', ['get', 'color'], INIT_LINE_COLOR],
      'line-width': ['coalesce', ['get', 'width'], INIT_LINE_WIDTH],
      'line-opacity': ['coalesce', ['get', 'opacity'], INIT_LINE_OPACITY],
    },
    filter: [
      'all',
      ['==', ['geometry-type'], 'LineString'],
      ['==', ['get', 'visibility'], true],
    ],
  })
  map.on('click', layerName, (e) => {
    if (e.features) {
      console.warn(e.features[0].properties!.id)
      sessionDrawActiveId.value = e.features[0].properties!.id
    }
  })
  map.on('mouseenter', layerName, (_e) => {
    map.getCanvas().style.cursor = 'pointer'
  })
  map.on('mouseleave', layerName, (_e) => {
    map.getCanvas().style.cursor = ''
  })
}
/**
 * 公共添加多边形
 * @param layerName
 * @param sourceName
 */
function addPolygonLayer(layerName: string, sourceName: string) {
  const map = window.map
  const layerName_line = `${layerName}-line`
  const layerName_fill = `${layerName}-fill`
  if (map.getLayer(layerName_line))
    map.removeLayer(layerName_line)
  map.addLayer({
    id: layerName_line,
    type: 'fill',
    source: sourceName,
    paint: {
      'fill-color': ['coalesce', ['get', 'fillColor'], INIT_POLYGON_FILL_COLOR],
      'fill-opacity': ['coalesce', ['get', 'fillOpacity'], INIT_POLYGON_FILL_OPACITY],
    },
    filter: [
      'all',
      ['match', ['geometry-type'], ['Polygon'], !0, !1],
      ['==', ['get', 'visibility'], true],
    ],
  })
  if (map.getLayer(layerName_fill))
    map.removeLayer(layerName_fill)
  map.addLayer({
    id: layerName_fill,
    type: 'line',
    source: sourceName,
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': ['coalesce', ['get', 'lineColor'], INIT_POLYGON_LINE_COLOR],
      'line-width': ['coalesce', ['get', 'lineWidth'], INIT_POLYGON_LINE_WIDTH],
    },
    filter: [
      'all',
      ['match', ['geometry-type'], ['Polygon'], !0, !1],
      ['==', ['get', 'visibility'], true],
    ],
  })
  const layerNameArr = [layerName_line, layerName_fill]
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

export function addDrawPointLayer() {
  addPointLayer(MAP_DRAW_POINT_LAYER_NAME, MAP_DRAW_SOURCE_NAME)
}

export function addDrawLineLayer() {
  addLineLayer(MAP_DRAW_LINE_LAYER_NAME, MAP_DRAW_SOURCE_NAME)
}

export function addDrawPolygonLayer() {
  addPolygonLayer(MAP_DRAW_POLYGON_LAYER_NAME, MAP_DRAW_SOURCE_NAME)
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

// for kml
function addKmlPointLayer(layerName: string, sourceName: string) {
  layerName = `${layerName}-point`
  addPointLayer(layerName, sourceName)
}
function addKmlLineLayer(layerName: string, sourceName: string) {
  layerName = `${layerName}-line`
  addLineLayer(layerName, sourceName)
}
function addKmlPolygonLayer(layerName: string, sourceName: string) {
  layerName = `${layerName}-polygon`
  addPolygonLayer(layerName, sourceName)
}
export function addKmlLayer() {
  localKmlDataList.value.forEach((item) => {
    const sourceName = `kml-source-${item.id}`
    const layerName = `kml-layer-${item.id}`
    addKmlPointLayer(layerName, sourceName)
    addKmlLineLayer(layerName, sourceName)
    addKmlPolygonLayer(layerName, sourceName)
  })
}
export function clearKmlLayer() {
  localKmlDataList.value.forEach((item) => {
    const layerName = `kml-layer-${item.id}`
    const layerName_point = `${layerName}-point`
    const layerName_line = `${layerName}-line`
    const layerName_polygon = `${layerName}-polygon`
    const layerName_polygon_line = `${layerName}-polygon-line`
    if (window.map.getLayer(layerName_point))
      window.map.removeLayer(layerName_point)
    if (window.map.getLayer(layerName_line))
      window.map.removeLayer(layerName_line)
    if (window.map.getLayer(layerName_polygon))
      window.map.removeLayer(layerName_polygon)
    if (window.map.getLayer(layerName_polygon_line))
      window.map.removeLayer(layerName_polygon_line)
  })
}

// for shp
function addShpPointLayer(layerName: string, sourceName: string) {
  layerName = `${layerName}-point`
  addPointLayer(layerName, sourceName)
}
function addShpLineLayer(layerName: string, sourceName: string) {
  layerName = `${layerName}-line`
  addLineLayer(layerName, sourceName)
}
function addShpPolygonLayer(layerName: string, sourceName: string) {
  layerName = `${layerName}-polygon`
  addPolygonLayer(layerName, sourceName)
}
export function addShpLayer() {
  localShpDataList.value.forEach((item) => {
    const sourceName = `shp-source-${item.id}`
    const layerName = `shp-layer-${item.id}`
    addShpPointLayer(layerName, sourceName)
    addShpLineLayer(layerName, sourceName)
    addShpPolygonLayer(layerName, sourceName)
  })
}
export function clearShpLayer() {
  localShpDataList.value.forEach((item) => {
    const layerName = `shp-layer-${item.id}`
    const layerName_point = `${layerName}-point`
    const layerName_line = `${layerName}-line`
    const layerName_polygon = `${layerName}-polygon`
    const layerName_polygon_line = `${layerName}-polygon-line`
    if (window.map.getLayer(layerName_point))
      window.map.removeLayer(layerName_point)
    if (window.map.getLayer(layerName_line))
      window.map.removeLayer(layerName_line)
    if (window.map.getLayer(layerName_polygon))
      window.map.removeLayer(layerName_polygon)
    if (window.map.getLayer(layerName_polygon_line))
      window.map.removeLayer(layerName_polygon_line)
  })
}

// for geojson
function addGeoJsonPointLayer(layerName: string, sourceName: string) {
  layerName = `${layerName}-point`
  addPointLayer(layerName, sourceName)
}
function addGeoJsonLineLayer(layerName: string, sourceName: string) {
  layerName = `${layerName}-line`
  addLineLayer(layerName, sourceName)
}
function addGeoJsonPolygonLayer(layerName: string, sourceName: string) {
  layerName = `${layerName}-polygon`
  addPolygonLayer(layerName, sourceName)
}
export function addGeoJsonLayer() {
  localGeoJsonDataList.value.forEach((item) => {
    const sourceName = `geojson-source-${item.id}`
    const layerName = `geojson-layer-${item.id}`
    addGeoJsonPointLayer(layerName, sourceName)
    addGeoJsonLineLayer(layerName, sourceName)
    addGeoJsonPolygonLayer(layerName, sourceName)
  })
}
export function clearGeoJsonLayer() {
  localGeoJsonDataList.value.forEach((item) => {
    const layerName = `geojson-layer-${item.id}`
    const layerName_point = `${layerName}-point`
    const layerName_line = `${layerName}-line`
    const layerName_polygon = `${layerName}-polygon`
    const layerName_polygon_line = `${layerName}-polygon-line`
    if (window.map.getLayer(layerName_point))
      window.map.removeLayer(layerName_point)
    if (window.map.getLayer(layerName_line))
      window.map.removeLayer(layerName_line)
    if (window.map.getLayer(layerName_polygon))
      window.map.removeLayer(layerName_polygon)
    if (window.map.getLayer(layerName_polygon_line))
      window.map.removeLayer(layerName_polygon_line)
  })
}
