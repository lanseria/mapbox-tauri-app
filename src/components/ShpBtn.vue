<script lang="ts" setup>
import { Message } from '@arco-design/web-vue'
import { open } from '@tauri-apps/api/dialog'
import { readBinaryFile } from '@tauri-apps/api/fs'

const emits = defineEmits(['update:buffer', 'update:fileName'])

const { loading, setLoading } = useLoading(false)

async function openFile() {
  try {
    setLoading(true)
    const selected = await open({
      multiple: false,
      filters: [{
        name: 'shapefile',
        extensions: ['shp'],
      }],
    })
    if (selected === null) {
      Message.warning('未选择文件')
    }
    else {
      const contents = await readBinaryFile(selected as string)
      const fileName = getFileNameFromPath(selected as string)
      emits('update:buffer', contents)
      emits('update:fileName', fileName)
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
