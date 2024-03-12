import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
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
    ['btn', 'px-4 py-1 rounded inline-block bg-[rgba(var(--arcoblue-6))] text-white cursor-pointer hover:bg-[rgba(var(--arcoblue-7))] disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['icon-btn', 'text-[0.9em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-[rgba(var(--arcoblue-6))] !outline-none'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Noto Sans Simplified Chinese',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    // transformerVariantGroup(),
  ],
})
