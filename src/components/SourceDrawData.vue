<script lang="ts" setup>
const computedDrawData = computed(() => {
  return localDrawFeatureCollection.value.features
})
</script>

<template>
  <div>
    <MapLayerItem
      v-for="item in computedDrawData"
      :key="item.properties!.id"
      :item="item"
      layer-type="draw"
    />
  </div>
</template>
