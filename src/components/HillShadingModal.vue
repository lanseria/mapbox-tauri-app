<script lang="ts" setup>
import { localHillshadeAccentColor, localHillshadeExaggeration, localHillshadeHighlightColor, localHillshadeIlluminationDirection, localHillshadeShadowColor } from '~/composables/local'

const showModal = ref(false)

function handleSubmit() {
  // 处理提交逻辑，例如保存设置
  setDemHillLayer()
  showModal.value = false
}
function open() {
  showModal.value = true
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
        <h3>山体阴影设置</h3>
      </template>
      <template #body>
        <ASpace direction="vertical" align="center" class="w-full">
          <div>
            <label for="exaggeration">山体夸张程度:</label>
            <input
              id="exaggeration"
              v-model="localHillshadeExaggeration"
              type="number"
              min="0"
              max="1"
              step="0.01"
            >
          </div>
          <div>
            <label for="accentColor">强调色:</label>
            <input
              id="accentColor"
              v-model="localHillshadeAccentColor"
              type="color"
            >
          </div>
          <div>
            <label for="shadowColor">阴影色:</label>
            <input
              id="shadowColor"
              v-model="localHillshadeShadowColor"
              type="color"
            >
          </div>
          <div>
            <label for="highlightColor">高亮色:</label>
            <input
              id="highlightColor"
              v-model="localHillshadeHighlightColor"
              type="color"
            >
          </div>
          <div>
            <label for="illuminationDirection">光源方向:</label>
            <input
              id="illuminationDirection"
              v-model="localHillshadeIlluminationDirection"
              type="number"
              min="0"
              max="359"
            >
          </div>
        </ASpace>
      </template>
    </Modal>
  </Teleport>
</template>
