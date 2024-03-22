<script lang="ts" setup>
const showModal = ref(false)
const computedDrawData = computed(() => {
  return localDrawFeatureCollection.value.features
})
function removeFeature(item: any) {
  localDrawFeatureCollection.value.features = localDrawFeatureCollection.value.features.filter(feature => feature.properties!.id !== item.properties.id)
  loadDraw()
}
function editFeature(_item: any) {
  console.warn('editFeature')
  showModal.value = true
}
</script>

<template>
  <div>
    <div
      v-for="item in computedDrawData"
      :key="item.properties!.id"
      class="group relative box-border h-40px flex cursor-default items-center gap-1 border-1px border-transparent px-2 hover:border-blue-5"
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
        <div class="h-24px w-24px flex items-center justify-center rounded text-13px hover:bg-gray-1" @click="editFeature(item)">
          <div class="i-carbon-edit" />
        </div>
        <div class="h-24px w-24px flex items-center justify-center rounded text-13px hover:bg-gray-1" @click="removeFeature(item)">
          <div class="i-carbon-close" />
        </div>
      </div>
    </div>

    <Teleport to="body">
      <!-- 使用这个 modal 组件，传入 prop -->
      <modal :show="showModal" @close="showModal = false">
        <template #header>
          <h3>custom header</h3>
        </template>
      </modal>
    </Teleport>
  </div>
</template>
