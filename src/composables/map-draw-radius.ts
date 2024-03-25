// 自定义 mapbox-gl-draw 模式，修改 draw_line_string
// 在绘制时显示中心点、半径线和圆形多边形
// 在创建第二个顶点时强制 draw.create

import MapboxDraw from '@mapbox/mapbox-gl-draw'
import numeral from 'numeral'
import * as turf from '@turf/turf'

const lineDistance = turf.lineDistance
export const RadiusMode = MapboxDraw.modes.draw_line_string

// 创建一个顶点
function createVertex(parentId: any, coordinates: any, path: any, selected: any) {
  return {
    type: 'Feature',
    properties: {
      meta: 'vertex', // 元数据
      parent: parentId, // 父元素
      coord_path: path, // 坐标路径
      active: (selected) ? 'true' : 'false', // 是否激活
    },
    geometry: {
      type: 'Point',
      coordinates,
    },
  }
}

// 创建一个圆形的多边形
// https://stackoverflow.com/questions/37599561/drawing-a-circle-with-the-radius-in-miles-meters-with-mapbox-gl-js/39006388#39006388
function createGeoJSONCircle(center: [number, number], radiusInKm: number, parentId: string, points = 64) {
  const coords = {
    latitude: center[1],
    longitude: center[0],
  }

  const km = radiusInKm

  const ret = []
  const distanceX = km / (111.320 * Math.cos((coords.latitude * Math.PI) / 180))
  const distanceY = km / 110.574

  let theta
  let x
  let y
  for (let i = 0; i < points; i += 1) {
    theta = (i / points) * (2 * Math.PI)
    x = distanceX * Math.cos(theta)
    y = distanceY * Math.sin(theta)

    ret.push([coords.longitude + x, coords.latitude + y])
  }
  ret.push(ret[0])

  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [ret],
    },
    properties: {
      parent: parentId,
    },
  }
}

// 获取显示的测量值
function getDisplayMeasurements(feature: any) {
  // should log both metric and standard display strings for the current drawn feature

  // metric calculation
  const drawnLength = (lineDistance(feature) * 1000) // meters

  let metricUnits = 'm' // 公制单位
  let metricFormat = '0,0'
  let metricMeasurement

  let standardUnits = 'feet' // 英制单位
  let standardFormat = '0,0'
  let standardMeasurement

  metricMeasurement = drawnLength
  if (drawnLength >= 1000) { // 如果超过 1000 米，升级公制
    metricMeasurement = drawnLength / 1000
    metricUnits = 'km'
    metricFormat = '0.00'
  }

  standardMeasurement = drawnLength * 3.28084
  if (standardMeasurement >= 5280) { // 如果超过 5280 英尺，升级英制
    standardMeasurement /= 5280
    standardUnits = 'mi'
    standardFormat = '0.00'
  }

  const displayMeasurements = {
    metric: `${numeral(metricMeasurement).format(metricFormat)} ${metricUnits}`, // 公制单位
    standard: `${numeral(standardMeasurement).format(standardFormat)} ${standardUnits}`, // 英制单位
  }

  return displayMeasurements
}

const doubleClickZoom = {
  enable: (ctx: any) => {
    setTimeout(() => {
      // 首先检查我们是否有地图和一些上下文。
      if (!ctx.map || !ctx.map.doubleClickZoom || !ctx._ctx || !ctx._ctx.store || !ctx._ctx.store.getInitialConfigValue)
        return
      // 现在检查初始状态是否为 false（如果是，则禁用它）
      if (!ctx._ctx.store.getInitialConfigValue('doubleClickZoom'))
        return
      ctx.map.doubleClickZoom.enable()
    }, 0)
  },
}

// 单击事件
// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
RadiusMode.clickAnywhere = function (state: any, e: any) {
  // 在用户创建第二个点后，这将结束绘制，触发 this.onStop
  if (state.currentVertexPosition === 1) {
    state.line.addCoordinate(0, e.lngLat.lng, e.lngLat.lat)
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    return this.changeMode('simple_select', { featureIds: [state.line.id] })
  }
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  this.updateUIClasses({ mouse: 'add' })
  state.line.updateCoordinate(state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat)
  if (state.direction === 'forward') {
    state.currentVertexPosition += 1
    state.line.updateCoordinate(state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat)
  }
  else {
    state.line.addCoordinate(0, e.lngLat.lng, e.lngLat.lat)
  }

  return null
}

// 停止事件
RadiusMode.onStop = function (state: any) {
  doubleClickZoom.enable(this)

  this.activateUIButton()

  // 检查是否已删除此特征
  if (this.getFeature(state.line.id) === undefined)
    return

  // 删除最后添加的坐标
  state.line.removeCoordinate('0')
  if (state.line.isValid()) {
    console.warn('state.line: ', state.line)
    const lineGeoJson = state.line.toGeoJSON()
    console.warn('lineGeoJson: ', lineGeoJson)
    // 为半径圆形标记创建自定义要素
    const center = lineGeoJson.geometry.coordinates[0] as [number, number]
    const radiusInKm = lineDistance(lineGeoJson, {
      units: 'kilometers',
    })
    const circleFeature = createGeoJSONCircle(center, radiusInKm, state.line.id)
    circleFeature.properties = {
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      active: 'true',
      meta: 'radius',
      radius: (lineDistance(lineGeoJson) * 1000).toFixed(1), // 半径
    }

    this.map.fire('draw.create', {
      features: [circleFeature],
    })
  }
  else {
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    this.deleteFeature([state.line.id], { silent: true })
    this.changeMode('simple_select', {}, { silent: true })
  }
}

// 显示特征
RadiusMode.toDisplayFeatures = function (state, geojson, display) {
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  const isActiveLine = geojson.properties.id === state.line.id
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  geojson.properties.active = (isActiveLine) ? 'true' : 'false'
  if (!isActiveLine)
    return display(geojson)

  // 仅在至少有一个真实坐标的情况下渲染该线
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  if (geojson.geometry.coordinates.length < 2)
    return null
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
  geojson.properties.meta = 'feature'

  // 将中心顶点显示为点要素
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  display(createVertex(
    state.line.id,
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    geojson.geometry.coordinates[state.direction === 'forward' ? geojson.geometry.coordinates.length - 2 : 1],
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    `${state.direction === 'forward' ? geojson.geometry.coordinates.length - 2 : 1}`,
    false,
  ))

  // 显示正在绘制的线
  display(geojson)

  const displayMeasurements = getDisplayMeasurements(geojson)

  // 为当前指针位置创建自定义要素
  const currentVertex = {
    type: 'Feature',
    properties: {
      meta: 'currentPosition', // 元数据
      radiusMetric: displayMeasurements.metric, // 公制单位
      radiusStandard: displayMeasurements.standard, // 英制单位
      parent: state.line.id, // 父元素
    },
    geometry: {
      type: 'Point',
      // eslint-disable-next-line ts/ban-ts-comment
      // @ts-expect-error
      coordinates: geojson.geometry.coordinates[1],
    },
  }
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  display(currentVertex)

  // 为半径圆形标记创建自定义要素
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  const center = geojson.geometry.coordinates[0] as [number, number]
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  const radiusInKm = lineDistance(geojson, 'kilometers')
  const circleFeature = createGeoJSONCircle(center, radiusInKm, state.line.id)
  circleFeature.properties = {
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    active: 'true',
    meta: 'radius',
  }

  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
  display(circleFeature)
}
