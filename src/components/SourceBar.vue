<script lang="ts" setup>
type SourceType = 'draw' | 'geojson' | 'kml' | 'shp' | 'tiff'
const sourceActive = ref<SourceType>('draw')
</script>

<template>
  <div class="h-full w-238px border-r-1px border-slate-2">
    <div class="flex border-b-1px border-slate-2">
      <div class="tab-btn" :class="{ active: sourceActive === 'draw' }" @click="sourceActive = 'draw'">
        Draw
      </div>
      <div class="tab-btn" :class="{ active: sourceActive === 'tiff' }" @click="sourceActive = 'tiff'">
        Tiff
      </div>
      <div class="tab-btn" :class="{ active: sourceActive === 'kml' }" @click="sourceActive = 'kml'">
        Kml
      </div>
      <div class="tab-btn" :class="{ active: sourceActive === 'shp' }" @click="sourceActive = 'shp'">
        Shp
      </div>
      <div class="tab-btn" :class="{ active: sourceActive === 'geojson' }" @click="sourceActive = 'geojson'">
        GeoJson
      </div>
    </div>
    <SourceDrawData v-if="sourceActive === 'draw'" />
    <SourceTiffData v-if="sourceActive === 'tiff'" />
  </div>
</template>

<style lang="css" scoped>
.tab-btn {
  @apply px-2 leading-10  font-bold text-slate-4 cursor-default hover:text-slate-8 text-12px;
}
.tab-btn.active {
  @apply border-b-2px border-slate-6 text-slate-8;
}
</style>
