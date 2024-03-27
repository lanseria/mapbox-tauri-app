<script lang="ts" setup>
import _ from 'lodash-es'

const showModal = ref(false)

function handleSubmit() {
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
        <h3>关于</h3>
      </template>
      <template #body>
        <ASpace direction="vertical" align="center" class="w-full">
          <MapLogo />
          <ATypographyText>
            技术栈
            <a
              class="ms-link-text"
              href="https://mapbox.com"
              target="_blank"
              rel="noreferrer"
            >@Mapbox</a>
            <a
              class="ms-link-text"
              href="https://vuejs.org"
              target="_blank"
              rel="noreferrer"
            >Vue3</a>
          </ATypographyText>
          <ATypographyText>
            Made by  <a
              class="ms-link-text"
              href="https://github.com/lanseria"
              target="_blank"
              rel="noreferrer"
            >@Lanseria</a> <a
              class="ms-link-text"
              href="https://space.bilibili.com/8487409"
              target="_blank"
              rel="noreferrer"
            >@爱吃包子的超</a>
          </ATypographyText>
        </ASpace>
      </template>
    </Modal>
  </Teleport>
</template>
