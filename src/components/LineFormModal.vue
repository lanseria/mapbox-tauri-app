<script lang="ts" setup>
import _ from 'lodash-es'
import type { DrawLine } from '~/types'

const showModal = ref(false)
const featureForm = ref(initDrawLine('', []))

function handleSubmit() {
  const idx = localDrawFeatureCollection.value.features.findIndex(feature => feature.properties!.id === featureForm.value.id)
  localDrawFeatureCollection.value.features[idx].properties = _.cloneDeep(featureForm.value)
  console.warn(_.cloneDeep(featureForm.value))
  showModal.value = false
  addDrawSource()
}
function open(itemProps: DrawLine) {
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
          <AFormItem field="width" tooltip="Please enter width" label="width">
            <AInputNumber
              v-model="featureForm.width"
              placeholder="please enter your width..."
            />
          </AFormItem>
          <AFormItem field="opacity" tooltip="Please enter opacity" label="opacity">
            <AInputNumber
              v-model="featureForm.opacity"
              placeholder="please enter your opacity..."
            />
          </AFormItem>
        </AForm>
      </template>
    </Modal>
  </Teleport>
</template>
