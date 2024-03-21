<script lang="ts" setup>
import type { LngLatLike } from 'mapbox-gl'
import mapboxgl from 'mapbox-gl'
import MapboxLanguage from '@mapbox/mapbox-gl-language'

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
    console.warn('[map.load]')
    map!.resize()
  })
})
</script>

<template>
  <div ref="mapContainer" class="relative h-full w-full" />
</template>
