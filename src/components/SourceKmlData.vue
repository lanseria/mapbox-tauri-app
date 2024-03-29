<script lang="ts" setup>
import { localKmlDataList } from '~/composables'
</script>

<template>
  <div class="w-full flex shrink grow basis-0 flex-col overflow-y-hidden">
    <KmlBtn class="flex-none" />
    <div class="h-1px flex-none bg-slate-2" />
    <div class="overflow-auto">
      <MapLayerItem
        v-for="item in localKmlDataList"
        :key="item.id"
        :item="item"
        layer-type="kml"
      />
    </div>
  </div>
</template>
