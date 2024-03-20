/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}

interface Window {
  map: mapboxgl.Map
  draw: MapboxDraw
}

/**
 * defines in `vite.config.ts`
 */
declare const OS_PLATFORM: Platform
