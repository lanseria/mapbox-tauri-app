<script lang="ts" setup>
import _ from 'lodash-es'

const showModal = ref(false)
const featureForm = ref(initDrawPoint('', []))
const computedDrawData = computed(() => {
  return localDrawFeatureCollection.value.features
})
function removeFeature(item: any) {
  localDrawFeatureCollection.value.features = localDrawFeatureCollection.value.features.filter(feature => feature.properties!.id !== item.properties.id)
  addDrawSource()
}
function editFeature(item: any) {
  console.warn('editFeature')
  featureForm.value = _.cloneDeep(item.properties)
  showModal.value = true
}

function handleSubmit() {
  const idx = localDrawFeatureCollection.value.features.findIndex(feature => feature.properties!.id === featureForm.value.id)
  localDrawFeatureCollection.value.features[idx].properties = _.cloneDeep(featureForm.value)
  console.warn(_.cloneDeep(featureForm.value))
  showModal.value = false
  addDrawSource()
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
      <Modal :show="showModal" @close="handleSubmit">
        <template #header>
          <h3>编辑点</h3>
        </template>
        <template #body>
          <AForm size="mini" :model="featureForm" auto-label-width>
            <AFormItem field="name" tooltip="Please enter name" label="name">
              <AInput
                v-model="featureForm.name"
                placeholder="please enter your name..."
              />
            </AFormItem>
            <AFormItem field="color" tooltip="Please enter color" label="color">
              <AColorPicker v-model="featureForm.color" size="mini">
                <ATag :color="featureForm.color">
                  <template #icon>
                    <IconBgColors style="color: #fff" />
                  </template>
                  {{ featureForm.color }}
                </ATag>
              </AColorPicker>
            </AFormItem>
            <AFormItem field="size" tooltip="Please enter size" label="size">
              <AInputNumber
                v-model="featureForm.size"
                placeholder="please enter your size..."
              />
            </AFormItem>
            <AFormItem field="textFillColor" tooltip="Please enter textFillColor" label="textFillColor">
              <AColorPicker v-model="featureForm.textFillColor" size="mini">
                <ATag :color="featureForm.textFillColor">
                  <template #icon>
                    <IconBgColors style="color: #fff" />
                  </template>
                  {{ featureForm.textFillColor }}
                </ATag>
              </AColorPicker>
            </AFormItem>
            <AFormItem field="textStrokeColor" tooltip="Please enter textStrokeColor" label="textStrokeColor">
              <AColorPicker v-model="featureForm.textStrokeColor" size="mini">
                <ATag :color="featureForm.textStrokeColor">
                  <template #icon>
                    <IconBgColors style="color: #fff" />
                  </template>
                  {{ featureForm.textStrokeColor }}
                </ATag>
              </AColorPicker>
            </AFormItem>
            <AFormItem field="textSize" tooltip="Please enter textSize" label="textSize">
              <AInputNumber
                v-model="featureForm.textSize"
                placeholder="please enter your textSize..."
              />
            </AFormItem>
          </AForm>
        </template>
      </Modal>
    </Teleport>
  </div>
</template>
