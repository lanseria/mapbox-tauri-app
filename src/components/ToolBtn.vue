<script lang="ts" setup>
import type { PropType } from 'vue'
import { sessionMouseState } from '~/composables/session'
import type { MouseState } from '~/types'

const props = defineProps({
  iconName: {
    type: String,
    required: true,
  },
  type: {
    type: String as PropType<MouseState>,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
})
function handleClick() {
  sessionMouseState.value = props.type
}
</script>

<template>
  <IconBtn
    :icon-name="iconName" :class="`${sessionMouseState === type ? 'active' : 'inactive'}`"
    :tooltip-name="name"
    @click="handleClick"
  />
</template>

<style lang="css" scoped>
.tool-button:not(.active) {
  @apply hover:bg-gray-1;
}
.active {
  @apply bg-blue-5 text-white;
}

.inactive {
  @apply bg-white text-gray-7;
}
</style>
