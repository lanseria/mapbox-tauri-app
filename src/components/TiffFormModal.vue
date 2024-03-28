<script lang="ts" setup>
import _ from 'lodash-es'
import type { TiffData } from '~/types'

const showModal = ref(false)
const featureForm = ref(initTiffData())

function handleSubmit() {
  const idx = localTiffDataList.value.findIndex(feature => feature.id === featureForm.value.id)
  localTiffDataList.value[idx] = _.cloneDeep(featureForm.value)
  console.warn(_.cloneDeep(featureForm.value))
  showModal.value = false
  loadTiff()
}
function open(itemProps: TiffData) {
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
