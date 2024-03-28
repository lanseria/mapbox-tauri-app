import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  // transformerVariantGroup,
} from 'unocss'

// 主色
// rgba(var(--arcoblue-6))
// 成功色
// rgba(var(--green-6))
// 警示色
// rgba(var(--orange-6))
// 错误色
// rgba(var(--red-6))
export default defineConfig({
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block text-white cursor-pointer disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['ms-blue-btn', 'btn bg-[rgba(var(--arcoblue-6))] text-white hover:bg-[rgba(var(--arcoblue-7))] disabled:bg-[rgba(var(--arcoblue-7))]'],
    ['icon-btn', 'text-[0.9em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-[rgba(var(--arcoblue-6))] !outline-none'],
    ['ms-link-text', 'text-blue-5 cursor-pointer mr-2 hover:text-blue-6'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
  ],
  transformers: [
    transformerDirectives(),
    // transformerVariantGroup(),
  ],
})
