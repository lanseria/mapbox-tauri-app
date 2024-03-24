<script lang="ts" setup>
import _ from 'lodash-es'
import type { DrawPolygon } from '~/types'

const showModal = ref(false)
const featureForm = ref(initDrawPolygon('', []))

function handleSubmit() {
  const idx = localDrawFeatureCollection.value.features.findIndex(feature => feature.properties!.id === featureForm.value.id)
  localDrawFeatureCollection.value.features[idx].properties = _.cloneDeep(featureForm.value)
  console.warn(_.cloneDeep(featureForm.value))
  showModal.value = false
  addDrawSource()
}
function open(itemProps: DrawPolygon) {
  showModal.value = true
  featureForm.value = _.cloneDeep(itemProps)
}
defineExpose({
  open,
})
</script>

<template>
  <Teleport to="body">
    <!-- 使用这个 modal 组件，传入 prop -->
    <Modal :show="showModal" @close="handleSubmit">
      <template #header>
        <h3>编辑</h3>
      </template>
      <template #body>
        <AForm size="mini" :model="featureForm" auto-label-width>
          <AFormItem field="name" tooltip="Please enter name" label="name">
            <AInput
              v-model="featureForm.name"
              placeholder="please enter your name..."
            />
          </AFormItem>
          <AFormItem field="fillColor" tooltip="Please enter fillColor" label="fillColor">
            <AColorPicker v-model="featureForm.fillColor" size="mini">
              <ATag :color="featureForm.fillColor">
                <template #icon>
                  <IconBgColors style="color: #fff" />
                </template>
                {{ featureForm.fillColor }}
              </ATag>
            </AColorPicker>
          </AFormItem>
          <AFormItem field="fillOpacity" tooltip="Please enter fillOpacity" label="fillOpacity">
            <AInputNumber
              v-model="featureForm.fillOpacity"
              placeholder="please enter your fillOpacity..."
            />
          </AFormItem>
          <AFormItem field="lineColor" tooltip="Please enter lineColor" label="lineColor">
            <AColorPicker v-model="featureForm.lineColor" size="mini">
              <ATag :color="featureForm.lineColor">
                <template #icon>
                  <IconBgColors style="color: #fff" />
                </template>
                {{ featureForm.lineColor }}
              </ATag>
            </AColorPicker>
          </AFormItem>
          <AFormItem field="lineWidth" tooltip="Please enter lineWidth" label="lineWidth">
            <AInputNumber
              v-model="featureForm.lineWidth"
              placeholder="please enter your lineWidth..."
            />
          </AFormItem>
        </AForm>
      </template>
    </Modal>
  </Teleport>
</template>
