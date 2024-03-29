<script lang="ts" setup>
import { Message } from '@arco-design/web-vue'
import { open } from '@tauri-apps/api/dialog'
import { readTextFile } from '@tauri-apps/api/fs'

const emits = defineEmits(['update:bounds'])

const { loading, setLoading } = useLoading(false)

async function openFile() {
  try {
    setLoading(true)
    const selected = await open({
      multiple: false,
      filters: [{
        name: 'TIFF World File',
        extensions: ['tfw'],
      }],
    })
    if (selected === null) {
      Message.warning('未选择文件')
    }
    else {
      const contents = await readTextFile(selected as string)
      const lines = contents.split('\n').map(line => Number.parseFloat(line))
      emits('update:bounds', lines)
    }
  }
  catch (error: any) {
    console.error(error)
  }
  finally {
    setLoading(false)
  }
}
</script>

<template>
  <AButton
    :loading="loading"
    type="primary"
    @click="openFile()"
  >
    <slot />
  </AButton>
</template>
