<script lang="ts" setup>
import * as turf from '@turf/turf'
import { sessionDrawActiveId } from '~/composables/session'
import type { KmlData, TiffData } from '~/types'

const props = defineProps({
  layerType: {
    type: String as PropType<'draw' | 'tiff' | 'kml' | 'shp' | 'geojson'>,
    required: true,
  },
  item: {
    type: Object as PropType<any>,
    required: true,
  },
})
type DrawFeature = turf.Feature<turf.Point | turf.LineString | turf.Polygon, any>
const PointFormModalRef = shallowRef()
const LineFormModalRef = shallowRef()
const PolygonFormModalRef = shallowRef()
const TiffFormModalRef = shallowRef()
// ref
const kmlCollapse = ref(false)
const id = computed<string>(() => {
  if (props.layerType === 'draw')
    return props.item.properties!.id
  if (props.layerType === 'tiff')
    return props.item.id
  return '0'
})
const name = computed<string>(() => {
  if (props.layerType === 'draw')
    return props.item.properties!.name
  if (props.layerType === 'tiff')
    return props.item.name
  if (props.layerType === 'kml')
    return props.item.name
  return ''
})
const visibility = computed<boolean>(() => {
  if (props.layerType === 'draw')
    return props.item.properties!.visibility
  if (props.layerType === 'tiff')
    return props.item.visibility
  return false
})
function flyToItem() {
  if (props.layerType === 'draw') {
    const item = props.item as DrawFeature
    if (item.geometry.type === 'Point') {
      window.map.panTo({
        lng: item.geometry.coordinates[0],
        lat: item.geometry.coordinates[1],
      })
    }
    if (item.geometry.type === 'LineString') {
      const center = turf.center(item).geometry.coordinates
      window.map.panTo({
        lng: center[0],
        lat: center[1],
      })
    }
    if (item.geometry.type === 'Polygon') {
      const center = turf.center(item).geometry.coordinates
      window.map.panTo({
        lng: center[0],
        lat: center[1],
      })
    }
  }
  if (props.layerType === 'tiff') {
    const item = props.item as TiffData
    const features = turf.points(item.coordinates)
    const center = turf.center(features).geometry.coordinates
    window.map.panTo({
      lng: center[0],
      lat: center[1],
    })
  }
}
function setVisible() {
  const item = props.item
  if (props.layerType === 'draw') {
    // TODO:
    item.properties!.visibility = !item.properties!.visibility
    addDrawSource()
    // for kml
    addKmlSource()
  }
  if (props.layerType === 'tiff') {
    item.visibility = !item.visibility
    loadTiff()
  }
}
function editFeature() {
  if (props.layerType === 'draw') {
    const item = props.item as DrawFeature
    console.warn('[editFeature]')
    if (item.geometry.type === 'Point')
      PointFormModalRef.value.open(item.properties)
    if (item.geometry.type === 'LineString')
      LineFormModalRef.value.open(item.properties)
    if (item.geometry.type === 'Polygon')
      PolygonFormModalRef.value.open(item.properties)
  }
  if (props.layerType === 'tiff') {
    const item = props.item as TiffData
    TiffFormModalRef.value.open(item)
  }
}

function removeFeature() {
  if (props.layerType === 'draw') {
    const item = props.item as DrawFeature
    localDrawFeatureCollection.value.features = localDrawFeatureCollection.value.features.filter(feature => feature.properties!.id !== item.properties.id)
    addDrawSource()
  }
  if (props.layerType === 'tiff') {
    const item = props.item as TiffData
    clearTiffLayer()
    clearTiffSource()
    localTiffDataList.value = localTiffDataList.value.filter(tiff => tiff.id !== item.id)
    loadTiff()
  }
  if (props.layerType === 'kml') {
    const item = props.item as KmlData
    clearKmlLayer()
    clearKmlSource()
    localKmlDataList.value = localKmlDataList.value.filter(kml => kml.id !== item.id)
    loadKml()
  }
}
</script>

<template>
  <div
    class="group relative box-border h-40px flex cursor-default items-center gap-1 border-1px border-transparent px-2 hover:border-blue-5"
    :class="{
      active: id === sessionDrawActiveId,
    }"
    @click="flyToItem()"
  >
    <div v-if="layerType === 'kml'" @click="kmlCollapse = !kmlCollapse">
      <div v-if="kmlCollapse" class="i-carbon-caret-down text-12px text-gray-5" />
      <div v-else class="i-carbon-caret-right text-12px text-gray-5" />
    </div>
    <div v-else class="i-carbon-caret-right text-12px text-transparent" />
    <div class="flex-none">
      <template v-if="layerType === 'draw'">
        <div v-if="item.geometry.type === 'Point'" class="i-carbon-location text-14px" />
        <div v-else-if="item.geometry.type === 'LineString'" class="i-carbon-data-regular text-14px" />
        <div v-else-if="item.geometry.type === 'Polygon'" class="i-carbon-checkbox text-14px" />
      </template>
      <template v-if="layerType === 'tiff'">
        <div class="i-bi-filetype-tiff text-14px" />
      </template>
      <template v-if="layerType === 'kml'">
        <div class="i-gis-kml-file text-14px" />
      </template>
      <template v-if="layerType === 'shp'">
        <div class="i-gis-shape-file text-14px" />
      </template>
      <template v-if="layerType === 'geojson'">
        <div class="i-gis-geojson-file text-14px" />
      </template>
    </div>
    <div class="w-full flex shrink grow basis-0 overflow-y-hidden">
      <div class="truncate text-13px">
        {{ name }}
      </div>
    </div>
    <div class="hidden h-40px flex-none items-center justify-center group-hover:flex">
      <div class="h-24px w-24px flex items-center justify-center rounded text-13px hover:bg-gray-1" @click.stop="setVisible()">
        <div v-if="visibility" class="i-carbon-view" />
        <div v-else class="i-carbon-view-off" />
      </div>
      <div class="h-24px w-24px flex items-center justify-center rounded text-13px hover:bg-gray-1" @click.stop="editFeature()">
        <div class="i-carbon-edit" />
      </div>
      <div class="h-24px w-24px flex items-center justify-center rounded text-13px hover:bg-gray-1" @click.stop="removeFeature()">
        <div class="i-carbon-close" />
      </div>
    </div>
  </div>
  <div v-if="layerType === 'kml' && kmlCollapse">
    <MapLayerItem v-for="(it, k) in item.geojson.features" :key="k" :item="it" layer-type="draw" />
  </div>
  <PointFormModal ref="PointFormModalRef" />
  <LineFormModal ref="LineFormModalRef" />
  <PolygonFormModal ref="PolygonFormModalRef" />
  <TiffFormModal ref="TiffFormModalRef" />
</template>

<style lang="css" scoped>
.group.active {
  @apply border-blue-4;
}
</style>
