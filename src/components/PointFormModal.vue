<script lang="ts" setup>
import _ from 'lodash-es'
import type { DrawPoint } from '~/types'

const showModal = ref(false)
const featureForm = ref(initDrawPoint('', []))

function handleSubmit() {
  const idx = localDrawFeatureCollection.value.features.findIndex(feature => feature.properties!.id === featureForm.value.id)
  localDrawFeatureCollection.value.features[idx].properties = _.cloneDeep(featureForm.value)
  console.warn(_.cloneDeep(featureForm.value))
  showModal.value = false
  addDrawSource()
}
function open(itemProps: DrawPoint) {
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
</template>
