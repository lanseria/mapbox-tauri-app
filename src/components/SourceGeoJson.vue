<script lang="ts" setup>
import { localGeoJsonDataList } from '~/composables'
</script>

<template>
  <div class="w-full flex shrink grow basis-0 flex-col overflow-y-hidden">
    <GeoJsonBtn class="flex-none" />
    <div class="h-1px flex-none bg-slate-2" />
    <div class="overflow-auto">
      <MapLayerItem
        v-for="item in localGeoJsonDataList"
        :key="item.id"
        :item="item"
        layer-type="geojson"
      />
    </div>
  </div>
</template>
