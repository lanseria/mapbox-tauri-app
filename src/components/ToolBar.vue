<script lang="ts" setup>
import { sessionMouseState } from '~/composables/session'
</script>

<template>
  <div class="w-40px flex flex-col items-center border-r-1px border-gray-1 bg-white py-1">
    <div class="tool-button" :class="`${sessionMouseState === 'default' ? 'active' : 'inactive'}`" @click="sessionMouseState = 'default'">
      <div class="i-carbon-cursor-2 h-20px w-20px" />
    </div>
    <div class="tool-button" :class="`${sessionMouseState === 'point' ? 'active' : 'inactive'}`" @click="sessionMouseState = 'point'">
      <div class="i-carbon-location h-20px w-20px" />
    </div>
    <div class="tool-button" :class="`${sessionMouseState === 'line' ? 'active' : 'inactive'}`" @click="sessionMouseState = 'line'">
      <div class="i-carbon-data-regular h-20px w-20px" />
    </div>
    <div class="tool-button" :class="`${sessionMouseState === 'polygon' ? 'active' : 'inactive'}`" @click="sessionMouseState = 'polygon'">
      <div class="i-carbon-checkbox h-20px w-20px" />
    </div>
    <div class="tool-button" :class="`${sessionMouseState === 'circle' ? 'active' : 'inactive'}`" @click="sessionMouseState = 'circle'">
      <div class="i-carbon-radio-button h-20px w-20px" />
    </div>
  </div>
</template>

<style lang="css" scoped>
.tool-button {
  @apply m-2px h-32px w-32px flex items-center justify-center rounded;
}
.active {
  @apply bg-blue-5 text-white;
}
.inactive {
  @apply bg-white text-gray-7;
}
</style>
