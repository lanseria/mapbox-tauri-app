<script lang="ts" setup>
import * as turf from '@turf/turf'
import type { LngLatLike } from 'mapbox-gl'
import mapboxgl from 'mapbox-gl'
import MapboxLanguage from '@mapbox/mapbox-gl-language'
import 'mapbox-gl/dist/mapbox-gl.css'
import { nanoid } from 'nanoid'
import MapboxDraw from '@mapbox/mapbox-gl-draw'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN
let map: mapboxgl.Map | null = null
const mapContainer = shallowRef()
onMounted(() => {
  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/lanseria/clhluh3n100kq01r87c9deet0',
    center: [108.84, 31.06] as LngLatLike,
    zoom: 3.5,
    hash: true,
    attributionControl: false,
  })
  window.map = map
  // draw
  const draw = new MapboxDraw({
    displayControlsDefault: false,
    userProperties: true,
    modes: {
      direct_select: MapboxDraw.modes.direct_select,
      simple_select: MapboxDraw.modes.simple_select,
      draw_line_string: ExtendedLineStringMode,
    },
    styles: mapDrawStyle,
  })
  window.draw = draw
  // add map control
  map.addControl(new MapboxLanguage({ defaultLanguage: 'zh-Hans' }))
  map.addControl(draw)
  // map loading
  map.on('load', () => {
    map!.resize()
    handleMapLoad(map!)
  })
  map.on('click', (e) => {
    if (map === null)
      return
    console.warn('[map.click]', e)
    if (sessionMouseState.value === 'point') {
      console.warn('[map.click.point]', [e.lngLat.lng, e.lngLat.lat])
      const id = nanoid()
      localDrawFeatureCollection.value.features.push(
        turf.point([e.lngLat.lng, e.lngLat.lat], initDrawPoint(id, [e.lngLat.lng, e.lngLat.lat])),
      )
      addDrawSource()
      sessionMouseState.value = 'default'
    }
  })

  map.on('draw.create', (e) => {
    console.warn('[draw.create]', e.features[0])
    const id = nanoid()
    localDrawFeatureCollection.value.features.push(
      turf.lineString(
        e.features[0].geometry.coordinates,
        initDrawLine(id, e.features[0].geometry.coordinates),
      ),
    )
    draw.deleteAll()
    sessionMouseState.value = 'default'
    addDrawSource()
  })
})
</script>

<template>
  <div ref="mapContainer" class="relative h-full w-full" />
</template>
