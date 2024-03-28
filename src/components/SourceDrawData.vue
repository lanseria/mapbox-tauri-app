<script lang="ts" setup>
import * as turf from '@turf/turf'
import { sessionDrawActiveId } from '~/composables/session'

const PointFormModalRef = shallowRef()
const LineFormModalRef = shallowRef()
const PolygonFormModalRef = shallowRef()
const computedDrawData = computed(() => {
  return localDrawFeatureCollection.value.features
})
function removeFeature(item: any) {
  localDrawFeatureCollection.value.features = localDrawFeatureCollection.value.features.filter(feature => feature.properties!.id !== item.properties.id)
  addDrawSource()
}
function setVisible(item: any) {
  item.properties!.visibility = !item.properties!.visibility
  addDrawSource()
}
function editFeature(item: any) {
  console.warn('[editFeature]')
  if (item.geometry.type === 'Point')
    PointFormModalRef.value.open(item.properties)
  if (item.geometry.type === 'LineString')
    LineFormModalRef.value.open(item.properties)
  if (item.geometry.type === 'Polygon')
    PolygonFormModalRef.value.open(item.properties)
}
function flyToItem(item: any) {
  console.warn('[flyToItem]', item)
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
</script>

<template>
  <div>
    <div
      v-for="item in computedDrawData"
      :key="item.properties!.id"
      class="group relative box-border h-40px flex cursor-default items-center gap-1 border-1px border-transparent px-2 hover:border-blue-5"
      :class="{
        active: item.properties!.id === sessionDrawActiveId,
      }"
      @click="flyToItem(item)"
    >
      <div class="flex-none">
        <div v-if="item.geometry.type === 'Point'" class="i-carbon-location text-16px" />
        <div v-else-if="item.geometry.type === 'LineString'" class="i-carbon-data-regular text-16px" />
        <div v-else-if="item.geometry.type === 'Polygon'" class="i-carbon-checkbox text-16px" />
      </div>
      <div class="w-full flex shrink grow basis-0 overflow-y-hidden">
        <div class="truncate text-13px">
          {{ item.properties!.name }}
        </div>
      </div>
      <div class="hidden h-40px flex-none items-center justify-center group-hover:flex">
        <div class="h-24px w-24px flex items-center justify-center rounded text-13px hover:bg-gray-1" @click.stop="setVisible(item)">
          <div v-if="item.properties!.visibility" class="i-carbon-view" />
          <div v-else class="i-carbon-view-off" />
        </div>
        <div class="h-24px w-24px flex items-center justify-center rounded text-13px hover:bg-gray-1" @click.stop="editFeature(item)">
          <div class="i-carbon-edit" />
        </div>
        <div class="h-24px w-24px flex items-center justify-center rounded text-13px hover:bg-gray-1" @click.stop="removeFeature(item)">
          <div class="i-carbon-close" />
        </div>
      </div>
    </div>
    <PointFormModal ref="PointFormModalRef" />
    <LineFormModal ref="LineFormModalRef" />
    <PolygonFormModal ref="PolygonFormModalRef" />
  </div>
</template>

<style lang="css" scoped>
.group.active {
  @apply border-blue-4;
}
</style>
