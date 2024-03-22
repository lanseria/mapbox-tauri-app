<script setup lang="ts">
const hoverMapBoxRef = shallowRef()
const isHovered = useElementHover(hoverMapBoxRef)
const hoverClass = computed(() => {
  return `${sessionMouseState.value}-hover`
})
</script>

<template>
  <div class="h-full w-full flex flex-col">
    <Titlebar class="flex-none" />
    <div class="flex shrink grow basis-0 overflow-y-hidden">
      <ToolBar class="flex-none" />
      <SourceBar class="flex-none" />
      <MapBox
        ref="hoverMapBoxRef" class="shrink grow basis-0 overflow-y-hidden" :class="{
          [hoverClass]: isHovered,
        }"
      />
    </div>
  </div>
</template>

<style lang="css" scoped>
.default-hover:deep(canvas) {
  @apply cursor-default;
}
.point-hover:deep(canvas),
.line-hover:deep(canvas),
.polygon-hover:deep(canvas),
.circle-hover:deep(canvas) {
  @apply cursor-crosshair;
}
</style>
