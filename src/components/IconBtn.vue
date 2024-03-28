<script lang="ts" setup>
defineProps({
  iconName: {
    type: String,
    required: true,
  },
  tooltipName: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div
    class="tool-button"
    :title="tooltipName"
  >
    <div class="tool-icon" :class="iconName" />
  </div>
</template>

<style lang="css" scoped>
.tool-button {
  @apply m-2px h-32px w-32px flex items-center justify-center rounded;
}
.tool-button:not(.active) {
  @apply hover:bg-gray-1;
}
.tool-icon {
  @apply h-20px w-20px;
}
</style>
