<template>
  <div
    class="draggable-file"
    draggable="true"
    @dragstart.prevent.stop="onDragStart"
  >
    <img
      draggable="false"
      class="draggable-file-image"
      :src="dragAndDropPayload.thumbUrl"
    >
  </div>
</template>

<script setup lang="ts">
import celtra, { type DragAndDropPayload } from '@celtra/eagle-extensions-sdk'

const props = defineProps<{
    dragAndDropPayload: DragAndDropPayload
}>()

async function onDragStart (event: DragEvent) {
    if (event.dataTransfer) {
        celtra.setDragAndDrop(event, [props.dragAndDropPayload])
    }
}
</script>

<style scoped>
.draggable-file {
    margin: 16px 0px;
    width: 100px;
    height: 100px;
    cursor: pointer;
    border: 2px solid grey;
}

.draggable-file-image {
   width: 100%;
   height: 100%;
   object-fit: contain;
}
</style>
