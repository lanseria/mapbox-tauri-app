<script lang="ts" setup>
import * as turf from '@turf/turf'
import type { LngLatLike } from 'mapbox-gl'
import mapboxgl from 'mapbox-gl'
import MapboxLanguage from '@mapbox/mapbox-gl-language'
import 'mapbox-gl/dist/mapbox-gl.css'
import { nanoid } from 'nanoid'

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
  map.addControl(new MapboxLanguage({ defaultLanguage: 'zh-Hans' }))
  map.on('load', () => {
    map!.resize()
    handleMapLoad(map!)
  })
  // map.on('mouseenter', () => {
  //   console.log('mouseenter')
  //   if (map) {
  //     if (['point', 'line', 'polygon', 'circle'].includes(sessionMouseState.value)) {
  //       console.warn('[getCanvas]', map.getCanvas())
  //       map.getCanvas().style.cursor = 'pointer'
  //     }
  //   }
  // })
  // map.on('mouseleave', () => {
  //   if (map) {
  //     console.warn('[getCanvas]', map.getCanvas())
  //     map.getCanvas().style.cursor = ''
  //   }
  // })
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
})
</script>

<template>
  <div ref="mapContainer" class="relative h-full w-full" />
</template>
