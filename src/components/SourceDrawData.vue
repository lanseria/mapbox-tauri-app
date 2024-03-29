<script lang="ts" setup>
const computedDrawData = computed(() => {
  return localDrawFeatureCollection.value.features
})
</script>

<template>
  <div class="w-full flex shrink grow basis-0 flex-col overflow-y-hidden">
    <div class="w-full overflow-y-auto">
      <MapLayerItem
        v-for="item in computedDrawData"
        :key="item.properties!.id"
        :item="item"
        layer-type="draw"
      />
    </div>
  </div>
</template>
