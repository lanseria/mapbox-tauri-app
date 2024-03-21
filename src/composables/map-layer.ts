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
    filter: ['==', ['geometry-type'], 'Point'],
  })
  map.on('click', MAP_DRAW_POINT_LAYER_NAME, (e) => {
    console.warn(e)
  })
  map.on('mouseenter', MAP_DRAW_POINT_LAYER_NAME, (_e) => {
    map.getCanvas().style.cursor = 'pointer'
  })
  map.on('mouseleave', MAP_DRAW_POINT_LAYER_NAME, (_e) => {
    map.getCanvas().style.cursor = ''
  })
}

export function addDrawLayer() {
  addDrawPointLayer()
}
